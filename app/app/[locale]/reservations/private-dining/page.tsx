import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import PrivateDiningForm from '@/components/forms/PrivateDiningForm';

interface PrivateDiningContent {
  hero: {
    eyebrow?: string;
    headline: string;
    body?: string;
    ctaText?: string;
    image?: string;
  };
  spaces: Array<{
    name: string;
    capacity: string;
    description: string;
    features?: string[];
    image?: string;
  }>;
  occasions?: Array<{ label: string; icon?: string }>;
  testimonial?: {
    quote: string;
    author: string;
    occasion?: string;
  };
  form?: {
    headline?: string;
    description?: string;
    occasionOptions?: string[];
    sourceOptions?: string[];
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
    slug: 'reservations/private-dining',
    title: locale === 'en' ? 'Private Dining' : locale === 'zh' ? '私人餐厅' : 'Comedor Privado',
    description: locale === 'en'
      ? 'Host your next event at The Meridian. Private dining for 12 to 40 guests.'
      : undefined,
  });
}

export default async function PrivateDiningPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const enSiteInfo = locale !== 'en' ? await loadSiteInfo(siteId, 'en') as SiteInfo | null : siteInfo;
  const features = ((siteInfo as any)?.features || (enSiteInfo as any)?.features || {}) as Record<string, any>;

  if (!features.private_dining) notFound();

  const content = await loadPageContent<PrivateDiningContent>('private-dining', locale, siteId);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Private Dining' : locale === 'zh' ? '私人餐厅' : 'Comedor Privado',
  };
  const spaces = content?.spaces || [];
  const occasions = content?.occasions || [];
  const testimonial = content?.testimonial;
  const formConfig = content?.form;

  return (
    <main>
      {/* Hero */}
      <section
        className="px-6"
        style={{
          paddingTop: 'calc(var(--section-py) + 2rem)',
          paddingBottom: 'var(--section-py)',
        }}
      >
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center"
          style={{ maxWidth: 'var(--container-max, 1200px)', gap: 'var(--grid-gap, 2rem)' }}
        >
          <div>
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
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display, 3rem)',
                fontWeight: 'var(--weight-display, 400)' as any,
                letterSpacing: 'var(--tracking-display)',
                lineHeight: 'var(--leading-display, 1.1)',
                color: 'var(--primary)',
              }}
            >
              {hero.headline}
            </h1>
            {hero.body && (
              <p
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--primary-light)',
                  lineHeight: 'var(--leading-body, 1.65)',
                  maxWidth: '500px',
                }}
              >
                {hero.body}
              </p>
            )}
            {hero.ctaText && (
              <a
                href="#inquiry-form"
                className="inline-block transition-opacity hover:opacity-80"
                style={{
                  padding: '0.875rem 1.5rem',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-on-dark-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {hero.ctaText}
              </a>
            )}
          </div>
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '3/2', borderRadius: 'var(--radius-base, 0.75rem)' }}
          >
            {hero.image ? (
              <Image src={hero.image} alt={hero.headline} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
            )}
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      {spaces.length > 0 && (
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
                color: 'var(--text-on-dark-primary)',
              }}
            >
              {locale === 'en' ? 'Our Spaces' : locale === 'zh' ? '我们的空间' : 'Nuestros Espacios'}
            </h2>
            <div
              className={`grid grid-cols-1 ${spaces.length > 1 ? 'lg:grid-cols-2' : ''}`}
              style={{ gap: 'var(--grid-gap, 2rem)' }}
            >
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className="overflow-hidden"
                  style={{
                    borderRadius: 'var(--radius-base, 0.75rem)',
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div className="relative" style={{ aspectRatio: '3/2' }}>
                    {space.image ? (
                      <Image src={space.image} alt={space.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
                    )}
                  </div>
                  <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-subheading, 1.25rem)',
                        letterSpacing: 'var(--tracking-heading)',
                        color: 'var(--text-on-dark-primary)',
                      }}
                    >
                      {space.name}
                    </h3>
                    <p className="mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-on-dark-primary)', fontWeight: 600 }}>
                      {locale === 'en' ? 'Up to' : locale === 'zh' ? '最多' : 'Hasta'} {space.capacity}
                    </p>
                    <p
                      className="mb-4"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-small, 0.875rem)',
                        color: 'var(--text-on-dark-secondary)',
                        lineHeight: 'var(--leading-body, 1.65)',
                      }}
                    >
                      {space.description}
                    </p>
                    {space.features && space.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {space.features.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5"
                            style={{
                              fontSize: '0.7rem',
                              borderRadius: 'var(--badge-radius)',
                              backgroundColor: 'var(--backdrop-secondary)',
                              color: 'var(--text-on-dark-secondary)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasions */}
      {occasions.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--primary)',
              }}
            >
              {locale === 'en' ? 'Perfect for Every Occasion' : locale === 'zh' ? '适合每一个场合' : 'Perfecto para Cada Ocasión'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {occasions.map((occ) => (
                <div key={occ.label} className="text-center">
                  <div
                    className="mx-auto mb-3 flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--backdrop-secondary)',
                      color: 'var(--primary)',
                      fontSize: '1.25rem',
                    }}
                  >
                    ✦
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--primary)',
                      fontWeight: 600,
                    }}
                  >
                    {occ.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto text-center" style={{ maxWidth: '720px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--primary)', lineHeight: 1, marginBottom: '1rem', fontFamily: 'serif' }}>
              &ldquo;
            </div>
            <blockquote
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                fontStyle: 'italic',
                color: 'var(--text-on-dark-secondary)',
                lineHeight: 'var(--leading-body, 1.65)',
                marginBottom: '1.5rem',
              }}
            >
              {testimonial.quote}
            </blockquote>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-on-dark-primary)' }}>
              — {testimonial.author}
            </p>
            {testimonial.occasion && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-on-dark-secondary)' }}>
                {testimonial.occasion}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <PrivateDiningForm
            spaces={spaces}
            occasionOptions={formConfig?.occasionOptions}
            sourceOptions={formConfig?.sourceOptions}
            headline={formConfig?.headline}
            description={formConfig?.description}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}
