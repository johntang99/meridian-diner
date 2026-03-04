# BAAM System R — Restaurant Premium
# Phase 4: QA + Content Swap + Production Launch

> **System:** BAAM System R — Restaurant Premium
> **Reference files:** `@RESTAURANT_PHASE_4.md` (this file) + `@RESTAURANT_COMPLETE_PLAN.md`
> **Prerequisite:** Phase 3 completion gate fully passed. `v0.3-launch-ready` tagged.
> **Method:** One Cursor prompt per session. Every gate must pass before proceeding.
> **Goal:** Full QA pass, swap The Meridian placeholder content for the first real client, deploy to production, submit to search engines, and verify Pipeline B is operationally ready.

---

## Phase 4 Overview

**Duration:** Week 5
**Goal:** This is the launch week. Phase 4 has no new feature development — it is purely about quality, correctness, and deployment confidence. Every prompt in this phase is a verification or hardening pass, not a build prompt.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 4A | Full QA Pass — Admin + Content + Technical | Systematic pre-launch verification | 90 min |
| 4B | Content Swap — The Meridian → First Real Client | Replace all placeholder content | 60 min |
| 4C | Production Deploy — Vercel + Domain + SSL | Live deployment | 45 min |
| 4D | GSC + GMB + IndexNow Submission | Search engine setup | 30 min |
| 4E | Pipeline B Readiness — Test Run | Verify onboarding pipeline end-to-end | 45 min |

---

## Prompt 4A — Full QA Pass: Admin + Content + Technical

**Goal:** Run the most comprehensive QA pass of the entire project. Three domains: Admin QA (can the restaurant team manage the site?), Content QA (is every piece of content correct and complete?), Technical QA (are all systems working end-to-end?). Fix everything found before proceeding to 4B.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md — Platform Guardrails, Anti-Patterns

Run a complete pre-launch QA pass across three domains.
Document every issue found. Fix all issues before marking done.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAIN 1 — ADMIN QA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Simulate a new restaurant admin logging in for the first time.
Walk through every admin task they would need to do in Week 1.

TASK 1 — Update business hours:
  Admin → Content Editor → site.json → hours
  Change Tuesday open time from 17:30 to 18:00
  Save → visit /en/contact → hours show 6:00 PM
  Change back to 17:30 → confirm restored

TASK 2 — Mark a menu item unavailable:
  Admin → Menu Editor → Dinner → Mains
  Find "Wagyu Short Rib" → toggle available = false → Save
  Visit /en/menu/dinner → confirm Wagyu Short Rib not visible
  Re-enable → confirm it returns

TASK 3 — Add a new menu item:
  Admin → Menu Editor → Dinner → Desserts → New Item
  Name (EN): "Lavender Panna Cotta"
  Description (EN): "Housemade lavender panna cotta, seasonal berry compote,
    candied lemon zest"
  Price: $18
  Dietary flags: vegetarian, gluten-free
  Save → visit /en/menu/dinner → item appears in Desserts
  Add ZH translation → Save → /zh/menu/dinner → ZH name shows

TASK 4 — Publish a new blog post:
  Admin → Blog Posts Editor → New Post
  Title: "Winter Menu Launch"
  Category: Seasonal Guide
  Author: Chef Marcus Webb
  Body: 3 paragraphs of content
  Status: Published
  Save → visit /en/blog → post appears at top

TASK 5 — Add an upcoming event:
  Admin → Events Editor → New Event
  Title: "Valentine's Day Prix Fixe"
  Type: Holiday
  Start: Feb 14, 2026 at 6:00 PM
  End: Feb 14, 2026 at 11:00 PM
  Price: $175 per person
  Reservation required: true
  Published: true
  Save → visit /en/events → event appears in upcoming grid

TASK 6 — Upload a gallery photo:
  Admin → Gallery Editor → Upload
  Upload any JPG file
  Alt (EN): "Fresh herbs from our kitchen garden"
  Category: Food
  Featured: true
  Save → visit /en/gallery → new photo visible
  Visit homepage → if first featured gallery item, may appear in GalleryPreview

TASK 7 — Update announcement bar:
  Admin → Content Editor → header.json → top_bar.message
  Change to: "Now booking for Valentine's Day — reserve your table"
  Save → visit /en → top bar shows new message

TASK 8 — Change brand variant (critical Pipeline B test):
  Admin → Variants Panel → switch to "terre-vivante"
  Save → visit /en → background is warm cream, terracotta accent
  Switch back to "noir-saison" → dark background, gold accent restored
  Verify: switching variants has zero effect on content data
    (menu items, blog posts, team profiles all unchanged)

TASK 9 — View a form submission:
  Submit the contact form at /en/contact (use test data)
  Admin → Submissions → Contacts → verify row appears
  Click row → full submission details visible
  Change status from "new" → "reviewed"
  Verify status change persists on refresh

TASK 10 — Export a submission report:
  Admin → Submissions → Contacts → Export CSV
  Verify: CSV file downloads, contains the test submission row
  Open in Excel/Sheets: columns correct, data readable

REPORT any issues found in each task.
Severity: P0 (blocks task) | P1 (partial failure) | P2 (minor friction)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAIN 2 — CONTENT QA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inspect every page for content quality and correctness.
Run: npm run qa:content (from Phase 3G) first.
Then manually verify:

PLACEHOLDER DETECTION — check every page for:
  [ ] "The Meridian" appears in correct places (name, branding)
       and NOT in places it shouldn't (e.g., "Dr. The Meridian" in a bio)
  [ ] No "Lorem ipsum" text anywhere
  [ ] No "[PLACEHOLDER]", "[INSERT]", "[TODO]" text
  [ ] No "undefined" or "[object Object]" rendered on any page
  [ ] No empty section headings (h2 or h3 with no text)
  [ ] No broken image slots (img with empty src or placeholder.com URL)

MENU CONTENT — verify on /en/menu/dinner:
  [ ] All 27 dinner items visible and readable
  [ ] Prices formatted correctly: "$38" not "3800" or "38.00" or "$38.00"
  [ ] Dietary flags render with correct icons (vegan=leaf, gf=grain, etc.)
  [ ] All 5 categories render with correct items in each
  [ ] "Market Price" items show text, not "$0.00" or "$NaN"
  [ ] Featured items (starred) visible in correct sections
  [ ] Seasonal items have seasonal badge

TEAM CONTENT — verify on /en/about/team:
  [ ] All 5 team members visible
  [ ] ChefHeroFull: chef name, philosophy quote, credentials all render
  [ ] Team grid: all 4 non-featured members in grid below
  [ ] No team member has "Lorem" in bio
  [ ] Chef credentials render as styled pills (not raw array [,])

