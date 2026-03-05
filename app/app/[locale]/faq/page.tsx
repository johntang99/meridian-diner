import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import FAQSection from '@/components/sections/FAQSection';

interface FAQGroup {
  heading: string;
  items: Array<{ question: string; answer: string }>;
}

interface FAQPageContent {
  hero: { headline: string };
  groups: FAQGroup[];
  contact?: {
    headline?: string;
    ctaText?: string;
    ctaLink?: string;
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
    slug: 'faq',
    title: locale === 'en' ? 'FAQ' : locale === 'zh' ? '常见问题' : 'Preguntas Frecuentes',
  });
}

export default async function FAQPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, siteInfo] = await Promise.all([
    loadPageContent<FAQPageContent>('faq', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Frequently Asked Questions' : locale === 'zh' ? '常见问题' : 'Preguntas Frecuentes',
  };
  const groups = content?.groups || [];
  const contact = content?.contact;

  // Flatten all Q&As for schema.org
  const allItems = groups.flatMap((g) => g.items);

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero */}
      <section
        className="px-6 text-center"
        style={{
          paddingTop: 'calc(var(--section-py) + 2rem)',
          paddingBottom: 'var(--section-py-sm)',
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
      </section>

      {/* FAQ Groups */}
      {groups.map((group, gi) => (
        <section
          key={gi}
          className="px-6"
          style={{
            paddingTop: gi === 0 ? 'var(--section-py)' : 'var(--section-py-sm)',
            paddingBottom: gi === groups.length - 1 ? 'var(--section-py)' : '0',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-subheading, 1.25rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--primary)',
              }}
            >
              {group.heading}
            </h2>
          </div>
          <FAQSection items={group.items} locale={locale} />
        </section>
      ))}

      {/* Contact Block */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '600px' }}>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-subheading, 1.25rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
            }}
          >
            {contact?.headline || (locale === 'en' ? "Can't find what you're looking for?" : locale === 'zh' ? '找不到您需要的答案？' : '¿No encuentra lo que busca?')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-4">
            {siteInfo?.phone && (
              <a
                href={`tel:${siteInfo.phone.replace(/[^\d+]/g, '')}`}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                {siteInfo.phone}
              </a>
            )}
            {siteInfo?.email && (
              <a
                href={`mailto:${siteInfo.email}`}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                {siteInfo.email}
              </a>
            )}
          </div>
          <Link
            href={contact?.ctaLink || `/${locale}/contact`}
            className="inline-block transition-opacity hover:opacity-80"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              backgroundColor: 'var(--primary)',
              color: 'var(--text-color-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {contact?.ctaText || (locale === 'en' ? 'Send Us a Message' : locale === 'zh' ? '给我们发消息' : 'Envíanos un Mensaje')}
          </Link>
        </div>
      </section>
    </main>
  );
}
