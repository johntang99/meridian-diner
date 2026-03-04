import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import ChefHeroFull from '@/components/sections/ChefHeroFull';
import TeamGrid from '@/components/sections/TeamGrid';
import ReservationsCTA from '@/components/sections/ReservationsCTA';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  shortBio?: string;
  photo?: string;
  photoPortrait?: string;
  credentials?: string[];
  awards?: string[];
  philosophy?: string;
  department?: string;
  featured?: boolean;
  active?: boolean;
  displayOrder?: number;
  social?: Record<string, string>;
}

interface TeamData {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
}

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  return buildPageMetadata({
    siteId,
    locale,
    slug: 'about/team',
    title: locale === 'en'
      ? 'Our Team'
      : locale === 'zh' ? '团队介绍' : 'Nuestro Equipo',
    description: locale === 'en'
      ? 'Meet the passionate people behind every dish, cocktail, and memorable evening at The Meridian.'
      : undefined,
  });
}

export default async function TeamPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const teamData = await loadContent<TeamData>(siteId, locale, 'team/team.json');
  const members = (teamData?.members || []).filter((m) => m.active !== false);

  // Featured chef = first featured culinary member
  const featuredChef = members.find(
    (m) => m.featured && m.department === 'culinary'
  );

  // Remaining team (everyone except the featured chef)
  const restOfTeam = members
    .filter((m) => m.id !== featuredChef?.id)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const lightSectionTextVars = {
    ['--text-color-primary' as any]: 'var(--heading-on-light, #111827)',
    ['--text-color-secondary' as any]: 'var(--body-on-light, #4B5563)',
    ['--text-color-muted' as any]: 'var(--muted-on-light, #6B7280)',
  } as any;

  return (
    <main>
      {/* Compact hero */}
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
          {locale === 'en' ? 'The Team' : locale === 'zh' ? '团队介绍' : 'El Equipo'}
        </h1>
        {teamData?.subtitle && (
          <p
            className="mt-4 mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              color: 'var(--text-color-secondary)',
              maxWidth: '600px',
              lineHeight: 'var(--leading-body, 1.65)',
            }}
          >
            {teamData.subtitle}
          </p>
        )}
      </section>

      {/* Chef Hero — full-bleed */}
      {featuredChef && (
        <ChefHeroFull
          variant="full-bleed"
          photo={featuredChef.photoPortrait || featuredChef.photo}
          name={featuredChef.name}
          role={featuredChef.role}
          philosophy={featuredChef.philosophy}
          credentials={featuredChef.credentials}
          awards={featuredChef.awards}
        />
      )}

      {/* Rest of team grid */}
      {restOfTeam.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', ...lightSectionTextVars }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <TeamGrid variant="3-col" members={restOfTeam} />
          </div>
        </section>
      )}

      {/* CTA */}
      <ReservationsCTA
        variant="split"
        headline={
          locale === 'en'
            ? `Experience ${featuredChef?.name?.split(' ')[0] || 'Our'}'s Menu`
            : locale === 'zh'
            ? '体验我们的菜单'
            : 'Experimenta Nuestro Menú'
        }
        subline={
          locale === 'en'
            ? 'Reserve a table and taste what our team has crafted for the season.'
            : undefined
        }
        ctaLabel={locale === 'en' ? 'Reserve Now' : locale === 'zh' ? '立即预订' : 'Reservar Ahora'}
        ctaHref={`/${locale}/reservations`}
      />
    </main>
  );
}
