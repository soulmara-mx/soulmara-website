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

  // ---- Upcoming events: click opens the flyer in a lightbox ----
  // These cards have no gallery (future shows), so tapping shows the full
  // flyer instead. The lightbox is built on demand so no page needs extra
  // markup; it reuses the shared .lightbox styles.
  const flyerCards = Array.from(document.querySelectorAll(".event--flyer"));
  if (flyerCards.length) {
    let box = null;
    let boxImg = null;

    function buildBox() {
      box = document.createElement("div");
      box.className = "lightbox";
      box.hidden = true;

      const close = document.createElement("button");
      close.className = "lightbox__close";
      close.type = "button";
      close.setAttribute("aria-label", "Cerrar");
      close.textContent = "×";

      boxImg = document.createElement("img");
      boxImg.className = "lightbox__img";
      boxImg.alt = "";

      box.appendChild(close);
      box.appendChild(boxImg);
      document.body.appendChild(box);

      close.addEventListener("click", closeBox);
      box.addEventListener("click", (e) => {
        if (e.target === box) closeBox();
      });
      document.addEventListener("keydown", (e) => {
        if (!box.hidden && e.key === "Escape") closeBox();
      });
    }

    function openBox(src, alt) {
      if (!box) buildBox();
      boxImg.src = src;
      boxImg.alt = alt || "";
      box.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function closeBox() {
      box.hidden = true;
      boxImg.removeAttribute("src");
      document.body.style.overflow = "";
    }

    flyerCards.forEach((card) => {
      card.classList.add("event--link");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      const flyer = card.getAttribute("data-flyer");
      const name = card.querySelector(".event__name");
      const label = name ? name.textContent.trim() : "Evento";
      const open = () => openBox(flyer, label);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  }
})();
