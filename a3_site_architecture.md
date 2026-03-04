# A3 — Restaurant Site Architecture
**USF Restaurant System — Stage A**
**Agent:** A3-ARCH
**Input:** a1_industry_brief.md · a2_brand_system.md
**Output:** Complete page map, section inventory, navigation, URL structure, feature flags, layout starters

---

## Section 1: Complete Page Map

Legend: FD = Fine Dining · CB = Cafe/Brunch · BL = Bar/Lounge · ALL = all sub-types
Priority: P0 = core (always built) · P1 = important · P2 = optional/future

### Core Pages

| URL Slug | Page Title | Sub-types | Priority | Notes |
|---|---|---|---|---|
| `/` | Home | ALL | P0 | Master landing page |
| `/about` | About Us | ALL | P0 | Story + mission hub |
| `/about/team` | Our Team | ALL | P0 | Chef + staff profiles |
| `/about/philosophy` | Our Philosophy | FD, CB | P1 | Sourcing, values, approach |
| `/about/awards-press` | Awards & Press | FD, BL | P1 | Media coverage, accolades |
| `/menu` | Menu Overview | ALL | P0 | Hub — links to all menu types |
| `/menu/dinner` | Dinner Menu | FD, BL | P0 | Primary menu for FD + BL |
| `/menu/lunch` | Lunch Menu | FD, CB | P1 | Midday service |
| `/menu/brunch` | Brunch Menu | CB | P0 | Primary menu for CB |
| `/menu/breakfast` | Breakfast Menu | CB | P1 | Early service cafes |
| `/menu/drinks` | Drinks | ALL | P1 | Non-alcoholic + general drinks |
| `/menu/cocktails` | Cocktail Menu | BL, FD | P0 | Primary for BL |
| `/menu/wine` | Wine List | FD, BL | P1 | Full wine program |
| `/menu/beer` | Beer List | BL, CB | P2 | Beer-focused bars |
| `/menu/desserts` | Desserts | FD, CB | P2 | Separate dessert menu |
| `/menu/kids` | Kids Menu | CB | P2 | Family restaurants |
| `/menu/seasonal` | Seasonal Specials | ALL | P1 | Rotating seasonal items |
| `/menu/happy-hour` | Happy Hour | BL, CB | P2 | Limited-time pricing |
| `/reservations` | Reservations | FD, BL | P0 | Primary booking page |
| `/reservations/private-dining` | Private Dining | FD, BL | P1 | Events + private rooms |
| `/reservations/large-parties` | Large Parties | ALL | P2 | Groups 8+ |
| `/contact` | Contact & Location | ALL | P0 | Map, hours, form, directions |
| `/book` | Book a Table | CB, ALL | P0 | Alias / direct booking entry |

### Content Pages

| URL Slug | Page Title | Sub-types | Priority | Notes |
|---|---|---|---|---|
| `/events` | Events | ALL | P1 | Listing page |
| `/events/{slug}` | Event Detail | ALL | P1 | Individual event page |
| `/gallery` | Gallery | ALL | P1 | Food + interior + events photos |
| `/blog` | Stories & Journal | ALL | P1 | Editorial content hub |
| `/blog/{slug}` | Blog Article | ALL | P1 | Individual article |
| `/press` | Press & Awards | FD, BL | P1 | Consolidated press coverage |

### Conversion Pages

| URL Slug | Page Title | Sub-types | Priority | Notes |
|---|---|---|---|---|
| `/gift-cards` | Gift Cards | ALL | P2 | Purchase + redemption |
| `/order` | Order Online | CB, BL | P2 | Delivery/pickup redirect or embed |
| `/catering` | Catering | CB | P2 | Off-site catering inquiry |
| `/careers` | Join Our Team | ALL | P2 | Job listings + apply form |
| `/loyalty` | Loyalty Program | CB | P2 | Rewards signup + info |

### Utility Pages

| URL Slug | Page Title | Sub-types | Priority |
|---|---|---|---|
| `/faq` | FAQ | ALL | P1 |
| `/allergens` | Allergen Information | ALL | P1 |
| `/accessibility` | Accessibility | ALL | P2 |
| `/privacy` | Privacy Policy | ALL | P0 |
| `/sitemap` | Sitemap | ALL | P0 |
| `/404` | Not Found | ALL | P0 |

**All pages available in configured locales:**
```
/{locale}/menu/dinner
/en/menu/dinner
/zh/menu/dinner
/es/menu/dinner
/ko/menu/dinner
```

