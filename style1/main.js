(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const doorData = (() => {
    const el = document.getElementById("door-data");
    try { return JSON.parse(el.textContent); } catch { return {}; }
  })();

  /* Theme + pull bounce */
  const pull = document.querySelector(".theme-pull");
  const applyTheme = (theme) => {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    const dark = theme === "dark";
    pull?.setAttribute("aria-pressed", dark ? "true" : "false");
    pull?.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#121310" : "#f3eee6");
  };
  applyTheme(localStorage.getItem("style1-theme") === "dark" ? "dark" : "light");
  const knob = document.querySelector(".theme-knob");
  const toggleTheme = () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("style1-theme", next);
    if (!reduce) {
      pull?.classList.add("is-pulling");
      window.setTimeout(() => pull?.classList.remove("is-pulling"), 560);
    }
    applyTheme(next);
  };
  knob?.addEventListener("click", toggleTheme);
  pull?.addEventListener("click", (e) => { if (e.target === pull) toggleTheme(); });

  /* Local time */
  const timeEl = document.getElementById("local-time");
  const dateEl = document.getElementById("local-date");
  const tick = () => {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: true,
    }).format(now).toLowerCase().replace(" ", "");
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/New_York", day: "numeric", month: "long", year: "numeric",
    }).formatToParts(now);
    const get = (t) => parts.find((p) => p.type === t)?.value || "";
    const date = `${get("day")} ${get("month")}, ${get("year")}`;
    if (timeEl) { timeEl.textContent = time; timeEl.dateTime = now.toISOString(); }
    if (dateEl) dateEl.textContent = date;
  };
  tick();
  setInterval(tick, 30000);

  /* Mobile menu */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const closeNav = () => { nav?.classList.remove("is-open"); toggle?.setAttribute("aria-expanded", "false"); };
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  /* Notepad rings + role flip */
  const rings = document.querySelector(".notepad-rings");
  if (rings) {
    rings.innerHTML = "";
    for (let i = 0; i < 9; i++) rings.appendChild(document.createElement("span"));
  }
  const roleEl = document.querySelector(".role-text");
  const indexEl = document.querySelector(".role-index");
  const pageEl = document.querySelector(".notepad-page");
  if (roleEl) {
    let roles = [];
    try { roles = JSON.parse(roleEl.getAttribute("data-roles") || "[]"); } catch { roles = []; }
    roles = roles.map((r) => String(r).replace(/&amp;/g, "&"));
    let i = 0;
    const show = () => {
      roleEl.textContent = roles[i] || "";
      if (indexEl) indexEl.textContent = String(i + 1).padStart(2, "0");
    };
    show();
    if (roles.length > 1 && !reduce) {
      setInterval(() => {
        i = (i + 1) % roles.length;
        pageEl?.classList.remove("is-flip");
        void pageEl?.offsetWidth;
        pageEl?.classList.add("is-flip");
        window.setTimeout(show, 280);
      }, 3400);
    }
  }

  /* Doors carousel + row */
  const keys = ["inventing", "sales", "speaking", "awards", "projects"];
  let current = 0;
  const windowEl = document.querySelector("[data-carousel]");
  const doors = [...(windowEl?.querySelectorAll(".door") || [])];
  const row = document.querySelector("[data-door-row]");
  const titleEl = document.querySelector("[data-detail-title]");
  const kickerEl = document.querySelector("[data-detail-kicker]");
  const listEl = document.querySelector("[data-detail-list]");

  const fillCopy = (key) => {
    const data = doorData[key];
    if (!data) return;
    if (titleEl) titleEl.textContent = data.title;
    if (kickerEl) kickerEl.textContent = data.kicker;
    if (listEl) {
      listEl.innerHTML = "";
      data.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        listEl.appendChild(li);
      });
    }
  };

  const layoutDoors = () => {
    doors.forEach((d, i) => {
      d.classList.remove("is-active", "is-side-l", "is-side-r", "is-off");
      const n = keys.length;
      const rel = (i - current + n) % n;
      if (rel === 0) d.classList.add("is-active");
      else if (rel === n - 1) d.classList.add("is-side-l");
      else if (rel === 1) d.classList.add("is-side-r");
      else d.classList.add("is-off");
      d.setAttribute("aria-expanded", rel === 0 ? "true" : "false");
    });
    fillCopy(keys[current]);
  };

  if (row && doors.length) {
    row.innerHTML = "";
    doors.forEach((d, i) => {
      const clone = d.cloneNode(true);
      clone.className = "door";
      clone.addEventListener("click", () => enterDoor(keys[i]));
      row.appendChild(clone);
    });
  }

  const go = (dir) => {
    current = (current + dir + keys.length) % keys.length;
    layoutDoors();
  };
  document.querySelector(".carousel-btn.prev")?.addEventListener("click", () => go(-1));
  document.querySelector(".carousel-btn.next")?.addEventListener("click", () => go(1));
  doors.forEach((d, i) => {
    d.addEventListener("click", () => {
      if (i === current) enterDoor(keys[i]);
      else { current = i; layoutDoors(); }
    });
  });
  layoutDoors();

  /* Zoom + door pages */
  const zoom = document.querySelector("[data-zoom]");
  const zoomDoor = document.querySelector(".zoom-door");
  const page = document.querySelector("[data-door-page]");
  const pageCards = document.querySelector("[data-page-cards]");

  const monitorHTML = (card) => {
    if (card.img) {
      return `<figure class="monitor">
        <div class="monitor-screen"><img src="${card.img}" alt="${card.imgAlt || ""}" width="1280" height="800"></div>
        <div class="monitor-stand" aria-hidden="true"></div>
        <div class="monitor-base" aria-hidden="true"></div>
      </figure>`;
    }
    const m = card.mono || {};
    return `<figure class="monitor">
      <div class="monitor-screen typographic">
        <p class="mon-kicker">${m.kicker || ""}</p>
        <p class="mon-title">${m.title || card.title}</p>
        <p class="mon-body">${m.body || ""}</p>
      </div>
      <div class="monitor-stand" aria-hidden="true"></div>
      <div class="monitor-base" aria-hidden="true"></div>
    </figure>`;
  };

  const renderPage = (key) => {
    const data = doorData[key];
    if (!data || !page) return;
    document.querySelector("[data-page-kicker]").textContent = data.kicker;
    document.querySelector("[data-page-title]").textContent = data.title;
    document.querySelector("[data-page-intro]").textContent = data.intro;
    pageCards.innerHTML = "";
    (data.cards || []).forEach((card) => {
      const art = document.createElement("article");
      art.className = "page-card" + (card.reverse ? " is-reverse" : "");
      const chips = (card.chips || []).map((c) => `<li>${c}</li>`).join("");
      const ext = card.noteHref && card.noteHref.startsWith("http");
      const note = card.noteHref
        ? `<p class="card-note">• <a href="${card.noteHref}"${ext ? ' rel="noopener noreferrer" target="_blank"' : ""}>${card.note}</a></p>`
        : (card.note ? `<p class="card-note">• ${card.note}</p>` : "");
      art.innerHTML = `
        <div class="card-copy">
          <p class="card-tag">${card.tag || ""}</p>
          <h3>${card.title}</h3>
          <p class="card-sub">${card.sub || ""}</p>
          <p class="body">${card.body || ""}</p>
          <ul class="chips">${chips}</ul>
          ${note}
        </div>
        ${monitorHTML(card)}`;
      pageCards.appendChild(art);
    });
  };

  
  const centerOnHandle = (host, scale, withMotion) => {
    const handle = host.querySelector(".door-handle");
    if (!handle) return;
    host.style.transition = "none";
    host.style.transform = "none";
    void host.offsetWidth;
    if (withMotion) host.style.transition = "transform 1.05s cubic-bezier(.4,0,.2,1), opacity .4s ease";
    const hr = handle.getBoundingClientRect();
    const wr = host.getBoundingClientRect();
    const hx = hr.left + hr.width * 0.12;
    const hy = hr.top + hr.height / 2;
    const ox = hx - wr.left;
    const oy = hy - wr.top;
    host.style.transformOrigin = `${ox}px ${oy}px`;
    const tx = window.innerWidth / 2 - hx;
    const ty = window.innerHeight / 2 - hy;
    host.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };
  window.midZoom = (key, scale) => {
    const data = doorData[key];
    if (!data) return;
    zoomDoor.style.cssText = "";
    zoomDoor.style.setProperty("--door", data.color);
    zoomDoor.innerHTML = `<span class="door-frame"><span class="door-leaf"><span class="door-ribs"></span><span class="door-plate"></span><span class="door-handle"></span><span class="door-keyhole"></span></span></span>`;
    zoomDoor.querySelector(".door-plate").textContent = data.plate;
    zoom.hidden = false;
    zoom.classList.remove("is-pushing", "is-fade");
    zoom.setAttribute("aria-hidden", "false");
    centerOnHandle(zoomDoor, 1, false);
    zoomDoor.style.transition = "none";
    centerOnHandle(zoomDoor, scale || 4.4, false);
  };

  function enterDoor(key) {
    const data = doorData[key];
    if (!data) return;
    const idx = keys.indexOf(key);
    if (idx >= 0) { current = idx; layoutDoors(); }
    const paint = (host) => {
      host.innerHTML = "";
      host.style.setProperty("--door", data.color);
      host.innerHTML = `<span class="door-frame"><span class="door-leaf"><span class="door-ribs"></span><span class="door-plate"></span><span class="door-handle"></span><span class="door-keyhole"></span></span></span>`;
      host.querySelector(".door-plate").textContent = data.plate;
    };
    renderPage(key);
    const finish = () => {
      zoom.hidden = true;
      zoom.classList.remove("is-pushing", "is-fade");
      zoom.setAttribute("aria-hidden", "true");
      zoomDoor.style.transform = "";
      zoomDoor.style.transition = "";
      page.hidden = false;
      page.scrollTop = 0;
      document.querySelectorAll(".site-nav a[aria-current]").forEach((a) => a.removeAttribute("aria-current"));
      document.querySelector(`.site-nav a[data-open-door="${key}"]`)?.setAttribute("aria-current", "page");
    };
    if (reduce) { finish(); return; }
    paint(zoomDoor);
    zoom.hidden = false;
    zoom.setAttribute("aria-hidden", "false");
    centerOnHandle(zoomDoor, 1, false);
    void zoomDoor.offsetWidth;
    requestAnimationFrame(() => {
      zoom.classList.add("is-pushing");
      centerOnHandle(zoomDoor, 10.5, true);
    });
    window.setTimeout(() => zoom.classList.add("is-fade"), 720);
    window.setTimeout(finish, 1100);
  }

  document.querySelector("[data-enter]")?.addEventListener("click", () => enterDoor(keys[current]));
  document.querySelector(".back-to-doors")?.addEventListener("click", () => {
    page.hidden = true;
    document.querySelectorAll(".site-nav a[aria-current]").forEach((a) => a.removeAttribute("aria-current"));
    document.getElementById("doors")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
  document.querySelectorAll("[data-open-door]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const key = a.getAttribute("data-open-door");
      if (!key || !doorData[key]) return;
      e.preventDefault();
      closeNav();
      enterDoor(key);
    });
  });
  window.enterDoor = enterDoor; // for QA screenshots

  /* Timeline */
  const yearEl = document.querySelector("[data-story-year]");
  const rangeEl = document.querySelector("[data-story-range]");
  const indexStory = document.querySelector("[data-story-index]");
  const totalStory = document.querySelector("[data-story-total]");
  const bar = document.querySelector(".story-progress-bar");
  const entries = [...document.querySelectorAll(".entry")];
  const years = [...new Set(entries.map((e) => e.dataset.year))];
  if (totalStory) totalStory.textContent = String(years.length).padStart(2, "0");

  const setYear = (entry) => {
    if (!entry) return;
    entries.forEach((e) => e.classList.toggle("is-active", e === entry));
    const nextYear = entry.dataset.year;
    if (yearEl && yearEl.textContent !== nextYear) {
      yearEl.textContent = nextYear;
      if (!reduce) {
        yearEl.classList.remove("is-flip");
        void yearEl.offsetWidth;
        yearEl.classList.add("is-flip");
      }
    }
    if (rangeEl) rangeEl.textContent = entry.dataset.range || "";
    const yi = years.indexOf(entry.dataset.year);
    if (indexStory && yi >= 0) indexStory.textContent = String(yi + 1).padStart(2, "0");
    if (bar && years.length) bar.style.width = `${((yi + 1) / years.length) * 100}%`;
  };
  if (entries[0]) setYear(entries[0]);
  const pickEntry = () => {
    if (!entries.length) return;
    const line = window.innerHeight * 0.30;
    let chosen = entries[0];
    for (const e of entries) {
      if (e.getBoundingClientRect().top < line + 48) chosen = e;
    }
    setYear(chosen);
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { pickEntry(); ticking = false; });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Dust particles */
  const canvas = document.querySelector(".dust");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    };
    resize();
    window.addEventListener("resize", resize);
    const count = window.innerWidth < 700 ? 28 : 56;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.6 + 0.4,
        s: Math.random() * 0.08 + 0.02,
        a: Math.random() * 0.35 + 0.08,
        drift: Math.random() * 0.04 - 0.02,
      });
    }
    const tickDust = () => {
      const { width: w, height: h } = canvas;
      if (!w || !h) { requestAnimationFrame(tickDust); return; }
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.s / 100;
        p.x += p.drift / 100;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        ctx.beginPath();
        const glow = p.x < 0.45 ? 1.25 : 0.7;
        ctx.fillStyle = `rgba(236, 214, 150, ${Math.min(0.55, p.a * glow)})`;
        ctx.arc(p.x * w, p.y * h, p.r * (p.x < 0.45 ? 1.15 : 1), 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tickDust);
    };
    requestAnimationFrame(tickDust);
  }

  /* Nav current — section links only; area links are current on their door page */
  const sectionLinks = {
    top: document.querySelector('.site-nav a[href="#top"]'),
    doors: null,
    story: document.querySelector('.site-nav a[href="#story"]'),
    connect: document.querySelector('.site-nav a[href="#connect"]'),
  };
  const areaLinks = [...document.querySelectorAll(".site-nav a[data-open-door]")];
  const clearCurrent = () => {
    document.querySelectorAll(".site-nav a[aria-current]").forEach((a) => a.removeAttribute("aria-current"));
  };
  const markSection = (id) => {
    if (!page?.hidden) return;
    clearCurrent();
    sectionLinks[id]?.setAttribute("aria-current", "page");
  };
  const sections = ["top", "story", "connect", "doors"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver((obs) => {
      obs.forEach((o) => {
        if (!o.isIntersecting) return;
        markSection(o.target.id);
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => sio.observe(s));
  }
})();
