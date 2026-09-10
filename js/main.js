/* ============================================================
   SOULMARA — intro sequence (real brand assets)
   1. Stacked SOUL / MARA logo fades in on cream
   2. The logo zooms straight into the "O" of SOUL (moon/star)
   3. Landing page is revealed
   The zoom origin (center of the O) is set in CSS on .intro__logo
   as --zoom-x / --zoom-y, measured from the logo artwork.
   ============================================================ */

(function () {
  "use strict";

  // Always land at the top on (re)load so the intro plays from the start.
  // 1. Stop the browser from restoring the previous scroll position.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  // 2. Jump to the top immediately, and again once everything has loaded
  //    (covers the async reveal + any late layout shifts). Force instant
  //    behavior so the page's smooth-scroll CSS doesn't animate the jump.
  const snapTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  snapTop();
  window.addEventListener("load", snapTop);

  const intro = document.getElementById("intro");
  const logo = document.getElementById("introLogo");
  const introImg = document.getElementById("introImg");
  const site = document.getElementById("site");

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Skip the intro when the visitor arrived by clicking the home logo
  // (e.g. from the música page). The flag is carried in sessionStorage,
  // set on the logo's click handler, so it survives navigation regardless
  // of how the server handles URLs / query strings. The URL param is kept
  // as a fallback. A genuine load / refresh / first visit has no flag and
  // still plays the intro.
  let skipIntro = false;
  try {
    if (sessionStorage.getItem("skipIntro") === "1") {
      skipIntro = true;
      sessionStorage.removeItem("skipIntro"); // one-shot: only this navigation
    }
  } catch (_) {
    /* sessionStorage unavailable (private mode, etc.) — fall through */
  }
  if (!skipIntro) {
    skipIntro = new URLSearchParams(window.location.search).has("skipIntro");
  }

  // If the page is restored from the back/forward cache, it was already
  // revealed on the first run — never replay the intro on restore.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      site.classList.add("is-visible", "reveal-hero", "reveal-layout");
      intro.classList.add("is-done");
      document.body.style.overflow = "";
    }
  });

  // Timings (ms)
  const HOLD_AFTER_FADE = 900; // pause on the logo before zooming
  const FADE_DURATION = 1400; // matches CSS introFadeIn
  const ZOOM_DURATION = 1500; // matches CSS introZoom
  const SITE_FADE_LEAD = 300; // bring the dark site in just before zoom ends

  // Staged reveal after the zoom lands
  const HERO_FADE = 1200; // matches .hero__bg opacity transition
  const HERO_TO_LAYOUT = 650; // let the photo settle before chrome appears

  function revealSite() {
    // Container appears on the dark background (no photo, no chrome yet)
    site.classList.add("is-visible");
  }

  function revealHero() {
    // Stage 1 — the band photo fades + eases in
    site.classList.add("reveal-hero");
  }

  function revealLayout() {
    // Stage 2 — nav, title, scroll cue and content rise into place
    site.classList.add("reveal-layout");
  }

  function finishIntro() {
    intro.classList.add("is-done");
    document.body.style.overflow = "";
  }

  function runIntro() {
    document.body.style.overflow = "hidden";

    // Phase 1 — fade in
    logo.classList.add("is-in");

    const zoomStart = FADE_DURATION + HOLD_AFTER_FADE;
    setTimeout(() => {
      // Phase 2 — zoom into the O
      logo.classList.remove("is-in");
      logo.classList.add("is-zoom");

      // Bring the (still empty, dark) site container in under the zoom
      setTimeout(revealSite, ZOOM_DURATION - SITE_FADE_LEAD);
      // Remove the splash once the zoom is fully done
      setTimeout(finishIntro, ZOOM_DURATION + 100);

      // Stage 1: hero photo fades in right after the zoom completes
      const heroStart = ZOOM_DURATION + 150;
      setTimeout(revealHero, heroStart);
      // Stage 2: layout appears once the photo has settled
      setTimeout(revealLayout, heroStart + HERO_TO_LAYOUT);
    }, zoomStart);
  }

  // Skip straight to a fully-visible site when either the visitor prefers
  // reduced motion, or arrived via the home logo (?skipIntro=1).
  if (prefersReduced || skipIntro) {
    // Tidy the flag out of the URL so a later refresh plays the intro again.
    if (skipIntro && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    revealSite();
    revealHero();
    revealLayout();
    finishIntro();
    return;
  }

  // Start once the logo image is decoded so the fade is smooth
  function start() {
    if (start._done) return;
    start._done = true;
    runIntro();
  }

  if (introImg.complete && introImg.naturalWidth > 0) {
    start();
  } else {
    introImg.addEventListener("load", start, { once: true });
    introImg.addEventListener("error", start, { once: true });
  }

  // Safety net: never leave the visitor stuck on the splash
  setTimeout(start, 2500);
})();

