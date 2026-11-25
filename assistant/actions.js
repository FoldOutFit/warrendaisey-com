/* The only module that calls the action endpoint.
   Adjust the request here when the real assistant webhook is wired up.
   The page never opens a mail client and never talks to Gmail's send API. */
(function (global) {
  var TIMEOUT_MS = 20000;

  function fail(code, message) {
    var err = new Error(message);
    err.code = code;
    return err;
  }

  function headerName(name) {
    var value = name || "X-Assistant-Key";
    if (!/^[A-Za-z0-9-]{1,64}$/.test(value)) return "X-Assistant-Key";
    var lower = value.toLowerCase();
    if (lower === "content-type" || lower === "accept" || lower === "cookie" || lower === "host" ||
        lower === "origin" || lower === "referer" || lower === "content-length") {
      return "X-Assistant-Key";
    }
    return value;
  }

  function postAction(config, payload) {
    if (!config || typeof config.action_webhook_url !== "string" || !config.action_webhook_url) {
      return Promise.reject(fail("no-endpoint", "This briefing has no action endpoint yet."));
    }
    var headers = { "Content-Type": "application/json", "Accept": "application/json" };
    if (config.action_webhook_key) headers[headerName(config.action_webhook_header)] = config.action_webhook_key;
    var controller = new AbortController();
    var timer = window.setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
    return fetch(config.action_webhook_url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      signal: controller.signal
    }).then(function (res) {
      window.clearTimeout(timer);
      if (!res.ok) {
        var err = fail("http", "Your assistant returned an error.");
        err.status = res.status;
        throw err;
      }
      return { ok: true };
    }, function (err) {
      window.clearTimeout(timer);
      if (err && err.code) throw err;
      throw fail("network", "Couldn’t reach your assistant.");
    });
  }

  global.AssistantActions = { postAction: postAction };
})(window);
