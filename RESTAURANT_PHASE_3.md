# BAAM System R — Restaurant Premium
# Phase 3: Admin Hardening + SEO + Programmatic Pages

> **System:** BAAM System R — Restaurant Premium
> **Reference files:** `@RESTAURANT_PHASE_3.md` (this file) + `@RESTAURANT_COMPLETE_PLAN.md`
> **Prerequisite:** Phase 2 completion gate fully passed. `v0.2-complete-frontend` tagged.
> **Method:** One Cursor prompt per session. Verify done-gate before next prompt.
> **Goal:** Harden admin to 100% coverage, build all SEO infrastructure, generate 50+ programmatic pages, achieve Lighthouse ≥ 90 across 5 pages, and create automated QA scripts that catch regressions.

---

## Phase 3 Overview

**Duration:** Week 4
**Goal:** Phase 3 is the quality phase. The frontend is complete from Phase 2. Now: close every admin gap, build the full SEO infrastructure (schema.org, sitemap, programmatic pages), optimize for Core Web Vitals, and create automated QA scripts so nothing regresses.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 3A | Admin Gap Audit — Coverage Matrix | Find + fix every admin gap | 60 min |
| 3B | Admin Certification SOP | One-pass batch verification | 90 min |
| 3C | Programmatic SEO — Cuisine × City | 50+ auto-generated location pages | 60 min |
| 3D | Schema.org — Full Implementation | Restaurant, MenuItem, Event, BlogPosting, BreadcrumbList | 45 min |
| 3E | Sitemap + robots.txt + IndexNow | Crawlability + submission | 30 min |
| 3F | Performance Optimization — Core Web Vitals | LCP, CLS, FID targets | 45 min |
| 3G | Automated QA Scripts | Schema, routes, SEO, content, links | 45 min |

---

## Prompt 3A — Admin Gap Audit: Coverage Matrix

**Goal:** Every public-facing page and every content type must have a clear admin owner. Run a systematic audit, generate a coverage matrix, and fix every gap in one batch.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Admin Architecture"
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Platform Guardrails"

Run a complete admin coverage audit.
Build and fill the coverage matrix below, then fix all gaps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — BUILD COVERAGE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For every page and content type below, determine:
  A. Admin owner: which editor manages this content?
     (Content Editor | Blog Posts Editor | Events Editor |
      Gallery Editor | Menu Editor | Team Editor | Press Editor |
      Sites Table | None)
  B. Form fields complete: does the admin form have fields for
     every content_contract field?
  C. Variants wired: if the section has variants, is the
     variant dropdown present in admin?
  D. Locales: are EN/ZH/ES all editable for all LocalizedString fields?
  E. Media fields: can all image fields be set via image picker?

PAGES TO AUDIT:

  Core pages:
    /en (homepage)
    /en/menu
    /en/menu/dinner
    /en/menu/tasting-menu
    /en/menu/cocktails
    /en/menu/wine
    /en/menu/seasonal
    /en/about
    /en/about/team
    /en/reservations
    /en/contact

  Content pages:
    /en/events
    /en/events/[slug] (events collection)
    /en/gallery
    /en/blog
    /en/blog/[slug] (blog posts collection)
    /en/press
    /en/reservations/private-dining
    /en/faq
    /en/gift-cards
    /en/careers

  Global content:
    Header (top bar message, nav CTA label)
    Footer (tagline, hours note)
    Navigation (menu structure, CTA)
    SEO defaults (title template, og:image)
    Theme (brand variant, color overrides)
    StickyBookingBar (CTA label)

  Forms + submissions (read-only admin views):
    Contact submissions
    Booking submissions
    Private dining inquiries
    Newsletter subscribers
    Careers applications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — IDENTIFY GAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Common gaps to look for:
  Missing form fields:
    - Section exists on page but no form fields in Content Editor
    - LocalizedString field shown as plain text (no EN/ZH/ES tabs)
    - Image field has no image picker (just a text URL input)
    - Array field (testimonials, stats, spaces) has no add/remove UI

  Missing variants:
    - Section has variants in RESTAURANT_CONTENT_CONTRACTS.md
      but no variant dropdown in admin

  Missing collection editors:
    - Content type exists in DB but no admin panel to manage it
    - Read-only submission tables not surfaced in admin at all

  Missing locale coverage:
    - ZH or ES locale versions cannot be edited from admin
    - Only EN editable for a page that should be trilingual

  Content Editor / Blog Editor overlap:
    - Any blog post content accessible from Content Editor
    - Any non-blog content accidentally in Blog Editor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — FIX ALL GAPS IN ONE BATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Group fixes by type and implement together:

BATCH A — Missing form fields:
  For each section missing fields:
  1. Open the admin panel component for that section
  2. Add the missing form fields matching the content contract
  3. Verify JSON ↔ Form roundtrip for added fields

BATCH B — LocalizedString fields missing tabs:
  For each LocalizedString field shown as plain text:
  1. Replace with LocalizedStringInput component
     (EN | ZH | ES tabs, orange dot if tab is empty)
  2. Verify save persists all 3 locales

BATCH C — Image fields missing picker:
  For each image URL text input:
  1. Replace with ImagePickerField component
     (opens media browser → Supabase Storage)
  2. Verify selected image URL saved to content

BATCH D — Array fields missing add/remove UI:
  Common arrays: testimonials, stats, spaces, openings, faq items
  For each:
  1. Build ArrayField component:
     - "Add Item" button
     - Item rows with up/down reorder arrows
     - Delete (✕) button per row
     - Inline form for each item's fields
  2. Wire to content JSON

BATCH E — Read-only submission tables:
  Build read-only admin panels for:
    /admin/submissions/contacts
    /admin/submissions/bookings
    /admin/submissions/private-dining
    /admin/submissions/newsletter
    /admin/submissions/careers
  Each panel:
    - Table view: date, key fields, status badge
    - Row click: expands full submission details
    - Status update: dropdown (new → reviewed → responded → archived)
    - CSV export button (downloads all rows as CSV)
    - Date range filter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — PRODUCE COVERAGE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all fixes, produce ADMIN_COVERAGE_MATRIX.md:

Format:
| Page/Content | Admin Owner | Form Fields | Variants | Locales | Media | Status |
|---|---|---|---|---|---|---|
| /en (homepage) | Content Editor | ✅ Complete | ✅ All | ✅ EN/ZH/ES | ✅ | PASS |
| menu_items | Menu Editor | ✅ Complete | N/A | ✅ EN/ZH/ES | ✅ | PASS |
...

Target: 100% PASS across all rows before Phase 3 is complete.

