import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

const MAX_CONCURRENT = 2;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let previewEls = [];
let holdPreviews = false;
let holdTimer = 0;

function whenScrollSettles(callback) {
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", done);
    clearTimeout(holdTimer);
    callback();
  };
  const onScroll = () => {
    clearTimeout(holdTimer);
    holdTimer = window.setTimeout(done, 140);
  };
  window.addEventListener("scrollend", done, { once: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  holdTimer = window.setTimeout(done, reduceMotion ? 50 : 900);
}

function setPreviewHold(on) {
  holdPreviews = on;
  if (on) return;
  for (const el of previewEls) {
    if (el.dataset.visible === "1") {
      if (!el._viewer) createViewer(el, el.dataset.src);
      el._viewer?.start();
    }
  }
}

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
      const group = { name: key, models: [], attribution: null, note: null, extras: null };
      index.set(key, group);
      groups.push(group);
    }
    const group = index.get(key);
    group.models.push(model);
    if (!group.attribution && model.attribution) {
      group.attribution = model.attribution;
    }
    if (!group.note && model.groupNote) {
      group.note = model.groupNote;
    }
    if (!group.extras && Array.isArray(model.groupExtras) && model.groupExtras.length) {
      group.extras = model.groupExtras;
    }
  }
  return groups;
}

function appendText(node, text) {
  node.appendChild(document.createTextNode(text));
}

function creditLink(href, label) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function renderCredit(attr) {
  const p = document.createElement("p");
  p.className = "group-credit";
  if (attr.creator) {
    appendText(p, "By ");
    if (attr.creatorUrl) p.appendChild(creditLink(attr.creatorUrl, attr.creator));
    else appendText(p, attr.creator);
  }
  if (attr.sourceUrl) {
    appendText(p, p.childNodes.length ? " on " : "On ");
    p.appendChild(creditLink(attr.sourceUrl, attr.source || "Thingiverse"));
  }
  if (attr.license) {
    appendText(p, ". Licensed under " + attr.license + ".");
  }
  return p;
}


