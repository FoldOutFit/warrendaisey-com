/* Warren Daisey Shop: catalog + embedded Stripe Checkout.
 * Publishable key is the live pk_live_ of Warren Daisey Shop (acct_1UfYYoIk6hu03T5X).
 * Secret/restricted keys are NOT in this file — they go only in Cloudflare Worker secrets.
 *
 * Checkout API is the Cloudflare Worker at PRODUCTION_ENDPOINT.
 * Secret/restricted keys are never in this file.
 */
(function () {
  "use strict";
  var PUBLISHABLE_KEY = "pk_live_51UfYYoIk6hu03T5XieamS4LEGIyZlPmCN1ipIxo6qICX97oYJJ8wLkBBDkHgrhChwK16iE0N9WQdBgTUuMsj3HD100fzkWFlKK";
  var CATAN_PRICE_ID = "price_1UfYtsIk6hu03T5XOQfg2Ohl";
  var PRODUCTION_ENDPOINT = "https://wd-shop-checkout.wtdaisey.workers.dev";
  var ENDPOINT = PRODUCTION_ENDPOINT;

  var SHOP_EMAIL = "wtdaisey@gmail.com";
  var params = new URLSearchParams(location.search);

  function $(sel, rootEl) { return (rootEl || document).querySelector(sel); }
  function $$(sel, rootEl) { return Array.prototype.slice.call((rootEl || document).querySelectorAll(sel)); }

  function money(amount, currency) {
    if (amount == null) return "";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currency || "usd").toUpperCase(),
        minimumFractionDigits: amount % 100 === 0 ? 0 : 2
      }).format(amount / 100);
    } catch (e) {
      return "$" + (amount / 100).toFixed(2);
    }
  }

  function returnUrl() {
    var base = location.origin + location.pathname;
    return base + "?paid={CHECKOUT_SESSION_ID}#listing";
  }

  function showSuccess(email, sessionId) {
    var area = $("#buy-area");
    if (!area) return;
    var download = ENDPOINT + "/download?session_id=" + encodeURIComponent(sessionId);
    area.innerHTML =
      '<div class="pay-success" role="status">' +
      "<p>Thank you! Your payment went through" +
      (email ? " and a receipt was sent to " + email : "") +
      ". Download your files below.</p>" +
      '<a class="btn" href="' + download + '">Download zip</a>' +
      "</div>";
  }

  function showIncomplete() {
    var area = $("#buy-area");
    if (!area || area.querySelector(".pay-error")) return;
    var p = document.createElement("p");
    p.className = "pay-error";
    p.setAttribute("role", "status");
    p.textContent = "Your payment wasn’t completed. You can try again below.";
    area.insertBefore(p, area.firstChild);
  }

  if (params.get("paid")) {
    fetch(ENDPOINT + "/session-status?session_id=" + encodeURIComponent(params.get("paid")))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.status === "complete" && d.payment_status === "paid") showSuccess(d.email, params.get("paid"));
        else showIncomplete();
      })
      .catch(function () { showIncomplete(); });
  }

  var stripeReady = null;
  function loadStripe() {
    if (stripeReady) return stripeReady;
    stripeReady = new Promise(function (resolve, reject) {
      if (window.Stripe) return resolve(window.Stripe(PUBLISHABLE_KEY));
      var sc = document.createElement("script");
      sc.src = "https://js.stripe.com/v3/";
      sc.onload = function () { window.Stripe ? resolve(window.Stripe(PUBLISHABLE_KEY)) : reject(new Error("no Stripe")); };
      sc.onerror = function () { reject(new Error("Stripe.js failed to load")); };
      document.head.appendChild(sc);
    });
    stripeReady.catch(function () { stripeReady = null; });
    return stripeReady;
  }

  var current = null;
  function close() {
    if (!current) return;
    try { current.checkout && current.checkout.destroy(); } catch (e) {}
    current.overlay.remove();
    document.body.classList.remove("wd-pay-open");
    document.removeEventListener("keydown", onKey);
    if (current.opener) current.opener.focus();
    current = null;
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  function openCheckout(priceId, opener) {
    var overlay = document.createElement("div");
    overlay.className = "wd-pay-overlay";
    overlay.innerHTML =
      '<div class="wd-pay-box" role="dialog" aria-modal="true" aria-label="Secure checkout">' +
      '<button type="button" class="wd-pay-close" aria-label="Close checkout">&times;</button>' +
      '<div class="wd-pay-msg">Loading secure checkout&hellip;</div>' +
      '<div id="wd-pay-mount"></div></div>';
    document.body.appendChild(overlay);
    document.body.classList.add("wd-pay-open");
    current = { overlay: overlay, opener: opener, checkout: null };
    var mine = current;
    overlay.querySelector(".wd-pay-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);
    overlay.querySelector(".wd-pay-close").focus();

    function fail(msg) {
      if (current !== mine) return;
      var box = overlay.querySelector(".wd-pay-msg");
      if (box) box.textContent = msg || "Checkout could not be started. You can try again in a moment.";
    }

    var secretP = fetch(ENDPOINT + "/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_id: priceId, product: opener && opener.getAttribute("data-product") || undefined, return_url: returnUrl() })
    }).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok || !d.clientSecret) throw new Error(d.error || ("session " + r.status));
        return d.clientSecret;
      });
    });

    Promise.all([loadStripe(), secretP]).then(function (res) {
      var stripe = res[0], secret = res[1];
      var make = stripe.initEmbeddedCheckout || stripe.createEmbeddedCheckoutPage;
      if (!make) throw new Error("embedded checkout unsupported");
      return make.call(stripe, { fetchClientSecret: function () { return Promise.resolve(secret); } });
    }).then(function (checkout) {
      if (current !== mine) { try { checkout.destroy(); } catch (e) {} return; }
      mine.checkout = checkout;
      var msg = overlay.querySelector(".wd-pay-msg");
      if (msg) msg.remove();
      checkout.mount("#wd-pay-mount");
    }).catch(function (err) {
      fail(err && /missing STRIPE_SECRET_KEY|503/.test(String(err))
        ? "Checkout is not connected yet. The shop’s secret key still needs to be placed in the API environment."
        : "Checkout could not be started. Please try again in a moment.");
    });
  }

  function wireBuy(btn) {
    if (!btn || btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", function () {
      var priceId = btn.getAttribute("data-price-id");
      if (!priceId) {
        // Allow the static Catan button to resolve via metadata.sku on the server.
        if (btn.getAttribute("data-product") === "catan") {
          openCheckout("", btn);
          return;
        }
        return;
      }
      openCheckout(priceId, btn);
    });
  }

  function renderExtras(products) {
    var host = $("#more-products");
    if (!host) return;
    var extras = products.filter(function (p) { return p.sku !== "catan-box-organizer"; });
    if (!extras.length) { host.hidden = true; return; }
    host.hidden = false;
    host.innerHTML = "<h2 class=\"more-heading\">More from the shop</h2>";
    extras.forEach(function (p) {
      var article = document.createElement("article");
      article.className = "product product-extra";
      var price = (p.prices || []).find(function (x) { return x.type === "one_time"; }) || (p.prices || [])[0];
      var isInvoice = p.delivery === "invoice" || !price;
      var action;
      if (isInvoice) {
        action = '<a class="btn" href="mailto:' + SHOP_EMAIL + '?subject=' +
          encodeURIComponent("Invoice request: " + p.name) + '">Request an invoice</a>' +
          '<p class="buy-note">Trainings and custom slide decks are billed with a Stripe invoice from Warren Daisey Shop.</p>';
      } else {
        action = '<button type="button" class="btn" data-price-id="' + price.id + '">Buy — ' +
          money(price.unit_amount, price.currency) + "</button>";
      }
      article.innerHTML =
        '<div class="product-copy">' +
        (p.category ? '<p class="tag">' + p.category.replace(/-/g, " ") + "</p>" : "") +
        "<h2>" + p.name + "</h2>" +
        (price && !isInvoice ? '<p class="price">' + money(price.unit_amount, price.currency) + "</p>" : '<p class="price">By invoice</p>') +
        (p.description ? '<p class="desc">' + p.description + "</p>" : "") +
        "<div class=\"buy-area\">" + action + "</div></div>";
      host.appendChild(article);
      var btn = article.querySelector("button.btn[data-price-id]");
      if (btn) wireBuy(btn);
    });
  }

  function applyCatanPrice(products) {
    var catan = (products || []).find(function (p) {
      return p.sku === "catan-box-organizer" || p.id === "prod_VgwnNhukbCFbYJ";
    });
    var btn = $("#buy-catan");
    if (!btn) return;
    if (!btn.getAttribute("data-price-id")) btn.setAttribute("data-price-id", CATAN_PRICE_ID);
    if (catan) {
      var price = (catan.prices || []).find(function (x) { return x.id === CATAN_PRICE_ID; })
        || (catan.prices || []).find(function (x) { return x.type === "one_time"; })
        || (catan.prices || [])[0];
      if (price) {
        btn.setAttribute("data-price-id", price.id);
        btn.textContent = "Buy — " + money(price.unit_amount, price.currency);
        var tag = document.querySelector("#listing .price");
        if (tag) tag.textContent = money(price.unit_amount, price.currency);
      }
    }
    wireBuy(btn);
  }

  function loadCatalog() {
    applyCatanPrice([]);
    fetch(ENDPOINT + "/products")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var products = d.products || [];
        applyCatanPrice(products);
        renderExtras(products);
      })
      .catch(function () { applyCatanPrice([]); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadCatalog);
  else loadCatalog();
})();
