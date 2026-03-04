import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import ReservationsCTA from '@/components/sections/ReservationsCTA';

interface PressPageContent {
  hero: { eyebrow?: string; headline: string };
}

interface PressItem {
  id: string;
  publication: string;
  headline: string;
  award?: string;
  excerpt?: string;
  url?: string;
  date: string;
  isAward: boolean;
  featured?: boolean;
  logo?: string;
  displayOrder: number;
}

interface PressData {
  items: PressItem[];
}

interface PageProps {
  params: { locale: Locale };
}

function formatPressDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  if (locale === 'es') return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  return buildPageMetadata({
    siteId,
    locale,
    slug: 'press',
    title: locale === 'en' ? 'Press & Awards' : locale === 'zh' ? '新闻与奖项' : 'Prensa y Premios',
  });
}

export default async function PressPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const enSiteInfo = locale !== 'en' ? await loadSiteInfo(siteId, 'en') as SiteInfo | null : siteInfo;
  const features = ((siteInfo as any)?.features || (enSiteInfo as any)?.features || {}) as Record<string, any>;

  if (features.press === false) notFound();

  const [pageContent, pressData] = await Promise.all([
    loadPageContent<PressPageContent>('press', locale, siteId),
    loadContent<PressData>(siteId, locale, 'press/press.json'),
  ]);

  const press = pressData || (locale !== 'en' ? await loadContent<PressData>(siteId, 'en', 'press/press.json') : null);

  const hero = pageContent?.hero || {
    headline: locale === 'en' ? 'Recognition' : locale === 'zh' ? '媒体报道' : 'Prensa',
  };

  const allItems = (press?.items || []).sort((a, b) => a.displayOrder - b.displayOrder);
  const awards = allItems.filter((i) => i.isAward);
  const mentions = allItems.filter((i) => !i.isAward).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main>
      {/* Hero */}
      <section
        className="px-6 text-center"
        style={{
          paddingTop: 'calc(var(--section-py) + 2rem)',
          paddingBottom: 'var(--section-py-sm)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        {hero.eyebrow && (
          <p
            className="mb-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: 'var(--tracking-label)',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              fontWeight: 600,
            }}
          >
            {hero.eyebrow}
          </p>
        )}
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
          {hero.headline}
        </h1>
      </section>

      {/* Awards Strip */}
      {awards.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-subheading, 1.25rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-muted)',
                textTransform: 'uppercase',
              }}
            >
              {locale === 'en' ? 'Awards' : locale === 'zh' ? '奖项' : 'Premios'}
            </h2>
            <div className="flex flex-wrap justify-center" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {awards.map((award) => (
                <div
                  key={award.id}
                  className="text-center"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--card-radius)',
                    backgroundColor: 'var(--backdrop-secondary)',
                    border: '1px solid var(--border-default)',
                    minWidth: '200px',
                    maxWidth: '280px',
                  }}
                >
                  {/* Trophy icon */}
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-color-inverse)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}
                  >
                    ★
                  </div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-body, 1rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {award.award || award.headline}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-color-muted)' }}>
                    {award.publication}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                    {new Date(award.date).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Press Mentions */}
      {mentions.length > 0 && (
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
                fontSize: 'var(--text-subheading, 1.25rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-muted)',
                textTransform: 'uppercase',
              }}
            >
              {locale === 'en' ? 'In the Press' : locale === 'zh' ? '媒体报道' : 'En la Prensa'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {mentions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 'var(--card-pad, 1.5rem)',
                    borderRadius: 'var(--card-radius)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.8rem',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.publication}
                  </p>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-body, 1rem)',
                      fontStyle: 'italic',
                      color: 'var(--text-color-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.url && item.url !== '#' ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {item.headline}
                      </a>
                    ) : (
                      item.headline
                    )}
                  </h3>
                  {item.excerpt && (
                    <p
                      className="line-clamp-2 mb-3"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-small, 0.875rem)',
                        color: 'var(--text-color-secondary)',
                        lineHeight: 'var(--leading-body, 1.65)',
                      }}
                    >
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-color-muted)' }}>
                      {formatPressDate(item.date, locale)}
                    </span>
                    {item.url && item.url !== '#' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        {locale === 'en' ? 'Read Article' : locale === 'zh' ? '阅读文章' : 'Leer Artículo'} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservations CTA */}
      <ReservationsCTA
        variant="minimal"
        headline={locale === 'en' ? 'Experience it for yourself' : locale === 'zh' ? '亲身体验' : 'Experiméntalo tú mismo'}
        ctaLabel={locale === 'en' ? 'Make a Reservation' : locale === 'zh' ? '预订' : 'Reservar'}
        ctaHref={`/${locale}/reservations`}
      />
    </main>
  );
}
