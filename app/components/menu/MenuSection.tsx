import MenuItem from './MenuItem';

interface MenuItemData {
  id: string;
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
  // Wine
  producer?: string;
  region?: string;
  vintage?: number;
  glass_price?: number;
  bottle_price?: number;
  // Cocktail
  spirit?: string;
  method?: string;
}

interface MenuSectionProps {
  slug: string;
  name: string;
  description?: string;
  items: MenuItemData[];
  itemVariant?: 'text-only' | 'with-photo' | 'featured';
  locale?: string;
}

export default function MenuSection({
  slug,
  name,
  description,
  items,
  itemVariant = 'text-only',
  locale = 'en',
}: MenuSectionProps) {
  const menuHeadingColor = 'var(--menu-list-heading, #111827)';
  const menuSubheadingColor = 'var(--menu-list-subheading, #374151)';

  return (
    <section id={slug} className="scroll-mt-32">
      {/* Category heading */}
      <h3
        className="mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-subheading, 1.5rem)',
          letterSpacing: 'var(--tracking-heading)',
          color: menuHeadingColor,
        }}
      >
        {name}
      </h3>
      {description && (
        <p
          className="italic mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: menuSubheadingColor,
            lineHeight: 'var(--leading-body, 1.65)',
          }}
        >
          {description}
        </p>
      )}

      {/* Items */}
      {itemVariant === 'featured' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
          {items.map((item) => (
            <MenuItem key={item.id} variant="featured" locale={locale} {...item} />
          ))}
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <MenuItem key={item.id} variant={itemVariant} locale={locale} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}
