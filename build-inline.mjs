/* Builds index.inlined.html — a single, paste-ready file for a GHL custom-code
   block. Inlines styles.css + config.js + main.js into index.html.
   (GSAP and Google Fonts stay as external CDN links — GHL allows those.)

   Run:  node build-inline.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/css/styles.css", "utf8");
const config = readFileSync("assets/js/config.js", "utf8");
const main = readFileSync("assets/js/main.js", "utf8");

let out = html
  .replace(
    '<link rel="stylesheet" href="assets/css/styles.css" />',
    `<style>\n${css}\n</style>`
  )
  .replace(
    '<script src="assets/js/config.js"></script>',
    `<script>\n${config}\n</script>`
  )
  .replace(
    '<script src="assets/js/main.js"></script>',
    `<script>\n${main}\n</script>`
  );

out =
  `<!-- ============================================================
     BUILT FILE — do not edit directly.
     Edit assets/js/config.js etc, then re-run:  node build-inline.mjs
     Paste this whole file into a GHL Custom Code / blank funnel step.
     ============================================================ -->\n` +
  out;

writeFileSync("index.inlined.html", out);
console.log("Wrote index.inlined.html (" + out.length + " bytes)");
