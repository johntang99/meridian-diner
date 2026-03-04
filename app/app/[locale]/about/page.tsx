import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import ReservationsCTA from '@/components/sections/ReservationsCTA';
import PageHero from '@/components/sections/PageHero';

interface AboutPageContent {
  hero: {
    variant?:
      | 'split-ambiance'
      | 'centered'
      | 'split-photo-right'
      | 'split-photo-left'
      | 'photo-background'
      | 'overlap'
      | 'video-background'
      | 'gallery-background';
    image?: string;
    eyebrow?: string;
    headline: string;
    subline?: string;
  };
  story?: {
    leadParagraph: string;
    body: string;
    pullQuote?: string;
    pullQuoteAttribution?: string;
  };
  values?: {
    headline?: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  teamPreview?: {
    headline?: string;
    subline?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  awards?: {
    headline?: string;
    items: Array<{
      name: string;
      award: string;
      year: string;
    }>;
  };
  cta?: {
    variant?: string;
    headline: string;
    subline?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
}

interface TeamData {
  members: Array<{
    id: string;
    name: string;
    role: string;
    shortBio?: string;
    photo?: string;
    credentials?: string[];
    featured?: boolean;
    active?: boolean;
    displayOrder?: number;
  }>;
}

interface PageProps {
  params: { locale: Locale };
}

const valueIcons: Record<string, string> = {
  leaf: '🌿',
  globe: '🌍',
  heart: '❤',
  fire: '🔥',
  star: '⭐',
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  return buildPageMetadata({
    siteId,
    locale,
    slug: 'about',
    title: locale === 'en'
      ? 'About Us | Contemporary American in New York'
      : locale === 'zh' ? '关于我们' : 'Sobre Nosotros',
    description: locale === 'en'
      ? 'The story behind The Meridian — seasonal American cuisine, global technique, and genuine hospitality on the Upper West Side.'
      : undefined,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, teamData] = await Promise.all([
    loadPageContent<AboutPageContent>('about', locale, siteId),
    loadContent<TeamData>(siteId, locale, 'team/team.json'),
  ]);

  const hero = content?.hero || {
    headline: locale === 'en' ? 'Our Story' : locale === 'zh' ? '我们的故事' : 'Nuestra Historia',
  };
  const story = content?.story;
  const values = content?.values;
  const teamPreview = content?.teamPreview;
  const awards = content?.awards;
  const cta = content?.cta;

  const featuredMembers = (teamData?.members || [])
    .filter((m) => m.featured && m.active !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 3);
  const lightSectionTextVars = {
    ['--text-color-primary' as any]: 'var(--heading-on-light, #111827)',
    ['--text-color-secondary' as any]: 'var(--body-on-light, #4B5563)',
    ['--text-color-muted' as any]: 'var(--muted-on-light, #6B7280)',
  } as any;

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Story Section */}
      {story && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', ...lightSectionTextVars }}
        >
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            {/* Lead paragraph */}
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-subheading, 1.25rem)',
                lineHeight: 'var(--leading-body, 1.65)',
                color: 'var(--text-color-primary)',
              }}
            >
              {story.leadParagraph}
            </p>

            {/* Pull quote */}
            {story.pullQuote && (
              <blockquote
                className="my-10 mx-0"
                style={{
                  paddingLeft: '2rem',
                  borderLeft: '3px solid var(--primary)',
                  maxWidth: '800px',
                }}
              >
                <p
                  className="italic"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-subheading, 1.25rem)',
                    lineHeight: 'var(--leading-heading, 1.3)',
                    color: 'var(--text-color-primary)',
                  }}
                >
                  &ldquo;{story.pullQuote}&rdquo;
                </p>
                {story.pullQuoteAttribution && (
                  <footer
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-muted)',
                    }}
                  >
                    — {story.pullQuoteAttribution}
                  </footer>
                )}
              </blockquote>
            )}

            {/* Body paragraphs */}
            {story.body.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  lineHeight: 'var(--leading-body, 1.65)',
                  color: 'var(--text-color-secondary)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      {values && values.items.length > 0 && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            {values.headline && (
              <h2
                className="text-center mb-12"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading, 2rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {values.headline}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {values.items.map((val, i) => (
                <div
                  key={i}
                  className="text-center"
                  style={{
                    padding: 'var(--card-pad, 2rem)',
                    borderRadius: 'var(--card-radius)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <span className="inline-block mb-4" style={{ fontSize: '2rem' }} aria-hidden="true">
                    {valueIcons[val.icon] || '✦'}
                  </span>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-subheading, 1.125rem)',
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

      {/* Team Preview */}
      {teamPreview && featuredMembers.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', ...lightSectionTextVars }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            {(teamPreview.headline || teamPreview.subline) && (
              <div className="text-center mb-12">
                {teamPreview.headline && (
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-heading, 2rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {teamPreview.headline}
                  </h2>
                )}
                {teamPreview.subline && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body, 1rem)',
                      color: 'var(--text-color-secondary)',
                    }}
                  >
                    {teamPreview.subline}
                  </p>
                )}
              </div>
            )}

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 'var(--grid-gap, 1.5rem)' }}
            >
              {featuredMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div
                    className="relative mx-auto mb-4 overflow-hidden"
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: 'var(--card-radius)',
                      backgroundColor: 'var(--backdrop-secondary)',
                    }}
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: 'var(--text-color-muted)', fontSize: '2.5rem', opacity: 0.3 }}
                      >
                        &#x1f464;
                      </div>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-subheading, 1.125rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--primary)',
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              ))}
            </div>

            {teamPreview.ctaText && teamPreview.ctaLink && (
              <div className="text-center mt-10">
                <Link
                  href={teamPreview.ctaLink}
                  className="inline-flex items-center gap-2 transition-all hover:opacity-80"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: 'var(--tracking-label)',
                    color: 'var(--primary)',
                  }}
                >
                  {teamPreview.ctaText} →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Awards */}
      {awards && awards.items.length > 0 && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            {awards.headline && (
              <h2
                className="text-center mb-10"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading, 2rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {awards.headline}
              </h2>
            )}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ gap: 'var(--grid-gap, 1.5rem)' }}
            >
              {awards.items.map((award, i) => (
                <div
                  key={i}
                  className="text-center"
                  style={{
                    padding: 'var(--card-pad, 1.5rem)',
                    borderRadius: 'var(--card-radius)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-subheading, 1rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {award.award}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: 'var(--text-color-muted)',
                    }}
                  >
                    {award.name} · {award.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta && (
        <ReservationsCTA
          variant={cta.variant === 'minimal' ? 'minimal' : 'banner'}
          headline={cta.headline}
          subline={cta.subline}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
        />
      )}
    </main>
  );
}