VERIFY:
- Open every page in Content Editor → all sections have form fields
- Every LocalizedString field shows EN/ZH/ES tab switcher
- Every image field has image picker (not raw URL input)
- Testimonials section: can add/edit/remove/reorder testimonials
- Stats array: can add/edit/remove stats
- Read-only submission tables: visible in admin sidebar
- Submission tables: CSV export works
- Admin Coverage Matrix generated with 100% PASS
```

### Done-Gate 3A

- [ ] Coverage matrix generated for all 30+ pages/content types
- [ ] Zero rows with "missing form fields" gap
- [ ] All LocalizedString fields have EN/ZH/ES tabs in admin
- [ ] All image fields have image picker (not text URL input)
- [ ] Array fields (testimonials, stats, spaces, FAQ): add/remove/reorder working
- [ ] Read-only submission tables: all 5 visible in admin sidebar
- [ ] Submission tables: status update + CSV export working
- [ ] `ADMIN_COVERAGE_MATRIX.md` produced with 100% PASS
- [ ] `git commit: "feat: phase-3A — admin gap audit, all fields complete, submission tables"`

---

## Prompt 3B — Admin Certification SOP: One-Pass Verification

**Goal:** Run the full Admin Certification SOP from the master plan. One systematic pass: discover all issues, batch-fix them, re-run, and deliver a final pass/fail report with zero P0/P1 defects.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Platform Guardrails"

Run the Admin Certification SOP — one complete pass.
Goal: zero P0 or P1 admin defects before Phase 4.

Severity definitions:
  P0: Blocks a user from managing content (form crash, data loss,
      broken save, content not updating on frontend)
  P1: Significant friction (wrong data saved, locale not persisting,
      variant switch broken, image picker fails silently)
  P2: Minor UX issue (label wrong, unnecessary warning, layout off)
  P3: Cosmetic (spacing, color, alignment)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATION CHECKLIST — CONTENT EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For EACH page managed in Content Editor, run this flow:

FLOW: Open page → Form edit → Save → JSON verify → Variant switch → Layout reorder

1. OPEN: Navigate to page in Content Editor sidebar
   PASS: Page loads with all sections in sidebar tree
   FAIL: Page missing from sidebar, or sidebar crashes

2. FORM EDIT: Change a text field in Form mode → Save
   PASS: Success indicator shown, no console error
   FAIL: Save fails silently, error thrown, data lost

3. FRONTEND VERIFY: Hard reload frontend page
   PASS: Change visible on frontend
   FAIL: Frontend still shows old data (cache/ISR issue)

4. JSON VERIFY: Switch to JSON tab
   PASS: JSON reflects the Form change
   FAIL: JSON has old value (Form → JSON desync)

5. JSON EDIT: Change a different field in JSON → Save → switch to Form
   PASS: Form reflects JSON change
   FAIL: Form shows old value (JSON → Form desync)

6. LOCALE SWITCH: Select ZH tab on a LocalizedString field → change value → Save
   Visit /zh/[page] → PASS if ZH value shows

7. VARIANT SWITCH (if section has variants):
   Change variant dropdown → Save → frontend
   PASS: Variant visually changes
   FAIL: Variant dropdown missing, or change doesn't reflect

8. LAYOUT REORDER: Drag a section up/down in layout.json → Save → frontend
   PASS: Section order changes on frontend
   FAIL: Reorder doesn't persist, or crashes

Pages to certify in Content Editor:
  home | menu | menu-dinner | menu-tasting | menu-cocktails
  menu-wine | menu-seasonal | about | about/team | reservations
  contact | events | gallery | blog | press | private-dining | faq
  gift-cards | careers | site.json | header.json | footer.json
  navigation.json | seo.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATION CHECKLIST — COLLECTION EDITORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each collection editor, run this CRUD flow:

MENU ITEMS EDITOR:
  [ ] New item → required fields → Save → appears on /en/menu/dinner
  [ ] Edit item name (ZH) → Save → /zh/menu/dinner shows ZH name
  [ ] Duplicate → copy exists with "(Copy)" suffix
  [ ] Toggle available = false → item gone from /en/menu/dinner
  [ ] Toggle available = true → item back on frontend
  [ ] Toggle featured = true → item appears in homepage MenuPreview
  [ ] Delete copy → gone from DB and frontend
  [ ] Bulk: select 3 items → mark unavailable → all 3 gone from frontend

EVENTS EDITOR:
  [ ] New event → all fields → Publish → appears on /en/events
  [ ] Edit start datetime → Save → date badge on EventCard updates
  [ ] Toggle cancelled = true → /en/events/[slug] shows cancellation notice
  [ ] Toggle published = false → event gone from /en/events listing
  [ ] Delete → gone from listing and detail (404 on old URL)

GALLERY EDITOR:
  [ ] Upload new image → appears in /en/gallery
  [ ] Edit alt text (ZH) → /zh/gallery → ZH alt on img tag
  [ ] Drag reorder items 1 and 2 → /en/gallery order changes
  [ ] Toggle featured = true → appears in homepage GalleryPreview
  [ ] Bulk upload 3 images → all 3 appear in gallery

TEAM EDITOR:
  [ ] Edit chef bio (EN) → Save → /en/about/team bio updates
  [ ] Edit role (ZH) → /zh/about/team shows ZH role
  [ ] Toggle active = false → member gone from /en/about/team
  [ ] Reorder team members → display_order changes on /en/about/team

PRESS EDITOR:
  [ ] Add press item (is_award = false) → appears in PressGrid
  [ ] Add award (is_award = true) → appears in AwardsStrip
  [ ] Edit headline (ZH) → /zh/press shows ZH headline
  [ ] Delete press item → gone from /en/press

BLOG POSTS EDITOR:
  [ ] Create post → publish → appears on /en/blog
  [ ] Edit body → save → /en/blog/[slug] body updates
  [ ] Toggle featured = true → post appears in FeaturedBlogPost
  [ ] Add ZH translation to title and body
    → /zh/blog/[slug] shows ZH content
  [ ] Unpublish → post gone from /en/blog listing
  [ ] Verify: blog posts do NOT appear in Content Editor sidebar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATION CHECKLIST — SYNC PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Check Update From DB" operation:
  [ ] Trigger Check Update From DB on any content path
  [ ] Output shows: total changed files, folder-level breakdown,
      sample changed paths
  [ ] No unexplained "conflict" rows on a clean system

"Overwrite Import" (DB → files):
  [ ] Change a value in Supabase directly (not via admin)
  [ ] Run Import → file reflects change
  [ ] Files match DB after import

"Export JSON" (files → DB):
  [ ] Edit a local file
  [ ] Run Export → DB row updated
  [ ] Frontend reflects export (hard reload)

Slug integrity:
  [ ] Create collection item → slug generated from name
  [ ] Duplicate → slug auto-incremented (e.g., "dish-1")
  [ ] Change slug → if published, admin shows redirect warning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BATCH FIX PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After initial pass:
  1. Collect all FAIL results into typed buckets:
     P0_FAILS[], P1_FAILS[], P2_FAILS[]
  2. Fix all P0 first (block everything else)
  3. Fix all P1 next
  4. Fix P2 if time allows
  5. Re-run full certification matrix from top
  6. Stop only when: zero P0, zero P1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED DELIVERABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After certification is complete, produce:

1. ADMIN_CERTIFICATION_MATRIX.md
   Full pass/fail table: page × action

2. Fix Log
   For each issue fixed:
   - File changed
   - What was wrong
   - What was changed

3. Final result: "Admin Certification COMPLETE — zero P0/P1 defects"
```

### Done-Gate 3B