**Total pages in master template: 42 pages + dynamic routes**

---

## Section 2: Section Inventory Per Page

### HOME

```
hero                    [required: ALL]
  variants: fullscreen-dish | split-ambiance | video-atmosphere | editorial | cafe-welcome

trust-bar               [required: FD | optional: CB, BL]
  variants: press-logos | star-ratings | awards-strip | stats-row

menu-preview            [required: ALL]
  variants: featured-dishes-grid | category-cards | single-featured | tabbed-preview

about-preview           [required: ALL]
  variants: chef-split | story-centered | team-card-row

reservations-cta        [required: FD, BL | optional: CB]
  variants: banner-split | minimal-centered | floating-card

testimonials            [required: ALL]
  variants: carousel-photo | grid-3col | masonry-wall

events-preview          [optional: ALL — show if events feature enabled]
  variants: cards-2col | featured-plus-list | carousel

gallery-preview         [optional: ALL]
  variants: masonry-4up | strip-scroll | grid-6

blog-preview            [optional: ALL — show if blog enabled]
  variants: cards-3col | featured-plus-2 | list

instagram-feed          [optional: ALL — show if instagram feature enabled]
  variants: grid-6 | strip-scroll

cta-booking             [required: ALL]
  variants: full-width-banner | split-photo | minimal-centered
```

---

### MENU/{TYPE} (all menu pages share this structure)

```
menu-hero               [required: ALL]
  variants: minimal-title | photo-banner | category-tabs-only

menu-category-nav       [required: ALL]
  variants: sticky-tabs | sticky-sidebar | dropdown-mobile | anchor-list

menu-sections           [required: ALL]
  (dynamically rendered from DB — one MenuSection per category)
  Each section contains:
    section-header      category name + optional description
    menu-items-list     list of MenuItem components

dietary-legend          [optional: ALL — show if allergen feature enabled]
  variants: inline-badges | modal-explainer | page-footer-legend

seasonal-callout        [optional: ALL]
  variants: banner-top | inline-badge-per-item

reservations-cta        [required: FD, BL | optional: CB]
  variants: bottom-banner | sticky-side-panel
```

---

### ABOUT

```
hero                    [required: ALL]
  variants: minimal-title | split-photo | full-bleed

practice-story          [required: ALL]
  variants: narrative-centered | timeline | split-alternating

mission-values          [optional: FD, CB]
  variants: cards-3col | icon-list | centered-statement

team-preview            [required: ALL]
  variants: cards-grid | carousel | featured-plus-grid
  (links to /about/team)

office-gallery          [optional: ALL]
  variants: strip-4 | grid-mosaic | fullbleed-single

awards-preview          [optional: FD, BL]
  variants: logos-row | cards | timeline

cta                     [required: ALL]
  variants: booking | contact | newsletter
```

---

### ABOUT/TEAM

```
hero                    [required: ALL]
  variants: minimal-title | team-photo-banner

team-grid               [required: ALL]
  variants: cards-3col | cards-2col | list-with-bio

featured-chef           [optional: FD]
  variants: hero-full | split-story
  (Chef gets special prominence in fine dining)

cta                     [required: ALL]
  variants: booking | contact
```

---

### RESERVATIONS

```
hero                    [required: FD, BL]
  variants: minimal-title | photo-split

reservation-widget      [required: FD, BL]
  variants: opentable-embed | resy-embed | custom-form | phone-only

reservation-info        [required: ALL]
  variants: hours-policy-split | cards | list
  (cancellation policy, dress code, parking)

private-dining-cta      [optional: FD, BL — if private dining enabled]
  variants: banner | split-photo | card

faq                     [optional: ALL]
  variants: accordion | two-column
```

---

### CONTACT

```
hero                    [required: ALL]
  variants: minimal-title | map-hero

contact-info            [required: ALL]
  variants: 3-column | split-map | stacked-mobile

map-embed               [required: ALL]
  variants: full-width | contained | split-with-info

hours-display           [required: ALL]
  variants: table | cards | inline

contact-form            [required: ALL]
  variants: minimal | full | split-with-info

parking-transit         [optional: ALL]
  variants: list | icons | map-annotation
```

---

### EVENTS (listing)

```
hero                    [required: ALL]
  variants: minimal-title | featured-event-hero

events-filter           [optional: ALL]
  variants: type-tabs | tag-pills | none

events-grid             [required: ALL]
  variants: cards-2col | cards-3col | list-chronological

past-events             [optional: ALL]
  variants: compressed-list | hidden
```

