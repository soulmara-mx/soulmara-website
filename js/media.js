/* ============================================================
   SOULMARA — MEDIA wall
   Pulls every photo from all events that have a real gallery, shuffles them,
   and shows them across 5 continuously-scrolling strips (same mechanic as the
   event gallery page). Clicking a photo opens a lightbox.
   ============================================================ */
(function () {
  "use strict";

  const events = window.SOULMARA_EVENTS || {};
  const getPhotos = window.soulmaraEventPhotos || (() => []);
  const stripsEl = document.getElementById("mediaStrips");
  if (!stripsEl) return;

  // Gather photos from every event that has a real gallery (dir + count).
  // Poster-only placeholders are skipped so the wall is all real photos.
  let allPhotos = [];
  Object.keys(events).forEach((id) => {
    const ev = events[id];
    if (ev && ev.dir && ev.count) {
      getPhotos(ev).forEach((p) =>
        allPhotos.push({ full: p.full, thumb: p.thumb, title: ev.title })
      );
    }
  });

  if (!allPhotos.length) return;

  // Shuffle (Fisher–Yates) for a random order each visit.
  for (let i = allPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
  }

  const STRIP_COUNT = 5;
  // Per-strip base speeds (px/sec); varied so strips don't march in lockstep.
  // Halved from the original for a calmer pace.
  const SPEEDS = [30, 40, 28, 36, 32];
  const SLOW_FACTOR = 0.35;
  const MIN_ITEMS_PER_SET = 8;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Distribute the shuffled photos round-robin across the strips.
  const buckets = Array.from({ length: STRIP_COUNT }, () => []);
  allPhotos.forEach((photo, i) => buckets[i % STRIP_COUNT].push({ photo, index: i }));

  const strips = []; // rAF loop state per strip

  buckets.forEach((bucket, s) => {
    if (!bucket.length) return;

    const strip = document.createElement("div");
    strip.className = "strip";

    const track = document.createElement("div");
    track.className = "strip__track";

    const setReps = Math.max(1, Math.ceil(MIN_ITEMS_PER_SET / bucket.length));

    // Two copies of the (possibly repeated) set for a seamless -50% loop.
    for (let copy = 0; copy < 2; copy++) {
      for (let rep = 0; rep < setReps; rep++) {
        bucket.forEach(({ photo, index }) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "strip__item";
          btn.setAttribute("aria-label", "Ver foto");
          if (copy !== 0 || rep !== 0) btn.setAttribute("aria-hidden", "true");

          const img = document.createElement("img");
          img.src = photo.thumb;
          img.alt = photo.title || "SoulMara";
          // Eager-load: the thumbnails are tiny, and lazy-loading in a moving
          // marquee causes images to pop to full size mid-scroll (and corrupts
          // the loop-width measurement). Re-measure whenever one loads.
          img.decoding = "async";
          img.addEventListener("load", scheduleMeasure);

          btn.appendChild(img);
          btn.addEventListener("click", () => openLightbox(index));
          track.appendChild(btn);
        });
      }
    }

    strip.appendChild(track);

    // Alternate direction: even strips one way, odd strips the other.
    const dir = s % 2 === 1 ? 1 : -1;
    const baseSpeed = SPEEDS[s % SPEEDS.length];
    const state = {
      track,
      dir,
      baseSpeed,
      pos: 0,
      speed: baseSpeed,
      targetSpeed: baseSpeed,
      setWidth: 0,
    };
    strips.push(state);

    // Per-strip slow-down on hover (desktop) / tap-toggle (mobile).
    strip.addEventListener("mouseenter", () => (state.targetSpeed = baseSpeed * SLOW_FACTOR));
    strip.addEventListener("mouseleave", () => (state.targetSpeed = baseSpeed));
    strip.addEventListener("click", (e) => {
      if (e.target.closest(".strip__item")) return;
      const slow = state.targetSpeed !== baseSpeed;
      state.targetSpeed = slow ? baseSpeed : baseSpeed * SLOW_FACTOR;
    });

    stripsEl.appendChild(strip);
  });

  function measure() {
    strips.forEach((st) => {
      const newWidth = st.track.scrollWidth / 2;
      if (!st.setWidth) {
        // First measurement: set the starting position.
        st.setWidth = newWidth;
        st.pos = st.dir > 0 ? -st.setWidth : 0;
      } else if (newWidth > 0 && Math.abs(newWidth - st.setWidth) > 0.5) {
        // Width changed (an image finished loading). Keep the current visual
        // position by scaling pos to the new width, so nothing jumps.
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
    window.addEventListener("load", measure);
    setTimeout(measure, 200);
    window.addEventListener("resize", measure);

    let last = performance.now();
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      strips.forEach((st) => {
        if (!st.setWidth) return;
        st.speed += (st.targetSpeed - st.speed) * Math.min(1, dt * 6);
        st.pos += st.dir * st.speed * dt;
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
    current = (i + allPhotos.length) % allPhotos.length;
    boxImg.src = allPhotos[current].full;
    boxImg.alt = allPhotos[current].title || "SoulMara";
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
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
})();
