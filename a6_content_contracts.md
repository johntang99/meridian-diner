# A6 — Content Contracts & SEO Strategy
**USF Restaurant System — Stage A**
**Agent:** A6-CONTENT
**Input:** a1_industry_brief.md · a3_site_architecture.md · a5_design_tokens.md
**Output:** TypeScript interfaces for every content type, SEO strategy, conversion funnel, seed content targets

---

## Section 1: Global Types

### Primitives

```typescript
// Every text field visible to a public visitor must be LocalizedString.
// Internal/admin-only fields (IDs, slugs, config) use plain string.
type LocalizedString = {
  en: string
  zh?: string    // Simplified Chinese
  es?: string    // Neutral Spanish
  ko?: string    // Korean
  ja?: string    // Japanese (optional — for Japanese-market clients)
}

type ImageURL    = string    // absolute URL or relative path from media root
type ISODate     = string    // "2026-03-15"
type ISODateTime = string    // "2026-03-15T19:30:00Z"
type HexColor    = string    // "#C9A84C"
type Locale      = 'en' | 'zh' | 'es' | 'ko' | 'ja'
type SiteId      = string    // kebab-case site identifier
type Slug        = string    // kebab-case URL segment

// Cents representation — avoids float arithmetic errors
type Cents = number          // 2500 = $25.00

// Rich text — stored as markdown, rendered by the frontend
type RichText = string
```

---

### SiteInfo — `site.json`

The foundational file. Loaded on every page. Contains all business identity information.

```typescript
interface SiteInfo {
  // Identity
  id:               SiteId
  name:             LocalizedString
  tagline?:         LocalizedString
  cuisine:          LocalizedString          // "Contemporary American" | "Italian" | etc.
  sub_type:         'fine-dining' | 'cafe-brunch' | 'bar-lounge'
  brand_variant:    'noir-saison' | 'terre-vivante' | 'velocite' | 'matin-clair'
  founding_year?:   number
  owner_name?:      string                   // admin-only, not public

  // Contact
  address: {
    street:   string
    city:     string
    state:    string
    zip:      string
    country:  string                         // default: "US"
    full:     LocalizedString                // pre-formatted display string
  }
  phone:            string                   // "+1-845-555-0100"
  phone_display:    string                   // "(845) 555-0100"
  email:            string
  email_reservations?: string                // separate reservations inbox

  // Hours
  hours: {
    monday?:    HoursRange | null            // null = closed
    tuesday?:   HoursRange | null
    wednesday?: HoursRange | null
    thursday?:  HoursRange | null
    friday?:    HoursRange | null
    saturday?:  HoursRange | null
    sunday?:    HoursRange | null
    note?:      LocalizedString              // "Kitchen closes at 10pm"
    holidays?:  HolidayHours[]
  }

  // Online presence
  domain:         string                     // "alexdental.com"
  social: {
    instagram?:   string                     // "@handle"
    facebook?:    string
    twitter?:     string
    tiktok?:      string
    youtube?:     string
    yelp?:        string                     // full URL
    google_maps?: string                     // full URL
    opentable?:   string
    resy?:        string
  }
  google_maps_embed_url?: string
  google_analytics_id?:   string
  google_tag_manager_id?: string

  // Ratings
  ratings?: {
    google?: { rating: number; count: number; url: string }
    yelp?:   { rating: number; count: number; url: string }
  }

  // Features (loaded from sites table, exposed here for content use)
  features: SiteFeatures

  // Localization
  default_locale:     Locale
  supported_locales:  Locale[]
  currency:           string                 // "USD"
  timezone:           string                 // "America/New_York"
}

interface HoursRange {
  open:  string    // "17:00"
  close: string    // "22:00"
}

interface HolidayHours {
  date:       ISODate
  name:       LocalizedString
  hours:      HoursRange | null   // null = closed
  note?:      LocalizedString
}

interface SiteFeatures {
  online_reservation:    boolean
  reservation_provider:  'opentable' | 'resy' | 'custom' | 'phone-only'
  opentable_id?:         string
  resy_venue_id?:        string
  resy_api_key?:         string
  private_dining:        boolean
  events_section:        boolean
  blog:                  boolean
  gallery:               boolean
  press_section:         boolean
  gift_cards:            boolean
  online_ordering:       boolean
  order_provider?:       'toast' | 'square' | 'custom' | string
  order_url?:            string
  catering:              boolean
  careers:               boolean
  kids_menu:             boolean
  happy_hour:            boolean
  wine_list:             boolean
  cocktail_menu:         boolean
  allergen_display:      boolean
  seasonal_menu:         boolean
  instagram_feed:        boolean
  loyalty_program:       boolean
  multilingual_staff:    boolean
}
```

---

### NavigationConfig — `navigation.json`

```typescript
interface NavigationConfig {
  primary: NavItem[]
  cta: {
    label:    LocalizedString
    href:     string
    variant:  'primary' | 'ghost' | 'outline'
  }
  mobile_order?: string[]              // ordered list of nav item IDs for mobile
}

interface NavItem {
  id:       string
  label:    LocalizedString
  href?:    string                     // null if dropdown-only
  icon?:    string                     // optional icon name
  feature_gate?: keyof SiteFeatures   // hides item if feature disabled
  children?: NavItem[]                 // dropdown items
  highlight?: boolean                  // draws attention (e.g. "Events" badge)
}
```