---

### EVENTS/{SLUG} (detail)

```
event-hero              [required: ALL]
  variants: photo-banner | split | minimal

event-details           [required: ALL]
  (date, time, price, location, description)

reservation-cta         [required: ALL]
  variants: inline-form | link-to-reservations | phone

related-events          [optional: ALL]
  variants: cards-2col | list
```

---

### BLOG (listing)

```
hero                    [required: ALL]
  variants: minimal-title | featured-post-hero

featured-post           [optional: ALL]
  variants: large-card | split-hero

posts-grid              [required: ALL]
  variants: cards-3col | cards-2col-large | list

category-filter         [optional: ALL]
  variants: tabs | pills | sidebar

load-more               [required: ALL]
  variants: pagination | infinite-scroll | load-more-button
```

---

### BLOG/{SLUG} (article)

```
article-hero            [required: ALL]
  variants: full-bleed-photo | contained | minimal-title

article-meta            [required: ALL]
  (author, date, category, read time)

article-body            [required: ALL]
  (rich text content, full-width)

author-bio              [optional: ALL]
  variants: card | inline | none

related-posts           [required: ALL]
  variants: cards-3col | cards-2col | list

cta                     [required: ALL]
  variants: booking | newsletter | contact
```

---

### GALLERY

```
gallery-hero            [required: ALL]
  variants: minimal-title | full-bleed-photo

gallery-filter          [optional: ALL]
  variants: category-tabs | tag-pills | none
  Categories: Food | Interior | Events | Team | Behind the Scenes

gallery-grid            [required: ALL]
  variants: masonry | grid-uniform | strip-scroll

lightbox                [required: ALL]
  (triggered on image click — overlay viewer)
```

---

## Section 3: Navigation Architecture

### Fine Dining (Noir Saison / Vélocité)

**Desktop navigation:**
```
Logo (left)     |    Menu    Reservations    About    Events    Press    |    [Reserve a Table] (CTA, right)
```
- Sticky on scroll with subtle background blur + shadow
- "Reserve a Table" = primary colored button, always visible
- Dropdowns: Menu (→ Dinner, Lunch, Wine, Cocktails, Seasonal) | About (→ Team, Philosophy, Press)
- Font: heading font, uppercase, wide letter-spacing (0.12em)

**Mobile navigation:**
- Hamburger icon (top right) + logo (top left) + "Reserve" pill button (top right, beside hamburger)
- Full-screen overlay on open
- Large touch targets (min 56px height per item)
- Order: Menu → Reservations → About → Events → Press → Contact
- Language switcher at bottom of overlay

---

### Cafe / Brunch (Matin Clair)

**Desktop navigation:**
```
Logo (left)     |    Menu    About    Events    Blog    |    [Order Online] or [Visit Us] (CTA, right)
```
- Hours badge inline in nav: "Open Now · Closes 5pm"
- Simpler structure — no reservation dropdown needed
- Dropdowns: Menu (→ Breakfast, Lunch, Drinks, Seasonal)

**Mobile navigation:**
- Hamburger + logo + "Open Now" status badge
- Full-screen overlay
- Hours prominently shown at top of mobile menu
- Order: Menu → About → Events → Blog → Contact

---

### Bar / Lounge (Noir Saison / Vélocité)

**Desktop navigation:**
```
Logo (left)     |    Drinks    Food    Events    About    Press    |    [Reserve / Walk-ins Welcome] (CTA)
```
- "Drinks" leads — not "Menu" (signal: this is a bar, not a restaurant)
- Hours badge: "Open Tonight · Until 2am"
- CTA adapts: reservation-required bars use "Reserve"; walk-in bars use "Walk-ins Welcome"

**Mobile navigation:**
- Same pattern; hours shown prominently
- "Walk-ins Welcome" or "Reserve Tonight" as floating bottom bar

---

### Language Switcher (All sub-types)

**Desktop:** Inline in nav, right side, before CTA. Text only — "EN | 中文 | ES" in small caps. Dropdown on hover/click.

**Mobile:** Bottom of full-screen nav overlay. Flag icons + language name. Full touch target row per language.

**Behavior:**
- Switches to `/{locale}/current-path` — preserves page context
- Selected locale persisted in cookie (30 days)
- Hreflang tags ensure search engines discover all versions

---

