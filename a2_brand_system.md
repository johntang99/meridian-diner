# A2 — Restaurant Brand System
**USF Restaurant System — Stage A**
**Agent:** A2-BRAND
**Input:** a1_industry_brief.md
**Output:** Complete brand variant library — 4 variants, full theme.json specs

---

## Variant 1: "Noir Saison"
*For Fine Dining — Tasting Menus — Intimate Upscale*

### Identity Card
- **variant_id:** `noir-saison`
- **name:** Noir Saison
- **best_for:** Fine dining, tasting menu concepts, chef's table, Michelin-aspirant, intimate upscale, omakase
- **mood_statement:** "Where every detail is intentional and the evening is the experience."
- **design_personality:** Restrained · Ceremonial · Luminous

### Rationale from A1
The fine dining customer validates first through photography, then press, then menu. This variant prioritizes art-directed imagery on near-black backgrounds — the same visual language as Eleven Madison Park and Le Bernardin. The gold accent references candlelight, silverware, and ceremony without being literal. Typography uses extreme letter-spacing to communicate unhurried confidence — the typographic equivalent of white space on a tasting menu.

### Complete theme.json

```json
{
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
      "display": "'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "heading": "'Cormorant Garamond', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "subheading": "'Lato', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "body": "'Lato', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "small": "'Lato', 'Noto Sans SC', 'Noto Sans KR', sans-serif"
    },
    "sizes": {
      "display": "clamp(2.75rem, 5.5vw, 5rem)",
      "heading": "clamp(1.875rem, 3.5vw, 3rem)",
      "subheading": "1.25rem",
      "body": "1rem",
      "small": "0.8125rem"
    }
  }
}
```

### CSS Variable Map
```css
:root {
  /* Colors */
  --color-primary:           #1A1A1A;
  --color-primary-dark:      #0D0D0D;
  --color-primary-light:     #2E2E2E;
  --color-secondary:         #C9A84C;
  --color-secondary-dark:    #A8873B;
  --color-secondary-light:   #D4B76A;
  --color-backdrop-primary:  #111111;
  --color-backdrop-secondary:#1A1A1A;
  --color-text-primary:      #F5F0E8;
  --color-text-muted:        #9CA3AF;
  --color-text-inverse:      #111111;
  --color-border:            #2D2D2D;
  --color-border-light:      #1F1F1F;

  /* Typography */
  --font-display:    'Cormorant Garamond', 'Noto Serif SC', Georgia, serif;
  --font-heading:    'Cormorant Garamond', 'Noto Serif SC', Georgia, serif;
  --font-subheading: 'Lato', 'Noto Sans SC', sans-serif;
  --font-body:       'Lato', 'Noto Sans SC', sans-serif;
  --font-small:      'Lato', 'Noto Sans SC', sans-serif;

  /* Sizes */
  --size-display:    clamp(2.75rem, 5.5vw, 5rem);
  --size-h1:         clamp(1.875rem, 3.5vw, 3rem);
  --size-h2:         clamp(1.375rem, 2.5vw, 2rem);
  --size-h3:         1.25rem;
  --size-body:       1rem;
  --size-small:      0.8125rem;
  --size-menu-item:  1.0625rem;

  /* Tracking (letter-spacing — fine dining uses wide) */
  --tracking-display: 0.12em;
  --tracking-heading: 0.08em;
  --tracking-subhead: 0.15em;
  --tracking-body:    0.02em;
  --tracking-cta:     0.15em;

  /* Leading (line-height) */
  --leading-tight:  1.1;
  --leading-normal: 1.65;
  --leading-loose:  1.85;

  /* Spacing */
  --section-py:    6rem;
  --card-radius:   2px;
  --btn-radius:    0px;

  /* Shadows — near-zero for fine dining */
  --shadow-card:   0 1px 3px rgba(0,0,0,0.4);
  --shadow-hover:  0 4px 16px rgba(0,0,0,0.6);
  --shadow-modal:  0 24px 64px rgba(0,0,0,0.8);
}
```

