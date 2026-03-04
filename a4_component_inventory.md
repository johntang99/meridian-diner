# A4 — Component Inventory
**USF Restaurant System — Stage A**
**Agent:** A4-COMP
**Input:** a2_brand_system.md · a3_site_architecture.md
**Output:** Every component, every variant, props interfaces, REUSE vs NEW classification

---

## Section 1: Core Layout Components

---

### `Header`
**Status:** REUSE — adapt from medical system (restyle + add reservation CTA)

**Variants:**
- `standard` — logo left, nav center, CTA right, full-width
- `minimal` — logo centered, nav below, for fine dining
- `with-top-bar` — thin top bar (hours + phone), main nav below

```typescript
interface HeaderProps {
  site: SiteInfo
  nav: NavigationConfig
  locale: Locale
  availableLocales: Locale[]
  variant: 'standard' | 'minimal' | 'with-top-bar'
  ctaLabel: string
  ctaHref: string
  isTransparent?: boolean      // overlays hero when true
  stickyOnScroll?: boolean
}
```

**Notes from A2:** Fine dining (Noir Saison) uses wide letter-spacing (0.12em) on nav items, uppercase Lato. Cafe (Matin Clair) uses Nunito, friendlier weight. The component consumes `--font-body` and `--tracking-heading` CSS vars — one component, all variants covered by theme injection.

---

### `Footer`
**Status:** REUSE — adapt from medical system (restyle, add social links, restaurant-specific columns)

**Variants:**
- `full` — 3-column: story | hours + address | social + links
- `compact` — 2-column: essentials only
- `dark` — forced dark background regardless of theme (for Noir Saison / Vélocité)
- `light` — forced light background (for Matin Clair / Terre Vivante)

```typescript
interface FooterProps {
  site: SiteInfo
  nav: NavigationConfig
  locale: Locale
  variant: 'full' | 'compact' | 'dark' | 'light'
  showNewsletter?: boolean
  showSocialLinks?: boolean
  showLanguageSwitcher?: boolean
}
```

---

### `LanguageSwitcher`
**Status:** REUSE — no changes needed from medical system

**Variants:**
- `inline-text` — "EN | 中文 | ES" in nav
- `dropdown` — selected locale shown, others in dropdown
- `full-list` — used in mobile nav overlay

```typescript
interface LanguageSwitcherProps {
  currentLocale: Locale
  availableLocales: Locale[]
  variant: 'inline-text' | 'dropdown' | 'full-list'
  onChange: (locale: Locale) => void
}
```

---

### `StickyBookingBar`
**Status:** NEW — restaurant-specific mobile bottom bar

**Variants:**
- `reservation-phone` — "Reserve" button + phone icon (FD, BL)
- `hours-order` — "Open Now · Closes 5pm" + "Order Online" (CB)
- `single-cta` — single full-width CTA button

```typescript
interface StickyBookingBarProps {
  variant: 'reservation-phone' | 'hours-order' | 'single-cta'
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string; icon?: 'phone' | 'map' }
  hoursStatus?: { isOpen: boolean; statusText: string }
  showOnMobileOnly?: boolean     // default: true
}
```

---

### `OpenHoursDisplay`
**Status:** REUSE — minor adaptation (medical system has hours display)

**Variants:**
- `table` — day | hours in clean table
- `cards` — one card per day group
- `inline-status` — "Open · Closes at 10pm" badge
- `full-week` — all 7 days listed

```typescript
interface OpenHoursDisplayProps {
  hours: WeeklyHours
  variant: 'table' | 'cards' | 'inline-status' | 'full-week'
  showTodayHighlight?: boolean
  showClosedDays?: boolean
  timezone: string
}
```

---

### `Breadcrumb`
**Status:** REUSE — identical to medical system

```typescript
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>
  locale: Locale
}
```

---

## Section 2: Hero Components

All hero components are **NEW** — restaurant photography treatment is fundamentally different from medical/clinic heroes.

---

