import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

const MAX_CONCURRENT = 2;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const queue = [];
let inFlight = 0;

function enqueue(task) {
  return new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject });
    pump();
  });
}

function pump() {
  while (inFlight < MAX_CONCURRENT && queue.length) {
    const job = queue.shift();
    inFlight += 1;
    Promise.resolve()
      .then(job.task)
      .then(job.resolve, job.reject)
      .finally(() => {
        inFlight -= 1;
        pump();
      });
  }
}

function loadSTL(url) {
  return enqueue(
    () =>
      new Promise((resolve, reject) => {
        const loader = new STLLoader();
        loader.load(url, resolve, undefined, reject);
      })
  );
}

function filenameFromPath(path) {
  const parts = String(path).split("/");
  return parts[parts.length - 1] || "model.stl";
}

function groupModels(models) {
  const groups = [];
  const index = new Map();
  for (const model of models) {
    const key = model.group || "";
    if (!index.has(key)) {
      const group = { name: key, models: [] };
      index.set(key, group);
      groups.push(group);
    }
    index.get(key).models.push(model);
  }
  return groups;
}

function renderGallery(models) {
  const root = document.getElementById("gallery");
  root.innerHTML = "";

  if (!models.length) {
    root.innerHTML = '<p class="status">No models listed yet.</p>';
    return;
  }

  const groups = groupModels(models);
  const previewEls = [];

  for (const group of groups) {
    const section = document.createElement("section");
    section.className = "group";
    if (group.name) {
      const heading = document.createElement("h2");
      heading.className = "group-title";
      heading.textContent = group.name;
      section.appendChild(heading);
    }

    const grid = document.createElement("div");
    grid.className = "grid";

    for (const model of group.models) {
      if (!model.name || !model.file) continue;
      const card = document.createElement("article");
      card.className = "card";

      const body = document.createElement("div");
      body.className = "card-body";
      if (group.name) {
        const kicker = document.createElement("p");
        kicker.className = "card-kicker";
        kicker.textContent = group.name;
        body.appendChild(kicker);
      }
      const title = document.createElement("h2");
      title.textContent = model.name;
      body.appendChild(title);
      if (model.description) {
        const desc = document.createElement("p");
        desc.className = "desc";
        desc.textContent = model.description;
        body.appendChild(desc);
      }

      const preview = document.createElement("div");
      preview.className = "preview";
      preview.dataset.src = model.preview || model.file;
      preview.setAttribute("role", "img");
      preview.setAttribute("aria-label", `Interactive 3D preview of ${model.name}`);
      const status = document.createElement("div");
      status.className = "preview-status";
      status.textContent = "Preview will load when visible";
      preview.appendChild(status);

      const actions = document.createElement("div");
      actions.className = "card-actions";
      const download = document.createElement("a");
      download.className = "download";
      download.href = model.file;
      download.setAttribute("download", filenameFromPath(model.file));
      download.textContent = "Download STL";
      actions.appendChild(download);

      card.append(body, preview, actions);
      grid.appendChild(card);
      previewEls.push(preview);
    }

    section.appendChild(grid);
    root.appendChild(section);
  }

  observePreviews(previewEls);
}

function fitCamera(camera, controls, object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z, 1);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const dist = ((maxDim / 2) / Math.tan(fov / 2)) * 1.7;

  camera.position.set(dist * 0.85, dist * 0.62, dist * 0.95);
  camera.near = Math.max(dist / 120, 0.01);
  camera.far = dist * 80;
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  controls.minDistance = dist * 0.35;
  controls.maxDistance = dist * 5;
  controls.update();
}

function createViewer(el, url) {
  const status = el.querySelector(".preview-status");
  const setStatus = (text) => {
    if (!status) return;
    status.textContent = text || "";
    status.hidden = !text;
  };

  if (!window.WebGLRenderingContext) {
    setStatus("3D preview isn’t available in this browser");
    return;
  }

  setStatus("Loading preview…");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x1a2d4d, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.2;
  controls.enablePan = false;

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  scene.add(new THREE.HemisphereLight(0xf3efe6, 0x3a4a60, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(2.2, 3.2, 2.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8e4f5, 0.45);
  fill.position.set(-2.5, 0.6, -1.2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff3d0, 0.35);
  rim.position.set(-0.5, 2.5, -2.2);
  scene.add(rim);

  const material = new THREE.MeshStandardMaterial({
    color: 0xd8d0c4,
    roughness: 0.52,
    metalness: 0.08,
  });

  let running = false;
  let raf = 0;

  const resize = () => {
    const width = el.clientWidth || 320;
    const height = el.clientHeight || 320;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const tick = () => {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    tick();
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  loadSTL(url)
    .then((geometry) => {
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material);
      // STLs are typically Z-up; three.js is Y-up.
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
      fitCamera(camera, controls, mesh);
      setStatus("");
      if (el.dataset.visible === "1") start();
      renderer.render(scene, camera);
    })
    .catch((err) => {
      console.error("Failed to load STL", url, err);
      setStatus("Preview couldn’t load");
    });

  el._viewer = { start, stop, resize };
}

function observePreviews(els) {
  if (!("IntersectionObserver" in window)) {
    for (const el of els) {
      el.dataset.visible = "1";
      createViewer(el, el.dataset.src);
      el._viewer?.start();
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const visible = entry.isIntersecting;
        el.dataset.visible = visible ? "1" : "0";
        if (visible && !el._viewer) {
          createViewer(el, el.dataset.src);
        }
        if (el._viewer) {
          if (visible) el._viewer.start();
          else el._viewer.stop();
        }
      }
    },
    { rootMargin: "120px 0px", threshold: 0.15 }
  );

  for (const el of els) observer.observe(el);
}

async function init() {
  const root = document.getElementById("gallery");
  try {
    const res = await fetch("models.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`models.json returned ${res.status}`);
    const data = await res.json();
    const models = Array.isArray(data) ? data : data.models || [];
    renderGallery(models);
  } catch (err) {
    console.error(err);
    root.innerHTML = '<p class="error">The model list couldn’t be loaded.</p>';
  }
}

init();
