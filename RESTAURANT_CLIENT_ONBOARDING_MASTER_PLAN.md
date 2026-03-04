# BAAM System R — Restaurant Premium
# Client Onboarding Master Plan — Pipeline B

> **Purpose:** Complete specification for onboarding any new restaurant client onto System R.
> **Method:** 7-step automated pipeline (O1–O7) — CLI or Admin UI — < 60 seconds.
> **Reference this file:** `@RESTAURANT_CLIENT_ONBOARDING_MASTER_PLAN.md` attached for Phase 4E, Phase 5, and all Pipeline B Cursor prompts.
> **Rule:** Never skip O7. Never edit client content manually to work around pipeline bugs — fix the pipeline.

---

## Table of Contents

1. [Pipeline B Overview](#1-pipeline-b-overview)
2. [What Changes Per Client](#2-what-changes-per-client)
3. [7-Step Pipeline O1–O7](#3-7-step-pipeline-o1o7)
4. [Restaurant Intake Schema](#4-restaurant-intake-schema)
5. [Menu Catalog — O3 Pruning](#5-menu-catalog--o3-pruning)
6. [Replacement Pairs — O4](#6-replacement-pairs--o4)
7. [AI Prompt Spec — O5](#7-ai-prompt-spec--o5)
8. [Brand Variants Config](#8-brand-variants-config)
9. [Admin UI Wizard](#9-admin-ui-wizard)
10. [CLI Interface](#10-cli-interface)
11. [Contamination Verification — O7](#11-contamination-verification--o7)
12. [Post-Pipeline Content Checklist](#12-post-pipeline-content-checklist)
13. [Client Handoff Protocol](#13-client-handoff-protocol)
14. [Production Deployment Per Client](#14-production-deployment-per-client)
15. [Pipeline B Done-Gate](#15-pipeline-b-done-gate)
16. [Anti-Patterns](#16-anti-patterns)

---

## 1. Pipeline B Overview

```
Restaurant Intake JSON
        ↓
  Pipeline B (O1–O7)
        ↓
  Customized Client Site
  (~$0.13 · ~30–60 seconds)
```

**The core principle:** The Meridian template is never modified for any client. Each client gets their own `site_id` in the database. Pipeline B clones the template content, applies client-specific customizations, then verifies the output is clean.

**Economics:**
- Developer time per client: ~2 hours (mostly menu entry + photo upload)
- Pipeline execution time: < 60 seconds (with AI) · < 20 seconds (skip-AI mode)
- Claude API cost per client: ~$0.08–$0.18 depending on content length
- Template code changes needed: zero

**Two execution methods:**
- Admin UI wizard at `/admin/onboarding` — browser-based, SSE progress streaming
- CLI: `node scripts/onboard-client.mjs {client-id}` — terminal, for developers

---

## 2. What Changes Per Client

| What | How | Step |
|---|---|---|
| Business name, address, phone, email, domain | Deterministic string replacement | O4 |
| Brand colors, fonts, radius | Variant selection + color overrides | O2 |
| Menu types offered | Remove disabled types from 5 files | O3 |
| Hero tagline, about story, chef bio, testimonials | AI generation via Claude API | O5 |
| SEO titles + descriptions for all pages | AI generation via Claude API | O5 |
| Languages supported | Delete unsupported locale rows | O6 |
| Reservation provider + widget config | Structural rebuild | O4 |
| Feature flags (private dining, events, etc.) | `sites` table update | O4 |
| Hours (full 7-day schedule) | Structural rebuild | O4 |
| Team profiles (names, roles, credentials) | Structural rebuild | O4 |
| Social links | Structural rebuild | O4 |

**What stays the same (cloned from template):**
Page structure · React components · Admin UI · API endpoints · CSS variables pipeline · DB schema · QA scripts · SEO infrastructure.

---

## 3. 7-Step Pipeline O1–O7

### Step Summary

| Step | Name | Duration | What It Does |
|---|---|---|---|
| O1 | Clone | ~5s | Copy all Meridian `content_entries` to new `site_id`; register domains in `site_domains` table |
| O2 | Brand | <1s | Apply `brand-variants-restaurant.json` for selected variant; apply any color/font overrides from intake |
| O3 | Prune | ~3s | Delete disabled menu types from all 5 affected files |
| O4 | Replace | ~5s | Deep string replacement (18 pairs, longest-first); structural rebuilds for hours/team/social/reservations |
| O5 | AI Content | ~20s | Claude API Call 1: hero/bios/testimonials · Call 2: all-page SEO titles + descriptions |
| O6 | Cleanup | <1s | Delete `content_entries` rows for unsupported locales |
| O7 | Verify | <1s | Required paths present · contamination scan · menu item count check |

---

### O1 — Clone

**File:** `scripts/onboard/o1-clone.mjs`

**What it does:**

```javascript
// 1. Validate intake JSON against schema
validateIntake(intake)

// 2. Insert new site into `_sites.json` config
insertSiteConfig(intake.clientId, {
  id: intake.clientId,
  name: intake.business.name,
  domain: intake.domains.production,
  locales: intake.locales.supported,
  defaultLocale: intake.locales.default,
  enabled: true,
  type: "restaurant",
  subType: intake.business.subType
})

// 3. Register domains in `site_domains` table
INSERT INTO site_domains (site_id, domain, is_primary)
VALUES
  (intake.clientId, intake.domains.production, true),
  (intake.domains.dev, false)  // if dev domain provided

// 4. Clone all content_entries from template
SELECT * FROM content_entries WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId (new UUIDs, same path/locale/data)

// 5. Clone all menu_categories
SELECT * FROM menu_categories WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId, new UUIDs
→ Build category_id mapping: { oldId → newId }

// 6. Clone all menu_items
SELECT * FROM menu_items WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId, new UUIDs
→ Remap category_id using mapping from step 5

// 7. Clone team_members
SELECT * FROM team_members WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId

// 8. Clone gallery_items
SELECT * FROM gallery_items WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId

// 9. Clone press_items
SELECT * FROM press_items WHERE site_id = intake.templateSiteId
→ INSERT with site_id = intake.clientId

// DO NOT CLONE: events, blog_posts, bookings, contact_submissions
// (clients start fresh — no Meridian events or blog content)
```

**Expected output:**
```
[O1] Cloning the-meridian → {clientId}...
[O1] content_entries: 63 rows cloned
[O1] menu_categories: 9 rows cloned (category_id map built)
[O1] menu_items: 121 rows cloned (category_ids remapped)
[O1] team_members: 5 rows cloned
[O1] gallery_items: 26 rows cloned
[O1] press_items: 5 rows cloned
[O1] site_domains: 1 row inserted
[O1] ✅ Clone complete in 5.2s
```

---

### O2 — Brand

**File:** `scripts/onboard/o2-brand.mjs`

**What it does:**

```javascript
// 1. Load brand variant from brand-variants-restaurant.json
const variant = BRAND_VARIANTS[intake.brand.variant]
// variant = { colorPrimary, colorSecondary, fontDisplay, fontHeading, ... all tokens }

// 2. Apply color overrides from intake (if any)
if (intake.brand.primaryColor) {
  variant.colorPrimary = intake.brand.primaryColor
  // Derive shade variants:
  variant.colorPrimaryHover  = darken(intake.brand.primaryColor, 0.12)
  variant.colorPrimary50     = lighten(intake.brand.primaryColor, 0.42)
  variant.colorPrimary100    = lighten(intake.brand.primaryColor, 0.32)
}

// 3. Update theme content_entry for this client
UPDATE content_entries
SET data = JSON_MERGE(data, { variant: intake.brand.variant, tokens: variant })
WHERE site_id = intake.clientId AND path = 'theme'
```

**Expected output:**
```
[O2] Applying brand variant: noir-saison
[O2] No primary color override
[O2] ✅ Brand applied in 0.8s
```

**`brand-variants-restaurant.json` structure:**

```json
{
  "noir-saison": {
    "colorPrimary": "#C9A84C",
    "colorPrimaryHover": "#B8933B",
    "colorPrimary50": "#F7F0DC",
    "colorPrimary100": "#EFE0B9",
    "colorSecondary": "#8B7355",
    "colorBackdrop": "#0A0A0A",
    "colorBackdropCard": "#111111",
    "colorBackdropSurface": "#1A1A1A",
    "colorBackdropSecondary": "#141414",
    "colorTextPrimary": "#F5F0E8",
    "colorTextSecondary": "#C8BFB0",
    "colorTextMuted": "#8A8070",
    "colorTextInverse": "#0A0A0A",
    "colorBorder": "#2A2520",
    "fontDisplay": "'Cormorant Garamond', Georgia, serif",
    "fontHeading": "'Cormorant Garamond', Georgia, serif",
    "fontBody": "'Inter', system-ui, sans-serif",
    "fontUi": "'Inter', system-ui, sans-serif",
    "cardRadius": "2px",
    "btnRadius": "2px",
    "badgeRadius": "2px"
  },
  "terre-vivante": {
    "colorPrimary": "#8B4513",
    "colorPrimaryHover": "#7A3C10",
    "colorPrimary50": "#F5EAE0",
    "colorPrimary100": "#EBD5C0",
    "colorSecondary": "#6B7C5C",
    "colorBackdrop": "#FAF6F0",
    "colorBackdropCard": "#F5EEE5",
    "colorBackdropSurface": "#EFE6D8",
    "colorBackdropSecondary": "#EBE2D2",
    "colorTextPrimary": "#2C1810",
    "colorTextSecondary": "#5C3D28",
    "colorTextMuted": "#8C6B50",
    "colorTextInverse": "#FAF6F0",
    "colorBorder": "#DDD0C0",
    "fontDisplay": "'Playfair Display', Georgia, serif",
    "fontHeading": "'Playfair Display', Georgia, serif",
    "fontBody": "'Lato', system-ui, sans-serif",
    "fontUi": "'Lato', system-ui, sans-serif",
    "cardRadius": "8px",
    "btnRadius": "6px",
    "badgeRadius": "4px"
  },
  "velocite": {
    "colorPrimary": "#C41E3A",
    "colorPrimaryHover": "#B01A33",
    "colorPrimary50": "#FCE8EB",
    "colorPrimary100": "#F9D1D7",
    "colorSecondary": "#1A1A2E",
    "colorBackdrop": "#FFFFFF",
    "colorBackdropCard": "#F8F8F8",
    "colorBackdropSurface": "#F2F2F2",
    "colorBackdropSecondary": "#EBEBEB",
    "colorTextPrimary": "#0A0A0A",
    "colorTextSecondary": "#3A3A3A",
    "colorTextMuted": "#7A7A7A",
    "colorTextInverse": "#FFFFFF",
    "colorBorder": "#E0E0E0",
    "fontDisplay": "'DM Serif Display', Georgia, serif",
    "fontHeading": "'DM Serif Display', Georgia, serif",
    "fontBody": "'DM Sans', system-ui, sans-serif",
    "fontUi": "'DM Sans', system-ui, sans-serif",
    "cardRadius": "0px",
    "btnRadius": "4px",
    "badgeRadius": "2px"
  },
  "matin-clair": {
    "colorPrimary": "#2D7A4F",
    "colorPrimaryHover": "#246640",
    "colorPrimary50": "#E8F5EE",
    "colorPrimary100": "#D1EBDD",
    "colorSecondary": "#F4A024",
    "colorBackdrop": "#FDFCF8",
    "colorBackdropCard": "#F8F6F0",
    "colorBackdropSurface": "#F0EDE5",
    "colorBackdropSecondary": "#EAE7DE",
    "colorTextPrimary": "#1A2E1F",
    "colorTextSecondary": "#3D5A44",
    "colorTextMuted": "#6B8A72",
    "colorTextInverse": "#FDFCF8",
    "colorBorder": "#DDE8DF",
    "fontDisplay": "'Nunito', system-ui, sans-serif",
    "fontHeading": "'Nunito', system-ui, sans-serif",
    "fontBody": "'Nunito', system-ui, sans-serif",
    "fontUi": "'Nunito', system-ui, sans-serif",
    "cardRadius": "16px",
    "btnRadius": "999px",
    "badgeRadius": "999px"
  }
}
```

---

### O3 — Prune

**File:** `scripts/onboard/o3-prune.mjs`

**What it does:**

```javascript
const enabledMenuTypes = intake.menu.enabled  // e.g. ["dinner", "cocktails", "wine"]
const allMenuTypes = Object.values(MENU_CATALOG).flat().map(m => m.slug)
const disabledTypes = allMenuTypes.filter(t => !enabledMenuTypes.includes(t))

for (const slug of disabledTypes) {
  // 1. Delete content_entry for this menu page
  DELETE FROM content_entries
  WHERE site_id = clientId AND path = `pages/menu-${slug}`

  // 2. Remove from navigation.json dropdown
  const nav = getContentEntry(clientId, 'navigation')
  nav.data.primary = nav.data.primary.map(item => {
    if (item.label.en === 'Menu' && item.children) {
      item.children = item.children.filter(c => c.href !== `/menu/${slug}`)
    }
    return item
  })
  updateContentEntry(clientId, 'navigation', nav.data)

  // 3. Remove from pages/menu.json hub cards
  const menuHub = getContentEntry(clientId, 'pages/menu')
  menuHub.data.sections = menuHub.data.sections.map(section => {
    if (section.type === 'menu-hub-grid') {
      section.data.cards = section.data.cards.filter(c => c.slug !== slug)
    }
    return section
  })
  updateContentEntry(clientId, 'pages/menu', menuHub.data)

  // 4. Remove from pages/home.json menu-preview section
  const home = getContentEntry(clientId, 'pages/home')
  home.data.sections = home.data.sections.map(section => {
    if (section.type === 'menu-preview') {
      section.data.featured_types = section.data.featured_types?.filter(t => t !== slug)
    }
    return section
  })
  updateContentEntry(clientId, 'pages/home', home.data)

  // 5. Remove from footer.json menu links column
  const footer = getContentEntry(clientId, 'footer')
  footer.data.menu_links = footer.data.menu_links?.filter(l => l.slug !== slug)
  updateContentEntry(clientId, 'footer', footer.data)

  // 6. Delete menu_categories and menu_items for this type
  const categories = await getCategoriesByMenuType(clientId, slug)
  const categoryIds = categories.map(c => c.id)
  DELETE FROM menu_items WHERE site_id = clientId AND category_id IN (categoryIds)
  DELETE FROM menu_categories WHERE site_id = clientId AND menu_type = slug
}
```

**Also prune feature-gated page entries:**

```javascript
const featurePageMap = {
  private_dining:  'pages/private-dining',
  events_section:  'pages/events',
  press_section:   'pages/press',
  blog:            'pages/blog',
  gift_cards:      'pages/gift-cards',
  careers:         'pages/careers',
}

for (const [feature, path] of Object.entries(featurePageMap)) {
  if (!intake.features[feature]) {
    DELETE FROM content_entries WHERE site_id = clientId AND path = path
    // Also remove from footer links and nav
    pruneNavLink(clientId, `/${path.replace('pages/','')}`)
    pruneFooterLink(clientId, `/${path.replace('pages/','')}`)
  }
}
```

**Expected output:**
```
[O3] Enabled menu types: dinner, cocktails, wine
[O3] Pruning: lunch, brunch, breakfast, seasonal, kids, desserts, beer, drinks, happy-hour, tasting-menu, prix-fixe
[O3] Removed 11 menu page content entries
[O3] Removed 11 nav dropdown items
[O3] Removed 11 menu hub cards
[O3] Removed 11 footer menu links
[O3] Removed 847 menu_items + 44 menu_categories across disabled types
[O3] Feature flags: private_dining=true, events_section=true, blog=false → pruned /blog
[O3] ✅ Prune complete in 3.1s
```

---

### O4 — Replace

**File:** `scripts/onboard/o4-replace.mjs`

**Part A — Deep String Replacement:**

```javascript
// Load all content_entries for this client
const entries = await getAllContentEntries(clientId)

// Build replacement pairs array (sorted longest → shortest — CRITICAL)
const pairs = buildReplacementPairs(intake)
// pairs = [
//   { find: "The Meridian Restaurant", replace: "La Bella Vita Restaurant" },
//   { find: "The Meridian", replace: "La Bella Vita" },
//   ... 16 more pairs, longest first
// ]

// Deep replace function — handles nested objects and arrays
function deepReplace(obj, pairs) {
  if (typeof obj === 'string') {
    let result = obj
    for (const { find, replace } of pairs) {
      if (!replace) continue  // skip if intake field was empty
      result = result.replaceAll(find, replace)
    }
    return result
  }
  if (Array.isArray(obj)) return obj.map(item => deepReplace(item, pairs))
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepReplace(v, pairs)])
    )
  }
  return obj
}

// Apply to all entries
for (const entry of entries) {
  const newData = deepReplace(entry.data, pairs)
  UPDATE content_entries SET data = newData, updated_at = NOW()
  WHERE id = entry.id
}
```

**Part B — Structural Rebuilds:**

```javascript
// 1. HOURS — replace entire hours object in site.json
const siteEntry = getContentEntry(clientId, 'site')
siteEntry.data.hours = {
  monday:    intake.hours.monday    ?? null,
  tuesday:   intake.hours.tuesday   ?? null,
  wednesday: intake.hours.wednesday ?? null,
  thursday:  intake.hours.thursday  ?? null,
  friday:    intake.hours.friday    ?? null,
  saturday:  intake.hours.saturday  ?? null,
  sunday:    intake.hours.sunday    ?? null,
  note: intake.hours.holidayNote
    ? { en: intake.hours.holidayNote }
    : undefined
}

// 2. TEAM PROFILES — delete template team, insert client team
DELETE FROM team_members WHERE site_id = clientId
for (const member of intake.business.teamMembers ?? []) {
  INSERT INTO team_members ({
    site_id: clientId,
    slug: member.slug,
    name: member.name,
    role: { en: member.role },
    bio: { en: `[AI will generate in O5]` },
    credentials: member.credentials ?? [],
    featured: member.slug === intake.business.teamMembers[0]?.slug, // first = chef = featured
    active: true,
    display_order: index
  })
}

// 3. SOCIAL LINKS
siteEntry.data.social = {
  instagram: intake.social.instagram ?? null,
  instagram_handle: intake.social.instagram ?? null,
  facebook: intake.social.facebook ?? null,
  yelp: intake.social.yelp ?? null,
  google_maps: intake.social.google ?? null,
  resy: intake.reservations.provider === 'resy'
    ? `https://resy.com/cities/ny/${intake.clientId}` : null,
  opentable: intake.reservations.provider === 'opentable'
    ? `https://www.opentable.com/r/${intake.clientId}` : null,
}

// 4. RESERVATION CONFIG
siteEntry.data.features.reservation_provider = intake.reservations.provider
siteEntry.data.features.resy_venue_id = intake.reservations.resyVenueId ?? null
siteEntry.data.features.opentable_id = intake.reservations.openTableId ?? null

// 5. FEATURE FLAGS — update sites table
UPDATE sites SET features = intake.features WHERE id = clientId

// 6. COORDINATES + ADDRESS
siteEntry.data.lat = intake.location.lat ?? null
siteEntry.data.lng = intake.location.lng ?? null
siteEntry.data.address = {
  street: intake.location.address,
  city: intake.location.city,
  state: intake.location.state,
  zip: intake.location.zip,
  country: "US",
  full: {
    en: `${intake.location.address}, ${intake.location.city}, ${intake.location.state} ${intake.location.zip}`
  }
}

// Save site entry
updateContentEntry(clientId, 'site', siteEntry.data)
```

**Expected output:**
```
[O4] Building 18 replacement pairs (sorted longest-first)...
[O4] Deep replacing 63 content entries...
[O4] Applied "The Meridian Restaurant" → "La Bella Vita Restaurant" (4 occurrences)
[O4] Applied "The Meridian" → "La Bella Vita" (87 occurrences)
[O4] Applied "Chef Marcus Webb" → "Chef Sofia Romano" (12 occurrences)
... (all 18 pairs logged with occurrence count)
[O4] Structural rebuild: hours (6 days set, monday=null)
[O4] Structural rebuild: team (2 members inserted)
[O4] Structural rebuild: social (instagram, facebook, yelp)
[O4] Structural rebuild: reservation config (provider=resy, venueId=venue-xyz)
[O4] Structural rebuild: feature flags updated in sites table
[O4] ✅ Replace complete in 4.8s
```

---

### O5 — AI Content

**File:** `scripts/onboard/o5-ai-content.mjs`
**Prompt files:** `scripts/onboard/prompts/restaurant/content.md` + `seo.md`

**Two API calls per client:**

#### Call 1 — Content Generation

**System prompt** (from `content.md`):

```
You are generating content for a restaurant website.
Output ONLY a JSON object — no preamble, no markdown fences, no explanation.
All text fields must be genuine, specific, and reflect this restaurant's identity.
Never use generic phrases like "culinary excellence" or "unforgettable dining experience".
Vary sentence structure. Sound like a real person wrote it.
```

**User prompt** (assembled from intake):

```
Generate content for:
Restaurant: {{businessName}}
Chef/Owner: {{chefName}} ({{ownerTitle}})
Chef credentials: {{chefCredentials}}
Cuisine: {{cuisineType}} ({{subType}})
City: {{city}}, {{state}}
Founded: {{foundedYear}}
Voice: {{voice}}
Unique selling points:
{{uniqueSellingPoints}}
Target guests: {{targetDemographic}}
Team: {{teamMembers}}
Languages to generate (all fields): {{languages}}

Return JSON matching this exact structure:
{
  "hero": {
    "tagline": { "en": "6–8 words, specific to this restaurant" },
    "description": { "en": "1–2 sentences. Mention cuisine + city + 1 USP." }
  },
  "aboutStory": {
    "en": "3 paragraphs ~200 words. Para 1: founding story. Para 2: philosophy + sourcing. Para 3: what guests experience."
  },
  "chefBio": {
    "en": "3 paragraphs ~250 words. Para 1: background + credentials. Para 2: culinary philosophy. Para 3: personal touch."
  },
  "chefQuote": {
    "en": "1 sentence. Chef's culinary philosophy in their own voice. No clichés."
  },
  "teamBios": [
    { "slug": "{slug}", "shortBio": { "en": "2 sentences" }, "bio": { "en": "2 paragraphs" } }
  ],
  "whyChooseUs": [
    { "title": { "en": "..." }, "description": { "en": "2 sentences" } }
  ],
  "testimonials": [
    {
      "guestName": "First name + last initial",
      "review": { "en": "2–3 sentences. Specific dish or moment mentioned." },
      "occasion": "Anniversary dinner",
      "rating": 5
    }
  ],
  "announcementBar": { "en": "~15 words. Current special, upcoming event, or seasonal note." },
  "privateDiningTeaser": { "en": "1–2 sentences. Only if private_dining=true." }
}
```

**Rules enforced in prompt:**
- Generate for all languages in `intake.locales.supported`
- If ZH requested: generate authentic Mandarin, not translated English
- If ES requested: generate authentic Spanish for target demographic
- Never invent awards or press mentions
- Never claim specific ratings (e.g. "our 4.9-star rating")
- Never use "culinary journey", "passion for food", "unforgettable"
- Testimonials: 5 reviews, different occasions, different tones

#### Call 2 — SEO Generation

**User prompt:**

```
Generate SEO metadata for all pages of {{businessName}} — {{cuisineType}} restaurant in {{city}}, {{state}}.

Rules:
- Every title includes restaurant name
- Every description includes city + cuisine
- Home page targets: "{{cuisineType}} restaurant {{city}}"
- Descriptions: exactly 150–160 characters, end with a call to action
- Menu pages follow: "{Menu Type} Menu | {Restaurant Name}"
- Only generate pages that are enabled: {{enabledPages}}
- Generate for locales: {{languages}}

Return JSON:
{
  "siteTitle": { "en": "...", "zh": "...", "es": "..." },
  "siteDescription": { "en": "...", "zh": "...", "es": "..." },
  "pages": {
    "home":         { "title": { "en": "..." }, "description": { "en": "..." } },
    "menu":         { "title": ..., "description": ... },
    "menu-dinner":  { "title": ..., "description": ... },
    "about":        { "title": ..., "description": ... },
    "about-team":   { "title": ..., "description": ... },
    "reservations": { "title": ..., "description": ... },
    "contact":      { "title": ..., "description": ... },
    "events":       { "title": ..., "description": ... },
    "gallery":      { "title": ..., "description": ... },
    "blog":         { "title": ..., "description": ... },
    "press":        { "title": ..., "description": ... },
    "faq":          { "title": ..., "description": ... },
    "private-dining": { "title": ..., "description": ... },
    "gift-cards":   { "title": ..., "description": ... },
    "careers":      { "title": ..., "description": ... }
  }
}
```

**After both calls — apply AI output:**

```javascript
// Apply hero content
updateSectionData(clientId, 'pages/home', 'hero', {
  headline: aiContent.hero.tagline,
  description: aiContent.hero.description
})

// Apply about story
updateSectionData(clientId, 'pages/about', 'about-story', {
  body: aiContent.aboutStory
})

// Apply chef bio + quote to team_members table
UPDATE team_members
SET bio = aiContent.chefBio,
    philosophy = aiContent.chefQuote,
    short_bio = aiContent.teamBios.find(b => b.slug === chef.slug)?.shortBio
WHERE site_id = clientId AND featured = true

// Apply non-chef team bios
for (const bio of aiContent.teamBios.filter(b => b.slug !== chefSlug)) {
  UPDATE team_members SET bio = bio.bio, short_bio = bio.shortBio
  WHERE site_id = clientId AND slug = bio.slug
}

// Apply testimonials
updateSectionData(clientId, 'pages/home', 'testimonials', {
  items: aiContent.testimonials
})

// Apply announcement bar
updateContentEntry(clientId, 'header', {
  top_bar: { message: aiContent.announcementBar }
})

// Apply SEO metadata — all pages
for (const [pagePath, seo] of Object.entries(aiSEO.pages)) {
  updateContentEntrySEO(clientId, `pages/${pagePath}`, seo)
}
updateContentEntrySEO(clientId, 'seo', {
  default_title: aiSEO.siteTitle,
  default_description: aiSEO.siteDescription
})
```

**Expected output:**
```
[O5] Building content prompt (1,847 tokens)...
[O5] Claude API call 1 (content)... 14.2s · 1,847 tokens · $0.09
[O5] Applied: hero tagline, about story, chef bio, 2 team bios, 5 testimonials
[O5] Building SEO prompt (943 tokens)...
[O5] Claude API call 2 (SEO)... 8.1s · 943 tokens · $0.05
[O5] Applied: SEO titles + descriptions for 12 enabled pages
[O5] ✅ AI content complete in 22.3s · total cost ~$0.14
```

---

### O6 — Cleanup

**File:** `scripts/onboard/o6-cleanup.mjs`

**What it does:**

```javascript
const supportedLocales = intake.locales.supported  // e.g. ["en", "es"]
const allLocales = ["en", "zh", "es", "ko"]
const unsupportedLocales = allLocales.filter(l => !supportedLocales.includes(l))

for (const locale of unsupportedLocales) {
  // Delete all content_entries for this locale for this client
  DELETE FROM content_entries
  WHERE site_id = clientId AND locale = locale

  // Note: menu_items, team_members, etc. use JSONB LocalizedString
  // Those retain the zh/es keys but they just won't be rendered
  // (LocalizedString fallback: if requested locale missing → use EN)
  // No need to strip them from JSONB — frontend handles gracefully
}

// Also: if only 1 locale supported, disable lang switcher
if (supportedLocales.length === 1) {
  const header = getContentEntry(clientId, 'header')
  header.data.top_bar.show_lang_switcher = false
  header.data.variant = header.data.variant  // no change to variant
  updateContentEntry(clientId, 'header', header.data)
}
```

**Expected output:**
```
[O6] Supported locales: en, es
[O6] Removing: zh (21 content_entries deleted)
[O6] Language switcher: EN | ES (2 locales — switcher remains active)
[O6] ✅ Cleanup complete in 0.3s
```

---

### O7 — Verify

**File:** `scripts/onboard/o7-verify.mjs`

**What it does:**

```javascript
const FORBIDDEN_STRINGS = [
  "The Meridian Restaurant",
  "The Meridian",
  "Marcus Webb",
  "themeridian.com",
  "(212) 555-0100",
  "info@themeridian.com",
  "reservations@themeridian.com",
  "1 Meridian Plaza",
  "10001",                    // Meridian zip — only if client zip is different
  "@themeridiannyc",
  "Lorem ipsum",
  "[PLACEHOLDER]",
  "[INSERT",
  "[TODO",
]

const REQUIRED_PATHS = [
  "pages/home", "pages/menu", "pages/about", "pages/about-team",
  "pages/reservations", "pages/contact",
  "site", "header", "footer", "navigation", "seo", "theme"
]

// 1. Required paths check
const existingPaths = getAllContentPaths(clientId)
const missingPaths = REQUIRED_PATHS.filter(p => !existingPaths.includes(p))
if (missingPaths.length > 0) {
  FAIL: `Missing required content paths: ${missingPaths.join(', ')}`
}

// 2. Contamination scan
const allEntries = getAllContentEntries(clientId)
const violations = []
for (const entry of allEntries) {
  const text = JSON.stringify(entry.data)
  for (const forbidden of FORBIDDEN_STRINGS) {
    if (text.includes(forbidden)) {
      violations.push({ path: entry.path, locale: entry.locale, forbidden })
    }
  }
}
// Also scan team_members, menu_items, gallery_items tables
const teamRows = getAllTeamMembers(clientId)
for (const row of teamRows) {
  const text = JSON.stringify(row)
  for (const forbidden of FORBIDDEN_STRINGS) {
    if (text.includes(forbidden)) violations.push({ table: 'team_members', id: row.id, forbidden })
  }
}

if (violations.length > 0) {
  FAIL: `Contamination found: ${violations.length} violation(s)`
  // Log each violation clearly
}

// 3. Menu item count check
for (const menuType of intake.menu.enabled) {
  const count = countMenuItems(clientId, menuType)
  if (count < 5) {
    WARN: `Menu type "${menuType}" has only ${count} items (minimum 5 recommended)`
  }
}

// 4. Site entry completeness
const site = getContentEntry(clientId, 'site')
if (!site.data.phone || site.data.phone === '(212) 555-0100') FAIL 'Phone not replaced'
if (!site.data.address?.street) FAIL 'Address not set'
const hoursSetDays = Object.values(site.data.hours).filter(h => h !== null && typeof h === 'object').length
if (hoursSetDays < 3) WARN `Only ${hoursSetDays} days of hours set — verify with client`

return { passed: violations.length === 0 && missingPaths.length === 0, violations, missingPaths }
```

**Expected output (clean run):**
```
[O7] Checking required paths... 12/12 ✅
[O7] Contamination scan: 63 content entries + 2 team members + 30 menu items...
[O7] No forbidden strings found ✅
[O7] Menu item counts: dinner(27) cocktails(20) wine(30) — all ≥ 5 ✅
[O7] Site completeness: phone ✅ address ✅ hours (6 days) ✅
[O7] ✅ Verification PASSED — site is clean
```

**Expected output (contamination found):**
```
[O7] ❌ CONTAMINATION FOUND: 3 violations
  • pages/home (en): "The Meridian" in sections[0].data.headline
  • pages/about (zh): "Marcus Webb" in sections[2].data.body
  • team_members id=abc: "themeridian.com" in bio.en
[O7] Pipeline FAILED. Fix O4 replacement pairs and re-run from O4.
```

---

## 4. Restaurant Intake Schema

Full JSON structure — use this as the template for every new client intake call.

```json
{
  "clientId": "la-bella-vita",
  "templateSiteId": "the-meridian",
  "industry": "restaurant",
  "business": {
    "name": "La Bella Vita",
    "ownerName": "Chef Sofia Romano",
    "ownerTitle": "Executive Chef & Owner",
    "chefCredentials": ["CIA Graduate", "Former Eleven Madison Park"],
    "cuisineType": "Contemporary Italian",
    "subType": "fine-dining",
    "foundedYear": 2019,
    "teamMembers": [
      {
        "slug": "chef-sofia-romano",
        "name": "Chef Sofia Romano",
        "role": "Executive Chef & Owner",
        "credentials": ["CIA Graduate", "Former Eleven Madison Park"]
      },
      {
        "slug": "marco-bianchi",
        "name": "Marco Bianchi",
        "role": "Head Sommelier"
      }
    ]
  },
  "location": {
    "address": "42 Vine Street",
    "city": "Brooklyn",
    "state": "NY",
    "zip": "11201",
    "phone": "(718) 555-0200",
    "email": "info@labellacita.com",
    "lat": 40.6892,
    "lng": -73.9442,
    "googleMapsEmbedUrl": "https://maps.google.com/maps?q=..."
  },
  "hours": {
    "monday":    null,
    "tuesday":   { "open": "17:30", "close": "22:30" },
    "wednesday": { "open": "17:30", "close": "22:30" },
    "thursday":  { "open": "17:30", "close": "22:30" },
    "friday":    { "open": "17:30", "close": "23:00" },
    "saturday":  { "open": "17:00", "close": "23:00" },
    "sunday":    { "open": "17:00", "close": "21:30" },
    "holidayNote": "Closed Christmas Day. Open NYE with special tasting menu."
  },
  "social": {
    "instagram": "@labellacita_bk",
    "facebook": "facebook.com/labellacitabk",
    "yelp": "yelp.com/biz/la-bella-vita-brooklyn",
    "google": "g.page/labellacita"
  },
  "reservations": {
    "provider": "resy",
    "resyVenueId": "venue-xyz-123",
    "openTableId": null
  },
  "menu": {
    "enabled": ["dinner", "cocktails", "wine", "seasonal"],
    "reservationRequired": true
  },
  "brand": {
    "variant": "noir-saison",
    "primaryColor": null
  },
  "locales": {
    "default": "en",
    "supported": ["en", "zh"]
  },
  "features": {
    "online_reservation": true,
    "reservation_provider": "resy",
    "private_dining": true,
    "events_section": true,
    "press_section": true,
    "blog": false,
    "gallery": true,
    "gift_cards": true,
    "careers": false,
    "seasonal_menu": true,
    "wine_list": true,
    "cocktail_menu": true,
    "allergen_display": true,
    "dietary_legend": true
  },
  "domains": {
    "production": "labellacita.com",
    "dev": "bella-vita.local"
  },
  "contentTone": {
    "voice": "refined and intimate, with understated warmth",
    "uniqueSellingPoints": [
      "Handmade pasta using heritage grain flour imported from Puglia",
      "Sommelier-curated all-Italian wine program (400+ labels)",
      "Intimate 40-seat dining room — every table is a good table"
    ],
    "targetDemographic": "Upscale Brooklyn diners, date nights, special occasions, Italian food enthusiasts, wine collectors",
    "generateMultilingualAI": true
  }
}
```

### Required Fields (pipeline fails if missing)

| Field | Why Required |
|---|---|
| `clientId` | O1 site_id — must be unique, kebab-case |
| `templateSiteId` | O1 clone source — always `"the-meridian"` |
| `business.name` | O4 primary replacement pair |
| `business.ownerName` | O4 chef name replacement |
| `business.cuisineType` | O4 cuisine replacement + O5 prompts |
| `business.subType` | O2 variant default + O5 tone |
| `location.address` | O4 address replacement |
| `location.city` | O4 city replacement + O5 prompts |
| `location.state` | O4 state replacement |
| `location.zip` | O4 zip replacement |
| `location.phone` | O4 phone replacement |
| `location.email` | O4 email replacement |
| `menu.enabled` | O3 pruning — at least 1 required |
| `brand.variant` | O2 brand application |
| `locales.default` | O6 cleanup |
| `locales.supported` | O6 cleanup |
| `domains.production` | O4 domain replacement + O1 site_domains |

---

## 5. Menu Catalog — O3 Pruning

```javascript
const MENU_CATALOG = {
  food: [
    { slug: 'dinner',       label: { en: 'Dinner Menu',     zh: '晚餐菜单',   es: 'Menú de Cena' } },
    { slug: 'lunch',        label: { en: 'Lunch Menu',      zh: '午餐菜单',   es: 'Menú del Almuerzo' } },
    { slug: 'brunch',       label: { en: 'Brunch',          zh: '早午餐',     es: 'Brunch' } },
    { slug: 'breakfast',    label: { en: 'Breakfast',       zh: '早餐',       es: 'Desayuno' } },
    { slug: 'seasonal',     label: { en: 'Seasonal Menu',   zh: '时令菜单',   es: 'Menú Estacional' } },
    { slug: 'kids',         label: { en: "Kids' Menu",      zh: '儿童菜单',   es: 'Menú Infantil' } },
    { slug: 'desserts',     label: { en: 'Desserts',        zh: '甜点',       es: 'Postres' } },
  ],
  drinks: [
    { slug: 'cocktails',    label: { en: 'Cocktails',       zh: '鸡尾酒',     es: 'Cócteles' } },
    { slug: 'wine',         label: { en: 'Wine List',       zh: '酒单',       es: 'Carta de Vinos' } },
    { slug: 'beer',         label: { en: 'Beer & Spirits',  zh: '啤酒与烈酒', es: 'Cervezas y Licores' } },
    { slug: 'drinks',       label: { en: 'Drinks',          zh: '饮品',       es: 'Bebidas' } },
    { slug: 'happy-hour',   label: { en: 'Happy Hour',      zh: '欢乐时光',   es: 'Happy Hour' } },
  ],
  experience: [
    { slug: 'tasting-menu', label: { en: 'Tasting Menu',    zh: '品鉴菜单',   es: 'Menú Degustación' } },
    { slug: 'prix-fixe',    label: { en: 'Prix Fixe',       zh: '套餐',       es: 'Precio Fijo' } },
  ]
}
```

### Default Menu Types by Sub-Type

| Sub-Type | Default Enabled |
|---|---|
| `fine-dining` | dinner, cocktails, wine, seasonal, tasting-menu |
| `bistro` | dinner, lunch, cocktails, wine |
| `cafe-brunch` | breakfast, brunch, drinks |
| `bar-lounge` | cocktails, drinks, beer, happy-hour, dinner |
| `fast-casual` | lunch, dinner, drinks |
| `bakery` | breakfast, drinks |

### Files Pruned Per Disabled Menu Type (5 files)

| # | File/Table | What Is Removed |
|---|---|---|
| 1 | `content_entries` path `pages/menu-{slug}` | Entire page entry deleted |
| 2 | `navigation.json` | Menu dropdown child item removed |
| 3 | `pages/menu.json` | Hub grid card removed |
| 4 | `pages/home.json` | menu-preview section item removed |
| 5 | `footer.json` | Footer menu links column item removed |
| + | `menu_categories` table | All rows for this menu_type deleted |
| + | `menu_items` table | All rows in deleted categories deleted |

---

## 6. Replacement Pairs — O4

**18 pairs, applied longest-first. Never reorder.**

| # | Find (Template) | Replace With | Intake Field |
|---|---|---|---|
| 1 | `The Meridian Restaurant` | `{business.name} Restaurant` | `business.name` |
| 2 | `The Meridian` | `{business.name}` | `business.name` |
| 3 | `Chef Marcus Webb` | `{business.ownerName}` | `business.ownerName` |
| 4 | `Executive Chef & Founder` | `{business.ownerTitle}` | `business.ownerTitle` |
| 5 | `themeridian.com` | `{domains.production}` | `domains.production` |
| 6 | `reservations@themeridian.com` | `reservations@{domains.production}` | derived |
| 7 | `info@themeridian.com` | `{location.email}` | `location.email` |
| 8 | `tel:+12125550100` | `tel:{e164phone}` | derived from phone |
| 9 | `+12125550100` | `{e164phone}` | derived from phone |
| 10 | `(212) 555-0100` | `{location.phone}` | `location.phone` |
| 11 | `1 Meridian Plaza, New York, NY 10001` | `{full address}` | derived |
| 12 | `1 Meridian Plaza` | `{location.address}` | `location.address` |
| 13 | `New York, NY 10001` | `{city}, {state} {zip}` | derived |
| 14 | `Contemporary American` | `{business.cuisineType}` | `business.cuisineType` |
| 15 | `@themeridiannyc` | `{social.instagram}` | `social.instagram` |
| 16 | `New York` | `{location.city}` | `location.city` |
| 17 | `10001` | `{location.zip}` | `location.zip` |
| 18 | `NY` | `{location.state}` | `location.state` |

**Edge cases:**
- Pair 18 (`NY`) is dangerous for states with 2-letter codes that appear in words — apply only to standalone occurrences (word-boundary regex: `\bNY\b`)
- If `intake.brand.primaryColor` is set, O2 handles font/color replacement — not O4
- If `intake.social.instagram` is null: skip pair 15, preserve `@themeridiannyc` as placeholder

---

## 7. AI Prompt Spec — O5

### Prompt File Locations

```
scripts/onboard/prompts/restaurant/content.md    — system + user prompt for Call 1
scripts/onboard/prompts/restaurant/seo.md        — system + user prompt for Call 2
```

### API Call Configuration

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,  // from content.md or seo.md
    messages: [{ role: "user", content: userPrompt }]
  })
})

const data = await response.json()
const rawText = data.content[0].text
// Strip any accidental markdown fences
const clean = rawText.replace(/```json\n?|```\n?/g, '').trim()
const parsed = JSON.parse(clean)
```

### Multilingual AI Mode

When `intake.contentTone.generateMultilingualAI = true`:

```javascript
// Run 3 calls — one per language (en, zh, es / as applicable)
for (const locale of intake.locales.supported) {
  const localePrompt = buildLocalePrompt(basePrompt, locale)
  const result = await callClaude(localePrompt)
  mergeLocaleContent(clientId, result, locale)
}
// Total cost: ~$0.39 vs $0.13 for EN-only
// Default: false — EN only, other locales use EN as fallback
```

### Quality Rules (enforced in system prompt)

```
NEVER write:
  - "culinary excellence", "passion for food", "unforgettable experience"
  - "journey", "exquisite", "innovative"
  - Any specific numerical claim (ratings, awards) unless provided in intake
  - Generic placeholder text ("insert story here")

ALWAYS write:
  - Specific dish names or ingredients if USPs mention them
  - City name appears in hero description
  - Founded year mentioned in about story if provided
  - Chef credentials appear in bio paragraph 1
  - Each testimonial mentions a different occasion type
```

---

## 8. Brand Variants Config

**File location:** `scripts/onboard/brand-variants-restaurant.json`

Full specification for all 4 variants including all CSS variable values — see Section 3 (O2) for the complete JSON. Variant selection guide:

| Sub-Type | Recommended Variant | Why |
|---|---|---|
| `fine-dining` | `noir-saison` | Dark, dramatic, gold — signals luxury |
| `bistro` | `terre-vivante` | Warm, earthy — signals approachable quality |
| `cafe-brunch` | `matin-clair` | Bright, friendly — signals casual welcome |
| `bar-lounge` | `noir-saison` or `velocite` | Dark or minimal — signals nighttime energy |
| `fast-casual` | `velocite` | Clean, bold — signals speed and clarity |
| `bakery` | `matin-clair` | Warm bright — signals freshness |

**When client has custom brand colors:**

```javascript
// O2 applies this logic when intake.brand.primaryColor is set:
function generateShades(hex) {
  return {
    primary:      hex,
    primaryHover: darken(hex, 0.12),   // 12% darker
    primary50:    lighten(hex, 0.42),  // very light tint
    primary100:   lighten(hex, 0.32),  // light tint
  }
}
// All other variant tokens remain from the base variant (noir-saison etc.)
// Only primary color family is overridden
```

---

## 9. Admin UI Wizard

**Route:** `/admin/onboarding`
**Access:** Platform Admin only (not Restaurant Admin)

### Wizard Flow (5 screens)

**Screen 1 — Client Info:**

```
Restaurant Name: [text input]
Chef/Owner Name: [text input]  
Owner Title: [text input]
Cuisine Type: [text input]
Sub-type: [dropdown: fine-dining | bistro | cafe-brunch | bar-lounge | fast-casual | bakery]
Founded Year: [number input, optional]
```

**Screen 2 — Location & Contact:**

```
Street Address: [text input]
City: [text input]
State: [text input, 2 letters]
ZIP Code: [text input]
Phone: [text input, formatted]
Email: [text input]
Production Domain: [text input, e.g. "labellacita.com"]
Dev Domain: [text input, optional, e.g. "bella-vita.local"]
```

**Screen 3 — Hours:**

```
For each day of the week:
  [Day] [Open time picker] — [Close time picker] [Closed toggle]
Holiday Note: [textarea, optional]
```

**Screen 4 — Features & Menus:**

```
Brand Variant: [4-option card picker with visual preview]
Primary Color Override: [color picker, optional]
Default Locale: [dropdown]
Supported Locales: [multi-select: EN / ZH / ES / KO]
Generate Multilingual AI: [toggle, costs ~3× more]

Menu Types Enabled: [multi-select from MENU_CATALOG]
Reservation Provider: [dropdown: Resy | OpenTable | Custom | Phone-only]
Resy Venue ID / OpenTable ID: [conditional text input]

Feature Flags: [toggles for each]
  Private Dining | Events | Press | Blog | Gallery | Gift Cards | Careers
```

**Screen 5 — Brand Voice:**

```
Voice/Tone: [textarea, e.g. "warm, approachable, community-oriented"]
Unique Selling Point 1: [text input]
Unique Selling Point 2: [text input]
Unique Selling Point 3: [text input]
Target Demographic: [textarea]

Team Members: [add/remove rows]
  Name | Role | Credentials (comma-separated)

[Review JSON] button — shows assembled intake JSON
[Run Pipeline] button
```

### Progress Streaming (SSE)

```typescript
// app/api/admin/onboarding/stream/route.ts
export async function POST(req: Request) {
  const intake = await req.json()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send({ step: 'O1', status: 'running', label: 'Cloning template...', pct: 10 })
        await runO1(intake)
        send({ step: 'O1', status: 'done', label: 'Template cloned', pct: 20 })

        send({ step: 'O2', status: 'running', label: 'Applying brand variant...', pct: 25 })
        await runO2(intake)
        send({ step: 'O2', status: 'done', label: 'Brand applied', pct: 30 })

        send({ step: 'O3', status: 'running', label: 'Pruning disabled menu types...', pct: 35 })
        await runO3(intake)
        send({ step: 'O3', status: 'done', label: 'Menu catalog pruned', pct: 45 })

        send({ step: 'O4', status: 'running', label: 'Applying client content...', pct: 50 })
        await runO4(intake)
        send({ step: 'O4', status: 'done', label: 'Content replaced', pct: 60 })

        send({ step: 'O5', status: 'running', label: 'Generating AI content...', pct: 65 })
        await runO5(intake)
        send({ step: 'O5', status: 'done', label: 'AI content applied', pct: 85 })

        send({ step: 'O6', status: 'running', label: 'Cleaning up locales...', pct: 88 })
        await runO6(intake)
        send({ step: 'O6', status: 'done', label: 'Locales cleaned', pct: 92 })

        send({ step: 'O7', status: 'running', label: 'Verifying...', pct: 95 })
        const result = await runO7(intake)
        if (!result.passed) {
          send({ step: 'O7', status: 'failed', violations: result.violations })
          controller.close()
          return
        }
        send({ step: 'O7', status: 'done', label: 'Verification passed', pct: 100 })
        send({ status: 'complete', siteId: intake.clientId, duration: getElapsed() })

      } catch (err) {
        send({ status: 'error', message: err.message })
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
```

### Success Screen

After pipeline completes, the UI shows:

```
✅ Site Created Successfully

Client:    La Bella Vita
Site ID:   la-bella-vita
Domain:    labellacita.com (not yet live — deploy in Phase 4C)
Dev URL:   http://bella-vita.local:3060

Duration:  38.4s
AI cost:   ~$0.14

Next Steps:
  [ ] Add dev domain to /etc/hosts
  [ ] Enter real menu items (Menu Editor)
  [ ] Upload restaurant photos (Gallery Editor)
  [ ] Verify AI-generated content (Content Editor)
  [ ] Deploy to production (Phase 4C)

[Open Admin for This Site →]    [Download Intake JSON]
```

---

## 10. CLI Interface

**File:** `scripts/onboard-client.mjs`

```bash
# Basic usage
node scripts/onboard-client.mjs {client-id}

# Examples
node scripts/onboard-client.mjs la-bella-vita
node scripts/onboard-client.mjs cafe-soleil

# Skip AI content generation (faster for testing)
node scripts/onboard-client.mjs la-bella-vita --skip-ai

# Run from specific step (useful after partial failure)
node scripts/onboard-client.mjs la-bella-vita --from O4

# Dry run — show what would happen without writing to DB
node scripts/onboard-client.mjs la-bella-vita --dry-run

# Re-run O7 verification only (no changes)
node scripts/onboard-client.mjs la-bella-vita --verify-only
```

**Intake file location:**

```
scripts/onboard/intakes/{client-id}-intake.json
```

CLI reads this file automatically based on `{client-id}` argument.

**Exit codes:**

```
0  — Pipeline complete, O7 verification passed
1  — O7 verification failed (contamination or missing paths)
2  — Pipeline step failed (DB error, AI API error)
3  — Invalid intake JSON (schema validation failed)
```

---

## 11. Contamination Verification — O7

### Forbidden Strings Checklist

O7 scans every character of every `content_entries.data` JSONB field plus `team_members`, `menu_items`, `gallery_items` for these strings:

```javascript
const FORBIDDEN = [
  // Business identity
  "The Meridian Restaurant",
  "The Meridian",
  "Marcus Webb",
  "themeridian.com",
  // Contact
  "(212) 555-0100",
  "+12125550100",
  "info@themeridian.com",
  "reservations@themeridian.com",
  // Address
  "1 Meridian Plaza",
  "@themeridiannyc",
  // Generic placeholders
  "Lorem ipsum",
  "[PLACEHOLDER]",
  "[INSERT",
  "[TODO",
  "undefined",           // JavaScript serialization artifact
  "[object Object]",     // JavaScript serialization artifact
]
```

**Exceptions:**

```javascript
// These strings are acceptable in specific contexts:
const EXCEPTIONS = [
  // "NY" is exempt in the zip+state combo check — state code collision handled by pair ordering
  { string: "10001", exception: "only fail if client zip IS different from 10001" },
  // Instagram handle: acceptable if client has no Instagram and intake.social.instagram is null
  { string: "@themeridiannyc", exception: "only fail if client has instagram set" },
]
```

### Required Paths Verification

These paths must exist in `content_entries` for the client after O1–O6:

```javascript
const REQUIRED_PATHS = [
  // Core pages
  "pages/home",
  "pages/menu",
  "pages/about",
  "pages/about-team",
  "pages/reservations",
  "pages/contact",
  // Global config
  "site",
  "header",
  "footer",
  "navigation",
  "seo",
  "theme",
]

// Conditional required paths (based on enabled features):
if (intake.features.private_dining) REQUIRED_PATHS.push("pages/private-dining")
if (intake.features.events_section)  REQUIRED_PATHS.push("pages/events")
if (intake.features.gallery)         REQUIRED_PATHS.push("pages/gallery")
if (intake.features.faq !== false)   REQUIRED_PATHS.push("pages/faq")
```

---

## 12. Post-Pipeline Content Checklist

After pipeline completes, these tasks require human input. Estimated time: **60–90 minutes**.

### Priority 1 — Menu Items (45–60 min)

The pipeline keeps seeded Meridian menu items renamed with the client's cuisine type. These must be replaced with real items.

```
Admin → Menu Editor → [first enabled menu type]
  1. Review existing seeded items
  2. Delete items that don't match client's menu
  3. Add real client menu items (name, description, price, dietary flags)
  4. Repeat for each enabled menu type

Fastest method: If client sends a PDF menu or CSV:
  node scripts/import-menu-csv.mjs {client-id} ./menu.csv
  CSV format: menu_type, category_name, item_name, description, price, dietary_flags
  (pipe-separated dietary_flags: "vegetarian|gluten-free")
```

### Priority 2 — Photos (15–20 min)

```
Admin → Gallery Editor
  1. Upload real restaurant photos (food, interior, team)
  2. Set alt text for each photo
  3. Mark 4+ as "featured" for homepage GalleryPreview
  4. Drag to reorder (food photos first)

Admin → Content Editor → pages/home → hero section
  5. Update hero image to best food photo

Admin → Team Editor → [chef name]
  6. Upload real chef headshot photo
  7. Upload portrait photo (3:4 ratio for ChefHeroFull)
```

### Priority 3 — AI Content Review (15 min)

```
Admin → Content Editor → pages/home
  1. Read AI-generated hero tagline — does it sound authentic?
     (most common issue: too generic — rewrite if needed)

Admin → Content Editor → pages/about
  2. Read about story — verify founding year, city, and USPs are accurate
  3. Verify no invented claims (awards, reviews, certifications)

Admin → Team Editor → [chef name]
  4. Read AI chef bio — verify credentials are correctly stated
  5. Read philosophy quote — acceptable as a quote?

Admin → Content Editor → pages/home → testimonials section
  6. Replace AI testimonials with real client reviews from Google/Yelp
     (if available — AI testimonials acceptable at launch if none exist)
```

### Priority 4 — Verifications (10 min)

```
  [ ] Contact page: correct address, phone, and hours visible
  [ ] Reservations: widget loads and configured to correct provider
  [ ] Menu hub: only enabled menu types shown
  [ ] Navigation: no links to disabled feature pages
  [ ] Language switcher: shows correct locales only
  [ ] Run: node scripts/onboard/o7-verify.mjs {client-id} → exits 0
```

---

## 13. Client Handoff Protocol

### Deliverables to Client

1. **Admin credentials** — delivered via secure method (1Password link, not email)
   - Admin URL: `https://{domain}/admin`
   - Login: email + password

2. **Admin Quick Start Guide** (2-page PDF or Loom video, 5 min)
   - How to update menu items (most common task)
   - How to post a blog article
   - How to add an event
   - How to view form submissions
   - How to contact support

3. **Week 1 Checklist** (email to client):
   ```
   Welcome to your new website! Here's your Week 1 checklist:

   [ ] Log in to admin and explore the dashboard
   [ ] Review and update your About story
   [ ] Confirm all menu items are correct
   [ ] Upload your best restaurant photos (Gallery Editor)
   [ ] Add your real Google/Yelp reviews as testimonials
   [ ] Verify all team member bios are accurate
   [ ] Confirm hours and holiday closures are correct
   [ ] Test the reservation form (make a test booking)
   [ ] Reply to this email with any questions
   ```

### Smoke Test Before Handoff

Run this checklist before delivering credentials:

```
[ ] Homepage: client name in header, not "The Meridian"
[ ] Hero headline: client-specific (mention cuisine or city)
[ ] Menu hub: only enabled types visible
[ ] Correct brand variant colors applied
[ ] Contact page: real address + phone + correct hours
[ ] Reservations: widget functional (Resy/OT embed loads, or custom form works)
[ ] Footer: real social links (not @themeridiannyc)
[ ] No contamination: node scripts/onboard/o7-verify.mjs {client-id} → 0 violations
[ ] Admin login: works with provided credentials
[ ] All admin editors accessible from correct role
```

---

## 14. Production Deployment Per Client

For each client going to production, run through this checklist (condensed from Phase 4C):

```
VERCEL:
  [ ] Add client domain in Vercel → Project → Settings → Domains
  [ ] Add www. as redirect domain
  [ ] Confirm env var NEXT_PUBLIC_DEFAULT_SITE updated if needed
      (for multi-tenant deployments: domain routing middleware handles this)

DNS:
  [ ] A record: @ → 76.76.21.21 (Vercel)
  [ ] CNAME: www → cname.vercel-dns.com
  [ ] SSL auto-provisioned by Vercel (allow 5–30 min after DNS propagates)

SUPABASE:
  [ ] Auth → Site URL → add https://{client-domain}.com
  [ ] Auth → Redirect URLs → add https://{client-domain}.com/**

RESEND EMAIL:
  [ ] Add {client-domain}.com to Resend domains
  [ ] Add DKIM TXT record to DNS
  [ ] Verify domain in Resend (wait for DNS propagation)
  [ ] Update RESEND_FROM_EMAIL env var

SEARCH ENGINES:
  [ ] GSC: add property → verify domain → submit sitemap
  [ ] Bing: add site → submit sitemap
  [ ] IndexNow: fires automatically on next blog/event publish

GOOGLE BUSINESS:
  [ ] Update GMB website URL to https://{client-domain}.com
  [ ] Verify hours match site
  [ ] Publish a GMB post with reservation link
```

---

## 15. Pipeline B Done-Gate

Before declaring Pipeline B operational for any new restaurant client:

```
INFRASTRUCTURE:
  [ ] all 7 pipeline scripts exist (o1–o7-*.mjs)
  [ ] scripts/onboard-client.mjs orchestrates all 7 steps
  [ ] brand-variants-restaurant.json: all 4 variants complete
  [ ] content.md + seo.md prompt files exist
  [ ] intake schema validation: rejects invalid JSON
  [ ] /admin/onboarding wizard UI functional

CORRECTNESS:
  [ ] O1: All 6 DB tables cloned with correct site_id
  [ ] O1: category_id remapping correct (menu_items reference new category IDs)
  [ ] O2: All 4 variants apply correct CSS tokens
  [ ] O2: Custom primary color generates correct shades
  [ ] O3: Disabled menu types absent from all 5 files
  [ ] O3: Feature-gated pages pruned from nav + footer
  [ ] O4: All 18 replacement pairs tested, no partial-match bugs
  [ ] O4: Hours structural rebuild works (null days = closed)
  [ ] O4: Team profiles recreated from intake data
  [ ] O5: Call 1 returns all required JSON fields
  [ ] O5: Call 2 returns SEO for all enabled pages
  [ ] O5: No clichés in AI output (random check)
  [ ] O6: Only unsupported locale rows deleted (default locale untouched)
  [ ] O7: Catches contamination — tested by planting a forbidden string
  [ ] O7: Catches missing required paths — tested by deleting one

PERFORMANCE:
  [ ] Full run with AI: < 60 seconds
  [ ] Full run skip-AI: < 20 seconds
  [ ] Claude API cost: < $0.20 per client

VALIDATION:
  [ ] Test client 1: fine-dining + noir-saison + EN/ZH → verified clean
  [ ] Test client 2: cafe-brunch + matin-clair + EN only → verified clean
  [ ] Test client 3: custom primary color → correct shades applied
  [ ] Admin wizard: SSE progress streams correctly in browser
  [ ] CLI --dry-run: no DB writes, correct output logged
  [ ] CLI --verify-only: O7 runs, no other steps
  [ ] CLI --from O4: resumes from O4 without re-running O1–O3
  [ ] Template site (the-meridian): untouched after all test runs

  [ ] git tag v1.1-pipeline-b-live
```

---

## 16. Anti-Patterns

```
❌ NEVER edit a client's DB rows directly in Supabase to fix pipeline output
   → Fix the pipeline script. Rerun from the failing step.

❌ NEVER modify the-meridian template content for a specific client's needs
   → Template changes affect every future client. Change deliberately, test, retag.

❌ NEVER skip O7 — even for "trusted" intakes
   → One missed replacement pair contaminates a live production site.

❌ NEVER reuse a site_id for a different client
   → Deleting and recreating with same ID leaves orphaned DB rows.

❌ NEVER apply replacement pairs in random order
   → Short pairs corrupt longer ones. Always longest-first.

❌ NEVER run O5 (AI) with an intake that hasn't completed O4
   → AI prompt variables like {{city}} come from the already-replaced content.
      If O4 hasn't run, AI gets Meridian's city not the client's.

❌ NEVER merge blog_posts or events from the template into the client
   → Clients start with zero blog posts and zero events. That's correct.

❌ NEVER publish AI-generated hero tagline without a human reading it first
   → Everything else can stay AI-drafted at launch. The hero is seen by every visitor.

❌ NEVER share the Supabase service_role key with clients
   → Clients get anon key only, if they need API access at all.
```

---

*BAAM System R — Restaurant Premium*
*Client Onboarding Master Plan — Pipeline B*
*The template never changes. Each client is a new site_id. Pipeline B scales with zero additional development.*