### `HeroFullscreenDish`
**Status:** NEW
**Best with:** Noir Saison, Vélocité
**Sub-types:** FD, BL

Full-viewport height hero. Single hero dish/ambiance photograph as background with overlay. Text in safe left-center zone. Two CTAs.

```typescript
interface HeroFullscreenDishProps {
  headline: LocalizedString
  subheadline?: LocalizedString
  primaryCta: { label: LocalizedString; href: string }
  secondaryCta?: { label: LocalizedString; href: string }
  backgroundImage: string          // full-bleed photo URL
  backgroundVideo?: string         // optional video URL (poster = backgroundImage)
  overlayOpacity?: number          // 0–1, default 0.45
  textPosition: 'left' | 'center' | 'bottom-left'
  hoursStatus?: { isOpen: boolean; statusText: string }
}
```

**Layout (CSS):**
```
.hero {
  height: 100svh;
  min-height: 600px;
  position: relative;
  overflow: hidden;
}
.hero__bg { object-fit: cover; width: 100%; height: 100%; }
.hero__overlay { background: rgba(0,0,0, var(--overlay-opacity)); }
.hero__content { position: absolute; max-width: 600px; }
```

**Mobile:** Static image (video disabled). Text repositions to bottom-left. Both CTAs stack vertically.

---

### `HeroSplitAmbiance`
**Status:** NEW
**Best with:** Terre Vivante, Vélocité
**Sub-types:** FD, CB

60/40 split. Left: headline, description, CTA. Right: full-height photo.

```typescript
interface HeroSplitAmbianceProps {
  headline: LocalizedString
  subheadline?: LocalizedString
  description?: LocalizedString
  primaryCta: { label: LocalizedString; href: string }
  image: string
  imageAlt: LocalizedString
  imageSide: 'left' | 'right'    // default: 'right'
  trustSignal?: string           // e.g. "★ 4.9 · 400+ Reviews"
}
```

**Mobile:** Image stacks above text. 4:3 aspect ratio on mobile. Text below.

---

### `HeroVideoAtmosphere`
**Status:** NEW
**Best with:** Noir Saison, Vélocité
**Sub-types:** BL, FD

Video background (kitchen action, table service, atmosphere). Minimal text. Single strong CTA.

```typescript
interface HeroVideoAtmosphereProps {
  headline: LocalizedString
  cta: { label: LocalizedString; href: string }
  videoUrl: string
  posterImage: string             // shown while video loads + on mobile
  overlayOpacity?: number
  videoPosition?: 'top' | 'center' | 'bottom'
}
```

**Mobile:** Video replaced with `posterImage` (static). No autoplay on mobile (bandwidth).

---

### `HeroEditorial`
**Status:** NEW
**Best with:** Vélocité
**Sub-types:** FD, Contemporary

Typography-dominant. Restaurant name fills ~80% of viewport width. Small inset photo overlapping text. Grid-breaking asymmetric layout.

```typescript
interface HeroEditorialProps {
  restaurantName: string          // displayed very large — not LocalizedString
  tagline: LocalizedString
  cta: { label: LocalizedString; href: string }
  accentImage: string             // small, overlapping the text
  accentImageAlt: LocalizedString
}
```

---

### `HeroCafeWelcome`
**Status:** NEW
**Best with:** Matin Clair
**Sub-types:** CB

Bright, airy. Headline + hours badge + photo (overhead food shot, circular or organic crop). Orange pill CTA.

```typescript
interface HeroCafeWelcomeProps {
  headline: LocalizedString
  subheadline?: LocalizedString
  cta: { label: LocalizedString; href: string }
  image: string
  imageAlt: LocalizedString
  hoursStatus: { isOpen: boolean; statusText: string; todayHours: string }
  imageCropStyle?: 'circle' | 'organic' | 'rectangle'
}
```

---

## Section 3: Menu System Components

The most complex component family. All **NEW** — no equivalent in medical system.

---

### `MenuCategoryNav`
**Status:** NEW
**Used on:** All menu pages