- [ ] All Content Editor pages: Form edit → Save → frontend update PASS
- [ ] All pages: Form ↔ JSON sync PASS (both directions)
- [ ] All pages: ZH locale edit persists on /zh/* pages
- [ ] All pages: variant switch reflects on frontend
- [ ] All collection editors: Create/Edit/Duplicate/Delete PASS
- [ ] Menu items: available toggle works on frontend
- [ ] Events: publish/cancel/unpublish all reflect on frontend
- [ ] Gallery: drag reorder persists on frontend
- [ ] Blog: completely isolated from Content Editor
- [ ] Sync pipeline: Check/Import/Export all PASS with no unexplained diffs
- [ ] Slug integrity: duplicate → unique slug, published slug change → warning
- [ ] Zero P0 admin defects · Zero P1 admin defects
- [ ] `ADMIN_CERTIFICATION_MATRIX.md` delivered
- [ ] `git commit: "feat: phase-3B — admin certification complete, zero P0/P1"`

---

## Prompt 3C — Programmatic SEO: Cuisine × City Pages

**Goal:** Generate 50+ programmatic pages targeting "[Cuisine] restaurant in [City]" search queries. These are the highest-volume organic search patterns for restaurants. Each page must have unique content — not duplicate boilerplate.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Phase 3: Admin Hardening + SEO"

Build the programmatic SEO system — dynamic pages targeting
high-value local search queries at scale.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — ROUTE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route: app/[locale]/[cuisine]/[city]/page.tsx

Examples of generated URLs:
  /en/contemporary-american-restaurant/new-york
  /en/contemporary-american-restaurant/manhattan
  /en/contemporary-american-restaurant/soho
  /en/contemporary-american-restaurant/tribeca
  /en/contemporary-american-restaurant/west-village
  /en/fine-dining/new-york
  /en/fine-dining/manhattan
  /en/seasonal-tasting-menu/new-york
  /en/private-dining/new-york
  /en/tasting-menu-restaurant/new-york
  /en/farm-to-table-restaurant/new-york
  ... (50+ total)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — PAGE CATALOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create the page catalog in:
  lib/seo/programmatic-catalog.ts

Type definition:
  interface ProgrammaticPage {
    cuisineSlug: string
    cuisineLabel: string
    citySlug: string
    cityLabel: string
    neighborhood?: string
    uniqueIntro: string       // 2-3 unique sentences for this page
    uniqueBody: string        // 2 unique paragraphs (~120 words)
    targetKeyword: string     // primary keyword
    secondaryKeywords: string[]
  }

Seed the catalog with at least 50 entries:

CUISINE VARIANTS (8):
  contemporary-american-restaurant → "Contemporary American Restaurant"
  fine-dining                      → "Fine Dining"
  seasonal-tasting-menu            → "Seasonal Tasting Menu"
  tasting-menu-restaurant          → "Tasting Menu Restaurant"
  private-dining                   → "Private Dining"
  farm-to-table-restaurant         → "Farm to Table Restaurant"
  new-american-cuisine             → "New American Cuisine"
  chef-tasting-menu                → "Chef's Tasting Menu"

CITY/NEIGHBORHOOD VARIANTS (7):
  new-york          → "New York"
  manhattan         → "Manhattan"
  downtown-manhattan → "Downtown Manhattan"
  tribeca           → "Tribeca"
  soho              → "SoHo"
  west-village      → "West Village"
  flatiron          → "Flatiron District"

GENERATED COMBINATIONS: 8 cuisine × 7 city = 56 pages ✅

Each entry needs UNIQUE intro and body. Do NOT use the same text
across pages. Vary the angle:
  - /fine-dining/tribeca: emphasize intimate neighborhood feel
  - /fine-dining/manhattan: emphasize NYC-wide prestige
  - /farm-to-table-restaurant/new-york: emphasize sourcing ethos
  - /private-dining/soho: emphasize event hosting
  (Make each page answer the specific query intent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — PAGE COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/[cuisine]/[city]/page.tsx

Data loading:
  1. Look up page in programmatic-catalog.ts by cuisine + city slugs
  2. If not in catalog → notFound() (returns 404)
  3. Load site data (site.json) for restaurant info
  4. Load 3 featured menu items (from menu_items DB)
  5. Load 3 upcoming events (from events DB)

Page structure:

SECTION 1 — LocalSEOHero:
  Headline: "{cuisineLabel} in {cityLabel}"
    e.g. "Fine Dining in Tribeca"
  Subline: page.uniqueIntro (unique per page)
  Background: featured food photo from gallery
  CTA: "View Menu" | "Reserve a Table"

SECTION 2 — UniqueContent:
  H2: "About The Meridian"
  Body: page.uniqueBody (unique per page)
  This is the content that prevents this page from being
  treated as thin/duplicate by Google.

SECTION 3 — MenuSnapshot (3 featured dinner items):
  Compact: name + description + price
  H2: "Taste of Our {cuisineLabel} Menu"
  "View Full Menu →" link

SECTION 4 — Location + Hours:
  Restaurant address, hours, phone, map embed
  H2: "Visit Us in {cityLabel}"
  (If neighborhood set: "Located in the heart of {neighborhood}")

SECTION 5 — Trust signals:
  Google rating + count | Press logo strip (2–3 logos)

SECTION 6 — ReservationsCTA (banner variant):
  "Reserve Your Table"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — SEO METADATA (per page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function generateMetadata({ params }):
  title: "{cuisineLabel} in {cityLabel} | The Meridian"
    e.g. "Fine Dining in Manhattan | The Meridian"
  description: auto-generated from page.uniqueIntro
    (trim to 150–160 chars, always ends with call to action)
  canonical: https://themeridian.com/en/{cuisineSlug}/{citySlug}
  robots: index, follow (all programmatic pages indexable)
  og:title + og:description + og:image (featured gallery photo)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — STATIC GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function generateStaticParams():
  Return all { locale, cuisine, city } combinations from catalog
  Include: ['en', 'zh', 'es'] × all 56 entries
  = 168 static pages total

ISR revalidation: 86400 (24 hours)
  Pages re-generate daily — no need to redeploy for content updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — SCHEMA.ORG (per page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add Restaurant schema on every programmatic page:
{
  "@type": "Restaurant",
  "name": "The Meridian",
  "servesCuisine": cuisineLabel,
  "areaServed": {
    "@type": "City",
    "name": cityLabel
  },
  "url": "https://themeridian.com/en/{cuisineSlug}/{citySlug}",
  "address": { ...from site.json },
  "telephone": site.phone,
  "openingHoursSpecification": [...from site.hours],
  "hasMenu": "https://themeridian.com/en/menu"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — INTERNAL LINKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add internal links FROM programmatic pages TO:
  /en/menu (full menu)
  /en/reservations (reservations)
  /en/about (about the restaurant)

Add internal links TO programmatic pages FROM:
  Homepage footer: add "Explore by Cuisine" section
    Links to top 5 cuisine variants for New York
  About page footer: link to /fine-dining/manhattan
  Contact page: link to /contemporary-american-restaurant/new-york

This creates crawl paths for Googlebot to discover all pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE CONFLICT PREVENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The [cuisine]/[city] dynamic route must NOT conflict with
existing routes. Add a middleware guard:

In the [cuisine]/[city]/page.tsx:
  If params.cuisine matches an existing top-level route
  (menu, about, reservations, contact, events, gallery, blog, press,
   faq, gift-cards, careers, reservations) → return notFound()

This prevents /en/menu/dinner from being swallowed by [cuisine]/[city].

The route priority in Next.js app router:
  Static routes (e.g., /en/about) always win over dynamic
  So [cuisine]/[city] is a catch-all for unknown paths.

VERIFY:
- npm run build: 56 × 3 locales = 168 pages generated, zero errors
- /en/contemporary-american-restaurant/new-york: renders with unique content
- /en/fine-dining/tribeca: different uniqueIntro + uniqueBody to manhattan
- /en/fine-dining/nonexistent-city: returns 404
- /en/menu (existing route): still works, not swallowed by catch-all
- Featured menu items: loading from DB (not hardcoded)
- Schema.org Restaurant validates on 3 programmatic pages
- Internal links from footer: 5 cuisine variant links present
- All 168 pages have unique title tags (run: npm run qa:seo)
```

### Done-Gate 3C

- [ ] `programmatic-catalog.ts` exists with 56 unique entries (8 cuisines × 7 cities)
- [ ] Every entry has unique `uniqueIntro` and `uniqueBody` (no copy-paste)
- [ ] `npm run build`: all 168 programmatic pages generate without errors
- [ ] `/en/fine-dining/manhattan` and `/en/fine-dining/tribeca` have different page content
- [ ] Non-existent city → 404
- [ ] Existing routes (`/en/menu`, `/en/about`) not affected by catch-all
- [ ] Schema.org Restaurant with `areaServed` validates on 3 pages
- [ ] Internal links added from footer → top 5 cuisine/city combos
- [ ] All 56 EN pages have unique title tags
- [ ] ISR set to 86400 on all programmatic pages
- [ ] `git commit: "feat: phase-3C — 56 programmatic SEO pages, cuisine×city catalog"`

---

## Prompt 3D — Schema.org: Full Implementation

**Goal:** Implement complete structured data across the entire site. This drives rich results in Google (star ratings, menus, events, FAQ snippets). Validate every schema type.

```
You are building BAAM System R — Restaurant Premium.
Reference: @a6_content_contracts.md — Schema.org section

Implement complete schema.org structured data across all pages.
Use JSON-LD format (<script type="application/ld+json">).
Add as a server component — never client-side.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 1 — Restaurant (sitewide, all pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: components/seo/RestaurantSchema.tsx
Add to: app/[locale]/layout.tsx (appears on every page)

{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://themeridian.com/#restaurant",
  "name": site.name.en,
  "description": seo.description.en,
  "url": "https://themeridian.com/en",
  "telephone": site.phone,
  "email": site.email,
  "image": [seo.og_image, ...gallery_items featured photos (up to 3)],
  "logo": "https://themeridian.com/images/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": site.address.street,
    "addressLocality": site.address.city,
    "addressRegion": site.address.state,
    "postalCode": site.address.zip,
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": site.lat,
    "longitude": site.lng
  },
  "servesCuisine": site.cuisine.en,
  "priceRange": "$$$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card",
  "acceptsReservations": true,
  "hasMenu": "https://themeridian.com/en/menu",
  "menu": "https://themeridian.com/en/menu",
  "openingHoursSpecification": [
    // Generate from site.hours — skip null days
    // Tuesday:
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Tuesday",
      "opens": "17:30",
      "closes": "22:30"
    },
    // ... for each non-null day
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": site.ratings.google.rating,
    "reviewCount": site.ratings.google.count,
    "bestRating": 5,
    "worstRating": 1
  },
  "sameAs": [
    site.social.instagram_url,
    site.social.facebook,
    site.social.yelp,
    site.social.resy
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 2 — Menu (menu pages only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: components/seo/MenuSchema.tsx
Add to: app/[locale]/menu/[type]/page.tsx

Load all categories + items for the current menu type.

{
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "{menuType} Menu — The Meridian",
  "url": "https://themeridian.com/en/menu/{type}",
  "inLanguage": locale,
  "hasMenuSection": categories.map(category => ({
    "@type": "MenuSection",
    "name": category.name[locale],
    "description": category.description?.[locale],
    "hasMenuItem": items
      .filter(i => i.category_id === category.id)
      .map(item => ({
        "@type": "MenuItem",
        "name": item.name[locale],
        "description": item.description?.[locale],
        "image": item.image,
        "suitableForDiet": item.dietary_flags.map(flag => ({
          vegan: "VeganDiet",
          vegetarian: "VegetarianDiet",
          "gluten-free": "GlutenFreeDiet",
          "dairy-free": "LowLactoseDiet",
        }[flag])).filter(Boolean),
        "offers": item.price ? {
          "@type": "Offer",
          "price": (item.price / 100).toFixed(2),
          "priceCurrency": "USD"
        } : undefined
      }))
  }))
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 3 — Event (event detail pages only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: components/seo/EventSchema.tsx
Add to: app/[locale]/events/[slug]/page.tsx

(Already partially built in Phase 2A — verify and complete)

{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title[locale],
  "description": event.description[locale],
  "image": event.image,
  "startDate": event.start_datetime,
  "endDate": event.end_datetime,
  "eventStatus": event.cancelled
    ? "https://schema.org/EventCancelled"
    : "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": site.name.en,
    "address": { "@type": "PostalAddress", ...site.address }
  },
  "organizer": {
    "@type": "Organization",
    "name": site.name.en,
    "url": "https://themeridian.com/en"
  },
  "offers": event.price_per_person ? {
    "@type": "Offer",
    "price": (event.price_per_person / 100).toFixed(2),
    "priceCurrency": "USD",
    "availability": event.cancelled
      ? "https://schema.org/Discontinued"
      : "https://schema.org/InStock",
    "url": event.reservation_link || "https://themeridian.com/en/reservations"
  } : {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 4 — BlogPosting (article pages only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: components/seo/BlogPostingSchema.tsx
Add to: app/[locale]/blog/[slug]/page.tsx

(Already partially built in Phase 2C — verify and complete)

{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title[locale],
  "description": post.excerpt[locale],
  "image": post.featured_image,
  "author": {
    "@type": "Person",
    "name": author.name,
    "url": "https://themeridian.com/en/about/team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "The Meridian",
    "logo": {
      "@type": "ImageObject",
      "url": "https://themeridian.com/images/logo.png"
    }
  },
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://themeridian.com/en/blog/{post.slug}"
  },
  "inLanguage": locale,
  "wordCount": estimateWordCount(post.body[locale])
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 5 — FAQPage (FAQ page only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(Already built in Phase 2F — verify it's complete and correct)

Location: app/[locale]/faq/page.tsx

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": allQuestions.map(q => ({
    "@type": "Question",
    "name": q.question[locale],
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer[locale]
    }
  }))
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 6 — BreadcrumbList (all pages except home)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: components/seo/BreadcrumbSchema.tsx
Add to: every page except homepage

Also render visible breadcrumb nav component:
  File: components/ui/Breadcrumb.tsx (REUSE from medical system, restyle)

Example for /en/menu/dinner:
  Breadcrumb: Home → Menu → Dinner Menu

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",
      "item": "https://themeridian.com/en" },
    { "@type": "ListItem", "position": 2, "name": "Menu",
      "item": "https://themeridian.com/en/menu" },
    { "@type": "ListItem", "position": 3, "name": "Dinner Menu",
      "item": "https://themeridian.com/en/menu/dinner" }
  ]
}

Auto-generate BreadcrumbList from page path segments.
Build a helper: generateBreadcrumbs(pathname, locale) → BreadcrumbItem[]

Visible Breadcrumb component styling:
  Position: top of page content (below hero for content pages)
  Text: var(--size-small), var(--color-text-muted), var(--font-ui)
  Separator: " › " in var(--color-border)
  Current page: var(--color-text-primary), not linked
  Last item: no link (current page)
  Mobile: show on tablet and desktop, hide on 375px mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA VALIDATION TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After implementation, validate ALL schema types using:
  Google Rich Results Test: https://search.google.com/test/rich-results
  Schema.org validator: https://validator.schema.org

Pages to validate:
  Restaurant schema: / (homepage)
  Menu schema: /menu/dinner, /menu/cocktails, /menu/wine
  Event schema: /events/burgundy-wine-dinner
  BlogPosting schema: /blog/the-philosophy-behind-our-menu
  FAQPage schema: /faq
  BreadcrumbList schema: /menu/dinner, /about/team, /blog/[slug]

Expected rich results:
  Breadcrumbs: appear in Google search for all inner pages
  FAQPage: FAQ snippets in search results
  Restaurant: business info panel (address, hours, rating)

VERIFY:
- Restaurant schema in <head> on homepage (view source)
- Menu schema: dinner page has hasMenuSection with hasMenuItem arrays
- Event schema: cancelled event has "EventCancelled" status
- BlogPosting schema: wordCount field present
- FAQPage schema: all 21 questions/answers included
- BreadcrumbList schema: auto-generated correctly for /menu/dinner
- Visible breadcrumb: Home › Menu › Dinner Menu shows below hero
- Breadcrumb hidden at 375px width
- No duplicate schema types on same page (only one Restaurant per page)
```

### Done-Gate 3D

- [ ] Restaurant schema on every page — validates in Rich Results Test
- [ ] Menu schema on all 5 menu detail pages — validates
- [ ] Event schema on event detail pages — cancelled event shows `EventCancelled`
- [ ] BlogPosting schema on article pages — validates
- [ ] FAQPage schema — all 21 Q&As included, validates
- [ ] BreadcrumbList schema on all inner pages — validates
- [ ] Visible Breadcrumb component renders on all non-homepage pages
- [ ] Breadcrumb hidden on 375px mobile
- [ ] No duplicate schema types per page
- [ ] `git commit: "feat: phase-3D — complete schema.org (Restaurant, Menu, Event, Blog, FAQ, Breadcrumb)"`

---

## Prompt 3E — Sitemap + robots.txt + IndexNow

**Goal:** Make every page discoverable by search engines. Generate a complete sitemap including all static, dynamic, and programmatic pages. Submit to Google and Bing. Implement IndexNow for real-time indexing of new content.

```
You are building BAAM System R — Restaurant Premium.

Build the complete SEO crawlability infrastructure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — SITEMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/sitemap.ts (Next.js sitemap generation)

Generate a sitemap with ALL public URLs across all 3 locales:

STATIC PAGES (× 3 locales = N × 3 URLs each):
  / (homepage)
  /menu, /menu/dinner, /menu/tasting-menu, /menu/cocktails,
  /menu/wine, /menu/seasonal
  /about, /about/team
  /reservations
  /contact
  /events
  /gallery
  /blog
  /press (if features.press_section = true)
  /reservations/private-dining (if features.private_dining = true)
  /faq
  /gift-cards (if features.gift_cards = true)
  /careers (if features.careers = true)

DYNAMIC PAGES (from DB, × 3 locales):
  /events/{slug} — all published, non-cancelled events
  /blog/{slug} — all published blog posts

PROGRAMMATIC PAGES (from catalog, EN only — ZH/ES optional):
  /{cuisineSlug}/{citySlug} — all 56 catalog entries × 3 locales = 168

Each sitemap entry:
  url: full absolute URL including locale prefix
  lastModified: page updated_at from DB (or Date.now() for static)
  changeFrequency:
    homepage: 'weekly'
    menu pages: 'monthly'
    events: 'weekly'
    blog: 'monthly'
    programmatic: 'monthly'
  priority:
    homepage: 1.0
    /menu, /reservations: 0.9
    /menu/dinner, /menu/cocktails: 0.8
    /about, /contact, /events, /blog: 0.7
    /gallery, /press, /faq: 0.6
    individual events, blog posts: 0.7
    programmatic pages: 0.5

Generate using Next.js MetadataRoute.Sitemap type.
Accessible at: https://themeridian.com/sitemap.xml

Sitemap index (if >1000 URLs — use sitemap index):
  Split into:
    /sitemap-static.xml  (static pages)
    /sitemap-dynamic.xml (events + blog posts)
    /sitemap-seo.xml     (programmatic pages)
  /sitemap.xml → sitemap index pointing to above 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — ROBOTS.TXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/robots.ts (Next.js robots generation)

Rules:
  User-agent: *
  Allow: /

  # Disallow admin area
  Disallow: /admin
  Disallow: /admin/
  Disallow: /api/admin/

  # Disallow API routes (not pages)
  Disallow: /api/

  # Allow specific API routes that return public data
  Allow: /api/sitemap

  # Disallow development artifacts
  Disallow: /_next/
  Allow: /_next/static/
  Allow: /_next/image/

  Sitemap: https://themeridian.com/sitemap.xml

Test: Visit /robots.txt → verify Disallow: /admin present.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — CANONICAL URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify canonical tags on all pages (mostly done in Phase 1):

Every page must have:
  <link rel="canonical" href="https://themeridian.com/{locale}/{path}" />

Special cases:
  Homepage (/en): canonical = https://themeridian.com/en
  Homepage (/zh): canonical = https://themeridian.com/zh
  Programmatic (/en/fine-dining/manhattan):
    canonical = https://themeridian.com/en/fine-dining/manhattan
    (NOT the EN version — each locale has its own canonical)

hreflang set on every page:
  <link rel="alternate" hreflang="en" href=".../en/..." />
  <link rel="alternate" hreflang="zh-Hans" href=".../zh/..." />
  <link rel="alternate" hreflang="es" href=".../es/..." />
  <link rel="alternate" hreflang="x-default" href=".../en/..." />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — INDEXNOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IndexNow lets us notify search engines instantly when content changes.

File: lib/seo/indexnow.ts

Generate API key: random 32-char hex string
Place key file at: public/{api-key}.txt (contains only the key)

IndexNow submission function:
  async function submitToIndexNow(urls: string[]): Promise<void> {
    const payload = {
      host: "themeridian.com",
      key: process.env.INDEXNOW_API_KEY,
      keyLocation: `https://themeridian.com/${process.env.INDEXNOW_API_KEY}.txt`,
      urlList: urls
    }
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    // Also submit to Bing:
    await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
  }

Trigger IndexNow submission after:
  1. Blog post published (in Blog Posts Editor save handler)
     → submitToIndexNow([`https://themeridian.com/en/blog/${slug}`])
  2. Event published (in Events Editor save handler)
     → submitToIndexNow([`https://themeridian.com/en/events/${slug}`])
  3. Menu updated (in Menu Editor save handler)
     → submitToIndexNow([`https://themeridian.com/en/menu`])

Add IndexNow key to .env.local:
  INDEXNOW_API_KEY=<generated-key>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — OPEN GRAPH META COMPLETION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify every page has complete OG tags:
  og:type: website (standard) | article (blog posts) | restaurant
  og:title: page-specific title
  og:description: page-specific description (150–160 chars)
  og:image: page-specific image (fall back to seo.og_image if none)
  og:url: canonical URL
  og:site_name: "The Meridian"
  og:locale: en_US | zh_CN | es_ES based on current locale

Twitter card tags:
  twitter:card: summary_large_image
  twitter:title: same as og:title
  twitter:description: same as og:description
  twitter:image: same as og:image
  twitter:site: @themeridiannyc (from site.social.instagram)

VERIFY:
- /sitemap.xml loads and lists 200+ URLs
- /robots.txt: Disallow: /admin present, Allow: / present
- /en canonical tag in page source of homepage
- Every page: og:title, og:description, og:image all non-empty
- Blog post: og:type = article
- hreflang tags: all 3 locales present on every page
- IndexNow key file accessible: /en/{key}.txt returns the key string
- Publish a blog post → IndexNow API called (log to console in dev)
```

### Done-Gate 3E

- [ ] `/sitemap.xml` loads with 200+ URLs
- [ ] Sitemap includes: all static pages × 3 locales, all event/blog pages, all 56 programmatic × 3 locales
- [ ] `/robots.txt`: `Disallow: /admin` present, sitemap URL listed
- [ ] Every page has canonical URL in `<head>`
- [ ] hreflang alternates (EN/ZH/ES + x-default) on every page
- [ ] OG tags: title + description + image non-empty on all pages
- [ ] Blog posts: `og:type = article`
- [ ] IndexNow key file accessible at `/en/{key}.txt`
- [ ] Publishing a blog post → IndexNow API call fires (verified in dev console)
- [ ] `git commit: "feat: phase-3E — sitemap, robots.txt, canonical, IndexNow, OG tags"`

---

## Prompt 3F — Performance Optimization: Core Web Vitals

**Goal:** Achieve Lighthouse ≥ 90 Performance on the 5 most important pages. Hit Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, FID < 100ms. Restaurant sites are image-heavy — images are the #1 performance issue.

```
You are building BAAM System R — Restaurant Premium.

Run a performance optimization pass targeting Core Web Vitals.

Target metrics:
  LCP (Largest Contentful Paint): < 2.5 seconds
  CLS (Cumulative Layout Shift):  < 0.1
  FID (First Input Delay):        < 100ms (INP < 200ms)
  Lighthouse Performance:         ≥ 90 on 5 pages

Pages to optimize (in priority order):
  1. Homepage (/)
  2. Menu — Dinner (/menu/dinner)
  3. Reservations (/reservations)
  4. About (/about)
  5. Contact (/contact)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE OPTIMIZATION (highest impact)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rule: ALL images must use next/image. Zero <img> tags in production.

HERO IMAGES (LCP critical):
  - Add priority={true} to the first hero image on every page
    (hero image is almost always the LCP element)
  - Add fetchpriority="high" via next/image priority prop
  - Ensure explicit width + height on all hero next/image components
    (prevents CLS from layout shift during load)
  - Hero images: serve at 1440px max (no 4K images)
    Recommended: width=1440 height=810 for 16:9 heroes

GALLERY IMAGES (bulk optimization):
  - First 6 gallery items: loading="eager"
  - Remaining: loading="lazy" (default next/image behavior)
  - All gallery items: provide explicit width + height
    (stored in gallery_items.width + gallery_items.height columns)
  - If width/height missing: fetch at upload time and store

MENU ITEM IMAGES:
  - All menu item images: loading="lazy"
  - Provide sizes prop: "(max-width: 768px) 50vw, 25vw"
  - Use WebP format (next/image provides this automatically)

CHEF PORTRAITS:
  - ChefHeroFull portrait: priority={true} (above fold)
  - Team grid photos: loading="lazy"

UNSPLASH/PEXELS PLACEHOLDER IMAGES:
  - Add next.config.js image domains:
    images.unsplash.com, images.pexels.com, [supabase-project].supabase.co
  - Use next/image for all external images too

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLS PREVENTION (layout shift)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Common CLS causes in restaurant sites:

1. Font loading (FOUT/FOIT):
   - All Google Fonts loaded with font-display: swap (already set)
   - Add size-adjust CSS to fallback fonts to reduce layout shift:
     @font-face {
       font-family: 'Cormorant Garamond fallback';
       src: local('Georgia');
       size-adjust: 105%;  /* tune to match Cormorant metrics */
       ascent-override: 90%;
       descent-override: 22%;
     }
   - Use this fallback in var(--font-display) and var(--font-heading)
     while real font loads