EVENTS CONTENT — verify on /en/events:
  [ ] 6 upcoming events visible (as seeded)
  [ ] Dates are in the future (not 2020)
  [ ] Price formatting: "$195 per person" not "19500"
  [ ] "Reservation Required" badge shows on events with flag

GALLERY CONTENT — verify on /en/gallery:
  [ ] All 26 items load (no broken image slots)
  [ ] Category filter counts correct (Food: 12, etc.)
  [ ] Lightbox: opens on click, caption shows (if set)

BLOG CONTENT — verify on /en/blog:
  [ ] 15 posts visible in hub
  [ ] Featured post: full-width card, not a regular grid card
  [ ] Category filter works (correct post counts per category)
  [ ] Individual article: body renders as HTML (not raw HTML string)
  [ ] Author photo + bio loads from team_members

MULTILINGUAL CONTENT SPOT CHECK:
  [ ] /zh/menu/dinner: menu item names in Chinese
  [ ] /zh/about: About headline in Chinese
  [ ] /es/reservations: CTA button "Reservar Mesa"
  [ ] /zh footer: hours in 24-hour format
  [ ] /en footer: hours in 12-hour format
  [ ] Language switcher: preserves current path (not drops to homepage)

SEO CONTENT:
  [ ] Run: npm run qa:seo
  [ ] Zero FAILs
  [ ] Zero pages with duplicate title tags
  [ ] Every page: description between 100–165 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAIN 3 — TECHNICAL QA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

End-to-end system tests — each must produce a real result.

FORM SUBMISSIONS (use test data, verify real output):
  [ ] Contact form → submit → row in contact_submissions table
      → notification email received at restaurant email
  [ ] Custom reservation form → submit → row in bookings table
      → confirmation email received with confirmation code
      → confirmation code visible in admin bookings panel
  [ ] Newsletter form → submit → row in newsletter_subscribers
      → re-submit same email → no duplicate row, success returned
  [ ] Private dining inquiry → submit → row in table
      → notification email to restaurant
      → confirmation email to guest
  [ ] Careers application (with PDF resume) → submit
      → resume file in Supabase Storage → row in careers_applications
      → notification email to restaurant

NAVIGATION SYSTEM:
  [ ] Run: npm run qa:links → 0 broken internal links
  [ ] All dropdown nav items resolve (no 404 destinations)
  [ ] Feature-gated nav items: test each feature flag
      Disable 'wine_list' → wine nav item disappears → re-enable → returns
  [ ] Mobile nav: all items accessible from hamburger overlay
  [ ] StickyBookingBar: visible on mobile on homepage
      Hidden on /reservations page itself

RESERVATION SYSTEM:
  [ ] Custom form: date picker prevents past dates
  [ ] Custom form: party size 1–10 works, ≥8 shows large party note
  [ ] Custom form: time slot grid renders after date + party selection
  [ ] Custom form: confirmation screen shows code + calendar links
  [ ] "Add to Google Calendar" link: opens correct URL
  [ ] "Download ICS" link: downloads .ics file that opens in Calendar

SCHEMA.ORG:
  [ ] Run: npm run qa:schema → 0 FAILs
  [ ] Validate in Rich Results Test (manual, paste homepage URL):
      Restaurant: shows business info in results preview
      FAQPage: shows accordion in results preview
  [ ] Validate /menu/dinner: MenuItem rich results available

PERFORMANCE:
  [ ] Run Lighthouse on /en in incognito Chrome → ≥ 90 Performance
  [ ] Run Lighthouse on /en/menu/dinner → ≥ 90 Performance
  [ ] No console errors on /en, /en/menu/dinner, /en/reservations
  [ ] Network tab: no 4xx or 5xx resource requests on any page

DATABASE:
  [ ] Supabase: all 9 tables present with correct row counts
      menu_categories: 9 rows
      menu_items: 121+ rows
      team_members: 5 rows
      events: 9 rows (6 upcoming, 3 past)
      gallery_items: 26+ rows
      press_items: 5 rows
  [ ] RLS: confirm unauthenticated request cannot INSERT to bookings
      (test: direct Supabase API call without auth → 401/403 returned)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA REPORT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Produce QA_REPORT_PRE_LAUNCH.md:

## Admin QA
| Task | Result | Issues | Fixed |
|---|---|---|---|
| Update hours | PASS | None | — |
| Mark item unavailable | PASS | None | — |
...

## Content QA
| Check | Result | Issue Found | Fixed |
|---|---|---|---|
| No placeholder text | PASS | None | — |
| Prices formatted | FAIL | "$3800" showing | Changed /100 in formatter |
...

## Technical QA
| Test | Result | Issue | Fixed |
|---|---|---|---|
| Contact form → DB + email | PASS | None | — |
...

## Summary
- Total issues found: N
- P0 issues: 0 (must be 0 to proceed)
- P1 issues: 0 (must be 0 to proceed)
- P2 issues: N (acceptable, log for Phase 5)
- All automated QA scripts: PASS

