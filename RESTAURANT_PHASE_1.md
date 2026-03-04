# BAAM System R — Restaurant Premium
# Phase 1: Core Pages — Build / Wire / Verify

> **System:** BAAM System R — Restaurant Premium
> **Reference files:** `@RESTAURANT_COMPLETE_PLAN.md` + `@a6_content_contracts.md` + `@RESTAURANT_CONTENT_CONTRACTS.md`
> **Prerequisite:** Phase 0 completion gate fully passed. `v0.0-phase0-complete` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every page before moving on.
> **Rule:** A page is only "done" when all three steps pass. Never skip a done-gate.

---

## Phase 1 Overview

**Duration:** Week 1–2
**Goal:** Build all core pages of The Meridian — the pages every restaurant visitor will hit. Every page must render from Supabase DB content, be fully editable in the admin Content Editor (Form + JSON), support variant switching, and work in all three locales (EN / ZH / ES).

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 1A | Header + Footer + StickyBookingBar | Shared layout components | 90 min |
| 1B | Home Page — All 9 Sections | Most complex page, sets visual language | 120 min |
| 1C | Menu System — Hub + CategoryNav + MenuItem | High-effort core feature | 120 min |
| 1D | Individual Menu Pages (Dinner, Cocktails, Wine) | Menu content pages | 90 min |
| 1E | About + Team Pages | Chef identity pages | 60 min |
| 1F | Reservations Page — All 3 Widget Variants | Conversion-critical | 90 min |
| 1G | Contact Page + Hours Display | Information page | 45 min |
| 1H | i18n Routing — All Pages EN / ZH / ES | Multilingual verification pass | 90 min |

---

## Build → Wire → Verify Checklist (Every Page)

Run this checklist on every page before marking it done:

| Check | How to Verify |
|---|---|
| **Renders from DB** | Change a field in Supabase directly → reload page → change appears |
| **Form edit** | Admin → Content Editor → edit field → Save → frontend shows change |
| **JSON edit** | Admin → JSON tab → edit value → Save → Form tab reflects change |
| **Variant switch** | Admin → change section variant → Save → layout visually changes |
| **Layout reorder** | Admin → reorder sections in layout.json → Save → page reorders |
| **Theme compliance** | `grep -r "color:" src/components/` returns no hex values |
| **Media fields** | Image picker opens → select from Supabase Storage → image shows on page |
| **i18n** | Visit `/en/`, `/zh/`, `/es/` — all render without errors, correct translations |
| **Mobile** | Resize to 375px — no overflow, nav collapses, CTA accessible |

---

## Prompt 1A — Header + Footer + StickyBookingBar

**Goal:** Implement the shared layout shell — the components that appear on every page. Must render entirely from DB content (no hardcoded strings), support all 3 locales, and handle transparent-over-hero behavior.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — HeaderConfig, FooterConfig, NavigationConfig

Build three shared layout components. All content loads from
content_entries via loadGlobalContent(). No hardcoded strings.
No hardcoded colors — CSS variables only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 1 — RestaurantHeader
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/RestaurantHeader.tsx

Behavior:
- Reads from: header.json (variant, transparent_hero, top_bar, logo)
- Reads from: navigation.json (primary nav items, CTA)
- Reads from: site.json (phone, supported_locales, hours today)

Top Bar (variant: 'with-top-bar'):
  - Left: phone number as clickable <a href="tel:...">
  - Center: custom message from header.top_bar.message[locale]
  - Right: LanguageSwitcher component (EN | 中文 | ES)
  - Background: var(--color-backdrop) · Text: var(--color-text-secondary)
  - Height: 36px · Font: var(--font-ui) · Size: 13px

Main Nav Bar:
  - Left: Logo (text "THE MERIDIAN" if logo.type = 'text',
    use var(--tracking-nav) letter-spacing, var(--font-heading))
  - Center: Nav items from navigation.json primary[]
    - Items with children[] render as dropdown on hover (desktop)
    - Dropdown: absolute positioned, min-width 180px, var(--card-radius),
      var(--card-shadow), var(--color-backdrop-surface) background
    - Feature-gated items: check site.json features[item.feature_gate]
      → if false, hide item entirely
  - Right: CTA button from navigation.json cta
    (label, href, variant: 'primary' uses var(--color-primary) bg)

Sticky behavior (header.transparent_hero = true):
  - On pages with hero: start transparent (bg: transparent,
    text: white)
  - On scroll past 80px: transition to opaque
    (bg: var(--color-backdrop), text: var(--color-text-primary))
  - Transition: var(--duration-base) var(--easing)
  - Always opaque on non-hero pages

Mobile (< 768px):
  - Hide desktop nav items
  - Show hamburger menu button (right of logo)
  - Full-screen overlay nav on open:
    - All nav items listed vertically
    - Dropdowns expand inline (accordion style)
    - CTA button full-width at bottom
    - LanguageSwitcher at very bottom
    - Close button top-right
    - Backdrop: var(--color-backdrop) 98% opacity
  - Top bar hidden on mobile (phone accessible via nav overlay)

Height: var(--nav-height) = 72px (desktop), 60px (mobile)
z-index: 50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 2 — RestaurantFooter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/RestaurantFooter.tsx

Reads from: footer.json, site.json, navigation.json

Layout (footer.variant = 'dark'):
  Background: var(--color-backdrop) · Text: var(--color-text-secondary)

Row 1 — Main columns (4-column grid on desktop, stacked on mobile):
  Column 1 (footer.columns.story = true):
    - Logo / restaurant name in var(--font-heading)
    - Tagline from footer.tagline[locale]
    - Social icons row (Instagram, Facebook, Yelp, Google Maps)
      — icons only, links from site.json.social
      — show only non-empty social links

  Column 2 (footer.columns.hours = true):
    - Heading: "Hours" / "营业时间" / "Horarios"
    - Render week schedule from site.json.hours
    - Closed days show "Closed" / "休息" / "Cerrado"
    - Hours note below schedule (site.json.hours.note[locale])

  Column 3 (footer.columns.address = true):
    - Heading: "Find Us" / "地址" / "Encuéntranos"
    - Full address from site.json.address.full[locale]
    - Phone: clickable tel: link
    - Email: clickable mailto: link
    - "Get Directions" link → site.json.social.google_maps

  Column 4 (footer.columns.links = true):
    - Heading: "Explore" / "探索" / "Explorar"
    - Secondary nav links: Menu, About, Events, Gallery,
      Private Dining, Gift Cards, Careers, Contact
    - Feature-gated links hidden if feature disabled

Row 2 — Newsletter signup (footer.show_newsletter = true):
  - "Stay in the loop" headline
  - Email input + Subscribe button
  - Inline: POST to /api/newsletter, show success message
  - Input: var(--color-backdrop-surface) bg, var(--btn-radius) radius

Row 3 — Bottom bar:
  - Left: Copyright from footer.copyright[locale]
    (replace {year} with current year)
  - Right: Privacy Policy · Terms of Service links

