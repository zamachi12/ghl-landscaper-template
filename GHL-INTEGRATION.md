# Connecting this template to GoHighLevel (GHL)

This site is a static HTML/CSS/JS template built to drop into GHL and wire to the
GHL backend (dynamic fields + automations). There are two ways to use it, and you
can mix them.

---

## The big picture — how it's built for GHL

Every piece of business text/image is a **`{{token}}`** in the HTML, filled from
one file: [`assets/js/config.js`](assets/js/config.js). Those token names are
**identical to GHL Custom Value names**, so migrating to GHL's server-side merge
fields is a find-and-replace, not a rewrite.

- `{{company_name}}` in the HTML  ⇄  `{{ custom_values.company_name }}` in GHL
- `{{phone_display}}`              ⇄  `{{ custom_values.phone_display }}`
- …and so on for every key in `config.js`.

---

## Path A — Fastest to pitch (recommended for demos)

Keep `config.js`. To pitch a new landscaper, **edit one file**:

1. Open `assets/js/config.js`, change the values (name, phone, services, images).
2. Open `index.html` in a browser — done. Nothing else to touch.

This is the "modify their info and go" workflow you asked for. Great for mockups
and quick client demos before they've signed.

---

## Path B — Full GHL backend (dynamic fields + automations)

Once a client is on GHL, move the business data into **GHL Custom Values** so the
client (or your automations) can update it without touching code.

### 1. Create the Custom Values in GHL
`Settings → Custom Values → Add`. Create one per key in `config.js`:

| Custom Value name | Example |
|---|---|
| `company_name` | Berman Lawn & Landscape |
| `company_short` | Berman |
| `tagline` | Family-owned lawn & landscape… |
| `phone_display` | (830) 992-1057 |
| `phone_raw` | 8309921057 |
| `email` | hello@bermanlawn.com |
| `address_line` | 706 S Creek St |
| `address_city` | Fredericksburg, TX 78624 |
| `areas_served` | Fredericksburg & nearby Hill Country |
| `hours` | Mon–Sat · 7 AM – 9 PM |
| `hero_headline`, `hero_sub`, `hero_cta`, `hero_eyebrow` | … |
| `about_statement`, `about_body` | … |
| `contact_headline`, `contact_sub` | … |

> Lists (services, projects, testimonials) are arrays — GHL Custom Values are flat
> strings, so keep those in `config.js`, **or** flatten them into numbered custom
> values (`service_1_title`, `service_1_desc`, …) if the client must edit them in GHL.

### 2. Swap tokens to GHL merge syntax
In `index.html`, change `{{company_name}}` → `{{ custom_values.company_name }}`
(GHL fills these server-side when it renders the page). Because the names match,
this is a bulk find/replace. You can then delete `config.js` and its `fillTokens`
call, or leave it as a local fallback.

> GHL also exposes built-ins you can use directly:
> `{{ location.name }}`, `{{ location.phone }}`, `{{ location.address }}`,
> `{{ location.email }}`.

### 3. Put the code into GHL
Two options:
- **Funnel/Website page:** add a **Custom Code / Custom JS-HTML** element and paste
  the HTML. Move the `<style>` into the page's custom CSS and the `<script>` into
  page custom JS/footer. (Inline everything into one file first — see below.)
- **Full-page custom code:** use a blank funnel step and paste the whole document.

To produce a single paste-ready file, inline the CSS and JS into `index.html`
(replace the `<link>`/`<script src>` with `<style>…</style>` and `<script>…</script>`).
Ask me and I'll generate a `index.inlined.html` build.

---

## Connecting the contact form to GHL (leads → automations)

The form (`[data-lead-form]`) already collects `full_name`, `phone`, `email`,
`service`, `message`, plus `source` and `page_url`. Two ways to deliver it:

### Option 1 — Inbound Webhook (keeps this custom form/design)
1. In GHL build a **Workflow** with trigger **Inbound Webhook**. Copy its URL.
2. Paste it into `ghl_webhook_url` in `config.js`.
3. The form POSTs JSON to it. In the workflow, map fields → **Create/Update
   Contact**, then add your automations:
   - Add tag `website-lead`, `landscaping`
   - Send auto-reply SMS/email ("Thanks {{contact.first_name}}, we got your request…")
   - Notify the owner (SMS/email/internal notification)
   - Create an Opportunity in a "New Leads" pipeline stage
   - Start a nurture sequence if no reply in 24h

> The JSON keys are already close to GHL contact fields. Map `full_name`→Name,
> `phone`→Phone, `email`→Email, and `service`/`message` to custom fields.

### Option 2 — Embed a native GHL form/survey (zero backend wiring)
Replace the `<form data-lead-form>…</form>` block in `index.html` with the GHL
form embed iframe (`Sites → Forms → Integrate → Embed`). You lose this form's
styling but get GHL validation, spam protection, and native automation triggers
out of the box. Good when the client wants to manage fields themselves.

---

## Other GHL services you can layer on (upsell surface)

Because leads and content flow through GHL, you can pitch these on top:
- **Missed-call text-back**, **2-way SMS**, **email + SMS nurture** on the lead.
- **Calendar / booking**: swap the CTA to a GHL calendar link or embed for
  "Book a free estimate" self-scheduling.
- **Reviews**: automation to request Google reviews after a completed job
  (Berman is at 4.0 — review velocity is an easy win to pitch).
- **Reputation / listings**, **payments/invoices** (GHL takes cards — Berman
  already accepts credit cards), **pipeline reporting** for the owner.
- **Chat widget**: paste GHL's live-chat/webchat snippet before `</body>`.

---

## Reskin checklist (per new client)
- [ ] `config.js`: name, short name, tagline, phone (display + raw), email, address, areas, hours
- [ ] `config.js`: hero headline/sub/CTA/eyebrow + hero image
- [ ] `config.js`: services, projects, testimonials arrays + images
- [ ] Colors: edit the `:root` tokens in `assets/css/styles.css` (`--forest`, `--leaf`, `--cream`) to match their brand
- [ ] Replace all Unsplash placeholder images with the client's real photos/videos
- [ ] `config.js`: paste the GHL inbound-webhook URL (or embed a GHL form)
- [ ] Confirm the real email address (current one is a placeholder)
- [ ] Point a domain / GHL subdomain at the page

---

## Notes / honesty
- Testimonials in `config.js` are **placeholder** copy — replace with the client's
  real, attributed reviews before publishing.
- The email in `config.js` is a **placeholder**; confirm the real one.
- Images are Unsplash placeholders (licensed for use, but not the client's brand) —
  swap for the client's own photos before going live.
