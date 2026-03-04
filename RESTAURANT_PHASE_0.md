# BAAM System R — Restaurant Premium
# Phase 0: Infrastructure + Content Contracts

> **System:** BAAM System R — Restaurant Premium
> **Reference files:** `@RESTAURANT_COMPLETE_PLAN.md` + `@a6_content_contracts.md`
> **Baseline codebase:** drhuangclinic.com multi-tenant platform (fork this workspace)
> **Prerequisite:** Stage A all 6 artifacts complete, all 7 A-Gates passed
> **Method:** One Cursor prompt per session. Verify done-gate before next prompt.
> **Rule:** Never skip a done-gate. Never run the next prompt until the current one is clean.

---

## Phase 0 Overview

**Duration:** Day 1–3
**Goal:** Establish a clean restaurant codebase, implement all 4 brand variants, define complete content contracts for every section, and seed the master template (The Meridian) with realistic baseline content — so Phase 1 can start building pages immediately without any infrastructure uncertainty.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 0A | Fork + Strip + New Database | Clean codebase + Supabase project | 60 min |
| 0B | Theme Setup — 4 Brand Variants | Design token system + fonts | 45 min |
| 0C | Global Content Files | site.json, header, footer, nav, seo | 30 min |
| 0D | Content Contracts — All Sections | Every section: variants + JSON + admin form fields | 60 min |
| 0E | Seed Baseline Content | 121 menu items, 5 profiles, 15 blog stubs, layout files | 60 min |

---

## Prompt 0A — Fork drhuangclinic + Strip Medical + New Database

**Goal:** Establish a clean restaurant codebase from the dental/medical platform. Remove all medical-specific content and components while preserving the entire admin CMS, multi-tenant infrastructure, and shared UI components.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "Stage B Overview"

START FROM: The drhuangclinic.com codebase in this workspace.

STEP 1 — STRIP medical-specific code.

Remove these directories and files entirely:
- content/drhuang-clinic/ (all dental content JSON — we will reseed from scratch)
- content/alex-dental/ (if present)
- components/dental/ (all dental-specific section components)
- components/sections/DentalHero.tsx (or equivalent)
- components/sections/ServiceGrid.tsx (dental version)
- components/sections/AppointmentForm.tsx
- components/sections/InsuranceDisplay.tsx
- components/sections/BeforeAfterSlider.tsx
- components/sections/DentalProcedure.tsx
- components/sections/EmergencyBanner.tsx (dental-specific)
- app/api/appointment/ (dental booking API route)
- app/api/insurance/ (dental insurance API route)
- Any component with "Dental", "Clinic", "Patient", "Procedure" in its name

KEEP intact — do not touch any of these:
- All admin CMS: app/admin/, components/admin/, lib/admin/
- Content loading: lib/content.ts, lib/contentDb.ts
- Media system: lib/media.ts, app/api/admin/media/
- Theme system: theme.json processing + CSS variable pipeline in layout.tsx
- Domain routing middleware: middleware.ts (host-based site resolution)
- Import/export system: app/api/admin/import/, app/api/admin/export/
- Auth system: lib/auth.ts, app/api/auth/
- LanguageSwitcher component
- TestimonialDisplay (all variants)
- BlogCard, BlogGrid, BlogHub, BlogPostTemplate
- MapEmbed component
- ContactForm component (generic)
- FAQAccordion component
- Breadcrumb component
- OpenHoursDisplay component (useful for restaurant hours)
- QA scripts: scripts/qa/

STEP 2 — Create a new Supabase project.

This is CRITICAL. NEVER reuse the dental or medical Supabase project.
One Supabase project per industry. Restaurant gets its own isolated project.

Create new project in Supabase dashboard named "BAAM-Restaurant".
Update .env.local with the new project credentials.

STEP 3 — Run this SQL in the new Supabase project (in order).

Execute each block separately to catch errors:

-- Base tables (inherited from medical system — keep as-is)
-- content_entries, sites, site_domains, users, media_assets
-- (copy schema from existing project, these are platform tables)

-- Restaurant-specific tables:

CREATE TABLE menu_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  name jsonb NOT NULL DEFAULT '{}',
  description jsonb DEFAULT '{}',
  menu_type text NOT NULL,
  display_order integer DEFAULT 0,
  available_days text[] DEFAULT NULL,
  available_from text DEFAULT NULL,
  available_until text DEFAULT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE menu_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name jsonb NOT NULL DEFAULT '{}',
  description jsonb DEFAULT '{}',
  price integer DEFAULT NULL,
  price_note jsonb DEFAULT '{}',
  price_range jsonb DEFAULT NULL,
  image text DEFAULT NULL,
  dietary_flags text[] DEFAULT '{}',
  allergens text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  seasonal boolean DEFAULT false,
  seasonal_note jsonb DEFAULT '{}',
  new_item boolean DEFAULT false,
  spice_level integer DEFAULT 0,
  available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  guest jsonb NOT NULL DEFAULT '{}',
  party_size integer NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  datetime timestamptz NOT NULL,
  special_requests text DEFAULT NULL,
  occasion text DEFAULT NULL,
  status text DEFAULT 'pending',
  source text DEFAULT 'web',
  confirmation_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  cancelled_at timestamptz DEFAULT NULL,
  cancellation_reason text DEFAULT NULL
);

CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  title jsonb NOT NULL DEFAULT '{}',
  description jsonb DEFAULT '{}',
  short_description jsonb DEFAULT '{}',
  event_type text NOT NULL,
  image text DEFAULT NULL,
  tags text[] DEFAULT '{}',
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  price_per_person integer DEFAULT NULL,
  price_note jsonb DEFAULT '{}',
  reservation_required boolean DEFAULT false,
  reservation_link text DEFAULT NULL,
  capacity integer DEFAULT NULL,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  cancelled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  role jsonb NOT NULL DEFAULT '{}',
  bio jsonb DEFAULT '{}',
  short_bio jsonb DEFAULT '{}',
  photo text DEFAULT NULL,
  photo_portrait text DEFAULT NULL,
  credentials text[] DEFAULT '{}',
  awards jsonb DEFAULT '[]',
  philosophy jsonb DEFAULT '{}',
  department text DEFAULT 'culinary',
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE gallery_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  url text NOT NULL,
  thumbnail_url text DEFAULT NULL,
  alt jsonb DEFAULT '{}',
  category text DEFAULT 'food',
  caption jsonb DEFAULT '{}',
  credit text DEFAULT NULL,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  width integer DEFAULT NULL,
  height integer DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE press_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  publication text NOT NULL,
  logo text DEFAULT NULL,
  headline jsonb NOT NULL DEFAULT '{}',
  excerpt jsonb DEFAULT '{}',
  url text DEFAULT NULL,
  date date NOT NULL,
  award jsonb DEFAULT '{}',
  is_award boolean DEFAULT false,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE private_dining_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT NULL,
  date date,
  party_size integer,
  occasion text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_dining_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read for display tables
