import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';

interface GiftCardsContent {
  hero: { headline: string; subline?: string };
  amounts: number[];
  customRange?: { min: number; max: number };
  purchaseNote?: string;
  inPersonNote?: string;
  giftingIdeas?: Array<{ title: string; description: string }>;
  redemption?: {
    steps?: string[];
    validity?: string;
    noExchange?: string;
  };
}

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  return buildPageMetadata({
    siteId,
    locale,
    slug: 'gift-cards',
    title: locale === 'en' ? 'Gift Cards' : locale === 'zh' ? '礼品卡' : 'Tarjetas de Regalo',
  });
}

export default async function GiftCardsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  // Features are only defined in en/site.json — always load from English
  const enSiteInfo = locale !== 'en' ? await loadSiteInfo(siteId, 'en') as SiteInfo | null : siteInfo;
  const features = ((siteInfo as any)?.features || (enSiteInfo as any)?.features || {}) as Record<string, any>;

  if (!features.gift_cards) notFound();

  const content = await loadPageContent<GiftCardsContent>('gift-cards', locale, siteId);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Gift Cards' : locale === 'zh' ? '礼品卡' : 'Tarjetas de Regalo',
  };
  const amounts = content?.amounts || [50, 100, 200];
  const customRange = content?.customRange || { min: 25, max: 500 };
  const phone = siteInfo?.phone || '(212) 555-0142';

  return (
    <main>
      {/* Hero */}
      <section
        className="px-6 text-center"
        style={{
          paddingTop: 'calc(var(--section-py) + 2rem)',
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
          {hero.headline}
        </h1>
        {hero.subline && (
          <p
            className="mt-4 mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              color: 'var(--text-color-secondary)',
              maxWidth: '600px',
            }}
          >
            {hero.subline}
          </p>
        )}
      </section>

      {/* Gift Card Options */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '720px' }}>
          <div className="flex flex-wrap justify-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            {amounts.map((amount) => (
              <div
                key={amount}
                style={{
                  padding: '1.5rem 2rem',
                  borderRadius: 'var(--card-radius)',
                  border: '2px solid var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                  minWidth: '120px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading, 2rem)', color: 'var(--primary)', fontWeight: 600 }}>
                  ${amount}
                </p>
              </div>
            ))}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderRadius: 'var(--card-radius)',
                border: '2px dashed var(--border-default)',
                backgroundColor: 'var(--color-surface)',
                minWidth: '120px',
              }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-subheading, 1.25rem)', color: 'var(--text-color-secondary)' }}>
                {locale === 'en' ? 'Custom' : locale === 'zh' ? '自定义' : 'Personalizado'}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-color-muted)' }}>
                ${customRange.min}–${customRange.max}
              </p>
            </div>
          </div>

          {content?.purchaseNote && (
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                color: 'var(--text-color-secondary)',
              }}
            >
              {content.purchaseNote}
            </p>
          )}
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}
          >
            {phone}
          </a>
          {content?.inPersonNote && (
            <p
              className="mt-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--text-color-muted)',
                fontStyle: 'italic',
              }}
            >
              {content.inPersonNote}
            </p>
          )}
        </div>
      </section>

      {/* Gifting Ideas */}
      {content?.giftingIdeas && content.giftingIdeas.length > 0 && (
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
              className="text-center mb-10"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-primary)',
              }}
            >
              {locale === 'en' ? 'Gift Ideas' : locale === 'zh' ? '送礼灵感' : 'Ideas para Regalar'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {content.giftingIdeas.map((idea) => (
                <div
                  key={idea.title}
                  className="text-center"
                  style={{
                    padding: 'var(--card-pad, 1.5rem)',
                    borderRadius: 'var(--card-radius)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-subheading, 1.125rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {idea.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Redemption Info */}
      {content?.redemption && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div className="mx-auto text-center" style={{ maxWidth: '600px' }}>
            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--text-color-primary)',
              }}
            >
              {locale === 'en' ? 'How to Redeem' : locale === 'zh' ? '如何使用' : 'Cómo Usar'}
            </h2>
            {content.redemption.steps?.map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-4 text-left">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-color-inverse)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body, 1rem)',
                    color: 'var(--text-color-secondary)',
                    lineHeight: 'var(--leading-body, 1.65)',
                    paddingTop: '4px',
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
            <div className="mt-8" style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.5rem' }}>
              {content.redemption.validity && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-color-muted)', marginBottom: '0.25rem' }}>
                  {content.redemption.validity}
                </p>
              )}
              {content.redemption.noExchange && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-color-muted)' }}>
                  {content.redemption.noExchange}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
