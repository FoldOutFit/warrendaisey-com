(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var root = document.getElementById("snow");
  if (root) {
    var n = reduce ? 28 : 120;
    for (var i = 0; i < n; i++) {
      var flake = document.createElement("span");
      var big = !reduce && Math.random() < 0.18;
      if (big) {
        flake.className = "flake";
        flake.textContent = Math.random() < 0.5 ? "❄" : "✻";
        flake.style.setProperty("--size", 11 + Math.random() * 16 + "px");
      } else {
        flake.style.setProperty("--size", 2 + Math.random() * 5.5 + "px");
      }
      flake.style.left = Math.random() * 100 + "%";
      flake.style.setProperty("--o", 0.4 + Math.random() * 0.5);
      flake.style.setProperty("--d", 7 + Math.random() * 14 + "s");
      flake.style.setProperty("--delay", -Math.random() * 18 + "s");
      flake.style.setProperty("--x", Math.random() * 80 - 40 + "px");
      flake.style.setProperty("--rot", (120 + Math.random() * 200) + "deg");
      if (reduce) {
        flake.style.animation = "none";
        flake.style.top = Math.random() * 80 + "%";
      }
      root.appendChild(flake);
    }
  }

  var colors = ["red", "green", "gold", "red", "green", "gold", "white"];
  var sections = document.querySelectorAll(
    "#about, #wins, #experience, #projects, #forensics, #education, #volunteering, #publications, #recommendations, #contact"
  );
  sections.forEach(function (sec) {
    var festoon = document.createElement("div");
    festoon.className = "section-festoon";
    festoon.setAttribute("aria-hidden", "true");
    var snow = document.createElement("div");
    snow.className = "section-snow";
    snow.innerHTML = '<svg viewBox="0 0 1440 22" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF7EC" d="M0 22 L0 10 C80 2 160 16 240 8 C320 0 400 14 480 6 C560 0 640 14 720 7 C800 0 880 14 960 6 C1040 0 1120 14 1200 8 C1280 2 1360 14 1440 8 L1440 22 Z"/><path fill="#f4f8ff" d="M0 22 L0 14 C120 6 240 16 360 10 C480 4 600 16 720 10 C840 4 960 16 1080 10 C1200 4 1320 16 1440 12 L1440 22 Z" opacity="0.9"/></svg>';
    var row = document.createElement("div");
    row.className = "section-lights";
    var count = 22;
    for (var j = 0; j < count; j++) {
      var b = document.createElement("span");
      b.className = "bulb " + colors[j % colors.length];
      row.appendChild(b);
    }
    festoon.appendChild(snow);
    festoon.appendChild(row);
    sec.insertBefore(festoon, sec.firstChild);
  });
})();