Top-level navigation between menu categories (Dinner, Lunch, Drinks, etc.) and sub-categories within a menu.

**Variants:**
- `sticky-tabs` — horizontal tabs, sticks to top of viewport on scroll (desktop)
- `sticky-sidebar` — vertical sidebar nav, sticky (desktop only, wide screens)
- `dropdown` — single dropdown selector (mobile default)
- `anchor-list` — simple in-page anchor links (minimal style)

```typescript
interface MenuCategoryNavProps {
  categories: MenuCategory[]
  activeCategory: string
  variant: 'sticky-tabs' | 'sticky-sidebar' | 'dropdown' | 'anchor-list'
  onCategoryChange: (id: string) => void
  locale: Locale
}
```

---

### `MenuSection`
**Status:** NEW

Container for one menu category. Renders the category header + list of MenuItems.

```typescript
interface MenuSectionProps {
  category: MenuCategory
  items: MenuItem[]
  itemVariant: 'text-only' | 'with-photo' | 'featured'
  locale: Locale
  showAllergens?: boolean
  showDietaryFlags?: boolean
}
```

---

### `MenuItem`
**Status:** NEW

The core menu item component. Three visual variants for different restaurant styles.

**Variants:**

`text-only` — Fine dining style. No photo. Name in display font, description muted, price right-aligned. Minimal lines between items.

`with-photo` — Photo card. Photo at top (4:3), name, description, price, badges below. Used by cafes and visual menus.

`featured` — Larger card. Photo (16:9), prominent name, full description, price, badges. For hero dishes and chef's specials.

```typescript
interface MenuItemProps {
  item: MenuItem
  variant: 'text-only' | 'with-photo' | 'featured'
  locale: Locale
  showAllergens?: boolean
  showDietaryFlags?: boolean
  onSelect?: (item: MenuItem) => void    // for ordering integrations
}

interface MenuItem {
  id: string
  name: LocalizedString
  description: LocalizedString
  price: number                          // cents
  priceNote?: LocalizedString            // "per person" | "market price"
  image?: string
  dietaryFlags: DietaryFlag[]
  allergens: Allergen[]
  featured: boolean
  seasonal: boolean
  seasonalNote?: LocalizedString
  available: boolean
  displayOrder: number
}

type DietaryFlag = 'vegan' | 'vegetarian' | 'gf' | 'gf-option' |
  'nut-free' | 'dairy-free' | 'spicy' | 'spicy-2' | 'spicy-3' |
  'halal' | 'kosher'

type Allergen = 'gluten' | 'dairy' | 'eggs' | 'nuts' | 'peanuts' |
  'shellfish' | 'soy' | 'fish' | 'sesame'
```

---

### `AllergenBadge`
**Status:** NEW

Icon + optional label per allergen type. Shown on MenuItem when `showAllergens` is true.

```typescript
interface AllergenBadgeProps {
  allergen: Allergen
  showLabel?: boolean
  size?: 'sm' | 'md'
}
```

---

### `DietaryFlag`
**Status:** NEW

Colored pill badge per dietary designation.

```typescript
interface DietaryFlagProps {
  flag: DietaryFlag
  size?: 'sm' | 'md'
  showLabel?: boolean
}
```

Color map:
```
vegan        → green (#3D7A5F)
vegetarian   → light green
gf           → amber (#F4A261)
dairy-free   → blue
spicy        → red (1 pepper icon)
spicy-2      → red (2 pepper icons)
spicy-3      → red (3 pepper icons)
halal        → teal
kosher       → deep blue
```

---

### `SeasonalBadge`
**Status:** NEW

Indicates a seasonal or limited item.

```typescript
interface SeasonalBadgeProps {
  note?: LocalizedString          // "Spring Menu" | "Chef's Special" | "Limited"
  variant: 'pill' | 'ribbon' | 'icon-only'
}
```

---

### `PriceDisplay`
**Status:** NEW

Handles all price rendering edge cases: normal price, market price, per-person, price range.