---

### HeaderConfig — `header.json`

```typescript
interface HeaderConfig {
  variant:            'standard' | 'minimal' | 'with-top-bar'
  transparent_hero:   boolean          // transparent over hero, opaque on scroll
  sticky:             boolean          // default: true
  top_bar?: {
    phone:   boolean
    hours:   boolean
    message?: LocalizedString          // e.g. "Now accepting reservations for NYE"
  }
  logo: {
    type:     'text' | 'image'
    text?:    string                   // used when type = "text"
    image?:   ImageURL
    width?:   number                   // px, for image logos
  }
}
```

---

### FooterConfig — `footer.json`

```typescript
interface FooterConfig {
  variant:       'full' | 'compact' | 'dark' | 'light'
  show_newsletter:     boolean
  show_social:         boolean
  show_lang_switcher:  boolean
  tagline?:            LocalizedString
  columns: {
    story?:    boolean    // brief narrative about the restaurant
    hours?:    boolean
    address?:  boolean
    links?:    boolean    // secondary nav links
    social?:   boolean
  }
  copyright: LocalizedString           // "{year} {name}. All rights reserved."
}
```

---

### SeoConfig — `seo.json` (per page)

```typescript
interface SeoConfig {
  title:            LocalizedString    // rendered as <title>
  description:      LocalizedString    // rendered as meta description
  og_title?:        LocalizedString    // defaults to title
  og_description?:  LocalizedString    // defaults to description
  og_image?:        ImageURL           // 1200×630 recommended
  og_type?:         string             // default: "website"
  no_index?:        boolean            // default: false
  schema?:          SchemaOrg[]        // structured data blocks
}

// Variables available in SEO title/description strings:
// {site_name}, {city}, {state}, {cuisine}, {page_name}
// Example: "{cuisine} Restaurant in {city} | {site_name}"
```

---

## Section 2: Menu Content Contracts

### MenuCategory

```typescript
interface MenuCategory {
  id:             string
  site_id:        SiteId
  name:           LocalizedString
  description?:   LocalizedString
  menu_type:      MenuType
  slug:           Slug               // used in URL: /menu/{slug}
  available_days?: DayOfWeek[]       // null = always available
  available_from?: string            // "11:00" — time this category becomes available
  available_until?: string           // "15:00"
  display_order:  number
  active:         boolean
  created_at:     ISODateTime
  updated_at:     ISODateTime
}

type MenuType =
  | 'lunch' | 'dinner' | 'brunch' | 'breakfast'
  | 'drinks' | 'cocktails' | 'wine' | 'beer' | 'spirits'
  | 'desserts' | 'kids' | 'seasonal' | 'happy-hour'
  | 'tasting-menu' | 'prix-fixe'

type DayOfWeek =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday'
```

---

### MenuItem

```typescript
interface MenuItem {
  id:               string
  site_id:          SiteId
  category_id:      string
  name:             LocalizedString
  description:      LocalizedString
  price:            Cents | null      // null = market price / inquire
  price_note?:      LocalizedString   // "per person" | "market price" | "seasonal pricing"
  price_range?: {                     // for prix-fixe or variable pricing
    min: Cents
    max: Cents
  }
  image?:           ImageURL
  dietary_flags:    DietaryFlag[]
  allergens:        Allergen[]
  featured:         boolean           // shown in menu-preview section on homepage
  seasonal:         boolean
  seasonal_note?:   LocalizedString   // "Available March–June"
  new_item:         boolean           // shows "New" badge
  spice_level?:     0 | 1 | 2 | 3   // 0=none, 3=very spicy
  available:        boolean           // admin can toggle off without deleting
  display_order:    number
  created_at:       ISODateTime
  updated_at:       ISODateTime
}

type DietaryFlag =
  | 'vegan' | 'vegetarian' | 'gf' | 'gf-option'
  | 'nut-free' | 'dairy-free' | 'spicy' | 'halal' | 'kosher'

type Allergen =
  | 'gluten' | 'dairy' | 'eggs' | 'nuts' | 'peanuts'
  | 'shellfish' | 'soy' | 'fish' | 'sesame'
```

---

### WineListItem

Extends MenuItem with wine-specific fields.

```typescript
interface WineListItem extends MenuItem {
  wine: {
    grape_variety:  string            // "Cabernet Sauvignon"
    region:         string            // "Napa Valley, California"
    producer:       string            // "Opus One"
    vintage?:       number            // 2019
    style:          WineStyle
    tasting_notes?: LocalizedString
    pairing_notes?: LocalizedString   // "Pairs with our duck confit"
    glass_price?:   Cents             // if available by the glass
    bottle_price:   Cents
    magnum_price?:  Cents
  }
}

type WineStyle =
  | 'red' | 'white' | 'rosé' | 'sparkling'
  | 'dessert' | 'fortified' | 'orange'
```

