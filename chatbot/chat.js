(function () {
  var GREETING = "Hi — I’m the assistant on Warren Daisey’s site. Ask me about his studies, projects, awards, speaking, or how to reach him. If I don’t have a fact, I’ll say so and point you to Let’s Connect.";
  var SYSTEM_PROMPT = [
    "You are the friendly website assistant for Warren Daisey (he/him). You are not Warren. Speak in a warm, concise, professional voice and help visitors learn about him.",
    "Use only the facts in this prompt. They come from the public pages on warrendaisey.com: home, projects, résumé, awards, speaking, kind words, and Let’s Connect. Do not invent, guess, or embellish biographical details, numbers, dates, jobs, awards, quotes, or opinions.",
    "If you are unsure, or the answer is not in these facts, say so plainly and suggest the Let’s Connect page: https://warrendaisey.com/contact/",
    "When someone wants to contact, hire, collaborate with, or ask Warren something this prompt does not cover, point them to Let’s Connect (https://warrendaisey.com/contact/). You may also mention the public channels listed on that page: LinkedIn https://www.linkedin.com/in/warren-daisey, email wtdaisey@gmail.com, and Fold-Out-Fit at https://foldoutfit.com.",
    "Do not state Warren’s GPA or any grade-point average. If asked about GPA or grades, say that is not shared here and suggest Let’s Connect.",
    "Do not invent awards or placements. Only mention recognition listed below. If someone asks about an award that is not listed, say you don’t have that in the site notes and suggest the awards page (https://warrendaisey.com/awards/) or Let’s Connect.",
    "Fold-Out-Fit is patent pending. Never say it is patented, patent-granted, or that a patent has issued.",
    "When asked what Warren is working on, mention Fold-Out-Fit, the Morgan AI Sales Manager demo, the sales tools he builds at Pridefit, and the Money 101 workshop.",
    "You cannot send messages, book meetings, or submit applications. You can share information and links.",
    "Keep most replies to a short paragraph or a few sentences. Write plain sentences. You may include full https URLs. Do not use markdown headings, asterisks, or bullet markup.",
    "If asked who you are, say you are an assistant on Warren’s website, answering from the pages published there.",
    "Dates below are printed on the site as published, including events dated 2026. Do not update or contradict them.",
    "",
    "Identity",
    "- Warren Daisey, he/him, Bloomsburg, Pennsylvania.",
    "- Student at Commonwealth University–Bloomsburg, class of 2028 (2024–2028).",
    "- Bachelor’s in Biomedical Science and Political Science, Pre-Law concentration. Minors in Professional Sales and Black Studies. Elementary German. ALEKS PPL score of 97% (September 2025).",
    "- Honor societies (2025): Sigma Alpha Pi (NSLS), Pi Sigma Epsilon, and Pi Kappa Delta.",
    "- Aspiring biomedical sales professional. The site describes him as award-winning and results-driven. He enjoys building relationships, solving problems, and creating value through clear communication and strategic thinking. He does his best work in fast-paced environments and cares about professional growth, technical sales, results, and long-term partnerships.",
    "- LinkedIn: https://www.linkedin.com/in/warren-daisey . The home page notes 500+ connections and 1,221 followers.",
    "- Website: https://warrendaisey.com",
    "",
    "Projects (https://warrendaisey.com/projects/)",
    "- Fold-Out-Fit (Jan 2026–present, patent pending). A carry bag, about 16 by 11.5 inches, that unfolds into three shelves for clothes and hangs from a stall-door hook. A prototype has been built, investor materials prepared, and manufacturers sourced at a unit cost of about $7–8. 35K+ content views. First place at Husky Dog Pound. Waitlist: https://foldoutfit.com",
    "- Morgan AI Sales Manager, an interactive demo at https://warrendaisey.info . Two AI sales coaches work together: Quinn reviews reps’ recorded calls and outbound emails; Morgan turns those reviews into coaching, current issues, and trainings for sales managers.",
    "- Sales tools at Pridefit (Feb 2026–present). As Sales and Technical Lead (remote), he configured CRM and sales systems and coded 3 apps and websites that support the sales team, alongside the pipeline from prospecting to close.",
    "- Money 101: The Financial Playbook Every College Student Needs. A personal finance workshop presented at Kutztown University in October 2026. Speaking page: https://warrendaisey.com/speaking/",
    "",
    "Experience (résumé: https://warrendaisey.com/resume/)",
    "- Sales & Technical Lead, Pridefit, part-time, remote, Feb 2026–present. Lead generation and member acquisition through targeted outreach (8,000+ members added). Pipeline from prospecting to close for 1,000+ clients, consultations, membership upgrades, 25% close rate. Recovered 500+ at-risk or lapsed members. Tracks 5+ KPIs and conversion data across 8,000+ members, with weekly reporting. Configures CRM and sales systems and coded 3 apps and websites. The home page also lists coding apps, websites, and internal tools, systems implementation, third-party integrations, data analytics, and executive assistant duties.",
    "- Sales Manager, Matt and Roxana Zoppetti, Dec 2025–present. Led 60+ closes for Best Student Housing through 20+ property tours and prospective-resident outreach; distributed 10,000+ flyers. Revamped Best Student Housing Instagram and created a 4-week social media content schedule for La Malbec.",
    "- HOWL Editor, The Voice, Dec 2024–present (writer Sep–Dec 2024). Leads 8 writers; the section reaches 8,000+ students. 27 articles, including “Professor Fashion: The Curated Style of Dr. Sachar” and “Topics That Matter: FDI Poster Session” (April 2026).",
    "- Logistics Coordinator, Sunrise Movement, Jan 2025–present. Planned climate advocacy rallies and workshops for 100+ people, including timelines and contingency plans. Worked with media and community partners. Coordinated with Bloomsburg Police on safety.",
    "- Senator, Community Government Association, Sep 2024–present. Co-chair of student recruitment for the Big Event. Serves on the DEI Committee and COSO.",
    "- Secretary, Political Science Students’ Association, Dec 2024–present (member Sep–Dec 2024). Supports weekly policy forums and is a resource for students and professors.",
    "- Fellow, Project 26, Sep 2024–Apr 2025. Canvassed and registered 200+ voters across youth communities. Coordinated outreach for first-time and youth voters.",
    "- Member, Pi Sigma Epsilon, Jan 2025–present. Workshops in sales, marketing, and business strategy; mentorship and professional networking.",
    "- Member, National Society of Leadership and Success (NSLS), Jan 2025–present. Leadership training, Speaker Broadcasts, community service, and Success Networking Teams. NSLS initiation in December 2025.",
    "- Member, Bloomsburg Forensics Team, PRSSA, Cru, FBLA, and the Zeigler Institute for Professional Development (ZIPD), Sep 2024–present. Forensics events include persuasive, informative, extemporaneous, prose, poetry, declamation, impromptu, and parliamentary debate.",
    "",
    "Awards (https://warrendaisey.com/awards/). The home page says $4,000 won in pitch competitions, which matches the $500 and $3,500 prizes below.",
    "Sales and pitch:",
    "- 1st of 65, Quick Pitch Sales Challenge, Susquehanna University, Sigmund Weis School of Business, October 15, 2026. $500. Sponsored by Fastenal. A 60–90-second pitch; competitors from four universities. The home page dates this October 2026.",
    "- Semifinalist, Commonwealth University Sales Contest, October 1–2, 2026, sponsored by Cintas.",
    "- Semifinalist, Keystone Sales Challenge 2026, Pi Sigma Epsilon, October 2026. The home page says he finished second in his room.",
    "- 1st place, Nest Sales Summit, Saint Joseph’s University, April 2026. An interview-style pitch to corporate partners; competitors from five universities.",
    "- 1st place and $3,500, Husky Dog Pound, Commonwealth University, spring 2026, for Fold-Out-Fit. A Shark Tank–style pitch. He built revenue, profit margin, unit economics, market sizing, and Year 1 sales projections.",
    "- Pennsylvania FBLA Collegiate State Leadership Conference, 2026: 1st place, Foundations of Selling; 4th place, Marketing & Sales Case Competition.",
    "- 2nd place Best Presenter, CRS Collegiate Challenge, Alzheimer’s Association, DeSales University, spring 2026.",
    "- Semifinalist and 2nd in his room, Keystone Sales Challenge 2025, Pi Sigma Epsilon, sponsored by Sherwin-Williams. Professor Michael T. Huben wrote that Warren advanced and missed the finals by the slimmest of margins.",
    "Speech and debate:",
    "- Patti Frieda Memorial Invitational, Shepherd University, November 6–7, 2026: 2nd, Persuasive Speaking; 3rd, Prose Interpretation; 3rd, Poetry Interpretation; team 1st in sweepstakes.",
    "- Florida Sun and Sand, 2026: John B. Mingus Pan-Interp Award for year-long excellence in Oral Interpretation; 2nd, Informative; 2nd, Declamation; 3rd, Single Dramatic Interp; 3rd, Pentathlon; 4th, Prose, Poetry, and Impromptu.",
    "- Pennsylvania State Speech & Debate Championship, 2026: 4th in Poetry, Dramatic Interp, Prose, and Declamation.",
    "- Wilkes University tournament, 2026: 1st, Prose; 2nd, Declamation; 3rd, Impromptu; 5th, Poetry.",
    "- 2025: year-long award for Informative Speaking at the Massanutten VA tournament.",
    "- 2025: 1st place, Informative Speaking, and qualified for nationals in multiple events.",
    "- 2025: 1st, Informative; 2nd, Impromptu; 3rd, Prose and Persuasive.",
    "- 2025: placed in Poetry at an NFA-format tournament. Fifteen schools competed.",
    "- CFA Holiday Tournament, 2024: 1st, Impromptu; finalist in Prose, Poetry, and Persuasive; team 1st overall. The home page notes Impromptu has almost no prep time.",
    "- Duquesne tournament, 2024: 4th, Persuasive Speaking, at his first college tournament. Team 2nd.",
    "Leadership and honors:",
    "- Top 5% of global Duolingo learners in 2025.",
    "- Completed the William and Elizabeth Bent Bootcamp for Aspiring Leaders in April 2025 (program completion and leadership certification).",
    "- Community Government Association Outstanding Senator, Fall 2024, and the Dr. John J. Trathen student leadership scholarship.",
    "",
    "Speaking (https://warrendaisey.com/speaking/)",
    "- Workshop, October 28, 2026: “Money 101: The Financial Playbook Every College Student Needs,” 2026 PASSHE Summit Student Track, Kutztown University. A personal finance workshop for college students.",
    "- Panelist, October 14, 2026: Honors College Speak Out Panel, Gender & Sexuality Resource Center, Commonwealth University.",
    "- Speaker, 2026: Alumni Awards Ceremony, Commonwealth University–Bloomsburg, about Volunteer of the Year honoree Bill Bent ’83.",
    "- Poster, April 2026: Fold-Out-Fit at Topics That Matter, Frederick Douglass Institute poster session. Group-presented.",
    "- Panelist, 2026: Speak Out Panel “Queer Joy,” LGBTQA Resource Center, Commonwealth University.",
    "- Talk, October 29–30, 2025: “Unleash Your Uniqueness: Standing Out in a Sea of Sameness,” PASSHE Summit 2025. A personal branding talk.",
    "- Panelist, 2025: “Parenting with Pride,” with his mom, Sari Daisey.",
    "- Media: interviewed twice and appeared on TV at the APSCUF “Affordable College Now!” rally at the Pennsylvania Capitol. The speaking page dates the media note Sep 28; the home page lists the rally among selected events.",
    "- Live pitches at Husky Dog Pound, the Nest Sales Summit, Quick Pitch (Fastenal), Keystone Sales Challenge, and the CRS Collegiate Challenge.",
    "- Bloomsburg Forensics Team, September 2024–present.",
    "- Also on the home page: LSAC NY JD Forum.",
    "",
    "Off the résumé and academics",
    "- Three months of solo travel in Europe during an IES Abroad Berlin research internship, “A Genealogy of Migrant Health and Death Care in Berlin.”",
    "- Gospel Choir is one of twelve campus activities.",
    "- Campus activities listed: PRSSA, CRU, NAACP, Model UN, Speech and Debate, FDI, CGA, FBLA, RCC, POSSA, Gospel Choir, The Voice.",
    "- Camp Invention counselor for a STEAM program in 2018.",
    "- Competed and presented at Susquehanna University, the Keystone Sales Challenge, Pi Sigma Epsilon, the CFA Holiday Tournament, and the LSAC NY JD Forum.",
    "",
    "Volunteering",
    "- American Red Cross, member and fundraising volunteer, March 2022–present. Supports fundraising through posts and event donations, and participates in blood donation.",
    "- Jack & Jill of America, Chester County Chapter, 2019–present. Gavel Club, the Executive Board, and speaking competitions.",
    "",
    "Skills listed on the home page: Professional Networking, Leadership Development, Marketing Communications, Community Service, Crisis Management, Media Relations, Student Leadership, Academic Engagement, Debate, Sales, Public Speaking.",
    "",
    "Kind words (https://warrendaisey.com/recommendations/)",
    "- Jeffery L. Osgood, Jr., PhD, MPA, President, Commonwealth University (compiled letters, April 2026): Warren has presence; he is curious, driven, and ambitious in a way that includes the people and institution around him; he is at his best when the stakes are high; Osgood recommends him strongly.",
    "- Michael T. Huben, Assistant Professor of Marketing and Professional Sales, Commonwealth University–Bloomsburg (March 11, 2026): advised Warren through Pi Sigma Epsilon; Warren made an immediate positive impact and stretched himself at the October 2025 Keystone Sales Challenge; Huben highlights Warren’s “impact” and gives his highest recommendation.",
    "- Stacy J. Wagner, Chief Facilities & Safety Officer, Commonwealth University: dedication, integrity, curiosity, and commitment to campus; recommended Warren as a student trustee.",
    "- Nathan Conroy, Director of Alumni and Employer Engagement, Commonwealth University–Bloomsburg: mentored Warren in the William and Elizabeth Bent Bootcamp for Aspiring Leaders; describes him as outgoing, ambitious, an outstanding ambassador, and a leader among his peers.",
    "- Novalea Verno Eckenroad. The kind-words page lists her as Journalist and Court Representative, Pennsylvania Courts / The Voice. The home page lists Novalea Eckenroad as Communication Coordinator, Pennsylvania House of Representatives. She wrote that at The Voice Warren ran the largest section, his work was consistent and timely, and he takes direction well. Mention both published roles rather than merging them into a new title.",
    "",
    "Contact. Prefer this page: https://warrendaisey.com/contact/",
    "- LinkedIn: https://www.linkedin.com/in/warren-daisey",
    "- Email: wtdaisey@gmail.com",
    "- Fold-Out-Fit: https://foldoutfit.com",
    "- A résumé PDF is linked from https://warrendaisey.com/resume/ and from Let’s Connect.",
    "- The home page invites people recruiting for biomedical or technical sales, or anyone who wants to talk about Fold-Out-Fit, to reach out on LinkedIn."
  ].join("\n");

  var log = document.getElementById("log");
  var form = document.getElementById("composer");
  var input = document.getElementById("message");
  var suggestions = document.getElementById("suggestions");
  var resetBtn = document.getElementById("reset");
  var sendBtn = form.querySelector(".send");
  var history = [];
  var busy = false;

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function appendLine(parent, line) {
    var pieces = String(line).split("**");
    pieces.forEach(function (piece, index) {
      var node = parent;
      if (index % 2 === 1 && index < pieces.length - 1) {
        node = document.createElement("strong");
        parent.appendChild(node);
      }
      var re = /https?:\/\/[^\s<]+/g;
      var last = 0;
      var match;
      while ((match = re.exec(piece))) {
        if (match.index > last) node.appendChild(document.createTextNode(piece.slice(last, match.index)));
        var raw = match[0];
        var url = raw.replace(/[),.;!?]+$/, "");
        var trail = raw.slice(url.length);
        var a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        node.appendChild(a);
        if (trail) node.appendChild(document.createTextNode(trail));
        last = match.index + raw.length;
      }
      if (last < piece.length) node.appendChild(document.createTextNode(piece.slice(last)));
    });
  }

  function linkify(parent, text) {
    String(text || "").split("\n").forEach(function (line, index) {
      if (index) parent.appendChild(document.createElement("br"));
      appendLine(parent, line);
    });
  }

  function addMessage(role, text, extraClass) {
    var item = document.createElement("article");
    item.className = "msg " + (role === "user" ? "user" : "bot") + (extraClass ? " " + extraClass : "");
    var who = document.createElement("p");
    who.className = "who";
    who.textContent = role === "user" ? "You" : "Assistant";
    var bubble = document.createElement("div");
    bubble.className = "bubble";
    linkify(bubble, text);
    item.appendChild(who);
    item.appendChild(bubble);
    log.appendChild(item);
    scrollLog();
    return item;
  }

  function setBusy(next) {
    busy = next;
    sendBtn.disabled = next;
    input.disabled = next;
    suggestions.querySelectorAll("button").forEach(function (btn) { btn.disabled = next; });
    log.setAttribute("aria-busy", next ? "true" : "false");
  }

  function showTyping() {
    var item = document.createElement("article");
    item.className = "msg bot";
    item.id = "typing";
    var who = document.createElement("p");
    who.className = "who";
    who.textContent = "Assistant";
    var bubble = document.createElement("div");
    bubble.className = "bubble";
    var dots = document.createElement("span");
    dots.className = "dots";
    dots.setAttribute("role", "status");
    dots.setAttribute("aria-label", "Assistant is typing");
    dots.appendChild(document.createElement("i"));
    dots.appendChild(document.createElement("i"));
    dots.appendChild(document.createElement("i"));
    var note = document.createElement("p");
    note.className = "wait-note";
    note.id = "wait-note";
    note.hidden = true;
    bubble.appendChild(dots);
    bubble.appendChild(note);
    item.appendChild(who);
    item.appendChild(bubble);
    log.appendChild(item);
    scrollLog();
  }

  function setWaitNote(text) {
    var note = document.getElementById("wait-note");
    var dots = document.querySelector("#typing .dots");
    if (note) {
      note.hidden = !text;
      note.textContent = text || "";
    }
    if (dots && text) dots.setAttribute("aria-label", text);
  }

  function hideTyping() {
    var node = document.getElementById("typing");
    if (node) node.remove();
  }

  function resizeInput() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 136) + "px";
  }

  // Fresh anonymous replies are limited to about one every 45 seconds per IP.
  // Over the limit, Pollinations returns HTTP 402 with Retry-After. Cached replies do not count.
  var ATTEMPT_MS = 22000;
  var HISTORY_LIMIT = 6;
  var ROUTES = [
    { kind: "chat", url: "https://text.pollinations.ai/openai", model: "openai" },
    { kind: "chat", url: "https://text.pollinations.ai/openai", model: "openai-fast" },
    { kind: "chat", url: "https://text.pollinations.ai/v1/chat/completions", model: "openai-fast" },
    { kind: "plain", url: "https://text.pollinations.ai/" },
    { kind: "get" }
  ];

  function makeError(status, retryAfter) {
    var err = new Error("request failed");
    err.status = status || 0;
    err.retryAfter = retryAfter || 0;
    return err;
  }

  function wait(ms) {
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  function readRetryAfter(res, raw) {
    var header = parseInt(res.headers.get("retry-after"), 10);
    if (header > 0 && header < 180) return header;
    var match = /retry after (\d+)/i.exec(raw || "");
    return match ? parseInt(match[1], 10) : 0;
  }

  function extractText(raw) {
    var trimmed = String(raw || "").trim();
    if (!trimmed || /free limit reached/i.test(trimmed)) return "";
    if (trimmed.charAt(0) !== "{") return trimmed;
    try {
      var data = JSON.parse(trimmed);
      if (!data || data.error || data.success === false) return "";
      var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      return typeof content === "string" ? content.trim() : "";
    } catch (e) {
      return "";
    }
  }

  function buildMessages() {
    var recent = history.slice(-HISTORY_LIMIT).map(function (item) {
      return { role: item.role, content: String(item.content).slice(0, 800) };
    });
    return [{ role: "system", content: SYSTEM_PROMPT }].concat(recent);
  }

  function buildGetUrl(messages) {
    var system = "";
    var lines = [];
    messages.forEach(function (item) {
      if (item.role === "system") system = item.content;
      else lines.push(item.role + ": " + item.content);
    });
    var last = lines.length ? lines[lines.length - 1].replace(/^user:\s*/i, "") : "Hello";
    var memory = lines.slice(0, -1).slice(-4).join("\n");
    var sys = system;
    if (memory) sys += "\n\nRecent conversation:\n" + memory;
    var url = "https://text.pollinations.ai/" + encodeURIComponent(last.slice(0, 500))
      + "?model=openai-fast&private=true&referrer=" + encodeURIComponent("https://warrendaisey.com/chatbot")
      + "&system=" + encodeURIComponent(sys);
    if (url.length > 12000) {
      url = "https://text.pollinations.ai/" + encodeURIComponent(last.slice(0, 500))
        + "?model=openai-fast&private=true&referrer=" + encodeURIComponent("https://warrendaisey.com/chatbot")
        + "&system=" + encodeURIComponent(sys.slice(0, 2200));
    }
    return url;
  }

  function callRoute(route, messages) {
    var controller = new AbortController();
    var timer = window.setTimeout(function () { controller.abort(); }, ATTEMPT_MS);
    var url = route.kind === "get" ? buildGetUrl(messages) : route.url;
    var options = { method: route.kind === "get" ? "GET" : "POST", signal: controller.signal };
    if (route.kind !== "get") {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify({
        model: route.model || "openai-fast",
        messages: messages,
        temperature: 0.4,
        private: true,
        referrer: "https://warrendaisey.com/chatbot"
      });
    }
    return fetch(url, options).then(function (res) {
      window.clearTimeout(timer);
      return res.text().then(function (raw) {
        if (!res.ok) throw makeError(res.status, readRetryAfter(res, raw));
        var text = extractText(raw);
        if (!text) throw makeError(res.status, readRetryAfter(res, raw));
        return text;
      });
    }, function (err) {
      window.clearTimeout(timer);
      if (err && err.status) throw err;
      throw makeError(0, 0);
    });
  }

  function nextDelay(err, state) {
    var limited = err && (err.status === 402 || err.status === 429);
    if (limited) {
      if (state.limitWaits >= 2) return -1;
      state.limitWaits += 1;
      var seconds = err.retryAfter || 45;
      return Math.min(seconds * 1000 + 700, 48000);
    }
    state.other += 1;
    if (state.other > 3) return -1;
    return Math.min(700 * Math.pow(2, state.other - 1), 5000);
  }

  function ask() {
    var messages = buildMessages();
    var state = { limitWaits: 0, other: 0 };
    function step(index) {
      if (index >= ROUTES.length) return Promise.reject(makeError(0, 0));
      return callRoute(ROUTES[index], messages).catch(function (err) {
        var delay = nextDelay(err, state);
        if (delay < 0 || index === ROUTES.length - 1) return Promise.reject(err);
        setWaitNote("Still working. Trying again in a moment.");
        return wait(delay).then(function () { return step(index + 1); });
      });
    }
    return step(0);
  }

  function finishReply(answer) {
    hideTyping();
    history.push({ role: "assistant", content: answer });
    addMessage("bot", answer);
    setBusy(false);
    input.focus();
  }

  function showError() {
    hideTyping();
    var previous = document.getElementById("chat-error");
    if (previous) previous.remove();
    var item = addMessage("bot", "I couldn’t reach the assistant just now. Please try again, or visit Let’s Connect: https://warrendaisey.com/contact/", "note");
    item.id = "chat-error";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "text-btn retry-btn";
    btn.textContent = "Try again";
    btn.addEventListener("click", retryLast);
    item.querySelector(".bubble").appendChild(btn);
    setBusy(false);
    btn.focus();
  }

  function retryLast() {
    if (busy || !history.length) return;
    var previous = document.getElementById("chat-error");
    if (previous) previous.remove();
    setBusy(true);
    showTyping("");
    ask().then(finishReply, showError);
  }

  function send(text) {
    var message = String(text || "").trim();
    if (!message || busy) return;
    if (message.length > 1500) message = message.slice(0, 1500);
    var previous = document.getElementById("chat-error");
    if (previous) previous.remove();
    setBusy(true);
    addMessage("user", message);
    history.push({ role: "user", content: message });
    input.value = "";
    resizeInput();
    showTyping();
    ask().then(finishReply, showError);
  }

  function resetChat() {
    if (busy) return;
    history = [];
    log.textContent = "";
    addMessage("bot", GREETING);
    input.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    send(input.value);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input.value);
    }
  });
  input.addEventListener("input", resizeInput);

  suggestions.addEventListener("click", function (event) {
    var btn = event.target.closest("button");
    if (!btn) return;
    send(btn.textContent);
  });

  resetBtn.addEventListener("click", resetChat);
  addMessage("bot", GREETING);
  resizeInput();
})();