LanguageSwitcher: shown if footer.show_lang_switcher = true
(appears bottom of Column 1 on desktop)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 3 — StickyBookingBar (mobile only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/StickyBookingBar.tsx

Visible: only on mobile (< 768px), fixed to bottom of viewport
z-index: 60 (above everything)
Height: 64px
Background: var(--color-backdrop) · border-top: var(--menu-divider)

Content (two buttons side by side):
  Left button (50% width):
    - Icon: phone
    - Label: site.json.phone_display
    - Action: <a href="tel:{site.phone}">
    - Style: ghost/outline using var(--color-border)

  Right button (50% width):
    - Label from navigation.json.cta.label[locale]
      ("Reserve a Table" / "预订餐位" / "Reservar Mesa")
    - Action: link to /reservations
    - Style: filled, var(--color-primary) background,
      var(--color-text-inverse) text

Show/hide behavior:
  - Hidden until user scrolls 200px past hero
  - Animate in: slide up 64px over var(--duration-base)
  - Hidden on /reservations page itself

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT WRAPPER — app/[locale]/layout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wrap all pages with:
<RestaurantHeader siteData={site} headerData={header} navData={nav} />
<main>{children}</main>
<RestaurantFooter siteData={site} footerData={footer} />
<StickyBookingBar siteData={site} navData={nav} />

Load all 4 global files server-side in layout.tsx using
loadGlobalContent(siteId, locale):
  - site.json → SiteInfo
  - header.json → HeaderConfig
  - footer.json → FooterConfig
  - navigation.json → NavigationConfig

Inject theme CSS variables here (from theme.json, as built in Phase 0B).

SEO baseline — add to layout.tsx metadata:
- Default title from seo.json.title[locale]
- Default description from seo.json.description[locale]
- og:image from seo.json.og_image
- Canonical URL: https://themeridian.com/{locale}/{path}
- hreflang alternates for EN, ZH, ES on every page

VERIFY:
- Header renders at meridian.local:3060/en with top bar + nav + CTA
- Transparent on hero, opaque after scroll (check on home page)
- Mobile: hamburger opens full-screen overlay, all nav items present
- Language switcher: EN → ZH → ES all load correctly
- Footer renders with all 4 columns, hours, address, social icons
- StickyBookingBar visible on mobile after scroll
- Newsletter form: submit email → success message appears
- All content loaded from DB (change navigation.json in admin → reload → nav updates)
```

### Done-Gate 1A

- [ ] Header renders from DB — no hardcoded strings
- [ ] Top bar shows: phone (clickable) + message + lang switcher
- [ ] Nav dropdown: Menu → dinner/tasting/cocktails/wine/seasonal all visible
- [ ] Feature-gated nav items: disable a feature in admin → nav item disappears
- [ ] Transparent header on hero → opaque after 80px scroll
- [ ] Mobile nav: hamburger opens overlay, all items accessible, closes cleanly
- [ ] Footer renders: 4 columns with hours, address, social, explore links
- [ ] Social links in footer: only non-empty ones shown
- [ ] Newsletter form: submits without page reload, shows success message
- [ ] StickyBookingBar: visible on mobile after scroll, hidden on `/reservations`
- [ ] Lang switcher: switching locale → URL changes → all 3 locales render
- [ ] `hreflang` tags visible in page source for all 3 locales
- [ ] Zero hardcoded hex colors in Header, Footer, StickyBookingBar components
- [ ] `git commit: "feat: phase-1A — RestaurantHeader, Footer, StickyBookingBar"`

---

## Prompt 1B — Home Page — All 9 Sections

**Goal:** Build the homepage — the most important page in the system. Sets the visual language for the entire site. Every section must render from DB, support variants, and be fully admin-editable.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — all hero + trust + menu-preview + testimonials sections
Content path: 'pages/home' · Layout path: 'pages/home.layout'

Build the homepage at app/[locale]/page.tsx.
Load content: loadPageContent('the-meridian', locale, 'pages/home')
Load layout: loadLayoutConfig('the-meridian', locale, 'pages/home.layout')
Render sections in layout order. Each section reads its variant
from the content JSON and renders the correct component.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — HeroFullscreenDish
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/HeroFullscreenDish.tsx

Variants: dark-overlay (default) | light-overlay | split-text

dark-overlay variant:
  - Full viewport height: min-height: var(--hero-min-h, 100vh)
  - Background: full-bleed image via next/image (priority, cover)
  - Overlay: rgba(0,0,0, var(--hero-overlay)) over image
  - Content centered vertically and horizontally
  - Eyebrow text (optional): small caps, var(--tracking-label),
    var(--color-primary), var(--font-ui), 12px
  - Headline: var(--size-display), var(--font-display),
    var(--tracking-display), var(--color-text-primary) (= #F5F0E8 on dark)
    max-width: 800px
  - Subline: var(--size-h4), var(--font-body), var(--color-text-secondary)
    max-width: 600px, margin-top: 1.5rem
  - CTA buttons: row, gap 1rem, margin-top: 2rem
    Primary: filled var(--color-primary) bg, var(--btn-radius)
    Secondary: outline, var(--btn-outline), same radius
  - Scroll indicator: animated chevron at bottom center (optional)

split-text variant:
  - Left 55%: text content (dark background)
  - Right 45%: image (full height, object-fit: cover)
  - Mobile: stacks image top, text below

All text content from content.hero:
  { image, eyebrow?, headline, subline, ctaPrimary, ctaSecondary? }
  All strings: LocalizedString (render [locale] version)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — TrustBar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/TrustBar.tsx

Variants: logos-only (default) | logos-with-rating | awards-strip

logos-only:
  - Horizontal strip, no top/bottom section padding
  - Background: var(--color-backdrop-surface)
  - Border-top + border-bottom: var(--menu-divider)
  - Items centered, gap: 3rem
  - Each item: press logo image (grayscale filter, 0.6 opacity)
    hover: full color, 1.0 opacity, var(--duration-base) transition
  - If no logo image: publication name in small caps,
    var(--color-text-muted), var(--font-ui)

logos-with-rating:
  - Same as logos-only but first item is Google/Yelp rating display
  - Rating: stars + number + count ("4.8 · 312 reviews")
  - Stars: var(--color-primary) filled

Content from content.trust_bar:
  { items: Array<{ type, label, logo?, value? }> }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — MenuPreview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/MenuPreview.tsx

Variants: cards-4 (default) | cards-3 | list-with-image

cards-4:
  - Section padding: var(--section-py)
  - Optional eyebrow + headline + subline
  - 4-column grid of featured menu items (2 columns on mobile)
  - Each card:
    - Background: var(--color-backdrop-card)
    - Border-radius: var(--card-radius)
    - Image (if item.image): aspect-ratio 4/3, object-fit: cover
    - No image: colored placeholder using var(--color-backdrop-surface)
    - Item name: var(--font-heading), var(--size-h4),
      var(--tracking-heading)
    - Description: var(--font-body), var(--size-small),
      var(--color-text-secondary), 2-line clamp
    - Price: var(--color-primary), var(--font-ui),
      right-aligned
    - Dietary flags: icon row below description
      (vegan leaf, gf grain, etc — small icons, var(--color-text-muted))
  - "Explore the Full Menu" CTA below grid:
    variant: 'ghost', centered

Items loaded: query menu_items where site_id = siteId AND featured = true
  LIMIT 4, ordered by display_order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — AboutPreview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/AboutPreview.tsx

Variants: split-image (default) | stacked | minimal-text

split-image:
  - Two columns: 50/50 (or 55/45)
  - Left: image, full height, object-fit: cover
    subtle decorative border offset (3px var(--color-primary) border,
    offset 12px — creates layered frame effect)
  - Right: content column with padding
    Eyebrow text (optional): small caps, var(--color-primary)
    Headline: var(--size-h2), var(--font-heading)
    Body text: var(--font-body), var(--color-text-secondary),
      line-height: var(--lh-body)
    Optional stats row: 2–3 stats (value + label),
      value in var(--color-primary), var(--font-display), var(--size-h2)
    CTA: ghost button, margin-top: 2rem
  - Mobile: stacks image top, content below

Content: content.about_preview
  { image, eyebrow?, headline, body, stats?, cta }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — ReservationsCTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/ReservationsCTA.tsx

Variants: banner (default) | split | minimal

banner:
  - Full-width strip, padding: 4rem 0
  - Background: var(--color-primary) with slight texture overlay
  - Text color: var(--color-text-inverse) (dark on gold for noir-saison)
  - Headline: centered, var(--size-h2), var(--font-heading)
  - Subline (optional): var(--size-body), 0.8 opacity
  - Urgency note (optional): italic, var(--size-small),
    margin-bottom: 1.5rem before CTA
    (e.g. "Currently booking 2–3 weeks ahead")
  - CTA button: dark/inverse style, var(--btn-radius)
  - Mobile: stack all elements, full-width button

Content: content.reservations_cta
  { headline, subline?, ctaLabel, ctaHref, urgencyNote? }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — TestimonialCarousel (REUSE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse existing TestimonialCarousel from medical system.
Restyle with restaurant CSS variables only — no logic changes.

Adjustments:
  - Background: var(--color-backdrop-secondary)
  - Quote marks: var(--color-primary), var(--font-display), 6rem
  - Author name: var(--font-heading)
  - Occasion tag: small pill, var(--color-primary-50) bg,
    var(--badge-radius)
  - Star rating: var(--color-primary) filled stars
  - Prev/Next arrows: var(--color-border), hover var(--color-primary)

Content: content.testimonials
  { headline?, items: [{ quote, author, occasion, rating }] }
  All quote fields: LocalizedString

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — EventsPreview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/EventsPreview.tsx

Variants: cards-3 (default) | cards-2 | list

cards-3:
  - Section padding + optional headline
  - 3-column grid of upcoming event cards (1 column mobile)
  - Each EventCard:
    - Image (if present): aspect-ratio 16/9
    - Date badge: absolute top-left, var(--color-primary) bg,
      inverse text, var(--badge-radius)
      Format: "Dec 15" in var(--font-ui)
    - Event type badge: pill, var(--color-backdrop-surface),
      var(--color-text-secondary)
    - Title: var(--font-heading), var(--size-h4)
    - Short description: 2-line clamp
    - Price per person (if set): "From $195/person"
    - "Reserve Your Spot" or "Learn More" CTA
    - Border-radius: var(--card-radius)
    - Hover: translateY(var(--hover-lift)) shadow upgrade
  - "View All Events" CTA below grid

Data: query events table WHERE site_id = siteId
  AND published = true AND start_datetime > NOW()
  ORDER BY start_datetime ASC LIMIT 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — GalleryPreview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/GalleryPreview.tsx

Variants: grid-4 (default) | masonry-6 | strip

grid-4:
  - 4-column uniform grid (2 mobile)
  - Items: featured gallery_items, up to 4
  - Each item: aspect-ratio 1/1 (square), object-fit: cover
    Hover: subtle overlay with caption text (if caption set)
    Overlay: rgba(0,0,0,0.5), caption in white
  - Border-radius: var(--card-radius)
  - "View Full Gallery" CTA below grid

Data: query gallery_items WHERE site_id = siteId AND featured = true
  ORDER BY display_order ASC LIMIT 4 (or 6 for masonry)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — BlogPreview (REUSE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse BlogGrid / BlogCard from medical system.
Restyle with restaurant CSS variables.

Adjustments:
  - Card: var(--card-radius), var(--color-backdrop-card)
  - Category badge: var(--color-primary-50) bg, var(--badge-radius)
  - Date: var(--color-text-muted), var(--font-ui), var(--size-small)
  - Title: var(--font-heading)
  - Excerpt: var(--font-body), var(--color-text-secondary)
  - "Read More" → arrow icon, var(--color-primary)

Data: query blog_posts WHERE site_id = siteId AND published = true
  AND featured = true ORDER BY published_at DESC LIMIT 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE SEO — Home
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title: seo.pages?.home?.title?.[locale] ?? seo.title[locale],
  description: seo.pages?.home?.description?.[locale] ?? seo.description[locale],
  openGraph: {
    images: [seo.og_image],
    type: 'website',
  },
  alternates: {
    canonical: `https://themeridian.com/${locale}`,
    languages: { 'en': '/en', 'zh': '/zh', 'es': '/es' }
  }
}

