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

  // How far the strip must travel horizontally (its overflow past the strip
  // container width). Measured after images load / on resize.
  let maxScroll = 0;
  function measure() {
    // The strip container is viewport-width; the track may be wider.
    maxScroll = Math.max(0, track.scrollWidth - stripEl.clientWidth);
    // The outer wrapper's extra height (beyond one viewport) is what gets
    // "spent" scrolling horizontally. Tie it to the horizontal distance so
    // the mapping feels 1:1-ish. Extra height = maxScroll px.
    pinEl.style.setProperty("--pin-extra", maxScroll + "px");
    onScroll();
  }

  function onScroll() {
    if (reduce) return;
    const rect = pinEl.getBoundingClientRect();
    const total = pinEl.offsetHeight - window.innerHeight; // scrollable span
    if (total <= 0) {
      track.style.transform = "translateX(0)";
      return;
    }
    // progress 0 → 1 as the wrapper scrolls past the pinned viewport.
    let progress = -rect.top / total;
    progress = Math.max(0, Math.min(1, progress));
    track.style.transform = "translateX(" + -(progress * maxScroll) + "px)";
  }

  if (!reduce) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    measure();
    setTimeout(measure, 200);
  }
})();