---

### CocktailItem

```typescript
interface CocktailItem extends MenuItem {
  cocktail: {
    base_spirit:   string            // "Bourbon" | "Gin" | "Mezcal"
    ingredients:   LocalizedString   // brief ingredient list
    method:        string            // "Stirred" | "Shaken" | "Built"
    glassware?:    string            // "Coupe" | "Rocks" | "Highball"
    bartender?:    string            // named creator (Death & Co style)
    signature:     boolean           // true = house signature cocktail
    seasonal:      boolean
  }
}
```

---

## Section 3: Reservation Content Contracts

### ReservationConfig

```typescript
interface ReservationConfig {
  site_id:          SiteId
  provider:         'opentable' | 'resy' | 'custom' | 'phone-only'

  // Provider IDs
  opentable_rid?:   string           // OpenTable restaurant ID
  resy_venue_id?:   string
  resy_api_key?:    string

  // Custom form config (used when provider = 'custom')
  custom?: {
    time_slots:           string[]   // ["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"]
    party_size_min:       number     // default: 1
    party_size_max:       number     // default: 10
    party_large_min:      number     // threshold for "large party" inquiry, default: 8
    advance_days_min:     number     // min days ahead, default: 0 (same day ok)
    advance_days_max:     number     // max days ahead, default: 60
    blackout_dates?:      ISODate[]
    require_phone:        boolean    // default: true
    require_cc:           boolean    // default: false
    cancellation_hours:   number     // hours before for free cancel, default: 24
  }

  // Private dining
  private_dining?: {
    min_guests:          number
    max_guests:          number
    min_spend?:          Cents
    inquiry_lead_days:   number      // min days notice for private events
    spaces?: Array<{
      name:        LocalizedString
      capacity:    number
      description: LocalizedString
      image?:      ImageURL
    }>
  }

  // Policies
  policies: {
    cancellation?:  LocalizedString
    dress_code?:    LocalizedString
    parking?:       LocalizedString
    accessibility?: LocalizedString
    deposit?:       LocalizedString
  }

  // Confirmation emails
  confirmation_email_from:    string
  confirmation_email_subject: LocalizedString
}
```

---

### Booking (submitted reservation)

```typescript
interface Booking {
  id:           string
  site_id:      SiteId
  guest: {
    name:       string
    email:      string
    phone:      string
    locale:     Locale              // language for confirmation email
  }
  party_size:       number
  date:             ISODate
  time:             string          // "19:30"
  datetime:         ISODateTime
  special_requests?: string
  occasion?:        string          // "Birthday" | "Anniversary" | "Business"
  status:           BookingStatus
  source:           'web' | 'phone' | 'walk-in' | 'opentable' | 'resy'
  confirmation_code: string
  created_at:       ISODateTime
  updated_at:       ISODateTime
  cancelled_at?:    ISODateTime
  cancellation_reason?: string
}

type BookingStatus =
  | 'pending' | 'confirmed' | 'seated'
  | 'completed' | 'cancelled' | 'no-show'
```

---

## Section 4: Team Content Contracts

```typescript
interface TeamMember {
  id:             string
  site_id:        SiteId
  name:           string                       // not localized — proper name
  role:           LocalizedString              // "Executive Chef" | "主厨" | "Chef Exécutif"
  bio:            LocalizedString              // full biography for profile page
  short_bio:      LocalizedString              // 1–2 sentences for cards
  photo:          ImageURL
  photo_portrait?: ImageURL                   // 3:4 ratio for ChefHeroFull
  credentials:    string[]                    // ["CIA Graduate", "James Beard Nominee"]
  awards?:        LocalizedString[]
  philosophy?:    LocalizedString             // quote for ChefHeroFull
  department:     'culinary' | 'service' | 'management' | 'bar' | 'pastry'
  featured:       boolean                     // show on homepage about-preview
  display_order:  number
  social?: {
    instagram?: string
    twitter?:   string
    linkedin?:  string
  }
  joined_year?:   number
  active:         boolean
  created_at:     ISODateTime
  updated_at:     ISODateTime
}
```

---

## Section 5: Events Content Contracts

```typescript
interface Event {
  id:               string
  site_id:          SiteId
  title:            LocalizedString
  description:      LocalizedString
  short_description?: LocalizedString         // for cards
  event_type:       EventType
  image?:           ImageURL
  tags:             string[]

  // Timing
  start_datetime:   ISODateTime
  end_datetime:     ISODateTime
  all_day?:         boolean
  recurring?:       RecurringPattern | null

  // Pricing
  price_per_person?: Cents | null             // null = free
  price_note?:       LocalizedString          // "Includes wine pairing"
  price_tiers?: Array<{
    label:  LocalizedString
    price:  Cents
  }>

  // Booking
  reservation_required: boolean
  reservation_link?:    string               // external URL or /reservations
  capacity?:            number
  spots_remaining?:     number               // if tracking capacity

  // Status
  featured:   boolean
  published:  boolean
  cancelled:  boolean
  cancel_note?: LocalizedString

  created_at: ISODateTime
  updated_at: ISODateTime
}

type EventType =
  | 'wine-dinner' | 'tasting' | 'live-music' | 'dj-night'
  | 'holiday' | 'private' | 'pop-up' | 'class' | 'brunch-special'
  | 'happy-hour-event' | 'chef-collab' | 'seasonal-launch'

interface RecurringPattern {
  frequency:    'weekly' | 'biweekly' | 'monthly' | 'custom'
  days?:        DayOfWeek[]                  // for weekly: which days
  day_of_month?: number                      // for monthly: which day (1–31)
  end_date?:    ISODate                      // when recurring ends
  exceptions?:  ISODate[]                   // specific dates to skip
}
```

