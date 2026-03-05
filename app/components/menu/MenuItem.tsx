import Image from 'next/image';

interface MenuItemProps {
  variant?: 'text-only' | 'with-photo' | 'featured';
  name: string;
  description?: string;
  price?: number;
  price_note?: string;
  price_range?: string;
  image?: string;
  dietary_flags?: string[];
  allergens?: string[];
  seasonal?: boolean;
  seasonal_note?: string;
  new_item?: boolean;
  spice_level?: number;
  locale?: string;
  // Wine fields
  producer?: string;
  region?: string;
  vintage?: number;
  glass_price?: number;
  bottle_price?: number;
  // Cocktail fields
  spirit?: string;
  method?: string;
}

const dietaryIcons: Record<string, string> = {
  vegetarian: '🌿',
  vegan: '🌱',
  'gluten-free': '🌾',
  'dairy-free': '🥛',
  'nut-free': '🥜',
};

const MENU_TEXT_PRIMARY = 'var(--menu-list-text-primary, #111827)';
const MENU_TEXT_SECONDARY = 'var(--menu-list-text-secondary, #374151)';
const MENU_TEXT_MUTED = 'var(--menu-list-text-muted, #6B7280)';
const MENU_PRICE_COLOR = 'var(--menu-list-price, #111827)';

function formatPrice(price?: number) {
  if (!price) return '';
  return `$${(price / 100).toFixed(0)}`;
}