```typescript
interface PriceDisplayProps {
  price: number | null            // null = market price / inquire
  priceNote?: LocalizedString     // "per person" | "market price"
  currency?: string               // default: 'USD'
  locale: Locale
  variant?: 'standard' | 'prominent' | 'muted'
}
```

---

### `DietaryLegend`
**Status:** NEW

Explains all dietary flags and allergens used on a menu page.

```typescript
interface DietaryLegendProps {
  flags: DietaryFlag[]            // only flags actually used on this menu
  allergens: Allergen[]
  variant: 'inline-badges' | 'modal-explainer' | 'page-footer-legend'
  locale: Locale
}
```

---

## Section 4: Reservation Components

---

### `ReservationOpenTable`
**Status:** NEW — OpenTable embed wrapper with theme integration

Wraps the OpenTable widget and applies CSS overrides to match the site theme.

```typescript
interface ReservationOpenTableProps {
  restaurantId: string            // OpenTable restaurant ID
  partySize?: number              // pre-fill party size
  date?: string                   // pre-fill date
  source?: string                 // tracking source
  theme?: 'standard' | 'tall'    // OT widget variant
}
```

---

### `ReservationResy`
**Status:** NEW — Resy embed wrapper with theme integration

```typescript
interface ReservationResyProps {
  venueId: string                 // Resy venue ID
  apiKey: string                  // Resy API key (from site config)
  partySize?: number
  date?: string
}
```

---

### `ReservationCustomForm`
**Status:** NEW — full custom booking form

Date picker, time slot grid, party size selector, special requests, confirmation flow.

```typescript
interface ReservationCustomFormProps {
  siteId: string
  locale: Locale
  config: ReservationConfig
  onSuccess?: (booking: Booking) => void
  variant?: 'standard' | 'compact' | 'inline'
}

interface ReservationConfig {
  maxPartySize: number            // default: 10
  advanceBookingDays: number      // how far ahead bookable, default: 60
  minAdvanceHours: number         // min hours before booking, default: 2
  availableTimeSlots: string[]    // ["17:00", "17:30", "18:00", ...]
  blackoutDates?: string[]        // ISO dates not available
  requirePhone: boolean
  requireSpecialRequests: boolean
  confirmationEmailTemplate: string
}
```

---

### `ReservationCTABanner`
**Status:** REUSE — adapt from medical system CTA component

Simple banner with headline + CTA button linking to /reservations.

```typescript
interface ReservationCTABannerProps {
  headline: LocalizedString
  subheadline?: LocalizedString
  cta: { label: LocalizedString; href: string }
  variant: 'full-width-banner' | 'split-photo' | 'minimal-centered'
  backgroundImage?: string
}
```

---

### `PrivateDiningForm`
**Status:** NEW — extended inquiry form for private events

```typescript
interface PrivateDiningFormProps {
  siteId: string
  locale: Locale
  fields: {
    eventType: boolean
    guestCount: boolean
    budget: boolean
    preferredDate: boolean
    specialRequests: boolean
  }
  recipientEmail: string
}
```

---

## Section 5: Team & Chef Components

---

### `ChefHeroFull`
**Status:** NEW
**Best with:** Noir Saison, Vélocité
**Sub-types:** FD

Full-width portrait. Name + title + bio + credentials + philosophy quote. Used on /about/team for the head chef.

```typescript
interface ChefHeroFullProps {
  member: TeamMember
  locale: Locale
  variant: 'dark-overlay' | 'split-light' | 'editorial'
  showCredentials?: boolean
  showPhilosophyQuote?: boolean
}
```

---

### `ChefProfileCard`
**Status:** NEW

Grid card for team listing pages.

**Variants:**
- `portrait-card` — photo (3:4), name, role, 1-line bio
- `landscape-card` — photo left (1:1), text right, more bio
- `minimal` — photo (1:1 circle), name, role only