CREATE POLICY "Public read menu_categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (active = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (active = true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read press_items" ON press_items FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service full access menu_categories" ON menu_categories USING (auth.role() = 'service_role');
CREATE POLICY "Service full access menu_items" ON menu_items USING (auth.role() = 'service_role');
CREATE POLICY "Service full access bookings" ON bookings USING (auth.role() = 'service_role');
CREATE POLICY "Service full access events" ON events USING (auth.role() = 'service_role');
CREATE POLICY "Service full access team_members" ON team_members USING (auth.role() = 'service_role');
CREATE POLICY "Service full access gallery_items" ON gallery_items USING (auth.role() = 'service_role');
CREATE POLICY "Service full access press_items" ON press_items USING (auth.role() = 'service_role');
CREATE POLICY "Service full access contact_submissions" ON contact_submissions USING (auth.role() = 'service_role');
CREATE POLICY "Service full access private_dining" ON private_dining_inquiries USING (auth.role() = 'service_role');

STEP 4 — Update site configuration.

Replace _sites.json with:
{
  "the-meridian": {
    "id": "the-meridian",
    "name": "The Meridian",
    "domain": "meridian.local",
    "locales": ["en", "zh", "es"],
    "defaultLocale": "en",
    "enabled": true,
    "type": "restaurant",
    "subType": "fine-dining"
  }
}

Add to /etc/hosts:
127.0.0.1 meridian.local

Update package.json dev script to port 3060.

STEP 5 — Update .env.local:

APP_ENV=development
NEXT_PUBLIC_DEFAULT_SITE=the-meridian
NEXT_PUBLIC_APP_URL=http://meridian.local:3060
SUPABASE_URL=[new restaurant project URL]
SUPABASE_ANON_KEY=[new restaurant anon key]
SUPABASE_SERVICE_ROLE_KEY=[new restaurant service role key]
JWT_SECRET=[generate new secret — do not reuse dental secret]
RESEND_API_KEY=[keep existing]
RESEND_FROM_EMAIL=noreply@themeridian.com
RESEND_RESERVATIONS_EMAIL=reservations@themeridian.com
UNSPLASH_ACCESS_KEY=[keep existing]
PEXELS_API_KEY=[keep existing]
ANTHROPIC_API_KEY=[required for Pipeline B AI content generation]

STEP 6 — Create Supabase Storage bucket.

In Supabase dashboard → Storage → Create bucket:
Name: "media"
Public: true
Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