---

## Section 6: Blog Content Contracts

```typescript
interface BlogPost {
  id:             string
  site_id:        SiteId
  title:          LocalizedString
  slug:           Slug                       // URL: /blog/{slug}
  excerpt:        LocalizedString            // 1–2 sentence preview
  body:           LocalizedString            // RichText (markdown) per locale
  author:         BlogAuthor
  category:       BlogCategory
  tags:           string[]
  featured_image: ImageURL
  featured_image_alt: LocalizedString
  featured:       boolean                   // shown in blog-preview on homepage
  published:      boolean
  published_at:   ISODateTime
  updated_at:     ISODateTime
  read_time_minutes?: number                // auto-calculated from body length
  seo: {
    title:        LocalizedString
    description:  LocalizedString
    og_image?:    ImageURL
  }
}

interface BlogAuthor {
  type:       'team_member' | 'guest' | 'editorial'
  team_id?:   string                        // ref to TeamMember.id
  name?:      string                        // for guest authors
  photo?:     ImageURL
  bio?:       LocalizedString
}

type BlogCategory =
  | 'kitchen-stories'
  | 'sourcing-ingredients'
  | 'wine-spirits'
  | 'events-announcements'
  | 'chef-perspective'
  | 'seasonal-guide'
  | 'behind-the-scenes'
  | 'news'
```

---

## Section 7: Gallery Content Contracts

```typescript
interface GalleryItem {
  id:             string
  site_id:        SiteId
  url:            ImageURL
  thumbnail_url?: ImageURL                   // auto-generated smaller version
  alt:            LocalizedString
  category:       GalleryCategory
  caption?:       LocalizedString
  credit?:        string                     // photographer credit
  featured:       boolean                   // appears in gallery-preview sections
  display_order:  number
  width?:         number                    // original dimensions for aspect ratio
  height?:        number
  taken_at?:      ISODate
  created_at:     ISODateTime
}

type GalleryCategory =
  | 'food'
  | 'interior'
  | 'events'
  | 'team'
  | 'behind-the-scenes'
  | 'seasonal'
```

---

## Section 8: Press & Awards Contracts

```typescript
interface PressItem {
  id:           string
  site_id:      SiteId
  publication:  string                       // "New York Times"
  logo?:        ImageURL
  headline:     LocalizedString
  excerpt?:     LocalizedString
  url?:         string                       // link to original article
  date:         ISODate
  award?:       LocalizedString             // "Michelin Star 2024"
  is_award:     boolean                     // true = award, false = press mention
  featured:     boolean
  display_order: number
}
```

---

## Section 9: SEO Strategy

### Title Patterns by Page Type

| Page | EN Pattern | Example |
|---|---|---|
| Home | `{cuisine} Restaurant in {city} \| {name}` | Contemporary American Restaurant in New York \| The Meridian |
| Menu hub | `Menu \| {name} — {city}` | Menu \| The Meridian — New York |
| Specific menu | `{menu_type} Menu \| {name}` | Dinner Menu \| The Meridian |
| About | `About {name} \| {cuisine} in {city}` | About The Meridian \| Contemporary in New York |
| Team | `Our Team \| {name}` | Our Team \| The Meridian |
| Reservations | `Reservations \| {name} — {city}` | Reservations \| The Meridian — New York |
| Contact | `Contact & Hours \| {name} — {address_city}` | Contact & Hours \| The Meridian — Manhattan |
| Events | `Events & Private Dining \| {name}` | Events & Private Dining \| The Meridian |
| Blog | `Stories & Journal \| {name}` | Stories & Journal \| The Meridian |
| Blog article | `{article_title} \| {name}` | How We Source Our Ingredients \| The Meridian |
| Gallery | `Gallery \| {name} — {cuisine} in {city}` | Gallery \| The Meridian — Contemporary in NY |

### Description Patterns

```
Home:
  "{name} is a {cuisine} restaurant in {neighborhood}, {city}.
   {tagline}. Reservations available online."
   (max 155 chars)

Service/Menu page:
  "Explore the {menu_type} menu at {name} in {city}.
   {cuisine} cuisine with {differentiator}."

Event:
  "{event_title} at {name} — {date}. {short_description}
   Reserve your spot today."
```

---

### Schema.org Implementation

