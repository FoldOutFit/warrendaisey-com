(function () {
  var root = document.getElementById("snow");
  if (!root) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var n = reduce ? 16 : 56;
  for (var i = 0; i < n; i++) {
    var flake = document.createElement("span");
    var big = !reduce && Math.random() < 0.12;
    if (big) {
      flake.className = "flake";
      flake.textContent = Math.random() < 0.5 ? "❄" : "✻";
      flake.style.setProperty("--size", 10 + Math.random() * 14 + "px");
    } else {
      flake.style.setProperty("--size", 2 + Math.random() * 5 + "px");
    }
    flake.style.left = Math.random() * 100 + "%";
    flake.style.setProperty("--o", 0.35 + Math.random() * 0.5);
    flake.style.setProperty("--d", 8 + Math.random() * 14 + "s");
    flake.style.setProperty("--delay", -Math.random() * 18 + "s");
    flake.style.setProperty("--x", Math.random() * 70 - 35 + "px");
    flake.style.setProperty("--rot", (120 + Math.random() * 200) + "deg");
    if (reduce) {
      flake.style.animation = "none";
      flake.style.top = Math.random() * 80 + "%";
    }
    root.appendChild(flake);
  }
})();