VERIFY:
- npm run dev boots at http://meridian.local:3060 without errors
- /admin route accessible and login works
- Supabase connection works (no connection errors in console)
- All 9 new restaurant DB tables visible in Supabase Table Editor
- RLS policies visible on all tables
- No dental/medical components remain in components/
- Storage bucket "media" exists
```

### Done-Gate 0A

- [ ] App boots at `meridian.local:3060` without errors
- [ ] `/admin` accessible, login works
- [ ] New Supabase project connected (verify URL in Supabase dashboard — NOT dental project)
- [ ] All 9 restaurant tables visible in Supabase Table Editor
- [ ] RLS policies applied on all new tables
- [ ] Storage bucket `media` created and set to public
- [ ] No dental/medical components in `components/` directory
- [ ] `_sites.json` has `the-meridian` entry only
- [ ] Browser console: zero connection errors on `meridian.local:3060`
- [ ] `git commit: "feat: phase-0A — fork drhuangclinic, strip medical, restaurant DB schema"`

---

## Prompt 0B — Theme Setup — 4 Brand Variants

**Goal:** Implement the complete design token system for all 4 restaurant brand variants. Every client site will select one of these at onboarding. The variant must be switchable from the admin without any code changes.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "A2: Brand System"
Reference: @a5_design_tokens.md (full token specs)

STEP 1 — Create theme.json for the master template (Noir Saison — default for The Meridian).

CREATE content/the-meridian/theme.json:
{
  "variantId": "noir-saison",
  "colors": {
    "primary":    { "DEFAULT": "#C9A84C", "dark": "#A8873A", "light": "#D4B96A", "50": "#FAF5E7", "100": "#F2E6C4" },
    "secondary":  { "DEFAULT": "#E8E0D5", "dark": "#C9BDB0", "light": "#F0EBE3" },
    "backdrop":   { "primary": "#111111", "secondary": "#1A1A1A", "surface": "#232323", "card": "#2A2A2A" },
    "text":       { "primary": "#F5F0E8", "secondary": "#B8B0A0", "muted": "#7A7268", "inverse": "#111111" },
    "border":     { "DEFAULT": "#333333", "subtle": "#2A2A2A", "emphasis": "#C9A84C" },
    "status":     { "success": "#4CAF50", "warning": "#FF9800", "error": "#F44336" }
  },
  "typography": {
    "fonts": {
      "display":  "'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "heading":  "'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "body":     "'Lato', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif",
      "ui":       "'Lato', system-ui, sans-serif"
    },
    "sizes": {
      "display":    "clamp(44px, 5vw, 80px)",
      "h1":         "clamp(32px, 3.5vw, 56px)",
      "h2":         "clamp(24px, 2.5vw, 40px)",
      "h3":         "clamp(18px, 1.8vw, 28px)",
      "h4":         "clamp(16px, 1.4vw, 22px)",
      "body":       "16px",
      "small":      "14px",
      "menuName":   "clamp(15px, 1.2vw, 18px)",
      "menuDesc":   "14px",
      "menuPrice":  "16px"
    },
    "tracking": {
      "display":  "0.12em",
      "heading":  "0.06em",
      "body":     "0.01em",
      "nav":      "0.08em",
      "label":    "0.10em"
    },
    "lineHeight": {
      "display":  "1.1",
      "heading":  "1.2",
      "body":     "1.7",
      "menu":     "1.5"
    }
  },
  "spacing": {
    "sectionPy":    "6rem",
    "sectionPySm":  "4rem",
    "containerMax": "1280px",
    "containerPx":  "24px",
    "cardPad":      "2rem",
    "menuItemPy":   "1.25rem",
    "navHeight":    "72px",
    "heroMinH":     "100vh",
    "gridGap":      "1.5rem"
  },
  "effects": {
    "cardRadius":     "0px",
    "btnRadius":      "0px",
    "badgeRadius":    "2px",
    "cardShadow":     "0 1px 3px rgba(0,0,0,0.5)",
    "cardShadowHover":"0 4px 16px rgba(0,0,0,0.7)",
    "heroOverlay":    "0.55",
    "menuDivider":    "1px solid #333333",
    "btnOutline":     "1px solid #C9A84C"
  },
  "motion": {
    "durationFast":  "200ms",
    "durationBase":  "400ms",
    "durationSlow":  "600ms",
    "easing":        "cubic-bezier(0.4, 0, 0.2, 1)",
    "hoverLift":     "-2px",
    "entranceDist":  "24px"
  }
}

STEP 2 — Create the 3 remaining variant theme files.

CREATE content/the-meridian/theme-terre-vivante.json:
(same structure as above with these values)
{
  "variantId": "terre-vivante",
  "colors": {
    "primary":    { "DEFAULT": "#8B3A2A", "dark": "#6E2E20", "light": "#A84D3A", "50": "#FCF0EE", "100": "#F5D9D4" },
    "secondary":  { "DEFAULT": "#C8A45B", "dark": "#A88440", "light": "#D4B574", "50": "#FBF6EC" },
    "backdrop":   { "primary": "#FDFAF5", "secondary": "#F5F0E8", "surface": "#FFFFFF", "card": "#FFFFFF" },
    "text":       { "primary": "#2A1F1A", "secondary": "#5C4A3A", "muted": "#9A8878", "inverse": "#FDFAF5" },
    "border":     { "DEFAULT": "#E8DDD4", "subtle": "#F0EAE3", "emphasis": "#8B3A2A" }
  },
  "typography": {
    "fonts": {
      "display":  "'Playfair Display', 'Noto Serif SC', Georgia, serif",
      "heading":  "'Playfair Display', 'Noto Serif SC', Georgia, serif",
      "body":     "'Source Sans 3', 'Noto Sans SC', system-ui, sans-serif",
      "ui":       "'Source Sans 3', system-ui, sans-serif"
    },
    "tracking": { "display": "0.02em", "heading": "0.01em", "body": "0em", "nav": "0.03em", "label": "0.05em" }
  },
  "spacing": { "sectionPy": "5rem", "cardPad": "1.75rem", "navHeight": "68px", "menuItemPy": "1rem" },
  "effects": { "cardRadius": "8px", "btnRadius": "4px", "badgeRadius": "4px", "heroOverlay": "0.35", "menuDivider": "1px solid #E8DDD4" },
  "motion": { "durationBase": "300ms", "easing": "ease-out", "hoverLift": "-3px" }
}

CREATE content/the-meridian/theme-velocite.json:
{
  "variantId": "velocite",
  "colors": {
    "primary":    { "DEFAULT": "#E63946", "dark": "#C02833", "light": "#EC5F6B", "50": "#FEF0F1", "100": "#FBCFD2" },
    "secondary":  { "DEFAULT": "#0F0F0F", "dark": "#000000", "light": "#1A1A1A" },
    "backdrop":   { "primary": "#FFFFFF", "secondary": "#F5F5F5", "surface": "#FFFFFF", "card": "#FAFAFA" },
    "text":       { "primary": "#0F0F0F", "secondary": "#3A3A3A", "muted": "#7A7A7A", "inverse": "#FFFFFF" },
    "border":     { "DEFAULT": "#E0E0E0", "subtle": "#F0F0F0", "emphasis": "#0F0F0F" }
  },
  "typography": {
    "fonts": {
      "display":  "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
      "heading":  "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
      "body":     "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
      "ui":       "'DM Sans', system-ui, sans-serif"
    },
    "sizes": { "display": "clamp(48px, 6vw, 88px)" },
    "tracking": { "display": "-0.03em", "heading": "-0.01em", "body": "0em", "nav": "0.02em", "label": "0.06em" }
  },
  "spacing": { "sectionPy": "5.5rem", "cardPad": "2rem", "navHeight": "64px", "menuItemPy": "1.25rem" },
  "effects": { "cardRadius": "0px", "btnRadius": "0px", "badgeRadius": "0px", "heroOverlay": "0.4", "menuDivider": "1px solid #E0E0E0", "btnOutline": "2px solid #0F0F0F" },
  "motion": { "durationBase": "200ms", "easing": "ease", "hoverLift": "0px" }
}

CREATE content/the-meridian/theme-matin-clair.json:
{
  "variantId": "matin-clair",
  "colors": {
    "primary":    { "DEFAULT": "#3D7A5F", "dark": "#2E5F49", "light": "#52957A", "50": "#EEF7F2", "100": "#D4EDE2" },
    "secondary":  { "DEFAULT": "#F4A261", "dark": "#D4844A", "light": "#F6B480", "50": "#FEF5EC" },
    "backdrop":   { "primary": "#FFFFFF", "secondary": "#F8FBF9", "surface": "#FFFFFF", "card": "#FFFFFF" },
    "text":       { "primary": "#1A2E24", "secondary": "#4A6358", "muted": "#8AA898", "inverse": "#FFFFFF" },
    "border":     { "DEFAULT": "#DCE8E2", "subtle": "#EDF4F0", "emphasis": "#3D7A5F" }
  },
  "typography": {
    "fonts": {
      "display":  "'Nunito', 'Noto Sans SC', system-ui, sans-serif",
      "heading":  "'Nunito', 'Noto Sans SC', system-ui, sans-serif",
      "body":     "'Nunito', 'Noto Sans SC', system-ui, sans-serif",
      "ui":       "'Nunito', system-ui, sans-serif"
    },
    "tracking": { "display": "-0.01em", "heading": "-0.01em", "body": "0em", "nav": "0.01em", "label": "0.02em" }
  },
  "spacing": { "sectionPy": "4rem", "cardPad": "1.5rem", "navHeight": "64px", "menuItemPy": "0.875rem" },
  "effects": { "cardRadius": "16px", "btnRadius": "100px", "badgeRadius": "100px", "heroOverlay": "0.25", "menuDivider": "1px solid #DCE8E2" },
  "motion": { "durationBase": "240ms", "easing": "cubic-bezier(0.34, 1.56, 0.64, 1)", "hoverLift": "-4px" }
}

STEP 3 — Update layout.tsx to inject CSS variables from active theme.

In app/[locale]/layout.tsx, read theme.json from content_entries
and inject as :root CSS variables:

const cssVars = {
  '--color-primary':          theme.colors.primary.DEFAULT,
  '--color-primary-dark':     theme.colors.primary.dark,
  '--color-primary-light':    theme.colors.primary.light,
  '--color-primary-50':       theme.colors.primary['50'],
  '--color-backdrop':         theme.colors.backdrop.primary,
  '--color-backdrop-surface': theme.colors.backdrop.surface,
  '--color-backdrop-card':    theme.colors.backdrop.card,
  '--color-text-primary':     theme.colors.text.primary,
  '--color-text-secondary':   theme.colors.text.secondary,
  '--color-text-muted':       theme.colors.text.muted,
  '--color-text-inverse':     theme.colors.text.inverse,
  '--color-border':           theme.colors.border.DEFAULT,
  '--color-border-emphasis':  theme.colors.border.emphasis,
  '--font-display':           theme.typography.fonts.display,
  '--font-heading':           theme.typography.fonts.heading,
  '--font-body':              theme.typography.fonts.body,
  '--font-ui':                theme.typography.fonts.ui,
  '--size-display':           theme.typography.sizes.display,
  '--size-h1':                theme.typography.sizes.h1,
  '--size-h2':                theme.typography.sizes.h2,
  '--size-h3':                theme.typography.sizes.h3,
  '--tracking-display':       theme.typography.tracking.display,
  '--tracking-heading':       theme.typography.tracking.heading,
  '--tracking-nav':           theme.typography.tracking.nav,
  '--section-py':             theme.spacing.sectionPy,
  '--container-max':          theme.spacing.containerMax,
  '--container-px':           theme.spacing.containerPx,
  '--card-pad':               theme.spacing.cardPad,
  '--menu-item-py':           theme.spacing.menuItemPy,
  '--nav-height':             theme.spacing.navHeight,
  '--card-radius':            theme.effects.cardRadius,
  '--btn-radius':             theme.effects.btnRadius,
  '--badge-radius':           theme.effects.badgeRadius,
  '--card-shadow':            theme.effects.cardShadow,
  '--card-shadow-hover':      theme.effects.cardShadowHover,
  '--hero-overlay':           theme.effects.heroOverlay,
  '--menu-divider':           theme.effects.menuDivider,
  '--duration-base':          theme.motion.durationBase,
  '--easing':                 theme.motion.easing,
  '--hover-lift':             theme.motion.hoverLift,
}

Inject as style={{ ...cssVars }} on the <html> or <body> tag.

STEP 4 — Install and configure Google Fonts via next/font.

Install all font families needed across 4 variants:

import {
  Cormorant_Garamond,
  Lato,
  Playfair_Display,
  Source_Sans_3,
  DM_Serif_Display,
  DM_Sans,
  Nunito,
  Noto_Serif_SC,
  Noto_Sans_SC,
} from 'next/font/google'

Load with font-display: swap and relevant weights.
Apply via CSS variable approach (do NOT apply font classNames directly to
layout — they must flow through theme CSS variables).

STEP 5 — Seed all 4 theme variants into Supabase content_entries.

INSERT into content_entries:
- site_id: 'the-meridian', locale: 'en', path: 'theme' → noir-saison (default)
- site_id: 'the-meridian', locale: 'en', path: 'theme-terre-vivante'
- site_id: 'the-meridian', locale: 'en', path: 'theme-velocite'
- site_id: 'the-meridian', locale: 'en', path: 'theme-matin-clair'

Register all 4 in admin Variants panel so operators can switch.

VERIFY:
- Homepage loads with Noir Saison theme (dark background, gold accent, Cormorant Garamond)
- Switching to 'terre-vivante' in admin → page reloads → warm cream background, terracotta accent
- All Google Fonts load without FOUT (font-display: swap working)
- CSS variables inspectable in browser DevTools :root
- No hardcoded color hex values in any component file
```

