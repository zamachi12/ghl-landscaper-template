# Landscaper Website Template (GHL-ready)

A minimal, editorial landscaper site — inspired by the architecture-bureau look of
[kononenkogroup.com](https://kononenkogroup.com/), translated into a warm, earthy
palette. Built to pitch to multiple landscaping businesses: **change one config
file, swap the images, done.** Wired to connect to the GoHighLevel backend.

Seeded with **Berman Lawn & Landscape** (Fredericksburg, TX) as the demo client.

## Structure
```
index.html                 # source markup with {{token}} placeholders — edit this
assets/css/styles.css      # design system — reskin via :root tokens
assets/js/config.js        # ← THE ONLY FILE YOU EDIT PER CLIENT
assets/js/main.js          # templating, rendering, GSAP motion, form submit

lib-render.mjs             # shared token-filling/list-rendering logic
build-static.mjs           # → index.static.html  (fully pre-rendered, JS-independent)
build-embed.mjs            # → index.embed.html   (fragment for a GHL Custom Code element)
build-inline.mjs           # → index.inlined.html (single self-contained full document)

DESIGN.md                  # extracted design system
GHL-INTEGRATION.md         # how to connect dynamic fields, forms, automations
ghl-emails.md              # ready-to-paste lead auto-reply + owner-notification emails
```

## Sections
Hero · Services · About · Projects · Testimonials · Contact · Footer
(single page, anchor nav)

## Run locally
```bash
npm start
```
Then open http://localhost:4599. (Or `python3 -m http.server 4599` directly — no dependencies needed.)

## Reskin for a new client
1. Edit `assets/js/config.js` (business info, services, projects, testimonials, images, GHL webhook URL)
2. Tweak the color tokens in `assets/css/styles.css` if the brand needs a different palette
3. Rebuild the derived files:
   ```bash
   npm run build
   ```
See the full checklist in [GHL-INTEGRATION.md](GHL-INTEGRATION.md).

## The four HTML files — which one to use

| File | Use it for |
|---|---|
| `index.html` + `assets/` | **Editing** — the source of truth, loads CSS/JS as separate files |
| `index.static.html` | **Any dumb viewer** — editor preview panes, double-clicking the file, quick sanity checks. Every token is pre-baked and every list is pre-rendered, so it looks correct with or without JavaScript running. |
| `index.embed.html` | **Paste into GHL.** A body-only fragment — no `<!DOCTYPE>`/`<html>`/`<head>`/`<body>` wrapper — for a GHL **Custom Code / Custom HTML** element. Content is pre-baked (safe even if the destination doesn't execute `<script>`), and still animates via GSAP if it does. |
| `index.inlined.html` | A full self-contained document (CSS + JS inlined) for the rarer case where a builder genuinely wants a whole page rather than a fragment. |

Regenerate all three derived files after any edit:
```bash
npm run build
```
Or individually: `npm run build:static`, `npm run build:embed`, `npm run build:inline`.

## Connecting to GoHighLevel
See [GHL-INTEGRATION.md](GHL-INTEGRATION.md) for: pasting into a Custom Code element,
wiring the contact form to a GHL Inbound Webhook, mapping fields, and the
suggested automation chain (auto-reply, owner notification, tagging, opportunities).
Ready-to-paste emails are in [ghl-emails.md](ghl-emails.md).

## Tech
- Vanilla HTML/CSS/JS — no framework, no bundler; small Node scripts only for the
  optional pre-render/embed builds (no npm dependencies)
- GSAP + ScrollTrigger (CDN) for scroll reveals & parallax
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- Respects `prefers-reduced-motion`; responsive down to mobile; 44px minimum touch targets

> Placeholder content: testimonials, email, and images are placeholders — replace
> with the client's real assets before publishing.
