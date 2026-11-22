(function () {
  var guideApi = window.DarrylGuide;
  var factRoot = document.getElementById("fact");
  var log = document.getElementById("log");
  var form = document.getElementById("composer");
  var box = document.getElementById("message");
  var suggestions = document.getElementById("suggestions");
  var guide = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function sourceLinks(nums) {
    if (!nums || !nums.length) return "";
    return nums.map(function (n) {
      return '<a href="/darryl/sources/#s' + n + '">' + n + "</a>";
    }).join(", ");
  }

  function addBubble(kind, html) {
    var el = document.createElement("div");
    el.className = "bubble " + kind;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function ask(question) {
    var q = String(question || "").trim();
    if (!q) return;
    addBubble("user", '<p class="who">You</p><p>' + esc(q) + "</p>");
    if (!guide) {
      addBubble("guide", '<p class="who">Guide</p><p>The biography is still loading. Try again in a moment.</p>');
      return;
    }
    var result = guide.answer(q);
    var html = '<p class="who">Guide</p><p>' + esc(result.text) + "</p>";
    if (result.known) {
      var links = sourceLinks(result.sources);
      html += '<p class="refs">From the chapter “' + esc(result.chapter) + ".”" +
        (links ? " Sources " + links + "." : "") + "</p>";
    }
    addBubble("guide", html);
  }

  function renderFact(facts) {
    var picked = guideApi.factForDate(facts, new Date());
    var fact = picked.fact;
    var when = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date());
    factRoot.innerHTML =
      '<p class="kicker">Fun fact of the day</p>' +
      '<p class="script">' + esc(when) + "</p>" +
      "<h2>" + esc(fact.topic) + "</h2>" +
      '<p class="fact-body">' + esc(fact.fact) + "</p>" +
      '<p class="fact-where"><strong>Where Darryl spoke or wrote about it.</strong> ' +
      esc(fact.where) + " " +
      '<a href="' + esc(fact.sourceUrl) + '" rel="noopener noreferrer">' + esc(fact.sourceLabel) + "</a>.</p>" +
      (fact.also ? '<p class="fact-where">' + esc(fact.also) + "</p>" : "") +
      '<p class="fact-note">Same fact for every visitor on this New York date · ' +
      (picked.index + 1) + " of " + facts.length + "</p>";
  }

  function bindShots() {
    var dialog = document.getElementById("lightbox");
    var img = dialog.querySelector("img");
    document.querySelectorAll(".shot img").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        img.src = thumb.currentSrc || thumb.src;
        img.alt = thumb.alt;
        if (typeof dialog.showModal === "function") dialog.showModal();
      });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.tagName === "BUTTON") dialog.close();
    });
  }

  if (suggestions) {
    suggestions.addEventListener("click", function (e) {
      if (e.target.tagName !== "BUTTON") return;
      box.value = e.target.textContent;
      ask(e.target.textContent);
      box.value = "";
    });
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ask(box.value);
      box.value = "";
    });
  }
  var reset = document.getElementById("reset");
  if (reset) {
    reset.addEventListener("click", function () {
      log.innerHTML = "";
      addBubble("guide", '<p class="who">Guide</p><p>Ask about Darryl’s family, Penn State, the African American Chronicles, Lewes, or the Black Santa collection. If the biography doesn’t cover it, I’ll say so.</p>');
    });
  }

  bindShots();
  addBubble("guide", '<p class="who">Guide</p><p>Ask about Darryl’s family, Penn State, the African American Chronicles, Lewes, or the Black Santa collection. If the biography doesn’t cover it, I’ll say so.</p>');

  Promise.all([
    fetch("data/facts.json").then(function (r) { return r.json(); }),
    fetch("data/knowledge.json").then(function (r) { return r.json(); })
  ]).then(function (pair) {
    renderFact(pair[0]);
    guide = guideApi.create(pair[1]);
  }).catch(function () {
    if (factRoot) factRoot.innerHTML = "<p>The daily fact could not be loaded.</p>";
  });
})();