### Done-Gate 0B

- [ ] All 4 theme.json files exist in `content/the-meridian/`
- [ ] All 4 themes seeded in Supabase `content_entries`
- [ ] Admin Variants panel shows all 4 restaurant variants
- [ ] Switching variant in admin → CSS variables change on reload (verify in DevTools)
- [ ] Google Fonts loading with no FOUT (network tab shows font files)
- [ ] `var(--color-primary)` resolves correctly in DevTools for each variant
- [ ] No hardcoded hex colors in any component (`grep -r "#[0-9A-Fa-f]" components/` returns 0 results)
- [ ] `git commit: "feat: phase-0B — 4 brand variant theme system, CSS variable pipeline"`

---

## Prompt 0C — Global Content Files

**Goal:** Populate all global settings files for The Meridian master template. These files drive Header, Footer, Navigation, and SEO across every page.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "A6: Content Contracts"
Reference: @a6_content_contracts.md interfaces: SiteInfo, NavigationConfig, HeaderConfig, FooterConfig

Create and seed all global content files for site_id: 'the-meridian'.

FILE 1 — content/the-meridian/site.json
{
  "id": "the-meridian",
  "name":    { "en": "The Meridian", "zh": "子午线餐厅", "es": "The Meridian" },
  "tagline": { "en": "Contemporary American. Seasonal. New York.", "zh": "当代美式料理。时令食材。纽约。", "es": "Americana contemporánea. De temporada. Nueva York." },
  "cuisine": { "en": "Contemporary American", "zh": "当代美式料理", "es": "Americana contemporánea" },
  "sub_type": "fine-dining",
  "brand_variant": "noir-saison",
  "founding_year": 2018,
  "address": {
    "street":  "1 Meridian Plaza",
    "city":    "New York",
    "state":   "NY",
    "zip":     "10001",
    "country": "US",
    "full":    { "en": "1 Meridian Plaza, New York, NY 10001", "zh": "美国纽约州纽约市子午线广场1号 10001", "es": "1 Meridian Plaza, Nueva York, NY 10001" }
  },
  "phone":        "+12125550100",
  "phone_display": "(212) 555-0100",
  "email":        "info@themeridian.com",
  "email_reservations": "reservations@themeridian.com",
  "hours": {
    "monday":    null,
    "tuesday":   { "open": "17:30", "close": "22:30" },
    "wednesday": { "open": "17:30", "close": "22:30" },
    "thursday":  { "open": "17:30", "close": "22:30" },
    "friday":    { "open": "17:30", "close": "23:00" },
    "saturday":  { "open": "17:00", "close": "23:00" },
    "sunday":    { "open": "17:00", "close": "21:30" },
    "note":      { "en": "Closed Mondays. Kitchen closes 30 min before listed time.", "zh": "周一休息。厨房在标注时间前30分钟停止点餐。", "es": "Cerrado los lunes. La cocina cierra 30 min antes." }
  },
  "domain":       "themeridian.com",
  "social": {
    "instagram":  "@themeridiannyc",
    "facebook":   "facebook.com/themeridiannyc",
    "yelp":       "yelp.com/biz/the-meridian-new-york",
    "google_maps":"https://maps.google.com/?q=The+Meridian+NYC",
    "resy":       "https://resy.com/cities/ny/the-meridian"
  },
  "google_maps_embed_url": "https://www.google.com/maps/embed?pb=...",
  "ratings": {
    "google": { "rating": 4.8, "count": 312, "url": "https://g.page/themeridian" },
    "yelp":   { "rating": 4.5, "count": 187, "url": "https://yelp.com/biz/the-meridian-new-york" }
  },
  "features": {
    "online_reservation": true,
    "reservation_provider": "resy",
    "resy_venue_id": "meridian-nyc",
    "private_dining": true,
    "events_section": true,
    "blog": true,
    "gallery": true,
    "press_section": true,
    "gift_cards": true,
    "online_ordering": false,
    "catering": false,
    "careers": true,
    "kids_menu": false,
    "happy_hour": false,
    "wine_list": true,
    "cocktail_menu": true,
    "allergen_display": true,
    "seasonal_menu": true,
    "instagram_feed": true,
    "loyalty_program": false,
    "multilingual_staff": true
  },
  "default_locale": "en",
  "supported_locales": ["en", "zh", "es"],
  "currency": "USD",
  "timezone": "America/New_York"
}