function slugify(name) {
  const slug = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

function uniqueSlug(name, used) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

let navTeardown = null;

function setNavOpen(open) {
  const nav = document.getElementById("section-nav");
  const toggle = document.getElementById("section-nav-toggle");
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function isMobileNav() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function bindSectionNav(sections) {
  if (navTeardown) {
    navTeardown();
    navTeardown = null;
  }

  const nav = document.getElementById("section-nav");
  const list = document.getElementById("section-nav-list");
  const toggle = document.getElementById("section-nav-toggle");
  if (!nav || !list || !sections.length) {
    nav?.setAttribute("hidden", "");
    return;
  }

  list.innerHTML = "";
  const links = new Map();
  for (const section of sections) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${section.id}`;
    a.textContent = section.name;
    const count = document.createElement("span");
    count.className = "section-nav-count";
    count.textContent = String(section.count);
    a.appendChild(count);
    li.appendChild(a);
    list.appendChild(li);
    links.set(section.id, a);
  }
  nav.hidden = false;

  const setActive = (id, { scrollNav = true } = {}) => {
    for (const [sid, link] of links) {
      const on = sid === id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
      if (on && scrollNav) {
        link.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  };

  let ignoreSpyUntil = 0;
  const onNavClick = (event) => {
    const link = event.target.closest("a");
    if (!link || !list.contains(link)) return;
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const id = decodeURIComponent(href.slice(1));
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (isMobileNav()) setNavOpen(false);
    ignoreSpyUntil = Date.now() + 1200;
    setActive(id);
    history.pushState(null, "", `#${id}`);
    setPreviewHold(true);
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    whenScrollSettles(() => {
      ignoreSpyUntil = 0;
      setPreviewHold(false);
    });
  };
  list.addEventListener("click", onNavClick);

  const onToggle = (event) => {
    event.preventDefault();
    setNavOpen(!nav.classList.contains("is-open"));
  };
  toggle?.addEventListener("click", onToggle);

  const onDocPointer = (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target)) setNavOpen(false);
  };
  document.addEventListener("pointerdown", onDocPointer);

  const onKey = (event) => {
    if (event.key === "Escape") setNavOpen(false);
  };
  document.addEventListener("keydown", onKey);

  const onResize = () => {
    if (!isMobileNav()) setNavOpen(false);
  };
  window.addEventListener("resize", onResize);

  const ratios = new Map();
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      if (Date.now() < ignoreSpyUntil) return;
      let bestId = null;
      let bestRatio = 0;
      let bestTop = Infinity;
      const offset = (document.querySelector(".bar")?.getBoundingClientRect().height || 62) + 8;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        const ratio = ratios.get(section.id) || 0;
        if (!el || ratio <= 0) continue;
        const top = Math.abs(el.getBoundingClientRect().top - offset);
        if (ratio > bestRatio + 0.02 || (Math.abs(ratio - bestRatio) <= 0.02 && top < bestTop)) {
          bestId = section.id;
          bestRatio = ratio;
          bestTop = top;
        }
      }
      if (bestId) setActive(bestId);
    },
    {
      rootMargin: "-15% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );
  for (const section of sections) {
    const el = document.getElementById(section.id);
    if (el) spy.observe(el);
  }

  const applyHash = () => {
    const raw = location.hash.replace(/^#/, "");
    if (!raw) return;
    let id = raw;
    try { id = decodeURIComponent(raw); } catch {}
    const target = document.getElementById(id);
    if (!target) return;
    ignoreSpyUntil = Date.now() + 700;
    setActive(id, { scrollNav: true });
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  };
  window.addEventListener("hashchange", applyHash);
  applyHash();
  if (!location.hash && sections[0]) setActive(sections[0].id, { scrollNav: false });

  navTeardown = () => {
    list.removeEventListener("click", onNavClick);
    toggle?.removeEventListener("click", onToggle);
    document.removeEventListener("pointerdown", onDocPointer);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("hashchange", applyHash);
    spy.disconnect();
    setNavOpen(false);
  };
}

function renderGallery(models) {
  const root = document.getElementById("gallery");
  root.innerHTML = "";

  if (!models.length) {
    root.innerHTML = '<p class="status">No models listed yet.</p>';
    return;
  }

  const groups = groupModels(models);
  previewEls = [];
  const usedSlugs = new Set();
  const navSections = [];

  for (const group of groups) {
    const section = document.createElement("section");
    section.className = "group";
    if (group.name) {
      const slug = uniqueSlug(group.name, usedSlugs);
      section.id = slug;
      const heading = document.createElement("h2");
      heading.className = "group-title";
      heading.textContent = group.name;
      section.appendChild(heading);
      navSections.push({ id: slug, name: group.name, count: group.models.filter((m) => m.name && m.file).length });
    }
    if (group.attribution) {
      section.appendChild(renderCredit(group.attribution));
    }
    if (group.note) {
      const note = document.createElement("p");
      note.className = "group-note";
      note.textContent = group.note;
      section.appendChild(note);
    }
    if (group.extras) {
      const extrasWrap = document.createElement("div");
      extrasWrap.className = "group-extras";
      for (const extra of group.extras) {
        if (!extra || !extra.file) continue;
        const link = document.createElement("a");
        link.className = "group-extra";
        link.href = extra.file;
        link.setAttribute("download", filenameFromPath(extra.file));
        link.textContent = extra.label || "Download";
        extrasWrap.appendChild(link);
      }
      if (extrasWrap.childNodes.length) section.appendChild(extrasWrap);
    }

    let grid = null;
    let currentSubgroup = null;

    for (const model of group.models) {
      if (!model.name || !model.file) continue;
      const subgroup = model.subgroup || "";
      if (!grid || subgroup !== currentSubgroup) {
        if (grid) section.appendChild(grid);
        if (subgroup) {
          const subhead = document.createElement("h3");
          subhead.className = "subgroup-title";
          subhead.textContent = subgroup;
          section.appendChild(subhead);
        }
        grid = document.createElement("div");
        grid.className = "grid";
        currentSubgroup = subgroup;
      }
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
      const mainLabel = model.downloadLabel || (String(model.file).toLowerCase().endsWith(".stl") ? "Download STL" : "Download");
      download.textContent = mainLabel;
      actions.appendChild(download);
      const extras = Array.isArray(model.extras) ? model.extras : [];
      for (const extra of extras) {
        if (!extra || !extra.file) continue;
        const link = document.createElement("a");
        link.className = "download secondary";
        link.href = extra.file;
        link.setAttribute("download", filenameFromPath(extra.file));
        link.textContent = extra.label || "Download";
        actions.appendChild(link);
      }

      card.append(body, preview, actions);
      grid.appendChild(card);
      previewEls.push(preview);
    }

    if (grid) section.appendChild(grid);
    root.appendChild(section);
  }

  observePreviews(previewEls);
  bindSectionNav(navSections);
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
  let disposed = false;
  let geometryRef = null;

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

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop();
    ro.disconnect();
    if (geometryRef) geometryRef.dispose();
    material.dispose();
    controls.dispose();
    renderer.dispose();
    if (typeof renderer.forceContextLoss === "function") renderer.forceContextLoss();
    canvas.remove();
    el._viewer = null;
    setStatus("Preview will load when visible");
  };

  loadSTL(url)
    .then((geometry) => {
      if (disposed) {
        geometry.dispose();
        return;
      }
      geometry.computeVertexNormals();
      geometryRef = geometry;
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
      if (disposed) return;
      console.error("Failed to load STL", url, err);
      setStatus("Preview couldn’t load");
    });

  el._viewer = { start, stop, resize, dispose };
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
        if (visible && !el._viewer && !holdPreviews) {
          createViewer(el, el.dataset.src);
        }
        if (el._viewer) {
          if (visible && !holdPreviews) el._viewer.start();
          else if (!visible) el._viewer.dispose();
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

export { init };
