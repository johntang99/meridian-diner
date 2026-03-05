import { notFound } from 'next/navigation';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import MenuCategoryNav from '@/components/menu/MenuCategoryNav';
import MenuSection from '@/components/menu/MenuSection';
import DietaryLegend from '@/components/menu/DietaryLegend';
import { loadLayoutSections } from '@/lib/pageLayout';

interface PageProps {
  params: { locale: Locale; type: string };
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}

interface MenuItemData {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price?: number;
  price_note?: string;
  price_range?: string;
  image?: string;
  dietaryFlags?: string[];
  allergens?: string[];
  featured?: boolean;
  seasonal?: boolean;
  seasonal_note?: string;
  newItem?: boolean;
  available?: boolean;
  displayOrder: number;
  // Wine extras
  producer?: string;
  region?: string;
  vintage?: number;
  glass_price?: number;
  bottle_price?: number;
  // Cocktail extras
  spirit?: string;
  method?: string;
}

interface MenuData {
  menuType: string;
  title: string;
  subtitle?: string;
  defaultItemImage?: string;
  categories: MenuCategory[];
  items: MenuItemData[];
}

const MENU_TYPE_DEFAULT_IMAGES: Record<string, string> = {
  'all-day-breakfast':
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=80&auto=format&fit=crop',
  breakfast:
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1200&q=80&auto=format&fit=crop',
  lunch:
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=1200&q=80&auto=format&fit=crop',
  'burgers-sandwiches':
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop',
  'salads-soups':
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80&auto=format&fit=crop',
  dinner:
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
  sides:
    'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1200&q=80&auto=format&fit=crop',
  desserts:
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80&auto=format&fit=crop',
  beverages:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop',
  milkshakes:
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&q=80&auto=format&fit=crop',
  kids:
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80&auto=format&fit=crop',
  cocktails:
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80&auto=format&fit=crop',
  wine:
    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80&auto=format&fit=crop',
};

const validTypes = [
  'all-day-breakfast',
  'breakfast',
  'lunch',
  'burgers-sandwiches',
  'salads-soups',
  'dinner',
  'sides',
  'desserts',
  'beverages',
  'milkshakes',
  'kids',
  'cocktails',
  'wine',
  'tasting-menu',
  'seasonal',
  'brunch',
];

export async function generateMetadata({ params }: PageProps) {
  const { locale, type } = params;
  if (!validTypes.includes(type)) return {};
  const siteId = await getRequestSiteId();
  let menuData = await loadContent<MenuData>(siteId, locale, `menu/${type}.json`);
  if (!menuData && locale !== 'en') {
    menuData = await loadContent<MenuData>(siteId, 'en', `menu/${type}.json`);
  }
  return buildPageMetadata({
    siteId,
    locale,
    slug: `menu/${type}`,
    title: menuData?.title || type.replace(/-/g, ' '),
    description: menuData?.subtitle || '',
  });
}