FILE 2 — content/the-meridian/header.json
{
  "variant": "with-top-bar",
  "transparent_hero": true,
  "sticky": true,
  "top_bar": {
    "phone": true,
    "hours": true,
    "message": { "en": "Now accepting reservations for December", "zh": "现已开放12月预订", "es": "Ahora aceptando reservas para diciembre" }
  },
  "logo": {
    "type": "text",
    "text": "THE MERIDIAN"
  }
}

FILE 3 — content/the-meridian/footer.json
{
  "variant": "dark",
  "show_newsletter": true,
  "show_social": true,
  "show_lang_switcher": true,
  "tagline": { "en": "Contemporary American cuisine in the heart of New York.", "zh": "纽约心脏地带的当代美式料理。", "es": "Cocina americana contemporánea en el corazón de Nueva York." },
  "columns": { "story": true, "hours": true, "address": true, "links": true, "social": true },
  "copyright": { "en": "{year} The Meridian. All rights reserved.", "zh": "{year} 子午线餐厅。版权所有。", "es": "{year} The Meridian. Todos los derechos reservados." }
}

FILE 4 — content/the-meridian/navigation.json
{
  "primary": [
    {
      "id": "menu", "label": { "en": "Menu", "zh": "菜单", "es": "Menú" },
      "children": [
        { "id": "dinner",       "label": { "en": "Dinner",         "zh": "晚餐",       "es": "Cena"          }, "href": "/menu/dinner",       "feature_gate": null },
        { "id": "tasting-menu", "label": { "en": "Tasting Menu",   "zh": "品鉴菜单",   "es": "Menú Degustación" }, "href": "/menu/tasting-menu", "feature_gate": null },
        { "id": "cocktails",    "label": { "en": "Cocktails",      "zh": "鸡尾酒",     "es": "Cócteles"      }, "href": "/menu/cocktails",    "feature_gate": "cocktail_menu" },
        { "id": "wine",         "label": { "en": "Wine List",      "zh": "酒单",       "es": "Carta de Vinos"}, "href": "/menu/wine",         "feature_gate": "wine_list" },
        { "id": "seasonal",     "label": { "en": "Seasonal",       "zh": "时令菜单",   "es": "De Temporada"  }, "href": "/menu/seasonal",     "feature_gate": "seasonal_menu" }
      ]
    },
    {
      "id": "about", "label": { "en": "About", "zh": "关于我们", "es": "Nosotros" },
      "children": [
        { "id": "story",  "label": { "en": "Our Story",  "zh": "我们的故事", "es": "Nuestra Historia" }, "href": "/about" },
        { "id": "team",   "label": { "en": "The Team",   "zh": "团队介绍",   "es": "El Equipo"       }, "href": "/about/team" },
        { "id": "press",  "label": { "en": "Press",      "zh": "媒体报道",   "es": "Prensa"          }, "href": "/press", "feature_gate": "press_section" }
      ]
    },
    { "id": "events",  "label": { "en": "Events",  "zh": "活动",   "es": "Eventos"   }, "href": "/events",  "feature_gate": "events_section" },
    { "id": "gallery", "label": { "en": "Gallery", "zh": "图库",   "es": "Galería"   }, "href": "/gallery", "feature_gate": "gallery" },
    { "id": "contact", "label": { "en": "Contact", "zh": "联系我们", "es": "Contacto" }, "href": "/contact" }
  ],
  "cta": {
    "label":   { "en": "Reserve a Table", "zh": "预订餐位", "es": "Reservar Mesa" },
    "href":    "/reservations",
    "variant": "primary"
  }
}

FILE 5 — content/the-meridian/seo.json
{
  "title":       { "en": "The Meridian | Contemporary American Restaurant New York", "zh": "子午线餐厅 | 纽约当代美式料理", "es": "The Meridian | Restaurante Americano Contemporáneo Nueva York" },
  "description": { "en": "The Meridian is a contemporary American restaurant in New York offering seasonal tasting menus, a curated wine list, and an intimate dining experience. Reserve online.", "zh": "子午线餐厅是纽约一家当代美式料理餐厅，提供时令品鉴菜单、精选酒单和亲密的用餐体验。", "es": "The Meridian es un restaurante americano contemporáneo en Nueva York que ofrece menús de degustación de temporada. Reserve en línea." },
  "og_image":    "/images/og-default.jpg",
  "schema_type": "Restaurant"
}

SEED ALL 5 FILES into Supabase content_entries:
- site_id: 'the-meridian', locale: 'en', path matching filename
- Seed EN, ZH, ES versions where LocalizedString fields differ

