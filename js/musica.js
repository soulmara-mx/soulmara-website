/* ============================================================
   SOULMARA — staggered scroll reveal
   Elements fade + rise in one by one as they enter the viewport.
   Used by the música gallery (.record cards) and the press-kit page
   (.press__cover + .press__section). Each page only has one kind, so
   the same script serves both.
   ============================================================ */
(function () {
  "use strict";

  // On the press-kit page the whole sections animate, and the .record cards
  // in Lanzamientos ride along inside their section — so exclude records
  // nested in a section. On the música page records are top-level, so they
  // animate directly.
  const items = Array.from(
    document.querySelectorAll(".record, .press__cover, .press__section")
  ).filter(
    (el) => !(el.classList.contains("record") && el.closest(".press__section"))
  );
  if (!items.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Reduced motion (or no IntersectionObserver support): show everything
  // immediately, no animation.
  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  // Start hidden; the CSS transition runs when .is-in is added.
  items.forEach((el) => el.classList.add("reveal"));

  // Each fade lasts 2s (see CSS); the next starts partway in, so
  // consecutive items overlap for a smooth staggered cascade.
  const STAGGER = 500; // ms between each item starting its fade

  // Shared timeline so the stagger stays consistent no matter how the
  // observer batches entries. `nextRevealAt` is the earliest time the next
  // item is allowed to begin its fade; each reveal pushes it out by STAGGER.
  let nextRevealAt = 0;

  function scheduleReveal(el) {
    const now = performance.now();
    // Never schedule earlier than "now"; keep at least STAGGER between starts.
    const at = Math.max(now, nextRevealAt);
    nextRevealAt = at + STAGGER;
    setTimeout(() => el.classList.add("is-in"), at - now);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      // Reveal in document order so the cascade reads top-to-bottom even
      // when several items enter view in the same callback.
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => items.indexOf(a.target) - items.indexOf(b.target))
        .forEach((entry) => {
          scheduleReveal(entry.target);
          obs.unobserve(entry.target); // reveal once, then stop watching
        });
    },
    {
      // Trigger a little before the element is fully on screen.
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );

  items.forEach((el) => observer.observe(el));
})();
