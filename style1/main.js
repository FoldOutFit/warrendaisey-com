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

  /* Doors: hover/focus selects and swings; click opens the area page.
     On touch, the first tap selects; a second tap on the same door opens the page. */
  let doorData = {};
  const doorTpl = document.getElementById("door-data");
  const dataScript = doorTpl && (doorTpl.tagName === "SCRIPT"
    ? doorTpl
    : (doorTpl.content ? doorTpl.content.querySelector("script") : doorTpl.querySelector("script")));
  if (dataScript) {
    try { doorData = JSON.parse(dataScript.textContent); } catch (e) { console.warn(e); }
  }

  const row = document.querySelector("[data-doors]");
  const doors = [...(row?.querySelectorAll(".door") || [])];
  const preview = document.querySelector("[data-door-preview]");
  const page = document.querySelector("[data-door-page]");
  const pageCards = document.querySelector("[data-page-cards]");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let selectedKey = null;
  let lastPointer = "mouse";
  let selectedAtPointerDown = null;
  document.addEventListener("pointerdown", (e) => {
    lastPointer = e.pointerType || "mouse";
    selectedAtPointerDown = selectedKey;
  }, true);

  const fillList = (ul, items) => {
    ul.innerHTML = "";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  };

  const panelHTML = (data) => {
    const ul = document.createElement("ul");
    fillList(ul, data.items);
    const kicker = document.createElement("p");
    kicker.className = "detail-kicker";
    kicker.textContent = data.kicker || "";
    const title = document.createElement("h3");
    title.textContent = data.title || "";
    const wrap = document.createDocumentFragment();
    wrap.append(kicker, title, ul);
    return wrap;
  };

  doors.forEach((btn) => {
    const key = btn.dataset.door;
    const data = doorData[key];
    if (!data) return;
    const interior = btn.querySelector(".door-interior");
    if (interior) {
      const k = interior.querySelector(".interior-kicker");
      const tEl = interior.querySelector(".interior-title");
      const list = interior.querySelector(".interior-list");
      if (k) k.textContent = data.kicker || "";
      if (tEl) tEl.textContent = data.title || "";
      if (list) fillList(list, data.items);
    }
    const panel = document.querySelector(`[data-door-panel="${key}"]`);
    if (panel) {
      panel.innerHTML = "";
      panel.append(panelHTML(data));
    }
  });

  const selectDoor = (key) => {
    selectedKey = key;
    doors.forEach((btn) => {
      const on = btn.dataset.door === key;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      btn.closest(".door-cell")?.classList.toggle("is-selected", on);
      const panel = document.querySelector(`[data-door-panel="${btn.dataset.door}"]`);
      if (panel) panel.hidden = !on;
    });
    const data = doorData[key];
    if (preview) {
      if (!data) {
        preview.hidden = true;
        preview.innerHTML = "";
      } else {
        preview.hidden = false;
        preview.innerHTML = "";
        preview.append(panelHTML(data));
      }
    }
  };

  const monitorHTML = (card) => {
    const fig = document.createElement("figure");
    fig.className = "monitor";
    const screen = document.createElement("div");
    if (card.img) {
      screen.className = "monitor-screen";
      const img = document.createElement("img");
      img.src = card.img;
      img.alt = card.imgAlt || "";
      img.width = 1280;
      img.height = 800;
      screen.appendChild(img);
    } else {
      const m = card.mono || {};
      screen.className = "monitor-screen typographic";
      screen.innerHTML = `<p class="mon-kicker"></p><p class="mon-title"></p><p class="mon-body"></p>`;
      screen.querySelector(".mon-kicker").textContent = m.kicker || "";
      screen.querySelector(".mon-title").textContent = m.title || "";
      screen.querySelector(".mon-body").textContent = m.body || "";
    }
    fig.appendChild(screen);
    const stand = document.createElement("div");
    stand.className = "monitor-stand";
    stand.setAttribute("aria-hidden", "true");
    const base = document.createElement("div");
    base.className = "monitor-base";
    base.setAttribute("aria-hidden", "true");
    fig.append(stand, base);
    return fig;
  };

  const closePage = () => {
    if (!page) return;
    page.hidden = true;
    document.body.classList.remove("door-open");
    document.getElementById("doors")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const openPage = (key) => {
    const data = doorData[key];
    if (!data || !page) return;
    selectDoor(key);
    document.querySelector("[data-page-kicker]").textContent = data.kicker || "";
    document.querySelector("[data-page-title]").textContent = data.title || "";
    document.querySelector("[data-page-intro]").textContent = data.intro || "";
    pageCards.innerHTML = "";
    (data.cards || []).forEach((card) => {
      const art = document.createElement("article");
      art.className = "page-card" + (card.reverse ? " is-reverse" : "");
      const copy = document.createElement("div");
      copy.className = "card-copy";
      const tag = document.createElement("p");
      tag.className = "card-tag";
      tag.textContent = card.tag || "";
      const h3 = document.createElement("h3");
      h3.textContent = card.title || "";
      const sub = document.createElement("p");
      sub.className = "card-sub";
      sub.textContent = card.sub || "";
      const body = document.createElement("p");
      body.className = "body";
      body.textContent = card.body || "";
      copy.append(tag, h3, sub, body);
      if (card.chips && card.chips.length) {
        const chips = document.createElement("ul");
        chips.className = "chips";
        card.chips.forEach((c) => {
          const li = document.createElement("li");
          li.textContent = c;
          chips.appendChild(li);
        });
        copy.appendChild(chips);
      }
      if (card.note) {
        const note = document.createElement("p");
        note.className = "card-note";
        if (card.noteHref) {
          note.append("• ");
          const a = document.createElement("a");
          a.href = card.noteHref;
          a.textContent = card.note;
          if (card.noteHref.startsWith("http")) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          note.appendChild(a);
        } else {
          note.textContent = "• " + card.note;
        }
        copy.appendChild(note);
      }
      art.append(copy, monitorHTML(card));
      pageCards.appendChild(art);
    });
    page.hidden = false;
    document.body.classList.add("door-open");
    page.scrollTop = 0;
  };

  doors.forEach((btn) => {
    const key = btn.dataset.door;
    if (canHover) {
      btn.addEventListener("mouseenter", () => selectDoor(key));
    }
    btn.addEventListener("focus", () => selectDoor(key));
    btn.addEventListener("click", (e) => {
      const isTouch = lastPointer === "touch" || !canHover;
      if (isTouch && selectedAtPointerDown !== key) {
        e.preventDefault();
        selectDoor(key);
        return;
      }
      openPage(key);
    });
  });

  document.querySelector(".back-to-doors")?.addEventListener("click", closePage);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && page && !page.hidden) closePage();
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
