/* SIKLAB/68 site runtime — theme · accent · scale · nav · count-up · pixel art · copy */
(function () {
  "use strict";
  var d = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toasts ---------- */
  var toastBox = document.querySelector(".toasts");
  function notify(msg) {
    if (!toastBox) return;
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    toastBox.appendChild(t);
    while (toastBox.children.length > 3) toastBox.removeChild(toastBox.firstChild);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
  }

  /* ---------- mode switches ---------- */
  var MODES = {
    theme:  { attr: "data-theme",  key: "skb_theme",  a: "light", b: "dark" },
    accent: { attr: "data-accent", key: "skb_accent", a: "pula",  b: "mono" },
    scale:  { attr: "data-scale",  key: "skb_scale",  a: "90",    b: "100" }
  };
  var readout = document.getElementById("mode-readout");
  function paint() {
    Object.keys(MODES).forEach(function (name) {
      var m = MODES[name], v = d.getAttribute(m.attr) || m.a;
      document.querySelectorAll('[data-switch="' + name + '"]').forEach(function (btn) {
        btn.setAttribute("aria-checked", String(v === m.b));
        btn.querySelectorAll("span[data-v]").forEach(function (s) { s.classList.toggle("on", s.getAttribute("data-v") === v); });
      });
    });
    if (readout) {
      readout.textContent = "MODEL: KR-26 / MODE: " + (d.getAttribute("data-accent") === "mono" ? "B·MONO" : "A·PULA") +
        " / " + (d.getAttribute("data-theme") === "dark" ? "GABI" : "ARAW") + " / " + (d.getAttribute("data-scale") || "90") + "%";
    }
  }
  document.querySelectorAll("[data-switch]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var m = MODES[btn.getAttribute("data-switch")];
      var next = (d.getAttribute(m.attr) || m.a) === m.b ? m.a : m.b;
      d.setAttribute(m.attr, next); store.set(m.key, next); paint();
    });
  });
  // follow OS theme until the user chooses
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onOs = function (e) { if (store.get("skb_theme")) return; d.setAttribute("data-theme", e.matches ? "dark" : "light"); paint(); };
    if (mq.addEventListener) mq.addEventListener("change", onOs);
  }
  paint();

  /* ---------- active section: nav + rail ---------- */
  var links = document.querySelectorAll("[data-sec]");
  var railLabel = document.getElementById("rail-label"), railNum = document.getElementById("rail-num");
  var NUM = { cover: "00", about: "01", skills: "02", projects: "03", experience: "04", record: "05", contact: "06" };
  var NAME = { cover: "cover", about: "about", skills: "stack", projects: "work", experience: "log", record: "record", contact: "contact" };
  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("data-sec") === id;
      a.classList.toggle(a.parentNode.classList.contains("rail-dots") ? "on" : "active", on);
      if (!a.parentNode.classList.contains("rail-dots")) { if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }
    });
    if (railLabel) railLabel.textContent = (NAME[id] || id) + "—";
    if (railNum) railNum.textContent = NUM[id] || "00";
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(NUM).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- count-up (stepped) ---------- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-count"), 10) || 0;
    var pad = parseInt(el.getAttribute("data-pad"), 10) || 2;
    var suf = el.getAttribute("data-suffix") || "";
    var fmt = function (n) { return String(n).padStart(pad, "0") + suf; };
    if (reduced) { el.textContent = fmt(to); return; }
    var f = 0, id = setInterval(function () { f++; el.textContent = fmt(Math.round(to * f / 20)); if (f >= 20) clearInterval(id); }, 40);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: .4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- pixel mosaic (one hue, stepped opacity) ---------- */
  var px = document.getElementById("pixel-art");
  if (px) {
    var s = 11, r = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    var n = 28, orbs = [[9, 10, 6.2], [19, 8, 4.6], [15, 19, 5.4], [24, 21, 3.2]], out = "";
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var dd = 99; orbs.forEach(function (o) { dd = Math.min(dd, Math.hypot(x - o[0], y - o[1]) - o[2]); });
      var o = 0;
      if (dd < -2) o = r() > .15 ? 1 : .7; else if (dd < 0) o = r() > .4 ? .7 : .45;
      else if (dd < 1.5) o = r() > .55 ? .3 : 0; else o = r() > .93 ? .18 : 0;
      if (o) out += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" class="fill-red" opacity="' + o + '"/>';
    }
    px.innerHTML = out;
  }

  /* ---------- copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      var ok = function () { notify("Copied — " + v); }, bad = function () { notify("Copy blocked — " + v); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, bad); else bad();
    });
  });
})();