DELIVER QA_REPORT_PRE_LAUNCH.md before proceeding to Prompt 4B.
```

### Done-Gate 4A

- [ ] All 10 admin tasks complete with zero P0/P1 issues
- [ ] Brand variant switch works and does not affect content data
- [ ] Submission tables: view + status update + CSV export all working
- [ ] npm run qa:content — 0 placeholder strings, 0 missing hero images
- [ ] All 27 dinner items visible, prices formatted correctly
- [ ] Multilingual spot check: ZH/ES content rendering on key pages
- [ ] All 5 form submissions: DB row + email both confirmed
- [ ] npm run qa:links — 0 broken links
- [ ] npm run qa:schema — 0 FAILs
- [ ] Lighthouse ≥ 90 on homepage + menu/dinner
- [ ] RLS: unauthenticated direct DB insert → rejected
- [ ] `QA_REPORT_PRE_LAUNCH.md` produced: zero P0, zero P1
- [ ] `git commit: "feat: phase-4A — pre-launch QA complete, zero P0/P1"`

---

## Prompt 4B — Content Swap: The Meridian → First Real Client

**Goal:** Replace all placeholder Meridian content with the first real restaurant client's content. This is the live content migration. After this prompt, the site represents a real business — not a fictional template.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Pipeline B — Client Onboarding"
Reference: @RESTAURANT_CLIENT_ONBOARDING_MASTER_PLAN.md

NOTE: If Pipeline B is operational (Phase 5 goal), use it for all
future clients. For the FIRST client (production validation), run
this manual content swap to confirm the template is clean.
The manual swap is also the validation that Pipeline B's automated
version will work correctly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRE-SWAP BACKUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before making any changes:

1. Export all Meridian template content to JSON:
   Admin → Export → Full Site Export → download JSON backup
   Save as: backups/the-meridian-template-{date}.json

2. Git snapshot:
   git tag -a v0.3-template-snapshot -m "Template content before first client swap"
   git push origin v0.3-template-snapshot

3. Create new site entry for the real client:
   Admin → Sites → New Site
   Or: duplicate the-meridian in _sites.json → rename to client site ID

   IMPORTANT: The client gets their OWN site_id in the database.
   The Meridian template content stays intact in site_id: 'the-meridian'.
   The client's content is seeded into site_id: '{client-id}'.

   This is the multi-tenant architecture working correctly.
   The Meridian template = never modified for clients.
   Each client = separate site_id with cloned + customized content.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — CREATE CLIENT SITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For the first real client (example: "Le Jardin" in Brooklyn):

1. Add to _sites.json:
   {
     "{client-id}": {
       "id": "{client-id}",
       "name": "{Client Name}",
       "domain": "{client-domain}.com",
       "locales": ["{primary-locale}"],
       "defaultLocale": "{primary-locale}",
       "enabled": true,
       "type": "restaurant",
       "subType": "{sub-type}"
     }
   }

2. Add dev domain to /etc/hosts:
   127.0.0.1 {client-id}.local
   Update .env.local to include NEXT_PUBLIC_DEFAULT_SITE={client-id}
   for local testing of client site.

3. Add production domain to site_domains table:
   INSERT INTO site_domains (site_id, domain, is_primary)
   VALUES ('{client-id}', '{client-domain}.com', true);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — CLONE TEMPLATE CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run the O1 Clone step from Pipeline B:
  SELECT all content_entries WHERE site_id = 'the-meridian'
  INSERT copies with site_id = '{client-id}'
  (all paths, all locales)

This copies the full Meridian content structure to the client site.
The Meridian original is untouched.

Also clone:
  menu_categories: copy all rows with new site_id
  menu_items: copy all rows with new site_id + new category_id refs
  team_members: copy all rows with new site_id
  gallery_items: copy all rows with new site_id
  press_items: copy all rows with new site_id
  events: do NOT clone (clients start with no events)
  blog_posts: do NOT clone (clients start with no blog posts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — APPLY BRAND VARIANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run O2 Brand step:
  Determine correct variant from client sub-type or intake:
    fine-dining → noir-saison
    bistro/farm-to-table → terre-vivante
    contemporary → velocite
    cafe/brunch → matin-clair

  UPDATE content_entries SET data = [variant theme JSON]
  WHERE site_id = '{client-id}' AND path = 'theme'

  If client has custom colors (intake.brand.primaryColor):
    Apply shade generation algorithm to produce full palette
    Override --color-primary and derived tokens in theme.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — REPLACE ALL MERIDIAN STRINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run O4 Replace step — apply all 18 replacement pairs from
Section 21 of RESTAURANT_COMPLETE_PLAN.md:

Write a replacement function:
  function deepReplace(
    obj: unknown,
    pairs: Array<{ find: string, replace: string }>
  ): unknown {
    if (typeof obj === 'string') {
      let result = obj
      // Apply pairs longest-first (prevent partial match)
      const sorted = [...pairs].sort((a, b) => b.find.length - a.find.length)
      for (const { find, replace } of sorted) {
        result = result.replaceAll(find, replace)
      }
      return result
    }
    if (Array.isArray(obj)) return obj.map(item => deepReplace(item, pairs))
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj as Record<string, unknown>).map(
          ([k, v]) => [k, deepReplace(v, pairs)]
        )
      )
    }
    return obj
  }

Apply to ALL content_entries.data JSON where site_id = '{client-id}'.
Replacement pairs from intake form (or from Section 21 with client values):
  "The Meridian Restaurant" → "{Client Name} Restaurant"
  "The Meridian"           → "{Client Name}"
  "Chef Marcus Webb"       → "{Client Chef Name}"
  "themeridian.com"        → "{client-domain}.com"
  "(212) 555-0100"         → "{client phone formatted}"
  "info@themeridian.com"   → "{client email}"
  "1 Meridian Plaza"       → "{client street}"
  "New York, NY 10001"     → "{client city}, {client state} {client zip}"
  "Contemporary American"  → "{client cuisine type}"
  "New York"               → "{client city}"
  "@themeridiannyc"        → "{client instagram handle}"
  ... (all 18 pairs from Section 21)

Contamination check AFTER replacement:
  Scan all content_entries.data WHERE site_id = '{client-id}'
  Look for any remaining "The Meridian", "Marcus Webb", "themeridian.com",
  "(212) 555-0100", "New York, NY 10001"
  FAIL if any found — means replacement pair was missed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — PRUNE DISABLED MENU TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run O3 Prune step:
  From client intake: intake.menu.enabled = ["dinner", "cocktails"]
  (example — client doesn't offer brunch, wine list, seasonal, tasting)

  For each DISABLED menu type (those NOT in enabled[]):
    1. DELETE menu_categories + menu_items WHERE site_id = client-id
       AND menu_type = disabled-slug
    2. UPDATE navigation.json: remove menu type link from dropdown
    3. UPDATE pages/menu.json: remove menu type card from hub
    4. UPDATE pages/home.json: remove menu type from menu-preview
    5. UPDATE footer.json: remove menu link from footer column

  Verify: /en/menu (on client site) shows only "Dinner" and "Cocktails" cards
  Verify: navigation dropdown shows only "Dinner" and "Cocktails"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — UPDATE STRUCTURAL ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Items that string replacement can't handle — must be rebuilt:

Hours:
  Replace the full hours object in site.json:
  {
    "hours": {
      "monday": null,
      "tuesday": { "open": "17:00", "close": "22:00" },
      ... actual client hours from intake
    }
  }

Team profiles:
  DELETE all cloned team_members WHERE site_id = '{client-id}'
  INSERT real client team members from intake.business.teamMembers
  (At minimum: owner/chef profile; others can be added post-launch)

Social links:
  UPDATE site.json social object with client social handles

Reservation config:
  UPDATE site.json features.reservation_provider
  UPDATE site.json features.resy_venue_id (or opentable_id)

Feature flags:
  UPDATE sites table features column from intake.features
  (Only enabled features show in nav / pages)

Locales:
  If client supports only EN (not ZH/ES):
    DELETE content_entries WHERE site_id = '{client-id}'
      AND locale IN ('zh', 'es')
    UPDATE site.json supported_locales = ['en']
    Nav lang switcher will auto-hide (only 1 locale)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — POPULATE REAL CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content the replacement pairs cannot handle — must be written fresh:

In the admin for the client site:

1. Hero headline + subline (Content Editor → pages/home → hero section)
   Write unique headline for this client.
   Do NOT use The Meridian's headline.

2. About / Story section
   Replace the Marcus Webb founding story with the client's actual story.

3. Testimonials
   Replace all 5 Meridian testimonials with the client's actual reviews
   (from Google, Yelp, or provided by client).

4. Menu items
   Replace all 121 seeded items with the client's actual menu.
   (This is typically the most time-consuming part — plan 2–4 hours.)
   Priority order:
     Dinner first (most viewed menu)
     Cocktails + Wine (high-margin items)
     Seasonal last (often added post-launch)

5. Team member content
   Replace Marcus Webb + team with real team.
   Update photos (upload to Supabase Storage).

6. Gallery images
   Upload real restaurant photos to Gallery Editor.
   Replace placeholder Unsplash images.

7. Press + Awards
   Replace Meridian press items with client's actual press.
   If no press yet: delete all press items, hide press_section feature.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8 — CONTAMINATION VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run the contamination scan from O7 Verify step:

Script: scripts/onboard/verify.ts
  Scan all content_entries WHERE site_id = '{client-id}'
  Check for forbidden strings:
    const FORBIDDEN = [
      "The Meridian", "Marcus Webb", "themeridian.com",
      "(212) 555-0100", "info@themeridian.com",
      "1 Meridian Plaza", "10001", "@themeridiannyc",
      "Lorem ipsum", "placeholder", "[INSERT"
    ]
  For each forbidden string found:
    Log: CONTAMINATION FOUND in {path}.{field}: "{string}"
  Exit code 1 if any found.

Also verify required paths exist in client content_entries:
  ['pages/home', 'pages/menu', 'pages/about', 'pages/contact',
   'pages/reservations', 'site', 'header', 'footer', 'navigation']
  Exit code 1 if any required path missing.

Also check menu item count:
  Warn if menu_items count < 5 for any enabled menu type
  (Means client hasn't replaced seeded content yet)

PASS criteria:
  ✅ Zero contamination strings
  ✅ All required paths exist
  ✅ Menu items count acceptable (≥ 5 per enabled type)
  ✅ No placeholder images (no images.unsplash.com URLs remaining
     where real photos expected — hero, chef portrait, gallery)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9 — CLIENT SITE SMOKE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

With NEXT_PUBLIC_DEFAULT_SITE={client-id}:
npm run dev → test at {client-id}.local:3060

Smoke test checklist:
  [ ] Homepage: client name in header logo
  [ ] Homepage: client hero headline (not "The Meridian" anything)
  [ ] Menu hub: only enabled menu types shown
  [ ] /en/menu/dinner: client's real menu items
  [ ] /en/about: client's story + team (not Marcus Webb)
  [ ] /en/contact: client's real address, phone, hours
  [ ] Footer: client's real social links
  [ ] Nav: no links to disabled feature pages
  [ ] Correct brand variant (colors, fonts match client)
  [ ] No contamination strings visible on any page
  [ ] Run: node scripts/onboard/verify.ts → exits 0

VERIFY:
- Template site (the-meridian) still intact at meridian.local:3060
- Client site at {client-id}.local:3060 shows client content
- No cross-contamination (client content on Meridian, or vice versa)
- Contamination script: exits 0 with "All clear" for client site
```

