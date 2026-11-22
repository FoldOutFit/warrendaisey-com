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
  let sectionT = {};
  let pathLen = 1;
  let cameraT = 0;
  let wandering = false;

  let renderer = null;
  let scene = null;
  let camera = null;
  let clickables = [];
  let workPlaced = []; // {t, x, y, z}
  let exitDock = null;
  let animating = false;

  function layoutConfig() {
    const mobile = window.innerWidth < 720;
    // Larger portraits; hang stays near the 57-inch museum line, high enough
    // that the placard still clears the floor.
    const frameW = mobile ? 1.22 : 1.42;
    const frameH = mobile ? 1.62 : 1.82;
    return {
      mobile,
      totalAngle: mobile ? 1.7 : 2.35,
      hallW: mobile ? 2.85 : 4.35,
      wallH: mobile ? 3.6 : 4.05,
      eye: mobile ? 1.58 : 1.62,
      hang: 1.52,
      frameW,
      frameH,
      bay: (mobile ? 2.0 : 1.9) * frameW,
      titleBay: mobile ? 5.6 : 6.2,
      startPad: mobile ? 7 : 8.5,
      sectionPad: mobile ? 2.0 : 2.3,
      endPad: mobile ? 7 : 8,
      lookBias: mobile ? 0.4 : 0.45,
      camInset: mobile ? 0.06 : 0.08
    };
  }

  function pathAt(t) {
    const theta = t * cfg.totalAngle;
    return {
      x: cfg.radius * (1 - Math.cos(theta)),
      z: -cfg.radius * Math.sin(theta),
      yaw: -theta,
      theta
    };
  }

  function leftDir(yaw) {
    // Outward (left / outer wall) from heading. yaw = -theta.
    return { x: -Math.cos(yaw), z: Math.sin(yaw) };
  }
  function rightDir(yaw) {
    return { x: Math.cos(yaw), z: -Math.sin(yaw) };
  }
  function fwdDir(yaw) {
    return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
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

  function estimatePath() {
    let dist = cfg.startPad;
    SECTIONS.forEach((sec) => {
      if (sec.id === "entrance") return;
      dist += cfg.titleBay;
      if (sec.id === "contact") {
        dist += cfg.endPad;
        return;
      }
      const n = WORKS.filter((w) => w.section === sec.id).length;
      dist += n * cfg.bay;
      dist += cfg.sectionPad;
    });
    pathLen = dist + cfg.endPad * 0.2;
  }

  function fitPathToLength() {
    cfg.totalAngle = cfg.mobile ? 1.7 : 2.35;
    cfg.radius = pathLen / cfg.totalAngle;
  }

  function makeCanvasTexture(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
    return tex;
  }

  function plasterTexture() {
    return makeCanvasTexture(512, 512, (ctx, w, h) => {
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < w * h; i++) {
        const j = i * 4;
        const n = (Math.random() - 0.5) * 14;
        img.data[j] = 235 + n;
        img.data[j + 1] = 224 + n;
        img.data[j + 2] = 204 + n * 0.8;
        img.data[j + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    });
  }

  function woodTexture() {
    return makeCanvasTexture(1024, 256, (ctx, w, h) => {
      ctx.fillStyle = "#4e2f18";
      ctx.fillRect(0, 0, w, h);
      const plank = 64;
      for (let y = 0, k = 0; y < h; y += plank, k++) {
        const shade = (k % 3 === 0 ? 16 : k % 3 === 1 ? 0 : -10);
        ctx.fillStyle = `rgb(${112 + shade},${72 + shade},${42 + shade})`;
        ctx.fillRect(0, y, w, plank - 3);
        ctx.fillStyle = "#3a2412";
        ctx.fillRect(0, y + plank - 3, w, 3);
      }
    });
  }

  function wrapTex(tex, rx, ry) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    return tex;
  }

  // Ribbon of a vertical cylinder about the hall's circle center (radius, 0, 0).
  function cylinderBand(Rwall, th0, th1, y0, y1, inward, segs) {
    const pos = [];
    const nrm = [];
    const uv = [];
    const idx = [];
    const arc = Math.abs(Rwall * (th1 - th0));
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const th = th0 + (th1 - th0) * t;
      const x = cfg.radius - Rwall * Math.cos(th);
      const z = -Rwall * Math.sin(th);
      pos.push(x, y0, z, x, y1, z);
      const nx = inward === "left" ? Math.cos(th) : -Math.cos(th);
      const nz = inward === "left" ? Math.sin(th) : -Math.sin(th);
      nrm.push(nx, 0, nz, nx, 0, nz);
      uv.push((arc * t) / 4, 0, (arc * t) / 4, 1);
    }
    for (let i = 0; i < segs; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      if (inward === "left") {
        idx.push(a, b, c, b, d, c);
      } else {
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    return geo;
  }

  function floorGeo(Rinner, Router, th0, th1, segs, y, normalUp) {
    const pos = [], nrm = [], uv = [], idx = [];
    const radial = 8;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const th = th0 + (th1 - th0) * t;
      for (let j = 0; j <= radial; j++) {
        const s = j / radial;
        const Rw = Rinner + (Router - Rinner) * s;
        const x = cfg.radius - Rw * Math.cos(th);
        const z = -Rw * Math.sin(th);
        pos.push(x, y, z);
        nrm.push(0, normalUp ? 1 : -1, 0);
        uv.push((cfg.radius * th) / 2.6, (s * (Router - Rinner)) / 0.2);
      }
    }
    const stride = radial + 1;
    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < radial; j++) {
        const a = i * stride + j;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        if (normalUp) idx.push(a, c, b, b, c, d);
        else idx.push(a, b, c, b, d, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    return geo;
  }


  function addBenches() {
    const wood = new THREE.MeshStandardMaterial({ color: 0x5c3a22, roughness: 0.72, metalness: 0.04 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x3a2414, roughness: 0.7, metalness: 0.04 });
    const step = 10;
    const n = Math.floor(pathLen / step);
    const seatW = 1.55;
    const seatD = 0.4;
    const seatH = 0.07;
    const h = 0.44;
    const wallDist = cfg.hallW / 2 - 0.48;
    for (let i = 1; i < n; i++) {
      const t = (i * step) / pathLen;
      if (t < 0.04 || t > 0.93) continue;
      const p = pathAt(t);
      const dir = rightDir(p.yaw);
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(seatW, seatH, seatD), wood);
      seat.position.y = h;
      g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(seatW, 0.28, 0.05), wood);
      back.position.set(0, h + 0.16, -seatD / 2 + 0.03);
      g.add(back);
      [-0.62, 0.62].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, h, 0.07), dark);
        leg.position.set(x, h / 2, seatD * 0.28);
        g.add(leg);
        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, h, 0.07), dark);
        leg2.position.set(x, h / 2, -seatD * 0.28);
        g.add(leg2);
      });
      g.position.set(p.x + dir.x * wallDist, 0, p.z + dir.z * wallDist);
      // Long axis along the hall, back against the right wall
      g.rotation.y = p.yaw + Math.PI / 2;
      scene.add(g);
    }
  }

  function buildHallway() {
    const R = cfg.radius;
    const half = cfg.hallW / 2;
    const Rleft = R + half;
    const Rright = Math.max(R - half, 1.2);
    const th0 = -0.1;
    const th1 = cfg.totalAngle + 0.08;
    const segs = Math.max(80, Math.round(pathLen * 1.4));
    const wallH = cfg.wallH;

    const plaster = wrapTex(plasterTexture(), 1, 1);
    const wallMat = new THREE.MeshStandardMaterial({
      map: plaster,
      color: 0xefe4d0,
      roughness: 0.9,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x4a2e18,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xd7c4a6,
      roughness: 0.7,
      metalness: 0.04,
      side: THREE.DoubleSide
    });
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x3a3330,
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide
    });
    const wood = wrapTex(woodTexture(), 1, 1);
    const floorMat = new THREE.MeshStandardMaterial({
      map: wood,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    scene.add(new THREE.Mesh(cylinderBand(Rleft, th0, th1, 0, wallH, "left", segs), wallMat));
    scene.add(new THREE.Mesh(cylinderBand(Rright, th0, th1, 0, wallH, "right", segs), wallMat));
    // Baseboard and crown, slightly into the hall so they sit cleanly on the plaster
    const inset = 0.012;
    scene.add(new THREE.Mesh(cylinderBand(Rleft - inset, th0, th1, 0, 0.14, "left", segs), baseMat));
    scene.add(new THREE.Mesh(cylinderBand(Rright + inset, th0, th1, 0, 0.14, "right", segs), baseMat));
    scene.add(new THREE.Mesh(cylinderBand(Rleft - inset, th0, th1, wallH - 0.1, wallH, "left", segs), crownMat));
    scene.add(new THREE.Mesh(cylinderBand(Rright + inset, th0, th1, wallH - 0.1, wallH, "right", segs), crownMat));

    scene.add(new THREE.Mesh(floorGeo(Rright, Rleft, th0, th1, segs, 0, true), floorMat));
    scene.add(new THREE.Mesh(floorGeo(Rright, Rleft, th0, th1, segs, wallH, false), ceilMat));

    // End wall
    const end = pathAt(1);
    const endGeo = new THREE.PlaneGeometry(cfg.hallW + 0.08, wallH);
    const endMesh = new THREE.Mesh(endGeo, wallMat.clone());
    const f = fwdDir(end.yaw);
    endMesh.position.set(end.x + f.x * 0.04, wallH / 2, end.z + f.z * 0.04);
    endMesh.rotation.y = end.yaw;
    scene.add(endMesh);

    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x6a4a30, 1.55));
    scene.add(new THREE.AmbientLight(0x9a8a74, 0.9));

    const nLights = Math.max(7, Math.round(pathLen / 5.6));
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x3a332c, roughness: 0.45, metalness: 0.4 });
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfff0c8,
      emissive: 0xffdca0,
      emissiveIntensity: 3.2,
      roughness: 0.35
    });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffd9a0,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    let prev = null;
    for (let i = 0; i <= nLights; i++) {
      const p = pathAt(i / nLights);
      const spot = new THREE.SpotLight(0xffe0b0, 22, 14, Math.PI / 6.5, 0.5, 1.0);
      spot.position.set(p.x, wallH - 0.06, p.z);
      spot.target.position.set(p.x, 0.05, p.z);
      scene.add(spot);
      scene.add(spot.target);
      const wash = new THREE.PointLight(0xffe3b8, 3.2, 7.5, 1.4);
      wash.position.set(p.x, wallH - 0.35, p.z);
      scene.add(wash);

      if (prev) {
        const mid = pathAt((i - 0.5) / nLights);
        const dx = p.x - prev.x, dz = p.z - prev.z;
        const len = Math.sqrt(dx * dx + dz * dz) + 0.04;
        const track = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, len), fixtureMat);
        track.position.set(mid.x, wallH - 0.015, mid.z);
        track.rotation.y = mid.yaw;
        scene.add(track);
      }
      prev = p;

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.025, 0.05), fixtureMat);
      rail.position.set(p.x, wallH - 0.03, p.z);
      rail.rotation.y = p.yaw;
      scene.add(rail);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.035), fixtureMat);
      arm.position.set(p.x, wallH - 0.09, p.z);
      scene.add(arm);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), bulbMat);
      bulb.position.set(p.x, wallH - 0.16, p.z);
      scene.add(bulb);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.5, 20, 1, true), beamMat);
      cone.position.set(p.x, wallH - 0.16 - 1.25, p.z);
      scene.add(cone);
    }
    const endLight = new THREE.PointLight(0xffe6c0, 8, 12, 1.2);
    const endP = pathAt(0.97);
    endLight.position.set(endP.x, wallH * 0.7, endP.z);
    scene.add(endLight);

    addBenches();
  }

  function artCanvas(work) {
    const W = 768, H = 1024;
    return makeCanvasTexture(W, H, (ctx) => {
      if (work.empty === "concept") {
        const n = parseInt((work.no || "0").replace(/\D/g, ""), 10) || 2;
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#1f1a16");
        g.addColorStop(0.5, "#2c241c");
        g.addColorStop(1, "#3a2e22");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(212,184,130,0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.46, 220 + (n % 5) * 8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(W / 2, H * 0.46, 130 + (n % 7) * 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "rgba(232,214,180,0.78)";
        ctx.font = "600 42px 'Cormorant Garamond', serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "8px";
        ctx.fillText("CONCEPT", W / 2, H * 0.5);
        ctx.font = "600 18px 'Source Sans 3', sans-serif";
        ctx.fillStyle = "rgba(232,214,180,0.55)";
        ctx.fillText("IMAGE COMING SOON", W / 2, H * 0.5 + 36);
        ctx.font = "500 22px 'Cormorant Garamond', serif";
        ctx.fillText(String(n).padStart(2, "0"), W / 2, H * 0.86);
      } else if (work.empty === "plaque") {
        const g = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.5, 520);
        g.addColorStop(0, "#c4a265");
        g.addColorStop(1, "#7a5a2e");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#2a1d0e";
        ctx.textAlign = "center";
        ctx.font = "600 46px 'Cormorant Garamond', serif";
        wrapText(ctx, work.title, W / 2, H * 0.46, W * 0.78, 56);
        ctx.font = "600 20px 'Source Sans 3', sans-serif";
        ctx.fillText((work.date || "Award").toUpperCase(), W / 2, H * 0.62);
      } else {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#efe6d6");
        g.addColorStop(1, "#c9b79a");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(80,58,32,0.55)";
        ctx.textAlign = "center";
        ctx.font = "600 36px 'Cormorant Garamond', serif";
        wrapText(ctx, work.emptyLabel || "Photo coming soon", W / 2, H * 0.5, W * 0.7, 44);
      }
    });
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = String(text).split(" ");
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    });
    if (line) lines.push(line);
    const start = y - ((lines.length - 1) * lineH) / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, x, start + i * lineH));
  }

  function placardTexture(work) {
    const W = 1024, H = 420;
    return makeCanvasTexture(W, H, (ctx) => {
      ctx.fillStyle = "#f3eadc";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#d7c7a8";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, W - 4, H - 4);
      let y = 56;
      ctx.textAlign = "left";
      if (work.no) {
        ctx.fillStyle = "#8d6d3e";
        ctx.font = "700 28px 'Source Sans 3', sans-serif";
        ctx.fillText(String(work.no).toUpperCase(), 40, y);
        y += 52;
      }
      ctx.fillStyle = "#1c1712";
      ctx.font = "600 44px 'Cormorant Garamond', serif";
      wrapTextLeft(ctx, work.title, 40, y, W - 80, 50);
      y += 50 * Math.max(1, Math.ceil(ctx.measureText(work.title).width / (W - 80))) + 18;
      const meta = [work.date, work.place].filter(Boolean).join("  ·  ");
      if (meta) {
        ctx.fillStyle = "#4a4036";
        ctx.font = "400 26px 'Source Sans 3', sans-serif";
        ctx.fillText(meta, 40, y);
        y += 42;
      }
      if (work.line) {
        ctx.fillStyle = "#2e271f";
        ctx.font = "400 28px 'Source Sans 3', sans-serif";
        wrapTextLeft(ctx, work.line, 40, y, W - 80, 36);
      }
    });
  }

  function wrapTextLeft(ctx, text, x, y, maxW, lineH) {
    const words = String(text).split(" ");
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, y);
        y += lineH;
        line = w;
      } else line = test;
    });
    if (line) ctx.fillText(line, x, y);
  }

  function titleTexture(kicker, title, sub) {
    const W = 1024, H = 420;
    return makeCanvasTexture(W, H, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#f6efe3");
      g.addColorStop(1, "#e6d8c2");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#c4a574";
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, W - 6, H - 6);
      ctx.strokeStyle = "#8d6d3e";
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.textAlign = "center";
      if (kicker) {
        ctx.fillStyle = "#8d6d3e";
        ctx.font = "700 24px 'Source Sans 3', sans-serif";
        ctx.fillText(String(kicker).toUpperCase(), W / 2, 90);
      }
      ctx.fillStyle = "#1c1712";
      ctx.font = "600 54px 'Cormorant Garamond', serif";
      wrapText(ctx, title, W / 2, sub ? 190 : 220, W - 120, 62);
      if (sub) {
        ctx.fillStyle = "#4a4036";
        ctx.font = "italic 500 28px 'Cormorant Garamond', serif";
        wrapText(ctx, sub, W / 2, 330, W - 140, 36);
      }
    });
  }

  function placeOnWall(t, side, y, mesh) {
    const p = pathAt(t);
    const dir = side === "left" ? leftDir(p.yaw) : rightDir(p.yaw);
    const wallDist = cfg.hallW / 2 - 0.03;
    mesh.position.set(p.x + dir.x * wallDist, y, p.z + dir.z * wallDist);
    mesh.rotation.y = side === "left" ? p.yaw + Math.PI / 2 : p.yaw - Math.PI / 2;
    scene.add(mesh);
    return mesh;
  }

  function placeWork(work, t, side) {
    const group = new THREE.Group();
    const fw = cfg.frameW;
    const fh = cfg.frameH;
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc4a574,
      roughness: 0.35,
      metalness: 0.6,
      emissive: 0x2a1c08,
      emissiveIntensity: 0.22
    });
    const matInner = new THREE.MeshStandardMaterial({
      color: 0x1a1612,
      roughness: 0.6,
      metalness: 0
    });
    const mould = new THREE.Mesh(new THREE.BoxGeometry(fw + 0.08, fh + 0.08, 0.04), gold);
    mould.position.z = 0.01;
    group.add(mould);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.01), matInner);
    inner.position.z = 0.028;
    group.add(inner);

    const artMat = new THREE.MeshStandardMaterial({
      roughness: 0.48,
      metalness: 0.02
    });
    if (work.image) {
      const loader = new THREE.TextureLoader();
      loader.load(ASSET + work.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        artMat.map = tex;
        artMat.needsUpdate = true;
      });
    } else {
      artMat.map = artCanvas(work);
    }
    const art = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.02, fh - 0.02), artMat);
    art.position.z = 0.036;
    group.add(art);

    const pTex = placardTexture(work);
    const pH = Math.min(0.46, fw * (380 / 1024));
    const placard = new THREE.Mesh(
      new THREE.PlaneGeometry(fw, pH),
      new THREE.MeshStandardMaterial({ map: pTex, roughness: 0.7, metalness: 0, emissive: 0x3a3020, emissiveIntensity: 0.12 })
    );
    placard.position.set(0, -fh / 2 - 0.05 - pH / 2, 0.02);
    group.add(placard);

    art.userData.id = work.id;
    mould.userData.id = work.id;
    inner.userData.id = work.id;
    clickables.push(art, mould, inner);

    placeOnWall(t, side, cfg.hang, group);
    workPlaced.push({ t, x: group.position.x, y: group.position.y, z: group.position.z });
  }

  function placeTitle(sec, t) {
    const tex = titleTexture(sec.kicker, sec.wall);
    const w = 1.7, h = 0.7;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, metalness: 0, emissive: 0x3a3020, emissiveIntensity: 0.15 })
    );
    placeOnWall(t, "left", cfg.hang + 0.1, mesh);
  }

  function placeSign(t) {
    const tex = titleTexture("Warren Daisey", "A Gallery of Accomplishments", "Scroll to walk forward through the hall");
    const w = 1.9, h = 0.85;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, metalness: 0, emissive: 0x3a3020, emissiveIntensity: 0.15 })
    );
    placeOnWall(t, "left", cfg.hang + 0.05, mesh);
  }

  function placeExit(t) {
    const tex = titleTexture("The exit", "Let’s Connect", "Recruiting for biomedical or technical sales, or want to talk about Fold-Out-Fit?");
    const w = 2.1, h = 0.95;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, metalness: 0, emissive: 0x3a3020, emissiveIntensity: 0.15 })
    );
    const p = pathAt(t);
    const f = fwdDir(p.yaw);
    mesh.material.side = THREE.DoubleSide;
    const end = pathAt(1);
    const fe = fwdDir(end.yaw);
    mesh.position.set(end.x - fe.x * 0.1, cfg.hang + 0.15, end.z - fe.z * 0.1);
    mesh.rotation.y = end.yaw;
    scene.add(mesh);
    sectionT.contact = Math.max(0, 1 - 4.2 / pathLen);
  }

  function placeWorks() {
    clickables = [];
    workPlaced = [];
    sectionT = { entrance: 0 };
    function tOf(d) { return Math.min(0.985, Math.max(0, d / pathLen)); }

    placeSign(tOf(cfg.startPad * (cfg.mobile ? 0.88 : 0.4)));

    let dist = cfg.startPad;
    SECTIONS.forEach((sec) => {
      if (sec.id === "entrance") return;
      const works = WORKS.filter((w) => w.section === sec.id);
      sectionT[sec.id] = tOf(dist + 0.4);
      if (sec.wall) placeTitle(sec, tOf(dist + cfg.titleBay * 0.5));
      dist += cfg.titleBay;

      if (sec.id === "contact") {
        placeExit(tOf(dist + 1.4));
        dist += cfg.endPad;
        return;
      }

      works.forEach((work) => {
        placeWork(work, tOf(dist), "left");
        dist += cfg.bay;
      });
      dist += cfg.sectionPad;
    });
  }

  function ensureExitDock() {
    if (exitDock) return;
    exitDock = document.createElement("div");
    exitDock.id = "exit-dock";
    exitDock.hidden = true;
    exitDock.innerHTML = `<a href="/contact/">Let’s connect</a><a class="ghost" href="/">Back to the main site</a>`;
    document.body.appendChild(exitDock);
  }

  function disposeScene() {
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
    }
    renderer = null;
    scene = null;
    camera = null;
    clickables = [];
  }

  function build3D() {
    if (typeof THREE === "undefined") {
      console.error("three.js failed to load");
      return;
    }
    disposeScene();
    cfg = layoutConfig();
    estimatePath();
    fitPathToLength();

    if (world) world.style.display = "none";
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0a08);
    scene.fog = new THREE.Fog(0x1c1612, 16, 44);

    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    camera = new THREE.PerspectiveCamera(cfg.mobile ? 54 : 50, w / h, 0.08, pathLen + 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    renderer.domElement.id = "gallery-gl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    stage.appendChild(renderer.domElement);

    buildHallway();
    placeWorks();
    ensureExitDock();
    bindCanvasClicks();

    track.style.height = Math.round(pathLen * 260 * 2.2) + "px";
    applyCamera(true);
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
    stage.dataset.ready = "1";
  }

  function bindCanvasClicks() {
    const el = renderer.domElement;
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function setMouse(e) {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    el.addEventListener("mousemove", (e) => {
      setMouse(e);
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(clickables, false);
      el.style.cursor = hits.length ? "pointer" : "default";
    });
    el.addEventListener("click", (e) => {
      setMouse(e);
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(clickables, false);
      if (hits[0] && hits[0].object.userData.id) openLight(hits[0].object.userData.id);
    });
  }

  function tFromScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / max));
  }

  function applyCamera(immediate) {
    if (!camera) return;
    const target = tFromScroll();
    cameraT = immediate ? target : cameraT + (target - cameraT) * 0.18;
    if (Math.abs(target - cameraT) < 0.0004) cameraT = target;
    const p = pathAt(cameraT);
    const hereLeft = leftDir(p.yaw);
    const inset = cfg.camInset || 0.08;
    camera.position.set(p.x + hereLeft.x * inset, cfg.eye, p.z + hereLeft.z * inset);
    // Aim several meters ahead; bias toward the left wall AT that point
    // so the curve presents art more head-on without yawing into the near wall.
    const aheadDist = 4.2;
    const aheadT = Math.min(1, cameraT + aheadDist / pathLen);
    const ahead = pathAt(aheadT);
    const aheadLeft = leftDir(ahead.yaw);
    const bias = cfg.lookBias || 0.45;
    let lx = ahead.x + aheadLeft.x * bias;
    let ly = cfg.eye * 0.35 + cfg.hang * 0.65;
    let lz = ahead.z + aheadLeft.z * bias;
    let sumW = 0, ax = 0, ay = 0, az = 0;
    const peak = 4.2;
    for (let i = 0; i < workPlaced.length; i++) {
      const w = workPlaced[i];
      const ds = (w.t - cameraT) * pathLen;
      if (ds < 2.3 || ds > 7.8) continue;
      const wt = Math.exp(-((ds - peak) * (ds - peak)) / (2.0 * 2.0));
      ax += w.x * wt;
      ay += w.y * wt;
      az += w.z * wt;
      sumW += wt;
    }
    if (sumW > 1e-4) {
      const k = Math.min(0.28, 0.16 + 0.12 * Math.min(1, sumW));
      lx += (ax / sumW - lx) * k;
      ly += (ay / sumW - ly) * k * 0.35;
      lz += (az / sumW - lz) * k;
    }
    camera.lookAt(lx, ly, lz);
    if (hint && cameraT > 0.03) hint.classList.add("is-hidden");
    updateActiveTab(cameraT);
    if (exitDock) exitDock.hidden = cameraT < (sectionT.contact || 0.92) - 0.01;
  }

  function tick() {
    applyCamera(false);
    if (renderer && scene && camera) renderer.render(scene, camera);
    requestAnimationFrame(tick);
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
      else applyCamera(true);
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
      const start = () => build3D();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start, start);
      else start();
      window.addEventListener("resize", () => {
        if (!renderer || !camera) return;
        const mobile = window.innerWidth < 720;
        if (mobile !== cfg.mobile) {
          const y = tFromScroll();
          build3D();
          const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          window.scrollTo(0, y * max);
          applyCamera(true);
        } else {
          const w = stage.clientWidth || window.innerWidth;
          const h = stage.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      });
    }
    initNav();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLight();
    });
  }

  window.__gallery = {
      openLight: (id) => openLight(id),
      closeLight,
      WORKS,
      sectionT: () => sectionT,
      snap: () => applyCamera(true),
      measure: () => {
        if (!camera || !workPlaced.length) return null;
        const t = cameraT;
        let best = workPlaced[0], bestAbs = 99;
        workPlaced.forEach((w) => {
          const ds = (w.t - t) * pathLen;
          if (ds > -0.4 && Math.abs(ds - 2.2) < bestAbs) {
            bestAbs = Math.abs(ds - 2.2);
            best = w;
          }
        });
        const v = new THREE.Vector3(best.x, best.y + cfg.frameH / 2, best.z).project(camera);
        const v2 = new THREE.Vector3(best.x, best.y - cfg.frameH / 2, best.z).project(camera);
        const frac = Math.abs(v.y - v2.y) / 2;
        return {
          t, pathLen, angle: cfg.totalAngle, radius: cfg.radius,
          works: workPlaced.length, hallW: cfg.hallW, frameH: cfg.frameH,
          nearestT: best.t, nearestD: (best.t - t) * pathLen, heightFrac: frac
        };
      }
    };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
