(function () {
  var btn = document.querySelector(".book-menu");
  var nav = document.getElementById("book-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }
  });
})();
