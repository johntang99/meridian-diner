import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import ContactForm from '@/components/sections/ContactForm';
import PageHero from '@/components/sections/PageHero';

interface ContactContent {
  hero: {
    variant?: string;
    headline: string;
    subline?: string;
    image?: string;
  };
  info?: {
    phoneLabel?: string;
    emailLabel?: string;
    parkingNote?: string;
    transitNote?: string;
  };
  map?: {
    embedUrl?: string;
  };
  form?: {
    headline?: string;
    successMessage?: string;
  };
}

interface PageProps {
  params: { locale: Locale };
}

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  return buildPageMetadata({
    siteId,
    locale,
    slug: 'contact',
    title: locale === 'en'
      ? 'Contact & Hours — New York'
      : locale === 'zh' ? '联系我们' : 'Contacto',
    description: locale === 'en'
      ? `Visit ${businessName} on the Upper West Side. Hours, directions, and contact information.`
      : undefined,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<ContactContent>('contact', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Find Us' : locale === 'zh' ? '联系我们' : 'Encuéntranos',
  };
  const info = content?.info || {};
  const mapUrl = content?.map?.embedUrl;
  const formConfig = content?.form;
  const hours = (siteInfo?.hours || []) as string[];
  const todayIndex = new Date().getDay();
  const todayName = DAY_NAMES_EN[todayIndex];
  const lightSectionTextVars = {
    ['--text-color-primary' as any]: 'var(--heading-on-light, #111827)',
    ['--text-color-secondary' as any]: 'var(--body-on-light, #4B5563)',
    ['--text-color-muted' as any]: 'var(--muted-on-light, #6B7280)',
  } as any;

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Contact Info + Map */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', ...lightSectionTextVars }}
      >
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2"
          style={{ maxWidth: 'var(--container-max, 1200px)', gap: 'var(--grid-gap, 2rem)' }}
        >
          {/* Left: Contact Info */}
          <div>
            {/* Phone */}
            <div className="mb-8">
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.75rem)',
                  letterSpacing: 'var(--tracking-label, 0.1em)',
                  textTransform: 'uppercase',
                  color: 'var(--text-color-muted)',
                  fontWeight: 600,
                }}
              >
                {info.phoneLabel || (locale === 'en' ? 'Reservations' : locale === 'zh' ? '预订电话' : 'Reservas')}
              </h2>
              <a
                href={`tel:${(siteInfo?.phone || '').replace(/[^\d+]/g, '')}`}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading, 1.75rem)',
                  color: 'var(--text-color-primary)',
                  letterSpacing: 'var(--tracking-heading)',
                }}
              >
                {siteInfo?.phone}
              </a>
            </div>

            {/* Email */}
            <div className="mb-8">
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.75rem)',
                  letterSpacing: 'var(--tracking-label, 0.1em)',
                  textTransform: 'uppercase',
                  color: 'var(--text-color-muted)',
                  fontWeight: 600,
                }}
              >
                {info.emailLabel || (locale === 'en' ? 'General Inquiries' : locale === 'zh' ? '一般咨询' : 'Consultas')}
              </h2>
              <a
                href={`mailto:${siteInfo?.email}`}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                {siteInfo?.email}
              </a>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.75rem)',
                  letterSpacing: 'var(--tracking-label, 0.1em)',
                  textTransform: 'uppercase',
                  color: 'var(--text-color-muted)',
                  fontWeight: 600,
                }}
              >
                {locale === 'en' ? 'Address' : locale === 'zh' ? '地址' : 'Dirección'}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--text-color-primary)',
                  lineHeight: 'var(--leading-body, 1.65)',
                }}
              >
                {siteInfo?.address}<br />
                {siteInfo?.city}, {siteInfo?.state} {siteInfo?.zip}
              </p>
              {siteInfo?.addressMapUrl && (
                <a
                  href={siteInfo.addressMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                  }}
                >
                  {locale === 'en' ? 'Get Directions' : locale === 'zh' ? '获取路线' : 'Cómo Llegar'} →
                </a>
              )}
            </div>

            {/* Hours */}
            {hours.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-small, 0.75rem)',
                    letterSpacing: 'var(--tracking-label, 0.1em)',
                    textTransform: 'uppercase',
                    color: 'var(--text-color-muted)',
                    fontWeight: 600,
                  }}
                >
                  {locale === 'en' ? 'Hours' : locale === 'zh' ? '营业时间' : 'Horario'}
                </h2>
                <div>
                  {hours.map((line, i) => {
                    const isToday = line.toLowerCase().includes(todayName.toLowerCase());
                    return (
                      <div
                        key={i}
                        className="py-2 px-3 -mx-3"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-small, 0.875rem)',
                          color: isToday ? 'var(--text-on-dark-primary)' : 'var(--text-color-primary)',
                          backgroundColor: isToday ? 'var(--backdrop-secondary)' : 'transparent',
                          borderRadius: isToday ? 'var(--btn-radius, 4px)' : undefined,
                          fontWeight: isToday ? 600 : 400,
                        }}
                      >
                        {line}
                        {isToday && (
                          <span
                            className="ml-2"
                            style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}
                          >
                            {locale === 'en' ? 'TODAY' : locale === 'zh' ? '今天' : 'HOY'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Parking/Transit */}
            {(info.parkingNote || info.transitNote) && (
              <div>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-small, 0.75rem)',
                    letterSpacing: 'var(--tracking-label, 0.1em)',
                    textTransform: 'uppercase',
                    color: 'var(--text-color-muted)',
                    fontWeight: 600,
                  }}
                >
                  {locale === 'en' ? 'Getting Here' : locale === 'zh' ? '交通' : 'Cómo Llegar'}
                </h2>
                {info.parkingNote && (
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {info.parkingNote}
                  </p>
                )}
                {info.transitNote && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                    }}
                  >
                    {info.transitNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{
                  border: 0,
                  borderRadius: 'var(--radius-base, 0.75rem)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  height: '400px',
                  borderRadius: 'var(--radius-base, 0.75rem)',
                  backgroundColor: 'var(--backdrop-secondary)',
                  color: 'var(--text-color-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.875rem)',
                }}
              >
                {locale === 'en' ? 'Map coming soon' : locale === 'zh' ? '地图即将上线' : 'Mapa próximamente'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '640px' }}>
          <h2
            className="text-center mb-8"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
            }}
          >
            {formConfig?.headline || (locale === 'en' ? 'Send Us a Message' : locale === 'zh' ? '发送消息' : 'Envíanos un Mensaje')}
          </h2>
          <ContactForm
            locale={locale}
            successMessage={formConfig?.successMessage}
          />
        </div>
      </section>
    </main>
  );
}