## Section 4: URL & Routing Strategy

### Full URL Pattern Reference

```
Static routes:
  /{locale}/
  /{locale}/about
  /{locale}/about/team
  /{locale}/about/philosophy
  /{locale}/about/awards-press
  /{locale}/menu
  /{locale}/menu/dinner
  /{locale}/menu/lunch
  /{locale}/menu/brunch
  /{locale}/menu/cocktails
  /{locale}/menu/wine
  /{locale}/menu/seasonal
  /{locale}/reservations
  /{locale}/reservations/private-dining
  /{locale}/contact
  /{locale}/events
  /{locale}/gallery
  /{locale}/blog
  /{locale}/faq
  /{locale}/gift-cards
  /{locale}/careers
  /{locale}/privacy

Dynamic routes:
  /{locale}/events/{slug}
  /{locale}/blog/{slug}
  /{locale}/menu/{type}         (catch-all for custom menu types)
```

### Next.js App Router Structure

```
app/
  [locale]/
    layout.tsx                  ← injects theme CSS vars + site context
    page.tsx                    ← home
    about/
      page.tsx
      team/page.tsx
      philosophy/page.tsx
      awards-press/page.tsx
    menu/
      page.tsx                  ← menu hub
      [type]/page.tsx           ← dinner, lunch, brunch, cocktails, etc.
    reservations/
      page.tsx
      private-dining/page.tsx
    contact/page.tsx
    events/
      page.tsx
      [slug]/page.tsx
    gallery/page.tsx
    blog/
      page.tsx
      [slug]/page.tsx
    faq/page.tsx
    gift-cards/page.tsx
    careers/page.tsx
    privacy/page.tsx
```

### Multilingual Routing

```typescript
// middleware.ts — host-based site resolution + locale detection
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const site = resolveSiteFromHost(host)          // queries site_domains table
  const locale = detectLocale(request, site)      // cookie → accept-language → default

  // Inject site context into headers for all downstream components
  const headers = new Headers(request.headers)
  headers.set('x-site-id', site.id)
  headers.set('x-locale', locale)

  return NextResponse.rewrite(
    new URL(`/${locale}${request.nextUrl.pathname}`, request.url),
    { headers }
  )
}
```

### Canonical URL Strategy

```html
<!-- On /zh/menu/dinner -->
<link rel="canonical" href="https://restaurant.com/zh/menu/dinner" />
<link rel="alternate" hreflang="en"      href="https://restaurant.com/en/menu/dinner" />
<link rel="alternate" hreflang="zh-Hans" href="https://restaurant.com/zh/menu/dinner" />
<link rel="alternate" hreflang="es"      href="https://restaurant.com/es/menu/dinner" />
<link rel="alternate" hreflang="x-default" href="https://restaurant.com/en/menu/dinner" />
```

### Redirect Rules

```
/ → /{default_locale}/          (301 — always redirect root to locale)
/menu → /en/menu                (301)
www.restaurant.com → restaurant.com  (301 — Vercel handles)
/reservations → /en/reservations    (301 for non-locale prefixed direct links)
```

---

## Section 5: Feature Flag Map

All flags stored in `sites` table, loaded via site context. Frontend reads flags at request time — no code changes per client.

| Feature Flag | Default | Pages Affected | Sections Affected |
|---|---|---|---|
| `online_reservation` | true | /reservations, /book | reservation-widget, reservations-cta (all pages) |
| `reservation_provider` | "custom" | /reservations | reservation-widget variant selection |
| `private_dining` | true | /reservations/private-dining | private-dining-cta section |
| `events_section` | true | /events, /events/{slug} | events-preview (home), events nav item |
| `blog` | true | /blog, /blog/{slug} | blog-preview (home), blog nav item |
| `gallery` | true | /gallery | gallery-preview (home), gallery nav item |
| `press_section` | true | /press, /about/awards-press | trust-bar (home), awards-preview (about) |
| `gift_cards` | false | /gift-cards | gift-cards nav item |
| `online_ordering` | false | /order | order CTA in nav + hero |
| `catering` | false | /catering | catering nav item |
| `careers` | false | /careers | careers nav item |
| `kids_menu` | false | /menu/kids | kids menu tab in category nav |
| `happy_hour` | false | /menu/happy-hour | happy hour menu tab + banner |
| `wine_list` | true | /menu/wine | wine tab in menu nav |
| `cocktail_menu` | true | /menu/cocktails | cocktails tab in menu nav |
| `allergen_display` | true | all menu pages | dietary-legend section |
| `seasonal_menu` | true | /menu/seasonal | seasonal badge per item + seasonal menu tab |
| `instagram_feed` | false | home | instagram-feed section |
| `loyalty_program` | false | /loyalty | loyalty nav item |
| `multilingual_staff_badge` | false | home hero, contact | staff language badge component |

