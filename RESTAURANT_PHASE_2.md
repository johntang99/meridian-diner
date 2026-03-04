# BAAM System R — Restaurant Premium
# Phase 2: Conversion + Content Pages + Admin Editors

> **System:** BAAM System R — Restaurant Premium
> **Reference files:** `@RESTAURANT_PHASE_2.md` + `@a6_content_contracts.md` + `@RESTAURANT_CONTENT_CONTRACTS.md`
> **Prerequisite:** Phase 1 completion gate fully passed. `v0.1-core-pages` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every page before moving on.
> **Rule:** Collection editors must be built alongside every page — never deferred to Phase 3.

---

## Phase 2 Overview

**Duration:** Week 3
**Goal:** Build all remaining frontend pages (Events, Gallery, Blog, Private Dining, Press, FAQ, Gift Cards, Careers, 404) plus every collection admin editor. Every collection must be fully manageable from the admin — create, edit, duplicate, delete, reorder — without any code changes.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 2A | Events — Listing + Detail | Events page + individual event detail | 60 min |
| 2B | Gallery — Masonry + Lightbox | Full gallery with filter + lightbox | 90 min |
| 2C | Blog — Hub + Article Template | Blog listing + individual article | 60 min |
| 2D | Private Dining Inquiry Page | Private dining + inquiry form | 45 min |
| 2E | Press + Awards Page | Press mentions + award display | 30 min |
| 2F | FAQ Page + All Remaining Forms | FAQ accordion + newsletter + general forms | 45 min |
| 2G | Gift Cards + Careers + 404 | Utility pages | 45 min |
| 2H | Collection Admin Editors | Admin CRUD for all 6 collections | 90 min |
| 2I | Admin Certification — Collection Roundtrip | Verify all collections pass CRUD + sync | 45 min |
| 2J | Responsive Polish Pass | Fix all mobile/tablet issues across site | 60 min |

---

## Prompt 2A — Events: Listing + Detail Pages

**Goal:** Build the Events listing page and dynamic event detail pages. Events are DB-driven from the `events` table. Upcoming vs past events clearly separated. Each event has a detail page with booking CTA.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — events-grid, events-preview sections
Reference: @a6_content_contracts.md — Event interface
Content path: 'pages/events'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Events Listing  /[locale]/events
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/events/page.tsx

Data loading:
  Upcoming: SELECT * FROM events WHERE site_id = siteId
    AND published = true AND start_datetime >= NOW()
    ORDER BY start_datetime ASC

  Past (last 6 months): SELECT * FROM events WHERE site_id = siteId
    AND published = true AND start_datetime < NOW()
    AND start_datetime >= NOW() - INTERVAL '6 months'
    ORDER BY start_datetime DESC LIMIT 6

SECTION 1 — Page Hero (compact, 40vh):
  Headline: "Events" / "活动" / "Eventos"
  Subline from content.events.hero_subline[locale]:
  "Wine dinners, chef's tables, live music, and seasonal celebrations."

SECTION 2 — Upcoming Events Grid (EventsGrid component):

  File: components/sections/EventsGrid.tsx
  Variants: cards (default) | list

  cards variant:
    - 3-column grid desktop, 2 tablet, 1 mobile
    - Each EventCard:

      File: components/events/EventCard.tsx

      Layout:
        Image block (if event.image):
          aspect-ratio: 16/9, object-fit: cover
          var(--card-radius) top corners only
        Date badge (absolute, image top-left):
          Day number: var(--size-h2), var(--font-heading), var(--color-primary)
          Month: var(--size-small), var(--font-ui), uppercase, var(--tracking-label)
          Background: var(--color-backdrop-card), small padding, var(--badge-radius)
        Content block below image:
          Event type badge: pill, var(--color-backdrop-surface),
            var(--badge-radius), var(--size-small), var(--tracking-label)
          Title: var(--font-heading), var(--size-h4)
          Short description: 2-line clamp, var(--color-text-secondary)
          Price line (if event.price_per_person):
            "From $195 per person" — var(--color-primary), var(--font-ui)
            If free: "Complimentary" / "免费" / "Gratis"
          Time: start_datetime formatted per locale
            EN: "Saturday, December 15 · 7:00 PM"
            ZH: "12月15日 周六 · 19:00"
            ES: "Sábado, 15 de diciembre · 19:00"
          Reservation badge (if event.reservation_required):
            "Reservation Required" / "需要预订" — amber, var(--badge-radius)
          CTA: "Learn More & Reserve" → /events/{slug}

      Hover: translateY(var(--hover-lift)), var(--card-shadow-hover)
      Card background: var(--color-backdrop-card)
      Border-radius: var(--card-radius)

  Empty state (no upcoming events):
    "No upcoming events at this time. Check back soon — we have
    something in the works."
    CTA: "Sign Up for Updates" → newsletter form

SECTION 3 — Past Events (collapsed by default):
  Toggle button: "View Past Events ({N})" / "查看过往活动"
  On click: expands PastEventsGrid (same card layout, greyscale filter
  on images, "Past Event" badge overlaid)
  Max 6 past events shown

SECTION 4 — Private Events CTA (if features.private_dining = true):
  Contained banner: "Hosting a Private Event?"
  "From intimate dinners for 10 to celebrations for 60 — our private
  dining team handles every detail."
  CTA: "Enquire About Private Events" → /reservations/private-dining

