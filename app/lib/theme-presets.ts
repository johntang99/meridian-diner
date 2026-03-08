import type { ThemeConfig } from '@/lib/types';
import luxuryNoir from '@/data/theme-presets/luxury-noir.json';
import luxuryBurgundy from '@/data/theme-presets/luxury-burgundy.json';
import modernGraphite from '@/data/theme-presets/modern-graphite.json';
import casualBistro from '@/data/theme-presets/casual-bistro.json';
import coastalBlue from '@/data/theme-presets/coastal-blue.json';
import steakhouseClassic from '@/data/theme-presets/steakhouse-classic.json';
import cafeWarm from '@/data/theme-presets/cafe-warm.json';
import gardenFresh from '@/data/theme-presets/garden-fresh.json';

export type ThemePresetCategory =
  | 'luxury'
  | 'modern'
  | 'casual'
  | 'coastal'
  | 'steakhouse'
  | 'cafe'
  | 'fresh';

export type ThemePreset = ThemeConfig & {
  shape: { radius: string; shadow: string };
  layout: {
    heroVariant: string;
    featureVariant: string;
    spacingDensity: 'compact' | 'comfortable' | 'spacious';
  };
  _preset: {
    id: string;
    name: string;
    category: ThemePresetCategory;
    description: string;
  };
};

type PresetMeta = ThemePreset['_preset'];

