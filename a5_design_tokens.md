# A5 — Design Token System
**USF Restaurant System — Stage A**
**Agent:** A5-VISUAL
**Input:** a2_brand_system.md · a4_component_inventory.md
**Output:** Complete token specification for all 4 variants — colors, typography, spacing, shadows, animation, and copy-pasteable theme.json files

---

## Section 1: Token Architecture

### Two-Level Token System

The system uses two token levels that flow from database to rendered CSS:

```
Level 1: Primitive Tokens
  Raw values with no semantic meaning.
  "charcoal-900: #1A1A1A"
  Never used directly in components.

Level 2: Semantic Tokens
  Named by purpose, not value.
  "--color-primary: var(--charcoal-900)"
  Always used in component CSS.
```

### Data Flow: DB → CSS → Components

```
1. theme.json stored in DB per site (content_entries: path = "theme.json")
2. app/[locale]/layout.tsx reads theme.json on each request
3. Injects :root { --color-primary: #1A1A1A; ... } as inline style
4. globals.css defines utility classes consuming the variables
5. Components use var(--color-primary) — never hardcoded hex values
```

```typescript
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const theme = await getTheme(params.siteId)   // reads from DB / file fallback

  const cssVars = buildCssVars(theme)            // converts theme.json → CSS var string

  return (
    <html>
      <body style={{ [cssVars]: '' }}>           // injected as :root inline style
        {children}
      </body>
    </html>
  )
}
```

### Tailwind Integration

```javascript
// tailwind.config.js — consumes CSS variables
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        backdrop:  'var(--color-backdrop-primary)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        heading:  'var(--font-heading)',
        body:     'var(--font-body)',
      },
    }
  }
}
```

---

## Section 2: Color Tokens — All 4 Variants

---

### Variant: `noir-saison` (Fine Dining Dark)

**Primitive Palette**
```
charcoal-1000: #0D0D0D
charcoal-900:  #1A1A1A
charcoal-800:  #2E2E2E
charcoal-700:  #3D3D3D
charcoal-200:  #D4D4D4
charcoal-100:  #E8E8E8
charcoal-50:   #F5F5F5

gold-600:  #A8873B
gold-500:  #C9A84C
gold-400:  #D4B76A
gold-300:  #E0CB90

cream-50:  #F5F0E8
cream-100: #EDE5D8

smoke-700: #9CA3AF
smoke-500: #6B7280
smoke-300: #D1D5DB
```

**Semantic Token Map**
```css
:root {
  /* Brand */
  --color-primary:            #1A1A1A;
  --color-primary-dark:       #0D0D0D;
  --color-primary-light:      #2E2E2E;
  --color-primary-50:         #F5F5F5;
  --color-primary-100:        #E8E8E8;
  --color-secondary:          #C9A84C;
  --color-secondary-dark:     #A8873B;
  --color-secondary-light:    #D4B76A;

  /* Surfaces */
  --color-backdrop-primary:   #111111;
  --color-backdrop-secondary: #1A1A1A;
  --color-surface-raised:     #1F1F1F;
  --color-surface-overlay:    rgba(13,13,13,0.92);

  /* Text */
  --color-text-primary:       #F5F0E8;
  --color-text-secondary:     #D4D4D4;
  --color-text-muted:         #9CA3AF;
  --color-text-inverse:       #1A1A1A;
  --color-text-accent:        #C9A84C;

  /* Borders */
  --color-border:             #2D2D2D;
  --color-border-light:       #1F1F1F;
  --color-border-accent:      #C9A84C;

  /* Semantic */
  --color-success:            #22C55E;
  --color-error:              #EF4444;
  --color-warning:            #F59E0B;
  --color-info:               #3B82F6;

  /* Menu-specific */
  --color-menu-price:         #C9A84C;
  --color-menu-description:   #9CA3AF;
  --color-menu-divider:       #2D2D2D;
  --color-badge-seasonal:     #C9A84C;
  --color-badge-vegan:        #22C55E;
  --color-badge-gf:           #F59E0B;
  --color-badge-spicy:        #EF4444;
}
```

