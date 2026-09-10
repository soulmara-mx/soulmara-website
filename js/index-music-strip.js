/* ============================================================
   SOULMARA — landing page music strip (pinned horizontal scroll)
   A static row of album covers. When the section reaches the viewport it
   pins (via CSS position:sticky on the viewport), and vertical scroll is
   mapped to horizontal movement of the strip: it starts flush-left and, as
   you scroll down, moves left revealing the overflow to the right. Once the
   last album is reached the pin releases and normal scrolling continues.
   Scrolling back up reverses it. Each cover links to its track/album.
   ============================================================ */
(function () {
  "use strict";

  const stripEl = document.getElementById("musicStrip");
  const pinEl = document.getElementById("musica");
  if (!stripEl || !pinEl) return;

  const viewportEl = pinEl.querySelector(".music-pin__viewport");

  // Album covers + where each links to (Spotify).
  const ALBUMS = [
    { name: "CaleidoscopiA", img: "./assets/music-img/CaleidoscopiA.jpg", url: "https://open.spotify.com/album/57kFVjaZ1xsJQrS9flDf4B" },
    { name: "DLV", img: "./assets/music-img/DLV.jpg", url: "https://open.spotify.com/track/0BITsQH8TuJb642OJae9cc" },
    { name: "Luz Primavera", img: "./assets/music-img/Luz-Primavera.jpg", url: "https://open.spotify.com/track/06cyLYRYdF6vgAjkN7SAwl" },
    { name: "Dices", img: "./assets/music-img/Dices.jpg", url: "https://open.spotify.com/track/0A3j6KZ7nlqkNLoFtHOqfm" },
    { name: "Espuma", img: "./assets/music-img/Espuma.jpg", url: "https://open.spotify.com/track/3I37KNBvyixn6r1VgJxusA" },
    { name: "Bonito", img: "./assets/music-img/Bonito.jpg", url: "https://open.spotify.com/track/6PtgLYhTJJT154aX49WCNK" },
    { name: "DLV (Demo)", img: "./assets/music-img/dlv-demo.jpg", url: "https://open.spotify.com/track/4q3nXQANv2plM7tKJJCQGU" },
    { name: "DIME", img: "./assets/music-img/DIME.jpg", url: "https://open.spotify.com/track/4V0AKqDFNIs5mSRYsZQL09" },
  ];

  // Build the row (single set, no duplication — this is a finite strip).
  const track = document.createElement("div");
  track.className = "music-strip__track";
  ALBUMS.forEach((album) => {
    const a = document.createElement("a");
    a.className = "strip__item";
    a.href = album.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", album.name + " — escuchar");

    const img = document.createElement("img");
    img.src = album.img;
    img.alt = album.name;
    img.decoding = "async";
    img.addEventListener("load", measure);

    a.appendChild(img);
    track.appendChild(a);
  });
  stripEl.appendChild(track);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Dwell buffer (px of scroll) held at each end before the strip starts /
  // after it finishes moving — so reaching the end doesn't immediately drop
  // you into the next section, and there's leeway at the start too.
  const BUFFER = Math.round(window.innerHeight * 0.5);

  // How far the strip must travel horizontally (its overflow past the strip
  // container width). Measured after images load / on resize.
  let maxScroll = 0;
  function measure() {
    // The strip container is viewport-width; the track may be wider.
    maxScroll = Math.max(0, track.scrollWidth - stripEl.clientWidth);
    // The wrapper's extra height = horizontal travel PLUS a buffer at each end
    // (only added when there's actually something to scroll horizontally).
    const extra = maxScroll > 0 ? maxScroll + BUFFER * 2 : 0;
    pinEl.style.setProperty("--pin-extra", extra + "px");
    onScroll();
  }

  function onScroll() {
    if (reduce) return;
    const rect = pinEl.getBoundingClientRect();
    const total = pinEl.offsetHeight - window.innerHeight; // scrollable span
    if (total <= 0 || maxScroll <= 0) {
      track.style.transform = "translateX(0)";
      return;
    }
    // Raw scrolled distance into the pinned section, in px.
    const scrolled = Math.max(0, Math.min(total, -rect.top));
    // Map only the MIDDLE of the scroll to horizontal travel: the first
    // BUFFER px holds at the start, the last BUFFER px holds at the end.
    const active = scrolled - BUFFER;
    const activeSpan = total - BUFFER * 2; // == maxScroll
    let x = 0;
    if (activeSpan > 0) {
      const p = Math.max(0, Math.min(1, active / activeSpan));
      x = p * maxScroll;
    }
    track.style.transform = "translateX(" + -x + "px)";
  }

  if (!reduce) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    measure();
    setTimeout(measure, 200);

    // ---- Direct horizontal drag / swipe on the strip ----
    // Dragging horizontally converts into page scroll, so the existing pin
    // math (page scroll → translateX) stays the single source of truth. This
    // lets touch users swipe the covers instead of being forced to guess the
    // vertical-scroll mapping — and it can't fight the scroll handler.
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollY = 0;
    let axisLocked = null; // 'x' once we decide it's a horizontal swipe
    let moved = false;
    const AXIS_THRESHOLD = 8; // px before we commit to an axis

    stripEl.addEventListener("pointerdown", (e) => {
      // Only primary button / touch / pen.
      if (e.button != null && e.button !== 0) return;
      dragging = true;
      moved = false;
      axisLocked = null;
      startX = e.clientX;
      startY = e.clientY;
      startScrollY = window.scrollY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Decide the gesture axis once past the threshold.
      if (!axisLocked) {
        if (Math.abs(dx) < AXIS_THRESHOLD && Math.abs(dy) < AXIS_THRESHOLD) return;
        axisLocked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axisLocked === "y") {
          // Vertical gesture: let the page scroll normally, stop tracking.
          dragging = false;
          return;
        }
      }

      if (axisLocked === "x") {
        moved = true;
        // Prevent the native drag/text-select while swiping horizontally.
        if (e.cancelable) e.preventDefault();
        // Dragging left (dx negative) should advance the strip → scroll page
        // down. Match 1:1 with the pointer movement.
        window.scrollTo(0, startScrollY - dx);
      }
    }, { passive: false });

    function endDrag() { dragging = false; }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Suppress the click→open when the pointer was actually a horizontal drag,
    // so swiping doesn't accidentally open Spotify.
    stripEl.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true
    );
  }
})();