function clonePreset<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeDeep(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      mergeDeep(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
}

function makeVariant(base: ThemePreset, meta: PresetMeta, overrides: Record<string, any> = {}): ThemePreset {
  const next = clonePreset(base) as any;
  next.variantId = meta.id;
  next._preset = meta;
  mergeDeep(next, overrides);
  return next as ThemePreset;
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  if (typeof hex !== 'string') return null;
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  const toPart = (value: number) => clamp(value).toString(16).padStart(2, '0');
  return `#${toPart(r)}${toPart(g)}${toPart(b)}`;
}

function mixHex(base: string, tint: string, tintWeight: number): string {
  const a = parseHex(base);
  const b = parseHex(tint);
  if (!a || !b) return base;
  const weight = Math.max(0, Math.min(1, tintWeight));
  return toHex({
    r: a.r * (1 - weight) + b.r * weight,
    g: a.g * (1 - weight) + b.g * weight,
    b: a.b * (1 - weight) + b.b * weight,
  });
}

function rgbaFromHex(hex: string, alpha: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${safeAlpha})`;
}

function shouldUseDarkBackdrop(preset: ThemePreset): boolean {
  const id = `${preset._preset.id}`.toLowerCase();
  if (/(midnight|night|noir|espresso|ember)/.test(id)) return true;
  return preset._preset.category === 'luxury' || preset._preset.category === 'steakhouse';
}

function harmonizeBackdrop(preset: ThemePreset): ThemePreset {
  const next = clonePreset(preset) as any;
  const primary = next?.colors?.primary?.DEFAULT || '#1F2937';
  const secondary = next?.colors?.secondary?.DEFAULT || '#F59E0B';
  const blend = mixHex(primary, secondary, 0.22);
  const darkMode = shouldUseDarkBackdrop(preset);

  next.colors = next.colors || {};
  if (darkMode) {
    const primaryBg = mixHex(primary, '#000000', 0.38);
    const secondaryBg = mixHex(blend, '#111111', 0.28);
    const surfaceBg = mixHex(blend, '#1A1A1A', 0.24);
    next.colors.backdrop = {
      primary: primaryBg,
      secondary: secondaryBg,
      surface: surfaceBg,
      overlay: rgbaFromHex(mixHex(primary, '#000000', 0.5), 0.56),
    };
  } else {
    const primaryBg = mixHex(primary, '#FFFFFF', 0.9);
    const secondaryBg = mixHex(blend, '#FFFFFF', 0.84);
    next.colors.backdrop = {
      primary: primaryBg,
      secondary: secondaryBg,
      surface: '#FFFFFF',
      overlay: rgbaFromHex(mixHex(primary, '#000000', 0.25), 0.18),
    };
  }
  return next as ThemePreset;
}

const LUXURY_BASE = luxuryNoir as ThemePreset;
const LUXURY_ALT = luxuryBurgundy as ThemePreset;
const MODERN_BASE = modernGraphite as ThemePreset;
const CASUAL_BASE = casualBistro as ThemePreset;
const COASTAL_BASE = coastalBlue as ThemePreset;
const STEAKHOUSE_BASE = steakhouseClassic as ThemePreset;
const CAFE_BASE = cafeWarm as ThemePreset;
const FRESH_BASE = gardenFresh as ThemePreset;

const LUXURY_PRESETS: ThemePreset[] = [
  LUXURY_BASE,
  LUXURY_ALT,
  makeVariant(LUXURY_BASE, {
    id: 'luxury-emerald-club',
    name: 'Luxury Emerald Club',
    category: 'luxury',
    description: 'Emerald and brass evening-club palette for tasting menus and cocktail bars.',
  }, { colors: { primary: { DEFAULT: '#102A24', dark: '#081A16', light: '#1B3C35' }, secondary: { DEFAULT: '#D4AF37', dark: '#B58920', light: '#E4C86D' } } }),
  makeVariant(LUXURY_ALT, {
    id: 'luxury-champagne-ivory',
    name: 'Luxury Champagne Ivory',
    category: 'luxury',
    description: 'Soft ivory canvas with champagne accents for upscale daytime service.',
  }, { colors: { primary: { DEFAULT: '#3A302A', dark: '#241D19', light: '#4F433B' }, secondary: { DEFAULT: '#C9A76B', dark: '#A8854E', light: '#DABE8D' }, backdrop: { primary: '#FEFBF7', secondary: '#F8F3EC', surface: '#FFFFFF', overlay: 'rgba(36,29,25,0.26)' }, text: { onDarkPrimary: '#FAF7F2', onDarkSecondary: '#E6DED2' } }, effects: { cardRadius: '10px', btnRadius: '999px' }, shape: { radius: '10px' } }),
  makeVariant(LUXURY_BASE, {
    id: 'luxury-royal-amethyst',
    name: 'Luxury Royal Amethyst',
    category: 'luxury',
    description: 'Deep violet jewel tones for chef-table and lounge-forward concepts.',
  }, { colors: { primary: { DEFAULT: '#251A35', dark: '#150F20', light: '#3A2A52' }, secondary: { DEFAULT: '#B794F4', dark: '#9F7AEA', light: '#D6BCFA' }, backdrop: { primary: '#120F19', secondary: '#1A1524', surface: '#231D30', overlay: 'rgba(16,12,24,0.62)' } }, layout: { heroVariant: 'split-photo-left' } }),
];

const MODERN_PRESETS: ThemePreset[] = [
  MODERN_BASE,
  makeVariant(MODERN_BASE, {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'modern',
    description: 'Ultra-clean monochrome aesthetic with subtle cobalt accents.',
  }, { colors: { primary: { DEFAULT: '#111827', dark: '#030712', light: '#1F2937' }, secondary: { DEFAULT: '#2563EB', dark: '#1D4ED8', light: '#60A5FA' }, backdrop: { primary: '#FFFFFF', secondary: '#F8FAFC', surface: '#FFFFFF', overlay: 'rgba(15,23,42,0.22)' } }, effects: { cardRadius: '10px', btnRadius: '10px' }, shape: { radius: '10px' } }),
  makeVariant(MODERN_BASE, {
    id: 'modern-indigo',
    name: 'Modern Indigo',
    category: 'modern',
    description: 'Tech-forward indigo brand language with crisp card geometry.',
  }, { colors: { primary: { DEFAULT: '#1E1B4B', dark: '#0F172A', light: '#312E81' }, secondary: { DEFAULT: '#22D3EE', dark: '#06B6D4', light: '#67E8F9' } } }),
  makeVariant(MODERN_BASE, {
    id: 'modern-slate',
    name: 'Modern Slate',
    category: 'modern',
    description: 'Muted slate neutrals with restrained amber accent for refined minimal menus.',
  }, { colors: { primary: { DEFAULT: '#334155', dark: '#1E293B', light: '#475569' }, secondary: { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FBBF24' } }, layout: { spacingDensity: 'comfortable' } }),
  makeVariant(MODERN_BASE, {
    id: 'modern-neon-night',
    name: 'Modern Neon Night',
    category: 'modern',
    description: 'Dark nightlife palette with electric magenta and cyan accenting.',
  }, { colors: { primary: { DEFAULT: '#0B1020', dark: '#040712', light: '#161F38' }, secondary: { DEFAULT: '#F43F5E', dark: '#E11D48', light: '#FB7185' }, backdrop: { primary: '#060A16', secondary: '#0A1020', surface: '#121A2E', overlay: 'rgba(4,7,18,0.66)' }, text: { onDarkPrimary: '#F8FAFC', onDarkSecondary: '#C7D2FE' } }, effects: { cardShadow: '0 8px 26px rgba(8,13,32,0.5)' }, shape: { shadow: '0 8px 26px rgba(8,13,32,0.5)' } }),
];

const CASUAL_PRESETS: ThemePreset[] = [
  CASUAL_BASE,
  makeVariant(CASUAL_BASE, {
    id: 'casual-sunrise',
    name: 'Casual Sunrise',
    category: 'casual',
    description: 'Cheerful warm citrus tones for brunch-first and family dining menus.',
  }, { colors: { primary: { DEFAULT: '#7C3E2A', dark: '#5B2D20', light: '#9A513A' }, secondary: { DEFAULT: '#F97316', dark: '#EA580C', light: '#FB923C' }, backdrop: { primary: '#FFF9F4', secondary: '#FFF3E8', surface: '#FFFFFF', overlay: 'rgba(124,62,42,0.24)' } } }),
  makeVariant(CASUAL_BASE, {
    id: 'casual-garden',
    name: 'Casual Garden',
    category: 'casual',
    description: 'Relaxed green-forward palette for patio service and local produce menus.',
  }, { colors: { primary: { DEFAULT: '#2E5E4E', dark: '#1F4639', light: '#3F7A66' }, secondary: { DEFAULT: '#84CC16', dark: '#65A30D', light: '#A3E635' } } }),
  makeVariant(CASUAL_BASE, {
    id: 'casual-brickhouse',
    name: 'Casual Brickhouse',
    category: 'casual',
    description: 'Rustic brick-red tones with cream neutrals for comfort-food positioning.',
  }, { colors: { primary: { DEFAULT: '#6B3A2E', dark: '#4A281F', light: '#854D3F' }, secondary: { DEFAULT: '#D97757', dark: '#C15C37', light: '#E89A80' }, backdrop: { primary: '#FFFBF8', secondary: '#F8EFEA', surface: '#FFFFFF', overlay: 'rgba(75,40,31,0.28)' } } }),
  makeVariant(CASUAL_BASE, {
    id: 'casual-charcoal',
    name: 'Casual Charcoal',
    category: 'casual',
    description: 'Urban-casual charcoal base with punchy yellow highlights for burger bars.',
  }, { colors: { primary: { DEFAULT: '#1F2937', dark: '#111827', light: '#374151' }, secondary: { DEFAULT: '#FACC15', dark: '#EAB308', light: '#FDE047' }, backdrop: { primary: '#111827', secondary: '#1F2937', surface: '#273244', overlay: 'rgba(2,6,23,0.54)' }, text: { onDarkPrimary: '#F9FAFB', onDarkSecondary: '#D1D5DB' } }, layout: { heroVariant: 'split-photo-right' } }),
];

const COASTAL_PRESETS: ThemePreset[] = [
  COASTAL_BASE,
  makeVariant(COASTAL_BASE, {
    id: 'coastal-sunset',
    name: 'Coastal Sunset',
    category: 'coastal',
    description: 'Warm sunset coral and ocean navy pairing for evening waterfront dining.',
  }, { colors: { primary: { DEFAULT: '#0C4A6E', dark: '#082F49', light: '#075985' }, secondary: { DEFAULT: '#FB7185', dark: '#F43F5E', light: '#FDA4AF' }, backdrop: { primary: '#FFF7F5', secondary: '#FFEFEA', surface: '#FFFFFF', overlay: 'rgba(12,74,110,0.26)' } } }),
  makeVariant(COASTAL_BASE, {
    id: 'coastal-seaglass',
    name: 'Coastal Seaglass',
    category: 'coastal',
    description: 'Fresh aqua and seafoam look for raw bars and lighter tasting menus.',
  }, { colors: { primary: { DEFAULT: '#0F766E', dark: '#115E59', light: '#14B8A6' }, secondary: { DEFAULT: '#7DD3FC', dark: '#38BDF8', light: '#BAE6FD' } } }),
  makeVariant(COASTAL_BASE, {
    id: 'coastal-midnight',
    name: 'Coastal Midnight',
    category: 'coastal',
    description: 'After-dark navy coastal concept with luminous cyan highlights.',
  }, { colors: { primary: { DEFAULT: '#0B132B', dark: '#030711', light: '#1C2541' }, secondary: { DEFAULT: '#5BC0BE', dark: '#3AAFA9', light: '#8DE4E0' }, backdrop: { primary: '#080D1C', secondary: '#101A33', surface: '#1A2440', overlay: 'rgba(3,7,17,0.62)' }, text: { onDarkPrimary: '#F8FAFC', onDarkSecondary: '#C7D2FE' } }, layout: { heroVariant: 'photo-background' } }),
  makeVariant(COASTAL_BASE, {
    id: 'coastal-coral',
    name: 'Coastal Coral',
    category: 'coastal',
    description: 'Playful coral-forward palette for vibrant beachside all-day dining.',
  }, { colors: { primary: { DEFAULT: '#155E75', dark: '#0E7490', light: '#0891B2' }, secondary: { DEFAULT: '#F97393', dark: '#EC4899', light: '#FDA4AF' }, backdrop: { primary: '#FFF8F8', secondary: '#FFF1F2', surface: '#FFFFFF', overlay: 'rgba(21,94,117,0.22)' } }, effects: { cardRadius: '16px' }, shape: { radius: '16px' } }),
];

const STEAKHOUSE_PRESETS: ThemePreset[] = [
  STEAKHOUSE_BASE,
  makeVariant(STEAKHOUSE_BASE, {
    id: 'steakhouse-ember',
    name: 'Steakhouse Ember',
    category: 'steakhouse',
    description: 'Smoky charcoal with ember orange highlights for open-fire grill identity.',
  }, { colors: { primary: { DEFAULT: '#221A16', dark: '#120D0A', light: '#3A2A23' }, secondary: { DEFAULT: '#EA580C', dark: '#C2410C', light: '#FB923C' }, backdrop: { primary: '#110C09', secondary: '#1A120E', surface: '#241A15', overlay: 'rgba(12,8,6,0.66)' } } }),
  makeVariant(STEAKHOUSE_BASE, {
    id: 'steakhouse-oak',
    name: 'Steakhouse Oak',
    category: 'steakhouse',
    description: 'Warm oak and whiskey tones for heritage chophouse ambiance.',
  }, { colors: { primary: { DEFAULT: '#3F2A1D', dark: '#2A1B12', light: '#5A3E2D' }, secondary: { DEFAULT: '#C08457', dark: '#A16207', light: '#D6A57E' }, backdrop: { primary: '#19130F', secondary: '#241B15', surface: '#2E241E', overlay: 'rgba(25,19,15,0.58)' } } }),
  makeVariant(STEAKHOUSE_BASE, {
    id: 'steakhouse-bourbon',
    name: 'Steakhouse Bourbon',
    category: 'steakhouse',
    description: 'Bourbon amber accents with dark walnut framing and bold section rhythm.',
  }, { colors: { primary: { DEFAULT: '#2E2017', dark: '#1B130E', light: '#4A3428' }, secondary: { DEFAULT: '#D97706', dark: '#B45309', light: '#F59E0B' } }, effects: { btnRadius: '999px' }, shape: { radius: '8px' } }),
  makeVariant(STEAKHOUSE_BASE, {
    id: 'steakhouse-midnight',
    name: 'Steakhouse Midnight',
    category: 'steakhouse',
    description: 'Ultra-dark premium grill treatment with copper highlights.',
  }, { colors: { primary: { DEFAULT: '#111111', dark: '#050505', light: '#1F1F1F' }, secondary: { DEFAULT: '#B45309', dark: '#92400E', light: '#D97706' }, backdrop: { primary: '#080808', secondary: '#111111', surface: '#1A1A1A', overlay: 'rgba(5,5,5,0.7)' }, text: { onDarkPrimary: '#FAFAF9', onDarkSecondary: '#D6D3D1' } }, layout: { heroVariant: 'photo-background' } }),
];

const CAFE_PRESETS: ThemePreset[] = [
  CAFE_BASE,
  makeVariant(CAFE_BASE, {
    id: 'cafe-pastel',
    name: 'Cafe Pastel',
    category: 'cafe',
    description: 'Light pastel palette for dessert bars, brunch cafes, and bakery storytelling.',
  }, { colors: { primary: { DEFAULT: '#7C5E7E', dark: '#5F4561', light: '#9A7C9B' }, secondary: { DEFAULT: '#F9A8D4', dark: '#F472B6', light: '#FBCFE8' }, backdrop: { primary: '#FFF9FC', secondary: '#FFF1F7', surface: '#FFFFFF', overlay: 'rgba(95,69,97,0.2)' } }, effects: { cardRadius: '18px', btnRadius: '999px' }, shape: { radius: '18px' } }),
  makeVariant(CAFE_BASE, {
    id: 'cafe-espresso',
    name: 'Cafe Espresso',
    category: 'cafe',
    description: 'Dark roast-inspired cocoa and cream palette with classic coffeehouse tone.',
  }, { colors: { primary: { DEFAULT: '#3A2A22', dark: '#241A15', light: '#523A2F' }, secondary: { DEFAULT: '#C08457', dark: '#A16207', light: '#D6A57E' }, backdrop: { primary: '#18120F', secondary: '#241C17', surface: '#302722', overlay: 'rgba(24,18,15,0.58)' }, text: { onDarkPrimary: '#FAF5EF', onDarkSecondary: '#E7D8C8' } }, layout: { heroVariant: 'split-photo-right' } }),
  makeVariant(CAFE_BASE, {
    id: 'cafe-sage',
    name: 'Cafe Sage',
    category: 'cafe',
    description: 'Muted sage and oat tones for calm all-day cafe and wellness menu brands.',
  }, { colors: { primary: { DEFAULT: '#4B5D4A', dark: '#354435', light: '#647A63' }, secondary: { DEFAULT: '#B8C9A6', dark: '#94A88A', light: '#D7E3CA' }, backdrop: { primary: '#FAFCF8', secondary: '#F1F5EC', surface: '#FFFFFF', overlay: 'rgba(53,68,53,0.2)' } } }),
  makeVariant(CAFE_BASE, {
    id: 'cafe-terracotta',
    name: 'Cafe Terracotta',
    category: 'cafe',
    description: 'Earthy terracotta aesthetic for artisanal bakery and wood-fired cafe concepts.',
  }, { colors: { primary: { DEFAULT: '#8A4B35', dark: '#6B3728', light: '#A65E44' }, secondary: { DEFAULT: '#EAB308', dark: '#CA8A04', light: '#FACC15' }, backdrop: { primary: '#FFF9F6', secondary: '#FDF2E8', surface: '#FFFFFF', overlay: 'rgba(107,55,40,0.22)' } }, layout: { spacingDensity: 'compact' } }),
];

const FRESH_PRESETS: ThemePreset[] = [
  FRESH_BASE,
  makeVariant(FRESH_BASE, {
    id: 'fresh-citrus',
    name: 'Fresh Citrus',
    category: 'fresh',
    description: 'Lime and citrus-driven palette for juice-forward and healthy casual concepts.',
  }, { colors: { primary: { DEFAULT: '#166534', dark: '#14532D', light: '#22C55E' }, secondary: { DEFAULT: '#FACC15', dark: '#EAB308', light: '#FDE047' }, backdrop: { primary: '#FAFFF6', secondary: '#F4FCE8', surface: '#FFFFFF', overlay: 'rgba(20,83,45,0.2)' } } }),
  makeVariant(FRESH_BASE, {
    id: 'fresh-herb',
    name: 'Fresh Herb',
    category: 'fresh',
    description: 'Herb-forward green identity with calm neutrals for farm-to-table menus.',
  }, { colors: { primary: { DEFAULT: '#2F6B3E', dark: '#1F4D2D', light: '#3F8450' }, secondary: { DEFAULT: '#84CC16', dark: '#65A30D', light: '#A3E635' } } }),
  makeVariant(FRESH_BASE, {
    id: 'fresh-mint',
    name: 'Fresh Mint',
    category: 'fresh',
    description: 'Cool mint and teal blend for contemporary healthy dining and smoothie bars.',
  }, { colors: { primary: { DEFAULT: '#0F766E', dark: '#115E59', light: '#14B8A6' }, secondary: { DEFAULT: '#22C55E', dark: '#16A34A', light: '#4ADE80' }, backdrop: { primary: '#F2FFFC', secondary: '#E6FFF8', surface: '#FFFFFF', overlay: 'rgba(15,118,110,0.18)' } }, effects: { cardRadius: '16px' }, shape: { radius: '16px' } }),
  makeVariant(FRESH_BASE, {
    id: 'fresh-earth',
    name: 'Fresh Earth',
    category: 'fresh',
    description: 'Organic olive and clay direction for regenerative and seasonal tasting programs.',
  }, { colors: { primary: { DEFAULT: '#3F5A3A', dark: '#2E4330', light: '#587A4F' }, secondary: { DEFAULT: '#B45309', dark: '#92400E', light: '#D97706' }, backdrop: { primary: '#FBFAF5', secondary: '#F3F0E6', surface: '#FFFFFF', overlay: 'rgba(46,67,48,0.22)' } }, layout: { heroVariant: 'gallery-background' } }),
];

const RAW_THEME_PRESETS: ThemePreset[] = [
  ...LUXURY_PRESETS,
  ...MODERN_PRESETS,
  ...CASUAL_PRESETS,
  ...COASTAL_PRESETS,
  ...STEAKHOUSE_PRESETS,
  ...CAFE_PRESETS,
  ...FRESH_PRESETS,
];

export const THEME_PRESETS: ThemePreset[] = RAW_THEME_PRESETS.map((preset) => harmonizeBackdrop(preset));

export function getPresetsByCategory(): Record<ThemePresetCategory, ThemePreset[]> {
  return THEME_PRESETS.reduce(
    (acc, preset) => {
      acc[preset._preset.category].push(preset);
      return acc;
    },
    {
      luxury: [],
      modern: [],
      casual: [],
      coastal: [],
      steakhouse: [],
      cafe: [],
      fresh: [],
    } as Record<ThemePresetCategory, ThemePreset[]>
  );
}
