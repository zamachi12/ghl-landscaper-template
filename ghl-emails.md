# GHL Workflow Emails — Berman Lawn & Landscape

Paste these into the **Send Email** actions of your lead-intake workflow.
Merge fields used:
- `{{contact.first_name}}` — lead's first name (from `full_name`)
- `{{inboundWebhookRequest.service}}` — service they picked
- `{{inboundWebhookRequest.message}}` — their project details
- `{{inboundWebhookRequest.phone}}` — their phone

> To reuse for another client, swap the name/phone or replace with
> `{{custom_values.company_name}}` / `{{custom_values.phone_display}}`.

---

## 1) Customer auto-reply  (send to the lead)

**From name:** Berman Lawn & Landscape
**Subject:** Thanks, {{contact.first_name}} — we got your request

**Body (plain text):**
```
Hi {{contact.first_name}},

Thanks for reaching out to Berman Lawn & Landscape — we've got your request and
someone from our family-owned crew will get back to you shortly, usually within
one business day.

Here's what we received:
• Service: {{inboundWebhookRequest.service}}
• Details: {{inboundWebhookRequest.message}}

If it's time-sensitive, the fastest way to reach us is a quick call or text to
(830) 992-1057.

We appreciate you thinking of us for your grounds, and we look forward to helping
you out.

Talk soon,
The Berman Lawn & Landscape Team
Fredericksburg & the Texas Hill Country
(830) 992-1057
```

**Body (simple HTML — optional, for the email builder's Code/HTML block):**
```html
<p>Hi {{contact.first_name}},</p>
<p>Thanks for reaching out to <strong>Berman Lawn &amp; Landscape</strong> — we've
got your request and someone from our family-owned crew will get back to you
shortly, usually within one business day.</p>
<p><strong>Here's what we received:</strong><br>
Service: {{inboundWebhookRequest.service}}<br>
Details: {{inboundWebhookRequest.message}}</p>
<p>If it's time-sensitive, the fastest way to reach us is a quick call or text to
<a href="tel:8309921057">(830)&nbsp;992-1057</a>.</p>
<p>We appreciate you thinking of us for your grounds, and we look forward to
helping you out.</p>
<p>Talk soon,<br>
<strong>The Berman Lawn &amp; Landscape Team</strong><br>
Fredericksburg &amp; the Texas Hill Country<br>
(830) 992-1057</p>
```

---

## 2) Owner / internal notification  (send to yourself)

**Subject:** New website lead — {{contact.first_name}} ({{inboundWebhookRequest.service}})

**Body (plain text):**
```
New lead from the website.

Name:     {{contact.first_name}} {{contact.last_name}}
Phone:    {{inboundWebhookRequest.phone}}
Email:    {{contact.email}}
Service:  {{inboundWebhookRequest.service}}
Details:  {{inboundWebhookRequest.message}}
Source:   {{inboundWebhookRequest.source}}
Page:     {{inboundWebhookRequest.page_url}}

Follow up within one business day.
```

---

## Suggested workflow order
1. Inbound Webhook (trigger) → mapping reference set
2. Create/Update Contact (map fields)
3. Add tags: `website-lead`, `landscaping`
4. Send Email #1 (customer auto-reply, above)
5. Send Email #2 or internal notification (owner alert, above)
6. (Optional) Create Opportunity in "New Leads" pipeline stage
7. (Optional) If-no-reply-in-24h → follow-up SMS/email