### Done-Gate 4B

- [ ] Template backup created: `backups/the-meridian-template-{date}.json`
- [ ] Git tag `v0.3-template-snapshot` pushed
- [ ] Client site entry created in `_sites.json` + `site_domains` table
- [ ] Template content cloned to client `site_id` (The Meridian unchanged)
- [ ] Brand variant applied for client sub-type
- [ ] All 18 replacement pairs applied (longest-first order)
- [ ] Contamination scan: zero remaining "The Meridian" / "Marcus Webb" / etc.
- [ ] Disabled menu types pruned from nav + pages + footer (5 files each)
- [ ] Hours, team, social, reservation config rebuilt from client intake
- [ ] Hero + about story + testimonials written fresh for client
- [ ] Client menu items seeded (real items, not Meridian placeholder)
- [ ] `node scripts/onboard/verify.ts` exits 0 on client site
- [ ] Client site smoke test: all 10 checks pass
- [ ] Template site (The Meridian) still intact and unmodified
- [ ] `git commit: "feat: phase-4B — first client content swap, contamination clean"`

---

## Prompt 4C — Production Deploy: Vercel + Domain + SSL

**Goal:** Deploy the application to production. Configure custom domain, SSL, environment variables, and Vercel project settings. After this prompt, the site is live on the internet.