```typescript
interface ChefProfileCardProps {
  member: TeamMember
  locale: Locale
  variant: 'portrait-card' | 'landscape-card' | 'minimal'
  showSocial?: boolean
  showCredentials?: boolean
  linkToProfile?: boolean
}

interface TeamMember {
  id: string
  name: string
  role: LocalizedString
  bio: LocalizedString
  shortBio: LocalizedString
  photo: string
  credentials: string[]
  department: 'culinary' | 'service' | 'management' | 'bar'
  featured: boolean
  social?: { instagram?: string; twitter?: string }
  displayOrder: number
}
```

---

### `TeamGrid`
**Status:** NEW — uses ChefProfileCard internally

Responsive grid of team member cards.

```typescript
interface TeamGridProps {
  members: TeamMember[]
  locale: Locale
  cardVariant: ChefProfileCardProps['variant']
  columns?: 2 | 3 | 4
  showDepartmentFilter?: boolean
  featuredFirst?: boolean
}
```

---

### `ChefStorySection`
**Status:** NEW

Narrative section — chef photo left, biography right. Used on about page.

```typescript
interface ChefStorySectionProps {
  member: TeamMember
  locale: Locale
  variant: 'split-photo-left' | 'split-photo-right' | 'centered-with-quote'
  showCredentials?: boolean
  showAwards?: boolean
}
```

---

## Section 6: Social Proof Components

---

### `TestimonialCarousel`
**Status:** REUSE — adapt from medical system (restyle)

```typescript
interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  locale: Locale
  variant: 'carousel-photo' | 'carousel-minimal'
  autoPlay?: boolean
  showRating?: boolean
  showSource?: boolean           // "via Google" | "via Yelp"
}
```

---

### `TestimonialGrid`
**Status:** REUSE — adapt from medical system

```typescript
interface TestimonialGridProps {
  testimonials: Testimonial[]
  locale: Locale
  columns?: 2 | 3
  showRating?: boolean
}
```

---

### `PressLogoStrip`
**Status:** NEW — restaurant press differs from medical credentials

Horizontal strip of press logos (Michelin, Eater, NYT, Time Out, etc.) with optional award text.

```typescript
interface PressLogoStripProps {
  items: Array<{
    logo: string
    altText: string
    award?: string               // "Michelin Star 2024" | "Best New Restaurant"
    url?: string
  }>
  variant: 'logos-only' | 'logos-with-award' | 'cards'
  scrollable?: boolean           // mobile: horizontal scroll
}
```

---

### `StarRatingDisplay`
**Status:** NEW

Aggregate Google/Yelp rating badge.

```typescript
interface StarRatingDisplayProps {
  rating: number                 // 0–5
  reviewCount: number
  source: 'google' | 'yelp' | 'tripadvisor'
  variant: 'compact-badge' | 'full-display'
  linkUrl?: string
}
```

---

## Section 7: Content Components

---

### `EventCard`
**Status:** NEW

```typescript
interface EventCardProps {
  event: Event
  locale: Locale
  variant: 'standard' | 'featured' | 'compact-list'
  showReservationCta?: boolean
}

interface Event {
  id: string
  title: LocalizedString
  description: LocalizedString
  eventType: EventType
  startDatetime: string          // ISO
  endDatetime: string
  recurring: null | RecurringPattern
  pricePerPerson: number | null
  reservationRequired: boolean
  reservationLink?: string
  image?: string
  featured: boolean
  published: boolean
}

type EventType = 'wine-dinner' | 'tasting' | 'live-music' |
  'holiday' | 'private' | 'pop-up' | 'class' | 'brunch-special'
```

---

### `EventsList`
**Status:** NEW

Chronological list of upcoming events with filter.

```typescript
interface EventsListProps {
  events: Event[]
  locale: Locale
  variant: 'cards-2col' | 'cards-3col' | 'list-chronological'
  filterByType?: EventType[]
  showPastEvents?: boolean
  maxItems?: number
}
```

---

### `BlogCard`
**Status:** REUSE — adapt from medical system (restyle)

```typescript
interface BlogCardProps {
  post: BlogPost
  locale: Locale
  variant: 'standard' | 'featured' | 'compact'
  showAuthor?: boolean
  showCategory?: boolean
  showReadTime?: boolean
}
```

