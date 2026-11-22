/* style2 gallery — curved hallway, scroll walks forward */
(function () {
  "use strict";

  const ASSET = "assets/";

  const WORKS = [
    // —— Events ——
    {
      id: "ev-rally",
      section: "events",
      title: "APSCUF “Affordable College Now!” rally",
      date: "September 28",
      place: "Pennsylvania Capitol",
      line: "Interviewed twice and appeared on TV at the rally.",
      image: "events-apscuf-rally.webp",
      alt: "Warren Daisey at the Affordable College Now rally, holding a sign with other attendees in front of the Pennsylvania Capitol."
    },
    {
      id: "ev-gruber",
      section: "events",
      title: "Health Care Reform lecture",
      date: "",
      place: "Zeigler College of Business",
      line: "With Dr. Jonathan Gruber.",
      image: "events-gruber-lecture.webp",
      alt: "Warren Daisey standing with Dr. Jonathan Gruber after the Health Care Reform lecture."
    },
    {
      id: "ev-pa-state",
      section: "events",
      title: "Pennsylvania State Speech & Debate Championship",
      date: "2026",
      place: "Pennsylvania",
      line: "Fourth place in Poetry, Dramatic Interp, Prose, and Declamation.",
      image: "events-pa-state-speech.webp",
      alt: "Warren Daisey with teammates at the Pennsylvania State Speech & Debate Championship."
    },
    {
      id: "ev-wilkes",
      section: "events",
      title: "Wilkes University tournament",
      date: "2026",
      place: "Wilkes University",
      line: "First place in Prose, with placements in Declamation, Impromptu, and Poetry.",
      image: "events-wilkes-forensics.webp",
      alt: "Warren Daisey with the Bloomsburg Forensics team at the Wilkes University tournament."
    },
    {
      id: "ev-sunrise",
      section: "events",
      title: "Sunrise Movement",
      date: "January 2025–Present",
      place: "",
      line: "Logistics Coordinator — climate rallies and workshops for 100+ people.",
      image: "events-sunrise.webp",
      alt: "Warren Daisey wearing a Sunrise Movement shirt at an outdoor gathering."
    },
    {
      id: "ev-fbi",
      section: "events",
      title: "FBI New York Field Office visit",
      date: "",
      place: "New York",
      line: "A visit with Pi Sigma Epsilon.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },

    // —— Presenting ——
    {
      id: "pr-fof-poster",
      section: "presenting",
      title: "Fold-Out-Fit at Topics That Matter",
      date: "April 2026",
      place: "Frederick Douglass Institute",
      line: "Group-presented a Fold-Out-Fit poster.",
      image: "presenting-foldoutfit-poster.webp",
      alt: "Warren Daisey standing with a Fold-Out-Fit poster at the Topics That Matter session."
    },
    {
      id: "pr-crs",
      section: "presenting",
      title: "CRS Collegiate Challenge",
      date: "Spring 2026",
      place: "Alzheimer’s Association, DeSales University",
      line: "Second Place Best Presenter.",
      image: "presenting-crs-desales.webp",
      alt: "Warren Daisey at DeSales University for the CRS Collegiate Challenge."
    },
    {
      id: "pr-queer-joy",
      section: "presenting",
      title: "Speak Out Panel “Queer Joy”",
      date: "2026",
      place: "LGBTQA Resource Center, Commonwealth University",
      line: "Panelist.",
      image: "presenting-queer-joy.webp",
      alt: "Warren Daisey with fellow panelists at the Queer Joy Speak Out Panel."
    },
    {
      id: "pr-bent",
      section: "presenting",
      title: "Interviewed about mentor Bill Bent",
      date: "2026",
      place: "",
      line: "On camera, speaking about his mentor.",
      image: "presenting-bill-bent-interview.webp",
      alt: "Warren Daisey being interviewed on camera about his mentor, Bill Bent."
    },
    {
      id: "pr-money101",
      section: "presenting",
      title: "Money 101: The Financial Playbook Every College Student Needs",
      date: "October 28, 2026",
      place: "2026 PASSHE Summit Student Track, Kutztown University",
      line: "A personal finance workshop for college students.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pr-honors",
      section: "presenting",
      title: "Honors College Speak Out Panel",
      date: "October 14, 2026",
      place: "Gender & Sexuality Resource Center, Commonwealth University",
      line: "Panelist.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pr-alumni",
      section: "presenting",
      title: "Alumni Awards Ceremony",
      date: "2026",
      place: "Commonwealth University–Bloomsburg",
      line: "Spoke about Volunteer of the Year honoree Bill Bent ’83.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pr-passhe-2025",
      section: "presenting",
      title: "Unleash Your Uniqueness: Standing Out in a Sea of Sameness",
      date: "October 29–30, 2025",
      place: "PASSHE Summit 2025",
      line: "A personal branding talk.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pr-parenting",
      section: "presenting",
      title: "Parenting with Pride",
      date: "2025",
      place: "",
      line: "Panel with his mom, Sari Daisey.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pr-forensics",
      section: "presenting",
      title: "Bloomsburg Forensics Team",
      date: "September 2024–Present",
      place: "Speech & debate",
      line: "Competes in impromptu, informative, persuasive, prose, poetry, declamation, and parliamentary debate.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },

    // —— Inventions ——
    {
      id: "inv-01",
      section: "inventions",
      no: "No. 01",
      title: "Fold-Out-Fit",
      date: "Patent pending",
      place: "U.S. provisional 64/189,208",
      line: "A carry bag that unfolds into hanging shelves.",
      image: "foldoutfit-open.webp",
      alt: "Fold-Out-Fit prototype, open and hanging, showing three shelves.",
      gallery: [
        { src: "foldoutfit-open.webp", alt: "Fold-Out-Fit prototype open, front view, hanging in a stall." },
        { src: "foldoutfit-open-side.webp", alt: "Fold-Out-Fit prototype open, side view." },
        { src: "foldoutfit-closed.webp", alt: "Fold-Out-Fit prototype closed and hanging from a hook." }
      ]
    },
    { id: "inv-02", section: "inventions", no: "No. 02", title: "Always Heel", line: "Customizable heels with swappable uppers.", empty: "concept" },
    { id: "inv-03", section: "inventions", no: "No. 03", title: "Crib Sleep Wrap", line: "A safer-sleep baby product.", empty: "concept" },
    { id: "inv-04", section: "inventions", no: "No. 04", title: "Pride", line: "A professional dating and community app.", empty: "concept" },
    { id: "inv-05", section: "inventions", no: "No. 05", title: "Dan Knorr Assistant", line: "A calendar, task and email time manager app.", empty: "concept" },
    { id: "inv-06", section: "inventions", no: "No. 06", title: "Linked RGB Room Lights", empty: "concept" },
    { id: "inv-07", section: "inventions", no: "No. 07", title: "Retractable Jump Rope", line: "Tangle-free and portable.", empty: "concept" },
    { id: "inv-08", section: "inventions", no: "No. 08", title: "One-Crack Egg Maker", line: "Easy hard-boiled eggs.", empty: "concept" },
    { id: "inv-09", section: "inventions", no: "No. 09", title: "Fine-Needle Safety Pin", empty: "concept" },
    { id: "inv-10", section: "inventions", no: "No. 10", title: "All-in-One Microwave Bowl", empty: "concept" },
    { id: "inv-11", section: "inventions", no: "No. 11", title: "Buttonless Shower Earbuds", empty: "concept" },
    { id: "inv-12", section: "inventions", no: "No. 12", title: "Easy Bed Maker", empty: "concept" },
    { id: "inv-13", section: "inventions", no: "No. 13", title: "Robot-to-Central Vacuum", empty: "concept" },
    { id: "inv-14", section: "inventions", no: "No. 14", title: "Smart Car Power Adapter", empty: "concept" },
    { id: "inv-15", section: "inventions", no: "No. 15", title: "Affordable Business Card Cutter", empty: "concept" },
    { id: "inv-16", section: "inventions", no: "No. 16", title: "Dorm Room Sink", empty: "concept" },

    // —— Awards ——
    {
      id: "aw-quick",
      section: "awards",
      title: "Quick Pitch Sales Challenge",
      date: "October 15, 2026",
      place: "Susquehanna University, Sigmund Weis School of Business",
      line: "First place (of 65) and $500, across four universities. Sponsored by Fastenal.",
      image: "awards-susquehanna-quick-pitch.webp",
      alt: "Warren Daisey and fellow competitors holding certificates under a Susquehanna University banner."
    },
    {
      id: "aw-husky",
      section: "awards",
      title: "Husky Dog Pound",
      date: "Spring 2026",
      place: "Commonwealth University",
      line: "First place and $3,500 awarded to Fold-Out-Fit.",
      image: "awards-husky-dog-pound.webp",
      alt: "Warren Daisey and others holding a large ceremonial check for first place at Husky Dog Pound."
    },
    {
      id: "aw-nest",
      section: "awards",
      title: "Nest Sales Summit",
      date: "April 2026",
      place: "Saint Joseph’s University",
      line: "First place. An interview-style pitch to corporate partners, with competitors from five universities.",
      empty: "plaque"
    },
    {
      id: "aw-fbla",
      section: "awards",
      title: "PA FBLA Collegiate State Leadership Conference",
      date: "2026",
      place: "Pennsylvania FBLA",
      line: "First place, Foundations of Selling; fourth place, Marketing & Sales Case Competition.",
      empty: "plaque"
    },
    {
      id: "aw-crs",
      section: "awards",
      title: "CRS Collegiate Challenge",
      date: "Spring 2026",
      place: "Alzheimer’s Association, DeSales University",
      line: "Second Place Best Presenter.",
      empty: "plaque"
    },
    {
      id: "aw-cintas",
      section: "awards",
      title: "Commonwealth University Sales Contest",
      date: "October 1–2, 2026",
      place: "Sponsored by Cintas",
      line: "Semi-finalist.",
      empty: "plaque"
    },
    {
      id: "aw-keystone-26",
      section: "awards",
      title: "Keystone Sales Challenge 2026",
      date: "October 2026",
      place: "Pi Sigma Epsilon",
      line: "Semi-finalist.",
      empty: "plaque"
    },
    {
      id: "aw-patti",
      section: "awards",
      title: "Patti Frieda Memorial Invitational",
      date: "November 6–7, 2026",
      place: "Shepherd University",
      line: "Second place, Persuasive Speaking; third place, Prose and Poetry Interpretation. Team first in sweepstakes.",
      empty: "plaque"
    },
    {
      id: "aw-mingus",
      section: "awards",
      title: "John B. Mingus Pan-Interp Award",
      date: "2026",
      place: "Florida Sun and Sand Speech & Debate",
      line: "Year-long excellence in Oral Interpretation, with additional placements in Informative, Declamation, Dramatic Interp, Pentathlon, Prose, Poetry, and Impromptu.",
      empty: "plaque"
    },
    {
      id: "aw-pa-state",
      section: "awards",
      title: "Pennsylvania State Speech & Debate Championship",
      date: "2026",
      place: "",
      line: "Fourth place in Poetry, Dramatic Interp, Prose, and Declamation.",
      empty: "plaque"
    },
    {
      id: "aw-wilkes",
      section: "awards",
      title: "Wilkes University tournament",
      date: "2026",
      place: "Wilkes University",
      line: "First place, Prose; second, Declamation; third, Impromptu; fifth, Poetry.",
      empty: "plaque"
    },
    {
      id: "aw-season",
      section: "awards",
      title: "Forensics season close",
      date: "",
      place: "Bloomsburg Forensics",
      line: "A season of speech and debate, medals in hand.",
      image: "awards-forensics-season-close.webp",
      alt: "Warren Daisey wearing medals at the forensics season close."
    },
    {
      id: "aw-plaque",
      section: "awards",
      title: "Speech & debate award",
      date: "",
      place: "",
      line: "",
      image: "awards-speech-debate-plaque.webp",
      alt: "Warren Daisey and a colleague holding a speech and debate award plaque."
    },
    {
      id: "aw-massanutten",
      section: "awards",
      title: "Informative Speaking, Massanutten VA tournament",
      date: "2025",
      place: "Massanutten, Virginia",
      line: "Year-long award for Informative Speaking.",
      empty: "plaque"
    },
    {
      id: "aw-nationals",
      section: "awards",
      title: "Informative Speaking, with national qualification",
      date: "2025",
      place: "",
      line: "First place, Informative Speaking, and qualified for nationals in multiple events.",
      empty: "plaque"
    },
    {
      id: "aw-t25-places",
      section: "awards",
      title: "Speech & debate tournament",
      date: "2025",
      place: "",
      line: "First place, Informative; second place, Impromptu; third place, Prose and Persuasive.",
      empty: "plaque"
    },
    {
      id: "aw-nfa",
      section: "awards",
      title: "NFA-format tournament",
      date: "2025",
      place: "",
      line: "Placed in Poetry. Fifteen schools competed.",
      empty: "plaque"
    },
    {
      id: "aw-keystone-25",
      section: "awards",
      title: "Keystone Sales Challenge 2025",
      date: "2025",
      place: "Pi Sigma Epsilon, sponsored by Sherwin-Williams",
      line: "Semifinalist, second in room.",
      empty: "plaque"
    },
    {
      id: "aw-cfa",
      section: "awards",
      title: "CFA Holiday Tournament",
      date: "2024",
      place: "",
      line: "First place, Impromptu; finalist in Prose, Poetry, and Persuasive. Team first overall.",
      empty: "plaque"
    },
    {
      id: "aw-duquesne",
      section: "awards",
      title: "Duquesne tournament",
      date: "2024",
      place: "",
      line: "Fourth place, Persuasive Speaking, at his first college tournament. Team second.",
      empty: "plaque"
    },
    {
      id: "aw-nsls",
      section: "awards",
      title: "National Society of Leadership and Success",
      date: "December 2025",
      place: "",
      line: "Initiation, and induction into three honor societies.",
      image: "awards-honor-societies.webp",
      alt: "Warren Daisey with peers at an honor society induction ceremony."
    },
    {
      id: "aw-duolingo",
      section: "awards",
      title: "Global Duolingo learners",
      date: "2025",
      place: "",
      line: "Top 5% of global Duolingo learners in 2025.",
      empty: "plaque"
    },
    {
      id: "aw-bent",
      section: "awards",
      title: "Bent Leadership Bootcamp",
      date: "April 2025",
      place: "William and Elizabeth Bent Bootcamp for Aspiring Leaders",
      line: "Program completion and leadership certification.",
      empty: "plaque"
    },
    {
      id: "aw-senator",
      section: "awards",
      title: "Outstanding Senator",
      date: "Fall 2024",
      place: "Community Government Association",
      line: "CGA Outstanding Senator. Dr. John J. Trathen student leadership scholarship.",
      empty: "plaque"
    },

    // —— Projects ——
    {
      id: "pj-fof",
      section: "projects",
      title: "Fold-Out-Fit",
      date: "January 2026–Present",
      place: "foldoutfit.com",
      line: "A patent-pending carry bag that unfolds into hanging shelves. Waitlist open at foldoutfit.com.",
      image: "project-foldoutfit-site.webp",
      alt: "The Fold-Out-Fit website on a computer screen.",
      href: "https://foldoutfit.com"
    },
    {
      id: "pj-morgan",
      section: "projects",
      title: "Morgan AI Sales Manager",
      date: "",
      place: "warrendaisey.info",
      line: "A demo of two AI sales coaches working together — call and email review, turned into coaching for managers.",
      image: "project-morgan.webp",
      alt: "The Morgan AI Sales Manager demo on a computer screen.",
      href: "https://warrendaisey.info"
    },
    {
      id: "pj-pridefit",
      section: "projects",
      title: "Sales tools at Pridefit",
      date: "February 2026–Present",
      place: "Sales and Technical Lead (Remote)",
      line: "Configured CRM and sales systems and coded 3 apps and websites that support the sales team, alongside running the pipeline from prospecting to close.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },
    {
      id: "pj-money",
      section: "projects",
      title: "Money 101",
      date: "October 2026",
      place: "Kutztown University",
      line: "The Financial Playbook Every College Student Needs — a personal finance workshop.",
      empty: "coming",
      emptyLabel: "Photo coming soon"
    },

    // —— Story ——
    {
      id: "st-portrait",
      section: "story",
      title: "Warren Daisey",
      date: "",
      place: "Bloomsburg, Pennsylvania",
      line: "A student at Commonwealth University–Bloomsburg pursuing a bachelor’s in Biomedical Science and Political Science, with a Pre-Law concentration and minors in Professional Sales and Black Studies. His goal is a career in biomedical sales.",
      image: "warren-portrait.webp",
      alt: "Portrait of Warren Daisey."
    }
  ];

  const SECTIONS = [
    { id: "entrance", label: "Entrance", wall: null, kicker: "" },
    { id: "events", label: "At the Events", wall: "Gallery I — At the Events", kicker: "Pictures from the rooms he has walked into" },
    { id: "presenting", label: "Presenting", wall: "Gallery II — Presenting", kicker: "At the lectern, the panel, and the poster session" },
    { id: "inventions", label: "Inventions", wall: "Gallery III — Inventions", kicker: "Sixteen pieces, numbered. Most still waiting on a photograph." },
    { id: "awards", label: "Awards", wall: "Gallery IV — Awards", kicker: "Sales, pitch, speech & debate, and leadership" },
    { id: "projects", label: "Projects", wall: "Gallery V — Projects", kicker: "Things he has built" },
    { id: "story", label: "Story", wall: "Gallery VI — Story", kicker: "The short version" },
    { id: "contact", label: "Let’s Connect", wall: "The Exit — Let’s Connect", kicker: "The gallery ends here, the conversation does not" }
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = document.getElementById("world");
  const stage = document.getElementById("stage");
  const track = document.getElementById("scroll-track");
  const flat = document.getElementById("flat-gallery");
  const hint = document.getElementById("scroll-hint");
  const lightbox = document.getElementById("lightbox");

  let cfg = layoutConfig();
  let placed = []; // {work, t, side, el}
  let sectionT = {};
  let pathLen = 1;
  let cameraT = 0;
  let wandering = false;

  function layoutConfig() {
    const mobile = window.innerWidth < 720;
    const M = mobile ? 200 : 260; // px per meter — fill the viewport
    return {
      mobile,
      M,
      radius: (mobile ? 30 : 48) * M,
      totalAngle: mobile ? 0.95 : 1.15,
      hallW: (mobile ? 3.2 : 5.4) * M,
      wallH: (mobile ? 3.5 : 3.85) * M,
      eye: (mobile ? 1.5 : 1.58) * M,
      segLen: (mobile ? 0.85 : 1.05) * M,
      frameW: (mobile ? 1.05 : 1.22) * M,
      frameH: (mobile ? 1.38 : 1.62) * M,
      hang: (mobile ? 1.7 : 1.82) * M,
      startPad: 11 * M,
      bay: (mobile ? 3.1 : 3.35) * M,
      sectionPad: 4.2 * M,
      endPad: 10 * M
    };
  }

  function pathAt(t) {
    const theta = t * cfg.totalAngle;
    return {
      x: cfg.radius * (1 - Math.cos(theta)),
      z: -cfg.radius * Math.sin(theta),
      yaw: -theta
    };
  }

  function leftDir(yaw) {
    return { x: -Math.cos(yaw), z: -Math.sin(yaw) };
  }
  function rightDir(yaw) {
    return { x: Math.cos(yaw), z: Math.sin(yaw) };
  }
  function fwdDir(yaw) {
    return { x: Math.sin(yaw), z: -Math.cos(yaw) };
  }

  function setFace(el, w, h, transform, extraClass) {
    el.className = "face " + (extraClass || "");
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.marginLeft = -w / 2 + "px";
    el.style.marginTop = -h / 2 + "px";
    el.style.transform = transform;
    return el;
  }


  function conceptSVG(i) {
    const hues = [32, 28, 38, 24, 42, 20, 34, 30, 26, 36, 22, 40, 18, 33, 29];
    const h = hues[(i - 2 + hues.length) % hues.length];
    const n = String(i).padStart(2, "0");
    return `<svg class="art-svg" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="260" fill="none"/>
      <circle cx="100" cy="120" r="${70 + (i % 5) * 4}" fill="none" stroke="hsla(${h},40%,70%,0.45)" stroke-width="0.7"/>
      <circle cx="100" cy="120" r="${40 + (i % 7) * 3}" fill="none" stroke="hsla(${h},45%,75%,0.35)" stroke-width="0.6"/>
      <path d="M40 ${80 + (i % 6) * 6} C70 40, 130 40, 160 ${80 + (i % 4) * 8} S130 ${200 - i}, 40 ${190 - (i % 5) * 6}" fill="none" stroke="hsla(${h},50%,78%,0.55)" stroke-width="1"/>
      <line x1="100" y1="40" x2="100" y2="220" stroke="hsla(${h},30%,80%,0.2)" stroke-width="0.5"/>
      <text x="100" y="248" text-anchor="middle" font-size="11" fill="hsla(${h},30%,80%,0.4)" font-family="serif" letter-spacing="3">${n}</text>
    </svg>`;
  }

  function visualHTML(work, lazy) {
    if (work.image) {
      const src = ASSET + work.image;
      const loading = lazy ? "lazy" : "eager";
      return `<img src="${src}" alt="${escapeHtml(work.alt || work.title)}" loading="${loading}" width="800" height="1000">`;
    }
    if (work.empty === "concept") {
      const n = parseInt((work.no || "0").replace(/\D/g, ""), 10) || 2;
      return `<div class="canvas canvas-concept">${conceptSVG(n)}<div class="mark">Concept<span class="sub">Image coming soon</span></div></div>`;
    }
    if (work.empty === "plaque") {
      return `<div class="canvas canvas-plaque"><div class="mark">${escapeHtml(work.title)}<span class="sub">${escapeHtml(work.date || "Award")}</span></div></div>`;
    }
    return `<div class="canvas canvas-coming"><div class="mark">${escapeHtml(work.emptyLabel || "Photo coming soon")}</div></div>`;
  }

  function placardHTML(work) {
    const meta = [work.date, work.place].filter(Boolean).join(" · ");
    return `<div class="placard">
      ${work.no ? `<p class="no">${escapeHtml(work.no)}</p>` : ""}
      <h3>${escapeHtml(work.title)}</h3>
      ${meta ? `<p class="meta">${escapeHtml(meta)}</p>` : ""}
      ${work.line ? `<p class="line">${escapeHtml(work.line)}</p>` : ""}
    </div>`;
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function buildHallway() {
    world.innerHTML = "";
    const arc = cfg.radius * cfg.totalAngle;
    const segs = Math.ceil(arc / (cfg.segLen * 0.55)) + 4;
    const slab = cfg.segLen * 1.7;
    const wallH = cfg.wallH * 1.55;
    const wallY = -cfg.wallH * 0.28;
    for (let i = 0; i < segs; i++) {
      const t = i / (segs - 1);
      const p = pathAt(t);
      const seg = document.createElement("div");
      seg.className = "seg";
      seg.style.transform = `translate3d(${p.x}px, 0px, ${p.z}px) rotateY(${p.yaw}rad)`;
      const fl = setFace(document.createElement("div"), cfg.hallW * 1.08, slab, "rotateX(90deg)", "floor");
      const cl = setFace(document.createElement("div"), cfg.hallW * 1.08, slab, `translateY(${-cfg.wallH}px) rotateX(90deg)`, "ceiling");
      const lw = setFace(document.createElement("div"), slab, wallH, `translate3d(${-cfg.hallW / 2}px, ${wallY}px, 0) rotateY(90deg)`, "wall left");
      const rw = setFace(document.createElement("div"), slab, wallH, `translate3d(${cfg.hallW / 2}px, ${wallY}px, 0) rotateY(-90deg)`, "wall right");
      seg.append(fl, cl, lw, rw);
      world.appendChild(seg);
    }

    const end = pathAt(1);
    const endEl = document.createElement("div");
    endEl.className = "seg";
    endEl.style.transform = `translate3d(${end.x}px, 0px, ${end.z}px) rotateY(${end.yaw}rad)`;
    endEl.appendChild(setFace(document.createElement("div"), cfg.hallW + 12, wallH, `translate3d(0, ${wallY}px, ${-cfg.segLen * 0.25}px)`, "end-wall"));
    world.appendChild(endEl);
  }

  function placeWorks() {
    placed = [];
    sectionT = { entrance: 0 };
    let dist = cfg.startPad;

    function tOf(d) { return Math.min(0.98, d / pathLen); }

    // entrance sign a few meters in, facing the walker
    placeSign("entrance", dist * 0.45);

    SECTIONS.forEach((sec) => {
      if (sec.id === "entrance") return;
      const works = WORKS.filter((w) => w.section === sec.id);
      sectionT[sec.id] = tOf(Math.max(0, dist - cfg.M * 0.4));
      if (sec.wall) placeTitle(sec, tOf(dist + cfg.M * 0.4));
      dist += cfg.sectionPad * 0.55;

      if (sec.id === "contact") {
        placeExit(tOf(dist + cfg.M * 1.2));
        dist += cfg.endPad;
        return;
      }

      for (let i = 0; i < works.length; i++) {
        const side = i % 2 === 0 ? "left" : "right";
        if (side === "left" && i > 0) dist += cfg.bay;
        const t = tOf(dist + (side === "right" ? cfg.bay * 0.08 : 0));
        placeWork(works[i], t, side);
      }
      if (works.length) dist += cfg.bay;
      dist += cfg.sectionPad * 0.45;
    });
  }

  function estimatePath() {
    let dist = cfg.startPad;
    SECTIONS.forEach((sec) => {
      if (sec.id === "entrance") return;
      const works = WORKS.filter((w) => w.section === sec.id);
      dist += cfg.sectionPad * 0.55;
      if (sec.id === "contact") {
        dist += cfg.endPad;
        return;
      }
      const pairs = Math.ceil(works.length / 2);
      dist += pairs * cfg.bay;
      dist += cfg.sectionPad * 0.45;
    });
    pathLen = dist + cfg.endPad * 0.3;
  }

  function placeWork(work, t, side) {
    const p = pathAt(t);
    const dir = side === "left" ? leftDir(p.yaw) : rightDir(p.yaw);
    const wallDist = cfg.hallW / 2 - 8;
    const x = p.x + dir.x * wallDist;
    const z = p.z + dir.z * wallDist;
    const y = -cfg.hang;
    // Face inward: left wall faces right, so yaw + 0? frame hangs on wall, facing center.
    // left wall's inward normal is rightDir, so rotation should be p.yaw + PI (or face toward path).
    const yaw = side === "left" ? p.yaw + Math.PI / 2 : p.yaw - Math.PI / 2;
    // Wait: if yaw=0, facing -Z, left is -X. Frame on left wall should face +X (toward center), which is rotateY(-90deg) or +90?
    // A default element faces the camera when at z<0 with no rotation (faces +Z? Default CSS element at z=0 faces toward +Z? Actually an element's front faces the viewer, i.e. toward +Z? No: a div's face is toward the user, which is +Z in CSS (positive Z comes toward viewer). So the "front" of a frame with no rotation faces +Z.
    // We want the frame on the left wall (x negative) to face +X (toward hall center). rotateY(-90deg) maps +Z toward +X? rotateY(θ) rotates around Y: z' = z cos θ + x sin θ, x' = x cos θ - z sin θ...
    // Standard: rotateY(90deg) sends a point on +Z toward -X? In CSS, rotateY(90deg) rotates clockwise when looking down? CSS rotateY(90deg) rotates so the right edge comes toward you: the face that pointed +Z now points +X. Yes: rotateY(-90deg) faces -X; rotateY(90deg) faces +X.
    // Left wall (negative X): want to face +X, so rotateY(90deg). When path yaw=0, left frame yaw = +90deg = +π/2.
    // Our p.yaw is 0 at start. side left: p.yaw + π/2. Yes.
    // Right wall: face -X: p.yaw - π/2.

    const el = document.createElement("article");
    el.className = "piece";
    el.dataset.id = work.id;
    el.dataset.t = t;
    const orient = (work.image && /portrait|tall/.test(work.id)) ? "portrait" : "";
    const isLandscape = work.image && (work.id === "ev-rally" || work.id === "ev-pa-state" || work.id === "ev-wilkes" || work.id === "ev-sunrise" || work.id === "pr-queer-joy" || work.id === "aw-quick" || work.id === "aw-nsls" || work.id === "aw-plaque" || work.id === "pj-fof" || work.id === "pj-morgan");
    const w = isLandscape ? cfg.frameW * 1.22 : cfg.frameW;
    const h = isLandscape ? cfg.frameH * 0.86 : (work.empty === "concept" ? cfg.frameH * 1.02 : cfg.frameH);
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.marginLeft = -w / 2 + "px";
    el.style.marginTop = -h / 2 + "px";
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad)`;
    el.innerHTML = `<button type="button" class="hit" data-open="${work.id}" aria-label="Open ${escapeHtml(work.title)}">
        <div class="spot-beam"></div>
        <div class="frame">
          <div class="frame-inner">${visualHTML(work, true)}<div class="frame-glare"></div></div>
        </div>
        ${placardHTML(work)}
        <div class="spot-pool"></div>
      </button>`;
    world.appendChild(el);
    placed.push({ work, t, side, el });
  }

  function placeTitle(sec, t) {
    const p = pathAt(t);
    const dir = leftDir(p.yaw);
    const wallDist = cfg.hallW / 2 - 6;
    const x = p.x + dir.x * wallDist;
    const z = p.z + dir.z * wallDist;
    const y = -cfg.wallH * 0.72;
    const yaw = p.yaw + Math.PI / 2;
    const el = document.createElement("div");
    el.className = "title-card";
    el.innerHTML = `<div class="plate"><p class="kicker">${escapeHtml(sec.kicker)}</p><h2>${escapeHtml(sec.wall)}</h2></div>`;
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad)`;
    world.appendChild(el);
  }

  function placeSign(kind, dist) {
    const t = Math.min(0.08, (2.2 * cfg.M) / pathLen);
    const p = pathAt(t);
    const dir = leftDir(p.yaw);
    const wallDist = cfg.hallW / 2 - 8;
    const x = p.x + dir.x * wallDist;
    const z = p.z + dir.z * wallDist;
    const y = -cfg.wallH * 0.58;
    const yaw = p.yaw + Math.PI / 2;
    const el = document.createElement("div");
    el.className = "title-card entrance-plaque";
    el.innerHTML = `<div class="plate entrance">
      <p class="kicker">Warren Daisey</p>
      <h2>A Gallery of Accomplishments</h2>
      <p class="subline">Scroll to walk forward through the hall</p>
    </div>`;
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad)`;
    world.appendChild(el);
  }

  function placeExit(t) {
    const p = pathAt(t);
    const f = fwdDir(p.yaw);
    // Sit on the end wall, facing the incoming walker (local +Z of a yaw-aligned plane).
    const x = p.x + f.x * cfg.M * 0.35;
    const z = p.z + f.z * cfg.M * 0.35;
    const y = -cfg.wallH * 0.55;
    const el = document.createElement("div");
    el.className = "exit-sign";
    el.innerHTML = `<p class="kicker">The exit</p>
      <h2>Let’s Connect</h2>
      <p>Recruiting for biomedical or technical sales, or want to talk about Fold-Out-Fit?</p>
      <div class="exit-links">
        <a href="/contact/">Let’s connect</a>
        <a class="ghost" href="/">Back to the main site</a>
      </div>`;
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${p.yaw + Math.PI}rad)`;
    world.appendChild(el);
    sectionT.contact = Math.max(0, t - (3.2 * cfg.M) / pathLen);
  }

  function build3D() {
    cfg = layoutConfig();
    estimatePath();
    buildHallway();
    placeWorks();
    const px = Math.round(pathLen * 2.35);
    track.style.height = px + "px";
    applyCamera(true);
  }

  function tFromScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / max));
  }

  function applyCamera(immediate) {
    const target = tFromScroll();
    cameraT = immediate ? target : cameraT + (target - cameraT) * 0.18;
    if (Math.abs(target - cameraT) < 0.0004) cameraT = target;
    const p = pathAt(cameraT);
    // Look slightly ahead along the path
    const look = pathAt(Math.min(1, cameraT + 0.012));
    const yaw = Math.atan2(look.x - p.x, -(look.z - p.z));
    // Camera at (p.x, -cfg.eye, p.z), yaw about Y
    world.style.transform = `rotateY(${-yaw}rad) translate3d(${-p.x}px, ${cfg.eye}px, ${-p.z}px)`;
    if (hint && cameraT > 0.03) hint.classList.add("is-hidden");
    updateActiveTab(cameraT);
    cullPieces(cameraT);
    if (!immediate && Math.abs(target - cameraT) > 0.0004) {
      wandering = true;
      requestAnimationFrame(() => applyCamera(false));
    } else {
      wandering = false;
    }
  }

  function cullPieces(t) {
    placed.forEach((item) => {
      const d = item.t - t;
      const show = d > -0.012 && d < 0.16;
      if (item.el.dataset.on === String(show)) return;
      item.el.dataset.on = String(show);
      item.el.style.visibility = show ? "visible" : "hidden";
    });
  }

  function updateActiveTab(t) {
    const ids = SECTIONS.map((s) => s.id);
    let current = "entrance";
    for (const id of ids) {
      if (sectionT[id] != null && t + 0.01 >= sectionT[id]) current = id;
    }
    document.querySelectorAll(".tabs button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.go === current);
    });
  }

  function scrollToSection(id) {
    const t = sectionT[id] != null ? sectionT[id] : 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const y = t * max;
    if (reduced) {
      const el = document.getElementById("flat-" + id);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    const start = window.scrollY;
    const dest = y;
    const dur = 1100;
    const t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k;
      window.scrollTo(0, start + (dest - start) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function buildFlat() {
    const intro = flat.querySelector(".flat-intro");
    // keep intro, append sections
    const existing = flat.querySelectorAll(".flat-section, .flat-exit-block");
    existing.forEach((n) => n.remove());
    SECTIONS.forEach((sec) => {
      if (sec.id === "entrance") return;
      const wrap = document.createElement("section");
      wrap.className = "flat-section";
      wrap.id = "flat-" + sec.id;
      const h = document.createElement("h2");
      h.textContent = sec.wall || sec.label;
      wrap.appendChild(h);
      if (sec.id === "contact") {
        const p = document.createElement("p");
        p.textContent = "Recruiting for biomedical or technical sales, or want to talk about Fold-Out-Fit?";
        const nav = document.createElement("div");
        nav.className = "flat-exit";
        nav.innerHTML = `<a href="/contact/">Let’s connect</a><a href="/">Back to the main site</a>`;
        wrap.append(p, nav);
        wrap.classList.add("flat-exit-block");
        flat.appendChild(wrap);
        return;
      }
      const grid = document.createElement("div");
      grid.className = "flat-grid";
      WORKS.filter((w) => w.section === sec.id).forEach((work) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "flat-card";
        btn.dataset.open = work.id;
        const meta = [work.no, work.date, work.place].filter(Boolean).join(" · ");
        btn.innerHTML = `<div class="thumb">${visualHTML(work, true)}</div>
          <div class="copy"><h3>${escapeHtml(work.title)}</h3>${meta ? `<p>${escapeHtml(meta)}</p>` : ""}${work.line ? `<p>${escapeHtml(work.line)}</p>` : ""}</div>`;
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);
      flat.appendChild(wrap);
    });
  }

  const workById = Object.fromEntries(WORKS.map((w) => [w.id, w]));

  function openLight(id) {
    const work = workById[id];
    if (!work) return;
    const visual = document.getElementById("lb-visual");
    const kicker = document.getElementById("lb-kicker");
    const title = document.getElementById("lb-title");
    const place = document.getElementById("lb-place");
    const desc = document.getElementById("lb-desc");
    kicker.textContent = work.no || (work.section ? work.section : "");
    title.textContent = work.title;
    place.textContent = [work.date, work.place].filter(Boolean).join(" · ");
    desc.textContent = work.line || "";
    const gallery = work.gallery || (work.image ? [{ src: work.image, alt: work.alt }] : []);
    if (gallery.length) {
      const first = gallery[0];
      visual.innerHTML = `<img src="${ASSET + first.src}" alt="${escapeHtml(first.alt || work.title)}">` +
        (gallery.length > 1
          ? `<div class="lb-thumbs">${gallery.map((g, i) =>
              `<button type="button" data-src="${ASSET + g.src}" data-alt="${escapeHtml(g.alt || "")}" class="${i === 0 ? "is-on" : ""}"><img src="${ASSET + g.src}" alt=""></button>`
            ).join("")}</div>`
          : "");
    } else {
      visual.innerHTML = visualHTML(work, false);
    }
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
  }

  function closeLight() {
    if (typeof lightbox.close === "function" && lightbox.open) lightbox.close();
    else lightbox.removeAttribute("open");
  }

  function onClick(e) {
    const thumb = e.target.closest(".lb-thumbs button");
    if (thumb) {
      const img = document.querySelector("#lb-visual > img");
      if (img) {
        img.src = thumb.dataset.src;
        img.alt = thumb.dataset.alt || "";
      }
      thumb.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", b === thumb));
      return;
    }
    const open = e.target.closest("[data-open]");
    if (open) {
      openLight(open.dataset.open);
      return;
    }
    if (e.target.closest(".lb-close") || e.target === lightbox) closeLight();
  }

  function initNav() {
    document.querySelectorAll(".tabs button, .wordmark").forEach((el) => {
      el.addEventListener("click", (e) => {
        const id = el.dataset.go || "entrance";
        if (el.tagName === "A") e.preventDefault();
        scrollToSection(id);
      });
    });
  }

  function init() {
    buildFlat();
    if (reduced) {
      flat.hidden = false;
      stage.hidden = true;
      track.style.display = "none";
    } else {
      flat.hidden = true;
      build3D();
      window.addEventListener("scroll", () => {
        if (!wandering) {
          wandering = true;
          requestAnimationFrame(() => applyCamera(false));
        }
      }, { passive: true });
      window.addEventListener("resize", () => {
        const y = tFromScroll();
        build3D();
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, y * max);
        applyCamera(true);
      });
    }
    initNav();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLight();
    });
  }

  window.__gallery = { openLight: (id) => openLight(id), closeLight, WORKS, sectionT: () => sectionT };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
