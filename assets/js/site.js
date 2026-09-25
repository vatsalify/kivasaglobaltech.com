/* Kivasa Globaltech — site script */
(function () {
  var WHATSAPP = "918200461631";
  var EMAIL = "info@kivasaglobaltech.com";

  // Mobile menu
  var nav = document.querySelector(".nav");
  var menu = document.querySelector(".menu");
  if (nav && menu) {
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      menu.textContent = open ? "Close" : "Menu";
    });
  }

  // Home hero: rotate through completed-project photos
  var hero = document.querySelector(".hero-slides");
  if (hero) {
    var slides = hero.querySelectorAll(".hero-slide");
    var dots = hero.querySelectorAll(".hero-dot");
    var signs = hero.querySelectorAll(".hero-now .board-sign");
    var nameEl = hero.querySelector(".hero-name");
    var metaEl = hero.querySelector(".hero-meta");
    var pauseBtn = hero.querySelector(".hero-pause");
    var idx = 0, timer = null, paused = false, DELAY = 6000;

    function load(img) {
      if (img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
    }
    function show(n) {
      var next = slides[n];
      load(next);
      var go = function () {
        slides[idx].classList.remove("is-on");
        // restart the zoom animation on the incoming slide
        next.classList.remove("is-on"); void next.offsetWidth; next.classList.add("is-on");
        idx = n;
        dots.forEach(function (d, i) { d.setAttribute("aria-pressed", i === n ? "true" : "false"); });
        signs.forEach(function (s) { s.hidden = s.dataset.for !== next.dataset.board; });
        nameEl.textContent = next.dataset.name;
        metaEl.textContent = next.dataset.scope + " · Commissioned " + next.dataset.year;
        load(slides[(n + 1) % slides.length]);
      };
      if (next.complete && next.naturalWidth) go();
      else next.addEventListener("load", go, { once: true });
    }
    function start() {
      stop();
      if (!paused && slides.length > 1) timer = setInterval(function () { show((idx + 1) % slides.length); }, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { if (i !== idx) show(i); start(); });
    });
    if (pauseBtn) pauseBtn.addEventListener("click", function () {
      paused = !paused;
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "Play" : "Pause";
      paused ? stop() : start();
    });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

    load(slides[1]);
    start();
  }

  // Project board filter
  document.querySelectorAll("[data-board]").forEach(function (board) {
    var buttons = board.querySelectorAll(".filters button");
    var rows = board.querySelectorAll("tbody tr");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        rows.forEach(function (r) {
          r.hidden = b.dataset.f !== "all" && r.dataset.status !== b.dataset.f;
        });
      });
    });
  });

  // IST clock on the project board
  var clocks = document.querySelectorAll(".clock");
  function tick() {
    var t;
    try {
      t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());
    } catch (e) { return; }
    clocks.forEach(function (c) { c.textContent = t + " IST"; });
  }
  if (clocks.length) { tick(); setInterval(tick, 15000); }

  // Product catalogue: category chips + search
  var grid = document.querySelector(".pgrid");
  if (grid) {
    var cards = grid.querySelectorAll(".pcard");
    var chips = document.querySelectorAll(".chips button");
    var search = document.getElementById("product-search");
    var count = document.getElementById("product-count");
    var empty = document.getElementById("product-empty");
    var current = "all";

    var hash = location.hash.replace("#", "");
    if (hash) {
      chips.forEach(function (c) { if (c.dataset.cat === hash) current = hash; });
    }

    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (current === "all" || card.dataset.cat === current) &&
                 (!q || card.dataset.name.indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown++;
      });
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.cat === current ? "true" : "false"); });
      if (count) count.textContent = shown + (shown === 1 ? " product" : " products");
      if (empty) empty.hidden = shown !== 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        current = c.dataset.cat;
        apply();
        try { history.replaceState(null, "", current === "all" ? location.pathname : "#" + current); } catch (e) {}
      });
    });
    if (search) search.addEventListener("input", function () {
      if (search.value.trim()) current = "all";
      apply();
    });
    apply();
  }

  // Enquiry form: sends the details to Kivasa on WhatsApp (email as fallback)
  document.querySelectorAll("form.enquiry").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var lines = ["New enquiry from kivasaglobaltech.com", ""];
      [["name", "Name"], ["company", "Company"], ["phone", "Phone"], ["email", "Email"], ["type", "Project type"], ["requirement", "Requirement"]].forEach(function (f) {
        var v = (d.get(f[0]) || "").toString().trim();
        if (v) lines.push(f[1] + ": " + v);
      });
      var text = lines.join("\n");
      var wa = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);
      var mail = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Enquiry from " + (d.get("name") || "website")) + "&body=" + encodeURIComponent(text);

      var status = form.querySelector(".form-status");
      status.innerHTML = "";
      status.append("WhatsApp is opening with your details filled in. Press send to reach our team, and attach your BOQ or drawings there. ");
      var a1 = document.createElement("a"); a1.href = wa; a1.target = "_blank"; a1.rel = "noopener"; a1.textContent = "Open WhatsApp again";
      var a2 = document.createElement("a"); a2.href = mail; a2.textContent = "send by email instead";
      status.append(a1, " or ", a2, ".");
      status.hidden = false;
      window.open(wa, "_blank", "noopener");
    });
  });
})();