2. Dynamic content loading:
   - Menu items: reserve height with skeleton loaders
     (skeleton = same height as actual item row)
   - Events: EventCard has fixed height during skeleton state
   - Gallery: explicit width/height prevents shift

3. Cookie banner / announcements:
   - If announcement bar in header: include in SSR, don't inject after JS
   - No elements injected into DOM after initial render that
     push content down

4. Sticky nav height:
   - Set explicit min-height on header wrapper
     (prevents shift when transparent → opaque transition)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JAVASCRIPT BUNDLE OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyze bundle with:
  npm run build -- --analyze
  (Add @next/bundle-analyzer to next.config.js)

Common issues to fix:

1. Heavy dependencies loaded on all pages:
   - Resy/OpenTable embed scripts: load only on /reservations page
     Use dynamic import with ssr: false
     const ReservationWidgetResy = dynamic(
       () => import('@/components/reservations/ReservationWidgetResy'),
       { ssr: false }
     )

2. Gallery Lightbox: only load on /gallery page
   Already client-side — verify tree-shaking is working
   If not: dynamic import on /gallery only

3. Date picker in reservation form: dynamic import
   const ReservationWidgetCustom = dynamic(...)

4. Route-level code splitting:
   - Each page's unique components should be in its own chunk
   - Verify next build shows reasonable chunk sizes (< 150KB per page)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CACHING + REVALIDATION STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page caching strategy:

  Homepage: ISR revalidate = 3600 (1 hour)
    Changes infrequently; testimonials/events update = OK to wait

  Menu pages: ISR revalidate = 1800 (30 min)
    Item availability changes more frequently

  Events: ISR revalidate = 900 (15 min)
    Last-minute cancellations should surface quickly

  Blog articles: ISR revalidate = 3600 (1 hour)
    Low change frequency

  Programmatic pages: ISR revalidate = 86400 (24 hours)
    Very low change frequency

  Contact + static info: ISR revalidate = 86400

