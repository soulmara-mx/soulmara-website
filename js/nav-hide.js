/* ============================================================
   SOULMARA — hide-on-scroll nav
   Hides the fixed header when scrolling down (so it doesn't cover content)
   and reveals it when scrolling up. Always visible near the top of the page.
   Shared across all pages.
   ============================================================ */
(function () {
  "use strict";

  const nav = document.querySelector(".nav");
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  // How far you must scroll down before hiding, and a small delta so tiny
  // jitters don't toggle it.
  const HIDE_AFTER = 120; // px from top before hiding is allowed
  const DELTA = 6; // min scroll change to react to

  function update() {
    ticking = false;
    const y = window.scrollY;
    const diff = y - lastY;

    if (Math.abs(diff) < DELTA) return; // ignore micro-scrolls

    if (diff > 0 && y > HIDE_AFTER) {
      // Scrolling down and past the threshold → hide.
      nav.classList.add("nav--hidden");
    } else if (diff < 0) {
      // Scrolling up → show.
      nav.classList.remove("nav--hidden");
    }
    lastY = y;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
})();