VERIFY:
- Header renders with top bar (phone + hours + message)
- Header nav shows Menu (with dropdown), About (with dropdown), Events, Gallery, Contact
- Header CTA "Reserve a Table" button visible
- Footer renders with all 5 columns in dark variant
- Language switcher shows EN | 中文 | ES and switches locale
- site.json loads correctly (check hours display in footer)
```

### Done-Gate 0C

- [ ] All 5 global files seeded in Supabase `content_entries`
- [ ] Header renders correctly from DB (not hardcoded): logo, nav, CTA button, top bar
- [ ] Nav dropdown: Menu → shows dinner/tasting/cocktails/wine/seasonal
- [ ] Footer renders from DB: all columns, social links, newsletter, lang switcher
- [ ] Language switcher: EN → ZH → ES all load without errors
- [ ] `site.json` hours display correctly in footer (Closed Monday, Tues–Sun times)
- [ ] Admin → Content Editor shows all 5 global files with editable form fields
- [ ] `git commit: "feat: phase-0C — global content files seeded (site, header, footer, nav, seo)"`

---

## Prompt 0D — Content Contracts — All Sections Defined

**Goal:** Define the complete content contract for every section type used across all 42 pages. This is the most critical Phase 0 step. Every section must have: variants list, JSON shape, admin form fields. No TBD sections.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "A3: Site Architecture"
Reference: @a6_content_contracts.md

Generate RESTAURANT_CONTENT_CONTRACTS.md — the definitive content
contract document for every section used across The Meridian site.

For EVERY section below, define:
1. Variants (list all supported variants with descriptions)
2. JSON contract (exact shape that goes in content_entries)
3. Admin form fields (field name, type, required/optional)

SECTIONS TO CONTRACT (in order of priority):

── HERO FAMILY ──────────────────────────────────────────────────────

Section: hero-fullscreen-dish
Variants: dark-overlay | light-overlay | split-text
Fields: image(ImageURL), headline(LocalizedString), subline(LocalizedString),
        ctaPrimary(label+href), ctaSecondary(label+href, optional),
        overlayOpacity(number 0-1)

Section: hero-split-ambiance
Variants: image-right | image-left
Fields: image(ImageURL), eyebrow(LocalizedString, optional),
        headline(LocalizedString), body(LocalizedString),
        ctaPrimary(label+href), ctaSecondary(label+href, optional)

Section: hero-video-atmosphere
Variants: minimal-text | centered-text
Fields: videoUrl(string), posterImage(ImageURL),
        headline(LocalizedString), subline(LocalizedString, optional),
        ctaPrimary(label+href)

Section: hero-editorial
Variants: text-dominant | photo-overlap
Fields: image(ImageURL), headline(LocalizedString),
        eyebrow(LocalizedString, optional), body(LocalizedString, optional),
        ctaPrimary(label+href)

Section: hero-cafe-welcome
Variants: bright | warm
Fields: image(ImageURL), headline(LocalizedString), subline(LocalizedString),
        hoursToday(auto-computed from site.json), ctaPrimary(label+href),
        showOpenNowBadge(boolean)

── TRUST & SOCIAL PROOF ─────────────────────────────────────────────

Section: trust-bar
Variants: logos-only | logos-with-rating | awards-strip
Fields: items(array of { type: 'press'|'award'|'rating', label, logo, value })

Section: testimonials
Variants: carousel | grid | featured-quote
Fields: items(array of { quote(LocalizedString), author, occasion, rating }),
        headline(LocalizedString, optional)

Section: press-logo-strip
Variants: dark-bg | light-bg
Fields: items(array of { publication, logo(ImageURL), url })

── MENU PREVIEW ─────────────────────────────────────────────────────

Section: menu-preview
Variants: cards-3 | cards-4 | list-with-image
Fields: headline(LocalizedString), subline(LocalizedString, optional),
        items(array of MenuItem refs — up to 6 featured items),
        cta(label+href)

Section: menu-category-nav
Variants: tabs | sidebar | dropdown
Fields: categories(auto-loaded from menu_categories for current menu_type),
        sticky(boolean), showItemCount(boolean)

Section: menu-section
Variants: standard | wine-list | cocktail-list
Fields: category_id(string ref), showDividers(boolean),
        showImages(boolean), showDietaryFlags(boolean)

── ABOUT & TEAM ─────────────────────────────────────────────────────

Section: about-preview
Variants: split-image | stacked | minimal-text
Fields: image(ImageURL), eyebrow(LocalizedString, optional),
        headline(LocalizedString), body(LocalizedString),
        cta(label+href), stats(array of { value, label }, optional)

Section: chef-hero-full
Variants: full-bleed | contained
Fields: photo(ImageURL), name(string), role(LocalizedString),
        philosophy(LocalizedString), credentials(string[]),
        awards(LocalizedString[])

Section: team-grid
Variants: 3-col | 4-col | featured-first
Fields: headline(LocalizedString, optional),
        members(array of team_member refs),
        showRole(boolean), showBio(boolean, short_bio only)

── RESERVATIONS ─────────────────────────────────────────────────────

Section: reservations-cta
Variants: banner | split | minimal
Fields: headline(LocalizedString), subline(LocalizedString, optional),
        ctaLabel(LocalizedString), urgencyNote(LocalizedString, optional)

Section: reservation-widget-resy
Fields: venue_id(string), api_key(string),
        colorPrimary(auto from CSS var), defaultPartySize(number)

Section: reservation-widget-opentable
Fields: rid(string), iframe(boolean),
        colorPrimary(auto from CSS var)

Section: reservation-widget-custom
Fields: timeSlotsConfig(from ReservationConfig),
        partySizeMin(number), partySizeMax(number),
        advanceDaysMin(number), advanceDaysMax(number),
        requirePhone(boolean), requireCC(boolean),
        cancellationHours(number)

── EVENTS ──────────────────────────────────────────────────────────

Section: events-preview
Variants: cards-2 | cards-3 | list
Fields: headline(LocalizedString), items(array of Event refs — upcoming only),
        cta(label+href), showDate(boolean), showPrice(boolean)

Section: events-grid
Variants: cards | calendar | list
Fields: filter(EventType[], optional), showPast(boolean),
        emptyMessage(LocalizedString)

── GALLERY ─────────────────────────────────────────────────────────

Section: gallery-preview
Variants: grid-4 | masonry-6 | strip
Fields: headline(LocalizedString, optional), category(GalleryCategory, optional),
        items(array of GalleryItem refs — featured only), cta(label+href)

Section: gallery-grid
Variants: masonry | uniform-grid | category-filter
Fields: categories(GalleryCategory[], optional — for filter),
        columns(2|3|4), showCaptions(boolean), enableLightbox(boolean)

── BLOG ────────────────────────────────────────────────────────────

Section: blog-preview
Variants: cards-3 | featured-plus-2 | list
Fields: headline(LocalizedString), items(array of BlogPost refs — recent featured),
        cta(label+href)

── CONTACT & INFO ───────────────────────────────────────────────────

Section: contact-info-block
Variants: horizontal | vertical | card
Fields: showPhone(boolean), showEmail(boolean), showAddress(boolean),
        showHours(boolean), showMap(boolean), showParking(boolean),
        parkingNote(LocalizedString, optional)

Section: private-dining-cta
Variants: banner | split-image
Fields: image(ImageURL, optional), headline(LocalizedString),
        body(LocalizedString), spaces(array of {name, capacity, description}),
        cta(label+href)

── UTILITY ─────────────────────────────────────────────────────────

Section: sticky-booking-bar (mobile only)
Fields: ctaLabel(LocalizedString), ctaHref(string),
        phoneLabel(LocalizedString, optional), phoneHref(string, optional)

Section: dietary-legend
Fields: flags(DietaryFlag[] — which flags to show),
        position('top'|'bottom')

Section: faq-accordion
Variants: grouped | ungrouped
Fields: groups(array of { heading(LocalizedString), items(array of { q, a in LocalizedString }) })

For EACH section above:
1. Write the complete JSON contract
2. List every admin form field with: name, UI type (text/textarea/image/toggle/select/array), required/optional
3. Note which fields are LocalizedString (must show EN/ZH/ES tabs in admin)

Output as RESTAURANT_CONTENT_CONTRACTS.md.

After generating the document:
1. Create admin form panel components for all 25 section types
2. Register all sections in the admin Variants panel with variant options
3. Confirm Content Editor shows correct form fields per section type

VERIFY:
- Open Content Editor → pages/home → form fields render for all sections
- Change section variant in dropdown → form fields update for that variant
- JSON mode shows full contract shape
- Form mode and JSON mode are in sync (edit one → save → other reflects change)
```