---

### `BlogGrid`
**Status:** REUSE — adapt from medical system

```typescript
interface BlogGridProps {
  posts: BlogPost[]
  locale: Locale
  columns?: 2 | 3
  cardVariant?: BlogCardProps['variant']
  showCategoryFilter?: boolean
}
```

---

### `GalleryMasonry`
**Status:** NEW — medical system has a simpler grid, masonry is new

**Variants:**
- `masonry` — Pinterest-style variable height grid
- `grid-uniform` — equal-size cells, clean grid
- `strip-scroll` — horizontal scrolling strip

```typescript
interface GalleryMasonryProps {
  items: GalleryItem[]
  locale: Locale
  variant: 'masonry' | 'grid-uniform' | 'strip-scroll'
  columns?: 2 | 3 | 4
  showCategoryFilter?: boolean
  enableLightbox?: boolean       // default: true
  categories?: GalleryCategory[]
}

interface GalleryItem {
  id: string
  url: string
  alt: LocalizedString
  category: 'food' | 'interior' | 'events' | 'team' | 'behind-the-scenes'
  caption?: LocalizedString
  featured: boolean
  displayOrder: number
}
```

---

### `Lightbox`
**Status:** NEW — full-screen image viewer

```typescript
interface LightboxProps {
  items: GalleryItem[]
  initialIndex: number
  locale: Locale
  onClose: () => void
  showCaption?: boolean
  showCounter?: boolean
  enableKeyboard?: boolean       // default: true
}
```

---

### `GalleryInstagram`
**Status:** NEW — optional Instagram feed

```typescript
interface GalleryInstagramProps {
  handle: string
  accessToken?: string           // if null, uses static fallback grid
  count?: number                 // default: 12
  variant: 'grid-6' | 'grid-9' | 'strip-scroll'
  showHandle?: boolean
  showFollowCta?: boolean
}
```

---

### `MapEmbed`
**Status:** REUSE — identical to medical system

```typescript
interface MapEmbedProps {
  address: string
  embedUrl: string               // Google Maps embed URL
  variant: 'full-width' | 'contained' | 'split-with-info'
  height?: number
  showDirectionsLink?: boolean
}
```

---

### `ContactForm`
**Status:** REUSE — adapt from medical system (fields differ slightly)

```typescript
interface ContactFormProps {
  siteId: string
  locale: Locale
  fields: {
    name: boolean
    email: boolean
    phone: boolean
    subject: boolean
    message: boolean
    preferredDate?: boolean      // for catering/private dining inquiries
  }
  variant: 'minimal' | 'full' | 'split-with-info'
  recipientEmail: string
}
```

---

### `FAQAccordion`
**Status:** REUSE — identical to medical system

```typescript
interface FAQAccordionProps {
  items: Array<{ question: LocalizedString; answer: LocalizedString }>
  locale: Locale
  variant: 'single-open' | 'multi-open' | 'two-column'
  showSearch?: boolean
}
```

---

## Section 8: REUSE vs NEW Summary Table

