/* Pollinations client copied from /chatbot/chat.js so proofread uses the same
   routes, 22s attempt timeout, retry, backoff, and HTTP 402/429 handling.
   Fresh anonymous replies are limited to about one every 45 seconds per IP.
   Over the limit, Pollinations returns HTTP 402 with Retry-After.
   Keep the route list and nextDelay() in step with chatbot/chat.js. */
(function (global) {
  var ATTEMPT_MS = 22000;
  var REFERRER = "https://warrendaisey.com/assistant";
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
      + "?model=openai-fast&private=true&referrer=" + encodeURIComponent(REFERRER)
      + "&system=" + encodeURIComponent(sys);
    if (url.length > 12000) {
      url = "https://text.pollinations.ai/" + encodeURIComponent(last.slice(0, 500))
        + "?model=openai-fast&private=true&referrer=" + encodeURIComponent(REFERRER)
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
        referrer: REFERRER
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

  function complete(messages, hooks) {
    hooks = hooks || {};
    var state = { limitWaits: 0, other: 0 };
    function step(index) {
      if (index >= ROUTES.length) return Promise.reject(makeError(0, 0));
      return callRoute(ROUTES[index], messages).catch(function (err) {
        var delay = nextDelay(err, state);
        if (delay < 0 || index === ROUTES.length - 1) return Promise.reject(err);
        var seconds = Math.round(delay / 1000);
        if (hooks.onWait) {
          hooks.onWait(seconds >= 5
            ? "Still working. Trying again in about " + seconds + " seconds."
            : "Still working. Trying again in a moment.");
        }
        return wait(delay).then(function () { return step(index + 1); });
      });
    }
    return step(0);
  }

  global.AssistantAI = { complete: complete };
})(window);
