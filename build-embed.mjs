/* Builds index.embed.html — a BODY-ONLY FRAGMENT for GHL's Custom Code /
   Custom HTML element.

   Why this exists: many page-builder "Custom Code" widgets insert whatever
   you paste directly into their own page's <body> (via something like
   element.innerHTML = yourCode). If you paste a *full document*
   (<!DOCTYPE>, <html>, <head>, <body>), two things can go wrong:
     1) Anything that was inside <head> — like a <style> block — can be
        silently dropped, since a fragment parser doesn't expect a nested
        <head>.
     2) <script> tags inserted via innerHTML do not execute in most
        browsers, so any JS-driven rendering/templating won't run.

   This build has no <head>/<body> wrapper at all, and all content is
   pre-baked (same as index.static.html) so it doesn't depend on JS running
   to look correct — GSAP is still included for animation, but if the
   widget strips <script> tags, the page still displays correctly, just
   without motion.

   Run:  node build-embed.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";
import { renderSite, loadSite } from "./lib-render.mjs";

const SITE = loadSite();
const raw = readFileSync("index.html", "utf8");
const css = readFileSync("assets/css/styles.css", "utf8");

// Keep data-animate: if the destination Custom Code element does execute
// <script> tags (many do), this fragment can still animate. If it doesn't,
// the content is pre-baked and displays correctly regardless.
const rendered = renderSite(raw, SITE, css, { stripAnimate: false });

/* Pull the two Google Font <link> tags + the inlined <style> block out of
   <head>, and the full markup out of <body> — then drop the wrapper. */
const fontLinks = (rendered.match(/<link[^>]*fonts\.g(?:oogleapis|static)\.com[^>]*>/g) || []).join(
  "\n"
);
const styleBlock = (rendered.match(/<style>[\s\S]*?<\/style>/) || [""])[0];
const bodyMatch = rendered.match(/<body[^>]*>([\s\S]*)<\/body>/);
let bodyInner = bodyMatch ? bodyMatch[1].trim() : "";

/* Inline config.js + main.js directly — relative <script src="assets/js/...">
   paths would 404 once this fragment lives on GHL's domain, silently
   breaking the mobile menu, nav scroll effect, and the webhook form submit. */
const configJs = readFileSync("assets/js/config.js", "utf8");
const mainJs = readFileSync("assets/js/main.js", "utf8");
bodyInner = bodyInner
  .replace(
    '<script src="assets/js/config.js"></script>',
    `<script>\n${configJs}\n</script>`
  )
  .replace('<script src="assets/js/main.js"></script>', `<script>\n${mainJs}\n</script>`);

const fragment =
  `<!-- ============================================================
     BODY-ONLY FRAGMENT for a GHL Custom Code / Custom HTML element.
     No <!DOCTYPE>, <html>, <head>, or <body> tags — paste this directly
     into the code element's content field.
     Edit assets/js/config.js etc, then re-run:  node build-embed.mjs
     ============================================================ -->\n` +
  // A <meta charset> tag is honored by the HTML parser even outside a
  // <head>, as long as it's near the top of the document — without it,
  // some renderers fall back to Latin-1 and mangle UTF-8 characters
  // (e.g. the "·" in the hero eyebrow shows up as "Â·").
  '<meta charset="UTF-8">\n' +
  fontLinks +
  "\n" +
  styleBlock +
  "\n" +
  bodyInner +
  "\n";

writeFileSync("index.embed.html", fragment);

// Only flag {{tokens}} outside <script> blocks — config.js documents GHL
// custom-value names in its own comments (e.g. {{custom_values.x}}), which
// are invisible to the rendered page and not a real problem.
const outsideScripts = fragment.replace(/<script>[\s\S]*?<\/script>/g, "");
const leftover = outsideScripts.match(/\{\{[\w.]+\}\}/g) || [];
console.log("Wrote index.embed.html (" + fragment.length + " bytes)");
console.log(
  "Unfilled tokens remaining (outside <script>): " +
    leftover.length +
    (leftover.length ? " -> " + [...new Set(leftover)].join(", ") : "")
);
console.log("Has <html>/<head>/<body> tags: " + /<\/?(html|head|body)[ >]/i.test(fragment));