### Visual Signature

**Hero (unmistakably Noir Saison):**
Full-viewport near-black background. Single hero dish photograph positioned right, 50% of frame. Restaurant name in Cormorant Garamond at 5rem with 0.12em letter-spacing. Gold divider line (1px, 80px wide) beneath the name. Reservation CTA in ghost button style — white border, white text, no fill, uppercase Lato at 0.15em tracking. No gradients. No overlays. The photograph speaks.

**Menu Card (unmistakably Noir Saison):**
No card background — items float on the dark backdrop. Dish name in Cormorant Garamond italic at 1.0625rem. Price in Lato at 0.875rem, gold (#C9A84C), right-aligned. Description in Lato at 0.875rem, muted gray (#9CA3AF). A 1px gold horizontal rule separates categories. Zero border-radius on any container.

**Footer (unmistakably Noir Saison):**
Near-black (#0D0D0D) background. Restaurant name in Cormorant Garamond, centered, large. Single gold horizontal rule above and below the name. Hours, address, phone in Lato small caps, centered, extreme letter-spacing (0.2em). Social icons as simple line SVGs in gold. No color fill anywhere in the footer.

### Photography Style Guide
- **Lighting:** Moody, directional. Single light source. Deep shadows are intentional, not corrected.
- **Subject:** Hero dishes isolated against dark surfaces. Occasional wide shot of the dining room showing table settings, candles, empty chairs (pre-service calm).
- **Color treatment:** Cool-to-neutral color grading. Blacks are true black. Gold tones in food preserved. Avoid warm/orange Instagram filters.
- **Aspect ratios:** 16:9 for hero, 4:5 for dish portraits, 1:1 for social cuts.
- **What to avoid:** Busy backgrounds, overhead shots of full tables, anything that looks Instagram-casual.

### Sub-type Compatibility
- ✅ Ideal: Fine dining, tasting menu, omakase, chef's table, wine bar
- ✅ Works: Upscale cocktail lounge, hotel restaurant
- ⚠️ Use with care: Casual upscale (may feel too formal)
- ❌ Avoid: Cafes, brunch spots, family restaurants, fast-casual

---

## Variant 2: "Terre Vivante"
*For Neighborhood Restaurants — Farm-to-Table — French/Italian Bistros*

### Identity Card
- **variant_id:** `terre-vivante`
- **name:** Terre Vivante
- **best_for:** Farm-to-table, French bistro, Italian trattoria, neighborhood favorites, wine-focused, seasonal cuisine
- **mood_statement:** "The pleasure of a meal made by someone who cares."
- **design_personality:** Warm · Handcrafted · Unpretentious

### Rationale from A1
The neighborhood restaurant customer relies on community word-of-mouth (A1 Section 1) and trusts warmth over prestige. This variant uses earthy terracotta and warm cream — colors that evoke clay pottery, linen napkins, and the Mediterranean light that inspires farm-to-table cuisine. Playfair Display adds refinement without stiffness. The overall effect is "this place has been here for years and deserves to be."

### Complete theme.json

```json
{
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
      "display": "'Playfair Display', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "heading": "'Playfair Display', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "subheading": "'Source Sans 3', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "body": "'Source Sans 3', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "small": "'Source Sans 3', 'Noto Sans SC', 'Noto Sans KR', sans-serif"
    },
    "sizes": {
      "display": "clamp(2.5rem, 5vw, 4.25rem)",
      "heading": "clamp(1.75rem, 3vw, 2.75rem)",
      "subheading": "1.1875rem",
      "body": "1rem",
      "small": "0.875rem"
    }
  }
}
```

### CSS Variable Map
```css
:root {
  --color-primary:           #8B3A2A;
  --color-primary-dark:      #6B2D20;
  --color-primary-light:     #B5513C;
  --color-secondary:         #C8A45B;
  --color-secondary-dark:    #A88140;
  --color-backdrop-primary:  #FDFAF5;
  --color-backdrop-secondary:#F5EDE0;
  --color-text-primary:      #2C1810;
  --color-text-muted:        #7A6358;
  --color-border:            #E8D5C4;
  --color-border-light:      #F0E4D4;

  --font-display:    'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-heading:    'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-body:       'Source Sans 3', 'Noto Sans SC', sans-serif;

  --size-display:    clamp(2.5rem, 5vw, 4.25rem);
  --size-h1:         clamp(1.75rem, 3vw, 2.75rem);
  --size-h2:         clamp(1.375rem, 2.25vw, 1.875rem);
  --size-body:       1rem;
  --size-small:      0.875rem;

  --tracking-display: 0.02em;
  --tracking-heading: 0.01em;
  --tracking-body:    0.01em;
  --tracking-cta:     0.08em;

  --leading-tight:  1.2;
  --leading-normal: 1.7;
  --leading-loose:  1.9;

  --section-py:    5rem;
  --card-radius:   8px;
  --btn-radius:    4px;

  --shadow-card:   0 2px 8px rgba(139,58,42,0.08);
  --shadow-hover:  0 6px 20px rgba(139,58,42,0.15);
  --shadow-modal:  0 20px 60px rgba(0,0,0,0.2);
}
```

### Visual Signature

**Hero (unmistakably Terre Vivante):**
Warm cream (#FDFAF5) background. Split layout: left side has Playfair Display headline in deep terracotta, description in Source Sans. Right side: full-bleed photo of a dish or the dining room at golden hour, gently rounded corner on the inside edge (8px). A hand-drawn style divider or leaf motif in terracotta. CTA button is filled terracotta, white text, slight radius.

**Menu Card (unmistakably Terre Vivante):**
Cream card with 1px warm border (#E8D5C4), 8px radius, subtle shadow. Dish name in Playfair Display at 1.0625rem, terracotta. Description in Source Sans, warm gray (#7A6358). Price in Source Sans medium, dark. Category header uses Playfair Display italic, large, with a thin horizontal rule in wheat color.

**Footer (unmistakably Terre Vivante):**
Warm off-white (#F5EDE0) background. Three-column layout: left — restaurant story (2 sentences, italic Playfair). Center — hours and address in clean Source Sans. Right — social links. Top border: 3px solid terracotta. Restaurant name in large Playfair Display at top, centered.

### Photography Style Guide
- **Lighting:** Natural, warm. Golden hour preferred. Soft fill, no harsh shadows.
- **Subject:** Overhead flat-lay for signature dishes; 45° angle for pasta/risotto; candid shots of chef at stove; farmers market ingredients on rough linen.
- **Color treatment:** Warm, slightly lifted shadows. Earthy tones preserved. No cool grading.
- **Aspect ratios:** 4:3 for hero, 1:1 for dish detail, 3:2 for atmosphere.

### Sub-type Compatibility
- ✅ Ideal: Farm-to-table, French/Italian bistro, neighborhood Mediterranean, wine bar
- ✅ Works: Upscale brunch, seasonal tasting menu (lighter)
- ⚠️ Use with care: Very upscale fine dining (may feel too casual)
- ❌ Avoid: Cocktail bars, Japanese/Asian concepts, fast-casual

---

## Variant 3: "Vélocité"
*For Chef-Driven Contemporary — New American — Urban Concepts*

### Identity Card
- **variant_id:** `velocite`
- **name:** Vélocité
- **best_for:** Contemporary American, new American, chef-driven independent, modern bistro, creative tasting, urban destination dining
- **mood_statement:** "Bold food. No apologies."
- **design_personality:** Confident · Editorial · Kinetic

### Rationale from A1
The Employees Only lesson from A1: lead with your most unexpected differentiator. This variant uses stark white + near-black + a single electric accent — the visual language of forward-thinking editorial design. DM Serif Display is distinctive without being precious. The layouts break the grid intentionally. A visitor should feel energy the moment the page loads, matching the creative confidence of a chef-driven concept.

### Complete theme.json

```json
{
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
      "light": "#FF6B6B"
    },
    "backdrop": {
      "primary": "#FFFFFF",
      "secondary": "#F8F8F8"
    }
  },
  "typography": {
    "fonts": {
      "display": "'DM Serif Display', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "heading": "'DM Serif Display', 'Noto Serif SC', 'Noto Serif KR', Georgia, serif",
      "subheading": "'DM Sans', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "body": "'DM Sans', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "small": "'DM Sans', 'Noto Sans SC', 'Noto Sans KR', sans-serif"
    },
    "sizes": {
      "display": "clamp(3rem, 6vw, 5.5rem)",
      "heading": "clamp(2rem, 4vw, 3.5rem)",
      "subheading": "1.25rem",
      "body": "1rem",
      "small": "0.875rem"
    }
  }
}
```

### CSS Variable Map
```css
:root {
  --color-primary:           #0F0F0F;
  --color-primary-dark:      #000000;
  --color-primary-light:     #1F1F1F;
  --color-secondary:         #E63946;
  --color-secondary-dark:    #C1121F;
  --color-backdrop-primary:  #FFFFFF;
  --color-backdrop-secondary:#F8F8F8;
  --color-text-primary:      #0F0F0F;
  --color-text-muted:        #6B7280;
  --color-border:            #E5E7EB;
  --color-border-dark:       #D1D5DB;

  --font-display: 'DM Serif Display', 'Noto Serif SC', Georgia, serif;
  --font-heading: 'DM Serif Display', 'Noto Serif SC', Georgia, serif;
  --font-body:    'DM Sans', 'Noto Sans SC', sans-serif;

  --size-display:  clamp(3rem, 6vw, 5.5rem);
  --size-h1:       clamp(2rem, 4vw, 3.5rem);
  --size-h2:       clamp(1.5rem, 3vw, 2.25rem);
  --size-body:     1rem;
  --size-small:    0.875rem;

  --tracking-display: -0.02em;
  --tracking-heading: -0.01em;
  --tracking-body:    0em;
  --tracking-cta:     0.06em;

  --leading-tight:  1.05;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  --section-py:    5.5rem;
  --card-radius:   0px;
  --btn-radius:    0px;

  --shadow-card:   none;
  --shadow-hover:  0 0 0 2px #0F0F0F;
  --shadow-modal:  0 24px 64px rgba(0,0,0,0.15);
}
```

### Visual Signature

**Hero (unmistakably Vélocité):**
White background. Oversized DM Serif Display headline — the restaurant name fills 80% of the viewport width, tight leading, negative letter-spacing. Small red accent line (3px, 60px) beneath. A single, perfectly cropped dish photograph inset into the typography — overlapping the last word of the headline. CTA is a filled black rectangle, no radius, white text in DM Sans uppercase. The whole composition is asymmetric and deliberately tension-filled.

**Menu Card (unmistakably Vélocité):**
No card background — items on white. Dish name in DM Serif Display at 1.125rem. A single thin black line (1px) between items — no cards, no boxes. Price in DM Sans, red (#E63946), right-aligned. Description in DM Sans, small, medium gray. Category header in DM Serif Display, very large (2rem), light weight, spanning full width.

**Footer (unmistakably Vélocité):**
Black (#0F0F0F) background. Restaurant name in large DM Serif Display, white, left-aligned, very large. Hours and address in DM Sans, small, medium gray, left column. Social links as text ("Instagram" "Reservations") not icons, right-aligned, white. A single red horizontal rule (2px) at the very top of the footer.

### Photography Style Guide
- **Lighting:** High contrast. Clean white or black backgrounds for product shots. Dramatic chiaroscuro for atmosphere.
- **Subject:** Close-cropped dishes showing texture. Action shots in the kitchen. Deliberate negative space.
- **Color treatment:** High contrast, neutral color grading. Reds in the food are vivid. Blacks are true.
- **Aspect ratios:** Mixed — the editorial layout supports varied ratios. 2:3 portrait for chef, 3:1 landscape for kitchen.

### Sub-type Compatibility
- ✅ Ideal: Contemporary American, new American, creative tasting, modern bistro
- ✅ Works: Upscale cocktail bar, modern wine bar
- ⚠️ Use with care: Very traditional cuisines (French classic, Italian traditional) — may clash
- ❌ Avoid: Family casual, cafes, anything warm and homey

---

## Variant 4: "Matin Clair"
*For Cafes — Brunch — Community-Forward — Casual*

### Identity Card
- **variant_id:** `matin-clair`
- **name:** Matin Clair
- **best_for:** Cafes, brunch restaurants, fast-casual, community gathering spots, bakery-cafes, juice bars, casual neighborhood favorites
- **mood_statement:** "The best part of your morning."
- **design_personality:** Fresh · Welcoming · Effortless

### Rationale from A1
The cafe/brunch customer discovers through Instagram and Google Maps. They want to see the food clearly, know the hours immediately, and feel welcome. This variant uses a fresh sage-green primary — warm enough to feel organic and food-friendly, distinctive enough to stand apart from blue (tech) and red (fast food). Nunito adds friendliness without being childish. The layouts are airy and bright — the typographic equivalent of morning light.

### Complete theme.json

```json
{
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
      "display": "'Nunito', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "heading": "'Nunito', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "subheading": "'Nunito', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "body": "'Nunito', 'Noto Sans SC', 'Noto Sans KR', sans-serif",
      "small": "'Nunito', 'Noto Sans SC', 'Noto Sans KR', sans-serif"
    },
    "sizes": {
      "display": "clamp(2.25rem, 4.5vw, 3.75rem)",
      "heading": "clamp(1.5rem, 2.75vw, 2.25rem)",
      "subheading": "1.125rem",
      "body": "1rem",
      "small": "0.875rem"
    }
  }
}
```

### CSS Variable Map
```css
:root {
  --color-primary:           #3D7A5F;
  --color-primary-dark:      #2C5C47;
  --color-primary-light:     #52A67F;
  --color-secondary:         #F4A261;
  --color-secondary-dark:    #E07B3A;
  --color-backdrop-primary:  #FFFFFF;
  --color-backdrop-secondary:#F9FAF8;
  --color-text-primary:      #1A2E25;
  --color-text-muted:        #6B7C74;
  --color-border:            #E2EBE7;
  --color-border-light:      #EEF4F1;

  --font-display:  'Nunito', 'Noto Sans SC', sans-serif;
  --font-heading:  'Nunito', 'Noto Sans SC', sans-serif;
  --font-body:     'Nunito', 'Noto Sans SC', sans-serif;

  --size-display:  clamp(2.25rem, 4.5vw, 3.75rem);
  --size-h1:       clamp(1.5rem, 2.75vw, 2.25rem);
  --size-h2:       clamp(1.25rem, 2vw, 1.75rem);
  --size-body:     1rem;
  --size-small:    0.875rem;

  --tracking-display: -0.01em;
  --tracking-heading: 0em;
  --tracking-body:    0em;
  --tracking-cta:     0.04em;

  --leading-tight:  1.25;
  --leading-normal: 1.65;
  --leading-loose:  1.85;

  --section-py:    4rem;
  --card-radius:   16px;
  --btn-radius:    100px;

  --shadow-card:   0 2px 12px rgba(61,122,95,0.08);
  --shadow-hover:  0 6px 24px rgba(61,122,95,0.14);
  --shadow-modal:  0 20px 60px rgba(0,0,0,0.12);
}
```

### Visual Signature

**Hero (unmistakably Matin Clair):**
Bright white background with a light sage tint (#F0F7F4) on the section background. Headline in Nunito ExtraBold at 3.75rem, dark green, slightly playful kerning. A lush overhead photograph of a breakfast bowl or latte art fills the right 55% of the hero, with organic crop (slight diagonal or circular mask). Orange CTA button (pill shape — 100px radius), white text in Nunito bold. "Open Today 7am–4pm" badge in sage green, top of hero. Airy, never cluttered.

**Menu Card (unmistakably Matin Clair):**
White card, 16px radius, sage-green 1px border, subtle green shadow. Dish photograph at top (4:3 aspect, rounded top corners matching card). Dish name in Nunito Bold at 1rem, dark. Description in Nunito Regular, small, muted. Price in Nunito SemiBold, sage green. Dietary flags as colored pill badges below description. The card lifts 4px on hover with shadow intensification.

**Footer (unmistakably Matin Clair):**
Very light sage (#F0F7F4) background. Centered layout. Restaurant name in Nunito ExtraBold, large, green. Below: "Open Mon–Fri 7am–5pm · Sat–Sun 8am–4pm" in friendly Nunito. Social links as rounded icon buttons. A small illustration or leaf motif above the copyright line. Feels like the end of a good morning.

### Photography Style Guide
- **Lighting:** Bright, natural. Window light preferred. Airy and high-key.
- **Subject:** Overhead shots of breakfast bowls, lattes, avocado toast. Smiling staff. Farmers market produce. Community atmosphere.
- **Color treatment:** Light, warm, slightly pastel. Green and orange tones enhanced. Very approachable.
- **Aspect ratios:** Square 1:1 for menu items, 4:3 for hero atmosphere, 9:16 for Instagram stories.

### Sub-type Compatibility
- ✅ Ideal: Cafes, brunch spots, bakery-cafes, juice bars, fast-casual, community gathering spaces
- ✅ Works: Casual neighborhood restaurant, family-friendly
- ⚠️ Use with care: Dinner-only concepts (too morning-focused)
- ❌ Avoid: Fine dining, bars/lounges, serious cocktail programs

---

## Variant Selection Guide

| Restaurant Type | Recommended Variant | Why |
|---|---|---|
| Tasting menu / Michelin-aspirant | Noir Saison | Dark, ceremonial, press-forward |
| Fine dining, intimate | Noir Saison | Photography-first, gold accent |
| Omakase / chef's table | Noir Saison | Minimal, ceremonial |
| Upscale wine bar | Noir Saison or Terre Vivante | Depends on vibe — dark vs. warm |
| French bistro | Terre Vivante | Earthy warmth, Playfair sophistication |
| Italian trattoria | Terre Vivante | Terracotta, handcrafted feel |
| Farm-to-table | Terre Vivante | Earth tones, seasonal warmth |
| Neighborhood favorite | Terre Vivante | Community-forward, unpretentious |
| Contemporary American | Vélocité | Bold, editorial, chef-forward |
| New American / creative tasting | Vélocité | High contrast, confident |
| Chef-driven independent | Vélocité | Personality-forward |
| Modern cocktail bar | Vélocité or Noir Saison | Depends on light vs. dark preference |
| Cafe / coffee shop | Matin Clair | Bright, fresh, welcoming |
| Brunch restaurant | Matin Clair | Morning-forward, visual menu |
| Bakery-cafe | Matin Clair | Warm sage, approachable |
| Fast-casual | Matin Clair | Friendly, clear, efficient |
| Bar / lounge | Noir Saison or Vélocité | Dark intimate or bold editorial |

---

*End of A2 — Restaurant Brand System*
*Next agent: A3-ARCH will use this brand system to design the complete site architecture.*