Add Restaurant schema.org to page:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": site.name.en,
  "description": seo.description.en,
  "url": "https://themeridian.com/en",
  "telephone": site.phone,
  "address": { "@type": "PostalAddress", ... },
  "servesCuisine": site.cuisine.en,
  "priceRange": "$$$$",
  "hasMenu": "https://themeridian.com/en/menu",
  "acceptsReservations": true,
  "openingHoursSpecification": [...from site.hours]
}
</script>

VERIFY:
- All 9 sections render on meridian.local:3060/en
- Hero: full viewport, dark overlay, Cormorant Garamond headline,
  gold CTA button visible without scrolling
- TrustBar: 3 press logos visible, grayscale with hover color
- MenuPreview: 4 featured dinner items with name, price, dietary flags
- AboutPreview: split-image with chef photo (placeholder) and text
- ReservationsCTA: gold banner with urgency note
- TestimonialCarousel: 5 reviews, auto-advance, gold quote marks
- EventsPreview: 3 upcoming events with date badges
- GalleryPreview: 4 photos in grid
- BlogPreview: 3 articles with category badges
- Edit any section field in admin → save → frontend updates
- Switch hero variant dark-overlay → split-text → visual changes
- Lighthouse home page score ≥ 90 Performance
- Zero console errors
```

### Done-Gate 1B

- [ ] All 9 sections render without errors on `/en`, `/zh`, `/es`
- [ ] Hero: full viewport height, transparent-header overlay, CTA visible above fold
- [ ] All section content loads from Supabase (not hardcoded)
- [ ] Edit section in admin Form mode → Save → frontend change visible
- [ ] Switch section variant in admin → Save → visual layout changes
- [ ] Reorder sections in layout.json → Save → page order changes
- [ ] Featured menu items loading from `menu_items` DB table
- [ ] Events loading from `events` DB table (upcoming only)
- [ ] Gallery items loading from `gallery_items` DB table
- [ ] Blog articles loading from `blog_posts` DB table
- [ ] Restaurant schema.org in page source (validate with Rich Results Test)
- [ ] Lighthouse ≥ 90 Performance on home page
- [ ] `git commit: "feat: phase-1B — homepage all 9 sections, Restaurant schema.org"`

---

## Prompt 1C — Menu System: Hub + CategoryNav + MenuItem

**Goal:** Build the core menu system — the most-visited feature on any restaurant site. MenuCategoryNav must be sticky, mobile-friendly, and smooth. MenuItem must handle all 3 display variants, dietary flags, allergens, and price edge cases.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — menu-category-nav, menu-section, menu-item sections
Reference: @a6_content_contracts.md — MenuCategory, MenuItem, WineListItem, CocktailItem interfaces

Build the restaurant menu system — 3 components.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 1 — MenuCategoryNav (HIGH EFFORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/menu/MenuCategoryNav.tsx

Data: load menu_categories WHERE site_id = siteId
  AND menu_type = currentMenuType ORDER BY display_order ASC

Variants: tabs (default) | sidebar | dropdown

tabs variant (for most menu types):
  - Horizontal scrollable tab bar
  - Sticky at top: top = var(--nav-height)
  - z-index: 40 (below header, above content)
  - Background: var(--color-backdrop) · 
    border-bottom: var(--menu-divider)
  - Each tab: category name in locale
    Inactive: var(--color-text-muted)
    Active: var(--color-text-primary), underline in var(--color-primary)
    Active indicator: 2px bottom border, var(--color-primary)
  - Hover: var(--color-text-secondary), var(--duration-base)
  - On click: smooth scroll to category section
    (use IntersectionObserver to update active tab on scroll)
  - Mobile: horizontally scrollable with momentum scroll,
    no scrollbar visible, fade mask at edges

sidebar variant (for wine list):
  - Fixed left sidebar on desktop (240px wide)
  - Scrollable list of categories
  - Same active/hover states as tabs
  - Mobile: collapses to dropdown

dropdown variant (for tasting-menu / prix-fixe):
  - Single select dropdown showing current section
  - Mobile-first (useful when only 2–3 sections)

Smooth scroll implementation:
  - Each MenuSection has an id matching category.slug
  - Nav click → window.scrollTo({ behavior: 'smooth' })
    targeting section top minus (navHeight + tabBarHeight + 16px)
  - IntersectionObserver threshold: 0.3 — update active
    tab when section enters viewport

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 2 — MenuItem (HIGH EFFORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/menu/MenuItem.tsx

Variants: text-only (default) | with-photo | featured

Text-only (standard dinner/cocktail items):
  - Horizontal layout: [Name + Description] [Price]
  - Border-bottom: var(--menu-divider)
  - Padding: var(--menu-item-py) 0
  - Name: var(--font-heading), var(--size-menuName),
    var(--tracking-heading), var(--color-text-primary)
  - Description: var(--font-body), var(--size-menuDesc),
    var(--color-text-secondary), margin-top: 4px
  - Price: var(--font-ui), var(--size-menuPrice),
    var(--color-primary), white-space: nowrap

Price edge cases:
  - item.price = null AND item.price_note: show note text only
    e.g. "Market Price" / "时令价格"
  - item.price_range: show "$38–$65" format
  - item.price_note: show below price in smaller text
    e.g. "per person" / "includes wine pairing"

Dietary flags row (if item.dietary_flags.length > 0):
  - Small icon + label pills below description
  - Icons: leaf (vegan/vegetarian), grain (GF), drop (dairy-free), etc.
  - Max 3 visible + "+N more" if more than 3
  - Colors: var(--color-primary-50) bg on dark, or light tint on light

Special badges (absolute positioned, top-right of name):
  - seasonal: amber pill "Seasonal" / "时令" / "Temporada"
  - new_item: var(--color-primary) pill "New" / "新品" / "Nuevo"
  Both use var(--badge-radius)

with-photo variant:
  - Grid: [Image 120×90px] [Name + Desc + Price]
  - Image: object-fit: cover, var(--card-radius)
  - Otherwise same as text-only for text content

featured variant (for homepage menu-preview and featured dishes):
  - Card layout (vertical)
  - Image: aspect-ratio 4/3, full width
  - Content below: name, description (2-line clamp), price
  - Hover: translateY(var(--hover-lift)) + shadow upgrade

Data shape (from menu_items table):
  { id, name, description, price, price_note, price_range,
    image, dietary_flags, allergens, featured, seasonal,
    seasonal_note, new_item, spice_level, available }
  All text fields: LocalizedString — render [locale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT 3 — MenuSection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/menu/MenuSection.tsx

Wraps a menu_category and all its menu_items.

Props: category (MenuCategory) · items (MenuItem[]) · locale

Layout:
  - Section id={category.slug} (for sticky nav scroll targeting)
  - Category heading: var(--size-h3), var(--font-heading),
    var(--tracking-heading), margin-bottom: 2rem
  - Optional category description: italic,
    var(--color-text-secondary), margin-bottom: 1.5rem
  - List of MenuItem components
    Standard items: text-only variant
    Wine items: wine-list sub-variant (adds vintage, region, producer)
    Cocktail items: cocktail sub-variant (adds spirit, method)

WineListItem additional display:
  - Producer name: below wine name, smaller, var(--color-text-muted)
  - Region + vintage: small, italic, var(--color-text-muted)
  - Glass price / Bottle price layout:
    "Glass $18 · Bottle $72"
  - Tasting notes: hidden by default, expandable on click (accordion)

DietaryLegend:
  File: components/menu/DietaryLegend.tsx
  Shows which dietary icons appear in this menu with explanations.
  Compact horizontal strip above or below menu sections.
  Only shows icons that are actually used in the current menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA LOADING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each menu page (e.g. /menu/dinner):
  1. Load categories: SELECT * FROM menu_categories
     WHERE site_id = siteId AND menu_type = 'dinner'
     AND active = true ORDER BY display_order
  2. Load items: SELECT * FROM menu_items
     WHERE site_id = siteId AND category_id IN (...categoryIds)
     AND available = true ORDER BY display_order
  3. Group items by category_id
  4. Pass to MenuSection components

VERIFY:
- /en/menu/dinner loads all 5 dinner categories
- CategoryNav: tabs for Appetizers, Pasta, Mains, Sides, Desserts
- Click tab → smooth scrolls to section (no abrupt jump)
- Scroll through page → active tab updates automatically
- MenuItem: text-only variant shows name, description, price, flags
- MenuItem: dietary flags icons visible (test with GF and Vegan items)
- MenuItem: market-price item shows "Market Price" (no number)
- Wine list (if accessed): shows producer, region, glass/bottle prices
- Seasonal badge and New badge visible on correct items
- DietaryLegend: only shows icons used in current menu
- Mobile: CategoryNav is horizontally scrollable, no overflow
- Mobile: Each MenuItem readable, price not wrapping weirdly
```

