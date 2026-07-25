/* =============================================================================
   main.js — templating, dynamic rendering, GSAP motion, GHL form submit
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};

  /* ---------------------------------------------------------------------------
     1) TEMPLATING — replace {{token}} in the DOM with values from SITE.
        (In GHL you can instead let {{custom_values.x}} be filled server-side
         and skip this step. Token names match 1:1 — see GHL-INTEGRATION.md.)
  --------------------------------------------------------------------------- */
  function fillTokens(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) { if (n.nodeValue.indexOf("{{") !== -1) nodes.push(n); }
    nodes.forEach(function (node) {
      node.nodeValue = node.nodeValue.replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (m, key) {
        return (SITE[key] != null) ? String(SITE[key]) : m;
      });
    });
    // Attributes (href="tel:{{phone_raw}}", src="{{hero_image}}", etc.)
    var all = root.querySelectorAll("*");
    all.forEach(function (el) {
      ["href", "src", "content", "alt"].forEach(function (attr) {
        var v = el.getAttribute && el.getAttribute(attr);
        if (v && v.indexOf("{{") !== -1) {
          el.setAttribute(attr, v.replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (m, key) {
            return (SITE[key] != null) ? String(SITE[key]) : m;
          }));
        }
      });
    });
  }

  /* ---------------------------------------------------------------------------
     2) RENDER LISTS from SITE arrays
  --------------------------------------------------------------------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderServices() {
    var el = document.querySelector("[data-services]");
    if (!el || !SITE.services) return;
    el.innerHTML = SITE.services.map(function (s, i) {
      var num = String(i + 1).padStart(2, "0");
      var thumb = s.image ? '<img class="service__thumb" src="' + esc(s.image) + '" alt="" loading="lazy">' : "";
      return '<li class="service" data-reveal-item>' +
        '<span class="service__num">' + num + '</span>' +
        '<div><h3 class="service__title">' + esc(s.title) + '</h3>' +
        '<p class="service__desc">' + esc(s.desc) + '</p></div>' +
        '<span class="service__arrow" aria-hidden="true">&rarr;</span>' +
        thumb + '</li>';
    }).join("");
  }

  function renderStats() {
    var el = document.querySelector("[data-stats]");
    if (!el || !SITE.about_stats) return;
    el.innerHTML = SITE.about_stats.map(function (s) {
      return '<div class="about__stat"><div class="value">' + esc(s.value) +
        '</div><div class="label">' + esc(s.label) + '</div></div>';
    }).join("");
  }

  function renderProjects() {
    var el = document.querySelector("[data-projects]");
    if (!el || !SITE.projects) return;
    el.innerHTML = SITE.projects.map(function (p) {
      return '<article class="project" data-reveal-item>' +
        '<div class="project__frame"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="project__caption"><div>' +
        '<div class="project__name">' + esc(p.name) + '</div>' +
        '<div class="project__loc">' + esc(p.location) + '</div></div>' +
        '<div class="project__type">' + esc(p.type) + '</div></div></article>';
    }).join("");
  }

  function renderQuotes() {
    var el = document.querySelector("[data-quotes]");
    if (!el || !SITE.testimonials) return;
    el.innerHTML = SITE.testimonials.map(function (t) {
      return '<blockquote class="quote" data-reveal-item>' +
        '<p class="quote__text">&ldquo;' + esc(t.quote) + '&rdquo;</p>' +
        '<div class="quote__attr">' + esc(t.author) +
        (t.meta ? ' <span class="quote__meta">· ' + esc(t.meta) + '</span>' : "") +
        '</div></blockquote>';
    }).join("");
  }

  function renderServiceSelect() {
    var el = document.querySelector("[data-service-select]");
    if (!el) return;
    var opts = ['<option value="">Select a service…</option>'];
    (SITE.services || []).forEach(function (s) { opts.push('<option value="' + esc(s.title) + '">' + esc(s.title) + '</option>'); });
    opts.push('<option value="Other">Something else</option>');
    el.innerHTML = opts.join("");
  }

  function renderMisc() {
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
    var soc = document.querySelector("[data-socials]");
    if (soc) {
      var links = [];
      if (SITE.facebook_url) links.push('<a href="' + esc(SITE.facebook_url) + '" target="_blank" rel="noopener">Facebook</a>');
      if (SITE.instagram_url) links.push('<a href="' + esc(SITE.instagram_url) + '" target="_blank" rel="noopener">Instagram</a>');
      soc.innerHTML = links.join("");
    }
  }

  /* ---------------------------------------------------------------------------
     3) NAV — scrolled state + mobile menu
  --------------------------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");

    function onScroll() { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.7); }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    function closeMenu() { if (!menu) return; menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.hidden;
        menu.hidden = !open; toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      menu.querySelectorAll("[data-menu-link]").forEach(function (a) { a.addEventListener("click", closeMenu); });
    }
  }

  /* ---------------------------------------------------------------------------
     4) GHL LEAD FORM submit
  --------------------------------------------------------------------------- */
  function initForm() {
    var form = document.querySelector("[data-lead-form]");
    if (!form) return;
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[data-submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.classList.remove("is-error");

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.source = "Website — " + (SITE.company_name || "");
      data.page_url = window.location.href;

      if (!data.full_name || !data.phone) {
        status.textContent = "Please add your name and phone.";
        status.classList.add("is-error");
        return;
      }

      var url = SITE.ghl_webhook_url;
      if (!url) {
        // Demo mode — no webhook configured yet.
        console.log("[Lead captured — demo mode] Paste a GHL webhook URL into config.js:", data);
        status.textContent = "Thanks! (Demo mode — connect your GHL webhook to receive this lead.)";
        form.reset();
        return;
      }

      submit.disabled = true;
      status.textContent = "Sending…";
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        status.textContent = "Thanks! We'll be in touch shortly.";
        form.reset();
      }).catch(function () {
        status.textContent = "Something went wrong — please call " + (SITE.phone_display || "us") + ".";
        status.classList.add("is-error");
      }).finally(function () { submit.disabled = false; });
    });
  }

  /* ---------------------------------------------------------------------------
     5) GSAP MOTION — gated behind matchMedia + reduced-motion
  --------------------------------------------------------------------------- */
  function initMotion() {
    if (!window.gsap) return;
    // Static build (index.static.html) drops the data-animate flag on the
    // nav element so content is never hidden by JS — it renders fully with
    // or without a live browser. (Checked on [data-nav], not <html>, so this
    // still works when this markup is pasted as a body-only fragment with
    // no <html> tag of its own, e.g. a GHL Custom Code embed.)
    var navEl = document.querySelector("[data-nav]");
    if (!navEl || !navEl.hasAttribute("data-animate")) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
      function (ctx) {
        var reduced = ctx.conditions.reduced;
        if (reduced) {
          gsap.set("[data-reveal], [data-reveal-item], .hero__title, [data-hero-title]", { clearProps: "all", opacity: 1, y: 0 });
          return;
        }

        gsap.defaults({ ease: "power3.out" });

        // Hero load-in
        var heroTitle = document.querySelector("[data-hero-title]");
        var tl = gsap.timeline({ delay: 0.15 });
        if (heroTitle) {
          gsap.set(heroTitle, { opacity: 1 });
          tl.from(heroTitle, { yPercent: 30, autoAlpha: 0, duration: 1.1, ease: "expo.out" });
        }
        tl.from(".hero .eyebrow, .hero__sub, .hero__actions", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, "-=0.7");
        tl.from(".hero__cue", { autoAlpha: 0, duration: 0.8 }, "-=0.4");

        // Hero parallax
        gsap.to(".hero__bg img", {
          yPercent: 12, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });

        // Generic reveals
        gsap.utils.toArray("[data-reveal]").forEach(function (el) {
          gsap.from(el, {
            y: 40, autoAlpha: 0, duration: 1,
            scrollTrigger: { trigger: el, start: "top 85%" }
          });
        });

        // Staggered items (services, projects, quotes)
        [".services", ".projects", ".quotes"].forEach(function (sel) {
          var wrap = document.querySelector(sel);
          if (!wrap) return;
          var items = wrap.querySelectorAll("[data-reveal-item]");
          if (!items.length) return;
          gsap.from(items, {
            y: 48, autoAlpha: 0, duration: 0.9, stagger: 0.12,
            scrollTrigger: { trigger: wrap, start: "top 80%" }
          });
        });

        // About image parallax
        var aboutImg = document.querySelector(".about__media img");
        if (aboutImg) {
          gsap.fromTo(aboutImg, { yPercent: -6 }, {
            yPercent: 6, ease: "none",
            scrollTrigger: { trigger: ".about__media", start: "top bottom", end: "bottom top", scrub: true }
          });
        }

        return function () {}; // cleanup handled by matchMedia
      }
    );
  }

  /* ---------------------------------------------------------------------------
     BOOT
  --------------------------------------------------------------------------- */
  // Resolve <img data-img="key"> straight from SITE (avoids the browser
  // pre-fetching a literal "{{token}}" URL and 404-ing before templating runs).
  function resolveImages() {
    document.querySelectorAll("[data-img]").forEach(function (el) {
      var key = el.getAttribute("data-img");
      if (SITE[key]) el.src = SITE[key];
    });
  }

  function boot() {
    fillTokens(document.documentElement);
    resolveImages();
    renderServices();
    renderStats();
    renderProjects();
    renderQuotes();
    renderServiceSelect();
    renderMisc();
    initNav();
    initForm();

    // Start entrance/scroll motion. If the tab is hidden (e.g. a background
    // preview pane), requestAnimationFrame is frozen and from()-based reveals
    // would leave content stuck invisible — so defer until the tab is shown.
    if (document.hidden) {
      document.addEventListener("visibilitychange", function onVis() {
        if (!document.hidden) {
          document.removeEventListener("visibilitychange", onVis);
          requestAnimationFrame(initMotion);
        }
      });
    } else {
      requestAnimationFrame(initMotion);
    }

    // Failsafe: never leave content hidden if the animation engine stalls
    // (throttled rAF, blocked CDN, etc.).
    setTimeout(function () {
      var t = document.querySelector(".hero__title");
      if (window.gsap && t && parseFloat(getComputedStyle(t).opacity) === 0) {
        gsap.set(
          [".hero__title", ".hero .eyebrow", ".hero__sub", ".hero__actions", ".hero__cue", "[data-reveal]", "[data-reveal-item]"],
          { autoAlpha: 1, y: 0, yPercent: 0, clearProps: "transform" }
        );
      }
    }, 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
