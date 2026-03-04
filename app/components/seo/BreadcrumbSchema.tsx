/**
 * BreadcrumbList schema.org + visible breadcrumb nav.
 * Renders both the JSON-LD schema and a visible nav element.
 * Hidden on mobile (375px), visible on tablet+.
 */

import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export default function BreadcrumbSchema({
  items,
  baseUrl = 'https://themeridian.com',
}: BreadcrumbSchemaProps) {
  if (items.length === 0) return null;

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item:
        index < items.length - 1
          ? `${baseUrl}${item.href}`
          : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="breadcrumb-nav"
        style={{
          padding: '0.75rem 1.5rem',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-small, 0.875rem)',
        }}
      >
        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.25rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxWidth: 'var(--container-max, 1200px)',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {index > 0 && (
                  <span
                    style={{
                      color: 'var(--border-default)',
                      marginRight: '0.1rem',
                    }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
                {isLast ? (
                  <span
                    style={{
                      color: 'var(--text-color-primary)',
                      fontWeight: 500,
                    }}
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{ color: 'var(--text-color-muted)' }}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media (max-width: 480px) {
                .breadcrumb-nav { display: none; }
              }
            `,
          }}
        />
      </nav>
    </>
  );
}

/** Generate breadcrumb items from a page path */
export function generateBreadcrumbs(
  pathname: string,
  locale: string,
): BreadcrumbItem[] {
  const home =
    locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : 'Home';

  const items: BreadcrumbItem[] = [
    { name: home, href: `/${locale}` },
  ];

  // Remove locale prefix
  const withoutLocale = pathname
    .replace(new RegExp(`^/${locale}`), '')
    .replace(/^\//, '');
  if (!withoutLocale) return items;

  const segments = withoutLocale.split('/');
  const labelMap: Record<string, Record<string, string>> = {
    menu: { en: 'Menu', zh: '菜单', es: 'Menú' },
    dinner: { en: 'Dinner Menu', zh: '晚餐菜单', es: 'Menú de Cena' },
    cocktails: { en: 'Cocktails', zh: '鸡尾酒', es: 'Cócteles' },
    wine: { en: 'Wine List', zh: '酒单', es: 'Carta de Vinos' },
    'tasting-menu': { en: 'Tasting Menu', zh: '品鉴菜单', es: 'Menú Degustación' },
    seasonal: { en: 'Seasonal', zh: '时令', es: 'De Temporada' },
    about: { en: 'About', zh: '关于', es: 'Acerca de' },
    team: { en: 'Our Team', zh: '我们的团队', es: 'Nuestro Equipo' },
    reservations: { en: 'Reservations', zh: '预订', es: 'Reservaciones' },
    'private-dining': { en: 'Private Dining', zh: '包间', es: 'Comedor Privado' },
    contact: { en: 'Contact', zh: '联系我们', es: 'Contacto' },
    events: { en: 'Events', zh: '活动', es: 'Eventos' },
    gallery: { en: 'Gallery', zh: '画廊', es: 'Galería' },
    blog: { en: 'Blog', zh: '博客', es: 'Blog' },
    press: { en: 'Press', zh: '新闻', es: 'Prensa' },
    faq: { en: 'FAQ', zh: '常见问题', es: 'Preguntas Frecuentes' },
    'gift-cards': { en: 'Gift Cards', zh: '礼品卡', es: 'Tarjetas de Regalo' },
    careers: { en: 'Careers', zh: '招聘', es: 'Carreras' },
  };

  let href = `/${locale}`;
  for (const seg of segments) {
    href += `/${seg}`;
    const label =
      labelMap[seg]?.[locale] ||
      labelMap[seg]?.en ||
      seg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    items.push({ name: label, href });
  }

  return items;
}