### Done-Gate 1C

- [ ] MenuCategoryNav tabs render for all categories in dinner menu
- [ ] Click tab → smooth scroll to section (offset accounts for nav + tab bar height)
- [ ] Scroll page → active tab updates via IntersectionObserver
- [ ] Mobile: tabs scroll horizontally, momentum scroll, no visible scrollbar
- [ ] MenuItem: all 3 variants render correctly (text-only, with-photo, featured)
- [ ] Price edge cases: null price shows "Market Price", price_range shows range
- [ ] Dietary flags: icons correct, pill labels, max 3 + overflow
- [ ] Seasonal badge + New badge display on flagged items
- [ ] WineListItem: producer, region, vintage, glass/bottle price display
- [ ] DietaryLegend: only shows used icons
- [ ] Admin: adding a new menu_item → appears on page (no code change)
- [ ] Admin: setting item.available = false → item disappears from frontend
- [ ] `git commit: "feat: phase-1C — MenuCategoryNav, MenuItem (3 variants), MenuSection, DietaryLegend"`

---

## Prompt 1D — Individual Menu Pages

**Goal:** Build the 5 enabled menu pages using the menu system from 1C. Each page has its own hero, sticky category nav, all sections, and a reservation CTA at the bottom.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — menu-category-nav, menu-section
Content paths: 'pages/menu', 'pages/menu-dinner', 'pages/menu-cocktails',
               'pages/menu-wine', 'pages/menu-seasonal', 'pages/menu-tasting'