/* ============================================================
   SOULMARA — footer image carousel
   Auto-cycling cross-fade gallery with dots + arrows.
   ============================================================ */
(function () {
  "use strict";

  const track = document.getElementById("carouselTrack");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".carousel__slide"));
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");

  const INTERVAL = 7000; // ms each image stays before advancing
  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timer = null;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "carousel__dot" + (i === index ? " is-active" : "");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Imagen " + (i + 1));
    b.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(b);
    return b;
  });

  function goTo(next) {
    if (next === index) return;
    slides[index].classList.remove("is-active");
    dots[index].classList.remove("is-active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    dots[index].classList.add("is-active");
  }

  function advance() {
    goTo(index + 1);
  }

  // Always-on auto-play. The timer runs continuously from load and is
  // never paused. Manual navigation only resets the interval so a click or
  // keypress doesn't cause an immediate double-advance.
  function start() {
    if (prefersReduced || timer) return;
    timer = setInterval(advance, INTERVAL);
  }

  function resetTimer() {
    if (prefersReduced) return;
    if (timer) clearInterval(timer);
    timer = setInterval(advance, INTERVAL);
  }

  prevBtn.addEventListener("click", () => {
    goTo(index - 1);
    resetTimer();
  });
  nextBtn.addEventListener("click", () => {
    goTo(index + 1);
    resetTimer();
  });

  const carousel = document.getElementById("media");

  // Keyboard support when the carousel is focused
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      goTo(index - 1);
      resetTimer();
    } else if (e.key === "ArrowRight") {
      goTo(index + 1);
      resetTimer();
    }
  });

  // ---- Swipe / drag to cycle (touch + mouse) ----
  // The carousel cross-fades rather than sliding, so a swipe just triggers
  // next/prev on release once it passes a horizontal threshold. Vertical
  // gestures are ignored so page scrolling still works over the carousel.
  const viewport = carousel.querySelector(".carousel__viewport") || carousel;
  let swActive = false;
  let swX = 0;
  let swY = 0;
  let swAxis = null; // 'x' | 'y'
  const SWIPE_MIN = 40; // px to count as a swipe
  const AXIS_LOCK = 10; // px before deciding direction

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button != null && e.button !== 0) return;
    swActive = true;
    swAxis = null;
    swX = e.clientX;
    swY = e.clientY;
  });

  viewport.addEventListener(
    "pointermove",
    (e) => {
      if (!swActive) return;
      const dx = e.clientX - swX;
      const dy = e.clientY - swY;
      if (!swAxis) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        swAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (swAxis === "y") swActive = false; // let the page scroll
      }
      if (swAxis === "x" && e.cancelable) e.preventDefault();
    },
    { passive: false }
  );

  function endSwipe(e) {
    if (!swActive) return;
    swActive = false;
    if (swAxis !== "x") return;
    const dx = e.clientX - swX;
    if (Math.abs(dx) < SWIPE_MIN) return;
    // Swipe left → next image; swipe right → previous.
    goTo(index + (dx < 0 ? 1 : -1));
    resetTimer();
  }
  viewport.addEventListener("pointerup", endSwipe);
  viewport.addEventListener("pointercancel", () => (swActive = false));

  // Allow vertical scrolling but let us handle horizontal swipes.
  viewport.style.touchAction = "pan-y";

  // Start cycling right away and keep it running for the life of the page.
  start();
})();
