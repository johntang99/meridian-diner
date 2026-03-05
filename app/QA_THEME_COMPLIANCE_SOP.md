# Theme Compliance SOP

Use this SOP to verify every page follows theme requirements for typography, colors, spacing, surfaces, and interaction states.

## 1) Contract Gate (Theme JSON + runtime vars)

- Ensure `theme.json` includes:
  - `colors.text.primary/secondary/muted/inverse/accent`
  - `colors.text.onDarkPrimary/onDarkSecondary`
  - `shape.radius`, `shape.shadow`
  - `layout.spacingDensity`
- Ensure runtime variables are injected in `app/[locale]/layout.tsx`:
  - text: `--text-color-*`, `--text-on-dark-*`
  - shape/layout: `--radius-base`, `--shadow-base`, `--section-padding-y`

Pass criteria:
- No missing token families.
- No route depends on undeclared CSS variables.

## 2) Static Code Gate (automated)

Canonical BAAM utility location:

- `/Users/johntang/Desktop/clients/baam/utilities/theme-qa/theme-compliance-check.mjs`
- `/Users/johntang/Desktop/clients/baam/utilities/theme-qa/contrast-audit.mjs`

Meridian local copy location (site-owned runnable script):

- `/Users/johntang/Desktop/clients/restaurant/meridian/app/scripts/qa/theme-compliance-check.mjs`
- `/Users/johntang/Desktop/clients/restaurant/meridian/app/scripts/qa/contrast-audit.mjs`

Recommended sync workflow:

```bash
cp /Users/johntang/Desktop/clients/baam/utilities/theme-qa/theme-compliance-check.mjs /Users/johntang/Desktop/clients/restaurant/meridian/app/scripts/qa/theme-compliance-check.mjs
cp /Users/johntang/Desktop/clients/baam/utilities/theme-qa/contrast-audit.mjs /Users/johntang/Desktop/clients/restaurant/meridian/app/scripts/qa/contrast-audit.mjs
```

Run:

```bash
npm run qa:theme
```

Deep scan (includes shared components):

```bash
npm run qa:theme:deep
```

This scanner checks route/component files for:
- legacy tokens (`--btn-radius`, `--card-radius`)
- hardcoded text color classes (`text-gray-*`, `text-white`, `text-black`)
- hardcoded text size classes (`text-sm`, `text-xl`, etc.)
- hardcoded radius/shadow utility classes (`rounded-*`, `shadow-*`)
- literal color values in inline styles (`#hex`, `rgb(...)`, `white`, `black`)

Important limitations of the static scanner:
- It does not evaluate computed color contrast after CSS vars resolve at runtime.
- It does not know if content is rendered on dark image/video overlays versus light cards.
- It does not validate hover/focus/active/disabled states visually.
- It does not detect token-value collisions (for example, token text color too close to token background).

Pass criteria:
- `fail` count = 0
- warnings triaged and either fixed or explicitly accepted

## 3) Runtime Contrast Gate (required)

Run this after `qa:theme`/`qa:theme:deep`. This is mandatory for launch candidates.

Setup once per machine:

```bash
npx playwright install chromium
```

Automated audit commands:

```bash
npm run qa:contrast
npm run qa:contrast:routes
npm run qa:contrast:critical
```

Inventory behavior:
- `npm run qa:contrast` uses **extended inventory** (auto-discovers static locale routes from `app/[locale]` route tree, dynamic detail routes from content including `blog/[slug]`, `events/[slug]`, `menu/[type]`, and service slugs when available, plus sitemap-discovered locale routes).
- `npm run qa:contrast:exhaustive` uses **exhaustive inventory** (extended + full sitemap route merge, useful for programmatic routes like `/:cuisine/:city`).
- `npm run qa:contrast:critical` keeps a fixed fast route list for quick smoke checks.

Custom route set / environment:

```bash
node scripts/qa/contrast-audit.mjs --base-url=http://localhost:3021 --routes=/,/en,/en/menu,/en/contact
node scripts/qa/contrast-audit.mjs --inventory=extended --site-id=meridian-diner --locale=en
node scripts/qa/contrast-audit.mjs --inventory=exhaustive --site-id=meridian-diner --locale=en
node scripts/qa/contrast-audit.mjs --inventory=exhaustive --site-id=meridian-diner --locale=en --list-routes-only=true
```

Inventory output:
- `reports/qa-contrast-routes.json` is always written before the browser audit.
- Use `--list-routes-only=true` to generate/inspect route inventory coverage without launching Playwright.

This runtime gate uses axe-core (`color-contrast`) in a real browser, which catches many contrast failures that static regex checks cannot detect.

### 3.1 Routes to check

Check all routes linked from header/footer plus key content routes:
- `/`
- `/menu`, `/menu/*`
- `/about`
- `/events`, `/events/*`
- `/gallery`
- `/reservations`, `/reservations/private-dining`
- `/contact`
- `/blog`, `/blog/*`
- `/careers`
- `/gift-cards`
- `/faq`
- `/privacy`, `/terms`

### 3.2 States to check on every route

- default state (first paint)
- hover state (buttons, links, cards)
- focus-visible state (Tab keyboard navigation)
- disabled state (forms/widgets where applicable)
- active/current nav state
- modal overlays/lightboxes
- image/video hero overlays and dark sections

Note:
- The automated script reliably checks rendered default state contrast.
- Hover/focus/disabled states still require manual spot checks (or dedicated interaction tests) because they are stateful.

### 3.3 Contrast checks

- Body text and labels should target WCAG AA (4.5:1).
- Large headings can use 3:1, but avoid "nearly invisible" text.
- Button label contrast must pass in all states (default/hover/focus/disabled).
- On dark surfaces, text must use `--text-on-dark-primary` / `--text-on-dark-secondary`.
- On light surfaces, text must use `--text-color-primary` / `--text-color-secondary`.

### 3.4 Fast failure patterns

- White text on light cards/sections.
- Dark text on dark hero overlay.
- Accent-only text used as body copy on dark backgrounds.
- CTA buttons where bg and label both use near-dark colors.

## 4) Visual Route Gate (manual UI review)

Test all routes from header + footer links for each locale in use.

Required checks per route:
- **Text Contrast**
  - Light background: heading/body use readable light-surface text tokens.
  - Dark background: heading/body use `onDark` tokens.
- **Typography**
  - Uses tokenized sizes (`text-display/heading/subheading/body/small`) and tokenized font families.
- **Buttons**
  - Radius from `--radius-base`
  - Text and background use token colors with readable contrast in all states.
- **Cards / Media**
  - Radius from `--radius-base`
  - Shadow from `--shadow-base`
  - Photo containers do not mix random `rounded-*` + `shadow-*`.
- **Section Rhythm**
  - Section vertical spacing follows `--section-padding-y` / `--section-py`.

Pass criteria:
- No invisible text.
- No black-on-black or light-on-light button text.
- No obvious per-page visual drift from theme tokens.

## 5) Release Gate

Run:

```bash
npm run qa:all
```

Then do a quick browser sanity pass on:
- `/`
- `/menu`
- `/about`
- `/events`
- `/gallery`
- `/reservations`
- `/reservations/private-dining`
- `/contact`
- `/faq`
- `/careers`
- `/gift-cards`
- `/privacy`
- `/terms`

If any fail:
- fix in code
- re-run `qa:theme`
- re-run runtime contrast gate
- re-run visual route gate
