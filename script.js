(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
    });
  }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  document.documentElement.classList.add('js-reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();

(function () {
  function syncPause() {
    var hidden = document.hidden;
    document.documentElement.classList.toggle("is-paused", hidden);
    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      if (hidden) {
        if (!v.paused) v.setAttribute("data-was-playing", "1");
        try { v.pause(); } catch (e) {}
      } else if (v.hasAttribute("data-was-playing") || v.hasAttribute("autoplay")) {
        v.removeAttribute("data-was-playing");
        var play = v.play();
        if (play && play.catch) play.catch(function () {});
      }
    }
  }
  document.addEventListener("visibilitychange", syncPause);
  syncPause();
})();
