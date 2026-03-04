import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import GalleryClient from '@/components/gallery/GalleryClient';
import type { GalleryItemData } from '@/components/gallery/GalleryMasonry';
import PageHero from '@/components/sections/PageHero';

interface GalleryPageContent {
  hero: { variant?: string; headline: string; subline?: string; image?: string };
  cta?: {
    headline?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface GalleryData {
  title?: string;
  subtitle?: string;
  items: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
    category: string;
    featured?: boolean;
    displayOrder: number;
  }>;
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
    slug: 'gallery',
    title: locale === 'en' ? 'Gallery' : locale === 'zh' ? '图库' : 'Galería',
    description: locale === 'en'
      ? 'A visual journey through The Meridian — our dishes, spaces, and moments.'
      : undefined,
  });
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [pageContent, galleryData, siteInfoRaw] = await Promise.all([
    loadPageContent<GalleryPageContent>('gallery', locale, siteId),
    loadContent<GalleryData>(siteId, locale, 'gallery/gallery.json'),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);
  const siteInfo = siteInfoRaw || null;
  const enSiteInfo = locale !== 'en' ? await loadSiteInfo(siteId, 'en') as SiteInfo | null : siteInfo;

  // Locale fallback
  const gallery = galleryData || (locale !== 'en' ? await loadContent<GalleryData>(siteId, 'en', 'gallery/gallery.json') : null);

  const hero = pageContent?.hero || {
    headline: locale === 'en' ? 'Gallery' : locale === 'zh' ? '图库' : 'Galería',
    subline: locale === 'en' ? 'A look inside The Meridian.' : undefined,
  };

  const items: GalleryItemData[] = (gallery?.items || [])
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
      caption: item.caption,
      category: item.category,
      featured: item.featured,
      displayOrder: item.displayOrder,
    }));

  const features = ((siteInfo as any)?.features || (enSiteInfo as any)?.features || {}) as Record<string, any>;
  const cta = pageContent?.cta;

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Gallery Grid + Lightbox */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <GalleryClient items={items} locale={locale} />
        </div>
      </section>

      {/* Private Dining CTA */}
      {features.private_dining && cta && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div
            className="mx-auto text-center"
            style={{ maxWidth: '720px' }}
          >
            {cta.headline && (
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--text-color-primary)',
                  lineHeight: 'var(--leading-body, 1.65)',
                  fontStyle: 'italic',
                }}
              >
                {cta.headline}
              </p>
            )}
            {cta.ctaText && cta.ctaLink && (
              <Link
                href={cta.ctaLink}
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
                {cta.ctaText}
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
