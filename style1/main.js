(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme */
  const pull = document.querySelector(".theme-pull");
  const stored = localStorage.getItem("style1-theme");
  const applyTheme = (theme) => {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    const dark = theme === "dark";
    if (pull) {
      pull.setAttribute("aria-pressed", dark ? "true" : "false");
      pull.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#121310" : "#f3eee6");
  };
  applyTheme(stored === "dark" ? "dark" : "light");
  pull?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("style1-theme", next);
    applyTheme(next);
  });

  /* Local time — America/New_York, matching the rest of the site */
  const timeEl = document.getElementById("local-time");
  const dateEl = document.getElementById("local-date");
  const tick = () => {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now).toLowerCase().replace(" ", "");
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/New_York",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
    if (timeEl) {
      timeEl.textContent = time;
      timeEl.dateTime = now.toISOString();
    }
    if (dateEl) dateEl.textContent = date;
  };
  tick();
  setInterval(tick, 30000);

  /* Mobile menu */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  /* Rotating role badge */
  const board = document.querySelector(".role-text");
  const indexEl = document.querySelector(".role-index");
  if (board) {
    let roles = [];
    try { roles = JSON.parse(board.getAttribute("data-roles") || "[]"); } catch { roles = []; }
    roles = roles.map((r) => String(r).replace(/&amp;/g, "&"));
    let i = 0;
    const show = () => {
      board.textContent = roles[i] || "";
      if (indexEl) indexEl.textContent = String(i + 1).padStart(2, "0");
    };
    show();
    if (roles.length > 1 && !reduce) {
      setInterval(() => {
        i = (i + 1) % roles.length;
        board.classList.remove("is-flip");
        void board.offsetWidth;
        board.classList.add("is-flip");
        window.setTimeout(show, 250);
      }, 3200);
    }
  }

  /* Doors */
  let doorData = {};
  const doorTpl = document.getElementById("door-data");
  const dataScript = doorTpl && (doorTpl.content
    ? doorTpl.content.querySelector("script")
    : doorTpl.querySelector("script"));
  if (dataScript) {
    try { doorData = JSON.parse(dataScript.textContent); } catch (e) { console.warn(e); }
  }
  const row = document.querySelector("[data-doors]");
  const detail = document.querySelector("[data-door-detail]");
  const detailDoor = document.querySelector("[data-detail-door]");
  const detailKicker = document.querySelector("[data-detail-kicker]");
  const detailTitle = document.querySelector("[data-detail-title]");
  const detailList = document.querySelector("[data-detail-list]");
  const detailLink = document.querySelector("[data-detail-link]");

  const paintDoor = (host, color, plate) => {
    host.innerHTML = "";
    host.style.setProperty("--door", color);
    const leaf = document.createElement("span");
    leaf.className = "door-leaf";
    leaf.innerHTML = `<span class="door-ribs"></span><span class="door-plate"></span><span class="door-handle"></span>`;
    leaf.querySelector(".door-plate").textContent = plate;
    host.appendChild(leaf);
  };

  const closeDoors = () => {
    if (!detail || !row) return;
    detail.hidden = true;
    row.hidden = false;
    row.querySelectorAll(".door").forEach((b) => b.setAttribute("aria-expanded", "false"));
  };

  const openDoor = (key, btn) => {
    const data = doorData[key];
    if (!data || !detail) return;
    row.hidden = true;
    detail.hidden = false;
    row.querySelectorAll(".door").forEach((b) => b.setAttribute("aria-expanded", b === btn ? "true" : "false"));
    paintDoor(detailDoor, data.color, data.plate);
    detailKicker.textContent = data.kicker;
    detailTitle.textContent = data.title;
    detailList.innerHTML = "";
    data.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailList.appendChild(li);
    });
    detailLink.href = data.href;
    detailLink.childNodes[0].textContent = data.link + " ";
    const target = data.href.startsWith("#") ? "_self" : (data.href.startsWith("http") ? "_blank" : "_self");
    if (target === "_blank") {
      detailLink.target = "_blank";
      detailLink.rel = "noopener noreferrer";
    } else {
      detailLink.removeAttribute("target");
      detailLink.removeAttribute("rel");
    }
    detail.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  row?.querySelectorAll(".door").forEach((btn) => {
    btn.addEventListener("click", () => openDoor(btn.dataset.door, btn));
  });
  document.querySelector(".door-back")?.addEventListener("click", () => {
    closeDoors();
    document.getElementById("doors")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });

  /* Timeline year follows scroll */
  const yearEl = document.querySelector("[data-story-year]");
  const rangeEl = document.querySelector("[data-story-range]");
  const indexStory = document.querySelector("[data-story-index]");
  const totalStory = document.querySelector("[data-story-total]");
  const entries = [...document.querySelectorAll(".entry")];
  const years = [...new Set(entries.map((e) => e.dataset.year))];
  if (totalStory) totalStory.textContent = String(years.length).padStart(2, "0");

  const setYear = (entry) => {
    if (!entry) return;
    entries.forEach((e) => e.classList.toggle("is-active", e === entry));
    if (yearEl) yearEl.textContent = entry.dataset.year;
    if (rangeEl) rangeEl.textContent = entry.dataset.range || "";
    const yi = years.indexOf(entry.dataset.year);
    if (indexStory && yi >= 0) indexStory.textContent = String(yi + 1).padStart(2, "0");
  };
  if (entries[0]) setYear(entries[0]);

  if ("IntersectionObserver" in window && entries.length) {
    const io = new IntersectionObserver((obs) => {
      const visible = obs
        .filter((o) => o.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setYear(visible[0].target);
    }, { rootMargin: "-30% 0px -45% 0px", threshold: 0.1 });
    entries.forEach((e) => io.observe(e));
  }

  /* Current nav section */
  const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver((obs) => {
      obs.forEach((o) => {
        if (!o.isIntersecting) return;
        const id = "#" + o.target.id;
        navLinks.forEach((a) => {
          if (a.getAttribute("href") === id) a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => sio.observe(s));
  }
})();