export default function MenuItem({
  variant = 'text-only',
  name,
  description,
  price,
  price_note,
  price_range,
  image,
  dietary_flags = [],
  seasonal,
  seasonal_note,
  new_item,
  locale = 'en',
  producer,
  region,
  vintage,
  glass_price,
  bottle_price,
  spirit,
}: MenuItemProps) {
  // Featured card variant
  if (variant === 'featured') {
    return (
      <div
        className="group overflow-hidden transition-all"
        style={{
          borderRadius: 'var(--radius-base, 0.75rem)',
          boxShadow: 'var(--shadow-card)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              style={{ transitionDuration: 'var(--duration-base)' }}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
          )}
          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {seasonal && (
              <span className="px-2 py-0.5 text-small font-medium" style={{ borderRadius: 'var(--badge-radius)', backgroundColor: 'var(--color-warning)', color: 'var(--text-color-inverse)' }}>
                {locale === 'en' ? 'Seasonal' : locale === 'zh' ? '时令' : 'Temporada'}
              </span>
            )}
            {new_item && (
              <span className="px-2 py-0.5 text-small font-medium" style={{ borderRadius: 'var(--badge-radius)', backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)' }}>
                {locale === 'en' ? 'New' : locale === 'zh' ? '新品' : 'Nuevo'}
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-subheading, 1.125rem)', color: MENU_TEXT_PRIMARY, letterSpacing: 'var(--tracking-heading)' }}>
              {name}
            </h4>
            <span className="whitespace-nowrap" style={{ fontFamily: 'var(--font-body)', color: MENU_PRICE_COLOR }}>
              {price_range || formatPrice(price) || price_note || ''}
            </span>
          </div>
          {description && (
            <p className="line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: MENU_TEXT_SECONDARY, lineHeight: 'var(--leading-body, 1.65)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // with-photo variant
  if (variant === 'with-photo') {
    return (
      <div
        className="flex gap-4 py-4"
        style={{ borderBottom: 'var(--menu-divider)' }}
      >
        {/* Photo */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-base, 0.75rem)' }}>
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" sizes="120px" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
          )}
        </div>
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <ItemHeader name={name} price={price} price_note={price_note} price_range={price_range} seasonal={seasonal} new_item={new_item} locale={locale} />
          {description && (
            <p className="mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: MENU_TEXT_SECONDARY, lineHeight: 'var(--leading-menu, 1.65)' }}>
              {description}
            </p>
          )}
          {producer && <p className="mt-0.5" style={{ fontSize: '0.75rem', color: MENU_TEXT_MUTED }}>{producer}</p>}
          <DietaryFlags flags={dietary_flags} />
        </div>
      </div>
    );
  }

  // text-only (default)
  return (
    <div
      className="py-4"
      style={{ borderBottom: 'var(--menu-divider)', paddingTop: 'var(--menu-item-py, 1rem)', paddingBottom: 'var(--menu-item-py, 1rem)' }}
    >
      <ItemHeader name={name} price={price} price_note={price_note} price_range={price_range} seasonal={seasonal} new_item={new_item} locale={locale} glass_price={glass_price} bottle_price={bottle_price} />
      {description && (
        <p className="mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: MENU_TEXT_SECONDARY, lineHeight: 'var(--leading-menu, 1.65)' }}>
          {description}
        </p>
      )}
      {/* Wine extras */}
      {producer && (
        <p className="mt-0.5" style={{ fontSize: '0.75rem', color: MENU_TEXT_MUTED, fontStyle: 'italic' }}>
          {producer}{region ? ` · ${region}` : ''}{vintage ? ` · ${vintage}` : ''}
        </p>
      )}
      {/* Cocktail extras */}
      {spirit && (
        <p className="mt-0.5" style={{ fontSize: '0.75rem', color: MENU_TEXT_MUTED }}>
          {spirit}
        </p>
      )}
      {seasonal_note && (
        <p className="mt-0.5 italic" style={{ fontSize: '0.75rem', color: MENU_TEXT_MUTED }}>
          {seasonal_note}
        </p>
      )}
      <DietaryFlags flags={dietary_flags} />
    </div>
  );
}

// Shared header: name + price + badges
function ItemHeader({
  name, price, price_note, price_range, seasonal, new_item, locale = 'en',
  glass_price, bottle_price,
}: {
  name: string; price?: number; price_note?: string; price_range?: string;
  seasonal?: boolean; new_item?: boolean; locale?: string;
  glass_price?: number; bottle_price?: number;
}) {
  const priceDisplay = glass_price && bottle_price
    ? `Glass ${formatPrice(glass_price)} · Bottle ${formatPrice(bottle_price)}`
    : price_range || formatPrice(price) || '';

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: MENU_TEXT_PRIMARY, letterSpacing: 'var(--tracking-heading)' }}>
          {name}
        </h4>
        {seasonal && (
          <span className="px-1.5 py-0.5 text-small" style={{ borderRadius: 'var(--badge-radius)', backgroundColor: 'var(--color-warning)', color: 'var(--text-color-inverse)', fontWeight: 500 }}>
            {locale === 'en' ? 'Seasonal' : locale === 'zh' ? '时令' : 'Temporada'}
          </span>
        )}
        {new_item && (
          <span className="px-1.5 py-0.5 text-small" style={{ borderRadius: 'var(--badge-radius)', backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', fontWeight: 500 }}>
            {locale === 'en' ? 'New' : locale === 'zh' ? '新品' : 'Nuevo'}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="whitespace-nowrap" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: MENU_PRICE_COLOR }}>
          {priceDisplay}
        </span>
        {price_note && (
          <span style={{ fontSize: '0.6875rem', color: MENU_TEXT_MUTED }}>{price_note}</span>
        )}
      </div>
    </div>
  );
}

function DietaryFlags({ flags = [] }: { flags?: string[] }) {
  if (flags.length === 0) return null;
  const visible = flags.slice(0, 3);
  const remaining = flags.length - 3;

  return (
    <div className="flex gap-1.5 mt-2 flex-wrap">
      {visible.map((flag) => (
        <span
          key={flag}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5"
          style={{ fontSize: '0.625rem', borderRadius: 'var(--badge-radius)', backgroundColor: 'var(--primary-50)', color: MENU_TEXT_MUTED }}
        >
          {dietaryIcons[flag] || ''} {flag}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{ fontSize: '0.625rem', color: MENU_TEXT_MUTED }}>+{remaining} more</span>
      )}
    </div>
  );
}
