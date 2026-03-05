import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRequestSiteId, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/types';

interface LegalSection {
  heading: string;
  body: string;
  bullets?: string[];
}

interface LegalPageData {
  title: string;
  updatedAt?: string;
  intro?: string;
  sections: LegalSection[];
}

interface LegalPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<LegalPageData>('privacy', locale, siteId);
  return buildPageMetadata({
    siteId,
    locale,
    slug: 'privacy',
    title: content?.title,
    description: content?.intro,
  });
}

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<LegalPageData>('privacy', locale, siteId);

  if (!content) {
    notFound();
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      <section
        className="px-4"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto space-y-6" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <div>
            <h1 className="text-heading font-bold" style={{ color: 'var(--text-color-primary)' }}>{content.title}</h1>
            {content.updatedAt && (
              <p className="mt-2 text-small" style={{ color: 'var(--text-color-muted)' }}>
                {locale === 'en' ? 'Last updated:' : '最近更新：'} {content.updatedAt}
              </p>
            )}
          </div>

          {content.intro && (
            <p className="text-body" style={{ color: 'var(--text-color-secondary)', lineHeight: 'var(--leading-body, 1.65)' }}>
              {content.intro}
            </p>
          )}

          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={`${section.heading}-${index}`} className="space-y-3">
                <h2 className="text-subheading font-semibold" style={{ color: 'var(--text-color-primary)' }}>
                  {section.heading}
                </h2>
                {section.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-body" style={{ color: 'var(--text-color-secondary)', lineHeight: 'var(--leading-body, 1.65)' }}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 text-body" style={{ color: 'var(--text-color-secondary)' }}>
                    {section.bullets.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