Build 6 menu pages. Each page follows the same pattern.
Use the MenuCategoryNav, MenuSection, MenuItem, DietaryLegend
components built in 1C.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Menu Hub  /[locale]/menu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/menu/page.tsx

Sections:
  1. Page hero (compact, not full-viewport):
     - Height: 40vh min
     - Headline: "Our Menus" / "我们的菜单" / "Nuestros Menús"
     - Subline from content
  2. Menu type cards grid:
     - 2×3 or 3×2 grid of cards, one per enabled menu type
     - Each card: image, menu type name, brief description, "View Menu →"
     - Feature-gated: only show cards for enabled menu types
     (check site.json features: wine_list, cocktail_menu, seasonal_menu,
      kids_menu, happy_hour flags)
     - Card style: var(--card-radius), hover: var(--hover-lift) + shadow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Dinner Menu  /[locale]/menu/dinner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/menu/dinner/page.tsx

Sections (in order):
  1. MenuHero (compact):
     Headline: "Dinner" / "晚餐" / "Cena"
     Note: hours / available days from site.hours
  2. MenuCategoryNav (tabs variant, sticky)
  3. MenuSection × 5 (Appetizers, Pasta, Mains, Sides, Desserts)
     Each renders all available items for that category
  4. DietaryLegend (bottom, shows all flags used in dinner menu)
  5. ReservationsCTA (minimal variant, "Reserve Your Table")

