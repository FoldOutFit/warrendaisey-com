(function () {
  var PROOF_SYSTEM = [
    "You proofread email replies for Warren Daisey, a college junior.",
    "He wrote the draft in his own voice. Return only the revised email body.",
    "Fix grammar, clarity, and tone. Keep his meaning and level of formality.",
    "Do not add a subject line, labels, quotes, or commentary.",
    "Do not invent facts, dates, or promises that are not in the draft.",
    "Plain sentences only. No markdown."
  ].join(" ");

  var RANK = { high: 0, medium: 1, low: 2 };
  var briefing = null;
  var store = { tasks: {}, emails: {} };
  var filters = { tasks: "open", emails: "open" };
  var demoMode = false;
  var pendingFile = null;
  var pendingSrc = "";
  var busyUnlock = false;
  var proofBusy = false;
  var toastTimer = 0;
  var usedDomIds = {};

  var gate = document.getElementById("gate");
  var board = document.getElementById("board");
  var form = document.getElementById("unlock");
  var gateStatus = document.getElementById("gate-status");
  var lists = document.getElementById("lists");

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function ymd(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function todayLocal() {
    return ymd(new Date());
  }

  function tomorrowLocal() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return ymd(date);
  }

  function clientTime() {
    var date = new Date();
    var off = -date.getTimezoneOffset();
    var sign = off >= 0 ? "+" : "-";
    var abs = Math.abs(off);
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) +
      "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) +
      sign + pad(Math.floor(abs / 60)) + ":" + pad(abs % 60);
  }

  function parseTime(value) {
    if (typeof value !== "string" || !value) return null;
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    var date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  function formatDay(value) {
    var date = parseTime(value);
    if (!date) return value || "";
    return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  function formatShort(value) {
    var date = parseTime(value);
    if (!date) return value || "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function formatWhen(value) {
    var date = parseTime(value);
    if (!date) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
    return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  function safeUrl(value) {
    try {
      var url = new URL(value, window.location.origin);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch (e) {}
    return "";
  }

  function storageKey(date) { return "wd-assistant:v1:" + date; }

  function loadStore(date) {
    try {
      var parsed = JSON.parse(localStorage.getItem(storageKey(date)) || "{}");
      return {
        tasks: parsed && parsed.tasks && typeof parsed.tasks === "object" ? parsed.tasks : {},
        emails: parsed && parsed.emails && typeof parsed.emails === "object" ? parsed.emails : {}
      };
    } catch (e) {
      return { tasks: {}, emails: {} };
    }
  }

  function saveStore() {
    if (!briefing) return;
    try {
      localStorage.setItem(storageKey(briefing.date), JSON.stringify(store));
    } catch (e) {
      toast("This browser blocked saving the draft on this device.");
    }
  }

  function pruneStore() {
    var keys = [];
    var i;
    for (i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("wd-assistant:v1:") === 0) keys.push(key);
    }
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 21);
    var cut = ymd(cutoff);
    keys.forEach(function (key) {
      var date = key.slice("wd-assistant:v1:".length);
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date < cut) localStorage.removeItem(key);
    });
  }

  function bucket(type) { return type === "email" ? store.emails : store.tasks; }

  function getRecord(type, id) {
    var rec = bucket(type)[id];
    return rec && typeof rec === "object" ? rec : null;
  }

  function ensureRecord(type, id) {
    var box = bucket(type);
    if (!box[id] || typeof box[id] !== "object") box[id] = {};
    return box[id];
  }

  function classify(type, id) {
    var rec = getRecord(type, id);
    if (!rec) return "open";
    if (rec.status === "done" || rec.status === "sent") return "done";
    if (rec.status === "snoozed" && rec.snooze_until && rec.snooze_until > todayLocal()) return "snoozed";
    return "open";
  }

  function allows(item, name) {
    if (!item.actions || !item.actions.length) return true;
    return item.actions.indexOf(name) !== -1;
  }

  function setGate(message, state) {
    gateStatus.textContent = message;
    gateStatus.dataset.state = state || "";
  }

  function toast(message) {
    var el = document.getElementById("toast");
    el.hidden = false;
    el.textContent = message;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.hidden = true;
      el.textContent = "";
    }, 3400);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function domId(prefix, raw) {
    var base = prefix + "-" + String(raw || "").replace(/[^A-Za-z0-9_-]/g, "");
    if (!base || base === prefix + "-") base = prefix;
    if (!usedDomIds[base]) {
      usedDomIds[base] = true;
      return base;
    }
    var n = 2;
    while (usedDomIds[base + n]) n += 1;
    usedDomIds[base + n] = true;
    return base + n;
  }

  function button(action, label, className) {
    var node = document.createElement("button");
    node.type = "button";
    node.dataset.action = action;
    node.className = className || "text-btn";
    node.textContent = label;
    return node;
  }

  function linkButton(url, label) {
    var href = safeUrl(url);
    if (!href) return null;
    var node = document.createElement("a");
    node.className = "text-btn";
    node.href = href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    node.textContent = label || "Open link";
    return node;
  }

  function field(id, label, value, opts) {
    var wrap = el("label", "field");
    wrap.appendChild(el("span", "", label));
    var input = document.createElement(opts.multiline ? "textarea" : "input");
    input.id = id;
    input.className = opts.className;
    if (!opts.multiline) {
      input.type = "text";
      input.autocomplete = "off";
    } else {
      input.rows = opts.rows || 6;
      input.spellcheck = true;
    }
    input.value = value || "";
    wrap.appendChild(input);
    return wrap;
  }

  function addCallout(parent, kicker, text, className) {
    if (!text) return;
    var box = el("div", "callout" + (className ? " " + className : ""));
    box.appendChild(el("p", "kicker", kicker));
    var body = el("p", "");
    body.textContent = text;
    box.appendChild(body);
    parent.appendChild(box);
  }

  function takeItems(list, kind) {
    var seen = Object.create(null);
    var out = [];
    var skipped = 0;
    (Array.isArray(list) ? list : []).forEach(function (item) {
      var ok = item && typeof item === "object" && typeof item.id === "string" && item.id.trim();
      if (kind === "task") ok = ok && typeof item.title === "string" && item.title.trim();
      if (!ok || seen[item.id]) {
        skipped += 1;
        return;
      }
      seen[item.id] = true;
      out.push(item);
    });
    return { items: out, skipped: skipped };
  }

  function normalize(data) {
    if (!data || typeof data !== "object" || typeof data.date !== "string" || !data.date) {
      var err = new Error("This briefing is missing its date.");
      err.code = "format";
      throw err;
    }
    var config = data.config && typeof data.config === "object" ? data.config : {};
    var tasks = takeItems(data.tasks, "task");
    var emails = takeItems(data.emails, "email");
    tasks.items.sort(function (a, b) {
      var ar = Object.prototype.hasOwnProperty.call(RANK, a.priority) ? RANK[a.priority] : 3;
      var br = Object.prototype.hasOwnProperty.call(RANK, b.priority) ? RANK[b.priority] : 3;
      if (ar !== br) return ar - br;
      return String(a.due || "9999").localeCompare(String(b.due || "9999"));
    });
    return {
      generated_at: typeof data.generated_at === "string" ? data.generated_at : "",
      date: data.date,
      config: {
        action_webhook_url: typeof config.action_webhook_url === "string" ? config.action_webhook_url : "",
        action_webhook_key: typeof config.action_webhook_key === "string" ? config.action_webhook_key : "",
        action_webhook_header: typeof config.action_webhook_header === "string" ? config.action_webhook_header : ""
      },
      tasks: tasks.items,
      emails: emails.items,
      skipped: tasks.skipped + emails.skipped
    };
  }

  function preparedLine(data) {
    var day = formatDay(data.date);
    var when = formatWhen(data.generated_at);
    var lead = data.date === todayLocal() ? "Today · " + day : "Briefing for " + day;
    return when ? lead + " · Prepared " + when : lead;
  }

  function readFields(card) {
    function val(className) {
      var node = card.querySelector("." + className);
      return node ? node.value : "";
    }
    return {
      to: val("draft-to"),
      cc: val("draft-cc"),
      subject: val("draft-subject"),
      body: val("draft-body"),
      note: val("note")
    };
  }

  function isEdited(item, rec) {
    if (!rec) return false;
    if (typeof rec.body === "string" && rec.body !== (item.draft_body || "")) return true;
    if (typeof rec.subject === "string" && rec.subject !== (item.draft_subject || "")) return true;
    if (typeof rec.to === "string" && rec.to !== (item.draft_to || "")) return true;
    if (typeof rec.cc === "string" && rec.cc !== (item.draft_cc || "")) return true;
    return false;
  }

  function saveFields(card) {
    var type = card.dataset.type;
    var rec = ensureRecord(type, card.dataset.id);
    var fields = readFields(card);
    rec.note = fields.note;
    if (type === "email") {
      rec.to = fields.to;
      rec.cc = fields.cc;
      rec.subject = fields.subject;
      rec.body = fields.body;
    }
    saveStore();
    var edited = card.querySelector(".edited");
    if (edited) {
      var item = findItem(type, card.dataset.id);
      edited.hidden = !isEdited(item, rec);
    }
    updateActionAvailability(card);
  }

  function findItem(type, id) {
    var list = type === "email" ? briefing.emails : briefing.tasks;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function updateActionAvailability(card) {
    var send = card.querySelector('[data-action="send"]');
    var note = card.querySelector('[data-action="note"]');
    if (card.dataset.inflight === "1") return;
    var fields = readFields(card);
    if (send) send.disabled = !(fields.to.trim() && fields.subject.trim() && fields.body.trim());
    if (note) note.disabled = !fields.note.trim();
    if (proofBusy) {
      var proof = card.querySelector('[data-action="proof"]');
      if (proof) proof.disabled = true;
    }
  }

  function buildPayload(action, type, item, card) {
    var fields = readFields(card);
    return {
      action: action,
      item_type: type === "email" ? "email" : "task",
      item_id: item.id,
      thread_id: item.thread_id || "",
      account: item.account || "",
      to: type === "email" ? fields.to : "",
      cc: type === "email" ? fields.cc : "",
      subject: type === "email" ? fields.subject : "",
      body: type === "email" ? fields.body : "",
      note: fields.note || "",
      client_time: clientTime()
    };
  }

  function statusCopy(action) {
    if (action === "send") return "Sent to your assistant.";
    if (action === "done") return "Marked done and sent to your assistant.";
    if (action === "snooze") return "Snoozed until tomorrow and sent to your assistant.";
    if (action === "note") return "Note sent to your assistant.";
    return "Sent to your assistant.";
  }

  function failureCopy(err) {
    if (err && err.code === "no-endpoint") return "This briefing has no action endpoint yet.";
    if (err && err.status) return "Your assistant returned an error. It may not have gone through.";
    return "Couldn’t reach your assistant.";
  }

  function setCardStatus(card, state, message, retryAction) {
    var node = card.querySelector(".action-status");
    node.dataset.state = state;
    node.textContent = "";
    node.appendChild(el("span", "", message));
    if (retryAction) {
      var retry = button("retry", "Retry", "text-btn retry");
      retry.dataset.retry = retryAction;
      node.appendChild(retry);
    }
  }

  function setInflight(card, next) {
    card.dataset.inflight = next ? "1" : "0";
    card.querySelectorAll("button, textarea, input").forEach(function (node) {
      node.disabled = next;
    });
    if (!next) updateActionAvailability(card);
  }

  function runAction(card, action) {
    if (card.dataset.inflight === "1") return;
    var type = card.dataset.type;
    var item = findItem(type, card.dataset.id);
    if (!item) return;
    var fields = readFields(card);
    if (action === "send" && (!fields.to.trim() || !fields.subject.trim() || !fields.body.trim())) {
      setCardStatus(card, "failed", "Add a recipient, subject, and message before sending.");
      return;
    }
    if (action === "note" && !fields.note.trim()) {
      setCardStatus(card, "failed", "Write a note first.");
      return;
    }
    var payload = buildPayload(action, type, item, card);
    setInflight(card, true);
    setCardStatus(card, "sending", "Sending to your assistant…");
    window.AssistantActions.postAction(briefing.config, payload).then(function () {
      var rec = ensureRecord(type, card.dataset.id);
      if (action === "send") rec.status = "sent";
      else if (action === "done") rec.status = "done";
      else if (action === "snooze") {
        rec.status = "snoozed";
        rec.snooze_until = tomorrowLocal();
      }
      saveStore();
      setInflight(card, false);
      setCardStatus(card, "sent", statusCopy(action));
      applyFilter();
      toast(statusCopy(action));
    }, function (err) {
      setInflight(card, false);
      setCardStatus(card, "failed", failureCopy(err), err && err.code === "no-endpoint" ? "" : action);
    });
  }

  function copyTextFor(type, item, fields) {
    if (type === "email") {
      var lines = ["To: " + fields.to];
      if (fields.cc.trim()) lines.push("Cc: " + fields.cc);
      lines.push("Subject: " + fields.subject, "", fields.body);
      return lines.join("\n");
    }
    var parts = [item.title || ""];
    if (item.details) parts.push(item.details);
    if (item.proposed_solution) parts.push(item.proposed_solution);
    return parts.join("\n\n");
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      area.remove();
      if (ok) resolve();
      else reject(new Error("copy"));
    });
  }

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function copyCard(card) {
    var type = card.dataset.type;
    var item = findItem(type, card.dataset.id);
    writeClipboard(copyTextFor(type, item, readFields(card))).then(function () {
      toast("Copied.");
    }, function () {
      toast("Couldn’t copy from this browser.");
    });
  }

  function cleanDraft(text) {
    var value = String(text || "").trim();
    value = value.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");
    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') value = value.slice(1, -1).trim();
    return value.trim();
  }

  function proofUser(fields) {
    return [
      "Revise only the email body.",
      "To: " + fields.to,
      "Cc: " + fields.cc,
      "Subject: " + fields.subject,
      "",
      fields.body
    ].join("\n").slice(0, 6000);
  }

  function enableProof() {
    if (proofBusy) return;
    board.querySelectorAll('[data-action="proof"]').forEach(function (node) {
      var owner = node.closest(".card");
      if (!owner || owner.dataset.inflight !== "1") node.disabled = false;
    });
  }

  function proofread(card) {
    if (proofBusy || card.dataset.inflight === "1") return;
    var fields = readFields(card);
    if (!fields.body.trim()) {
      setCardStatus(card, "failed", "Write a draft first, then proofread it.");
      return;
    }
    proofBusy = true;
    setInflight(card, true);
    board.querySelectorAll('[data-action="proof"]').forEach(function (node) { node.disabled = true; });
    setCardStatus(card, "sending", "Proofreading…");
    window.AssistantAI.complete([
      { role: "system", content: PROOF_SYSTEM },
      { role: "user", content: proofUser(fields) }
    ], {
      onWait: function (text) { setCardStatus(card, "sending", text || "Proofreading…"); }
    }).then(function (text) {
      var cleaned = cleanDraft(text);
      proofBusy = false;
      setInflight(card, false);
      enableProof();
      if (!cleaned) {
        setCardStatus(card, "failed", "Proofread didn’t come back. The free assistant allows about one reply a minute. Try again shortly.");
        return;
      }
      var body = card.querySelector(".draft-body");
      var undo = card.querySelector(".undo-row");
      undo.hidden = false;
      undo.dataset.previous = body.value;
      body.value = cleaned;
      saveFields(card);
      setCardStatus(card, "sent", "Proofread finished. Read it before you send.");
      body.focus();
    }, function () {
      proofBusy = false;
      setInflight(card, false);
      enableProof();
      setCardStatus(card, "failed", "Proofread didn’t come back. The free assistant allows about one reply a minute. Try again shortly.");
    });
  }

  function undoProof(card) {
    var undo = card.querySelector(".undo-row");
    var body = card.querySelector(".draft-body");
    if (!undo || undo.hidden || !body) return;
    body.value = undo.dataset.previous || "";
    undo.hidden = true;
    undo.dataset.previous = "";
    saveFields(card);
    setCardStatus(card, "sent", "Restored the draft from before proofread.");
  }

  function statusLine() {
    var node = el("div", "action-status");
    node.setAttribute("role", "status");
    return node;
  }

  function badge(className, text) {
    return el("span", "pill " + className, text);
  }

  function buildTask(item) {
    var card = el("article", "card " + (item.priority || "normal"));
    card.dataset.type = "task";
    card.dataset.id = item.id;
    card.dataset.section = "tasks";
    var rec = getRecord("task", item.id);
    var badges = el("div", "badges");
    if (item.priority === "high" || item.priority === "medium" || item.priority === "low") {
      badges.appendChild(badge(item.priority, item.priority));
    }
    var state = badge("state", "");
    state.hidden = true;
    badges.appendChild(state);
    card.appendChild(badges);
    card.appendChild(el("h3", "", item.title));
    var metaBits = [];
    if (item.source) metaBits.push(item.source);
    var due = formatWhen(item.due);
    if (due) metaBits.push("Due " + due);
    if (metaBits.length) card.appendChild(el("p", "meta-line", metaBits.join(" · ")));
    if (item.details) card.appendChild(el("p", "details", item.details));
    addCallout(card, "Proposed solution", item.proposed_solution, "");
    appendLinks(card, item);
    appendNote(card, "task", item.id, rec);
    appendActions(card, taskActions(item));
    card.appendChild(statusLine());
    return card;
  }

  function taskActions(item) {
    var actions = [];
    if (allows(item, "done")) actions.push(button("done", "Mark done", "text-btn"));
    if (allows(item, "snooze")) actions.push(button("snooze", "Snooze to tomorrow", "text-btn"));
    if (allows(item, "copy")) actions.push(button("copy", "Copy text", "text-btn"));
    if (allows(item, "note")) actions.push(button("note", "Send note", "text-btn"));
    return actions;
  }

  function appendLinks(card, item) {
    if (!allows(item, "open") || !Array.isArray(item.links) || !item.links.length) return;
    var row = el("div", "action-row links");
    item.links.forEach(function (link) {
      if (!link) return;
      var node = linkButton(link.url, link.label || "Open link");
      if (node) row.appendChild(node);
    });
    if (row.childNodes.length) card.appendChild(row);
  }

  function appendNote(card, type, id, rec) {
    var item = findItem(type, id);
    if (item && item.actions && item.actions.length && !allows(item, "note") && type === "task") return;
    var inputId = domId("note-" + type, id);
    var value = rec && typeof rec.note === "string" ? rec.note : "";
    card.appendChild(field(inputId, "Note for my assistant", value, { multiline: true, rows: 3, className: "note" }));
  }

  function appendActions(card, nodes) {
    if (!nodes.length) return;
    var row = el("div", "action-row");
    nodes.forEach(function (node) { if (node) row.appendChild(node); });
    card.appendChild(row);
  }

  function buildEmail(item) {
    var card = el("article", "card email");
    card.dataset.type = "email";
    card.dataset.id = item.id;
    card.dataset.section = "emails";
    var rec = getRecord("email", item.id);
    var badges = el("div", "badges");
    if (item.account) badges.appendChild(badge("account", item.account));
    var edited = badge("edited", "Edited");
    edited.hidden = !isEdited(item, rec);
    badges.appendChild(edited);
    var state = badge("state", "");
    state.hidden = true;
    badges.appendChild(state);
    card.appendChild(badges);
    var who = item.from_name || item.from_email || "Unknown sender";
    card.appendChild(el("h3", "", item.subject || "(no subject)"));
    var from = el("p", "meta-line");
    from.textContent = who + (item.from_email ? " · " + item.from_email : "");
    card.appendChild(from);
    var received = formatWhen(item.received_at);
    if (received) card.appendChild(el("p", "meta-line", "Received " + received));
    if (item.snippet) card.appendChild(el("p", "snippet", item.snippet));
    addCallout(card, "Why it needs a reply", item.why_it_needs_reply, "why");
    var draft = el("div", "draft");
    draft.appendChild(el("p", "kicker", "Draft reply"));
    var grid = el("div", "draft-grid");
    grid.appendChild(field(domId("to", item.id), "To", valueOf(rec, "to", item.draft_to), { className: "draft-to" }));
    grid.appendChild(field(domId("cc", item.id), "Cc", valueOf(rec, "cc", item.draft_cc), { className: "draft-cc" }));
    draft.appendChild(grid);
    draft.appendChild(field(domId("subject", item.id), "Subject", valueOf(rec, "subject", item.draft_subject), { className: "draft-subject" }));
    draft.appendChild(field(domId("body", item.id), "Message", valueOf(rec, "body", item.draft_body), { multiline: true, rows: 8, className: "draft-body" }));
    var undo = el("div", "undo-row");
    undo.hidden = true;
    undo.appendChild(button("undo", "Undo proofread", "text-btn"));
    draft.appendChild(undo);
    card.appendChild(draft);
    appendNote(card, "email", item.id, rec);
    var actions = [
      button("proof", "Proofread", "text-btn btn-proof"),
      button("send", "Send", "text-btn btn-send"),
      linkButton(item.gmail_url, "Open in Gmail"),
      button("done", "Mark done", "text-btn"),
      button("snooze", "Snooze to tomorrow", "text-btn"),
      button("copy", "Copy text", "text-btn"),
      button("note", "Send note", "text-btn")
    ];
    appendActions(card, actions);
    card.appendChild(statusLine());
    return card;
  }

  function valueOf(rec, key, fallback) {
    if (rec && typeof rec[key] === "string") return rec[key];
    return fallback || "";
  }

  function emptyCopy(section, mode) {
    if (mode === "open" && section === "tasks") return "You’re clear on tasks. Done and snoozed items are on the other filters.";
    if (mode === "open" && section === "emails") return "No emails are waiting on a reply.";
    if (mode === "done") return "Done items will collect here.";
    if (mode === "snoozed") return "Snoozed items will wait here until tomorrow.";
    return "This briefing has nothing in this list.";
  }

  function buildSection(name, title, intro, items, build) {
    var section = el("section", "list-block");
    section.id = name;
    var head = el("div", "section-head");
    head.appendChild(el("h2", "", title));
    var filterRow = el("div", "filters");
    filterRow.setAttribute("role", "group");
    filterRow.setAttribute("aria-label", title + " filter");
    ["open", "done", "snoozed", "all"].forEach(function (mode) {
      var labels = { open: "Open", done: "Done", snoozed: "Snoozed", all: "All" };
      var node = button("", labels[mode], "text-btn");
      delete node.dataset.action;
      node.dataset.filter = mode;
      node.dataset.section = name;
      node.setAttribute("aria-pressed", filters[name] === mode ? "true" : "false");
      filterRow.appendChild(node);
    });
    head.appendChild(filterRow);
    section.appendChild(head);
    section.appendChild(el("p", "fine", intro));
    var empty = el("p", "empty");
    empty.dataset.empty = name;
    section.appendChild(empty);
    var stack = el("div", "stack");
    items.forEach(function (item) { stack.appendChild(build(item)); });
    section.appendChild(stack);
    return section;
  }

  function updateBadge(card) {
    var type = card.dataset.type;
    var view = classify(type, card.dataset.id);
    var rec = getRecord(type, card.dataset.id);
    var pill = card.querySelector(".pill.state");
    if (!pill) return;
    if (view === "open") {
      pill.hidden = true;
      return;
    }
    pill.hidden = false;
    if (view === "snoozed") pill.textContent = "Snoozed until " + formatShort(rec && rec.snooze_until);
    else if (rec && rec.status === "sent") pill.textContent = "Sent to assistant";
    else pill.textContent = "Done";
  }

  function applyFilter() {
    ["tasks", "emails"].forEach(function (section) {
      var mode = filters[section];
      var cards = lists.querySelectorAll('.card[data-section="' + section + '"]');
      var visible = 0;
      cards.forEach(function (card) {
        updateBadge(card);
        var show = mode === "all" || classify(card.dataset.type, card.dataset.id) === mode;
        card.hidden = !show;
        if (show) visible += 1;
      });
      var empty = lists.querySelector('[data-empty="' + section + '"]');
      if (empty) {
        empty.hidden = visible !== 0;
        empty.textContent = emptyCopy(section, mode);
      }
      lists.querySelectorAll('[data-filter][data-section="' + section + '"]').forEach(function (node) {
        var on = node.dataset.filter === mode;
        node.setAttribute("aria-pressed", on ? "true" : "false");
        node.classList.toggle("is-on", on);
      });
    });
    var openTasks = briefing.tasks.filter(function (item) { return classify("task", item.id) === "open"; }).length;
    var openEmails = briefing.emails.filter(function (item) { return classify("email", item.id) === "open"; }).length;
    document.getElementById("counts").textContent =
      openTasks + (openTasks === 1 ? " open task" : " open tasks") + " · " +
      openEmails + (openEmails === 1 ? " email to answer" : " emails to answer");
  }

  function render() {
    usedDomIds = {};
    lists.textContent = "";
    if (briefing.skipped) {
      lists.appendChild(el("p", "banner warn", briefing.skipped + (briefing.skipped === 1 ? " item was skipped because it had no id." : " items were skipped because they had no id.")));
    }
    lists.appendChild(buildSection(
      "tasks",
      "Tasks",
      "Mark done or snooze once you have handled it. A note goes along with that, or you can send the note on its own.",
      briefing.tasks,
      buildTask
    ));
    lists.appendChild(buildSection(
      "emails",
      "Emails",
      "Proofread uses the free assistant on this site, about one reply a minute. Send hands the edited draft to your assistant, who mails it for you.",
      briefing.emails,
      buildEmail
    ));
    lists.querySelectorAll(".card").forEach(updateActionAvailability);
    applyFilter();
  }

  function start(data, opts) {
    briefing = normalize(data);
    demoMode = !!(opts && opts.demo);
    store = loadStore(briefing.date);
    try { pruneStore(); } catch (e) {}
    gate.hidden = true;
    board.hidden = false;
    document.getElementById("demo-banner").hidden = !demoMode;
    document.getElementById("prepared").textContent = preparedLine(briefing);
    document.getElementById("hero-lead").textContent = demoMode
      ? "A fictional briefing, so you can try the page before a real one is published."
      : "Tasks to finish and emails to answer, with a draft already started.";
    render();
  }

  function loadJson(name) {
    return fetch(name + "?v=" + Date.now(), { cache: "no-store" }).then(function (res) {
      if (res.status === 404) {
        throw Object.assign(new Error(name === "data.enc.json"
          ? "Today’s briefing hasn’t been published yet."
          : "That file isn’t on the site."), { code: "missing" });
      }
      return res.text().then(function (body) {
        if (!res.ok) throw Object.assign(new Error("Couldn’t download the briefing."), { code: "download" });
        try {
          return JSON.parse(body);
        } catch (e) {
          throw Object.assign(new Error("The briefing file wasn’t valid JSON."), { code: "format" });
        }
      });
    }, function () {
      throw Object.assign(new Error("Couldn’t download the briefing. Check your connection and try again."), { code: "download" });
    });
  }

  function showLinks(src) {
    var links = document.getElementById("gate-links");
    links.hidden = false;
    var sample = document.getElementById("sample-link");
    if (sample) sample.hidden = src === "sample.enc.json";
  }

  function showGateMessage(message) {
    gate.hidden = false;
    board.hidden = true;
    form.hidden = true;
    setGate(message, "error");
    showLinks("");
  }

  function revealForm(src) {
    form.hidden = false;
    showLinks(src);
    if (src === "sample.enc.json") {
      setGate("Sample briefing. The test passphrase is demo.", "");
    } else {
      setGate("Enter your passphrase to open today’s briefing.", "");
    }
    var input = document.getElementById("passphrase");
    input.value = "";
    input.focus();
  }

  function encName() {
    var params = new URLSearchParams(window.location.search);
    return params.get("enc") === "sample" ? "sample.enc.json" : "data.enc.json";
  }

  function boot() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") {
      setGate("Loading the fictional demo…", "");
      loadJson("sample.json").then(function (data) {
        try { start(data, { demo: true }); }
        catch (err) { showGateMessage(err.message); }
      }, function (err) {
        showGateMessage(err.message || "Couldn’t load the demo.");
      });
      return;
    }
    if (!window.crypto || !crypto.subtle) {
      showGateMessage("Unlocking needs a private browser connection (https).");
      return;
    }
    var src = encName();
    setGate("Loading today’s briefing…", "");
    loadJson(src).then(function (file) {
      var raw = window.AssistantCrypto.readSession(src, file);
      if (!raw) {
        pendingFile = file;
        pendingSrc = src;
        revealForm(src);
        return;
      }
      setGate("Unlocking this tab’s saved key…", "");
      window.AssistantCrypto.decryptWithRaw(file, raw).then(function (data) {
        try { start(data, { demo: false }); }
        catch (err) { showGateMessage(err.message); }
      }, function () {
        window.AssistantCrypto.clearSession();
        pendingFile = file;
        pendingSrc = src;
        revealForm(src);
        setGate("The saved key no longer matches this briefing. Enter your passphrase.", "error");
      });
    }, function (err) {
      showGateMessage(err.message || "Couldn’t download the briefing.");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!pendingFile || busyUnlock) return;
    busyUnlock = true;
    var input = document.getElementById("passphrase");
    var passphrase = input.value;
    var remember = document.getElementById("remember").checked;
    var submit = form.querySelector(".unlock");
    submit.disabled = true;
    setGate("Unlocking… This can take a moment.", "");
    window.AssistantCrypto.unlock(pendingFile, passphrase).then(function (result) {
      input.value = "";
      var saved = remember
        ? window.AssistantCrypto.saveSession(pendingSrc, pendingFile, result.key)
        : Promise.resolve();
      return saved.catch(function () {}).then(function () {
        start(result.data, { demo: false });
      });
    }).catch(function (err) {
      setGate((err && err.message) || "That passphrase did not unlock this briefing.", "error");
      input.focus();
    }).then(function () {
      busyUnlock = false;
      submit.disabled = false;
    });
  });

  document.getElementById("toggle-pass").addEventListener("click", function () {
    var input = document.getElementById("passphrase");
    var show = input.type === "password";
    input.type = show ? "text" : "password";
    this.textContent = show ? "Hide" : "Show";
    this.setAttribute("aria-pressed", show ? "true" : "false");
  });

  document.getElementById("lock").addEventListener("click", function () {
    window.AssistantCrypto.clearSession();
    if (demoMode) window.location.href = window.location.pathname;
    else window.location.reload();
  });

  board.addEventListener("click", function (event) {
    var filterBtn = event.target.closest("[data-filter]");
    if (filterBtn && board.contains(filterBtn)) {
      filters[filterBtn.dataset.section] = filterBtn.dataset.filter;
      applyFilter();
      return;
    }
    var btn = event.target.closest("button");
    if (!btn || !board.contains(btn)) return;
    var card = btn.closest(".card");
    if (!card) return;
    var action = btn.dataset.action;
    if (action === "retry") action = btn.dataset.retry;
    if (action === "done" || action === "snooze" || action === "send" || action === "note") runAction(card, action);
    else if (action === "copy") copyCard(card);
    else if (action === "proof") proofread(card);
    else if (action === "undo") undoProof(card);
  });

  board.addEventListener("input", function (event) {
    var card = event.target.closest(".card");
    if (card) saveFields(card);
  });

  boot();
})();