PAGE SEO:
  title: "Events | The Meridian — New York"
  description: from seo.json pages.events[locale]
  schema.org: EventList — array of all upcoming events

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Event Detail  /[locale]/events/[slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/events/[slug]/page.tsx

Data loading:
  SELECT * FROM events WHERE slug = [slug] AND site_id = siteId
  If not found → 404
  generateStaticParams for all published events

SECTION 1 — EventDetailHero:
  Large hero with event image (full-width, 55vh)
  Overlay gradient bottom-to-top (transparent → var(--color-backdrop))
  Title overlaid at bottom of image
  Event type badge above title

SECTION 2 — Event Info + Description:
  Two-column layout (desktop):
  Left (65%): Full event description (event.description[locale])
    Rich text or structured content
  Right (35%): Info card (sticky on desktop)
    Date: formatted, prominent
    Time: start – end time
    Location: restaurant name + address
    Price: "From $X per person" or "Complimentary"
    Capacity note (if event.capacity): "Limited to {N} guests"
    Reservation status (if event.reservation_required):
      CTA button: "Reserve Your Spot" → reservation link or /reservations
      (if event.reservation_link: use that URL)
      (else: link to /reservations with event note pre-filled)
    If event.cancelled: show "This event has been cancelled" alert,
      hide CTA, show "View Upcoming Events" link

SECTION 3 — Related Events:
  "You Might Also Enjoy"
  3 EventCards (same event_type, or next 3 upcoming)
  Query: other upcoming events, exclude current, limit 3

SECTION 4 — ReservationsCTA (if reservation_required):
  "Ready to join us?"
  Link to reservations

PAGE SEO per event:
  title: "{event.title[locale]} | The Meridian"
  description: event.short_description[locale] (or first 160 chars of description)
  og:image: event.image
  canonical: /[locale]/events/{slug}

  schema.org Event:
  {
    "@type": "Event",
    "name": event.title.en,
    "startDate": event.start_datetime,
    "endDate": event.end_datetime,
    "location": { "@type": "Place", "name": "The Meridian",
      "address": { "@type": "PostalAddress", ... } },
    "description": event.description.en,
    "image": event.image,
    "offers": {
      "@type": "Offer",
      "price": event.price_per_person / 100,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }

ADMIN WIRING:
  Events are edited via Events Collection Editor (Prompt 2H).
  Content path: events page hero + subline editable in Content Editor.
  Event items themselves: Events Collection Editor only.

VERIFY:
- /en/events loads upcoming events from DB (sorted by date)
- EventCard: date badge, event type badge, price, reservation badge visible
- Past events: hidden by default, expand on toggle
- /en/events/burgundy-wine-dinner loads from DB
- Event detail: info card sticky on desktop, CTA correct
- Cancelled event: shows cancelled alert, no reservation CTA
- Related events: shows 3 other upcoming events
- Event schema.org validates in Rich Results Test
- /events/nonexistent → 404
- All 3 locales render correctly (date formats differ)
```

### Done-Gate 2A

- [ ] Events listing: upcoming events grid with date badges
- [ ] Empty state renders when no upcoming events
- [ ] Past events: hidden by default, toggle reveals them with greyscale
- [ ] Private events CTA visible (feature flag enabled)
- [ ] Event detail: image hero, info card sticky on desktop
- [ ] Cancelled event shows alert + no reservation CTA
- [ ] Related events: 3 upcoming events shown
- [ ] Event schema.org validates for at least one event
- [ ] `/events/nonexistent` → returns 404
- [ ] Date formats correct per locale (EN 12-hour, ZH/ES 24-hour)
- [ ] `git commit: "feat: phase-2A — events listing, event detail, EventCard, schema.org"`

---

## Prompt 2B — Gallery: Masonry Grid + Lightbox

**Goal:** Build the full gallery with category filtering and a premium lightbox experience. Images load from `gallery_items` DB table. The lightbox must work cleanly on mobile with swipe support.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — gallery-grid section
Reference: @a6_content_contracts.md — GalleryItem interface
Content path: 'pages/gallery'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Gallery  /[locale]/gallery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/gallery/page.tsx

Data loading:
  SELECT * FROM gallery_items WHERE site_id = siteId
  ORDER BY display_order ASC
  Client-side filtering by category (no page reload)

SECTION 1 — Page Hero (compact):
  Headline: "Gallery" / "图库" / "Galería"
  Subline from content: "A look inside The Meridian."

SECTION 2 — CategoryFilterBar:

  File: components/gallery/GalleryCategoryFilter.tsx

  Pill-style filter buttons:
    All | Food | Interior | Team | Events
    (only show categories that have at least 1 item)
  Active pill: var(--color-primary) bg, var(--color-text-inverse) text,
    var(--btn-radius)
  Inactive: var(--color-backdrop-surface) bg, var(--color-text-secondary)
  Hover: var(--color-primary-100) bg
  Transition: var(--duration-fast)
  Count badge on each: "(12)" in var(--color-text-muted)

  On click: filter gallery items client-side
  Animate out filtered items: opacity 0, scale 0.95 over 150ms
  Animate in matching items: opacity 1, scale 1 over 200ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT: GalleryMasonry (HIGH EFFORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/gallery/GalleryMasonry.tsx

Layout: CSS columns masonry (not JS-based — use CSS column-count)
  Desktop: 3 columns
  Tablet: 2 columns
  Mobile: 2 columns (tight gap)
  column-gap: var(--grid-gap)

Each GalleryTile:
  File: components/gallery/GalleryTile.tsx

  Container:
    break-inside: avoid
    margin-bottom: var(--grid-gap)
    overflow: hidden
    border-radius: var(--card-radius)
    cursor: pointer

  Image:
    next/image with width + height from gallery_item metadata
    (width/height set at seed time so correct aspect ratios load)
    If width/height not set: use aspectRatio style based on category
      food → 4/3, interior → 16/9, team → 3/4, events → 16/9
    loading: lazy (all except first 6: eager)
    objectFit: cover

  Hover overlay:
    Background: rgba(0,0,0,0.5)
    Opacity: 0 → 1 on hover, var(--duration-base) transition
    Content: caption text (if item.caption[locale] set) centered
      Caption: var(--font-body), var(--size-small), white
      Expand icon: bottom-right, white

  Click → opens Lightbox at this item index

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT: Lightbox (HIGH EFFORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/gallery/Lightbox.tsx

DO NOT use an external lightbox library. Build it.

State: { isOpen, currentIndex, items }
Managed via: React context (LightboxContext) or parent state

Overlay:
  Position: fixed, inset 0, z-index 100
  Background: rgba(0,0,0,0.95)
  Prevent body scroll when open (add overflow: hidden to body)

Layout:
  Close button: top-right, ✕ icon, white, 44×44px touch target
  Left arrow: absolute left 1rem, centered vertically, 44×44px
  Right arrow: absolute right 1rem, centered vertically, 44×44px
  Image: max-width: min(90vw, 1200px), max-height: 85vh
    object-fit: contain (never crop in lightbox)
    Animate in: opacity 0 → 1 over 200ms
  Caption: below image, var(--font-body), var(--size-small),
    var(--color-text-secondary), centered, max-width 600px
  Counter: "3 / 26" top-center, var(--color-text-muted)

Navigation:
  Click left/right arrows → prev/next item (looping)
  Keyboard: ArrowLeft, ArrowRight, Escape (close)
  Touch: swipe left/right to navigate (touchstart + touchend,
    threshold: 50px horizontal delta)
  On arrow click: image fades out 100ms → new image fades in 200ms

Close:
  Click ✕ button → close
  Click overlay outside image → close
  Keyboard Escape → close

SECTION 3 — GalleryMasonry (full filtered item set):
  Initially shows all 26 items
  On filter change: animates out non-matching, keeps matching

SECTION 4 — Private Dining CTA (if features.private_dining):
  "Photography by our team. Available for private events."
  CTA: "Book a Private Event" → /reservations/private-dining

PAGE SEO:
  title: "Gallery | The Meridian — New York"
  og:image: first featured gallery item

ADMIN WIRING:
  Gallery items managed via Gallery Collection Editor (Prompt 2H).
  Page hero text editable in Content Editor.

VERIFY:
- /en/gallery loads all 26 items in masonry layout
- Masonry: items flow naturally into 3 columns, no awkward gaps
- Category filter: "Food" → shows 12 items, others hidden
- Category filter animation: smooth opacity/scale transition
- Click any tile → lightbox opens at that index
- Lightbox: keyboard navigation (arrows + escape) works
- Lightbox: touch swipe works on mobile (test in DevTools)
- Lightbox: overlay click closes it
- Lightbox: body scroll disabled when open
- Caption renders in correct locale if set
- "All" filter → all items visible
- Mobile: 2-column masonry, tiles not too small
- Next/image: all images have correct alt text (from gallery_item.alt[locale])
```

### Done-Gate 2B

- [ ] Masonry layout: 3 columns desktop, 2 columns mobile, no broken layout
- [ ] Category filter: correct items shown per category, counts visible
- [ ] Filter animation: smooth opacity/scale transition
- [ ] Lightbox: opens at clicked index, shows correct image
- [ ] Lightbox: left/right arrows navigate (looping)
- [ ] Lightbox: keyboard arrows + Escape work
- [ ] Lightbox: swipe left/right on mobile (tested in DevTools)
- [ ] Lightbox: click outside image → closes
- [ ] Lightbox: body scroll locked when open
- [ ] All images have locale-correct alt text
- [ ] `git commit: "feat: phase-2B — gallery masonry, GalleryTile, Lightbox (no external lib)"`

---

## Prompt 2C — Blog: Hub + Article Template

**Goal:** Build the blog hub page and the dynamic article template. Blog is a key SEO asset — articles must have clean typography, schema.org, and social sharing. The Blog Posts Editor (separate from Content Editor) manages all posts.

```
You are building BAAM System R — Restaurant Premium.
Reference: @a6_content_contracts.md — BlogPost interface
Content path: 'pages/blog'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Blog Hub  /[locale]/blog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/blog/page.tsx

Data loading:
  SELECT * FROM blog_posts WHERE site_id = siteId
    AND published = true
    ORDER BY published_at DESC

SECTION 1 — Page Hero (compact):
  Headline: "From the Kitchen" / "来自厨房" / "Desde la Cocina"
  Subline from content: "Stories, recipes, and perspectives
  from Chef Marcus Webb and the team at The Meridian."

SECTION 2 — Featured Post (FeaturedBlogPost component):

  File: components/blog/FeaturedBlogPost.tsx

  First published post with featured = true (or most recent if none)
  Layout: full-width card, 2-column

  Left (50%):
    Image: aspect-ratio 16/9 or 3/2, object-fit: cover
    var(--card-radius) on left corners only

  Right (50%): content with padding
    Category badge: pill, var(--color-primary-50) bg, var(--badge-radius)
    Date: var(--font-ui), var(--size-small), var(--color-text-muted)
    Title: var(--size-h2), var(--font-heading), var(--tracking-heading)
    Excerpt: 3-line clamp, var(--color-text-secondary)
    Author: small photo (32px circle) + name, var(--size-small)
    "Read More →" link: var(--color-primary)

  Mobile: stacks image top, content below

SECTION 3 — BlogGrid (remaining posts):

  File: components/blog/BlogGrid.tsx

  3-column grid (1 mobile, 2 tablet)
  Each BlogCard (reuse/restyle from Phase 1H):
    Image: aspect-ratio 16/9
    Category badge, date, title, excerpt (2-line clamp),
    author name, "Read →" link
  Pagination: load more button (not page-based)
    "Load More Articles" → client-side fetch next 6 posts

SECTION 4 — CategoryFilter (above BlogGrid):
  Pills: All | Chef's Perspective | Seasonal Guide | Wine & Spirits
         | Events | Behind the Scenes | Kitchen Stories | Sourcing
  Client-side filter — same pattern as gallery
  Only shows categories with at least 1 published post

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Blog Article  /[locale]/blog/[slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/blog/[slug]/page.tsx

Data loading:
  SELECT * FROM blog_posts WHERE slug = [slug]
    AND site_id = siteId AND published = true
  If not found → 404
  generateStaticParams for all published posts
  ISR: revalidate every 3600 seconds

SECTION 1 — ArticleHero:
  Featured image full-width (50vh)
  Category badge above title (overlaid at bottom)
  Title large, var(--font-heading)

SECTION 2 — ArticleHeader (below hero):
  Author: photo (40px circle) + name + role
  Date published: "December 10, 2025" / "2025年12月10日"
  Read time: estimated "5 min read" (calculate from body word count)
  Social sharing: Twitter/X, Facebook, copy link
    (Share via Web Share API on mobile, fallback to custom share)

SECTION 3 — ArticleBody:
  Max-width: 720px, centered
  Typography:
    Paragraphs: var(--font-body), var(--size-body), line-height 1.8
    H2: var(--font-heading), var(--size-h3), var(--tracking-heading),
      margin: 2.5rem 0 1rem
    H3: var(--font-heading), var(--size-h4), margin: 2rem 0 0.75rem
    Blockquote: border-left 3px var(--color-primary),
      padding-left: 1.5rem, italic, var(--color-text-secondary)
    Images: full-width within column, var(--card-radius),
      caption below in var(--size-small), var(--color-text-muted), italic
    Lists: comfortable line-height, var(--color-text-secondary)
    Links: var(--color-primary), underline on hover
  Content source: post.body[locale] — render as HTML
    (body stored as HTML string from rich text editor)

SECTION 4 — AuthorBio block:
  Below article body
  Large author photo (80px circle)
  Author name + role
  Short bio (from team_members where slug = post.author_slug)
  "More by {Author}" link → /blog?author={slug}

SECTION 5 — RelatedPosts:
  "You Might Also Enjoy"
  3 BlogCards — same category as current post
  If fewer than 3 in same category: fill from recent posts

SECTION 6 — NewsletterSignup:
  Inline CTA: "Enjoy this story?"
  "Subscribe for seasonal menus, events, and stories from the kitchen."
  Email input + Subscribe → POST /api/newsletter
  Minimal style: no container, just text + input + button

PAGE SEO per article:
  title: "{post.seo.title[locale] ?? post.title[locale]} | The Meridian"
  description: post.seo.description[locale] ?? post.excerpt[locale]
  og:image: post.featured_image
  og:type: article
  canonical: /[locale]/blog/{slug}
  article:published_time, article:author meta tags

  schema.org BlogPosting:
  {
    "@type": "BlogPosting",
    "headline": post.title.en,
    "description": post.excerpt.en,
    "author": { "@type": "Person", "name": authorName },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "image": post.featured_image,
    "publisher": { "@type": "Organization", "name": "The Meridian" }
  }

ADMIN BOUNDARY (CRITICAL):
  Blog posts → Blog Posts Editor ONLY
  Blog hub page settings (hero text, featured toggle) → Content Editor
  NEVER mix: blog post content must never appear as a content_entry.
  NEVER add blog post fields to the main Content Editor sidebar.

VERIFY:
- /en/blog: featured post prominent, blog grid below, category filter
- Category filter: "Seasonal Guide" → shows only matching posts
- /en/blog/the-philosophy-behind-our-menu: full article renders
- Article: read time estimate shows ("5 min read")
- Social share: Web Share API fires on mobile
- AuthorBio: team member photo + bio loads (from team_members table)
- RelatedPosts: 3 cards from same category
- Newsletter inline: submits email, shows success
- BlogPosting schema.org validates in Rich Results Test
- ISR: post edit in admin → republishes within 3600s (set shorter for dev)
- Blog Posts Editor separate from Content Editor sidebar
```

### Done-Gate 2C

- [ ] Blog hub: featured post full-width card, grid below, category filter
- [ ] Category filter works client-side (no page reload)
- [ ] Article: hero, header with read time, body with styled typography
- [ ] Article body: headings, blockquote, images all styled
- [ ] AuthorBio: loads from `team_members` table
- [ ] RelatedPosts: 3 same-category posts shown
- [ ] Newsletter inline: submits without page reload
- [ ] BlogPosting schema.org validates
- [ ] Blog Posts Editor: separate from Content Editor (no overlap in sidebar)
- [ ] `/blog/nonexistent-slug` → 404
- [ ] `git commit: "feat: phase-2C — blog hub, article template, BlogPosting schema.org"`

---

## Prompt 2D — Private Dining Inquiry Page

**Goal:** Build the private dining page. This is a high-value conversion page — private events are the highest-revenue bookings for any restaurant. The inquiry form must be smooth and feel premium.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — private-dining-cta section
Content path: 'pages/private-dining'

Feature gate: only show this page if features.private_dining = true.
If false: /reservations/private-dining returns 404.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Private Dining  /[locale]/reservations/private-dining
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/reservations/private-dining/page.tsx

SECTION 1 — Hero (split-image variant):
  Image (right): intimate private dining room photo (placeholder)
  Left content:
    Eyebrow: "Private Dining" / "私人餐厅" / "Comedor Privado"
    Headline: "An Exceptional Setting for Every Occasion"
    Body: 2 sentences describing the private dining experience
    CTA: "Enquire Now" → scrolls to #inquiry-form

SECTION 2 — Spaces Grid:
  Content from: content.private_dining.spaces array
  Each space card:
    Image: 3/2 aspect ratio
    Space name: var(--font-heading), var(--size-h4)
    Capacity: "Up to {N} guests" — var(--color-primary)
    Description: 2–3 sentences
    Features list: icons + labels (AV equipment, dedicated server,
      custom menus, natural light, etc.)
  Layout: 2-column grid (or 1 column if only 1 space)
  Seed: 2 spaces — "The Salon" (12–18 guests) + "The Library" (20–40 guests)

SECTION 3 — Occasions List:
  Icons + labels for common occasions:
  Corporate Events | Birthday Celebrations | Wedding Rehearsal Dinners
  Anniversaries | Cocktail Receptions | Brand Activations
  Layout: 3-column icon grid, var(--color-primary) icons

SECTION 4 — Testimonial (featured: 1 private dining testimonial):
  Single large quote — pull quote style
  Author: name + occasion
  Background: var(--color-backdrop-secondary)

SECTION 5 — Private Dining Inquiry Form (id="inquiry-form"):

  File: components/forms/PrivateDiningForm.tsx

  Fields:
    - Name (required)
    - Company / Organization (optional)
    - Email (required)
    - Phone (required)
    - Date (date picker, min: tomorrow)
    - Estimated guest count (number input, min 10)
    - Occasion (dropdown):
        Corporate Event | Birthday | Anniversary | Wedding-Related
        Holiday Party | Other
    - Preferred space (dropdown from content.private_dining.spaces)
    - AV / tech needs? (toggle yes/no)
    - Custom menu preferences (textarea, optional)
    - How did you hear about us? (select: Google, Yelp, Instagram,
        Referred by a friend, Repeat guest, Other)
    - Message / additional details (textarea)

  Submission: POST /api/private-dining
    1. Validate required fields inline (no alert())
    2. Loading state on submit button
    3. INSERT into private_dining_inquiries table
    4. Send notification email to site.email_reservations via Resend:
       Subject: "Private Dining Inquiry — {name} · {date} · {guests} guests"
       Body: all form fields formatted clearly
    5. Send confirmation email to guest:
       Subject: "Your private dining enquiry — The Meridian"
       Body: "Thank you for your enquiry. Our events team will
       be in touch within 24 hours."
    6. Show confirmation screen (inline, no redirect):
       "We've received your enquiry."
       "Our private dining team will contact you within 24 hours."
       Enquiry reference number (timestamp-based)

PAGE SEO:
  title: "Private Dining | The Meridian — New York"
  description: from seo.json pages.private-dining[locale]

ADMIN WIRING:
  All section content editable in Content Editor
  Spaces array: manageable as a content array (add/edit/remove spaces)
  Inquiries: visible in admin under a read-only "Private Dining Inquiries"
    panel (table view: date, name, email, guests, status)

VERIFY:
- /en/reservations/private-dining renders all 5 sections
- Disable features.private_dining → page returns 404
- Spaces grid: both spaces visible with capacity + features
- Inquiry form: all validations fire inline
- Submit → row appears in private_dining_inquiries table in Supabase
- Submit → notification email sends to restaurant (check Resend)
- Submit → confirmation email sends to guest email entered
- Confirmation screen appears (no page redirect)
- Admin: private dining inquiries visible in read-only table
```

### Done-Gate 2D

- [ ] Page renders only when `features.private_dining = true`
- [ ] Spaces grid: 2 spaces with capacity, description, features list
- [ ] Form: all 11 fields present, inline validation working
- [ ] Submit → row in `private_dining_inquiries` table
- [ ] Submit → notification email to restaurant (Resend logs show it)
- [ ] Submit → confirmation email to guest
- [ ] Confirmation screen appears inline (no redirect)
- [ ] Admin: inquiries visible in read-only table panel
- [ ] `git commit: "feat: phase-2D — private dining page, inquiry form, dual email"`

---

## Prompt 2E — Press + Awards Page

**Goal:** Build the Press page. For restaurants, press coverage and awards are major trust signals. The page must display beautifully, feel editorial, and only show content from the `press_items` DB table.

```
You are building BAAM System R — Restaurant Premium.
Reference: @a6_content_contracts.md — PressItem interface
Content path: 'pages/press'

Feature gate: only build this page if features.press_section = true.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Press + Awards  /[locale]/press
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/press/page.tsx

Data loading:
  SELECT * FROM press_items WHERE site_id = siteId
  ORDER BY date DESC

Split into:
  Awards: WHERE is_award = true
  Press: WHERE is_award = false

SECTION 1 — Page Hero (compact):
  Headline: "Recognition" / "媒体报道" / "Prensa"
  Eyebrow: "Press & Awards" / "新闻奖项"

SECTION 2 — Awards Strip (if any awards):

  File: components/sections/AwardsStrip.tsx

  Horizontal flex, centered, wraps on mobile
  Each award card:
    Background: var(--color-primary-50)
    Border: 1px solid var(--color-primary-100)
    Border-radius: var(--card-radius)
    Padding: 1.5rem
    Award name: var(--font-heading), var(--size-h4)
    Issuer: var(--font-ui), var(--size-small), var(--color-text-muted)
    Year: var(--color-primary), var(--font-ui), bold
    Award logo (if item.logo): 48px height, grayscale → color on hover
    Icon (if no logo): trophy/star SVG in var(--color-primary)

SECTION 3 — Press Mentions:

  File: components/sections/PressGrid.tsx

  2-column grid (1 on mobile)
  Each PressCard:
    Left: publication logo (item.logo, height 40px, grayscale)
      If no logo: publication name in var(--font-heading), var(--size-h4)
    Headline: var(--font-heading), var(--size-h4), italic
      (links to item.url if set — opens in new tab)
    Excerpt (if item.excerpt[locale]): 2-line clamp,
      var(--color-text-secondary)
    Date: var(--font-ui), var(--size-small), var(--color-text-muted)
    "Read Article →" link (if item.url) — new tab

SECTION 4 — ReservationsCTA (minimal variant)

PAGE SEO:
  title: "Press & Awards | The Meridian"

ADMIN WIRING:
  Press items managed via Press Collection Editor (Prompt 2H).
  Page hero text: Content Editor.

VERIFY:
- /en/press: awards strip at top, press grid below
- Awards: trophy icon visible for items without logo
- Press cards: publication name/logo, headline, date, read link
- Disable features.press_section → /press returns 404
- Add a new press_item in admin → appears on page
```

### Done-Gate 2E

- [ ] Awards strip: renders items with `is_award = true`
- [ ] Press grid: renders items with `is_award = false`
- [ ] Awards: logo OR icon fallback visible
- [ ] Press cards: logo, headline, excerpt, date, external link
- [ ] Feature flag: disable `press_section` → page returns 404
- [ ] New press_item added in admin → appears on page
- [ ] `git commit: "feat: phase-2E — press + awards page, AwardsStrip, PressGrid"`

---

## Prompt 2F — FAQ Page + All Remaining Forms

**Goal:** Build the FAQ page and wire all remaining form API routes. Every form across the site must save to DB and trigger email notifications. Use the existing FAQAccordion component.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — faq-accordion section
Content path: 'pages/faq'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: FAQ  /[locale]/faq
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/faq/page.tsx

Sections:
1. Compact hero: "Frequently Asked Questions" / "常见问题"

2. FAQAccordion (REUSE from medical system, restyle):
   Groups from content.faq.groups array:
   Each group: heading + N Q&A items

   Seed 5 groups with 20+ total questions:

   Group 1 — Reservations (6 questions):
     Q: "How far in advance should I book?"
     A: "We recommend 2–3 weeks for weekends and 1 week for
     weekdays. For special occasions, 4–6 weeks ensures availability."

     Q: "What is your cancellation policy?"
     A: "Cancellations made 48 hours in advance incur no charge.
     Late cancellations may be subject to a $25 per person fee."

     Q: "Do you accept walk-ins?"
     A: "We hold a small number of tables for walk-in guests. We
     recommend arriving before 6:00 PM for the best availability."

     Q: "Do you accommodate large parties?"
     A: "For parties of 8 or more, please contact us directly to
     arrange a group reservation. For 15+ guests, our private dining
     team can create a bespoke experience."

     Q: "Can I request a specific table?"
     A: "We accommodate table preferences whenever possible. Please
     note your preference in the special requests field when booking."

     Q: "Is there a dress code?"
     A: "Smart casual. We ask guests to avoid athletic wear and flip-
     flops. We welcome guests to dress up if the occasion calls for it."

   Group 2 — Menus & Dietary Needs (5 questions):
     Q: "Do you offer vegetarian/vegan options?"
     Q: "How do you handle food allergies?"
     Q: "Does the menu change seasonally?"
     Q: "Can we arrange a custom tasting menu?"
     Q: "Do you have a children's menu?"

   Group 3 — Private Dining (4 questions):
     Q: "How many guests can you accommodate for a private event?"
     Q: "Can we bring our own cake for a celebration?"
     Q: "Do you offer AV equipment for corporate events?"
     Q: "What is the deposit for private dining?"

   Group 4 — Parking & Location (3 questions):
     Q: "Is parking available nearby?"
     Q: "What is the nearest subway station?"
     Q: "Is the restaurant wheelchair accessible?"

   Group 5 — Gift Cards & Other (3 questions):
     Q: "Do you offer gift cards?"
     Q: "Can I purchase merchandise?"
     Q: "Do you cater off-site events?"

   All Q&A content as LocalizedString (EN + ZH + ES)

3. Contact block at bottom:
   "Can't find what you're looking for?"
   Phone (tel: link) + Email (mailto: link)
   CTA: "Send Us a Message" → /contact

PAGE SEO: title = "FAQ | The Meridian"
schema.org FAQPage:
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": q.en,
      "acceptedAnswer": { "@type": "Answer", "text": a.en } }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMAINING FORM API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ensure these API routes are complete and tested:

POST /api/contact:
  Input: { name, email, phone?, message, site_id }
  Action:
    1. Validate: name, email, message required
    2. INSERT into contact_submissions (site_id, name, email, phone, message)
    3. Send notification email to site.email via Resend
  Response: { success: true }

POST /api/reservations (custom widget from Phase 1F):
  Verify complete: DB insert + confirmation email + notification email
  If not complete from 1F: finish here.

POST /api/private-dining (from Phase 2D):
  Verify complete.

POST /api/newsletter:
  Input: { email, site_id, source? }
  Action:
    1. Validate email format
    2. Check for duplicate: SELECT FROM newsletter_subscribers
       WHERE email = $email AND site_id = $site_id
    3. If duplicate: return { success: true, message: 'already_subscribed' }
    4. INSERT into newsletter_subscribers
    5. (Optional) Send welcome email via Resend
  Response: { success: true }

  Create newsletter_subscribers table if not exists:
  CREATE TABLE newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id text NOT NULL,
    email text NOT NULL,
    source text DEFAULT 'footer',
    created_at timestamptz DEFAULT now(),
    UNIQUE(site_id, email)
  );

Error handling for ALL routes:
  - Return { error: 'validation_failed', fields: [...] } on bad input
  - Return { error: 'internal_error' } on DB/email failure
  - Never expose stack traces to client
  - Log errors server-side
  - Client shows inline error messages (never alert())

VERIFY:
- /en/faq: 5 groups, 21 questions, all expand/collapse
- FAQPage schema.org validates
- POST /api/contact → row in contact_submissions
- POST /api/newsletter → row in newsletter_subscribers
- POST /api/newsletter with same email again → no duplicate, success returned
- All form errors: inline display, no alert(), no page reload on error
```

### Done-Gate 2F

- [ ] FAQ page: 5 groups, 21 questions, all expand/collapse smoothly
- [ ] FAQPage schema.org validates in Rich Results Test
- [ ] `/api/contact` → saves to DB, sends notification email
- [ ] `/api/newsletter` → saves to DB, no duplicate on re-submit
- [ ] `/api/private-dining` → saves to DB, sends dual email
- [ ] `/api/reservations` → saves to DB, sends confirmation email
- [ ] All API routes: no stack traces in response, inline errors on client
- [ ] `git commit: "feat: phase-2F — FAQ page, FAQPage schema, all form API routes complete"`

---

## Prompt 2G — Gift Cards + Careers + 404 Page

**Goal:** Build the remaining utility pages. These are lower-priority but must be complete before launch. 404 must be branded and helpful.

```
You are building BAAM System R — Restaurant Premium.
Content paths: 'pages/gift-cards', 'pages/careers', 'pages/404'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Gift Cards  /[locale]/gift-cards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/gift-cards/page.tsx
Feature gate: features.gift_cards must be true

SECTION 1 — Hero:
  Headline: "Give the Gift of The Meridian"
  Subline: "The perfect gift for any occasion."

SECTION 2 — Gift Card Options:
  3 pre-set amounts + custom amount option
  Card designs (visual mockup of gift card):
    Amount options: $50 | $100 | $200 | Custom ($25–$500)
    Each amount: button, on click → highlights selected
  Delivery: Digital (email) or Physical (mail)
  
  Purchase CTA:
    If site has online gift card provider (e.g., Toast, Square):
      Link to external provider with note
    Default: "To purchase, please call us or visit in person."
    Phone: clickable tel: link
    In-person note: "Available at the host stand during service."

  NOTE: No payment processing built here — link to provider or
  phone-only. Do not build a custom payment form.

SECTION 3 — Gifting Ideas:
  3 cards: Birthday | Anniversary | Corporate Gifting
  Each: icon + title + short description

SECTION 4 — Redemption Info:
  How to redeem: 3 simple steps
  "Valid for 5 years from date of purchase."
  "Cannot be exchanged for cash."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Careers  /[locale]/careers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/careers/page.tsx
Feature gate: features.careers must be true

SECTION 1 — Hero:
  Headline: "Join Our Team" / "加入我们" / "Únete al Equipo"
  Subline: "We're always looking for passionate, talented people."
  Background: kitchen action photo (placeholder)

SECTION 2 — Why Work With Us:
  4 items (icon + title + description) from content:
  Culture | Growth | Benefits | Team

SECTION 3 — Open Positions:
  Content from content.careers.openings array (managed in Content Editor)
  Seed: 3 openings:
    - Sous Chef (Full-time, Culinary)
    - Sommelier (Full-time, Service)
    - Front-of-House Manager (Full-time, Management)
  Each opening card:
    Title, Department badge, Type (Full-time/Part-time), Location,
    Brief description, "Apply" button → opens inline ApplicationForm

  ApplicationForm (modal or inline expand):
    Fields: Name, Email, Phone, Position (pre-filled from card),
      Resume (file upload, PDF/DOC only, max 5MB → Supabase Storage),
      Cover letter (textarea, optional)
    Submit: POST /api/careers-apply
      → Upload resume to Supabase Storage (careers/ bucket path)
      → INSERT into careers_applications table
        (create table: id, site_id, position, name, email, phone,
         resume_url, cover_letter, status='new', created_at)
      → Send notification to site.email
    Confirmation: "Application received. We'll be in touch."

  Empty state (no openings):
    "No open positions right now."
    "Send us your CV anyway — we'll keep it on file."
    → Shows shortened ApplicationForm (position = "General Application")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: 404  app/[locale]/not-found.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design: Branded, not generic.
Background: dark var(--color-backdrop), full viewport
Center content:
  Large "404" in var(--font-display), var(--color-primary), 120px
  Heading: "Table Not Found" / "找不到该页面" / "Página No Encontrada"
  Subline: "The page you're looking for may have moved or doesn't exist."
  3 helpful links:
    "View Our Menu" → /menu
    "Make a Reservation" → /reservations
    "Return Home" → /
  Restaurant name + small logo at bottom

Also create: app/[locale]/error.tsx
  Unexpected error page — similar style to 404
  "Something went wrong on our end."
  CTA: "Return to Homepage"

VERIFY:
- /en/gift-cards: renders, purchase options visible, no payment form
- Disable features.gift_cards → page returns 404
- /en/careers: 3 job listings, "Apply" button opens form
- Application form: file upload works, submits to DB, email sends
- No openings → general application form shown
- Disable features.careers → /careers returns 404
- /en/nonexistent-page → 404 page shows (not generic Next.js error)
- 404: 3 helpful links all resolve correctly
```

### Done-Gate 2G

- [ ] Gift cards page: amounts, delivery info, redemption info all render
- [ ] Gift cards: feature flag disable → 404
- [ ] Careers: 3 openings visible, Apply button opens form
- [ ] Application form: file upload → Supabase Storage, DB row, notification email
- [ ] Careers: empty state shows general application form
- [ ] Careers: feature flag disable → 404
- [ ] 404 page: branded "Table Not Found", 3 helpful nav links
- [ ] Error page: renders on unexpected errors
- [ ] `git commit: "feat: phase-2G — gift cards, careers + application, 404, error page"`

---

## Prompt 2H — Collection Admin Editors

**Goal:** Build all 6 collection admin editors. Every collection must support full CRUD (Create, Edit, Duplicate, Delete), sort by display_order, and have clean form UX. This is the most important admin work in Phase 2.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Admin Architecture"

Build 6 collection editors in the admin panel.
Each must support: New Item · Save · Duplicate · Delete · Reorder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 1 — Menu Items Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/menu
Access: Platform Admin, Restaurant Admin, Restaurant Manager

Left sidebar: Menu type tabs
  Dinner | Tasting | Cocktails | Wine | Seasonal | (+ all enabled types)
  (feature-gated: only shows enabled menu types)

Within each menu type:
  Category accordion sections (expand/collapse)
  Within each category: item list (drag-to-reorder)

Item row (collapsed):
  Name (EN) | Price | Dietary flags icons | Available toggle | Edit button

Item form (expanded on Edit):
  BASIC:
    Name (LocalizedString tabs: EN | ZH | ES) [required]
    Description (LocalizedString tabs) [optional]
    Category (dropdown — filtered to current menu type) [required]

  PRICING:
    Price (number input, in dollars — convert to cents on save)
    Price note (LocalizedString) — "Market Price", "per person"
    Price range min + max (dollars) — for range pricing
    (Rule: if price is set, price_range is disabled and vice versa)

  FLAGS:
    Available (toggle, default on)
    Featured (toggle — appears in homepage MenuPreview if on)
    Seasonal (toggle + seasonal note LocalizedString)
    New Item (toggle)
    Spice Level (0–3 selector: none/mild/medium/hot)

  DIETARY & ALLERGENS:
    Dietary flags (multi-checkbox):
      Vegan | Vegetarian | Gluten-Free | Dairy-Free | Nut-Free
      Shellfish-Free | Halal | Kosher
    Allergens (multi-checkbox):
      Gluten | Dairy | Eggs | Tree Nuts | Peanuts | Shellfish
      Fish | Soy | Sesame

  MEDIA:
    Image (image picker → Supabase Storage)

  ORDERING:
    Display order (number, for manual sort within category)

Actions: Save | Duplicate (copies to same category, adds " (Copy)" suffix) | Delete

Bulk actions toolbar:
  Select All | Mark Available | Mark Unavailable | Delete Selected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 2 — Events Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/events
Access: Platform Admin, Restaurant Admin

List view:
  Tabs: Upcoming | Past | All
  Columns: Title | Date | Event Type | Price | Published | Edit

Event form:
  DETAILS:
    Title (LocalizedString: EN | ZH | ES) [required]
    Short description (LocalizedString) [optional, for cards]
    Full description (rich text or textarea, LocalizedString) [required]
    Event type (select):
      Wine Dinner | Chef's Table | Live Music | Seasonal Launch
      Holiday | Class | Tasting | Chef Collab | Other [required]
    Tags (multi-text input)

  TIMING:
    Start date + time [required]
    End date + time [required]
    (Validate: end must be after start)

  PRICING:
    Price per person (dollars, optional — leave blank for "Complimentary")
    Price note (LocalizedString) — "includes wine pairing"
    Reservation required (toggle)
    Reservation link (URL, optional — if blank uses /reservations)
    Capacity (number, optional)

  STATUS:
    Published (toggle — false = draft, true = visible on site)
    Cancelled (toggle — shows cancellation notice on detail page)
    Featured (toggle — shown in homepage EventsPreview)

  MEDIA:
    Image (image picker)

  ORDERING:
    (Events ordered by start_datetime — no manual order needed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 3 — Gallery Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/gallery
Access: Platform Admin, Restaurant Admin

Display: visual grid of thumbnails (not a list)
  Each thumbnail: image, category badge, display_order, edit icon
Drag-to-reorder: drag thumbnails to change display_order
  (update display_order on drag end — debounced 500ms)

Item form (click edit → modal or side panel):
  Image (required): image uploader → Supabase Storage
    Drag-and-drop support. Shows upload progress bar.
    After upload: auto-populate width + height from image metadata
  Alt text (LocalizedString: EN | ZH | ES) [required]
  Caption (LocalizedString) [optional]
  Category (select): Food | Interior | Team | Events
  Credit / photographer (text, optional)
  Featured (toggle — shown in homepage GalleryPreview)
  Display order (number — also controllable via drag)

Bulk upload:
  "Upload Multiple" button → multi-file picker
  Uploads all selected images to Supabase Storage
  Creates gallery_item rows for each (category = Food default)
  Shows batch progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 4 — Team Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/team
Access: Platform Admin, Restaurant Admin

List: drag-to-reorder team members
Each row: photo thumbnail, name, role (EN), department, active toggle

Team member form:
  IDENTITY:
    Name [required]
    Role (LocalizedString: EN | ZH | ES) [required]
    Department (select): Culinary | Pastry | Bar | Service | Management

  BIOGRAPHY:
    Bio (LocalizedString, rich text or textarea) [required]
    Short bio (LocalizedString, max 150 chars) [optional — for cards]
    Philosophy quote (LocalizedString) [optional — for ChefHeroFull]

  CREDENTIALS:
    Credentials (multi-text input: add/remove items) [optional]
    Awards (array: { title(LocalizedString), year, issuer })

  MEDIA:
    Photo (image picker — landscape/square ratio for team grid)
    Portrait photo (image picker — 3:4 ratio for ChefHeroFull)

  FLAGS:
    Featured (toggle — shown in ChefHeroFull on About/Team page)
    Active (toggle — false removes from all frontend displays)
    Display order (number)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 5 — Press Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/press
Access: Platform Admin, Restaurant Admin

List: sortable by date (newest first by default)
Each row: publication, headline (EN), date, type (Press/Award), display_order

Press item form:
  TYPE:
    Is Award (toggle — routes to AwardsStrip vs PressGrid)
  
  If NOT award:
    Publication name [required]
    Publication logo (image picker, optional)
    Headline (LocalizedString) [required]
    Excerpt (LocalizedString, optional — 2-line blurb)
    Article URL (optional)
    Date [required]
    Featured (toggle)

  If IS award:
    Award name (LocalizedString) [required]
    Issuing organization [required]
    Award logo (image picker, optional)
    Year [required]
    Featured (toggle)
    Award description (LocalizedString, optional)

  ORDERING:
    Display order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITOR 6 — Blog Posts Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: /admin/blog
(This is SEPARATE from the Content Editor — different sidebar nav item)
Access: Platform Admin, Restaurant Admin, Restaurant Manager

List: newest first
Columns: Title | Author | Category | Published Date | Status | Edit

Post form:
  CONTENT:
    Title (LocalizedString: EN | ZH | ES) [required]
    Slug (auto-generated from EN title, editable) [required, unique]
      Slug integrity: if published post, show warning before changing
    Excerpt (LocalizedString, 2-3 sentences) [required]
    Body (LocalizedString, rich text editor or textarea HTML) [required]
    Category (select):
      Chef's Perspective | Seasonal Guide | Wine & Spirits
      Events & Announcements | Behind the Scenes
      Kitchen Stories | Sourcing & Ingredients [required]

  META:
    Author (dropdown from team_members) [required]
    Featured image (image picker) [required]
    Tags (multi-text input)
    Featured (toggle — shown in FeaturedBlogPost component)

  SEO:
    SEO title (LocalizedString, defaults to title if blank)
    SEO description (LocalizedString, 150–160 chars, count shown)

  PUBLISHING:
    Status (Draft | Published | Archived)
    Publish date (date picker — can backdate or schedule)

CRITICAL BOUNDARY — enforce in code:
  Blog Posts Editor sidebar nav item must link to /admin/blog
  Content Editor sidebar must NEVER show blog posts in its file tree
  blog_posts table rows must NEVER appear in content_entries
  They are completely separate data stores

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHARED ADMIN PATTERNS (apply to all 6 editors)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Autosave indicator:
  "Saving..." → "Saved" indicator after every field change (debounced 1s)
  Unsaved changes: browser beforeunload warning

LocalizedString tabs:
  All multi-locale fields: EN | ZH | ES tab switcher
  Missing translation indicator: orange dot on tab if field is empty

Action buttons (each editor):
  [New {Item}] button — creates blank draft, opens form
  [Save] — upserts to DB
  [Duplicate] — copies item, opens new form with "(Copy)" in name
  [Delete] — confirmation dialog "Delete this item? This cannot be undone."

Validation:
  Required fields: show error inline on Save attempt
  Slug uniqueness: validate on blur + on Save

VERIFY all 6 editors:
  Menu Items: New → fill fields → Save → appears on /en/menu/dinner
  Menu Items: Duplicate → creates copy → edit copy → save → two items visible
  Menu Items: Delete → confirmation → item gone from /menu/dinner
  Menu Items: Toggle available = false → item gone from frontend
  Events: New event → fill all fields → publish → appears on /en/events
  Events: Cancel event → /en/events/[slug] shows cancellation notice
  Gallery: Upload 3 images → appear in gallery with correct alt text
  Gallery: Drag reorder → new order reflected on /en/gallery
  Team: Edit team member bio → save → /en/about/team updated
  Press: Add award (is_award=true) → appears in AwardsStrip
  Press: Add press item → appears in PressGrid
  Blog: Create post → publish → appears on /en/blog
  Blog: All blog operations must NOT affect Content Editor file list
```

### Done-Gate 2H

- [ ] Menu Items Editor: New/Save/Duplicate/Delete all working
- [ ] Menu item: toggle `available = false` → disappears from frontend
- [ ] Menu item: `featured = true` → appears in homepage MenuPreview
- [ ] Events Editor: New/Save/Duplicate/Delete all working
- [ ] Event publish → visible on /events; unpublish → gone from /events
- [ ] Event cancel → detail page shows cancellation notice
- [ ] Gallery Editor: image upload → Supabase Storage → appears on /gallery
- [ ] Gallery drag-reorder: new order on frontend after save
- [ ] Team Editor: edit bio → save → /about/team updated
- [ ] Press Editor: award (is_award=true) → AwardsStrip; press → PressGrid
- [ ] Blog Posts Editor: create/publish post → appears on /blog
- [ ] Blog Posts Editor: COMPLETELY separate from Content Editor (no shared sidebar items)
- [ ] All editors: LocalizedString tabs show EN/ZH/ES, orange dot if empty
- [ ] All editors: unsaved changes warning on browser close
- [ ] `git commit: "feat: phase-2H — all 6 collection editors complete"`

---

## Prompt 2I — Admin Collection Certification: Roundtrip Verification

**Goal:** Run a systematic one-pass verification of all 6 collection editors plus all form submissions. Identify and batch-fix any issues. Mirrors the Admin Certification SOP from Section 29 of the master plan.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Platform Guardrails"

Run a complete admin certification pass. For each item below,
test the specified flow. Report PASS or FAIL. Batch all fixes
together, then re-run.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLLECTION ROUNDTRIP TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each collection, test this exact flow:
1. CREATE: New item → fill all required fields → Save
2. VERIFY: Item appears on correct frontend page immediately
3. EDIT: Change a text field → Save
4. VERIFY: Frontend reflects change (hard reload if ISR)
5. DUPLICATE: Duplicate the item → verify copy exists with "(Copy)" name
6. REORDER: Change display_order → verify frontend order changes
7. DELETE: Delete the copy → verify it's gone from frontend
8. LOCALE: Switch to ZH → edit a LocalizedString field → Save
   → visit /zh/[page] → verify ZH value shows (not EN fallback)

Collections to certify:
  - Menu Items (dinner category — test with one item)
  - Events (one upcoming event)
  - Gallery (one gallery item)
  - Team Members (one team member)
  - Press Items (one press item + one award)
  - Blog Posts (one published post)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT EDITOR ROUNDTRIP TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each core page, test this exact flow:
1. Admin → Content Editor → select page
2. Edit a section field in Form mode → Save
3. Visit frontend → verify change visible
4. Switch to JSON mode → edit same field differently → Save
5. Switch back to Form mode → verify Form reflects JSON change
6. Change section variant (if applicable) → Save
7. Visit frontend → verify variant changed

Pages to certify:
  Home | Menu Hub | About | Reservations | Contact | Events | Gallery

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM SUBMISSION TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submit each form and verify DB row + email:
  Contact form → contact_submissions table + notification email
  Newsletter → newsletter_subscribers table (no duplicate on re-submit)
  Reservation (custom) → bookings table + confirmation email
  Private dining inquiry → private_dining_inquiries + dual email
  Careers application → careers_applications table + notification email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOG EDITOR BOUNDARY TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Confirm:
  1. Blog post created in Blog Posts Editor
     → does NOT appear in Content Editor file tree
     → does NOT create a content_entries row
  2. Content Editor → open home.json
     → blog-preview section loads from blog_posts table (not content_entries)
  3. No way to access blog post content from Content Editor path

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After initial pass: collect all FAILs into a batch fix list.
Fix all issues. Then re-run the full test matrix.
Only mark PASS when the complete re-run passes with zero failures.

DELIVER:
  1. Admin Certification Matrix (collection × action: PASS/FAIL)
  2. Form Submission Matrix (form × check: PASS/FAIL)
  3. Fix Log (what was wrong + what was changed)
  4. Final re-run result: ALL PASS confirmation
```

### Done-Gate 2I

- [ ] All 6 collections: Create/Edit/Duplicate/Delete/Reorder all PASS
- [ ] ZH locale edit: ZH content appears on /zh/* pages
- [ ] Content Editor roundtrip: Form ↔ JSON sync PASS for all 7 pages
- [ ] Variant switch: all sections with variants PASS
- [ ] All 5 forms: DB row + email PASS
- [ ] Blog editor boundary: no overlap with Content Editor confirmed
- [ ] Admin Certification Matrix delivered with all PASS
- [ ] `git commit: "feat: phase-2I — admin certification complete, all collections PASS"`

---

## Prompt 2J — Responsive Polish Pass

**Goal:** Systematic mobile + tablet audit across all pages. Fix every overflow, broken layout, and accessibility issue found. A restaurant's mobile experience is its most important touchpoint.

```
You are building BAAM System R — Restaurant Premium.

Run a full responsive audit across all pages at 3 breakpoints:
  Mobile S:  375px wide  (iPhone SE)
  Mobile L:  430px wide  (iPhone 14 Pro Max)
  Tablet:    768px wide  (iPad)
  Desktop:  1440px wide  (baseline — should already be good)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT CHECKLIST (per page × breakpoint)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For EVERY page, check:
  [ ] No horizontal scroll (body overflow: hidden check)
  [ ] No element wider than viewport (images, tables, code blocks)
  [ ] Text readable without zooming (min 15px body)
  [ ] Tap targets: all buttons/links ≥ 44×44px
  [ ] Inputs: ≥ 16px font-size (prevents iOS auto-zoom on focus)
  [ ] Hero: image not cropped on critical content (face, food)
  [ ] CTA buttons: visible without scrolling (on first screen)
  [ ] Navigation: mobile nav accessible, no elements hidden under it
  [ ] Footer: stacks correctly, all 4 columns become 1 column

SPECIFIC COMPONENTS TO AUDIT:
  Header:
    [ ] Logo + hamburger fit in 375px without overflow
    [ ] Hamburger opens overlay correctly
    [ ] Top bar hidden on mobile (as designed)
    [ ] StickyBookingBar doesn't overlap content

  MenuCategoryNav:
    [ ] Tabs scroll horizontally with momentum
    [ ] No tab text truncated illegibly
    [ ] Sticky position correct (below header, not behind it)

  MenuItem:
    [ ] Name and price on same line without wrapping onto 3 lines
    [ ] Dietary flag icons don't overflow card
    [ ] Price right-aligned without breaking layout

  HeroFullscreenDish:
    [ ] Image crops to show food (not just background)
    [ ] Headline readable (sufficient contrast with overlay)
    [ ] CTA buttons accessible (not under fold on 375px)
    [ ] Two CTA buttons stack on 375px (don't overflow side by side)

  ChefHeroFull:
    [ ] Portrait stacks on top at mobile (not left/right)
    [ ] Content below portrait not too cramped
    [ ] Philosophy quote readable

  GalleryMasonry:
    [ ] 2 columns on mobile, tiles not too small to tap
    [ ] Lightbox: full screen on mobile, arrows accessible (44px+)
    [ ] Swipe navigation works

  ReservationWidgetCustom:
    [ ] Date picker usable at 375px (cells 44px min)
    [ ] Time slot pills wrap to multiple rows (not overflow horizontally)
    [ ] Form inputs 44px height

  EventCard:
    [ ] Date badge not cut off
    [ ] Long event titles wrap cleanly (2-line clamp)
    [ ] Full-width on mobile (1 column)

  BlogCard:
    [ ] Readable at 375px
    [ ] Author photo + name fit on one line

  PrivateDiningForm:
    [ ] Date picker usable on mobile
    [ ] Guest count input accessible

FIXES TO APPLY:
  After identifying all issues, group into batches:
  Batch 1: Layout/overflow fixes (CSS only)
  Batch 2: Touch target fixes (padding/min-height)
  Batch 3: Typography fixes (font-size, line-height)
  Batch 4: Component-specific fixes

After all fixes: re-run audit, confirm all checks PASS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCESSIBILITY QUICK AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

While in the responsive audit, also check:
  [ ] All images have non-empty alt text
  [ ] Focus indicators visible on all interactive elements
  [ ] Form labels properly associated with inputs (for/id pairs)
  [ ] Color contrast: all text meets WCAG AA (4.5:1 for normal text)
    Special check: gold text on dark background (noir-saison)
    Special check: light text in ReservationsCTA banner
  [ ] Heading hierarchy: H1 → H2 → H3 correct on all pages
    (every page has exactly one H1)
  [ ] Skip-to-content link present in layout

VERIFY:
- Chrome DevTools responsive mode: no horizontal scroll at 375px on any page
- All interactive elements 44×44px minimum
- Form inputs 16px+ font-size (no iOS zoom)
- Lighthouse Accessibility score ≥ 90 on home, menu, contact
- No missing alt text (run: npm run qa:content if available)
```

### Done-Gate 2J

- [ ] No horizontal scroll on any page at 375px
- [ ] All interactive elements ≥ 44×44px touch targets
- [ ] Form inputs ≥ 16px (no iOS auto-zoom)
- [ ] HeroFullscreenDish: CTA visible without scroll at 375px
- [ ] MenuCategoryNav: horizontal scroll works, no overflow
- [ ] GalleryMasonry: 2 columns on mobile, lightbox full-screen
- [ ] ReservationWidgetCustom: date picker + time slots usable at 375px
- [ ] ChefHeroFull: portrait stacks above content on mobile
- [ ] All images have non-empty alt text
- [ ] Heading hierarchy: every page has exactly one H1
- [ ] Lighthouse Accessibility ≥ 90 on Home, Menu, Contact
- [ ] `git commit: "feat: phase-2J — responsive polish, accessibility fixes"`

---

## Phase 2 Completion Gate

All items below must pass before starting Phase 3.

| Requirement | Pass? |
|---|---|
| Events listing + detail pages render from DB | |
| Event schema.org validates | |
| Gallery masonry layout clean at all breakpoints | |
| Lightbox: keyboard + swipe + click-outside all work | |
| Blog hub + article template complete | |
| BlogPosting schema.org validates | |
| Blog Posts Editor completely separate from Content Editor | |
| Private dining page + inquiry form — dual email confirmed | |
| Press page: awards strip + press grid rendering from DB | |
| FAQ page: 21 questions, FAQPage schema validates | |
| All 5 form API routes: DB rows + emails confirmed | |
| Gift Cards + Careers + 404 pages complete | |
| Application file upload → Supabase Storage working | |
| All 6 collection editors: Create/Edit/Duplicate/Delete pass | |
| Admin Certification Matrix: all PASS | |
| Content Editor roundtrip: Form ↔ JSON sync all pages | |
| No horizontal scroll at 375px on any page | |
| All touch targets ≥ 44×44px | |
| Lighthouse Accessibility ≥ 90 on 3 pages | |
| `npm run build` — zero errors | |
| **Git tagged:** `v0.2-complete-frontend` | |

**Phase 2 complete → Proceed to `RESTAURANT_PHASE_3.md`**

---

*BAAM System R — Restaurant Premium*
*Phase 2 of 5 — Conversion + Content Pages + Admin Editors*
*Next: RESTAURANT_PHASE_3.md — Admin Hardening + SEO + Programmatic Pages*