### Done-Gate 0D

- [ ] `RESTAURANT_CONTENT_CONTRACTS.md` generated and complete
- [ ] All 25 section types documented: variants + JSON contract + form fields
- [ ] Zero TBD fields in any section contract
- [ ] Admin Variants panel populated for all sections that have variants
- [ ] Content Editor form panels show correct fields per section type
- [ ] LocalizedString fields show EN/ZH/ES language tabs in admin
- [ ] JSON ↔ Form roundtrip works: edit JSON → save → Form shows change; edit Form → save → JSON reflects change
- [ ] `git commit: "feat: phase-0D — content contracts complete, 25 section types defined"`

---

## Prompt 0E — Seed Baseline Content + Layout.json Files

**Goal:** Create all JSON content files with realistic placeholder content and seed every page's layout.json. After this step, every page in The Meridian has content in Supabase and is renderable.

```
You are building BAAM System R — Restaurant Premium.
Reference: @RESTAURANT_COMPLETE_PLAN.md Section "A6: Content Contracts & SEO"
Reference: RESTAURANT_CONTENT_CONTRACTS.md (generated in 0D)
Reference: @a6_content_contracts.md seed targets

Seed all content for The Meridian master template.
site_id for all entries: 'the-meridian'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Seed page content files (content_entries, path = pages/*)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE and seed these pages with realistic content (not lorem ipsum):

pages/home — 9 sections:
  hero-fullscreen-dish (variant: dark-overlay, Cormorant Garamond headline)
  trust-bar (3 press logos: NYT, Eater NY, Bon Appétit)
  menu-preview (4 featured dinner items)
  about-preview (split-image variant, chef story intro)
  reservations-cta (banner variant, urgency: "Booking 2-3 weeks ahead")
  testimonials (carousel, 5 guest reviews)
  events-preview (cards-3, 3 upcoming events)
  gallery-preview (grid-4, 4 food photos)
  blog-preview (cards-3, 3 recent articles)

pages/menu — menu hub with links to all enabled menu types
pages/menu-dinner — dinner menu page (sections: hero, menu-category-nav, menu-sections, dietary-legend, reservations-cta)
pages/menu-tasting — tasting menu page
pages/menu-cocktails — cocktail menu page
pages/menu-wine — wine list page
pages/menu-seasonal — seasonal specials page

pages/about — about page (hero, practice-story, mission-values, team-preview, awards, cta)
pages/team — team page (hero, chef-hero-full, team-grid, cta)

pages/reservations — reservation page (hero, widget config, info, private-dining-cta, faq-mini)
pages/contact — contact page (hero, contact-info-block, map-embed, hours-display, contact-form)

pages/events — events listing (hero, events-grid)
pages/gallery — gallery (hero, gallery-grid with masonry)
pages/blog — blog hub (hero, featured-post, posts-grid)
pages/press — press (hero, press-items)

pages/private-dining — (hero, spaces, private-dining-cta, inquiry-form)
pages/faq — (hero, faq-accordion with 20+ questions)
pages/gift-cards — (hero, options, purchase CTA)
pages/careers — (hero, openings, apply-form)

pages/404 — (headline, search, back-links)

Seed EN, ZH, and ES versions for all pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Seed layout.json files (section order per page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each page, seed a layout.json that defines section order.
Example for home:
{
  "sections": [
    { "id": "hero",             "component": "HeroFullscreenDish",  "enabled": true },
    { "id": "trust-bar",        "component": "TrustBar",            "enabled": true },
    { "id": "menu-preview",     "component": "MenuPreview",         "enabled": true },
    { "id": "about-preview",    "component": "AboutPreview",        "enabled": true },
    { "id": "reservations-cta", "component": "ReservationsCTA",     "enabled": true },
    { "id": "testimonials",     "component": "TestimonialCarousel", "enabled": true },
    { "id": "events-preview",   "component": "EventsPreview",       "enabled": true },
    { "id": "gallery-preview",  "component": "GalleryPreview",      "enabled": true },
    { "id": "blog-preview",     "component": "BlogPreview",         "enabled": true }
  ]
}

Seed layout.json for every page (path: pages/{slug}.layout).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Seed menu_categories table (9 categories across 5 menu types)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dinner (menu_type: 'dinner'):
  - Appetizers (display_order: 1)
  - Pasta (display_order: 2)
  - Mains (display_order: 3)
  - Sides (display_order: 4)
  - Desserts (display_order: 5)

Cocktails (menu_type: 'cocktails'):
  - Signature Cocktails (display_order: 1)
  - Classics (display_order: 2)
  - Low-ABV & Non-Alcoholic (display_order: 3)

Wine (menu_type: 'wine'):
  - Sparkling (display_order: 1)
  - White (display_order: 2)
  - Red (display_order: 3)
  - Rosé (display_order: 4)
  - Dessert (display_order: 5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Seed menu_items table (121 items total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Seed realistic, restaurant-quality menu items.
Use the A6 seed targets from RESTAURANT_COMPLETE_PLAN.md:

Dinner (27 items):
  Appetizers (6): Oysters Rockefeller, Burrata, Tuna Crudo, Foie Gras Torchon, Mushroom Bisque, Roasted Beet Salad
  Pasta (5): Handmade Pappardelle, Black Truffle Tagliatelle, Squid Ink Linguine, Ricotta Gnudi, Lobster Risotto
  Mains (7): Dry-Aged Duck Breast, Wagyu Short Rib, Pan-Seared Halibut, Lamb Rack, Whole Roasted Chicken, Vegetable Wellington, Seared Scallops
  Sides (4): Roasted Root Vegetables, Truffle Pomme Purée, Charred Broccolini, Wild Mushroom Fricassee
  Desserts (5): Dark Chocolate Fondant, Crème Brûlée, Seasonal Tart, Cheese Selection, Petit Fours

Each item must have:
  - name, description in EN + ZH + ES (LocalizedString)
  - price in cents (e.g., 3800 = $38.00)
  - dietary_flags array (vegan/vegetarian/gf/dairy-free as applicable)
  - allergens array
  - featured: true for 4 signature dishes
  - display_order set correctly within category

Cocktails (20 items), Wine (30 items), Seasonal (6 items), Desserts standalone (6 items), Brunch (12 items) following A6 seed targets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Seed team_members (5 profiles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Chef Marcus Webb — Executive Chef & Founder
   credentials: ["Culinary Institute of America", "Former Per Se", "James Beard Semifinalist 2023"]
   philosophy: "Every dish begins with a question: what does this ingredient want to become?"
   department: culinary, featured: true, display_order: 1

2. Sophia Chen — Sous Chef
   credentials: ["Le Cordon Bleu Paris", "Former Le Bernardin"]
   department: culinary, featured: true, display_order: 2

3. Isabelle Moreau — Pastry Chef
   credentials: ["École Ferrandi Paris", "Former Dominique Ansel Bakery"]
   department: pastry, featured: false, display_order: 3

4. Kenji Nakamura — Bar Director
   credentials: ["10 years NYC bar scene", "Tales of the Cocktail presenter"]
   department: bar, featured: false, display_order: 4

5. Elena Vasquez — General Manager
   credentials: ["Cornell Hotel School", "Former Eleven Madison Park GM"]
   department: management, featured: false, display_order: 5

Seed all 5 in EN + ZH + ES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Seed blog posts (15 stubs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create 15 blog posts in the Blog Posts table with:
- Title, slug, excerpt (full body = placeholder for now — Phase 2 expands)
- published: false initially (unpublish stubs until content is real)
- Author: Chef Marcus Webb (team_id ref)
- featured_image: placeholder URL

Titles from A6 content plan:
1. "The Philosophy Behind Our Menu: Seasonal, Local, Honest" (chef-perspective)
2. "How We Source Our Ingredients" (sourcing-ingredients)
3. "Meet the Chef: The Story Behind the Kitchen" (chef-perspective)
4. "A Guide to Wine Pairing for Non-Wine People" (wine-spirits)
5. "The Art of the Cocktail: Our Bar Philosophy" (wine-spirits)
6. "Private Dining: How to Plan the Perfect Event" (events-announcements)
7. "Behind the Scenes: A Day in Our Kitchen" (behind-the-scenes)
8. "The Best Dishes for First-Time Visitors" (seasonal-guide)
9. "Our Commitment to Sustainable Sourcing" (sourcing-ingredients)
10. "Understanding Our Seasonal Menu Changes" (kitchen-stories)
11. "The Story of Our Signature Dish" (kitchen-stories)
12. "Hosting a Business Dinner: What to Know" (seasonal-guide)
13. "How We Train Our Front-of-House Team" (behind-the-scenes)
14. "A Guide to Our Vegetarian and Vegan Options" (seasonal-guide)
15. "New Year's Eve at The Meridian: What to Expect" (events-announcements)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — Seed events (9 total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6 upcoming events:
1. "Burgundy Wine Dinner" — wine-dinner, $195/person, reservation required
2. "Jazz & Oysters Evening" — live-music, $85/person
3. "Truffle Season Launch" — seasonal-launch, $225/person tasting menu
4. "New Year's Eve Gala" — holiday, $350/person
5. "Chef's Table: Farm Visit Series" — chef-collab, $165/person
6. "Cocktail Masterclass with Kenji" — class, $75/person

3 past events (published: false / date in past):
7. "Summer Rosé Garden Party" — tasting
8. "Valentine's Day Prix Fixe" — holiday
9. "Spring Foraging Walk & Dinner" — chef-collab

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8 — Seed gallery items (26 total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create 26 gallery items with metadata:
12 food (featured: true for 6)
6 interior/ambiance
4 team/chef
4 events/atmosphere

Each item: url (Unsplash placeholder), alt in EN+ZH+ES, category, caption, display_order.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9 — Seed press items (5 total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2 awards:
- "Best New Restaurant 2024" — New York Magazine
- "Rising Star Chef 2024" — Eater NY (Marcus Webb)

3 press mentions:
- New York Times, The New Yorker, Bon Appétit

VERIFY after seeding:
- Content Editor shows all page files with populated form fields
- Menu admin panel: 9 categories, 121 items visible
- Blog Posts Editor: 15 posts visible
- Events panel: 9 events visible (6 upcoming, 3 past)
- Gallery panel: 26 items visible
- Press panel: 5 items visible
- Team panel: 5 profiles visible
```