---

### Variant: `terre-vivante` (Warm Bistro)

**Primitive Palette**
```
terracotta-800: #5C2210
terracotta-700: #6B2D20
terracotta-600: #8B3A2A
terracotta-500: #B5513C
terracotta-400: #C8694F
terracotta-100: #F7E0DB
terracotta-50:  #FDF4F2

wheat-600:  #A88140
wheat-500:  #C8A45B
wheat-400:  #D9BA7E
wheat-100:  #F5E8CC

linen-100:  #FDF8F2
linen-200:  #F5EDE0
linen-300:  #EAD9C4

bark-800:   #2C1810
bark-600:   #5C3D2E
bark-400:   #7A6358
bark-200:   #B8A99E
```

**Semantic Token Map**
```css
:root {
  --color-primary:            #8B3A2A;
  --color-primary-dark:       #6B2D20;
  --color-primary-light:      #B5513C;
  --color-primary-50:         #FDF4F2;
  --color-primary-100:        #F7E0DB;
  --color-secondary:          #C8A45B;
  --color-secondary-dark:     #A88140;
  --color-secondary-light:    #D9BA7E;

  --color-backdrop-primary:   #FDFAF5;
  --color-backdrop-secondary: #F5EDE0;
  --color-surface-raised:     #FFFFFF;
  --color-surface-overlay:    rgba(253,250,245,0.95);

  --color-text-primary:       #2C1810;
  --color-text-secondary:     #5C3D2E;
  --color-text-muted:         #7A6358;
  --color-text-inverse:       #FDFAF5;
  --color-text-accent:        #8B3A2A;

  --color-border:             #E8D5C4;
  --color-border-light:       #F0E4D4;
  --color-border-accent:      #8B3A2A;

  --color-success:            #2D6A4F;
  --color-error:              #C0392B;
  --color-warning:            #D68910;
  --color-info:               #2471A3;

  --color-menu-price:         #2C1810;
  --color-menu-description:   #7A6358;
  --color-menu-divider:       #E8D5C4;
  --color-badge-seasonal:     #8B3A2A;
  --color-badge-vegan:        #2D6A4F;
  --color-badge-gf:           #D68910;
  --color-badge-spicy:        #C0392B;
}
```

---

### Variant: `velocite` (Urban Modern)

**Primitive Palette**
```
ink-1000:  #000000
ink-900:   #0F0F0F
ink-800:   #1F1F1F
ink-700:   #3A3A3A
ink-200:   #D4D4D4
ink-100:   #E5E7EB
ink-50:    #F8F8F8

crimson-700: #9B1221
crimson-600: #C1121F
crimson-500: #E63946
crimson-400: #EF6472
crimson-100: #FCE4E6

paper-50:  #FFFFFF
paper-100: #F8F8F8
paper-200: #F0F0F0

slate-500: #6B7280
slate-300: #D1D5DB
```

**Semantic Token Map**
```css
:root {
  --color-primary:            #0F0F0F;
  --color-primary-dark:       #000000;
  --color-primary-light:      #1F1F1F;
  --color-primary-50:         #F8F8F8;
  --color-primary-100:        #F0F0F0;
  --color-secondary:          #E63946;
  --color-secondary-dark:     #C1121F;
  --color-secondary-light:    #EF6472;

  --color-backdrop-primary:   #FFFFFF;
  --color-backdrop-secondary: #F8F8F8;
  --color-surface-raised:     #FFFFFF;
  --color-surface-overlay:    rgba(255,255,255,0.96);

  --color-text-primary:       #0F0F0F;
  --color-text-secondary:     #3A3A3A;
  --color-text-muted:         #6B7280;
  --color-text-inverse:       #FFFFFF;
  --color-text-accent:        #E63946;

  --color-border:             #E5E7EB;
  --color-border-dark:        #D1D5DB;
  --color-border-accent:      #0F0F0F;

  --color-success:            #16A34A;
  --color-error:              #DC2626;
  --color-warning:            #D97706;
  --color-info:               #2563EB;

  --color-menu-price:         #E63946;
  --color-menu-description:   #6B7280;
  --color-menu-divider:       #E5E7EB;
  --color-badge-seasonal:     #0F0F0F;
  --color-badge-vegan:        #16A34A;
  --color-badge-gf:           #D97706;
  --color-badge-spicy:        #DC2626;
}
```

