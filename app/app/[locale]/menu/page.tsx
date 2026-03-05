import Link from 'next/link';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { loadLayoutEntries } from '@/lib/pageLayout';
import WeeklySpecialsSection from '@/components/menu/WeeklySpecialsSection';
import ChefSignaturesSection from '@/components/menu/ChefSignaturesSection';
import TodaySpecialSection from '@/components/menu/TodaySpecialSection';
import PageHero from '@/components/sections/PageHero';
import {
  type MenuHubContent,
  type MenuSource,
  type WeeklySpecial,
  defaultWeeklySpecials,
  resolveChefSignaturesFromDinner,
  resolveTodaySpecial,
} from '@/lib/menuHub';

interface PageProps {
  params: { locale: Locale };
}

type L = Record<string, string>;

const menuTypes: Array<{ slug: string; title: L; description: L; image: string }> = [
  {
    slug: 'all-day-breakfast',
    title: { en: 'All-Day Breakfast', zh: '全天早餐', es: 'Desayuno Todo el Dia' },
    description: {
      en: 'Classic diner eggs, pancakes, and griddle favorites served all day.',
      zh: '经典煎蛋、松饼与铁板早餐，全天供应。',
      es: 'Huevos, pancakes y favoritos de plancha servidos todo el dia.',
    },
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'breakfast',
    title: { en: 'Breakfast Menu', zh: '早餐菜单', es: 'Menú de Desayuno' },
    description: {
      en: 'Morning favorites, seasonal pastries, egg dishes, and specialty coffee.',
      zh: '晨间精选、时令烘焙、蛋类料理与特色咖啡。',
      es: 'Favoritos de la mañana, pastelería de temporada y café de especialidad.',
    },
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'lunch',
    title: { en: 'Lunch Menu', zh: '午餐菜单', es: 'Menú de Almuerzo' },
    description: {
      en: 'Sandwiches, melts, bowls, and comforting midday plates.',
      zh: '三明治、热熔、能量碗与舒适午餐主菜。',
      es: 'Sandwiches, melts y platos de mediodía reconfortantes.',
    },
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'burgers-sandwiches',
    title: { en: 'Burgers & Sandwiches', zh: '汉堡与三明治', es: 'Hamburguesas y Sándwiches' },
    description: {
      en: 'Diner classics with premium ingredients and house sauces.',
      zh: '以优质食材与自制酱料打造的美式经典。',
      es: 'Clásicos diner con ingredientes premium y salsas de la casa.',
    },
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'salads-soups',
    title: { en: 'Salads & Soups', zh: '沙拉与汤品', es: 'Ensaladas y Sopas' },
    description: {
      en: 'Fresh greens, seasonal soups, and lighter comfort options.',
      zh: '新鲜蔬菜、时令汤品与轻盈舒适选择。',
      es: 'Verdes frescos, sopas de temporada y opciones ligeras.',
    },
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'dinner',
    title: { en: 'Dinner Menu', zh: '晚餐菜单', es: 'Menú de Cena' },
    description: {
      en: 'Seasonal American cuisine with global influences. Served Tuesday through Sunday.',
      zh: '具有全球影响力的时令美式料理。周二至周日供应。',
      es: 'Cocina americana de temporada con influencias globales. Servida de martes a domingo.',
    },
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'sides',
    title: { en: 'Sides', zh: '配菜', es: 'Guarniciones' },
    description: {
      en: 'Fries, vegetables, mac and cheese, and shareable add-ons.',
      zh: '薯条、蔬菜、芝士通心粉与可分享配菜。',
      es: 'Papas, vegetales, mac and cheese y extras para compartir.',
    },
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'desserts',
    title: { en: 'Desserts', zh: '甜点', es: 'Postres' },
    description: {
      en: 'Pies, cakes, warm sweets, and classic diner finales.',
      zh: '派、蛋糕、热甜品与美式餐馆经典收尾。',
      es: 'Pays, pasteles y finales dulces clásicos del diner.',
    },
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'beverages',
    title: { en: 'Coffee & Beverages', zh: '咖啡与饮品', es: 'Café y Bebidas' },
    description: {
      en: 'Coffee bar, teas, juices, sodas, and house-made refreshers.',
      zh: '咖啡、茶饮、果汁、汽水与自制清爽饮品。',
      es: 'Café, tés, jugos, refrescos y bebidas de la casa.',
    },
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'milkshakes',
    title: { en: 'Milkshakes & Floats', zh: '奶昔与漂浮饮', es: 'Malteadas y Floats' },
    description: {
      en: 'Thick shakes, nostalgic floats, and sweet diner favorites.',
      zh: '浓郁奶昔、复古漂浮饮与甜品系饮品。',
      es: 'Malteadas espesas, floats y favoritos dulces del diner.',
    },
    image:
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'kids',
    title: { en: 'Kids Menu', zh: '儿童菜单', es: 'Menú Infantil' },
    description: {
      en: 'Family-friendly portions and approachable diner classics.',
      zh: '适合家庭的份量与亲切易选的经典餐点。',
      es: 'Porciones familiares y clásicos diner para niños.',
    },
    image:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'cocktails',
    title: { en: 'Cocktails & Spirits', zh: '鸡尾酒与烈酒', es: 'Cócteles y Licores' },
    description: {
      en: 'Craft cocktails, curated wines, and artisan spirits. Available at the bar and tableside.',
      zh: '精酿鸡尾酒、精选葡萄酒和手工烈酒。吧台和餐桌均可供应。',
      es: 'Cócteles artesanales, vinos curados y licores artesanales.',
    },
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'wine',
    title: { en: 'Wine List', zh: '酒单', es: 'Carta de Vinos' },
    description: {
      en: 'By-the-glass favorites and cellar selections for every plate.',
      zh: '杯售精选与酒窖珍藏，适配每一道餐点。',
      es: 'Opciones por copa y selección de cava para cada plato.',
    },
    image:
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80&auto=format&fit=crop',
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  return buildPageMetadata({
    siteId,
    locale,
    slug: 'menu',
    title: locale === 'en' ? 'Menus' : locale === 'zh' ? '菜单' : 'Menús',
    description: locale === 'en'
      ? 'Explore our dinner menu, cocktails, wine list, and tasting menu.'
      : 'Explore our culinary offerings.',
  });
}

export default async function MenuHubPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  let content = await loadPageContent<MenuHubContent>('menu', locale, siteId);
  if (!content && locale !== 'en') {
    content = await loadPageContent<MenuHubContent>('menu', 'en', siteId);
  }
  const layoutEntries = await loadLayoutEntries('menu', locale, siteId, [
    'hero',
    'todaysSpecial',
    'weeklySpecials',
    'chefSignatures',
    'menuCards',
  ]);
  const layoutSections = layoutEntries.map((entry) => entry.id);
  const layoutVariants = Object.fromEntries(
    layoutEntries.map((entry) => [entry.id, entry.variant]).filter(([, variant]) => Boolean(variant))
  ) as Record<string, string>;

  const weeklySpecials = content?.weeklySpecials?.length ? content.weeklySpecials : defaultWeeklySpecials;
  let dinnerMenu = await loadContent<MenuSource>(siteId, locale, 'menu/dinner.json');
  if (!dinnerMenu && locale !== 'en') {
    dinnerMenu = await loadContent<MenuSource>(siteId, 'en', 'menu/dinner.json');
  }
  const chefSignatures = resolveChefSignaturesFromDinner(dinnerMenu, 6);
  const currentDayNumber = new Date().getDay();
  const todaySpecial = resolveTodaySpecial(weeklySpecials, content?.todaySpecial, currentDayNumber);
  const menuSectionVariants =
    content?.sectionVariants && typeof content.sectionVariants === 'object'
      ? content.sectionVariants
      : {};
  const getSectionVariant = (sectionId: string, fallback: 'compact' | 'rich') => {
    const sectionVariant = menuSectionVariants[sectionId];
    if (sectionVariant === 'compact' || sectionVariant === 'rich') {
      return sectionVariant;
    }
    const layoutVariant = layoutVariants[sectionId];
    if (layoutVariant === 'compact' || layoutVariant === 'rich') {
      return layoutVariant;
    }
    return fallback;
  };

  return (
    <main>
      {layoutSections.includes('hero') && (
        <PageHero
          hero={{
            ...(content?.hero || {}),
            headline: content?.hero?.headline || (locale === 'en' ? 'Our Menus' : locale === 'zh' ? '我们的菜单' : 'Nuestros Menús'),
            subline:
              content?.hero?.subline ||
              (locale === 'en'
                ? 'Each menu reflects our commitment to seasonal ingredients and creative craft.'
                : locale === 'zh'
                ? '每份菜单都体现了我们对时令食材和创意工艺的承诺。'
                : 'Cada menú refleja nuestro compromiso con ingredientes de temporada y artesanía creativa.'),
          }}
        />
      )}

      {layoutSections.includes('todaysSpecial') && (
        <TodaySpecialSection
          locale={locale}
          special={todaySpecial}
          weeklySpecials={weeklySpecials}
          currentDayNumber={currentDayNumber}
          variant={getSectionVariant('todaysSpecial', 'rich')}
        />
      )}

      {layoutSections.includes('weeklySpecials') && (
        <WeeklySpecialsSection
          specials={weeklySpecials}
          currentDayNumber={currentDayNumber}
          variant={getSectionVariant('weeklySpecials', 'rich')}
        />
      )}

      {layoutSections.includes('chefSignatures') && (
        <ChefSignaturesSection
          locale={locale}
          signatures={chefSignatures}
          variant={getSectionVariant('chefSignatures', 'rich')}
        />
      )}

      {layoutSections.includes('menuCards') && (
        <section className="px-6" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
          <div
            className="mx-auto grid grid-cols-1 md:grid-cols-2"
            style={{ maxWidth: 'var(--container-max, 1200px)', gap: 'var(--grid-gap, 1.5rem)' }}
          >
            {menuTypes.map((menu) => (
              <Link
                key={menu.slug}
                href={`/${locale}/menu/${menu.slug}`}
                className="group block transition-all"
                style={{
                  borderRadius: 'var(--radius-base, 0.75rem)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                  overflow: 'hidden',
                }}
              >
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={menu.image}
                    alt={menu.title[locale] || menu.title.en}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div style={{ padding: 'var(--card-pad, 2rem)' }}>
                <h2
                  className="mb-2 group-hover:opacity-80 transition-opacity"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-subheading, 1.25rem)',
                    letterSpacing: 'var(--tracking-heading)',
                    color: 'var(--text-color-primary)',
                  }}
                >
                  {menu.title[locale] || menu.title.en}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-small, 0.875rem)',
                    color: 'var(--text-color-secondary)',
                    lineHeight: 'var(--leading-body, 1.65)',
                  }}
                >
                  {menu.description[locale] || menu.description.en}
                </p>
                <span
                  className="inline-block mt-4 group-hover:translate-x-1 transition-transform"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-on-dark-primary)',
                  }}
                >
                  {locale === 'en' ? 'View Menu' : locale === 'zh' ? '查看菜单' : 'Ver Menú'} →
                </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