export default async function MenuTypePage({ params }: PageProps) {
  const { locale, type } = params;

  if (!validTypes.includes(type)) {
    notFound();
  }

  const siteId = await getRequestSiteId();
  const layoutSections = await loadLayoutSections('menuType', locale, siteId, [
    'hero',
    'categoryNav',
    'menuSections',
  ]);
  let menuData = await loadContent<MenuData>(siteId, locale, `menu/${type}.json`);

  // Fallback to English if locale-specific menu not found
  if (!menuData && locale !== 'en') {
    menuData = await loadContent<MenuData>(siteId, 'en', `menu/${type}.json`);
  }

  if (!menuData) {
    notFound();
  }

  // Sort categories
  const categories = [...menuData.categories].sort((a, b) => a.displayOrder - b.displayOrder);

  // Group items by category, filter available
  const itemsByCategory = new Map<string, MenuItemData[]>();
  for (const item of menuData.items) {
    if (item.available === false) continue;
    const list = itemsByCategory.get(item.categoryId) || [];
    list.push(item);
    itemsByCategory.set(item.categoryId, list);
  }
  // Sort items within each category
  for (const [key, items] of itemsByCategory) {
    itemsByCategory.set(key, items.sort((a, b) => a.displayOrder - b.displayOrder));
  }

  // Collect all dietary flags used
  const allFlags = new Set<string>();
  for (const item of menuData.items) {
    if (item.dietaryFlags) item.dietaryFlags.forEach(f => allFlags.add(f));
  }

  // Map categories for nav
  const navCategories = categories.map(c => ({
    id: c.id,
    slug: c.id,
    name: c.name,
  }));

  // Schema.org Menu
  const dietaryMap: Record<string, string> = {
    vegan: 'https://schema.org/VeganDiet',
    vegetarian: 'https://schema.org/VegetarianDiet',
    'gluten-free': 'https://schema.org/GlutenFreeDiet',
    gf: 'https://schema.org/GlutenFreeDiet',
    'dairy-free': 'https://schema.org/LowLactoseDiet',
  };

  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${menuData.title} — The Meridian`,
    inLanguage: locale,
    hasMenuSection: categories.map((category) => {
      const items = itemsByCategory.get(category.id) || [];
      return {
        '@type': 'MenuSection',
        name: category.name,
        description: category.description || undefined,
        hasMenuItem: items.map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description || undefined,
          image: item.image || undefined,
          suitableForDiet: item.dietaryFlags
            ?.map((flag) => dietaryMap[flag])
            .filter(Boolean),
          offers: item.price
            ? {
                '@type': 'Offer',
                price: (item.price / 100).toFixed(2),
                priceCurrency: 'USD',
              }
            : undefined,
        })),
      };
    }),
  };

  return (
    <main>
      {/* Schema.org Menu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />

      {layoutSections.includes('hero') && (
        <section
          className="px-6 text-center"
          style={{
            paddingTop: 'calc(var(--section-py) + 2rem)',
            paddingBottom: 'var(--section-py-sm)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div
            className="mx-auto mb-6 overflow-hidden"
            style={{ maxWidth: '960px', borderRadius: 'var(--radius-base, 0.75rem)', aspectRatio: '16/7' }}
          >
            <Image
              src={menuData.defaultItemImage || MENU_TYPE_DEFAULT_IMAGES[type]}
              alt={menuData.title}
              width={1600}
              height={700}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display, 3rem)',
              fontWeight: 'var(--weight-display, 400)' as any,
              letterSpacing: 'var(--tracking-display)',
              lineHeight: 'var(--leading-display, 1.1)',
              color: 'var(--text-color-primary)',
            }}
          >
            {menuData.title}
          </h1>
          {menuData.subtitle && (
            <p
              className="mt-4 mx-auto"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                color: 'var(--text-color-secondary)',
                maxWidth: '600px',
                lineHeight: 'var(--leading-body, 1.65)',
              }}
            >
              {menuData.subtitle}
            </p>
          )}
        </section>
      )}

      {/* Sticky Category Nav */}
      {layoutSections.includes('categoryNav') && categories.length > 1 && (
        <MenuCategoryNav
          variant={type === 'wine' ? 'sidebar' : type === 'tasting-menu' ? 'dropdown' : 'tabs'}
          categories={navCategories}
        />
      )}

      {/* Menu Sections */}
      {layoutSections.includes('menuSections') && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py-sm)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: '#FFFFFF',
            ['--menu-list-surface' as any]: '#FFFFFF',
            ['--menu-list-legend-bg' as any]: '#F8FAFC',
            ['--menu-list-text-primary' as any]: '#111827',
            ['--menu-list-text-secondary' as any]: '#374151',
            ['--menu-list-text-muted' as any]: '#6B7280',
            ['--menu-list-price' as any]: '#111827',
            ['--menu-list-border' as any]: '#E5E7EB',
            ['--menu-list-divider' as any]: '1px solid #E5E7EB',
            ['--menu-list-accent' as any]: '#111827',
          } as any}
        >
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            {/* Dietary Legend */}
            {allFlags.size > 0 && (
              <div className="mb-8">
                <DietaryLegend usedFlags={Array.from(allFlags)} />
              </div>
            )}

            {/* Category sections */}
            <div className="space-y-12">
              {categories.map((category) => {
                const items = itemsByCategory.get(category.id) || [];
                if (items.length === 0) return null;

                return (
                  <MenuSection
                    key={category.id}
                    slug={category.id}
                    name={category.name}
                    description={category.description}
                    itemVariant="with-photo"
                    items={items.map(item => ({
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      price_note: item.price_note,
                      price_range: item.price_range,
                      image: item.image || menuData.defaultItemImage || MENU_TYPE_DEFAULT_IMAGES[type],
                      dietary_flags: item.dietaryFlags,
                      allergens: item.allergens,
                      seasonal: item.seasonal,
                      seasonal_note: item.seasonal_note,
                      new_item: item.newItem,
                      producer: item.producer,
                      region: item.region,
                      vintage: item.vintage,
                      glass_price: item.glass_price,
                      bottle_price: item.bottle_price,
                      spirit: item.spirit,
                      method: item.method,
                    }))}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