---

### Variant: `matin-clair` (Casual Bright)

**Primitive Palette**
```
sage-900:  #1A2E25
sage-800:  #2C5C47
sage-700:  #2D6A4F
sage-600:  #3D7A5F
sage-500:  #52A67F
sage-300:  #95D5B2
sage-100:  #D9EEE6
sage-50:   #F0F7F4

tangerine-600: #E07B3A
tangerine-500: #F4A261
tangerine-400: #F7BA87
tangerine-100: #FDE8D5

white-base: #FFFFFF
off-white:  #F9FAF8
light-sage: #F0F7F4

forest-700: #1A2E25
forest-500: #3A5744
muted-600:  #6B7C74
muted-300:  #B8C9C0
```

**Semantic Token Map**
```css
:root {
  --color-primary:            #3D7A5F;
  --color-primary-dark:       #2C5C47;
  --color-primary-light:      #52A67F;
  --color-primary-50:         #F0F7F4;
  --color-primary-100:        #D9EEE6;
  --color-secondary:          #F4A261;
  --color-secondary-dark:     #E07B3A;
  --color-secondary-light:    #F7BA87;

  --color-backdrop-primary:   #FFFFFF;
  --color-backdrop-secondary: #F9FAF8;
  --color-surface-raised:     #FFFFFF;
  --color-surface-overlay:    rgba(255,255,255,0.96);

  --color-text-primary:       #1A2E25;
  --color-text-secondary:     #3A5744;
  --color-text-muted:         #6B7C74;
  --color-text-inverse:       #FFFFFF;
  --color-text-accent:        #3D7A5F;

  --color-border:             #E2EBE7;
  --color-border-light:       #EEF4F1;
  --color-border-accent:      #3D7A5F;

  --color-success:            #3D7A5F;
  --color-error:              #DC2626;
  --color-warning:            #D97706;
  --color-info:               #2563EB;

  --color-menu-price:         #3D7A5F;
  --color-menu-description:   #6B7C74;
  --color-menu-divider:       #E2EBE7;
  --color-badge-seasonal:     #F4A261;
  --color-badge-vegan:        #3D7A5F;
  --color-badge-gf:           #D97706;
  --color-badge-spicy:        #DC2626;
}
```

---

## Section 3: Typography Tokens — All 4 Variants

---

### `noir-saison` Typography

```css
:root {
  /* Font stacks */
  --font-display:    'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif;
  --font-heading:    'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif;
  --font-subheading: 'Lato', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-body:       'Lato', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-small:      'Lato', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-mono:       'JetBrains Mono', 'Courier New', monospace;

  /* Size scale (clamp: mobile → desktop) */
  --size-display:    clamp(2.75rem, 5.5vw, 5rem);       /* 44px → 80px */
  --size-h1:         clamp(2rem, 3.75vw, 3.5rem);       /* 32px → 56px */
  --size-h2:         clamp(1.5rem, 2.75vw, 2.5rem);     /* 24px → 40px */
  --size-h3:         clamp(1.25rem, 2vw, 1.75rem);      /* 20px → 28px */
  --size-h4:         1.25rem;                            /* 20px fixed */
  --size-body-lg:    1.125rem;                           /* 18px */
  --size-body:       1rem;                               /* 16px */
  --size-small:      0.8125rem;                          /* 13px */
  --size-xs:         0.6875rem;                          /* 11px */
  --size-menu-item:  1.0625rem;                          /* 17px — slightly larger for menu readability */
  --size-menu-price: 0.875rem;                           /* 14px */
  --size-nav:        0.8125rem;                          /* 13px — uppercase nav */

  /* Letter spacing — wide for fine dining ceremony */
  --tracking-display:  0.12em;
  --tracking-h1:       0.08em;
  --tracking-h2:       0.06em;
  --tracking-h3:       0.04em;
  --tracking-nav:      0.15em;
  --tracking-cta:      0.15em;
  --tracking-label:    0.20em;   /* section labels, small caps */
  --tracking-body:     0.02em;
  --tracking-menu:     0.03em;

  /* Line height */
  --leading-none:    1;
  --leading-tight:   1.1;
  --leading-snug:    1.35;
  --leading-normal:  1.65;
  --leading-relaxed: 1.8;
  --leading-loose:   2;

  /* Font weights */
  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* Cormorant Garamond display weight for hero */
  --weight-display:  300;   /* Light weight looks most elegant at large sizes */
}
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lato:wght@300;400;700&family=Noto+Serif+SC:wght@300;400&family=Noto+Sans+SC:wght@400;700&display=swap" rel="stylesheet">
```