```
You are building BAAM System R — Restaurant Premium.
Deploying to production via Vercel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — FINAL BUILD VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before deploying, run on local machine:

npm run build
  Expected: Compilation successful
  Expected: No TypeScript errors
  Expected: No missing environment variables (build should not
    reference undefined process.env values)
  Expected: Output shows page count matching expectations
    Static pages: 200+
    Dynamic pages: events + blog posts
    Programmatic: 56 × 3 = 168

If any errors: fix before deploying.

npm run qa:all
  Expected: all 5 QA scripts pass with 0 FAILs
  If any FAIL: fix before deploying

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — VERCEL PROJECT SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Create Vercel project:
   vercel link (or connect via Vercel dashboard → Import Git Repository)
   Framework: Next.js
   Root directory: ./
   Build command: npm run build
   Output directory: .next (auto-detected)

2. Set environment variables in Vercel dashboard:
   (Vercel → Project → Settings → Environment Variables)
   Copy all production values from .env.local:

   APP_ENV                      = production
   NEXT_PUBLIC_APP_URL          = https://{client-domain}.com
   NEXT_PUBLIC_DEFAULT_SITE     = {client-id}

   SUPABASE_URL                 = [production Supabase URL]
   SUPABASE_ANON_KEY            = [production anon key]
   SUPABASE_SERVICE_ROLE_KEY    = [production service role key]

   JWT_SECRET                   = [production secret — NOT dev secret]

   RESEND_API_KEY               = [production Resend key]
   RESEND_FROM_EMAIL            = noreply@{client-domain}.com
   RESEND_RESERVATIONS_EMAIL    = reservations@{client-domain}.com

   ANTHROPIC_API_KEY            = [key for Pipeline B O5 step]
   INDEXNOW_API_KEY             = [generated in Phase 3E]

   UNSPLASH_ACCESS_KEY          = [keep existing]
   PEXELS_API_KEY               = [keep existing]

   LEAD_ROUTING_FALLBACK_EMAIL  = admin@{client-domain}.com

   Set for: Production · Preview · Development (all environments)
   EXCEPT: SUPABASE_SERVICE_ROLE_KEY → Production only
   (Never expose service role key in preview/development via env var)

3. Vercel project settings:
   Node.js version: 20.x
   Build & Deploy:
     Ignored Build Step: if [ "$VERCEL_ENV" = "production" ]; then exit 1; fi
     (Change to your desired branch strategy — usually main = production)
   Edge Network: Enable edge middleware (for host-based routing)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — INITIAL DEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deploy to Vercel preview first:
  git push origin main
  Vercel auto-builds on push
  Check build logs in Vercel dashboard for errors

When preview build is green:
  Promote to production (or deploy directly to production branch)

Verify the Vercel-assigned URL works:
  https://{project}.vercel.app/en → site loads
  https://{project}.vercel.app/en/menu → menu loads
  Admin: https://{project}.vercel.app/admin → login works

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — CUSTOM DOMAIN + SSL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add domain in Vercel:
   Vercel → Project → Settings → Domains
   Add: {client-domain}.com
   Add: www.{client-domain}.com (redirect to apex)

2. Configure DNS at domain registrar:
   Type A:     @ → 76.76.21.21 (Vercel IP)
   Type CNAME: www → cname.vercel-dns.com

   (If using Cloudflare: set DNS-only proxy mode initially,
    not Proxied — Vercel handles SSL)

3. SSL certificate:
   Vercel auto-provisions Let's Encrypt SSL within minutes of DNS
   propagation. No manual action needed.

4. Verify SSL:
   https://{client-domain}.com → padlock in browser
   https://www.{client-domain}.com → redirects to apex

5. Force HTTPS:
   Vercel does this by default. Verify:
   http://{client-domain}.com → redirects to https://

6. WWW redirect:
   www.{client-domain}.com → redirects to {client-domain}.com
   (Vercel handles this when www is added as redirect domain)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — SUPABASE PRODUCTION CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Supabase dashboard:

1. Auth settings → Site URL:
   Set to: https://{client-domain}.com

2. Auth settings → Redirect URLs:
   Add: https://{client-domain}.com/**
   Add: https://www.{client-domain}.com/**

3. Auth settings → Email templates:
   Update from domain to match RESEND_FROM_EMAIL

4. Storage → Policies:
   Ensure media bucket public read policy is active
   Verify: https://{supabase-project}.supabase.co/storage/v1/object/public/media/{any-uploaded-image}
   Returns 200 (image accessible without auth)

5. Database → Connection Pooling:
   Enable connection pooler (PgBouncer) for production
   Update SUPABASE_URL to use pooler URL if you haven't already

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — RESEND EMAIL PRODUCTION SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add domain in Resend dashboard:
   Resend → Domains → Add Domain → {client-domain}.com
   Add the DNS records Resend provides:
     DKIM: TXT record (re._domainkey.{domain})
     SPF:  TXT record on root domain

2. Verify domain in Resend (takes 0–48 hours for DNS propagation)
   Status shows "Verified" when DNS is correct

3. Test email delivery:
   POST /api/contact with test data → email arrives at restaurant email
   If not arriving: check Resend logs for delivery status

4. Update from address:
   RESEND_FROM_EMAIL = noreply@{client-domain}.com (already in env)
   Reservation confirmations from: reservations@{client-domain}.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — PRODUCTION SMOKE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After DNS propagation (allow up to 24 hours, usually 15–30 min):

URL checks:
  [ ] https://{client-domain}.com → loads homepage, padlock visible
  [ ] https://www.{client-domain}.com → redirects to apex
  [ ] http://{client-domain}.com → redirects to https://
  [ ] https://{client-domain}.com/en → EN homepage loads
  [ ] https://{client-domain}.com/zh → ZH homepage loads
  [ ] https://{client-domain}.com/en/menu → menu loads
  [ ] https://{client-domain}.com/en/reservations → reservations loads
  [ ] https://{client-domain}.com/admin → admin login loads (not 404)
  [ ] https://{client-domain}.com/sitemap.xml → loads with 200+ URLs
  [ ] https://{client-domain}.com/robots.txt → shows Disallow: /admin

Content checks (production):
  [ ] Site title in browser tab: correct for this client
  [ ] Business name in header logo: correct
  [ ] Hero headline: client-specific (not The Meridian)
  [ ] Menu items: client's real menu visible

Form checks (submit real test data to production):
  [ ] Contact form → submission saved to Supabase production DB
  [ ] Confirmation email → arrives at test email inbox
  [ ] Restaurant notification email → arrives at restaurant email

Admin check:
  [ ] https://{client-domain}.com/admin → login with production credentials
  [ ] Menu editor visible with client's menu items
  [ ] Can edit a menu item → save → frontend updates

VERIFY:
- npm run build: 0 errors on production branch
- All env vars confirmed in Vercel dashboard (no undefined values)
- https://{client-domain}.com loads with padlock
- Form submission: email arrives from noreply@{client-domain}.com
- Admin accessible and functional on production URL
```

### Done-Gate 4C

- [ ] `npm run build` and `npm run qa:all` both pass on final main branch
- [ ] Vercel project created and linked to repo
- [ ] All environment variables set in Vercel (production values, not dev)
- [ ] First deploy: Vercel build logs show success
- [ ] Custom domain: `https://{client-domain}.com` loads with padlock
- [ ] `www.` redirects to apex
- [ ] `http://` redirects to `https://`
- [ ] Supabase Auth Site URL updated to production domain
- [ ] Supabase Storage: uploaded images publicly accessible via CDN URL
- [ ] Resend domain verified (check Resend dashboard)
- [ ] Production form test: confirmation email arrives from production domain
- [ ] Admin login working on production URL
- [ ] `/sitemap.xml` accessible on production
- [ ] `git commit: "feat: phase-4C — production deployed to {client-domain}.com"`

---

## Prompt 4D — GSC + GMB + IndexNow Submission

**Goal:** Submit the site to all search engines and connect Google Search Console. After this prompt, Googlebot and Bingbot know the site exists and can begin indexing.

