/* ============================================================
   SOULMARA — event gallery page
   Reads ?id=<slug>, looks up the event in SOULMARA_EVENTS, and renders
   its photo grid. Clicking a photo opens a lightbox with prev/next.
   ============================================================ */
(function () {
  "use strict";

  // Read the event id from the hash (#slug) first — the hash survives any
  // server-side clean-URL rewriting, which can strip the query string. Fall
  // back to ?id= for compatibility with older/direct links.
  const hashId = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
  const queryId = new URLSearchParams(window.location.search).get("id");
  const id = hashId || queryId;
  const events = window.SOULMARA_EVENTS || {};
  // Show exactly the requested event. No silent fallback to another event —
  // an unknown/missing id shows the "not found" message instead, so the URL
  // always reflects what's on screen.
  const ev = id ? events[id] : null;

  const titleEl = document.getElementById("eventoTitle");
  const metaEl = document.getElementById("eventoMeta");
  const stripsEl = document.getElementById("galleryStrips");
  const emptyEl = document.getElementById("eventoEmpty");

  // A real gallery requires an actual photo folder (dir + count). Poster-only
  // placeholder events don't count as having a gallery, so they show the
  // "no gallery yet" message rather than a strip of the repeated cover.
  const hasGallery = !!(ev && ev.dir && ev.count);
  const photos = hasGallery && window.soulmaraEventPhotos
    ? window.soulmaraEventPhotos(ev)
    : [];

  // Not found, or no real gallery → show the fallback message.
  if (!ev || !hasGallery || !photos.length) {
    if (titleEl) titleEl.textContent = "Evento";
    if (emptyEl) emptyEl.hidden = false;
    if (ev) {
      titleEl.textContent = ev.title || "Evento";
      metaEl.textContent = [ev.date, ev.venue, ev.city]
        .filter(Boolean)
        .join(" · ");
    }
    document.title = (ev && ev.title ? ev.title : "Evento") + " — SOULMARA";
    return;
  }

  // Header
  titleEl.textContent = ev.title || "Evento";
  metaEl.textContent = [ev.date, ev.venue, ev.city].filter(Boolean).join(" · ");
  document.title = ev.title + " — SOULMARA";

  // ---- Build 3 continuously-scrolling strips ----
  // Photos are spread across the strips round-robin. The middle strip scrolls
  // the opposite way and a touch faster. Each strip works independently:
  // hover (desktop) or tap (mobile) slows only that strip.
  //
  // Movement is driven by a requestAnimationFrame loop (not CSS keyframes) so
  // the speed can change smoothly on hover WITHOUT the position jumping — we
  // keep the exact pixel position frame to frame and only vary the velocity.
  const STRIP_COUNT = 3;
  // Normal speeds in px/sec; middle strip a touch faster. Hovering eases to
  // SLOW_FACTOR of these. Halved from the original for a calmer pace.
  const SPEEDS = [35, 45, 30];
  const SLOW_FACTOR = 0.35;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const buckets = Array.from({ length: STRIP_COUNT }, () => []);
  photos.forEach((photo, i) => buckets[i % STRIP_COUNT].push({ photo, index: i }));

  // Each strip's single sequence must be wide enough to span the viewport so
  // the loop is seamless with no gap. Repeat the bucket enough times that its
  // width comfortably exceeds the screen. Repeating photos in a short strip is
  // fine/expected.
  const MIN_ITEMS_PER_SET = 8;

  const strips = []; // rAF loop state per strip

  buckets.forEach((bucket, s) => {
    if (!bucket.length) return;

    const strip = document.createElement("div");
    strip.className = "strip";

    const track = document.createElement("div");
    track.className = "strip__track";

    // How many times to repeat the bucket so one "set" is wide enough.
    const setReps = Math.max(1, Math.ceil(MIN_ITEMS_PER_SET / bucket.length));

    // Build one set (possibly repeated), then duplicate it once more so the
    // position can wrap by exactly one set width for a seamless loop.
    for (let copy = 0; copy < 2; copy++) {
      for (let rep = 0; rep < setReps; rep++) {
        bucket.forEach(({ photo, index }) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "strip__item";
          btn.setAttribute("aria-label", "Ver foto " + (index + 1));
          if (copy !== 0 || rep !== 0) btn.setAttribute("aria-hidden", "true");

          const img = document.createElement("img");
          img.src = photo.thumb;
          img.alt = ev.title + " — foto " + (index + 1);
          // Eager-load: lazy-loading in a moving marquee makes images pop to
          // full size mid-scroll and corrupts the loop-width measurement.
          img.decoding = "async";
          img.addEventListener("load", scheduleMeasure);

          btn.appendChild(img);
          btn.addEventListener("click", () => openLightbox(index));
          track.appendChild(btn);
        });
      }
    }

    strip.appendChild(track);

    const dir = s === 1 ? 1 : -1; // middle strip goes the opposite way
    const baseSpeed = SPEEDS[s % SPEEDS.length];
    const state = {
      track,
      dir,
      baseSpeed,
      pos: 0, // current offset in px
      speed: baseSpeed, // current velocity (px/sec), eases toward target
      targetSpeed: baseSpeed,
      setWidth: 0, // width of one set (half the track), measured after layout
    };
    strips.push(state);

    // Per-strip slow-down: hover (desktop) and tap-toggle (mobile) set the
    // target speed; the rAF loop eases toward it, so no positional jump.
    strip.addEventListener("mouseenter", () => (state.targetSpeed = baseSpeed * SLOW_FACTOR));
    strip.addEventListener("mouseleave", () => (state.targetSpeed = baseSpeed));
    strip.addEventListener("click", (e) => {
      if (e.target.closest(".strip__item")) return;
      const slow = state.targetSpeed !== baseSpeed;
      state.targetSpeed = slow ? baseSpeed : baseSpeed * SLOW_FACTOR;
    });

    stripsEl.appendChild(strip);
  });

  // Measure each set's width (one full sequence = half the track's scrollWidth)
  // once images have laid out, then run the animation loop.
  function measure() {
    strips.forEach((st) => {
      const newWidth = st.track.scrollWidth / 2;
      if (!st.setWidth) {
        st.setWidth = newWidth;
        // Start reverse strips offset by one set so they scroll into view too.
        st.pos = st.dir > 0 ? -st.setWidth : 0;
      } else if (newWidth > 0 && Math.abs(newWidth - st.setWidth) > 0.5) {
        // An image finished loading and changed the width — keep the current
        // visual position by scaling pos to the new width, so nothing jumps.
        st.pos = (st.pos / st.setWidth) * newWidth;
        st.setWidth = newWidth;
      }
    });
  }

  // Debounce re-measures triggered by image loads (many fire close together).
  let measureTimer = null;
  function scheduleMeasure() {
    if (measureTimer) return;
    measureTimer = setTimeout(() => {
      measureTimer = null;
      measure();
    }, 60);
  }

  if (!reduce && strips.length) {
    measure();
    // Measure after layout/images; recalc on resize.
    window.addEventListener("load", measure);
    setTimeout(measure, 200); // fallback if load already fired
    window.addEventListener("resize", measure);

    let last = performance.now();
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05); // seconds, clamped
      last = now;
      strips.forEach((st) => {
        if (!st.setWidth) return;
        // Ease current speed toward target for a smooth slow-down/speed-up.
        st.speed += (st.targetSpeed - st.speed) * Math.min(1, dt * 6);
        st.pos += st.dir * st.speed * dt;
        // Wrap within [-setWidth, 0] so the second copy fills seamlessly.
        if (st.pos <= -st.setWidth) st.pos += st.setWidth;
        else if (st.pos >= 0) st.pos -= st.setWidth;
        st.track.style.transform = "translateX(" + st.pos + "px)";
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Lightbox ---------------- */
  const box = document.getElementById("lightbox");
  const boxImg = document.getElementById("lightboxImg");
  const btnClose = document.getElementById("lightboxClose");
  const btnPrev = document.getElementById("lightboxPrev");
  const btnNext = document.getElementById("lightboxNext");
  let current = 0;

  function show(i) {
    current = (i + photos.length) % photos.length;
    boxImg.src = photos[current].full;
    boxImg.alt = ev.title + " — foto " + (current + 1);
  }
  function openLightbox(i) {
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }
  function closeLightbox() {
    box.hidden = true;
    boxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  // Click the backdrop (not the image/buttons) to close.
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });

  // Keyboard: Esc closes, arrows navigate.
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
})();