---

### `terre-vivante` Typography

```css
:root {
  --font-display:    'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-heading:    'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-subheading: 'Source Sans 3', 'Noto Sans SC', system-ui, sans-serif;
  --font-body:       'Source Sans 3', 'Noto Sans SC', system-ui, sans-serif;
  --font-small:      'Source Sans 3', 'Noto Sans SC', system-ui, sans-serif;

  --size-display:    clamp(2.5rem, 5vw, 4.25rem);       /* 40px → 68px */
  --size-h1:         clamp(1.875rem, 3.5vw, 3rem);      /* 30px → 48px */
  --size-h2:         clamp(1.5rem, 2.5vw, 2rem);        /* 24px → 32px */
  --size-h3:         clamp(1.125rem, 1.75vw, 1.5rem);   /* 18px → 24px */
  --size-body-lg:    1.125rem;
  --size-body:       1rem;
  --size-small:      0.875rem;
  --size-menu-item:  1rem;
  --size-menu-price: 0.9375rem;
  --size-nav:        0.9375rem;

  --tracking-display: 0.02em;
  --tracking-h1:      0.01em;
  --tracking-nav:     0.06em;
  --tracking-cta:     0.08em;
  --tracking-label:   0.12em;
  --tracking-body:    0.01em;

  --leading-tight:   1.2;
  --leading-normal:  1.7;
  --leading-relaxed: 1.9;

  --weight-display:  700;   /* Playfair bold looks rich at display sizes */
}
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+3:wght@300;400;600;700&family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400&display=swap" rel="stylesheet">
```

---

### `velocite` Typography

```css
:root {
  --font-display:    'DM Serif Display', 'Noto Serif SC', Georgia, serif;
  --font-heading:    'DM Serif Display', 'Noto Serif SC', Georgia, serif;
  --font-subheading: 'DM Sans', 'Noto Sans SC', system-ui, sans-serif;
  --font-body:       'DM Sans', 'Noto Sans SC', system-ui, sans-serif;
  --font-small:      'DM Sans', 'Noto Sans SC', system-ui, sans-serif;

  --size-display:    clamp(3rem, 6.5vw, 5.5rem);        /* 48px → 88px */
  --size-h1:         clamp(2.25rem, 4.5vw, 4rem);       /* 36px → 64px */
  --size-h2:         clamp(1.625rem, 3vw, 2.625rem);    /* 26px → 42px */
  --size-h3:         clamp(1.25rem, 2vw, 1.875rem);     /* 20px → 30px */
  --size-body-lg:    1.125rem;
  --size-body:       1rem;
  --size-small:      0.875rem;
  --size-menu-item:  1.0625rem;
  --size-menu-price: 0.9375rem;
  --size-nav:        0.875rem;

  /* Negative tracking — editorial compression at large sizes */
  --tracking-display: -0.03em;
  --tracking-h1:      -0.02em;
  --tracking-h2:      -0.01em;
  --tracking-nav:      0.06em;
  --tracking-cta:      0.08em;
  --tracking-label:    0.10em;
  --tracking-body:     0em;

  --leading-tight:   1.0;
  --leading-snug:    1.2;
  --leading-normal:  1.55;
  --leading-relaxed: 1.75;

  --weight-display:  400;   /* DM Serif Display regular — the italic looks powerful */
}
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;700&family=Noto+Serif+SC:wght@400&family=Noto+Sans+SC:wght@400;500&display=swap" rel="stylesheet">
```