API route caching (public data endpoints):
  Add Cache-Control headers:
    GET /api/menu/{type}: max-age=1800, s-maxage=1800
    GET /api/events: max-age=900, s-maxage=900

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL CSS + FONT STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Critical CSS inlined:
   Next.js handles this via CSS Modules / Tailwind PurgeCSS
   Verify: CSS in <style> tag in <head> (not a separate .css file request)

2. Preload hero font:
   Add <link rel="preload"> for Cormorant Garamond (primary display font):
   <link rel="preload" as="font" type="font/woff2"
     href="/fonts/cormorant-garamond-400.woff2" crossOrigin="anonymous" />

3. Preconnect to external origins:
   Add to layout.tsx <head>:
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
   <link rel="preconnect" href="https://[project].supabase.co" />
   <link rel="dns-prefetch" href="https://widgets.resy.com" />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIRD-PARTY SCRIPT MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Load third-party scripts with Next.js Script component:

Google Analytics (if used):
  <Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
    strategy="afterInteractive" />

Resy widget (only on /reservations):
  <Script src="https://widgets.resy.com/embed.js"
    strategy="lazyOnload" />

OpenTable widget (only on /reservations):
  <Script src="https://www.opentable.com/widget/reservation/..."
    strategy="lazyOnload" />

Rule: NO script with strategy="beforeInteractive" unless
absolutely required. Most scripts should be afterInteractive or lazyOnload.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEASUREMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all optimizations, run Lighthouse in:
  Chrome DevTools → Lighthouse tab → Mobile
  Throttling: Applied throttling (simulated slow 4G)