#### Restaurant schema (every page — site-wide via layout.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "{site.name.en}",
  "description": "{seo.description.en}",
  "url": "https://{site.domain}/en",
  "telephone": "{site.phone}",
  "email": "{site.email}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{site.address.street}",
    "addressLocality": "{site.address.city}",
    "addressRegion": "{site.address.state}",
    "postalCode": "{site.address.zip}",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday","Wednesday","Thursday"],
      "opens": "17:00",
      "closes": "22:00"
    }
  ],
  "servesCuisine": "{site.cuisine.en}",
  "priceRange": "$$$$",
  "hasMenu": "https://{site.domain}/en/menu",
  "acceptsReservations": true,
  "currenciesAccepted": "USD",
  "image": "{gallery.featured[0].url}",
  "sameAs": [
    "{site.social.instagram}",
    "{site.social.yelp}"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{site.ratings.google.rating}",
    "reviewCount": "{site.ratings.google.count}"
  }
}
```

#### MenuItem schema (on menu pages)

```json
{
  "@type": "MenuItem",
  "name": "{item.name.en}",
  "description": "{item.description.en}",
  "offers": {
    "@type": "Offer",
    "price": "{item.price / 100}",
    "priceCurrency": "USD"
  },
  "suitableForDiet": ["https://schema.org/GlutenFreeDiet"]
}
```

#### Event schema (on event pages)

```json
{
  "@type": "Event",
  "name": "{event.title.en}",
  "startDate": "{event.start_datetime}",
  "endDate": "{event.end_datetime}",
  "location": {
    "@type": "Place",
    "name": "{site.name.en}",
    "address": { ... }
  },
  "offers": {
    "@type": "Offer",
    "price": "{event.price_per_person / 100}",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "organizer": {
    "@type": "Organization",
    "name": "{site.name.en}"
  }
}
```

#### BlogPosting schema

```json
{
  "@type": "BlogPosting",
  "headline": "{post.title.en}",
  "description": "{post.excerpt.en}",
  "datePublished": "{post.published_at}",
  "dateModified": "{post.updated_at}",
  "author": {
    "@type": "Person",
    "name": "{post.author.name}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{site.name.en}"
  },
  "image": "{post.featured_image}"
}
```

#### BreadcrumbList (all pages)

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://{domain}/en" },
    { "@type": "ListItem", "position": 2, "name": "Menu", "item": "https://{domain}/en/menu" },
    { "@type": "ListItem", "position": 3, "name": "Dinner", "item": "https://{domain}/en/menu/dinner" }
  ]
}
```

### hreflang Implementation

```html
<!-- On every page, declare all language alternates -->
<link rel="alternate" hreflang="en"      href="https://{domain}/en/{path}" />
<link rel="alternate" hreflang="zh-Hans" href="https://{domain}/zh/{path}" />
<link rel="alternate" hreflang="es"      href="https://{domain}/es/{path}" />
<link rel="alternate" hreflang="x-default" href="https://{domain}/en/{path}" />
```

---

## Section 10: Conversion Funnel Design

The customer journey from first search to seated guest — mapped to site pages and content.

```
STAGE 1: AWARENESS
─────────────────
Goal:       Appear in search results + social feeds
Pages:      Blog articles, Google My Business, Instagram
Content:    Blog SEO titles targeting "best [cuisine] in [city]"
            Schema.org markup for rich results
            Instagram feed (if enabled)
CTA:        None — content builds brand recognition
Friction:   Weak SEO → not found. Missing GMB → no map pack.

STAGE 2: DISCOVERY
──────────────────
Goal:       Make a strong first impression in <3 seconds
Pages:      Homepage
Content:    Hero (photography + headline + hours status)
            Trust bar (press logos / Google rating)
            Menu preview (2–4 signature dishes)
CTA:        "Reserve a Table" — visible without scrolling
Friction:   Slow load, bad mobile hero crop, no hours visible

STAGE 3: CONSIDERATION
───────────────────────
Goal:       Convert a curious visitor into an intent-to-visit visitor
Pages:      Menu pages, About/Chef, Gallery, Events, Press
Content:    Full menu (HTML, not PDF), dish photography
            Chef biography + credentials
            Gallery — food + atmosphere
            Press/awards (validation)
            Testimonials
CTA:        "Reserve" persistent in sticky header
            "Experience our menu in person" at bottom of menu pages
Friction:   PDF menu (can't evaluate), no chef story, no gallery

STAGE 4: INTENT
───────────────
Goal:       Remove all remaining hesitation before booking
Pages:      Reservations, Contact, FAQ
Content:    Reservation widget (frictionless, mobile-first)
            Hours + parking + dress code + policies
            FAQ (cancellation, dietary, accessibility)
            "Only X tables available tonight" urgency (if enabled)
CTA:        Primary: date/party/time selector
            Secondary: phone number click-to-call
Friction:   Broken OT widget, confusing policy, no phone fallback

STAGE 5: CONVERSION
────────────────────
Goal:       Confirmed booking in hand
Pages:      Reservations (success state), confirmation email
Content:    Booking confirmation with date/time/party size
            Restaurant address + directions link
            Cancellation policy reminder
            "Add to Calendar" link
CTA:        None — conversion complete
            Optionally: "Share your reservation" social share
Friction:   No confirmation email, no calendar link, no address reminder

STAGE 6: RETENTION
──────────────────
Goal:       Turn a first-time guest into a regular
Pages:      Events page, Blog, Gift Cards
Content:    Events announcements (reason to return)
            Newsletter signup (keep in touch)
            Gift card purchase (drive referrals)
            Loyalty program (if enabled)
CTA:        "See upcoming events", "Join our mailing list"
Friction:   No events calendar, no newsletter, nothing to come back for
```

### CTA Placement Map by Page

| Page | Primary CTA | Secondary CTA | Sticky CTA |
|---|---|---|---|
| Home hero | Reserve a Table | View Menu | Reserve (header) |
| Menu page | Reserve a Table | — | Reserve (header + bottom banner) |
| About | Book Your Evening | Meet the Team | Reserve (header) |
| Chef/Team | Experience the Menu | — | Reserve (header) |
| Events | Reserve for This Event | View All Events | Reserve (header) |
| Blog article | Visit Us | Explore the Menu | Reserve (header) |
| Gallery | Book a Table | — | Reserve (header) |
| Contact | Get Directions | Call Us | Reserve (header) |
| Reservations | [Widget] | Call to Reserve | — |

---

## Section 11: Master Template Content Volume

Minimum seed content for the master template. C-stage agents will generate this content in all configured languages.

### Menu Seed Targets

| Menu Type | Categories | Items per Category | Total Items |
|---|---|---|---|
| Dinner | 5 (Apps, Pasta, Mains, Sides, Desserts) | 5–6 | 27 |
| Lunch | 4 (Starters, Sandwiches, Mains, Desserts) | 4–5 | 18 |
| Brunch | 4 (Morning, Eggs, Mains, Drinks) | 5 | 20 |
| Cocktails | 4 (Signature, Classics, Low-ABV, Non-Alcoholic) | 5 | 20 |
| Wine | 5 (Sparkling, White, Red, Rosé, Dessert) | 6 | 30 |
| Seasonal | 1 | 6 | 6 |
| **Total** | | | **121 menu items** |

All 121 items with: name, description, price, dietary flags, allergens in EN + ZH + ES.

### Team Profiles
- 1 Executive Chef (full `ChefHeroFull` content)
- 1 Sous Chef
- 1 Pastry Chef
- 1 Bar Director / Sommelier
- 1 General Manager
- **Total: 5 profiles**, full bio in EN + ZH + ES

### Blog Seed Articles (15 minimum)

| # | Title | Category |
|---|---|---|
| 1 | The Philosophy Behind Our Menu: Seasonal, Local, Honest | Chef Perspective |
| 2 | How We Source Our Ingredients | Sourcing |
| 3 | Meet the Chef: The Story Behind the Kitchen | Chef Perspective |
| 4 | A Guide to Wine Pairing for Non-Wine People | Wine & Spirits |
| 5 | The Art of the Cocktail: Our Bar Philosophy | Wine & Spirits |
| 6 | Private Dining: How to Plan the Perfect Event | Events |
| 7 | Behind the Scenes: A Day in Our Kitchen | Behind the Scenes |
| 8 | The Best Dishes for First-Time Visitors | Seasonal Guide |
| 9 | Our Commitment to Sustainable Sourcing | Sourcing |
| 10 | Understanding Our Seasonal Menu Changes | Kitchen Stories |
| 11 | The Story of Our Signature Dish | Kitchen Stories |
| 12 | Hosting a Business Dinner: What to Know | Seasonal Guide |
| 13 | How We Train Our Front-of-House Team | Behind the Scenes |
| 14 | A Guide to Our Vegetarian and Vegan Options | Seasonal Guide |
| 15 | New Year's Eve at The Meridian: What to Expect | Events |

All 15 articles in EN + ZH + ES. ~600–800 words each.

### Events Seed
- 6 upcoming events (one per event_type: wine-dinner, live-music, tasting, holiday, chef-collab, class)
- 3 past events (for "past events" section)

### Gallery Seed
- 12 food photography placeholders (structured with correct alt text + captions)
- 6 interior/ambiance
- 4 team/chef
- 4 events/atmosphere
- **Total: 26 gallery items** with full metadata in all locales

### Press Seed
- 3 press mentions (fictional publications)
- 2 awards (fictional: "Best New Restaurant 2025", "Chef of the Year Nominee")

---

## Section 12: Database Schema Reference

These TypeScript interfaces map directly to Supabase tables. All restaurant content tables follow the pattern established in the medical system (`content_entries` with `site_id` scoping).

### Dedicated tables (high-query frequency, structured access)

```sql
-- Core content tables (same as medical system — no change)
content_entries   (id, site_id, locale, path, data jsonb, updated_at, updated_by)
content_revisions (id, entry_id, data, created_at, created_by, note)

-- Restaurant-specific structured tables
menu_categories   (id, site_id, name jsonb, menu_type, display_order, active, ...)
menu_items        (id, site_id, category_id, name jsonb, description jsonb,
                   price int, dietary_flags text[], allergens text[], ...)
bookings          (id, site_id, guest jsonb, party_size, date, time, status, ...)
events            (id, site_id, title jsonb, event_type, start_datetime, ...)
team_members      (id, site_id, name, role jsonb, bio jsonb, department, ...)
gallery_items     (id, site_id, url, alt jsonb, category, display_order, ...)
blog_posts        (id, site_id, title jsonb, slug, body jsonb, published_at, ...)
press_items       (id, site_id, publication, headline jsonb, is_award, ...)
```

### JSON content (stored in content_entries)

Path convention: `pages/{page_name}`, `globals/{section}`, `theme`

```
content_entries paths for restaurant:
  theme
  site
  navigation
  header
  footer
  pages/home
  pages/about
  pages/about-team
  pages/menu
  pages/reservations
  pages/contact
  pages/events
  pages/gallery
  pages/blog
  pages/faq
  pages/gift-cards
  pages/careers
  seo/home
  seo/menu
  seo/about
  ... (seo/{page} for every page)
```

---

*End of A6 — Content Contracts & SEO Strategy*

---

## Brand & Theme Types

```typescript
// The 4 registered brand variants — set per site in theme content entry
type BrandVariant =
  | "noir-saison"      // dark backdrop, gold accent, Cormorant Garamond — fine dining
  | "terre-vivante"    // warm cream, terracotta, Playfair Display — rustic-elegant
  | "velocite"         // white, red accent, DM Serif Display — modern-minimal
  | "matin-clair"      // bright white, green, Nunito, rounded — casual/brunch

interface ThemeConfig {
  variant: BrandVariant
  // Optional per-client token overrides applied on top of the variant defaults.
  // Only primary color and derived tokens are overrideable in Pipeline B.
  overrides?: {
    colorPrimary?: string      // hex e.g. "#C9A84C"
    colorPrimaryHover?: string
    colorSecondary?: string
    fontDisplay?: string       // Google Font family name
    fontHeading?: string
    cardRadius?: string        // e.g. "0px" | "8px" | "16px"
    btnRadius?: string
  }
}
```

---

## Content Entry Types

```typescript
// Supabase content_entries table row — the CMS backbone
// path examples: "pages/home", "pages/menu-dinner", "site", "header", "footer", "navigation", "seo"
interface ContentEntry {
  id: string
  site_id: SiteId
  locale: Locale
  path: string
  data: PageContent | SiteInfo | HeaderConfig | FooterConfig | NavigationConfig | SeoConfig | ThemeConfig
  updated_at: ISODateTime
  updated_by?: string       // admin user ID who last saved
}

// Root structure of a page content entry
interface PageContent {
  sections: SectionContent[]
  seo?: {
    title?: LocalizedString
    description?: LocalizedString
    og_image?: ImageURL
    no_index?: boolean
  }
}

// A single section instance within a page
interface SectionContent {
  id: string           // unique within page, e.g. "hero-1", "trust-bar-1"
  type: SectionType    // registered section type from RESTAURANT_CONTENT_CONTRACTS.md
  variant: string      // registered variant ID for this section type
  data: Record<string, unknown>  // section-specific fields per content contract
  hidden?: boolean     // admin can hide without deleting
}

// All registered section types — matches RESTAURANT_CONTENT_CONTRACTS.md registry
type SectionType =
  | "hero-fullscreen-dish"
  | "hero-split-ambiance"
  | "hero-video-atmosphere"
  | "hero-editorial"
  | "hero-cafe-welcome"
  | "trust-bar"
  | "testimonials"
  | "press-logo-strip"
  | "menu-preview"
  | "menu-category-nav"
  | "menu-section"
  | "about-preview"
  | "chef-hero-full"
  | "team-grid"
  | "reservations-cta"
  | "reservation-widget-resy"
  | "reservation-widget-opentable"
  | "reservation-widget-custom"
  | "events-preview"
  | "events-grid"
  | "gallery-preview"
  | "gallery-grid"
  | "blog-preview"
  | "contact-info-block"
  | "private-dining-cta"
  | "sticky-booking-bar"
  | "dietary-legend"
  | "faq-accordion"
```

---

## Programmatic SEO Types

```typescript
// Matches lib/seo/programmatic-catalog.ts — 56 cuisine × city page entries
interface ProgrammaticPage {
  cuisineSlug: string        // e.g. "fine-dining", "contemporary-american-restaurant"
  cuisineLabel: string       // e.g. "Fine Dining"
  citySlug: string           // e.g. "manhattan", "tribeca"
  cityLabel: string          // e.g. "Manhattan"
  neighborhood?: string      // more specific area, used in body copy
  uniqueIntro: string        // 2–3 sentences unique to this page (prevents thin content)
  uniqueBody: string         // 2 unique paragraphs ~120 words
  targetKeyword: string      // primary SEO keyword for this page
  secondaryKeywords: string[]
}
```

---

## Pipeline B Types

```typescript
// Client intake JSON — input to the onboarding pipeline
interface RestaurantIntake {
  clientId: SiteId               // e.g. "cafe-soleil"
  templateSiteId: SiteId         // always "the-meridian"
  industry: "restaurant"
  business: {
    name: string                 // exact display name e.g. "Café Soleil"
    ownerName: string            // e.g. "Chef Maria Santos"
    ownerTitle?: string          // e.g. "Executive Chef & Co-Owner"
    chefCredentials?: string[]   // e.g. ["Le Cordon Bleu", "Former Nobu"]
    cuisineType: string          // e.g. "French-Mediterranean"
    subType: RestaurantSubType
    foundingYear?: number
    teamMembers?: Array<{
      slug: Slug
      name: string
      role: string
      credentials?: string[]
    }>
  }
  location: {
    address: string              // street only e.g. "88 Sunrise Avenue"
    city: string
    state: string
    zip: string
    phone: string                // formatted "(503) 555-0188"
    email: string
    lat?: number
    lng?: number
  }
  hours: Record<
    "monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday",
    { open: string; close: string } | null
  >
  social: Partial<SocialLinks>
  reservations: {
    provider: SiteFeatures["reservation_provider"]
    resyVenueId?: string
    openTableId?: string
  }
  menu: {
    enabled: MenuType[]          // only these menu types are provisioned
    reservationRequired?: boolean
  }
  brand: {
    variant: BrandVariant
    primaryColor?: string        // optional hex override e.g. "#A52A2A"
  }
  locales: {
    default: Locale
    supported: Locale[]
  }
  features: Partial<SiteFeatures>
  domains: {
    production: string           // e.g. "cafesoleil.com"
    dev?: string                 // e.g. "cafe-soleil.local"
  }
  contentTone: {
    voice: string                        // e.g. "warm, approachable, community-oriented"
    uniqueSellingPoints: string[]        // 3 bullets — fed to AI in O5
    targetDemographic: string
    generateMultilingualAI?: boolean     // if true: O5 runs 3 Claude calls (EN + ZH + ES)
  }
}

// Result shape from each pipeline step (O1–O7)
interface PipelineStepResult {
  step: "O1" | "O2" | "O3" | "O4" | "O5" | "O6" | "O7"
  success: boolean
  duration_ms: number
  records_affected?: number
  tokens_used?: number
  cost_usd?: number
  errors?: string[]
}

// O7 contamination + completeness verification output
interface VerificationResult {
  site_id: SiteId
  passed: boolean
  contamination_found: Array<{
    path: string
    field: string
    value: string
    forbidden_string: string
  }>
  required_paths_missing: string[]
  menu_item_warnings: Array<{
    menu_type: MenuType
    count: number
    minimum: number          // warn if count < minimum (default 5)
  }>
}
```

---

## Pipeline B Replacement Pairs

The 18 string pairs applied by O4 `deepReplace()`. **Always apply longest-first** to prevent partial matches (e.g. pair 1 before pair 2, pair 9 before pair 10).

| # | Find (template string) | Replace with (from intake) |
|---|---|---|
| 1 | `The Meridian Restaurant` | `{business.name} Restaurant` |
| 2 | `The Meridian` | `{business.name}` |
| 3 | `Chef Marcus Webb` | `{business.ownerName}` |
| 4 | `Marcus Webb` | `{business.ownerName}` |
| 5 | `themeridian.com` | `{domains.production}` |
| 6 | `info@themeridian.com` | `{location.email}` |
| 7 | `reservations@themeridian.com` | `{location.emailReservations ?? location.email}` |
| 8 | `1 Meridian Plaza` | `{location.address}` |
| 9 | `New York, NY 10001` | `{location.city}, {location.state} {location.zip}` |
| 10 | `New York, NY` | `{location.city}, {location.state}` |
| 11 | `Contemporary American` | `{business.cuisineType}` |
| 12 | `@themeridiannyc` | `{social.instagram_handle}` |
| 13 | `(212) 555-0100` | `{location.phone}` |
| 14 | `New York` | `{location.city}` |
| 15 | `10001` | `{location.zip}` |
| 16 | `NYC` | `{location.city}` |
| 17 | `10 East 44th Street` | `{location.address}` |
| 18 | `Manhattan` | `{location.city}` |

**Forbidden strings for O7 contamination scan** (in addition to above find values):
```
"The Meridian", "Marcus Webb", "themeridian.com",
"(212) 555-0100", "info@themeridian.com",
"Lorem ipsum", "[PLACEHOLDER]", "[INSERT", "[TODO"
```

---

## Stage A Complete ✓

All 6 artifacts have been produced:

| Agent | Artifact | Size |
|---|---|---|
| A1 Research | `a1_industry_brief.md` | ~7,000 words |
| A2 Brand System | `a2_brand_system.md` | ~5,000 words |
| A3 Architecture | `a3_site_architecture.md` | ~6,000 words |
| A4 Components | `a4_component_inventory.md` | ~6,500 words |
| A5 Design Tokens | `a5_design_tokens.md` | ~7,000 words |
| A6 Content Contracts | `a6_content_contracts.md` | ~6,500 words |

**Next: Gate 1 — Human Review**
Read all 6 artifacts. Confirm: site architecture complete, brand variants correct,
components inventoried, tokens fully specified, content contracts buildable.
Then proceed to Stage B: system codebase build.
