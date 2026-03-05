import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import EventCard, { type EventCardData } from '@/components/events/EventCard';
import PastEventsToggle from '@/components/events/PastEventsToggle';
import PageHero from '@/components/sections/PageHero';

interface EventsPageContent {
  hero: { variant?: string; headline: string; subline?: string; image?: string };
  privateDiningCta?: {
    headline?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  eventType?: string;
  image?: string;
  startDatetime: string;
  endDatetime?: string;
  pricePerPerson?: number | null;
  reservationRequired?: boolean;
  capacity?: number;
  featured?: boolean;
  published?: boolean;
  cancelled?: boolean;
}

interface EventsData {
  events: EventItem[];
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
    slug: 'events',
    title: locale === 'en' ? 'Events' : locale === 'zh' ? '活动' : 'Eventos',
    description: locale === 'en'
      ? 'Wine dinners, chef\'s tables, live music, and seasonal celebrations at The Meridian.'
      : undefined,
  });
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [pageContent, eventsData, siteInfo] = await Promise.all([
    loadPageContent<EventsPageContent>('events', locale, siteId),
    loadContent<EventsData>(siteId, locale, 'events/events.json'),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  // Fallback to English for events data
  let events = eventsData?.events || [];
  if (events.length === 0 && locale !== 'en') {
    const fallback = await loadContent<EventsData>(siteId, 'en', 'events/events.json');
    events = fallback?.events || [];
  }

  const now = new Date();
  const published = events.filter((e) => e.published !== false);

  const upcoming = published
    .filter((e) => new Date(e.startDatetime) >= now)
    .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());

  const past = published
    .filter((e) => new Date(e.startDatetime) < now)
    .sort((a, b) => new Date(b.startDatetime).getTime() - new Date(a.startDatetime).getTime())
    .slice(0, 6);

  const hero = pageContent?.hero || {
    headline: locale === 'en' ? 'Events' : locale === 'zh' ? '活动' : 'Eventos',
  };

  const features = (siteInfo as any)?.features || {};
  const privateDiningCta = pageContent?.privateDiningCta;

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Upcoming Events */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event as EventCardData} locale={locale} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-color-secondary)',
              }}
            >
              <p className="mb-4" style={{ fontSize: 'var(--text-body, 1rem)' }}>
                {locale === 'en'
                  ? 'No upcoming events at this time. Check back soon — we have something in the works.'
                  : locale === 'zh'
                  ? '目前没有即将举行的活动。请稍后再来查看。'
                  : 'No hay eventos próximos en este momento. Vuelve pronto.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <PastEventsToggle events={past as EventCardData[]} locale={locale} count={past.length} />
      )}

      {/* Private Dining CTA */}
      {features.private_dining && privateDiningCta && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: '720px',
              padding: 'var(--card-pad, 2rem)',
              borderRadius: 'var(--radius-base, 0.75rem)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {privateDiningCta.headline && (
              <h2
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.25rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {privateDiningCta.headline}
              </h2>
            )}
            {privateDiningCta.description && (
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.875rem)',
                  color: 'var(--text-color-secondary)',
                  lineHeight: 'var(--leading-body, 1.65)',
                }}
              >
                {privateDiningCta.description}
              </p>
            )}
            {privateDiningCta.ctaText && privateDiningCta.ctaLink && (
              <Link
                href={privateDiningCta.ctaLink}
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
                {privateDiningCta.ctaText}
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