Record scores for 5 pages:
  Homepage | Menu/Dinner | Reservations | About | Contact

Target: ≥ 90 Performance on all 5.
If any page < 90: identify the specific opportunity (Lighthouse shows
exactly what's costing points) and fix it.

Also run: npm run build
Check output for:
  - Page sizes (should be < 300KB gzipped for main pages)
  - First Load JS: < 150KB per route ideally

VERIFY:
- All hero images: priority={true} set
- No <img> tags in production (use grep: grep -r "<img " src/)
- Bundle analyzer: no page > 500KB gzipped
- Font preload link present in layout <head>
- preconnect links for Google Fonts + Supabase in <head>
- Reservation widgets: only load on /reservations page (check Network tab)
- Lighthouse Performance ≥ 90 on homepage (run in incognito)
- LCP < 2.5s on homepage (check Lighthouse "Largest Contentful Paint" detail)
- CLS < 0.1 on homepage
```

### Done-Gate 3F

- [ ] All hero images have `priority={true}` in next/image
- [ ] Zero `<img>` tags in production (`grep -r "<img " src/` returns 0)
- [ ] Font fallback with `size-adjust` reduces FOUT CLS
- [ ] Reservation widgets load lazily (only on `/reservations` page)
- [ ] Bundle: no page route > 500KB gzipped
- [ ] `preconnect` links for Fonts + Supabase in layout `<head>`
- [ ] Lighthouse Performance ≥ 90 on all 5 target pages
- [ ] LCP < 2.5s on homepage
- [ ] CLS < 0.1 on homepage
- [ ] ISR revalidation times set correctly per page type
- [ ] `git commit: "feat: phase-3F — Core Web Vitals, image optimization, bundle analysis"`

---

## Prompt 3G — Automated QA Scripts

**Goal:** Create a suite of automated QA scripts that catch regressions before they reach production. These scripts run on every deploy and before every Phase gate.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Minimum Automation Checks"

Build 5 automated QA scripts in scripts/qa/:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 1 — Schema Validation (qa:schema)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: scripts/qa/schema-check.ts
Command: npm run qa:schema

What it checks:
  For every content_entries row in Supabase (for the template site):
    1. Parse data JSON
    2. Validate against expected schema for that path
    3. Check: all required fields present
    4. Check: no fields contain empty string where required
    5. Check: LocalizedString fields have at least 'en' value
    6. Check: image URL fields are valid URLs or null (not empty string)

  For menu_items table:
    1. All items: name.en non-empty
    2. All items: category_id references valid category
    3. Featured items: image present (warn if missing)
    4. Price: if set, must be positive integer

  For team_members table:
    1. All active members: name non-empty, role.en non-empty
    2. Featured member: photo non-empty (warn if missing)

Output format:
  ✅ PASS  content/the-meridian/en/pages/home — 9 sections, all valid
  ⚠️ WARN  menu_items/wagyu-short-rib — featured=true but no image
  ❌ FAIL  content/the-meridian/en/pages/menu — missing required field: sections

Exit code: 0 if no FAILs (WARNs allowed), 1 if any FAILs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 2 — Route Smoke Tests (qa:routes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: scripts/qa/route-check.ts
Command: npm run qa:routes
Requires: app running at localhost:3060

Route list to test (all 3 locales):
  Static routes × 3 locales (21+ URL):
    /en, /zh, /es
    /en/menu, /zh/menu, /es/menu
    /en/menu/dinner, /zh/menu/dinner, /es/menu/dinner
    /en/menu/cocktails, /en/menu/wine, /en/menu/seasonal
    /en/about, /en/about/team
    /en/reservations, /en/contact
    /en/events, /en/gallery, /en/blog
    /en/press, /en/faq
    /en/reservations/private-dining
    /en/gift-cards, /en/careers

  Dynamic routes (2 examples of each):
    /en/events/burgundy-wine-dinner
    /en/events/jazz-oysters-evening
    /en/blog/the-philosophy-behind-our-menu
    /en/blog/how-we-source-our-ingredients

  Programmatic routes (3 samples):
    /en/contemporary-american-restaurant/new-york
    /en/fine-dining/manhattan
    /en/private-dining/tribeca

  Expected 404s:
    /en/nonexistent-page
    /en/events/this-event-does-not-exist
    /en/blog/fake-post-slug

For each URL:
  1. HTTP GET the URL
  2. Check status code:
     - Regular pages: expect 200
     - Expected 404s: expect 404
     - Any 500: always FAIL
  3. Check HTML response:
     - Contains <title> tag with non-empty text
     - Contains at least one <h1> tag
     - Does NOT contain "Error", "TypeError", "undefined" in body
     - Does NOT contain "[object Object]" (serialization bug)
  4. Check response time: warn if > 3000ms

Output:
  ✅ 200  /en/menu/dinner — 1230ms
  ✅ 404  /en/nonexistent-page — 120ms
  ❌ 500  /en/events/cancelled-event — "Internal Server Error"
  ⚠️ SLOW /en/gallery — 4200ms (> 3000ms threshold)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 3 — SEO Metadata Check (qa:seo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: scripts/qa/seo-check.ts
Command: npm run qa:seo
Requires: app running at localhost:3060

For each page URL in the route list above:
  1. Fetch HTML
  2. Parse <head> with cheerio (npm install cheerio)
  3. Check:
     - <title>: non-empty, < 70 chars, contains "The Meridian"
     - <meta name="description">: non-empty, 100–165 chars
     - <link rel="canonical">: present, matches current URL
     - <meta property="og:title">: present, non-empty
     - <meta property="og:description">: present, non-empty
     - <meta property="og:image">: present, valid URL
     - <h1>: exactly one <h1> per page (not zero, not two+)
     - hreflang: at least 3 <link rel="alternate"> tags present

  4. Uniqueness check:
     Collect all titles across all URLs.
     FAIL if any two pages share the same <title>
     (except for locale variants of the same page)

  5. Programmatic uniqueness:
     Check all /[cuisine]/[city] pages have unique titles
     (different cuisine+city = must have different title)

Output:
  ✅ /en/menu/dinner — title OK (56 chars), description OK (152 chars),
     canonical OK, h1 count: 1, hreflang: 3 tags
  ❌ /en/gallery — description missing
  ❌ DUPLICATE TITLE: /en/events + /en/blog share same title tag

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 4 — Link Checker (qa:links)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: scripts/qa/link-check.ts
Command: npm run qa:links
Requires: app running at localhost:3060

Crawl all internal links across the site:
  1. Start at /en (homepage)
  2. Find all <a href="..."> tags
  3. For each internal link (same hostname):
     - Add to queue if not already visited
     - Visit and check status code
  4. Report all 404s found
  5. Report all links pointing to /en/features.disabled pages
     (e.g., if gift_cards = false, no links should go to /en/gift-cards)
  6. Depth limit: 4 levels deep (prevents infinite crawl)

Also check: navigation.json links
  For each nav item href: verify the URL returns 200

Output:
  Crawled 187 internal links
  ✅ 183 OK
  ❌ 4 broken:
    /en/about/team → link to /en/chef-marcus → 404
    /en/footer → link to /en/sustainability → 404 (page not built yet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 5 — Content Completeness (qa:content)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: scripts/qa/content-check.ts
Command: npm run qa:content

What it checks (no HTTP requests needed — reads DB directly):

PLACEHOLDER DETECTION:
  Scan all content_entries.data fields for:
    "lorem ipsum", "placeholder", "TODO", "FIXME",
    "The Meridian" in team bio fields (should be replaced for clients),
    "[NAME]", "[CITY]", "[PHONE]",
    "\u0000" (null bytes — sign of corrupted content)
  WARN for each found

IMAGE COMPLETENESS:
  Hero sections: image field must be set (not null, not empty string)
  Menu items with featured=true: image field should be set (WARN if missing)
  Gallery items: url field must be valid URL
  Team members with featured=true: photo field should be set

TRANSLATION COMPLETENESS:
  For all LocalizedString fields in content:
    All 3 supported locales (en/zh/es) must have non-empty values
  WARN for each missing translation:
    ⚠️ WARN  pages/home → hero.headline.zh is empty

HOURS COMPLETENESS:
  site.json hours: at least 4 days of the week must have hours set
  (restaurant closed 2-3 days is normal; all 7 null would be a bug)

BLOG COMPLETENESS:
  Published blog posts: body.en must be > 200 chars (not a stub)
  Published blog posts: featured_image must be set

Output:
  Scanning 142 content entries...
  ⚠️ WARN  10 LocalizedString fields missing ZH translation
  ⚠️ WARN  3 featured menu items missing image
  ✅ No placeholder text found
  ✅ All hero images set
  ✅ Hours complete (6 of 7 days set)
  ✅ Blog posts: all 3 published posts have body > 200 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PACKAGE.JSON SCRIPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to package.json:
  "qa:schema":  "tsx scripts/qa/schema-check.ts",
  "qa:routes":  "tsx scripts/qa/route-check.ts",
  "qa:seo":     "tsx scripts/qa/seo-check.ts",
  "qa:links":   "tsx scripts/qa/link-check.ts",
  "qa:content": "tsx scripts/qa/content-check.ts",
  "qa:all":     "npm run qa:schema && npm run qa:routes && npm run qa:seo && npm run qa:links && npm run qa:content"

Install: npm install --save-dev tsx cheerio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to Phase 4 done-gate:
  npm run qa:schema  — 0 FAILs (WARNs acceptable)
  npm run qa:routes  — all pages return correct status
  npm run qa:seo     — all pages: title + description + canonical + h1
  npm run qa:links   — 0 broken internal links
  npm run qa:content — 0 placeholder strings, 0 missing hero images

VERIFY:
- npm run qa:schema runs and outputs results (any format)
- npm run qa:routes: /en returns 200, /en/nonexistent returns 404
- npm run qa:seo: detects missing description on a test page
  (temporarily remove description from one page → run → FAIL → restore → PASS)
- npm run qa:links: crawls minimum 50 links, finds 0 broken
- npm run qa:content: detects "lorem ipsum" if planted in content
  (temporarily add "lorem ipsum" to a content field → FAIL → remove → PASS)
- npm run qa:all: runs all 5 in sequence, exits 0 on clean codebase
```

### Done-Gate 3G

- [ ] `npm run qa:schema` runs without crashing, outputs results
- [ ] `npm run qa:routes` — all 30+ routes return correct status codes
- [ ] `npm run qa:routes` — no 500 errors on any page
- [ ] `npm run qa:seo` — detects missing description (test + restore)
- [ ] `npm run qa:seo` — no duplicate titles found across all pages
- [ ] `npm run qa:links` — crawls site, reports 0 broken internal links
- [ ] `npm run qa:content` — detects "lorem ipsum" if present (test + restore)
- [ ] `npm run qa:all` — runs all 5, exits 0 on clean codebase
- [ ] All 5 scripts added to `package.json`
- [ ] `git commit: "feat: phase-3G — automated QA suite (schema, routes, SEO, links, content)"`

---

## Phase 3 Completion Gate

All items below must pass before starting Phase 4.

| Requirement | Pass? |
|---|---|
| `ADMIN_COVERAGE_MATRIX.md`: 100% PASS across all pages | |
| All LocalizedString fields: EN/ZH/ES tabs in admin | |
| All image fields: image picker (not text input) | |
| Array fields (testimonials, stats, FAQ): add/remove/reorder | |
| Read-only submission tables: all 5 visible in admin | |
| `ADMIN_CERTIFICATION_MATRIX.md`: zero P0, zero P1 | |
| 56 programmatic pages build without errors | |
| Programmatic pages: unique content per page (not copy-paste) | |
| Restaurant schema validates on homepage | |
| Menu schema validates on /menu/dinner | |
| Event schema validates with EventCancelled status | |
| FAQPage schema: all 21 Q&As included | |
| BreadcrumbList on all inner pages, visible breadcrumb renders | |
| `/sitemap.xml`: 200+ URLs listed | |
| `/robots.txt`: `Disallow: /admin` present | |
| hreflang tags on every page (all 3 locales) | |
| IndexNow: publishes fire on blog post + event publish | |
| Lighthouse Performance ≥ 90 on all 5 target pages | |
| LCP < 2.5s, CLS < 0.1 on homepage | |
| No `<img>` tags in production | |
| `npm run qa:schema` — 0 FAILs | |
| `npm run qa:routes` — all routes correct status | |
| `npm run qa:seo` — no missing meta, no duplicate titles | |
| `npm run qa:links` — 0 broken links | |
| `npm run qa:content` — 0 placeholder strings | |
| `npm run build` — zero TypeScript/build errors | |
| **Git tagged:** `v0.3-launch-ready` | |

**Phase 3 complete → Proceed to `RESTAURANT_PHASE_4.md`**

---

*BAAM System R — Restaurant Premium*
*Phase 3 of 5 — Admin Hardening + SEO + Programmatic Pages*
*Next: RESTAURANT_PHASE_4.md — QA + Content Swap + Production Launch*
