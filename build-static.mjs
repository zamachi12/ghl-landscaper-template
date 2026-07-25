/* Builds index.static.html — a FULLY PRE-RENDERED, self-contained page:
   every {{token}} is baked in, all lists are rendered, images resolved, and
   CSS is inlined. Content no longer depends on JavaScript, so it renders
   correctly anywhere — editor preview panes, double-clicking the file, any
   static host. (GSAP still loads for the entrance/scroll animation, but the
   content is visible with or without it.)

   Run:  node build-static.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";
import { renderSite, loadSite } from "./lib-render.mjs";

const SITE = loadSite();
let html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/css/styles.css", "utf8");

html = renderSite(html, SITE, css);

html =
  `<!-- ============================================================
     PRE-RENDERED static build — do not edit directly.
     Edit assets/js/config.js etc, then re-run:  node build-static.mjs
     All content is baked in; renders correctly with or without JS.
     ============================================================ -->\n` +
  html;

writeFileSync("index.static.html", html);

const leftover = html.match(/\{\{[\w.]+\}\}/g) || [];
console.log("Wrote index.static.html (" + html.length + " bytes)");
console.log(
  "Unfilled tokens remaining: " +
    leftover.length +
    (leftover.length ? " -> " + [...new Set(leftover)].join(", ") : "")
);
