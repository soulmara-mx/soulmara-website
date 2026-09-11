/* ============================================================
   SOULMARA — events data
   Single source of truth for each event's gallery. Used by:
   - eventos.html   (hover-preview carousel on each card)
   - evento.html    (the full gallery page, via ?id=<slug>)

   Photo paths are relative to the site root. Each event lists its
   full-size images (viewed on the gallery page) and matching thumbs
   (used for the lightweight hover preview). Events without real photos
   yet fall back to their poster as a single-image placeholder gallery.
   ============================================================ */
window.SOULMARA_EVENTS = {
  "barrio-chino": {
    title: "CaleidoscopiA Tour",
    date: "8 Julio 2026",
    venue: "Barrio Chino",
    city: "Mexicali, B.C.",
    // 11 real photos from the Barrio Chino show
    dir: "./assets/eventos-gallery-img/evento-1",
    count: 11, // files are 1.jpg .. 11.jpg (+ thumbs/1.jpg ..)
  },

  // --- Placeholder galleries (no photos yet) -----------------
  // Each points at its poster so the card/preview/gallery still work.
  // Replace `poster` with a real `dir`+`count` once photos are added.
  "release-party-ceart": {
    title: "CaleidoscopiA Release Party",
    date: "10 Julio 2026",
    venue: "Foro Experimental CEART",
    city: "Mexicali, B.C.",
    // 14 real photos from the CEART release party
    dir: "./assets/eventos-gallery-img/evento-2",
    count: 14,
  },
  "casa-verde-ensenada": {
    title: "CaleidoscopiA Tour",
    date: "25 Julio 2026",
    venue: "Casa Verde Brew",
    city: "Ensenada, B.C.",
    dir: "./assets/eventos-gallery-img/evento-3",
    count: 13,
  },
  "amante-brew": {
    title: "CaleidoscopiA Tour",
    date: "1 Agosto 2026",
    venue: "Amante Brew",
    city: "Mexicali, B.C.",
    dir: "./assets/eventos-gallery-img/evento-4",
    count: 17,
  },
  "cafe-literario": {
    title: "CaleidoscopiA Tour",
    date: "7 Agosto 2026",
    venue: "Café Literario",
    city: "Mexicali, B.C.",
    dir: "./assets/eventos-gallery-img/evento-5",
    count: 16,
  },
  "cafe-la-bohemia-tecate": {
    title: "CaleidoscopiA Tour",
    date: "15 Agosto 2026",
    venue: "Café La Bohemia",
    city: "Tecate, B.C.",
    dir: "./assets/eventos-gallery-img/evento-6",
    count: 17,
  },
  "malgro-tap-room": {
    title: "CaleidoscopiA Tour",
    date: "22 Agosto 2026",
    venue: "Malgro Cervecería Tap Room",
    city: "Mexicali, B.C.",
    poster: "./assets/eventos-cover-img/pasados/fecha-7.jpg",
  },
  "tijuana-rock-bar": {
    title: "CaleidoscopiA Tour",
    date: "5 Septiembre 2026",
    venue: "Tijuana Rock bar",
    city: "Tijuana, B.C.",
    poster: "./assets/eventos-cover-img/pasados/fecha-8.jpg",
  },
};

/* Helper: return an event's photo list as { full, thumb } pairs.
   - Real galleries (dir + count) → numbered files + matching thumbs.
   - Placeholder galleries (poster) → single image, poster as its own thumb. */
window.soulmaraEventPhotos = function (ev) {
  if (!ev) return [];
  if (ev.dir && ev.count) {
    const list = [];
    for (let i = 1; i <= ev.count; i++) {
      list.push({ full: ev.dir + "/" + i + ".jpg", thumb: ev.dir + "/thumbs/" + i + ".jpg" });
    }
    return list;
  }
  if (ev.poster) return [{ full: ev.poster, thumb: ev.poster }];
  return [];
};