| Component | Status | Source | Effort | Notes |
|---|---|---|---|---|
| `Header` | REUSE | medical | Low | Restyle CSS vars, add reservation CTA |
| `Footer` | REUSE | medical | Low | Restyle, add social links column |
| `LanguageSwitcher` | REUSE | medical | None | No changes needed |
| `StickyBookingBar` | NEW | — | Medium | Mobile bottom bar, restaurant-specific |
| `OpenHoursDisplay` | REUSE | medical | Low | Minor adaptation |
| `Breadcrumb` | REUSE | medical | None | Identical |
| `HeroFullscreenDish` | NEW | — | Medium | Full-viewport dish hero |
| `HeroSplitAmbiance` | NEW | — | Medium | Split photo/text hero |
| `HeroVideoAtmosphere` | NEW | — | Medium | Video background hero |
| `HeroEditorial` | NEW | — | High | Complex asymmetric layout |
| `HeroCafeWelcome` | NEW | — | Medium | Bright cafe-specific hero |
| `MenuCategoryNav` | NEW | — | High | Sticky tabs/sidebar/dropdown |
| `MenuSection` | NEW | — | Medium | Category container |
| `MenuItem` | NEW | — | High | 3 variants, complex display logic |
| `AllergenBadge` | NEW | — | Low | Icon + label, 9 types |
| `DietaryFlag` | NEW | — | Low | Colored pill, 11 types |
| `SeasonalBadge` | NEW | — | Low | Pill/ribbon/icon variants |
| `PriceDisplay` | NEW | — | Low | Edge cases: market price, per person |
| `DietaryLegend` | NEW | — | Low | Explainer for menu dietary icons |
| `ReservationOpenTable` | NEW | — | Medium | OT embed + theme override |
| `ReservationResy` | NEW | — | Medium | Resy embed + theme override |
| `ReservationCustomForm` | NEW | — | High | Date picker, time slots, confirm flow |
| `ReservationCTABanner` | REUSE | medical | Low | Restyle from appointment CTA |
| `PrivateDiningForm` | NEW | — | Medium | Extended inquiry form |
| `ChefHeroFull` | NEW | — | Medium | Full-width portrait section |
| `ChefProfileCard` | NEW | — | Low | Grid card, 3 variants |
| `TeamGrid` | NEW | — | Low | Grid container for cards |
| `ChefStorySection` | NEW | — | Medium | Split narrative section |
| `TestimonialCarousel` | REUSE | medical | Low | Restyle |
| `TestimonialGrid` | REUSE | medical | Low | Restyle |
| `PressLogoStrip` | NEW | — | Low | Press logos, different from medical credentials |
| `StarRatingDisplay` | NEW | — | Low | Google/Yelp rating badge |
| `EventCard` | NEW | — | Medium | Event display card, 3 variants |
| `EventsList` | NEW | — | Medium | Filtered events list |
| `BlogCard` | REUSE | medical | Low | Restyle |
| `BlogGrid` | REUSE | medical | Low | Restyle |
| `GalleryMasonry` | NEW | — | High | Masonry layout + lightbox |
| `Lightbox` | NEW | — | High | Full-screen image viewer |
| `GalleryInstagram` | NEW | — | Medium | Instagram feed or static grid |
| `MapEmbed` | REUSE | medical | None | Identical |
| `ContactForm` | REUSE | medical | Low | Minor field changes |
| `FAQAccordion` | REUSE | medical | None | Identical |

---

## Section 9: Build Effort Summary

| Category | REUSE | NEW (Low) | NEW (Medium) | NEW (High) | Total |
|---|---|---|---|---|---|
| Layout | 5 | 0 | 1 | 0 | 6 |
| Hero | 0 | 0 | 4 | 1 | 5 |
| Menu System | 0 | 4 | 2 | 2 | 8 |
| Reservation | 1 | 0 | 3 | 1 | 5 |
| Team/Chef | 0 | 2 | 3 | 0 | 5 |
| Social Proof | 2 | 2 | 0 | 0 | 4 |
| Content | 4 | 1 | 3 | 2 | 10 |
| **Total** | **12** | **9** | **16** | **6** | **43** |

**12 components reused** from medical system (adapt only — no rebuild)
**31 components new** — 9 low effort, 16 medium, 6 high

**The 6 high-effort components** that need the most build time:
1. `HeroEditorial` — complex asymmetric CSS layout
2. `MenuCategoryNav` — sticky behavior, mobile/desktop variants, smooth switching
3. `MenuItem` — 3 variants, dietary/allergen display logic, ordering integration hooks
4. `ReservationCustomForm` — date picker, real-time slot availability, email confirmation
5. `GalleryMasonry` — masonry CSS, lazy loading, lightbox integration
6. `Lightbox` — keyboard nav, touch swipe, animation, caption display

---

*End of A4 — Component Inventory*
*Next agent: A5-VISUAL will use the component inventory and brand system to produce the complete design token specification.*
