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
  // Events 9-11 use dir + files (no separate thumbs folder exists;
  // the compressed full-size images serve as both full and thumb).
  "ruido-by-scaleta": {
    title: "Ruido by Scaleta",
    date: "25 Septiembre 2026",
    venue: "Malgro Cervecería Tap Room",
    city: "Mexicali, B.C.",
    dir: "./assets/eventos-gallery-img/evento-9",
    files: [
      "RUIDO GENERAL-20.jpg",
      "Soulmara-8.jpg",
      "Soulmara-11.jpg",
      "Soulmara-15.jpg",
      "Soulmara-19.jpg",
      "Soulmara-20.jpg",
      "Soulmara-22.jpg",
      "Soulmara-24.jpg",
      "Soulmara-28.jpg",
      "Soulmara-29.jpg",
      "Soulmara-31.jpg",
      "Soulmara-36.jpg",
      "Soulmara-39.jpg",
      "Soulmara-43.jpg",
      "Soulmara-47.jpg",
      "Soulmara-49.jpg",
      "Soulmara-50.jpg",
      "Soulmara-52.jpg",
      "Soulmara-54.jpg",
      "Soulmara-55.jpg",
      "Soulmara-58.jpg",
      "Soulmara-60.jpg",
      "Soulmara-61.jpg",
    ],
  },

  "todos-somos-mexicali": {
    title: "Todos Somos Mexicali",
    date: "26 Septiembre 2026",
    venue: "Tu Parque",
    city: "Mexicali, B.C.",
    dir: "./assets/eventos-gallery-img/evento-10",
    files: [
      "tsm-1.jpg",
      "tsm-2.jpg",
      "tsm-3.jpg",
      "tsm-4.jpg",
    ],
  },

  "fiestas-del-sol": {
    title: "Fiestas del Sol",
    date: "2 Octubre 2026",
    venue: "Fiestas del Sol",
    city: "Mexicali, B.C.",
    dir: "./assets/eventos-gallery-img/evento-11",
    files: [
      "Soul_FDS-1.jpg",
      "Soul_FDS-2.jpg",
      "Soul_FDS-3.jpg",
      "Soul_FDS-6.jpg",
      "Soul_FDS-17.jpg",
      "Soul_FDS-23.jpg",
      "Soul_FDS-25.jpg",
      "Soul_FDS-29.jpg",
      "Soul_FDS-32.jpg",
      "Soul_FDS-34.jpg",
      "Soul_FDS-41.jpg",
      "Soul_FDS-44.jpg",
      "Soul_FDS-48.jpg",
      "Soul_FDS-50.jpg",
      "Soul_FDS-57.jpg",
      "Soul_FDS-63.jpg",
      "Soul_FDS-65.jpg",
      "Soul_FDS-70.jpg",
      "Soul_FDS-88.jpg",
      "Soul_FDS-89.jpg",
      "Soul_FDS-95.jpg",
      "Soul_FDS-96.jpg",
      "Soul_FDS-101.jpg",
      "Soul_FDS-105.jpg",
      "Soul_FDS-106.jpg",
      "Soul_FDS-107.jpg",
      "Soul_FDS-108.jpg",
    ],
  },

  "malgro-chucho": {
    title: "CaleidoscopiA Tour",
    date: "3 Octubre 2026",
    venue: "Malgro Tap Room",
    city: "Mexicali, B.C.",
    cover: "./assets/eventos-cover-img/pasados/flyer-chucho.png",
  },

  "love-song-bar-la": {
    title: "CaleidoscopiA Tour",
    date: "4 Octubre 2026",
    venue: "The Love Song Bar",
    city: "Los Ángeles, CA",
    cover: "./assets/eventos-cover-img/pasados/flyer-selines-la.jpg",
  },
};

/* Helper: return an event's photo list as { full, thumb } pairs.
   - dir + count  → numbered files 1.jpg..N.jpg + thumbs/1.jpg..
   - dir + files  → explicit filenames; thumbs/ subfolder mirrors filenames.
   - poster only  → single image, poster used as its own thumb. */
window.soulmaraEventPhotos = function (ev) {
  if (!ev) return [];
  if (ev.dir && ev.files) {
    return ev.files.map(function (f) {
      return { full: ev.dir + "/" + f, thumb: ev.dir + "/thumbs/" + f };
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