```
You are building BAAM System R — Restaurant Premium.
The site is now live at https://{client-domain}.com.

Complete all search engine submission steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — GOOGLE SEARCH CONSOLE (GSC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to: https://search.google.com/search-console
   Add property → Domain property (covers all subdomains + http/https)
   Domain: {client-domain}.com

2. Verify domain ownership:
   Method: DNS TXT record (most reliable for Vercel)
   Add TXT record to DNS:
     Type: TXT
     Name: @ (or root domain)
     Value: google-site-verification={code-from-GSC}
   Wait for DNS propagation → click Verify in GSC

3. Submit sitemap:
   GSC → Sitemaps → Add new sitemap
   Submit: https://{client-domain}.com/sitemap.xml
   If using sitemap index: submit the index URL
   Status should show "Success" within 24–48 hours

4. Request indexing for priority pages:
   GSC → URL Inspection tool
   Submit these URLs for manual indexing:
     https://{client-domain}.com/en
     https://{client-domain}.com/en/menu
     https://{client-domain}.com/en/menu/dinner
     https://{client-domain}.com/en/about
     https://{client-domain}.com/en/reservations
     https://{client-domain}.com/en/contact
   For each: URL Inspection → Request Indexing button

5. Verify coverage (wait 24 hours after sitemap submission):
   GSC → Pages → check for crawl errors
   Expected: all submitted URLs show as "Discovered" or "Indexed"
   Red flags to watch: "Crawled - currently not indexed",
     "Duplicate without canonical", "Blocked by robots.txt"

6. Configure GSC email alerts:
   Settings → Email preferences → enable alerts for:
     Manual actions (critical)
     Security issues (critical)
     Coverage issues (weekly digest)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — BING WEBMASTER TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to: https://www.bing.com/webmasters
   Add site: https://{client-domain}.com

2. Verify: same DNS TXT method, or import from GSC
   (Bing allows "Import from Google Search Console" — fastest method)

3. Submit sitemap:
   Bing Webmaster → Sitemaps → Submit sitemap
   URL: https://{client-domain}.com/sitemap.xml

4. Verify IndexNow is working with Bing:
   Publish a new blog post or event in admin
   → Check Bing Webmaster Tools → URL submission log
   → Should show the URL submitted via IndexNow within minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — GOOGLE BUSINESS PROFILE (GMB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTE: GMB requires the restaurant to already have a Google Business
listing. If none exists, create one at business.google.com.
If one exists: connect and verify it.

1. Claim / verify Google Business Profile:
   Go to: https://business.google.com
   Search for the restaurant → Claim or Create listing

2. Complete the GMB profile:
   Business name: exact match to site h1 heading
   Category: Restaurant → then specific (Contemporary American Restaurant)
   Address: exact match to schema.org address
   Phone: exact match to site phone
   Website: https://{client-domain}.com/en
   Hours: exact match to site hours
   Description: 750 chars max — use About page first paragraph
   Photos:
     Logo: upload client logo
     Cover: upload best food hero photo (same as site hero)
     Interior: 3–5 interior photos
     Food: 5–8 food photos

3. Products (for restaurants: use Menu feature if available):
   GMB → Menu → Add items
   Add 5–10 signature dishes with photos and prices
   These can appear in Google Search results

4. Posts:
   Publish a Google Business post:
   "Now accepting reservations. [link to /en/reservations]"
   This improves GMB ranking signal immediately.

5. Connect website in GMB:
   Website URL: https://{client-domain}.com/en
   GMB will crawl this and import structured data from Restaurant schema.org

6. Verify the GMB → website connection:
   Search Google for "{Restaurant Name} {City}" → look for Knowledge Panel
   Knowledge Panel should show: hours, address, phone, website link
   If not appearing yet: normal — allow 1–4 weeks for Google to index

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — INDEXNOW ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify IndexNow is working end-to-end:

1. Publish a new blog post in admin (use "IndexNow Test Post" as title)
   → admin save triggers IndexNow submission

2. Check server logs (Vercel Function Logs):
   Should see: "IndexNow submitted: [URL]"
   No errors in the submission

3. Check Bing Webmaster Tools → URL submission log:
   Should show the new blog post URL within 5–15 minutes

4. Delete the test blog post (unpublish it)
   (Google + Bing will naturally discover the removal)

5. Verify IndexNow key file:
   GET https://{client-domain}.com/{indexnow-key}.txt
   Returns: the API key string (200 OK)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — BASELINE TRACKING SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the client has / wants Google Analytics:

1. Create GA4 property in Google Analytics:
   analytics.google.com → Admin → Create Property
   Property name: {Client Name} Restaurant Website
   Industry: Food & Drink → Restaurant

2. Add GA4 to site:
   In layout.tsx, add Next.js Script:
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
     strategy="afterInteractive"
   />
   Add GA4_ID to Vercel env vars: NEXT_PUBLIC_GA4_ID = G-XXXXXXXXXX

3. Connect GA4 to GSC:
   GSC → Settings → Associations → Link Google Analytics
   This enables combined reporting

4. Configure GA4 conversion events:
   GA4 → Configure → Events → Mark as conversion:
     form_submit (contact form)
     reservation_confirmed (custom reservation form completion)
     newsletter_signup
   These will show as conversion events in reports.

VERIFY:
- GSC property created, domain verified
- Sitemap submitted in GSC and shows "Success"
- 6 priority pages submitted for manual indexing in GSC
- Bing property created, sitemap submitted
- IndexNow key file accessible at production URL
- Test blog post publish → IndexNow fires → Bing log shows URL
- GMB profile claimed/created, hours + website + photos added
- GMB post published with reservation link
- GA4 tracking active (if requested): real-time report shows visit
- GSC email alerts configured for manual actions + security issues
```

### Done-Gate 4D

- [ ] Google Search Console: domain property created and verified
- [ ] Sitemap submitted in GSC, status shows "Success"
- [ ] 6 priority pages submitted for manual indexing
- [ ] Bing Webmaster Tools: property created, sitemap submitted
- [ ] IndexNow key file accessible: `GET /{key}.txt` returns key string
- [ ] IndexNow test: publish post → fires → URL appears in Bing submission log
- [ ] Google Business Profile: claimed/verified, hours + website + 8+ photos
- [ ] GMB post published with reservation link
- [ ] GSC email alerts configured for critical issues
- [ ] `git commit: "feat: phase-4D — GSC, Bing, GMB, IndexNow all confirmed"`

---

## Prompt 4E — Pipeline B Readiness: Test Run

**Goal:** Before declaring the system production-ready, verify Pipeline B can onboard a second client from scratch without any manual file editing. Run the full pipeline with a test intake JSON and confirm the output is clean, unique, and contamination-free.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CLIENT_ONBOARDING_MASTER_PLAN.md
Reference: @RESTAURANT_COMPLETE_PLAN.md Sections 17–23 (Pipeline B)

Verify Pipeline B is fully operational before signing off on Phase 4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — PIPELINE B PREREQUISITES CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify all Pipeline B components exist and are wired:

[ ] scripts/onboard/pipeline.mjs — main pipeline runner
[ ] scripts/onboard/o1-clone.mjs — clone step
[ ] scripts/onboard/o2-brand.mjs — brand variant step
[ ] scripts/onboard/o3-prune.mjs — menu pruning step
[ ] scripts/onboard/o4-replace.mjs — string replacement step
[ ] scripts/onboard/o5-ai-content.mjs — AI generation step
[ ] scripts/onboard/o6-cleanup.mjs — locale cleanup step
[ ] scripts/onboard/o7-verify.mjs — contamination verification step
[ ] scripts/onboard/brand-variants-restaurant.json — 4 variants
[ ] scripts/onboard/prompts/restaurant/content.md — AI content prompt
[ ] scripts/onboard/prompts/restaurant/seo.md — AI SEO prompt
[ ] app/admin/onboarding/page.tsx — Admin UI wizard

If any are missing: build them from specs in
RESTAURANT_CLIENT_ONBOARDING_MASTER_PLAN.md before proceeding.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — PREPARE TEST INTAKE JSON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create: scripts/onboard/test-intake-restaurant.json

