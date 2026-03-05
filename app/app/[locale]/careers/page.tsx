import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';

interface CareersContent {
  hero: { headline: string; subline?: string };
  values?: Array<{ title: string; description: string }>;
  openings?: Array<{
    title: string;
    department: string;
    type: string;
    description: string;
  }>;
  emptyState?: {
    headline?: string;
    description?: string;
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
    slug: 'careers',
    title: locale === 'en' ? 'Careers' : locale === 'zh' ? '加入我们' : 'Empleo',
  });
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const enSiteInfo = locale !== 'en' ? await loadSiteInfo(siteId, 'en') as SiteInfo | null : siteInfo;
  const features = ((siteInfo as any)?.features || (enSiteInfo as any)?.features || {}) as Record<string, any>;

  if (!features.careers) notFound();

  const content = await loadPageContent<CareersContent>('careers', locale, siteId);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Join Our Team' : locale === 'zh' ? '加入我们' : 'Únete al Equipo',
  };
  const values = content?.values || [];
  const openings = content?.openings || [];
  const emptyState = content?.emptyState;
  const email = siteInfo?.email || 'info@themeridian.com';

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

      {/* Why Work With Us */}
      {values.length > 0 && (
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
              {locale === 'en' ? 'Why Work With Us' : locale === 'zh' ? '为什么加入我们' : 'Por Qué Trabajar Con Nosotros'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {values.map((val) => (
                <div
                  key={val.title}
                  className="text-center"
                  style={{
                    padding: 'var(--card-pad, 1.5rem)',
                    borderRadius: 'var(--radius-base, 0.75rem)',
                    backgroundColor: 'var(--backdrop-secondary)',
                  }}
                >
                  <div
                    className="mx-auto mb-3 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-color-inverse)',
                      fontSize: '1.25rem',
                    }}
                  >
                    ✦
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-body, 1rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {val.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Open Positions */}
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
            className="text-center mb-10"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
            }}
          >
            {locale === 'en' ? 'Open Positions' : locale === 'zh' ? '开放职位' : 'Posiciones Abiertas'}
          </h2>

          {openings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {openings.map((job) => (
                <div
                  key={job.title}
                  style={{
                    padding: 'var(--card-pad, 1.5rem)',
                    borderRadius: 'var(--radius-base, 0.75rem)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-subheading, 1.125rem)',
                        letterSpacing: 'var(--tracking-heading)',
                        color: 'var(--text-color-primary)',
                      }}
                    >
                      {job.title}
                    </h3>
                    <div className="flex gap-2">
                      <span
                        className="px-2 py-0.5"
                        style={{
                          fontSize: '0.7rem',
                          borderRadius: 'var(--badge-radius)',
                          backgroundColor: 'var(--backdrop-secondary)',
                          color: 'var(--text-color-secondary)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {job.department}
                      </span>
                      <span
                        className="px-2 py-0.5"
                        style={{
                          fontSize: '0.7rem',
                          borderRadius: 'var(--badge-radius)',
                          backgroundColor: 'var(--backdrop-secondary)',
                          color: 'var(--text-color-muted)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {job.description}
                  </p>
                  <a
                    href={`mailto:${email}?subject=Application: ${job.title}`}
                    className="inline-block transition-opacity hover:opacity-80"
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: 'var(--radius-base, 0.5rem)',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-color-inverse)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en' ? 'Apply' : locale === 'zh' ? '申请' : 'Aplicar'}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: 'var(--card-pad, 2rem)', borderRadius: 'var(--radius-base, 0.75rem)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--border-default)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-subheading, 1.125rem)', color: 'var(--text-color-primary)', marginBottom: '0.5rem' }}>
                {emptyState?.headline || (locale === 'en' ? 'No open positions right now.' : locale === 'zh' ? '暂无开放职位。' : 'No hay posiciones abiertas.')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: 'var(--text-color-secondary)' }}>
                {emptyState?.description || (locale === 'en' ? "Send us your CV anyway — we'll keep it on file." : locale === 'zh' ? '仍可发送简历，我们会保存备用。' : 'Envíe su CV de todos modos.')}
              </p>
              <a
                href={`mailto:${email}?subject=General Application`}
                className="inline-block mt-4 transition-opacity hover:opacity-80"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-color-inverse)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {locale === 'en' ? 'Send Your CV' : locale === 'zh' ? '发送简历' : 'Enviar CV'}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