---

## Section 6: Layout.json Starter Templates

These are the default `layout.json` files every new client gets when cloned from the master template. Clients then adjust via admin.

### Fine Dining Starter (home.layout.json)

```json
{
  "sub_type": "fine-dining",
  "brand_variant": "noir-saison",
  "sections": [
    { "id": "hero",              "variant": "fullscreen-dish" },
    { "id": "trust-bar",         "variant": "press-logos" },
    { "id": "menu-preview",      "variant": "featured-dishes-grid" },
    { "id": "about-preview",     "variant": "chef-split" },
    { "id": "reservations-cta",  "variant": "banner-split" },
    { "id": "testimonials",      "variant": "carousel-photo" },
    { "id": "events-preview",    "variant": "cards-2col" },
    { "id": "gallery-preview",   "variant": "masonry-4up" },
    { "id": "cta-booking",       "variant": "minimal-centered" }
  ]
}
```

### Cafe / Brunch Starter (home.layout.json)

```json
{
  "sub_type": "cafe-brunch",
  "brand_variant": "matin-clair",
  "sections": [
    { "id": "hero",              "variant": "cafe-welcome" },
    { "id": "menu-preview",      "variant": "category-cards" },
    { "id": "about-preview",     "variant": "story-centered" },
    { "id": "gallery-preview",   "variant": "grid-6" },
    { "id": "testimonials",      "variant": "grid-3col" },
    { "id": "blog-preview",      "variant": "cards-3col" },
    { "id": "instagram-feed",    "variant": "grid-6" },
    { "id": "cta-booking",       "variant": "full-width-banner" }
  ]
}
```

### Bar / Lounge Starter (home.layout.json)

```json
{
  "sub_type": "bar-lounge",
  "brand_variant": "noir-saison",
  "sections": [
    { "id": "hero",              "variant": "video-atmosphere" },
    { "id": "menu-preview",      "variant": "tabbed-preview" },
    { "id": "events-preview",    "variant": "featured-plus-list" },
    { "id": "about-preview",     "variant": "story-centered" },
    { "id": "trust-bar",         "variant": "press-logos" },
    { "id": "reservations-cta",  "variant": "banner-split" },
    { "id": "testimonials",      "variant": "grid-3col" },
    { "id": "cta-booking",       "variant": "minimal-centered" }
  ]
}
```

### Menu Page Starter (menu-dinner.layout.json)

```json
{
  "sections": [
    { "id": "menu-hero",         "variant": "minimal-title" },
    { "id": "menu-category-nav", "variant": "sticky-tabs" },
    { "id": "menu-sections",     "variant": "standard" },
    { "id": "dietary-legend",    "variant": "inline-badges" },
    { "id": "reservations-cta",  "variant": "bottom-banner" }
  ]
}
```

### About Page Starter (about.layout.json)

```json
{
  "sections": [
    { "id": "hero",           "variant": "split-photo" },
    { "id": "practice-story", "variant": "narrative-centered" },
    { "id": "mission-values", "variant": "cards-3col" },
    { "id": "team-preview",   "variant": "cards-grid" },
    { "id": "awards-preview", "variant": "logos-row" },
    { "id": "cta",            "variant": "booking" }
  ]
}
```

---

## Section 7: Page Count Summary

| Category | P0 | P1 | P2 | Total |
|---|---|---|---|---|
| Core pages | 8 | 7 | 4 | 19 |
| Content pages | 0 | 6 | 0 | 6 |
| Conversion pages | 0 | 0 | 5 | 5 |
| Utility pages | 3 | 2 | 1 | 6 |
| Dynamic routes | — | 2 types | — | ∞ |
| **Total static** | **11** | **15** | **10** | **36** |

**Dynamic pages generated from DB:**
- `/events/{slug}` — one per event
- `/blog/{slug}` — one per blog post

All 36 static pages × 3 locales (EN/ZH/ES) = **108 rendered locale pages** in the master template.

---

*End of A3 — Site Architecture*
*Next agent: A4-COMP will use this architecture to inventory every component and classify REUSE vs NEW.*
