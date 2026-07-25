/* =============================================================================
   SITE CONFIG  —  THE ONLY FILE YOU EDIT TO PITCH A NEW CLIENT
   -----------------------------------------------------------------------------
   Every value below fills a {{token}} in index.html. To reskin the template
   for a different landscaper, change the values here (and swap the images).

   GHL NOTE: each key lists the matching GoHighLevel Custom Value name in a
   comment. In GHL you can either:
     (A) keep this JS file and just edit values per client, OR
     (B) delete this file and let GHL replace {{custom_values.x}} tokens
         server-side (see GHL-INTEGRATION.md). The token names match 1:1.
   ========================================================================== */

window.SITE = {
  // --- Brand / identity -----------------------------------------------------
  company_name: "Berman Lawn & Landscape",       // GHL: {{custom_values.company_name}}  (or {{location.name}})
  company_short: "Berman",                        // GHL: {{custom_values.company_short}}
  tagline: "Family-owned lawn & landscape in the Texas Hill Country.", // {{custom_values.tagline}}
  founded_note: "Family owned & operated",        // {{custom_values.founded_note}}

  // --- Contact --------------------------------------------------------------
  phone_display: "(830) 992-1057",                // {{custom_values.phone_display}} (or {{location.phone}})
  phone_raw: "8309921057",                        // used for tel: links
  email: "hello@bermanlawn.com",                  // {{custom_values.email}}  (PLACEHOLDER — confirm real email)
  address_line: "706 S Creek St",                 // {{custom_values.address_line}} (or {{location.address}})
  address_city: "Fredericksburg, TX 78624",       // {{custom_values.address_city}}
  areas_served: "Fredericksburg & nearby Hill Country",  // {{custom_values.areas_served}}
  hours: "Mon–Sat · 7:00 AM – 9:00 PM",           // {{custom_values.hours}}

  // --- Social (optional; leave "" to hide) ----------------------------------
  facebook_url: "https://www.facebook.com/bermanlawnandlandscape/",
  instagram_url: "https://www.instagram.com/bermanlawnandlandscape/",

  // --- Hero -----------------------------------------------------------------
  hero_eyebrow: "Landscaping · Fredericksburg, TX",
  hero_headline: "Grounds worth\ncoming home to.",   // \n = line break in the big headline
  hero_sub: "Design, installation, and dependable maintenance for residential and commercial properties across the Hill Country.",
  hero_cta: "Get a free estimate",
  hero_image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2000&auto=format&fit=crop", // PLACEHOLDER

  // --- Services (01) --------------------------------------------------------
  // Add / remove freely — the list renders itself.
  services: [
    {
      title: "Lawn Care & Maintenance",
      desc: "Mowing, edging, trimming, seasonal cleanups, and fertilization on a schedule you can count on.",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1400&auto=format&fit=crop"
    },
    {
      title: "Landscape Design & Installation",
      desc: "Beds, sod, native plantings, mulch, decomposed granite, and hardscape built to last.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1400&auto=format&fit=crop"
    },
    {
      title: "Artificial Turf",
      desc: "Clean, water-wise turf installation, infill, and refresh for lawns, play areas, and pet runs.",
      image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=1400&auto=format&fit=crop"
    },
    {
      title: "Junk Removal & Hauling",
      desc: "Lot clearing, debris removal, and hauling with our own skid steer and dump trailer.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1400&auto=format&fit=crop"
    }
  ],

  // --- About (02) -----------------------------------------------------------
  about_statement: "We treat every property like it's our own — because keeping it in the family is the whole point.",
  about_body: "Berman Lawn & Landscape is a family-owned and operated crew serving Fredericksburg and the surrounding Hill Country. From weekly maintenance to full landscape installs, we show up on time, do honest work, and leave your grounds better than we found them — for homes and businesses alike.",
  about_stats: [
    { value: "Family", label: "Owned & operated" },
    { value: "Res + Com", label: "Residential & commercial" },
    { value: "Hill Country", label: "Fredericksburg & nearby" }
  ],
  about_image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1400&auto=format&fit=crop", // PLACEHOLDER

  // --- Projects (03) --------------------------------------------------------
  projects: [
    { name: "Hill Country Front Yard", type: "Design & Install", location: "Fredericksburg, TX", image: "https://images.unsplash.com/photo-1601158935942-52255782d322?q=80&w=1400&auto=format&fit=crop" },
    { name: "Backyard Turf & Beds", type: "Artificial Turf", location: "Fredericksburg, TX", image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=1400&auto=format&fit=crop" },
    { name: "Commercial Grounds", type: "Maintenance", location: "Gillespie County, TX", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1400&auto=format&fit=crop" },
    { name: "Lot Clearing & Haul-off", type: "Junk Removal", location: "Fredericksburg, TX", image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1400&auto=format&fit=crop" }
  ],

  // --- Testimonials (04) — PLACEHOLDER copy; replace with real reviews -------
  testimonials: [
    { quote: "Honest, on time, and stayed until the work was done right. The crew was polite and the yard has never looked better.", author: "Homeowner", meta: "Fredericksburg, TX" },
    { quote: "They handled our beds, sod, and haul-off in one go. Easy to work with and fair on price — we'll hire them again.", author: "Property Manager", meta: "Hill Country, TX" }
  ],

  // --- Contact (05) ---------------------------------------------------------
  contact_headline: "Let's talk about your grounds.",
  contact_sub: "Tell us what you need and we'll get back to you with a free estimate.",

  // FORM DESTINATION — see GHL-INTEGRATION.md.
  // Paste your GHL Inbound Webhook URL here to send leads straight into GHL.
  // Leave "" to run in demo mode (logs to console, no network call).
  ghl_webhook_url: "https://services.leadconnectorhq.com/hooks/jRLNTl0tyE6QmS3jOOZo/webhook-trigger/97088e91-9739-415d-aaf5-8e6b91f48e7d"
};
