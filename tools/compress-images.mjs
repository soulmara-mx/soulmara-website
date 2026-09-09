// One-off tool: compress + resize source images in place so heavy originals
// don't get served (or committed) at full size. Safe to re-run — it only
// rewrites files larger than MAX_BYTES.
//
// Run:  node tools/compress-images.mjs [dir] [maxWidth]
// Defaults to the press member portraits at 900px wide.
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.resolve(root, process.argv[2] || "assets/press-member-img");
const MAX_WIDTH = Number(process.argv[3] || 900);
const QUALITY = 80;
const MAX_BYTES = 500 * 1024; // skip files already under ~500 KB

const exts = new Set([".jpg", ".jpeg", ".png"]);
const files = (await readdir(dir)).filter((f) =>
  exts.has(path.extname(f).toLowerCase())
);

for (const name of files) {
  const file = path.join(dir, name);
  const before = (await stat(file)).size;
  if (before <= MAX_BYTES) {
    console.log(`skip  ${name.padEnd(16)} ${(before / 1024).toFixed(0)} KB (already small)`);
    continue;
  }

  const input = await readFile(file);
  const out = await sharp(input)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();

  await writeFile(file, out);
  console.log(
    `done  ${name.padEnd(16)} ${(before / 1024).toFixed(0)} KB -> ${(out.length / 1024).toFixed(0)} KB`
  );
}
console.log("Image compression complete.");
