/* ============================================================
   SOULMARA — eventos listing enhancements
   For each past-event card ([data-event]):
   1. Make it link to its gallery (evento.html?id=<slug>).
   2. On hover (pointer-capable devices only), cycle the card photo
      through that event's thumbnails as a lightweight preview carousel.
   Progressive enhancement: without JS the cards still show the poster.
   ============================================================ */
(function () {
  "use strict";

  const events = window.SOULMARA_EVENTS || {};
  const getPhotos = window.soulmaraEventPhotos || (() => []);
  const cards = Array.from(document.querySelectorAll(".event[data-event]"));
  if (!cards.length) return;

  // Only run the hover carousel where hovering is meaningful (mouse/trackpad)
  // and the user hasn't asked to reduce motion.
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CYCLE = 900; // ms between preview frames

  cards.forEach((card) => {
    const id = card.getAttribute("data-event");
    const ev = events[id];
    if (!ev) return;

    // Cards are real <a> links in the HTML now, so navigation works without
    // JS. This just marks them for the hover affordance.
    card.classList.add("event--link");

    // Hover preview carousel (desktop only).
    const photoEl = card.querySelector(".event__photo");
    const photos = getPhotos(ev);
    // Nothing to cycle if there's 0-1 photos, or hover isn't available.
    if (!photoEl || !canHover || reduce || photos.length < 2) return;

    const original = photoEl.style.backgroundImage; // the poster
    let timer = null;
    let idx = 0;
    let preloaded = false;

    function preload() {
      if (preloaded) return;
      preloaded = true;
      photos.forEach((p) => {
        const img = new Image();
        img.src = p.thumb;
      });
    }

    function frame() {
      idx = (idx + 1) % photos.length;
      photoEl.style.backgroundImage = "url('" + photos[idx].thumb + "')";
    }

    card.addEventListener("mouseenter", () => {
      preload();
      idx = 0;
      photoEl.style.backgroundImage = "url('" + photos[0].thumb + "')";
      card.classList.add("is-previewing");
      timer = setInterval(frame, CYCLE);
    });
    card.addEventListener("mouseleave", () => {
      if (timer) clearInterval(timer);
      timer = null;
      card.classList.remove("is-previewing");
      photoEl.style.backgroundImage = original; // back to the poster
    });
  });
})();
