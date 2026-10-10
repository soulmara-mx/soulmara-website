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
    dir: "./assets/eventos-gallery-img/evento-7",
    count: 38,
  },
  "tijuana-rock-bar": {
    title: "CaleidoscopiA Tour",
    date: "5 Septiembre 2026",
    venue: "Tijuana Rock bar",
    city: "Tijuana, B.C.",
    dir: "./assets/eventos-gallery-img/evento-8",
    count: 41,
  },

  // --- Events 9-13 -------------------------------------------
  "ruido-by-scaleta": {
    title: "Ruido by Scaleta",
    date: "25 Septiembre 2026",
    venue: "Malgro Cervecería Tap Room",
    city: "Mexicali, B.C.",
    files: [
      "./assets/eventos-gallery-img/evento-9/RUIDO GENERAL-20.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-8.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-11.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-15.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-19.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-20.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-22.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-24.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-28.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-29.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-31.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-36.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-39.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-43.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-47.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-49.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-50.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-52.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-54.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-55.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-58.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-60.jpg",
      "./assets/eventos-gallery-img/evento-9/Soulmara-61.jpg",
    ],
    thumbs: [
      "./assets/eventos-gallery-img/evento-9/thumbs/RUIDO GENERAL-20.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-8.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-11.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-15.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-19.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-20.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-22.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-24.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-28.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-29.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-31.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-36.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-39.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-43.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-47.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-49.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-50.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-52.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-54.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-55.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-58.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-60.jpg",
      "./assets/eventos-gallery-img/evento-9/thumbs/Soulmara-61.jpg",
    ],
  },

  "todos-somos-mexicali": {
    title: "Todos Somos Mexicali",
    date: "26 Septiembre 2026",
    venue: "Tu Parque",
    city: "Mexicali, B.C.",
    files: [
      "./assets/eventos-gallery-img/evento-10/tsm-1.jpg",
      "./assets/eventos-gallery-img/evento-10/tsm-2.jpg",
      "./assets/eventos-gallery-img/evento-10/tsm-3.jpg",
      "./assets/eventos-gallery-img/evento-10/tsm-4.jpg",
    ],
    thumbs: [
      "./assets/eventos-gallery-img/evento-10/thumbs/tsm-1.jpg",
      "./assets/eventos-gallery-img/evento-10/thumbs/tsm-2.jpg",
      "./assets/eventos-gallery-img/evento-10/thumbs/tsm-3.jpg",
      "./assets/eventos-gallery-img/evento-10/thumbs/tsm-4.jpg",
    ],
  },

  "fiestas-del-sol": {
    title: "Fiestas del Sol",
    date: "2 Octubre 2026",
    venue: "Fiestas del Sol",
    city: "Mexicali, B.C.",
    files: [
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-1.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-2.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-3.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-6.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-17.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-23.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-25.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-29.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-32.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-34.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-41.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-44.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-48.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-50.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-57.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-63.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-65.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-70.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-88.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-89.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-95.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-96.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-101.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-105.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-106.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-107.jpg",
      "./assets/eventos-gallery-img/evento-11/Soul_FDS-108.jpg",
    ],
    thumbs: [
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-1.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-2.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-3.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-6.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-17.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-23.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-25.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-29.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-32.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-34.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-41.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-44.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-48.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-50.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-57.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-63.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-65.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-70.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-88.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-89.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-95.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-96.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-101.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-105.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-106.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-107.jpg",
      "./assets/eventos-gallery-img/evento-11/thumbs/Soul_FDS-108.jpg",
    ],
  },

  "malgro-chucho": {
    title: "CaleidoscopiA Tour",
    date: "3 Octubre 2026",
    venue: "Malgro Tap Room",
    city: "Mexicali, B.C.",
    poster: "./assets/eventos-cover-img/pasados/flyer-chucho.png",
  },

  "love-song-bar-la": {
    title: "CaleidoscopiA Tour",
    date: "4 Octubre 2026",
    venue: "The Love Song Bar",
    city: "Los Ángeles, CA",
    poster: "./assets/eventos-cover-img/pasados/flyer-selines-la.jpg",
  },
};

/* Helper: return an event's photo list as { full, thumb } pairs.
   - Explicit galleries (files + thumbs) → mapped pairs.
   - Real galleries (dir + count) → numbered files + matching thumbs.
   - Placeholder galleries (poster) → single image, poster as its own thumb. */
window.soulmaraEventPhotos = function (ev) {
  if (!ev) return [];
  if (ev.files && ev.thumbs) {
    return ev.files.map(function(f, i) {
      return { full: f, thumb: ev.thumbs[i] || f };
    });
  }
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
