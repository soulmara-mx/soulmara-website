# Eventos Integrity Check — SOULMARA

**Date:** Investigation run post-workflow  
**Scope:** Events 9–13 vs. existing events 1–8

---

## Summary

Two **critical bugs** found that break events 9–11 (gallery events with the new `dir+files` format):

1. **`evento.js` FAIL** — `hasGallery` only checks `ev.dir && ev.count`. Events 9–11 use `dir+files` (no `count`), so they hit the "no gallery yet" branch and show an empty page instead of their photos.
2. **`media.js` FAIL** — The media wall loop only iterates events where `ev.dir && ev.count`. Events 9–11 are completely excluded from the global photo wall.

Everything else checks out — cover images all exist on disk, HTML markup is consistent, thumbs subfolders are correctly populated for all three gallery events.

---

## Section-by-Section Results

### 1. eventos-data.js integrity — PASS

All 13 slugs are present in `js/eventos-data.js`:

| # | Slug | Format |
|---|------|--------|
| 1 | `barrio-chino` | `dir + count` (11) |
| 2 | `release-party-ceart` | `dir + count` (14) |
| 3 | `casa-verde-ensenada` | `dir + count` (13) |
| 4 | `amante-brew` | `dir + count` (17) |
| 5 | `cafe-literario` | `dir + count` (16) |
| 6 | `cafe-la-bohemia-tecate` | `dir + count` (17) |
| 7 | `malgro-tap-room` | `dir + count` (38) |
| 8 | `tijuana-rock-bar` | `dir + count` (41) |
| 9 | `ruido-by-scaleta` | `dir + files` (23 files) |
| 10 | `todos-somos-mexicali` | `dir + files` (4 files) |
| 11 | `fiestas-del-sol` | `dir + files` (27 files) |
| 12 | `malgro-chucho` | `poster` only |
| 13 | `love-song-bar-la` | `poster` only |

The `soulmaraEventPhotos()` helper correctly handles all three formats — the `dir+files` branch (line `if (ev.dir && ev.files)`) is first in the chain and returns correct `{ full, thumb }` pairs. The helper itself is **not** the bug.

---

### 2. File existence — gallery images — PASS (with notes)

**evento-9 (`ruido-by-scaleta`):**
- Main dir (`evento-9/`): all 23 files present ✓
- `thumbs/`: all 23 files present ✓
- Note: one file has a space in the name (`RUIDO GENERAL-20.jpg`) — URL encoding will be handled by the browser correctly as-is.

**evento-10 (`todos-somos-mexicali`):**
- Main dir (`evento-10/`): `tsm-1.jpg`, `tsm-2.jpg`, `tsm-3.jpg`, `tsm-4.jpg` ✓
- `thumbs/`: `tsm-1.jpg`, `tsm-2.jpg`, `tsm-3.jpg`, `tsm-4.jpg` ✓

**evento-11 (`fiestas-del-sol`):**
- Main dir (`evento-11/`): all 27 files present ✓
- `thumbs/`: all 27 files present ✓

All filenames in the `files` arrays in `eventos-data.js` exactly match what is on disk. No mismatches or missing files.

---

### 3. File existence — cover images — PASS

**pasados/** directory contains:
- `flyer-ruido.jpg` ✓ (event 9)
- `flyer-tsm.jpg` ✓ (event 10)
- `flyer-fds-2026.png` ✓ (event 11)
- `flyer-chucho.png` ✓ (event 12)
- `flyer-selines-la.jpg` ✓ (event 13)
- `fecha-1.jpg` through `fecha-8.jpg` ✓ (events 1–8)

**proximos/** directory contains:
- `flyer-monte-carlo.png` ✓ (event 14 / upcoming)

All cover image paths referenced in `eventos.html` and `index.html` resolve to real files.

---

### 4. eventos.html correctness — PASS

Structure verified:
- **1 upcoming card**: Monte Carlo (`article.event--flyer`, `data-flyer="…/flyer-monte-carlo.png"`) ✓
- **13 past cards** in newest-first order:
  1. `love-song-bar-la` → `article.event--flyer` (poster only, correct) ✓
  2. `malgro-chucho` → `article.event--flyer` (poster only, correct) ✓
  3. `fiestas-del-sol` → `a.event[data-event]` (has gallery, correct) ✓
  4. `todos-somos-mexicali` → `a.event[data-event]` (has gallery, correct) ✓
  5. `ruido-by-scaleta` → `a.event[data-event]` (has gallery, correct) ✓
  6–13: `tijuana-rock-bar` through `barrio-chino` → all `a.event[data-event]` ✓

All `href` values use `#slug` format (e.g. `./evento.html#fiestas-del-sol`). All `data-event` slugs match `eventos-data.js` keys exactly. All cover image paths verified above.

---

### 5. index.html correctness — PASS

The `#eventos` section in `index.html` mirrors `eventos.html` exactly:
- 1 upcoming Monte Carlo card (`event--flyer`) ✓
- 13 past cards in identical order and markup ✓
- All `data-event` slugs identical ✓
- All cover image paths identical ✓

No divergence between the two files.

---

### 6. media.js compatibility — **FAIL**

**File:** `js/media.js`, line ~17–21:

```js
Object.keys(events).forEach((id) => {
  const ev = events[id];
  if (ev && ev.dir && ev.count) {   // ← ONLY checks dir+count
    getPhotos(ev).forEach(...)
  }
});
```

Events 9 (`ruido-by-scaleta`, 23 photos), 10 (`todos-somos-mexicali`, 4 photos), and 11 (`fiestas-del-sol`, 27 photos) all use `dir+files` — they have no `count` property. The condition `ev.dir && ev.count` is `false` for all three, so **54 photos are excluded from the media wall**.

**Fix required:** Change the guard to also include `dir+files` events:
```js
if (ev && ev.dir && (ev.count || ev.files)) {
```
This lets `soulmaraEventPhotos()` (which already handles both formats correctly) do the work.

---

### 7. evento.js compatibility — **FAIL**

**File:** `js/evento.js`, line ~30–31:

```js
// A real gallery requires an actual photo folder (dir + count).
const hasGallery = !!(ev && ev.dir && ev.count);
```

The comment even says "dir + count" explicitly. Events 9, 10, and 11 have `dir + files` but no `count`, so `hasGallery` evaluates to `false` for all three. The code falls through to the empty-state branch:

```js
if (!ev || !hasGallery || !photos.length) {
  if (emptyEl) emptyEl.hidden = false;
  ...
  return;
}
```

Visiting `evento.html#ruido-by-scaleta`, `evento.html#todos-somos-mexicali`, or `evento.html#fiestas-del-sol` shows the **"no gallery yet" empty state** instead of the photo strips.

**Fix required:** Extend `hasGallery` to cover the `dir+files` format:
```js
const hasGallery = !!(ev && ev.dir && (ev.count || (ev.files && ev.files.length)));
```

---

## Prioritised Fix List

| Priority | Location | Fix |
|----------|----------|-----|
| 🔴 P1 | `js/evento.js` line 31 | Change `ev.dir && ev.count` → `ev.dir && (ev.count \|\| (ev.files && ev.files.length))` |
| 🔴 P1 | `js/media.js` line ~19 | Change `ev.dir && ev.count` → `ev.dir && (ev.count \|\| ev.files)` |

Both fixes are one-line changes. No other issues found — all files exist on disk, all HTML markup is consistent, the helper function and HTML cards are correct.