### Done-Gate 0E

- [ ] All 21 page content files seeded in `content_entries` (EN + ZH + ES)
- [ ] All 21 `layout.json` files seeded in `content_entries`
- [ ] Content Editor shows every page with populated form fields
- [ ] `menu_categories` table: 9 categories seeded
- [ ] `menu_items` table: 121 items seeded with full metadata
- [ ] `team_members` table: 5 profiles seeded in EN/ZH/ES
- [ ] Blog Posts Editor: 15 blog post stubs visible
- [ ] `events` table: 9 events seeded (6 upcoming, 3 past)
- [ ] `gallery_items` table: 26 items seeded with alt text in all locales
- [ ] `press_items` table: 5 items seeded
- [ ] Zero placeholder/lorem-ipsum text in any seeded content
- [ ] `git commit: "feat: phase-0E — full baseline content seeded (121 menu items, 5 profiles, 15 blog stubs, 9 events, 26 gallery items)"`

---

## Phase 0 Completion Gate

All items below must pass before starting Phase 1.

| Requirement | Pass? |
|---|---|
| App boots at `meridian.local:3060` without errors | |
| Admin login works, all panels accessible | |
| All 4 brand variants switchable via admin | |
| CSS variables change correctly when variant switches | |
| All 5 global files seeded and rendering (Header, Footer, Nav, Site, SEO) | |
| Language switcher works: EN → ZH → ES | |
| All content contracts defined — zero TBD fields | |
| Admin Variants panel populated for all section types | |
| JSON ↔ Form roundtrip working for all section types | |
| All 21 pages seeded with layout.json and content JSON | |
| 121 menu items visible in menu admin | |
| 5 team profiles visible in team admin | |
| 15 blog stubs visible in Blog Posts Editor | |
| 9 events visible in events admin | |
| Supabase Storage bucket `media` active | |
| All automated QA: zero console errors on `/admin` and `/en` | |
| **Git tagged:** `v0.0-phase0-complete` | |

**Phase 0 complete → Proceed to `RESTAURANT_PHASE_1.md`**

---

*BAAM System R — Restaurant Premium*
*Phase 0 of 5 — Infrastructure + Content Contracts*
*Next: RESTAURANT_PHASE_1.md — Core Pages*