Use a fictional test client — different in every way from The Meridian:

{
  "clientId": "test-pipeline-b-01",
  "templateSiteId": "the-meridian",
  "industry": "restaurant",
  "business": {
    "name": "Café Soleil",
    "ownerName": "Chef Maria Santos",
    "ownerTitle": "Executive Chef & Co-Owner",
    "chefCredentials": ["Le Cordon Bleu", "Former Nobu"],
    "cuisineType": "French-Mediterranean",
    "subType": "cafe-brunch",
    "foundedYear": 2022,
    "teamMembers": [
      {
        "slug": "chef-maria-santos",
        "name": "Chef Maria Santos",
        "role": "Executive Chef & Co-Owner",
        "credentials": ["Le Cordon Bleu", "Former Nobu"]
      }
    ]
  },
  "location": {
    "address": "88 Sunrise Avenue",
    "city": "Portland",
    "state": "OR",
    "zip": "97201",
    "phone": "(503) 555-0188",
    "email": "hello@cafesoleil.com",
    "lat": 45.5231,
    "lng": -122.6765
  },
  "hours": {
    "monday": { "open": "07:00", "close": "15:00" },
    "tuesday": { "open": "07:00", "close": "15:00" },
    "wednesday": { "open": "07:00", "close": "15:00" },
    "thursday": { "open": "07:00", "close": "15:00" },
    "friday": { "open": "07:00", "close": "16:00" },
    "saturday": { "open": "08:00", "close": "16:00" },
    "sunday": { "open": "08:00", "close": "15:00" }
  },
  "social": {
    "instagram": "@cafesoleilpdx",
    "facebook": "facebook.com/cafesoleilpdx",
    "yelp": "yelp.com/biz/cafe-soleil-portland"
  },
  "reservations": {
    "provider": "custom",
    "resyVenueId": null
  },
  "menu": {
    "enabled": ["breakfast", "brunch", "drinks"],
    "reservationRequired": false
  },
  "brand": {
    "variant": "matin-clair",
    "primaryColor": null
  },
  "locales": {
    "default": "en",
    "supported": ["en", "es"]
  },
  "features": {
    "online_reservation": true,
    "reservation_provider": "custom",
    "private_dining": false,
    "events_section": false,
    "press_section": false,
    "blog": false,
    "gallery": true,
    "gift_cards": false,
    "seasonal_menu": false,
    "wine_list": false,
    "cocktail_menu": false,
    "allergen_display": true
  },
  "domains": {
    "production": "cafesoleil.com",
    "dev": "cafe-soleil.local"
  },
  "contentTone": {
    "voice": "warm, approachable, community-oriented",
    "uniqueSellingPoints": [
      "Organic ingredients sourced from local Pacific Northwest farms",
      "All-day brunch served until 3pm every day",
      "Dog-friendly patio"
    ],
    "targetDemographic": "Portland locals, remote workers, brunch enthusiasts, families"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — RUN CLI PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node scripts/onboard-client.mjs test-pipeline-b-01

Expected console output (measure actual durations):
  [O1] Cloning the-meridian → test-pipeline-b-01...
  [O1] Cloned 142 content entries in 5.2s ✅
  [O2] Applying brand variant: matin-clair...
  [O2] Brand applied in 0.8s ✅
  [O3] Pruning disabled menu types...
  [O3] Disabled: dinner, tasting-menu, cocktails, wine, seasonal, kids, desserts
  [O3] Enabled: breakfast, brunch, drinks
  [O3] Removed 35 content entries across 5 file types in 3.1s ✅
  [O4] Applying 18 replacement pairs (longest-first)...
  [O4] Deep replaced 142 entries in 4.8s ✅
  [O5] Generating AI content (Claude API)...
  [O5] Content call: 14.2s | tokens: 1,847 ✅
  [O5] SEO call: 8.1s | tokens: 943 ✅
  [O5] AI content applied in 22.3s ✅
  [O6] Cleaning up unsupported locales...
  [O6] Removed ZH entries (zh not in supported locales) in 0.3s ✅
  [O7] Running verification...
  [O7] Required paths: 9/9 ✅
  [O7] Contamination scan: 0 violations ✅
  [O7] Menu types: breakfast(8 items), brunch(12 items), drinks(10 items) ✅
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Pipeline B complete: test-pipeline-b-01
  Duration: 36.5s (with AI) | Cost: ~$0.13
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If any step fails: fix the pipeline script for that step.
Rerun from O1. Never patch database manually to work around bugs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — VERIFY OUTPUT QUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to /etc/hosts: 127.0.0.1 cafe-soleil.local
Set: NEXT_PUBLIC_DEFAULT_SITE=test-pipeline-b-01
npm run dev → test at cafe-soleil.local:3060

VISUAL CHECKS:
  [ ] Homepage: site name is "Café Soleil" (not "The Meridian")
  [ ] Theme: Sage + Tangerine (matin-clair), NOT dark/gold
  [ ] Font: Nunito displayed (not Cormorant Garamond)
  [ ] Nav: breakfast/brunch/drinks only (dinner/cocktails/wine gone)
  [ ] Nav: Events, Press, Gift Cards links hidden (feature flags)
  [ ] Hero headline: AI-generated, mentions Portland or organic or brunch
    (not "The Meridian" or "New York" or "Contemporary American")
  [ ] About: Chef Maria Santos name + credentials
  [ ] Hours: shows Mon–Sun 7:00 AM format (not 5:30 PM dinner hours)
  [ ] Footer: address is Portland, OR 97201
  [ ] Footer: @cafesoleilpdx Instagram handle
  [ ] Contact: phone (503) 555-0188

CONTENT QUALITY CHECKS (AI-generated):
  [ ] Hero tagline: 6–8 words, not generic, mentions specific USP
  [ ] About story: 3 paragraphs, mentions Portland + local sourcing
  [ ] Chef bio: mentions Le Cordon Bleu + Nobu credentials
  [ ] Testimonials: 5 reviews, variety of occasions, feel authentic
  [ ] SEO titles: include "Café Soleil" + "Portland"
  [ ] SEO descriptions: 150–160 chars, include call to action

CONTAMINATION CHECKS:
  [ ] No "The Meridian" anywhere on the site
  [ ] No "Marcus Webb" anywhere
  [ ] No "New York" anywhere
  [ ] No "(212) 555-0100" anywhere
  [ ] No "themeridian.com" anywhere
  [ ] Run: node scripts/onboard/verify.ts test-pipeline-b-01
      Expected: exits 0 with "All clear"

PRUNING CHECKS:
  [ ] /en/menu does NOT show Dinner, Cocktails, Wine cards
  [ ] /en/menu DOES show Breakfast, Brunch, Drinks cards
  [ ] Navigation dropdown: shows Breakfast, Brunch, Drinks only
  [ ] Footer: shows Breakfast, Brunch, Drinks links only
  [ ] /en/events → returns 404 (events_section = false)
  [ ] /en/reservations/private-dining → returns 404 (private_dining = false)
  [ ] Language switcher: shows EN | ES only (no ZH option)

LOCALE CHECKS:
  [ ] /es/menu: Spanish content visible
  [ ] /zh/menu → 404 or redirect to /en (zh not supported for this client)
  [ ] Footer: no Chinese content anywhere in output

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — ADMIN UI PIPELINE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test the admin wizard interface (not just CLI):

1. Delete the test-pipeline-b-01 site created in Step 3:
   DELETE FROM content_entries WHERE site_id = 'test-pipeline-b-01'
   DELETE FROM menu_categories WHERE site_id = 'test-pipeline-b-01'
   DELETE FROM menu_items WHERE site_id = 'test-pipeline-b-01'
   ... etc. Clean slate.

2. Navigate to: http://meridian.local:3060/admin/onboarding

3. Wizard step 1 — Client Info:
   Fill in form with the same test intake data
   Upload intake.json (or fill manually if form-based)

4. Wizard step 2 — Review:
   Confirm settings shown are correct

5. Wizard step 3 — Run Pipeline:
   Click "Create Site"
   → SSE progress streaming visible in browser:
     ▶ Cloning...      ████░░░░░░ 20%
     ▶ Brand...        ████████░░ 40%
     ▶ Pruning...      ████████░░ 60%
     ▶ Replacing...    ████████░░ 80%
     ▶ AI Content...   ██████████ 95%
     ▶ Cleanup...      ██████████ 98%
     ▶ Verifying...    ██████████ 100%
   ✅ Site created successfully!
   Onboarding time: [X] seconds

6. Success screen shows:
   - Site ID: test-pipeline-b-01
   - Admin URL: /admin (switch to this site)
   - Frontend URL: cafe-soleil.local
   - Download intake JSON (for records)

7. Verify output: same checks as Step 4 above

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — PERFORMANCE BENCHMARKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Record actual timings from the pipeline run:

| Step | Target | Actual | Pass? |
|---|---|---|---|
| O1 Clone | < 10s | ___ | |
| O2 Brand | < 2s | ___ | |
| O3 Prune | < 5s | ___ | |
| O4 Replace | < 8s | ___ | |
| O5 AI Content | < 30s | ___ | |
| O6 Cleanup | < 2s | ___ | |
| O7 Verify | < 2s | ___ | |
| Total (with AI) | < 60s | ___ | |
| Total (skip AI) | < 20s | ___ | |

Estimated API cost: $___ (target ~$0.13)

DELIVER: PIPELINE_B_TEST_REPORT.md
  Includes: timing table, quality verification checklist results,
  contamination scan output, any issues found and fixed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After test verification is complete:
  Delete test site data:
    DELETE FROM content_entries WHERE site_id = 'test-pipeline-b-01'
    DELETE FROM menu_categories WHERE site_id = 'test-pipeline-b-01'
    DELETE FROM menu_items WHERE site_id = 'test-pipeline-b-01'
    DELETE FROM team_members WHERE site_id = 'test-pipeline-b-01'
    DELETE FROM gallery_items WHERE site_id = 'test-pipeline-b-01'
    DELETE FROM press_items WHERE site_id = 'test-pipeline-b-01'

  Remove from _sites.json
  Remove from /etc/hosts

  Template site (the-meridian) is untouched throughout.
  Real client site ({client-id}) is untouched throughout.

VERIFY:
- CLI pipeline completes in < 60s with AI
- AI-generated hero tagline is unique and relevant (not template)
- Contamination scan exits 0
- Pruned menu types not visible anywhere (nav, hub, footer)
- Disabled feature pages return 404
- Admin UI wizard: SSE progress streaming works in browser
- Admin UI wizard: site created successfully without console errors
- Benchmark table completed with actual timings
```

### Done-Gate 4E

- [ ] All 7 pipeline scripts exist and are functional
- [ ] CLI pipeline: runs end-to-end in < 60 seconds with AI
- [ ] CLI pipeline: total cost logged ~$0.13
- [ ] Visual check: Café Soleil theme (matin-clair), Portland content
- [ ] AI content: hero tagline unique, about story mentions Portland
- [ ] Contamination scan: `verify.ts` exits 0 ("All clear")
- [ ] Pruning: disabled menu types absent from nav + hub + footer
- [ ] Feature flags: events/private-dining/press all return 404
- [ ] Locale cleanup: ZH entries absent from Café Soleil output
- [ ] Admin UI wizard: SSE progress streaming visible in browser
- [ ] Admin UI wizard: completes successfully, success screen shown
- [ ] Pipeline B timing table completed in `PIPELINE_B_TEST_REPORT.md`
- [ ] Test site data cleaned up, template untouched
- [ ] `git commit: "feat: phase-4E — Pipeline B test run PASS, < 60s, contamination clean"`

---

## Phase 4 Completion Gate

All items below must pass before the production launch is declared complete.

| Requirement | Pass? |
|---|---|
| `QA_REPORT_PRE_LAUNCH.md`: zero P0, zero P1 defects | |
| Admin: all 10 tasks complete, brand variant switch verified | |
| Submission tables: view + status + CSV export working | |
| No placeholder text on any page | |
| Prices formatted correctly throughout | |
| ZH/ES content rendering on multilingual pages | |
| All 5 form submissions: DB row + email confirmed | |
| `npm run qa:all` — all 5 scripts pass | |
| Template backup committed: `v0.3-template-snapshot` | |
| First client: contamination scan exits 0 | |
| First client: all disabled menu types absent from nav + pages | |
| First client: AI content unique, no Meridian strings | |
| Vercel: production build successful | |
| `https://{client-domain}.com` live with padlock | |
| `http://` → `https://` redirect working | |
| Production form: confirmation email from production domain | |
| Admin working on production URL | |
| GSC: domain verified, sitemap submitted | |
| Bing Webmaster: property created, sitemap submitted | |
| IndexNow: key file accessible, fires on publish | |
| GMB: profile claimed, hours + website + photos complete | |
| Pipeline B CLI: < 60s, contamination clean | |
| Pipeline B Admin UI: SSE progress streaming works | |
| `PIPELINE_B_TEST_REPORT.md` delivered | |
| `npm run build` — zero errors on final main branch | |
| **Git tagged:** `v1.0-production` | |

**Phase 4 complete → System R is live in production.**
**Pipeline B operational → Proceed to `RESTAURANT_PHASE_5.md` for growth.**

---

*BAAM System R — Restaurant Premium*
*Phase 4 of 5 — QA + Content Swap + Production Launch*
*Next: RESTAURANT_PHASE_5.md — Growth Plan + Pipeline B at Scale*
