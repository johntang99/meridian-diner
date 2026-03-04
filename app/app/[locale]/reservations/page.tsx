import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import ReservationWidgetCustom from '@/components/reservations/ReservationWidgetCustom';
import ReservationWidgetResy from '@/components/reservations/ReservationWidgetResy';
import ReservationWidgetOpenTable from '@/components/reservations/ReservationWidgetOpenTable';
import FAQSection from '@/components/sections/FAQSection';
import PageHero from '@/components/sections/PageHero';

interface ReservationsContent {
  hero: {
    variant?: string;
    headline: string;
    subline?: string;
    image?: string;
  };
  config: {
    advance_days_min?: number;
    advance_days_max?: number;
    party_large_min?: number;
    require_phone?: boolean;
    time_slots?: string[];
    occasions?: string[];
    blackout_dates?: string[];
  };
  policies?: {
    parking?: string;
    dress_code?: string;
    cancellation?: string;
    accessibility?: string;
    large_party?: string;
  };
  privateDining?: {
    headline?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  faq?: Array<{ question: string; answer: string }>;
}

interface SiteFeatures {
  reservation_provider?: 'custom' | 'resy' | 'opentable' | 'phone-only';
  resy_venue_id?: string;
  resy_api_key?: string;
  opentable_id?: string;
  private_dining?: boolean;
  [key: string]: any;
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
    slug: 'reservations',
    title: locale === 'en' ? 'Reservations' : locale === 'zh' ? '预订' : 'Reservaciones',
    description: locale === 'en'
      ? 'Reserve your table at The Meridian. Fine dining on the Upper West Side.'
      : undefined,
  });
}

export default async function ReservationsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<ReservationsContent>('reservations', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Reserve a Table' : locale === 'zh' ? '预订餐位' : 'Reservar Mesa',
  };

  const features = ((siteInfo as any)?.features || {}) as SiteFeatures;
  const provider = features.reservation_provider || 'custom';
  const phone = siteInfo?.phone || '(212) 555-0142';
  const policies = content?.policies;
  const privateDining = content?.privateDining;
  const faq = content?.faq;

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Reservation Widget */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        {provider === 'resy' && (
          <ReservationWidgetResy
            venueId={features.resy_venue_id}
            apiKey={features.resy_api_key}
            phone={phone}
            locale={locale}
          />
        )}
        {provider === 'opentable' && (
          <ReservationWidgetOpenTable
            restaurantId={features.opentable_id}
            phone={phone}
            locale={locale}
          />
        )}
        {provider === 'custom' && content?.config && (
          <ReservationWidgetCustom
            config={content.config}
            locale={locale}
            phone={phone}
            largePartyNote={policies?.large_party}
          />
        )}
        {provider === 'phone-only' && (
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: '480px',
              padding: 'var(--card-pad, 2rem)',
              borderRadius: 'var(--card-radius)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-subheading, 1.25rem)',
                color: 'var(--text-color-primary)',
              }}
            >
              {locale === 'en' ? 'Call to Reserve' : locale === 'zh' ? '致电预订' : 'Llame para Reservar'}
            </p>
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              {phone}
            </a>
            <p
              className="mt-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--text-color-muted)',
              }}
            >
              {locale === 'en'
                ? 'We\'ll confirm your reservation via email.'
                : locale === 'zh'
                ? '我们将通过电子邮件确认您的预订。'
                : 'Confirmaremos su reserva por correo electrónico.'}
            </p>
          </div>
        )}
      </section>

      {/* Info Block */}
      {policies && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {/* Hours */}
              {siteInfo?.hours && (
                <InfoCard
                  title={locale === 'en' ? 'Hours' : locale === 'zh' ? '营业时间' : 'Horario'}
                >
                  {(siteInfo.hours as string[]).map((line: string, i: number) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </InfoCard>
              )}

              {/* Address */}
              <InfoCard
                title={locale === 'en' ? 'Find Us' : locale === 'zh' ? '地址' : 'Ubicación'}
              >
                <p className="mb-1">{siteInfo?.address}</p>
                <p className="mb-3">{siteInfo?.city}, {siteInfo?.state} {siteInfo?.zip}</p>
                {siteInfo?.addressMapUrl && (
                  <a
                    href={siteInfo.addressMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.8rem' }}
                  >
                    {locale === 'en' ? 'Get Directions' : locale === 'zh' ? '获取路线' : 'Cómo Llegar'} →
                  </a>
                )}
              </InfoCard>

              {/* Parking */}
              {policies.parking && (
                <InfoCard
                  title={locale === 'en' ? 'Parking' : locale === 'zh' ? '停车' : 'Estacionamiento'}
                >
                  <p>{policies.parking}</p>
                </InfoCard>
              )}

              {/* Dress Code */}
              {policies.dress_code && (
                <InfoCard
                  title={locale === 'en' ? 'Dress Code' : locale === 'zh' ? '着装要求' : 'Código de Vestimenta'}
                >
                  <p>{policies.dress_code}</p>
                </InfoCard>
              )}

              {/* Cancellation */}
              {policies.cancellation && (
                <InfoCard
                  title={locale === 'en' ? 'Cancellation Policy' : locale === 'zh' ? '取消政策' : 'Política de Cancelación'}
                >
                  <p>{policies.cancellation}</p>
                </InfoCard>
              )}

              {/* Accessibility */}
              {policies.accessibility && (
                <InfoCard
                  title={locale === 'en' ? 'Accessibility' : locale === 'zh' ? '无障碍设施' : 'Accesibilidad'}
                >
                  <p>{policies.accessibility}</p>
                </InfoCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Private Dining CTA */}
      {features.private_dining && privateDining && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: '720px',
              padding: 'var(--card-pad, 2rem)',
              borderRadius: 'var(--card-radius)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {privateDining.headline && (
              <h2
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.25rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {privateDining.headline}
              </h2>
            )}
            {privateDining.description && (
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.875rem)',
                  color: 'var(--text-color-secondary)',
                  lineHeight: 'var(--leading-body, 1.65)',
                }}
              >
                {privateDining.description}
              </p>
            )}
            {privateDining.ctaText && privateDining.ctaLink && (
              <Link
                href={privateDining.ctaLink}
                className="inline-block transition-opacity hover:opacity-80"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--btn-radius)',
                  backgroundColor: 'var(--text-color-accent)',
                  color: '#1A1A1A',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {privateDining.ctaText}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <FAQSection items={faq} locale={locale} />
      )}
    </main>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--card-pad, 1.5rem)',
        borderRadius: 'var(--card-radius)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--border-default)',
      }}
    >
      <h3
        className="mb-3"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-body, 1rem)',
          letterSpacing: 'var(--tracking-heading)',
          color: 'var(--text-color-primary)',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-small, 0.875rem)',
          color: 'var(--text-color-secondary)',
          lineHeight: 'var(--leading-body, 1.65)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
