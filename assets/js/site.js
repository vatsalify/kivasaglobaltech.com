/* Kivasa Globaltech — site script */
(function () {
  var WHATSAPP = "918200461631";

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

  // Project photo slideshows (projects page)
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-slides]").forEach(function (box) {
    var imgs = box.querySelectorAll(".sl");
    var dots = box.querySelectorAll(".sl-dot");
    var count = box.querySelector(".sl-count");
    var n = imgs.length, idx = 0, timer = null, visible = false, hold = false;
    function load(i) {
      var im = imgs[i];
      if (im && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute("data-src"); }
    }
    function show(i) {
      i = (i + n) % n;
      load(i);
      imgs[idx].classList.remove("is-on");
      imgs[i].classList.add("is-on");
      idx = i;
      dots.forEach(function (d, k) { d.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      if (count) count.textContent = (i + 1) + " / " + n;
      load((i + 1) % n);
    }
    function tick() {
      clearInterval(timer); timer = null;
      if (!reduceMotion && visible && !hold) timer = setInterval(function () { show(idx + 1); }, 4500);
    }
    box.querySelector(".sl-prev").addEventListener("click", function () { show(idx - 1); tick(); });
    box.querySelector(".sl-next").addEventListener("click", function () { show(idx + 1); tick(); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); tick(); }); });
    box.addEventListener("mouseenter", function () { hold = true; tick(); });
    box.addEventListener("mouseleave", function () { hold = false; tick(); });
    box.addEventListener("focusin", function () { hold = true; tick(); });
    box.addEventListener("focusout", function () { hold = false; tick(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(idx - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { show(idx + 1); e.preventDefault(); }
    });
    var x0 = null;
    box.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    box.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { show(idx + (dx < 0 ? 1 : -1)); tick(); }
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) load(1);
        tick();
      }, { threshold: 0.4 }).observe(box);
    } else { visible = true; load(1); tick(); }
    document.addEventListener("visibilitychange", function () { if (document.hidden) { clearInterval(timer); timer = null; } else tick(); });
  });

  // Project board filter
  document.querySelectorAll("[data-board]").forEach(function (board) {
    var buttons = board.querySelectorAll(".filters button");
    var rows = board.querySelectorAll("tbody tr");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        rows.forEach(function (r) {
          var f = b.dataset.f;
          r.hidden = f !== "all" && (f.indexOf("s:") === 0 ? r.dataset.sector !== f.slice(2) : r.dataset.status !== f);
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

  // Enquiry form: submitted to Web3Forms, which emails it to the Kivasa inbox.
  // Without JavaScript the form still posts normally and Web3Forms redirects to /thank-you/.
  document.querySelectorAll("form.enquiry").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');

    function waLink() {
      var d = new FormData(form), lines = ["Hello Kivasa, I'd like a quote."];
      [["name", "Name"], ["company", "Company"], ["phone", "Phone"], ["project_type", "Project type"], ["city", "City"], ["requirement", "Requirement"]].forEach(function (f) {
        var v = (d.get(f[0]) || "").toString().trim();
        if (v) lines.push(f[1] + ": " + v);
      });
      return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
    }
    function say(kind, text, linkText, href) {
      status.className = "form-status" + (kind === "error" ? " error" : "");
      status.textContent = text + " ";
      if (linkText) {
        var a = document.createElement("a");
        a.href = href; a.target = "_blank"; a.rel = "noopener"; a.textContent = linkText;
        status.appendChild(a);
      }
      status.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      if (data.get("botcheck")) return;
      data.set("replyto", (data.get("email") || "").toString());
      button.disabled = true;
      var label = button.textContent;
      button.textContent = "Sending…";

      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || "Submission failed");
          var wa = waLink();
          form.reset();
          say("ok", "Thank you, we've received your enquiry and will reply within one business day. Have drawings or a BOQ?", "Send them on WhatsApp.", wa);
        })
        .catch(function () {
          say("error", "Your enquiry couldn't be sent just now. Please try again, or", "send it to us on WhatsApp instead.", waLink());
        })
        .then(function () { button.disabled = false; button.textContent = label; });
    });
  });
})();
