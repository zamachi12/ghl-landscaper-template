/* Shared rendering logic used by build-static.mjs and build-embed.mjs.
   Takes the raw index.html source + the SITE config object and returns a
   fully baked HTML string: every {{token}} filled, every list rendered,
   every image resolved, CSS inlined, no dependency on JS running.
*/
import { readFileSync } from "node:fs";

export const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );

export function loadSite() {
  const cfgText = readFileSync("assets/js/config.js", "utf8");
  const sandbox = {};
  new Function("window", cfgText)(sandbox);
  return sandbox.SITE;
}

export function renderSite(html, SITE, css, { stripAnimate = true } = {}) {
  const servicesHTML = (SITE.services || [])
    .map((s, i) => {
      const num = String(i + 1).padStart(2, "0");
      const thumb = s.image
        ? `<img class="service__thumb" src="${esc(s.image)}" alt="" loading="lazy">`
        : "";
      return `<li class="service" data-reveal-item><span class="service__num">${num}</span><div><h3 class="service__title">${esc(
        s.title
      )}</h3><p class="service__desc">${esc(
        s.desc
      )}</p></div><span class="service__arrow" aria-hidden="true">&rarr;</span>${thumb}</li>`;
    })
    .join("");

  const statsHTML = (SITE.about_stats || [])
    .map(
      (s) =>
        `<div class="about__stat"><div class="value">${esc(
          s.value
        )}</div><div class="label">${esc(s.label)}</div></div>`
    )
    .join("");

  const projectsHTML = (SITE.projects || [])
    .map(
      (p) =>
        `<article class="project" data-reveal-item><div class="project__frame"><img src="${esc(
          p.image
        )}" alt="${esc(
          p.name
        )}" loading="lazy"></div><div class="project__caption"><div><div class="project__name">${esc(
          p.name
        )}</div><div class="project__loc">${esc(
          p.location
        )}</div></div><div class="project__type">${esc(p.type)}</div></div></article>`
    )
    .join("");

  const quotesHTML = (SITE.testimonials || [])
    .map(
      (t) =>
        `<blockquote class="quote" data-reveal-item><p class="quote__text">&ldquo;${esc(
          t.quote
        )}&rdquo;</p><div class="quote__attr">${esc(t.author)}${
          t.meta ? ` <span class="quote__meta">· ${esc(t.meta)}</span>` : ""
        }</div></blockquote>`
    )
    .join("");

  const selectHTML = ['<option value="">Select a service…</option>']
    .concat((SITE.services || []).map((s) => `<option value="${esc(s.title)}">${esc(s.title)}</option>`))
    .concat('<option value="Other">Something else</option>')
    .join("");

  const socialsHTML = [
    SITE.facebook_url ? `<a href="${esc(SITE.facebook_url)}" target="_blank" rel="noopener">Facebook</a>` : "",
    SITE.instagram_url ? `<a href="${esc(SITE.instagram_url)}" target="_blank" rel="noopener">Instagram</a>` : "",
  ].join("");

  if (css != null) {
    html = html.replace(
      '<link rel="stylesheet" href="assets/css/styles.css" />',
      `<style>\n${css}\n</style>`
    );
  }

  if (stripAnimate) {
    html = html.replace('<header class="nav" data-nav data-animate>', '<header class="nav" data-nav>');
  }

  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) =>
    SITE[key] != null ? String(SITE[key]) : m
  );

  html = html.replace(/<img([^>]*?)\sdata-img="([\w.]+)"([^>]*?)\s*\/?>/g, (m, pre, key, post) => {
    const src = SITE[key] ? ` src="${esc(SITE[key])}"` : "";
    const tail = post.trim() ? " " + post.trim() : "";
    return `<img${pre}${tail}${src}>`;
  });

  const inject = (attr, inner) => {
    const re = new RegExp(`(<[^>]*\\b${attr}\\b[^>]*>)([\\s\\S]*?)(</(?:ul|div|select)>)`);
    html = html.replace(re, (m, open, _mid, close) => `${open}${inner}${close}`);
  };
  inject("data-services", servicesHTML);
  inject("data-stats", statsHTML);
  inject("data-projects", projectsHTML);
  inject("data-quotes", quotesHTML);
  inject("data-service-select", selectHTML);

  html = html.replace(/(<span data-year>)(<\/span>)/, `$1${new Date().getFullYear()}$2`);
  html = html.replace(/(<span data-socials>)(<\/span>)/, `$1${socialsHTML}$2`);

  return html;
}
