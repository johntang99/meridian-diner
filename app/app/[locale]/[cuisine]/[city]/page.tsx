import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import {
  findProgrammaticPage,
  isReservedRoute,
  programmaticCatalog,
} from '@/lib/seo/programmatic-catalog';

interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  featured?: boolean;
  available?: boolean;
}

interface MenuData {
  items: MenuItemData[];
}

interface EventItem {
  id: string;
  title: string;
  shortDescription?: string;
  startDatetime: string;
  published?: boolean;
  cancelled?: boolean;
}

interface EventsData {
  events: EventItem[];
}

interface PageProps {
  params: { locale: Locale; cuisine: string; city: string };
}

export const revalidate = 86400; // 24 hours ISR

export async function generateStaticParams() {
  const params: { locale: string; cuisine: string; city: string }[] = [];
  const locales = ['en', 'zh', 'es'] as const;

  for (const locale of locales) {
    for (const page of programmaticCatalog) {
      params.push({
        locale,
        cuisine: page.cuisineSlug,
        city: page.citySlug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, cuisine, city } = params;

  // Collision guard
  if (isReservedRoute(cuisine)) return {};

  const page = findProgrammaticPage(cuisine, city);
  if (!page) return {};

  const siteId = await getRequestSiteId();
  const title = `${page.cuisineLabel} in ${page.cityLabel}`;
  const description =
    page.uniqueIntro.length > 160
      ? page.uniqueIntro.slice(0, 157) + '...'
      : page.uniqueIntro;

  return buildPageMetadata({
    siteId,
    locale,
    slug: `${cuisine}/${city}`,
    title,
    description,
    pathWithoutLocale: `/${cuisine}/${city}`,
  });
}

export default async function ProgrammaticSEOPage({ params }: PageProps) {
  const { locale, cuisine, city } = params;

  // Collision guard — don't swallow existing routes
  if (isReservedRoute(cuisine)) notFound();

  const page = findProgrammaticPage(cuisine, city);
  if (!page) notFound();

  const siteId = await getRequestSiteId();

  // Load site info, menu items, and events in parallel
  const [siteInfo, menuData, eventsData] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    loadContent<MenuData>(siteId, 'en', 'menu/dinner.json'),
    loadContent<EventsData>(siteId, 'en', 'events/events.json'),
  ]);

  // Get 3 featured dinner menu items
  const featuredItems = (menuData?.items || [])
    .filter((item) => item.featured && item.available !== false)
    .slice(0, 3);

  // Get 3 upcoming events
  const now = new Date().toISOString();
  const upcomingEvents = (eventsData?.events || [])
    .filter(
      (e) =>
        e.published !== false &&
        !e.cancelled &&
        e.startDatetime > now,
    )
    .sort((a, b) => a.startDatetime.localeCompare(b.startDatetime))
    .slice(0, 3);

  const phone = siteInfo?.phone || '(212) 555-0142';
  const address = siteInfo?.address || '142 West 72nd Street';
  const cityName = siteInfo?.city || 'New York';
  const state = siteInfo?.state || 'NY';
  const zip = siteInfo?.zip || '10023';
  const hours = (siteInfo?.hours as string[]) || [
    'Tuesday – Thursday: 5:00 PM – 10:00 PM',
    'Friday – Saturday: 5:00 PM – 11:00 PM',
    'Sunday: 5:00 PM – 9:30 PM',
    'Monday: Closed',
  ];
  const restaurantName =
    (siteInfo as any)?.businessName || 'The Meridian';

  const heroHeadline = `${page.cuisineLabel} in ${page.cityLabel}`;

  // Labels by locale
  const labels = {
    viewMenu:
      locale === 'en'
        ? 'View Menu'
        : locale === 'zh'
          ? '查看菜单'
          : 'Ver Menú',
    reserveTable:
      locale === 'en'
        ? 'Reserve a Table'
        : locale === 'zh'
          ? '预订座位'
          : 'Reservar Mesa',
    aboutUs:
      locale === 'en'
        ? `About ${restaurantName}`
        : locale === 'zh'
          ? `关于${restaurantName}`
          : `Sobre ${restaurantName}`,
    menuSnapshot:
      locale === 'en'
        ? `Taste of Our ${page.cuisineLabel} Menu`
        : locale === 'zh'
          ? `品味我们的${page.cuisineLabel}菜单`
          : `Prueba Nuestro Menú de ${page.cuisineLabel}`,
    viewFullMenu:
      locale === 'en'
        ? 'View Full Menu →'
        : locale === 'zh'
          ? '查看完整菜单 →'
          : 'Ver Menú Completo →',
    visitUs:
      locale === 'en'
        ? `Visit Us in ${page.cityLabel}`
        : locale === 'zh'
          ? `在${page.cityLabel}访问我们`
          : `Visítenos en ${page.cityLabel}`,
    locatedIn: page.neighborhood
      ? locale === 'en'
        ? `Located in the heart of ${page.neighborhood}`
        : locale === 'zh'
          ? `位于${page.neighborhood}中心`
          : `Ubicado en el corazón de ${page.neighborhood}`
      : null,
    upcomingEvents:
      locale === 'en'
        ? 'Upcoming Events'
        : locale === 'zh'
          ? '即将举行的活动'
          : 'Próximos Eventos',
    reserveYourTable:
      locale === 'en'
        ? 'Reserve Your Table'
        : locale === 'zh'
          ? '预订您的餐桌'
          : 'Reserve Su Mesa',
    reserveDesc:
      locale === 'en'
        ? `Experience ${page.cuisineLabel.toLowerCase()} at its finest. Make a reservation at The Meridian today.`
        : locale === 'zh'
          ? `体验最好的${page.cuisineLabel}。立即在The Meridian预订。`
          : `Experimente lo mejor de ${page.cuisineLabel.toLowerCase()}. Haga una reserva en The Meridian hoy.`,
  };

  // Schema.org Restaurant for this programmatic page
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurantName,
    servesCuisine: page.cuisineLabel,
    areaServed: {
      '@type': 'City',
      name: page.cityLabel,
    },
    url: `https://themeridian.com/${locale}/${page.cuisineSlug}/${page.citySlug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: cityName,
      addressRegion: state,
      postalCode: zip,
      addressCountry: 'US',
    },
    telephone: phone,
    hasMenu: `https://themeridian.com/${locale}/menu`,
    acceptsReservations: true,
    priceRange: '$$$$',
  };

  return (
    <main>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* SECTION 1 — LocalSEOHero */}
      <section
        className="px-6 text-center"
        style={{
          paddingTop: 'calc(var(--section-py) + 3rem)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
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
          {heroHeadline}
        </h1>
        <p
          className="mt-4 mx-auto"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body, 1rem)',
            color: 'var(--text-color-secondary)',
            maxWidth: '640px',
            lineHeight: 'var(--leading-body, 1.65)',
          }}
        >
          {page.uniqueIntro}
        </p>
        <div
          className="flex flex-wrap justify-center mt-8"
          style={{ gap: '1rem' }}
        >
          <Link
            href={`/${locale}/menu`}
            className="transition-opacity hover:opacity-80"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              backgroundColor: 'var(--primary)',
              color: 'var(--text-color-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {labels.viewMenu}
          </Link>
          <Link
            href={`/${locale}/reservations`}
            className="transition-opacity hover:opacity-80"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'transparent',
              color: 'var(--text-color-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {labels.reserveTable}
          </Link>
        </div>
      </section>

      {/* SECTION 2 — UniqueContent */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
            }}
          >
            {labels.aboutUs}
          </h2>
          {page.uniqueBody.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className={i > 0 ? 'mt-4' : ''}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                color: 'var(--text-color-secondary)',
                lineHeight: 'var(--leading-body, 1.65)',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* SECTION 3 — MenuSnapshot (3 featured items) */}
      {featuredItems.length > 0 && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-primary)',
              }}
            >
              {labels.menuSnapshot}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-default)',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-subheading, 1.125rem)',
                        letterSpacing: 'var(--tracking-heading)',
                        color: 'var(--text-color-primary)',
                      }}
                    >
                      {item.name}
                    </p>
                    {item.description && (
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-small, 0.875rem)',
                          color: 'var(--text-color-muted)',
                          lineHeight: 'var(--leading-body, 1.65)',
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.price != null && (
                    <p
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      ${(item.price / 100).toFixed(0)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href={`/${locale}/menu/dinner`}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                {labels.viewFullMenu}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4 — Location + Hours */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <h2
            className="text-center mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
            }}
          >
            {labels.visitUs}
          </h2>
          {labels.locatedIn && (
            <p
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                color: 'var(--text-color-secondary)',
              }}
            >
              {labels.locatedIn}
            </p>
          )}
          <div
            className="grid grid-cols-1 md:grid-cols-2 mt-8"
            style={{ gap: 'var(--grid-gap, 2rem)' }}
          >
            {/* Address */}
            <div>
              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.125rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {locale === 'en' ? 'Address' : locale === 'zh' ? '地址' : 'Dirección'}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--text-color-secondary)',
                  lineHeight: 'var(--leading-body, 1.65)',
                }}
              >
                {address}
                <br />
                {cityName}, {state} {zip}
              </p>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="mt-2 inline-block"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                {phone}
              </a>
            </div>
            {/* Hours */}
            <div>
              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.125rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {locale === 'en' ? 'Hours' : locale === 'zh' ? '营业时间' : 'Horario'}
              </h3>
              {hours.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-small, 0.875rem)',
                    color: 'var(--text-color-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Upcoming Events (trust signal) */}
      {upcomingEvents.length > 0 && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-primary)',
              }}
            >
              {labels.upcomingEvents}
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 'var(--grid-gap, 1.5rem)' }}
            >
              {upcomingEvents.map((event) => {
                const date = new Date(event.startDatetime);
                const dateStr = date.toLocaleDateString(
                  locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : 'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' },
                );
                return (
                  <div
                    key={event.id}
                    style={{
                      padding: 'var(--card-pad, 1.5rem)',
                      borderRadius: 'var(--radius-base, 0.75rem)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {dateStr}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-subheading, 1.125rem)',
                        letterSpacing: 'var(--tracking-heading)',
                        color: 'var(--text-color-primary)',
                      }}
                    >
                      {event.title}
                    </h3>
                    {event.shortDescription && (
                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-small, 0.875rem)',
                          color: 'var(--text-color-secondary)',
                          lineHeight: 'var(--leading-body, 1.65)',
                        }}
                      >
                        {event.shortDescription}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6 — ReservationsCTA */}
      <section
        className="px-6 text-center"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--primary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display, 3rem)',
              fontWeight: 'var(--weight-display, 400)' as any,
              letterSpacing: 'var(--tracking-display)',
              lineHeight: 'var(--leading-display, 1.1)',
              color: 'var(--text-color-inverse)',
            }}
          >
            {labels.reserveYourTable}
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              color: 'var(--text-color-inverse)',
              opacity: 0.9,
            }}
          >
            {labels.reserveDesc}
          </p>
          <Link
            href={`/${locale}/reservations`}
            className="transition-opacity hover:opacity-80 inline-block"
            style={{
              padding: '0.75rem 2.5rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {labels.reserveTable}
          </Link>
        </div>
      </section>

      {/* Internal links footer — explore by cuisine */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '720px' }}>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-small, 0.875rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-muted)',
              textTransform: 'uppercase' as const,
            }}
          >
            {locale === 'en'
              ? 'Explore The Meridian'
              : locale === 'zh'
                ? '探索 The Meridian'
                : 'Explora The Meridian'}
          </p>
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '0.5rem 1rem' }}
          >
            <Link
              href={`/${locale}/menu`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--primary)',
              }}
            >
              {labels.viewMenu}
            </Link>
            <Link
              href={`/${locale}/reservations`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--primary)',
              }}
            >
              {labels.reserveTable}
            </Link>
            <Link
              href={`/${locale}/about`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--primary)',
              }}
            >
              {locale === 'en'
                ? 'About Us'
                : locale === 'zh'
                  ? '关于我们'
                  : 'Sobre Nosotros'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--primary)',
              }}
            >
              {locale === 'en'
                ? 'Contact'
                : locale === 'zh'
                  ? '联系我们'
                  : 'Contacto'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
