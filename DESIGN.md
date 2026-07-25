# DESIGN.md: Landscaper Template (inspired by kononenkogroup.com)

## Source
- URL: https://kononenkogroup.com/ (Kononenko Group — architectural bureau)
- Capture date: 2026-07-23
- Evidence: Firecrawl branding scrape + search. NOTE: the source is a WebGL-driven site that returns a 500 fallback page to any headless renderer, so pixel-level scrape/screenshot capture failed. Tokens below are synthesized from the site's known design language (minimal architecture-bureau editorial) + Firecrawl metadata ("Architectural Bureau", professional tone, monochrome theme-color `#000000`).

## Design Summary
An ultra-minimal, editorial, architecture-studio aesthetic: near-monochrome palette, enormous whitespace, oversized refined typography, full-bleed imagery, thin fixed navigation with letter-spaced micro-labels, numbered sections, and slow, elegant motion (image reveals, fades, subtle parallax). The feeling is calm, premium, and confident — the imagery does the talking.

**Translation for this project:** keep that restraint and editorial confidence, but swap cold monochrome for a warm, earthy landscaper palette (deep forest green as the "near-black", warm cream as the "white", a fresh leaf-green accent from the Berman logo). Premium landscaping, not corporate architecture — but the same minimal bones.

## Design Tokens

### Colors
| Role | Hex | Notes |
|------|-----|-------|
| `--forest` (near-black / ink) | `#1B2A21` | Primary dark; deep evergreen instead of black |
| `--forest-800` | `#24352A` | Dark section backgrounds |
| `--moss` (accent) | `#4E6B44` | Muted mid-green for lines, hovers |
| `--leaf` (bright accent) | `#7BA05B` | Fresh green from the maple-leaf logo; CTAs, active states |
| `--cream` (paper / bg) | `#F4F1EA` | Primary background ("the white") |
| `--sand` | `#E7E1D4` | Secondary surface / borders |
| `--stone` (muted text) | `#6E6A5F` | Captions, meta, muted copy |
| `--line` | `rgba(27,42,33,0.14)` | Hairline dividers |
| Light-on-dark text | `#EDE9DF` | Body text on forest sections |

Personality: professional, calm, medium energy. Colors carry meaning — leaf-green is the only "loud" color and is used sparingly.

### Typography
- **Display / headings:** an editorial serif — **Fraunces** (variable, optical) or **Cormorant Garamond**. Large, light-to-normal weight, tight leading. Evokes premium/craft.
- **Body / UI / labels:** a clean neo-grotesque — **Inter** (matches the source's grotesque UI feel). Micro-labels are UPPERCASE, `letter-spacing: 0.18em`, 11–12px.
- **Fallbacks:** `Fraunces, "Times New Roman", Georgia, serif` and `Inter, -apple-system, "Helvetica Neue", Arial, sans-serif`.
- **Type scale (fluid, clamp):**
  - Hero/H1: `clamp(2.75rem, 7vw, 7rem)`
  - Section H2: `clamp(2rem, 4.5vw, 4rem)`
  - H3: `clamp(1.25rem, 2vw, 1.75rem)`
  - Body: `clamp(1rem, 1.1vw, 1.125rem)`, line-height `1.6`
  - Micro-label: `0.72rem`, uppercase, tracked
- **Rules:** headings light weight + generous line-height; never bold display. Body dark-on-cream at ~80% ink for softness.

### Spacing And Layout
- Base unit: `8px`. Scale: 8 / 16 / 24 / 40 / 64 / 96 / 160.
- Container max-width: `1280px`, side gutters `clamp(1.25rem, 5vw, 6rem)`.
- Section vertical rhythm: `clamp(6rem, 12vw, 12rem)` — big, airy.
- Border radius: small (`2px–4px`) — architecture-minimal, almost square. Images `4px`.
- Shadows: avoid; use hairline borders (`--line`) and whitespace for separation.
- Grid: 12-col mental model; projects use a 2-col asymmetric editorial grid on desktop, 1-col on mobile.

## Components
- **Nav:** fixed top, transparent over hero → cream/blur on scroll. Left: wordmark. Center/right: micro-label links (Services · About · Projects · Testimonials · Contact). Right-most: phone/CTA. Mobile: hamburger → full-screen overlay menu.
- **Buttons:**
  - Primary: filled `--forest` bg, cream text, 2px radius, uppercase micro-label, hover → `--leaf` bg + slight letter-spacing grow.
  - Ghost: transparent, 1px `--forest` border, underline-on-hover.
- **Section headers:** small numbered index (`01 — Services`) micro-label + oversized serif title.
- **Service items:** long horizontal rows with a hairline divider between; number, title, short description, and a hover state that shifts the row + reveals a thumbnail or arrow. (Editorial list, not boxy cards.)
- **Project cards:** large image, minimal caption below (project name + type + location), image scales slightly on hover, reveals on scroll.
- **Testimonial:** single large pull-quote in serif, centered, with attribution micro-label; optional slider dots.
- **Contact / form:** minimal underlined inputs (no boxes), generous spacing, single primary submit. Business info column alongside.
- **Footer:** dark forest, wordmark, nav repeat, contact, faith/family line, credits.

## Page Patterns
Section order (single-page, anchor-nav):
1. Hero — full viewport, oversized serif headline, one line of intro, primary CTA, full-bleed background image, scroll cue.
2. `01 — Services` — editorial list rows.
3. `02 — About` — two-column: large serif statement + supporting copy + stat/marker row (family-owned, residential+commercial, Hill Country).
4. `03 — Projects` — asymmetric image grid, minimal captions.
5. `04 — Testimonials` — pull-quote.
6. `05 — Contact` — form + business details + map/hours.
7. Footer.

Responsive: mobile-first; multi-col → single-col below 800px; type scales via clamp; hover effects gated to pointer devices.

## Content Style
Voice: warm, grounded, confident, a little faith/family-forward (Berman is family-owned; "God bless" appears in their socials — keep tasteful, optional). Headlines are short and declarative. CTAs: "Get a free estimate", "Start your project", "Call (830) 992-1057". Avoid hype; let craft and imagery carry it.

## Motion (GSAP)
- Hero: headline words rise + fade in on load (stagger), background subtle scale-out.
- On scroll (ScrollTrigger): section labels + headings rise/fade; service rows stagger in; project images clip/scale reveal; parallax on hero + project images.
- Nav: background fades in after hero.
- All motion respects `prefers-reduced-motion` via `gsap.matchMedia()` (durations → 0).
- Easing: `power3.out` / `expo.out`; slow durations (0.8–1.2s) for the calm, premium feel.

## Agent Build Instructions
1. Single-page site, section anchors matching nav tabs: Services, About, Projects, Testimonials, Contact.
2. All business-specific text/images come from one `SITE` config object (see `assets/js/config.js`) rendered via `{{token}}` placeholders — so a new client = edit one file. Tokens are named to match GHL custom values for a copy-paste migration.
3. Use CSS custom properties for the full token set above so re-skinning per client = change a few variables.
4. Load Fraunces + Inter from Google Fonts; provide system fallbacks.
5. GSAP + ScrollTrigger via CDN; wrap all animation in `matchMedia` with a reduced-motion branch.
6. Contact form: structured for GHL — either replace with a GHL form iframe or POST to a GHL inbound webhook (see `GHL-INTEGRATION.md`).
7. Keep it minimal — fewer sections, lots of whitespace, imagery-forward. Placeholder images from Unsplash landscaping until client assets arrive.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://kononenkogroup.com/
target_stack: static HTML/CSS/JS (GHL-embeddable), GSAP
output: DESIGN.md