SEO: title = "Dinner Menu | The Meridian"
     description = 25 words, includes "New York"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Tasting Menu  /[locale]/menu/tasting-menu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections:
  1. MenuHero: "Tasting Menu" / "品鉴菜单"
     Include: "X courses · $Y per person · Wine pairing available"
     (from content/pages/menu-tasting.json)
  2. MenuCategoryNav (dropdown variant — fewer sections)
  3. MenuSection × 2 (Menu, Wine Pairing Add-On)
  4. Private dining CTA block
  5. ReservationsCTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Cocktail Menu  /[locale]/menu/cocktails
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections:
  1. MenuHero: "Cocktails" / "鸡尾酒"
  2. MenuCategoryNav (tabs: Signature, Classics, Low-ABV)
  3. MenuSection × 3
     CocktailItem sub-variant: show base_spirit, method below name
     Signature cocktails: show bartender credit (small, italic)
  4. DietaryLegend (for any non-alcoholic / vegan flags)
  5. ReservationsCTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Wine List  /[locale]/menu/wine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections:
  1. MenuHero: "Wine List" / "酒单"
  2. MenuCategoryNav (sidebar variant — 5 sections)
  3. MenuSection × 5 (Sparkling, White, Red, Rosé, Dessert)
     WineListItem sub-variant for all items
  4. ReservationsCTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Seasonal  /[locale]/menu/seasonal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections:
  1. MenuHero: "Seasonal Specials" / "时令菜单"
     Include seasonal note: "Updated monthly. Ask your server for today's features."
  2. MenuSection × 1 (all seasonal items, no sub-categories)
     SeasonalBadge on every item (it's a seasonal-only page)
  3. "Back to Full Menu" link
  4. ReservationsCTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALL MENU PAGES — SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each page exports metadata:
  title: "{Menu Type} Menu | The Meridian"
  description: from seo.json pages.{menu-slug} (seeded in 0E)
  canonical: https://themeridian.com/{locale}/menu/{slug}
  og:image: hero image for this menu page

Add MenuItems schema.org on each menu page:
{
  "@type": "Menu",
  "hasMenuSection": [
    {
      "@type": "MenuSection",
      "name": category.name.en,
      "hasMenuItem": [
        { "@type": "MenuItem", "name": item.name.en,
          "description": item.description.en,
          "offers": { "@type": "Offer", "price": item.price/100 } }
      ]
    }
  ]
}

VERIFY:
- /en/menu shows hub with 5 menu type cards (dinner, tasting, cocktails, wine, seasonal)
- /en/menu/dinner: 5 categories, all items loaded, sticky nav works
- /en/menu/cocktails: 3 categories, base_spirit shown below each cocktail name
- /en/menu/wine: sidebar nav, 5 sections, glass/bottle price columns
- Disable 'wine_list' feature in admin → /menu hub card disappears
- All 6 menu pages have unique SEO title + description in page source
- MenuItems schema.org validates on Rich Results Test for dinner page
```

### Done-Gate 1D

- [ ] Menu hub shows only feature-flag-enabled menu types as cards
- [ ] All 5 menu detail pages render all items from DB
- [ ] Dinner: 5 categories with all seeded items visible
- [ ] Cocktails: base_spirit + method visible below cocktail names
- [ ] Wine: sidebar nav working, glass/bottle prices showing
- [ ] Seasonal: all 6 seasonal items, SeasonalBadge on each
- [ ] All menu pages have unique SEO title + description
- [ ] MenuItems schema.org validates for at least dinner page
- [ ] Disable feature flag in admin → menu hub card disappears
- [ ] `git commit: "feat: phase-1D — all 5 menu pages, hub, schema.org"`

---

## Prompt 1E — About + Team Pages

**Goal:** Build the chef identity pages — the second most important credibility asset after menus. The chef hero must be full-bleed and command the page. The team grid must feel premium, not like a corporate directory.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — chef-hero-full, about-preview, team-grid sections
Content paths: 'pages/about', 'pages/team'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: About  /[locale]/about
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/about/page.tsx

Sections:
1. Hero (compact hero-split-ambiance variant, image-right):
   Headline: "Our Story" / "我们的故事"
   Eyebrow: "EST. 2018" (from site.founding_year)

2. Practice Story (custom section, no variant):
   Long-form text section — the restaurant's founding narrative
   Layout: single column, max-width 720px, centered
   Typography: var(--size-h4) leading paragraph, then var(--size-body)
   Pull quote: wider than column, left border var(--color-primary) 3px,
     padding-left: 2rem, italic, var(--size-h4)

3. Mission & Values:
   3-column grid of values (icon + heading + description)
   Icons: simple SVG or emoji — food/nature themed
   Background: var(--color-backdrop-surface)

4. Team Preview:
   Display featured team_members (where featured = true)
   Each: circular or square photo (var(--card-radius)),
     name, role[locale]
   Max 3 shown, "Meet the Full Team" CTA

5. Awards Preview (if press_section feature enabled):
   Horizontal strip of award badges/press items (is_award = true)
   Each: logo or name, award title, year

6. ReservationsCTA (minimal variant)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT: ChefHeroFull
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/ChefHeroFull.tsx

Variants: full-bleed (default) | contained

full-bleed:
  - Full viewport width, 70–80vh height
  - Chef portrait image: left 40% of width, full height,
    object-position: top center (face visible)
  - Right 60%: dark overlay panel, content column
    Background: linear-gradient from transparent to
      var(--color-backdrop) 60% (left to right)
  - Content (in right panel):
    Small caps label: "EXECUTIVE CHEF & FOUNDER"
      var(--tracking-label), var(--font-ui), var(--color-primary)
    Name: var(--size-h1), var(--font-display), var(--tracking-display)
    Philosophy quote:
      Large italic text, var(--size-h3), var(--font-display)
      Decorative opening quote mark in var(--color-primary), very large
    Credentials: small pills/list below quote
      var(--badge-radius), var(--color-backdrop-surface) bg
    Awards: smaller, var(--color-text-muted)
  - Mobile: stacks — portrait photo top 50vh, content below

Data: first featured team_member where department = 'culinary'
  Fields used: photo_portrait, name, role, philosophy, credentials, awards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Team  /[locale]/about/team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/about/team/page.tsx

Sections:
1. Compact page hero:
   "The Team" / "团队介绍" / "El Equipo"

2. ChefHeroFull (Executive Chef — full-bleed variant):
   Load first team_member where featured = true AND department = 'culinary'

3. ChefProfileCard grid (remaining team members):
   File: components/sections/TeamGrid.tsx
   
   Variants: 3-col (default) | 4-col | featured-first
   
   3-col:
     - 3-column grid (stacks to 1 on mobile)
     - Each ChefProfileCard:
       Photo: aspect-ratio 3/4 (portrait), object-fit: cover
         Hover: slight zoom (scale 1.02), var(--duration-base)
       Below photo:
         Name: var(--font-heading), var(--size-h4)
         Role: var(--color-primary), var(--font-ui), var(--size-small),
           var(--tracking-label), uppercase
         short_bio: 2-line clamp, var(--color-text-secondary)
         Credentials: comma-separated, var(--size-small),
           var(--color-text-muted), italic
       Card: var(--card-radius), no shadow (noir-saison = flat),
         var(--card-pad) padding-bottom only

   Load: all team_members WHERE site_id = siteId AND active = true
     AND featured = false ORDER BY display_order
     (featured member shown in ChefHeroFull above)

4. ReservationsCTA (split variant):
   "Experience Marcus's Menu"

SEO:
  About: title = "About The Meridian | Contemporary American in New York"
  Team:  title = "Our Team | The Meridian"
  Both: canonical, og:image = chef portrait photo

VERIFY:
- /en/about: 5 sections render, pull quote styled with left border
- ChefHeroFull: portrait left, content right, philosophy quote visible
- Featured team members visible in About team-preview section
- /en/about/team: ChefHeroFull full-bleed + 4 profile cards below
- ChefProfileCard: 3/4 aspect ratio photos, name, role, credentials
- Awards strip visible (if press_section feature enabled)
- All content loads from DB (team_members table + content_entries)
- Admin: update team member role → page reflects change
```

### Done-Gate 1E

- [ ] `/en/about` renders all 5 sections from DB
- [ ] Pull quote section styled with primary-color left border
- [ ] ChefHeroFull: portrait left, content panel right, philosophy quote prominent
- [ ] Featured chef credentials render as pills/badges
- [ ] `/en/about/team` renders ChefHeroFull + team grid
- [ ] Team grid: 3/4 portrait aspect ratio, hover zoom, role in primary color
- [ ] Team data loading from `team_members` DB table (not hardcoded)
- [ ] Mobile: ChefHeroFull stacks portrait top / content below
- [ ] `git commit: "feat: phase-1E — About page, Team page, ChefHeroFull, ChefProfileCard"`

---

## Prompt 1F — Reservations Page — All 3 Widget Variants

**Goal:** The most conversion-critical page. Must work on every device and handle all 3 reservation providers. The custom form must save to DB and send a confirmation email.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — reservation-widget-* sections
Reference: @a6_content_contracts.md — ReservationConfig, Booking interfaces
Content path: 'pages/reservations'

Build the Reservations page and all 3 widget variants.
The active variant is determined by site.json features.reservation_provider.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE: Reservations  /[locale]/reservations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/reservations/page.tsx

Sections:
1. Compact hero:
   Headline: "Reserve a Table" / "预订餐位" / "Reservar Mesa"
   Subline: "We look forward to welcoming you" (from content)

2. Reservation widget (variant = features.reservation_provider):
   - 'resy'   → ReservationWidgetResy
   - 'opentable' → ReservationWidgetOpenTable
   - 'custom' → ReservationWidgetCustom
   - 'phone-only' → PhoneOnlyReservation

3. Reservation info block:
   - Hours table (from site.json.hours)
   - Address + directions link
   - Parking notes (from content.policies.parking)
   - Dress code (from content.policies.dress_code)
   - Cancellation policy (from content.policies.cancellation)
   - Accessibility (from content.policies.accessibility)

4. Private dining CTA (if features.private_dining = true):
   "Hosting a private event?" → link to /reservations/private-dining

5. Mini FAQ (4–5 reservation-specific questions, FAQAccordion reuse):
   Sourced from faq items with tag 'reservations'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WIDGET 1 — ReservationWidgetResy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/reservations/ReservationWidgetResy.tsx

- Loads Resy embed script with venue_id and api_key
  from site.json features.resy_venue_id + features.resy_api_key
- Theme override: inject Resy CSS variables to match our
  var(--color-primary) and var(--btn-radius)
- Container: max-width 640px, centered, var(--card-pad) padding
- Fallback (if script fails to load): show phone reservation option
  "Reserve by phone: {site.phone_display}"
- Loading skeleton: placeholder while Resy iframe loads

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WIDGET 2 — ReservationWidgetOpenTable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/reservations/ReservationWidgetOpenTable.tsx

- Loads OT embed with rid from site.json features.opentable_id
- Theme override: match primary color
- Same container and fallback pattern as Resy widget

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WIDGET 3 — ReservationWidgetCustom (HIGH EFFORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/reservations/ReservationWidgetCustom.tsx

Step 1 — Date & Party Size:
  - Date picker: calendar UI (no external library needed —
    build simple month grid with prev/next arrows)
    Available dates: any date within advance_days_min to advance_days_max
    Blackout dates: grayed out, not selectable
    Style: var(--color-primary) for selected, var(--card-radius)
  - Party size: increment/decrement buttons (1–10)
    Large party (≥ 8): show note "For large parties, please call"
    (if party_large_min is set in config)
  - "Find a Table" button: loads time slots for selected date + party size

Step 2 — Time Slot Grid:
  - Grid of available time slots (from config.time_slots array)
  - Example slots: 5:30 PM, 6:00 PM, 6:30 PM... 9:30 PM
  - Slot pill style: var(--btn-radius), border var(--color-border)
  - Selected: var(--color-primary) bg, inverse text
  - Loading state: skeleton placeholders while "fetching"
  - If no slots: "No availability for this date. Please try another."

Step 3 — Guest Details:
  - First name + Last name (required)
  - Email (required, validation)
  - Phone (required if config.require_phone = true)
  - Occasion: dropdown (Birthday, Anniversary, Business, Date Night, Other)
  - Special requests: textarea
  - Summary: "Table for {N} · {Day}, {Month} {Date} · {Time}"
  - Confirm Reservation button

Form submission (POST /api/reservations):
  1. Validate all required fields (inline errors, no alert())
  2. Loading state on button during submit
  3. Generate confirmation_code: 6-char alphanumeric (e.g. "MER-4K9P")
  4. INSERT into bookings table (status: 'confirmed')
  5. Send confirmation email via Resend:
     To: guest.email
     From: site.email_reservations
     Subject: "Your reservation at The Meridian — {confirmation_code}"
     Body: Date, time, party size, address, cancellation policy,
       "Add to Calendar" links (Google Calendar, ICS file)
  6. Show confirmation screen:
     Large checkmark, confirmation code prominent
     Date/time/party size summary
     Address + directions link
     "Add to Google Calendar" button
     Cancellation policy note
     "Make Another Reservation" link

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHONE-ONLY (when reservation_provider = 'phone-only')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Simple card:
  Phone number: large, clickable
  Hours for reservations
  "We'll confirm via email"
  Contact form as backup

VERIFY:
- /en/reservations: loads correct widget based on reservation_provider
- Custom form: date picker works, no past dates selectable
- Custom form: party size increment/decrement, large party note at ≥8
- Custom form: time slots grid shows correctly after date + size selected
- Custom form: all validations fire inline (not alert boxes)
- Custom form: submit → booking saved in Supabase bookings table
- Custom form: confirmation email sent (check Resend dashboard)
- Custom form: confirmation screen shows code and calendar links
- Resy/OT widgets: embed loads (use test venue ID)
- Info block: hours, address, parking, dress code, cancellation policy all visible
- Private dining CTA shows (feature_gate: private_dining = true)
- Mobile: form inputs 44px+ touch targets, no horizontal overflow
- StickyBookingBar HIDDEN on this page (already on reservations page)
```

### Done-Gate 1F

- [ ] Reservation page renders with correct widget based on `reservation_provider`
- [ ] Custom widget: date picker navigates months, blackout dates blocked
- [ ] Custom widget: party size 1–10, large party note fires at ≥ 8
- [ ] Custom widget: time slots load after date selection
- [ ] Custom widget: all form validations fire inline
- [ ] Custom widget: submit → row in `bookings` table in Supabase
- [ ] Custom widget: confirmation email arrives (verify Resend dashboard)
- [ ] Custom widget: confirmation screen shows code + calendar links
- [ ] Reservation info block: hours/address/policies all rendering from DB
- [ ] Private dining CTA visible (feature flag enabled)
- [ ] StickyBookingBar hidden on this page
- [ ] Mobile: all inputs accessible, no horizontal scroll
- [ ] `git commit: "feat: phase-1F — reservations page, 3 widget variants, confirmation email"`

---

## Prompt 1G — Contact Page + Hours Display

**Goal:** The information page. Must load all contact data from site.json — zero hardcoded strings. Map embed, clickable phone/email, hours table, and a simple contact form with DB storage.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_CONTENT_CONTRACTS.md — contact-info-block section
Content path: 'pages/contact'

Build the Contact page at app/[locale]/contact/page.tsx.

Sections:
1. Compact hero:
   "Find Us" / "联系我们" / "Encuéntranos"

2. Contact Info + Map — Two-column layout:
   Left column (ContactInfoBlock component):
     Phone:
       Label: "Reservations" / "预订电话" / "Reservas"
       Number: site.phone_display, as <a href="tel:{site.phone}">
       Style: large, var(--font-heading)

     Email:
       Label: "General Inquiries" / "一般咨询"
       Email: site.email, as <a href="mailto:{site.email}">

     Address:
       site.address.full[locale]
       "Get Directions" link → site.social.google_maps (new tab)

     Hours:
       Full weekly schedule from site.hours
       Monday: "Closed" (null hours)
       Tue–Thu: "5:30 PM – 10:30 PM"
       Fri–Sat: "5:30 PM – 11:00 PM"
       Sun: "5:00 PM – 9:30 PM"
       Note: site.hours.note[locale] (kitchen close note)
       Format hours: convert "17:30" → "5:30 PM"
         (12-hour format for EN, 24-hour for ZH/ES based on locale)
       Today highlighted: detect current day →
         highlight that row var(--color-primary-50) bg

     Parking & Transit note (from content, optional):
       Icon + text block

   Right column (MapEmbed — REUSE from medical system):
     site.google_maps_embed_url
     Height: 400px, border-radius: var(--card-radius)
     Responsive: full width on mobile

3. Contact Form:
   Heading: "Send Us a Message" / "发送消息" / "Envíanos un Mensaje"
   Fields:
     - Name (required)
     - Email (required)
     - Phone (optional)
     - Message (required, textarea)
   Submit: POST /api/contact
     → INSERT into contact_submissions table
     → Send notification email to site.email via Resend
   Confirmation: inline success message below form
   Style: inputs var(--color-backdrop-surface) bg,
     var(--card-radius) border, focus: var(--color-primary) border

4. OpenHoursDisplay component (REUSE from medical system):
   Inline "Open Now" / "Currently Closed" badge based on
   current time vs site.hours.
   Show in header area or below contact info block.

PAGE SEO:
  title: "Contact & Hours | The Meridian — New York"
  description: from seo.json
  schema.org: add address/phone/hours to existing Restaurant schema

VERIFY:
- Phone number: clickable tel: link on mobile
- Email: clickable mailto: link
- Map embed renders (use placeholder embed URL if real not available)
- Hours: today's row highlighted
- Hours: "Closed" shows for Monday
- Hours: 24-hour format on /zh/contact, 12-hour on /en/contact
- Contact form: submits → row in contact_submissions table
- Contact form: inline success message (no page reload)
- Contact form: validation fires inline
- OpenHoursDisplay: shows "Open Now" or "Closed" correctly
- All data from site.json (change phone in admin → contact page updates)
```

### Done-Gate 1G

- [ ] Phone is `<a href="tel:...">` (clickable on mobile)
- [ ] Email is `<a href="mailto:...">` (clickable)
- [ ] Map embed renders from `site.google_maps_embed_url`
- [ ] Hours table: today highlighted, Monday shows Closed
- [ ] Hours locale-aware: 12-hour for EN, 24-hour for ZH/ES
- [ ] `OpenHoursDisplay` shows correct open/closed status
- [ ] Contact form: submit → row in `contact_submissions` table
- [ ] Contact form: inline success message on submit
- [ ] All contact data from `site.json` via DB (no hardcoded strings)
- [ ] `git commit: "feat: phase-1G — contact page, hours display, contact form"`

---

## Prompt 1H — i18n Routing — All Pages EN / ZH / ES

**Goal:** Verify every core page works in all three locales. Fix any broken translations, missing locale content, or routing issues. This is a verification + fix pass, not a build pass.

```
You are building BAAM System R — Restaurant Premium.
Run a systematic i18n verification pass across all core pages.

For each page, test all 3 locales. Fix any issues found.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTING CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify these routes all return 200 (no 404, no redirect loops):
  /en           /zh           /es
  /en/menu      /zh/menu      /es/menu
  /en/menu/dinner  /zh/menu/dinner  /es/menu/dinner
  /en/menu/cocktails /zh/menu/cocktails /es/menu/cocktails
  /en/menu/wine    /zh/menu/wine    /es/menu/wine
  /en/about     /zh/about     /es/about
  /en/about/team   /zh/about/team   /es/about/team
  /en/reservations /zh/reservations /es/reservations
  /en/contact      /zh/contact      /es/contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT CHECK (per locale)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each page × locale verify:
1. Hero headline renders in correct language (not fallback EN)
2. Navigation labels in correct language
3. CTA buttons in correct language
4. Menu item names and descriptions in correct language
5. Hours format: EN = 12-hour, ZH/ES = 24-hour
6. Team member roles in correct language
7. Footer: hours, tagline, copyright in correct language
8. StickyBookingBar CTA label in correct language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HREFLANG VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On every page, verify <head> contains:
  <link rel="alternate" hreflang="en"      href="https://themeridian.com/en/{path}" />
  <link rel="alternate" hreflang="zh-Hans" href="https://themeridian.com/zh/{path}" />
  <link rel="alternate" hreflang="es"      href="https://themeridian.com/es/{path}" />
  <link rel="alternate" hreflang="x-default" href="https://themeridian.com/en/{path}" />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON ISSUES TO FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If any LocalizedString field falls back to English when ZH/ES
locale is active: check content_entries — ensure zh/es locale
rows exist for that path. If missing, seed them.

If any component renders raw LocalizedString object
{ en: "...", zh: "..." } instead of the locale value:
  - Ensure all text rendering uses: content[locale] ?? content.en
  - Add a helper: getLocale(field, locale) that handles fallback

If LanguageSwitcher redirects incorrectly:
  - Ensure it generates: /{targetLocale}/{currentPath}
  - Not: /{targetLocale} (drops current path)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FALLBACK BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When ZH or ES content is missing for a field:
  - Fall back to EN value silently (no error thrown)
  - Do NOT show raw object or undefined on page

When the ZH/ES locale row is missing from content_entries:
  - Load EN locale row as fallback
  - Log a warning (do not crash)

VERIFY all routes above return 200 with correct locale content.
Fix any issues. Run npm run build — zero errors.
```

### Done-Gate 1H

- [ ] All 27 locale routes return 200 (9 pages × 3 locales)
- [ ] ZH locale: hero headlines in Chinese on all pages
- [ ] ZH locale: nav labels in Chinese
- [ ] ZH locale: menu item names/descriptions in Chinese
- [ ] ES locale: all UI strings in Spanish
- [ ] Hours format: 12-hour on EN, 24-hour on ZH + ES
- [ ] `hreflang` tags correct in page source on all core pages
- [ ] Language switcher preserves current path on locale switch
- [ ] LocalizedString fallback: no raw objects rendered on any page
- [ ] `npm run build` — zero TypeScript/build errors
- [ ] `git commit: "feat: phase-1H — i18n verification pass, all 9 core pages × 3 locales"`

---

## Phase 1 Completion Gate

All items below must pass before starting Phase 2.

| Requirement | Pass? |
|---|---|
| Header transparent-to-opaque scroll behavior working | |
| Mobile nav overlay opens/closes cleanly | |
| Footer: all 4 columns rendering from DB | |
| StickyBookingBar: mobile only, hidden on /reservations | |
| Homepage: all 9 sections render without errors | |
| Homepage: content editable in admin (Form + JSON + variant) | |
| Homepage: Lighthouse ≥ 90 Performance | |
| Menu hub: shows only enabled menu type cards | |
| All 5 menu detail pages render all DB items | |
| MenuCategoryNav: sticky, smooth scroll, IntersectionObserver active tab | |
| MenuItem: 3 variants, dietary flags, price edge cases all correct | |
| About page: 5 sections, pull quote, awards strip | |
| Team page: ChefHeroFull full-bleed + team grid | |
| Reservations: correct widget loads per reservation_provider | |
| Custom form: saves to DB, sends confirmation email | |
| Contact: clickable phone/email, map embed, hours with today highlighted | |
| All 27 locale routes return 200 (9 pages × 3 locales) | |
| ZH and ES content rendering (not falling back to EN everywhere) | |
| hreflang tags on all pages | |
| Zero hardcoded hex colors in any component | |
| `npm run build` — zero errors | |
| **Git tagged:** `v0.1-core-pages` | |

**Phase 1 complete → Proceed to `RESTAURANT_PHASE_2.md`**

---

*BAAM System R — Restaurant Premium*
*Phase 1 of 5 — Core Pages*
*Next: RESTAURANT_PHASE_2.md — Events, Gallery, Blog, Admin Editors*
