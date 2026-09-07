// One-off tool: subset the Milk and Honey font to only the characters the
// site needs, and output web formats (woff2 + woff). A subset is a fragment
// of the font, not a redistributable copy — this keeps the public repo
// license-safe while still displaying the brand type.
//
// Run:  node tools/subset-font.mjs
import subsetFont from "subset-font";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "assets", "fonts", "Milk And Honey.otf");
const OUT_DIR = path.join(root, "assets", "fonts");

// Character set the site may render in the display font.
// Uppercase + lowercase + digits + Spanish letters + basic punctuation.
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "abcdefghijklmnopqrstuvwxyz" +
  "0123456789" +
  "ÑñÁÉÍÓÚáéíóúÜü" +
  " .,:;!?¡¿'\"-–—&()/" +
  "\u2193"; // down arrow ↓ (in case it ever uses the display font)

const src = await readFile(SRC);

async function make(format, ext) {
  const buf = await subsetFont(src, chars, { targetFormat: format });
  const out = path.join(OUT_DIR, `milk-and-honey.${ext}`);
  await writeFile(out, buf);
  console.log(
    `${ext.padEnd(5)} -> ${(buf.length / 1024).toFixed(1)} KB  (${out})`
  );
}

await mkdir(OUT_DIR, { recursive: true });
await make("woff2", "woff2");
await make("woff", "woff");
console.log("Done. Subset contains", chars.length, "characters.");