---

### `matin-clair` Typography

```css
:root {
  --font-display:    'Nunito', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-heading:    'Nunito', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-subheading: 'Nunito', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-body:       'Nunito', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;
  --font-small:      'Nunito', 'Noto Sans SC', 'Noto Sans KR', system-ui, sans-serif;

  --size-display:    clamp(2.25rem, 4.5vw, 3.75rem);    /* 36px → 60px */
  --size-h1:         clamp(1.75rem, 3vw, 2.75rem);      /* 28px → 44px */
  --size-h2:         clamp(1.375rem, 2.25vw, 2rem);     /* 22px → 32px */
  --size-h3:         clamp(1.125rem, 1.5vw, 1.5rem);    /* 18px → 24px */
  --size-body-lg:    1.125rem;
  --size-body:       1rem;
  --size-small:      0.875rem;
  --size-menu-item:  1rem;
  --size-menu-price: 0.9375rem;
  --size-nav:        0.9375rem;

  --tracking-display: -0.01em;
  --tracking-h1:       0em;
  --tracking-nav:      0.04em;
  --tracking-cta:      0.04em;
  --tracking-label:    0.08em;
  --tracking-body:     0em;

  --leading-tight:   1.25;
  --leading-normal:  1.65;
  --leading-relaxed: 1.85;

  --weight-display:  800;   /* Nunito ExtraBold — friendly strength */
}
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## Section 4: Spacing & Layout Tokens

One set of spacing primitives, with variant-level overrides on semantic tokens.

### Primitive Scale (shared across all variants)
```css
:root {
  --space-1:   0.25rem;   /*  4px */
  --space-2:   0.5rem;    /*  8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */
}
```

### Semantic Spacing (variant-specific overrides)

| Token | noir-saison | terre-vivante | velocite | matin-clair |
|---|---|---|---|---|
| `--section-py` | 6rem | 5rem | 5.5rem | 4rem |
| `--section-py-sm` | 4rem | 3.5rem | 4rem | 3rem |
| `--container-max` | 1200px | 1200px | 1280px | 1200px |
| `--container-px` | 2rem | 2rem | 2rem | 1.5rem |
| `--card-px` | 2rem | 1.5rem | 0 | 1.25rem |
| `--card-py` | 2rem | 1.5rem | 0 | 1.25rem |
| `--card-radius` | 0px | 8px | 0px | 16px |
| `--btn-radius` | 0px | 4px | 0px | 100px |
| `--input-radius` | 2px | 6px | 0px | 12px |
| `--nav-height` | 72px | 68px | 72px | 64px |
| `--hero-min-h` | 100svh | 80vh | 100svh | 75vh |
| `--grid-gap` | 1.5rem | 1.5rem | 2rem | 1.25rem |
| `--menu-item-py` | 1.25rem | 1rem | 1.25rem | 1rem |

---

## Section 5: Shadow & Elevation System

### `noir-saison` — Near-zero shadows (flat sophistication)
```css
:root {
  --shadow-none:   none;
  --shadow-card:   0 1px 3px rgba(0,0,0,0.5);
  --shadow-hover:  0 4px 16px rgba(0,0,0,0.7);
  --shadow-nav:    0 1px 0 rgba(255,255,255,0.06);
  --shadow-modal:  0 24px 80px rgba(0,0,0,0.9);
  --shadow-input:  inset 0 1px 2px rgba(0,0,0,0.4);
}
```

### `terre-vivante` — Warm, subtle depth
```css
:root {
  --shadow-card:   0 2px 8px rgba(139,58,42,0.08), 0 1px 3px rgba(0,0,0,0.06);
  --shadow-hover:  0 8px 24px rgba(139,58,42,0.14), 0 2px 8px rgba(0,0,0,0.08);
  --shadow-nav:    0 2px 12px rgba(0,0,0,0.07);
  --shadow-modal:  0 20px 60px rgba(0,0,0,0.18);
  --shadow-input:  inset 0 1px 2px rgba(139,58,42,0.08);
}
```

### `velocite` — Outline hover (editorial, no shadow)
```css
:root {
  --shadow-card:   none;
  --shadow-hover:  0 0 0 2px var(--color-primary);   /* outline on hover */
  --shadow-nav:    0 1px 0 var(--color-border);
  --shadow-modal:  0 24px 64px rgba(0,0,0,0.15);
  --shadow-input:  none;
  --shadow-input-focus: 0 0 0 2px var(--color-secondary);
}
```

### `matin-clair` — Friendly, visible depth
```css
:root {
  --shadow-card:   0 2px 12px rgba(61,122,95,0.08), 0 1px 4px rgba(0,0,0,0.06);
  --shadow-hover:  0 8px 28px rgba(61,122,95,0.16), 0 2px 8px rgba(0,0,0,0.08);
  --shadow-nav:    0 2px 16px rgba(61,122,95,0.10);
  --shadow-modal:  0 20px 60px rgba(0,0,0,0.14);
  --shadow-input:  0 0 0 2px rgba(61,122,95,0.15);
  --shadow-input-focus: 0 0 0 3px rgba(61,122,95,0.30);
}
```

---

## Section 6: Animation & Motion Tokens

### `noir-saison` — Slow, ceremonial
```css
:root {
  --duration-fast:   200ms;
  --duration-base:   400ms;
  --duration-slow:   700ms;
  --duration-hero:   1200ms;

  --ease-standard:   cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-elegant:    cubic-bezier(0.16, 1, 0.3, 1);   /* slow start, elegant finish */

  /* Hover interactions */
  --hover-transform: translateY(-2px);
  --hover-transition: transform var(--duration-slow) var(--ease-elegant),
                      box-shadow var(--duration-slow) var(--ease-elegant);

  /* Page entrance */
  --entrance-delay-stagger: 120ms;   /* stagger between elements on load */
  --entrance-distance: 20px;          /* elements rise this much on entrance */
}
```

### `terre-vivante` — Warm, gentle
```css
:root {
  --duration-fast:   150ms;
  --duration-base:   300ms;
  --duration-slow:   500ms;

  --ease-warm:       cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight bounce */

  --hover-transform: translateY(-3px);
  --hover-transition: transform var(--duration-base) var(--ease-warm),
                      box-shadow var(--duration-base) var(--ease-warm);

  --entrance-delay-stagger: 80ms;
  --entrance-distance: 16px;
}
```

### `velocite` — Snappy, kinetic
```css
:root {
  --duration-fast:   100ms;
  --duration-base:   200ms;
  --duration-slow:   350ms;

  --ease-sharp:      cubic-bezier(0.4, 0, 1, 1);

  /* Velocite uses outline reveal, not lift */
  --hover-transform: none;
  --hover-transition: outline var(--duration-fast) var(--ease-sharp),
                      color var(--duration-fast) var(--ease-sharp);

  --entrance-delay-stagger: 50ms;
  --entrance-distance: 12px;
}
```

### `matin-clair` — Quick, friendly
```css
:root {
  --duration-fast:   120ms;
  --duration-base:   240ms;
  --duration-slow:   400ms;

  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);

  --hover-transform: translateY(-4px);
  --hover-transition: transform var(--duration-base) var(--ease-bounce),
                      box-shadow var(--duration-base) var(--ease-bounce);

  --entrance-delay-stagger: 60ms;
  --entrance-distance: 12px;
}
```

---

## Section 7: Component-Level Tokens

These tokens are consumed directly by specific components (see A4).

```css
:root {
  /* ── Button ──────────────────────────────── */
  --btn-px:              1.5rem;
  --btn-py:              0.75rem;
  --btn-px-lg:           2rem;
  --btn-py-lg:           1rem;
  --btn-font-size:       var(--size-small);
  --btn-font-weight:     var(--weight-semibold);
  --btn-letter-spacing:  var(--tracking-cta);
  --btn-text-transform:  uppercase;         /* override to 'none' for matin-clair */

  /* ── Menu Item ───────────────────────────── */
  --menu-item-py:            var(--menu-item-py);   /* from spacing section above */
  --menu-item-name-size:     var(--size-menu-item);
  --menu-item-name-weight:   var(--weight-regular);
  --menu-item-desc-size:     var(--size-small);
  --menu-item-desc-color:    var(--color-menu-description);
  --menu-item-price-size:    var(--size-menu-price);
  --menu-item-price-color:   var(--color-menu-price);
  --menu-item-divider:       1px solid var(--color-menu-divider);
  --menu-photo-ratio:        4 / 3;

  /* ── Hero ────────────────────────────────── */
  --hero-min-height:         var(--hero-min-h);
  --hero-overlay-opacity:    0.45;          /* override per hero variant */
  --hero-text-max-width:     600px;
  --hero-cta-gap:            1rem;

  /* ── Navigation ──────────────────────────── */
  --nav-height:              var(--nav-height);
  --nav-bg-scrolled:         var(--color-backdrop-primary);
  --nav-bg-transparent:      transparent;
  --nav-item-px:             1rem;
  --nav-font-size:           var(--size-nav);
  --nav-font-weight:         var(--weight-medium);
  --nav-letter-spacing:      var(--tracking-nav);

  /* ── Card ────────────────────────────────── */
  --card-radius:             var(--card-radius);
  --card-px:                 var(--card-px);
  --card-py:                 var(--card-py);
  --card-bg:                 var(--color-surface-raised);
  --card-border:             1px solid var(--color-border);
  --card-shadow:             var(--shadow-card);
  --card-shadow-hover:       var(--shadow-hover);

  /* ── Form Inputs ─────────────────────────── */
  --input-height:            2.75rem;
  --input-px:                1rem;
  --input-radius:            var(--input-radius);
  --input-border:            1px solid var(--color-border);
  --input-border-focus:      1px solid var(--color-secondary);
  --input-bg:                var(--color-backdrop-primary);
  --input-font-size:         var(--size-body);
  --input-shadow-focus:      var(--shadow-input-focus);
}
```

---

## Section 8: Complete theme.json Files

Production-ready theme.json for each variant. Store directly in `content_entries` with `path = "theme.json"`.

---

### `noir-saison` — theme.json

```json
{
  "variant_id": "noir-saison",
  "colors": {
    "primary": {
      "DEFAULT": "#1A1A1A",
      "dark": "#0D0D0D",
      "light": "#2E2E2E",
      "50": "#F5F5F5",
      "100": "#E8E8E8"
    },
    "secondary": {
      "DEFAULT": "#C9A84C",
      "dark": "#A8873B",
      "light": "#D4B76A"
    },
    "backdrop": {
      "primary": "#111111",
      "secondary": "#1A1A1A"
    }
  },
  "typography": {
    "fonts": {
      "display":    "Cormorant Garamond",
      "heading":    "Cormorant Garamond",
      "subheading": "Lato",
      "body":       "Lato",
      "small":      "Lato"
    },
    "sizes": {
      "display":    "clamp(2.75rem, 5.5vw, 5rem)",
      "heading":    "clamp(2rem, 3.75vw, 3.5rem)",
      "subheading": "1.25rem",
      "body":       "1rem",
      "small":      "0.8125rem"
    }
  },
  "spacing": {
    "section_py":   "6rem",
    "card_radius":  "0px",
    "btn_radius":   "0px"
  },
  "motion": {
    "duration_base": "400ms",
    "hover_lift":    "-2px"
  }
}
```

---

### `terre-vivante` — theme.json

```json
{
  "variant_id": "terre-vivante",
  "colors": {
    "primary": {
      "DEFAULT": "#8B3A2A",
      "dark": "#6B2D20",
      "light": "#B5513C",
      "50": "#FDF4F2",
      "100": "#F7E0DB"
    },
    "secondary": {
      "DEFAULT": "#C8A45B",
      "dark": "#A88140",
      "light": "#D9BA7E"
    },
    "backdrop": {
      "primary": "#FDFAF5",
      "secondary": "#F5EDE0"
    }
  },
  "typography": {
    "fonts": {
      "display":    "Playfair Display",
      "heading":    "Playfair Display",
      "subheading": "Source Sans 3",
      "body":       "Source Sans 3",
      "small":      "Source Sans 3"
    },
    "sizes": {
      "display":    "clamp(2.5rem, 5vw, 4.25rem)",
      "heading":    "clamp(1.875rem, 3.5vw, 3rem)",
      "subheading": "1.1875rem",
      "body":       "1rem",
      "small":      "0.875rem"
    }
  },
  "spacing": {
    "section_py":   "5rem",
    "card_radius":  "8px",
    "btn_radius":   "4px"
  },
  "motion": {
    "duration_base": "300ms",
    "hover_lift":    "-3px"
  }
}
```

---

### `velocite` — theme.json

```json
{
  "variant_id": "velocite",
  "colors": {
    "primary": {
      "DEFAULT": "#0F0F0F",
      "dark": "#000000",
      "light": "#1F1F1F",
      "50": "#F8F8F8",
      "100": "#F0F0F0"
    },
    "secondary": {
      "DEFAULT": "#E63946",
      "dark": "#C1121F",
      "light": "#EF6472"
    },
    "backdrop": {
      "primary": "#FFFFFF",
      "secondary": "#F8F8F8"
    }
  },
  "typography": {
    "fonts": {
      "display":    "DM Serif Display",
      "heading":    "DM Serif Display",
      "subheading": "DM Sans",
      "body":       "DM Sans",
      "small":      "DM Sans"
    },
    "sizes": {
      "display":    "clamp(3rem, 6.5vw, 5.5rem)",
      "heading":    "clamp(2.25rem, 4.5vw, 4rem)",
      "subheading": "1.25rem",
      "body":       "1rem",
      "small":      "0.875rem"
    }
  },
  "spacing": {
    "section_py":   "5.5rem",
    "card_radius":  "0px",
    "btn_radius":   "0px"
  },
  "motion": {
    "duration_base": "200ms",
    "hover_lift":    "0px"
  }
}
```

---

### `matin-clair` — theme.json

```json
{
  "variant_id": "matin-clair",
  "colors": {
    "primary": {
      "DEFAULT": "#3D7A5F",
      "dark": "#2C5C47",
      "light": "#52A67F",
      "50": "#F0F7F4",
      "100": "#D9EEE6"
    },
    "secondary": {
      "DEFAULT": "#F4A261",
      "dark": "#E07B3A",
      "light": "#F7BA87"
    },
    "backdrop": {
      "primary": "#FFFFFF",
      "secondary": "#F9FAF8"
    }
  },
  "typography": {
    "fonts": {
      "display":    "Nunito",
      "heading":    "Nunito",
      "subheading": "Nunito",
      "body":       "Nunito",
      "small":      "Nunito"
    },
    "sizes": {
      "display":    "clamp(2.25rem, 4.5vw, 3.75rem)",
      "heading":    "clamp(1.75rem, 3vw, 2.75rem)",
      "subheading": "1.125rem",
      "body":       "1rem",
      "small":      "0.875rem"
    }
  },
  "spacing": {
    "section_py":   "4rem",
    "card_radius":  "16px",
    "btn_radius":   "100px"
  },
  "motion": {
    "duration_base": "240ms",
    "hover_lift":    "-4px"
  }
}
```

---

*End of A5 — Design Token System*
*Next agent: A6-CONTENT will define TypeScript interfaces for every content type, the SEO strategy, and the conversion funnel.*
