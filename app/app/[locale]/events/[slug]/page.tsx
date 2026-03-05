import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import EventCard, { type EventCardData } from '@/components/events/EventCard';
import ReservationsCTA from '@/components/sections/ReservationsCTA';

interface EventItem {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  shortDescription?: string;
  eventType?: string;
  image?: string;
  startDatetime: string;
  endDatetime?: string;
  pricePerPerson?: number | null;
  reservationRequired?: boolean;
  reservationLink?: string;
  capacity?: number;
  featured?: boolean;
  published?: boolean;
  cancelled?: boolean;
}

interface EventsData {
  events: EventItem[];
}

interface PageProps {
  params: { locale: Locale; slug: string };
}

function matchesEventSlug(event: EventItem, slug: string): boolean {
  return event.id === slug || event.slug === slug;
}

function formatFullDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  if (locale === 'es') return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh' || locale === 'es') return d.toLocaleTimeString(locale === 'zh' ? 'zh-CN' : 'es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  let eventsData = await loadContent<EventsData>(siteId, locale, 'events/events.json');
  if (!eventsData && locale !== 'en') eventsData = await loadContent<EventsData>(siteId, 'en', 'events/events.json');

  const event = eventsData?.events?.find((e) => matchesEventSlug(e, slug) && e.published !== false);
  if (!event) return {};

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  return buildPageMetadata({
    siteId,
    locale,
    slug: `events/${slug}`,
    title: event.title,
    description: event.shortDescription || event.description?.substring(0, 160),
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  let eventsData = await loadContent<EventsData>(siteId, locale, 'events/events.json');
  if (!eventsData && locale !== 'en') eventsData = await loadContent<EventsData>(siteId, 'en', 'events/events.json');

  const events = eventsData?.events || [];
  const event = events.find((e) => matchesEventSlug(e, slug) && e.published !== false);

  if (!event) notFound();

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;

  // Related events (same type or next upcoming, exclude current)
  const now = new Date();
  const relatedEvents = events
    .filter((e) => e.id !== event.id && e.published !== false && new Date(e.startDatetime) >= now)
    .sort((a, b) => {
      // Prefer same event type
      const aMatch = a.eventType === event.eventType ? 0 : 1;
      const bMatch = b.eventType === event.eventType ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime();
    })
    .slice(0, 3);

  const priceLabel = event.pricePerPerson
    ? `$${(event.pricePerPerson / 100).toFixed(0)} per person`
    : event.pricePerPerson === null
    ? (locale === 'en' ? 'Complimentary' : locale === 'zh' ? '免费' : 'Gratis')
    : null;

  // Schema.org Event
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || event.shortDescription,
    image: event.image,
    startDate: event.startDatetime,
    endDate: event.endDatetime || undefined,
    eventStatus: event.cancelled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: getSiteDisplayName(siteInfo, 'The Meridian'),
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteInfo?.address,
        addressLocality: siteInfo?.city,
        addressRegion: siteInfo?.state,
        postalCode: siteInfo?.zip,
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: getSiteDisplayName(siteInfo, 'The Meridian'),
    },
    offers: event.pricePerPerson
      ? {
          '@type': 'Offer',
          price: (event.pricePerPerson / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: event.cancelled
            ? 'https://schema.org/Discontinued'
            : 'https://schema.org/InStock',
        }
      : {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
  };

  return (
    <main>
      {/* Schema.org Event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero with event image */}
      <section className="relative w-full overflow-hidden" style={{ height: '55vh', minHeight: '350px' }}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--backdrop-primary) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            {event.eventType && (
              <span
                className="inline-block px-3 py-1 mb-3"
                style={{
                  fontSize: '0.7rem',
                  borderRadius: 'var(--badge-radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-color-inverse)',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {event.eventType.replace(/-/g, ' ')}
              </span>
            )}
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
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Event Info + Description */}
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-5"
          style={{ maxWidth: 'var(--container-max, 1200px)', gap: 'var(--grid-gap, 2rem)' }}
        >
          {/* Description (left, wider) */}
          <div className="lg:col-span-3">
            {/* Cancelled alert */}
            {event.cancelled && (
              <div
                className="mb-6 px-4 py-3"
                style={{
                  borderRadius: 'var(--radius-base, 0.75rem)',
                  backgroundColor: 'rgba(220, 50, 50, 0.1)',
                  border: '1px solid rgba(220, 50, 50, 0.3)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.875rem)',
                  color: 'var(--color-error)',
                  fontWeight: 600,
                }}
              >
                {locale === 'en'
                  ? 'This event has been cancelled.'
                  : locale === 'zh'
                  ? '此活动已取消。'
                  : 'Este evento ha sido cancelado.'}
              </div>
            )}

            {event.description && event.description.split('\n').map((p, i) => (
              <p
                key={i}
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  lineHeight: 'var(--leading-body, 1.65)',
                  color: 'var(--body-on-light, #4B5563)',
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Info card (right, sticky) */}
          <div className="lg:col-span-2">
            <div
              className="lg:sticky lg:top-32"
              style={{
                padding: 'var(--card-pad, 1.5rem)',
                borderRadius: 'var(--radius-base, 0.75rem)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--backdrop-secondary)',
              }}
            >
              {/* Date */}
              <div className="mb-4">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    letterSpacing: 'var(--tracking-label)',
                    textTransform: 'uppercase',
                    color: 'var(--text-on-dark-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {locale === 'en' ? 'Date' : locale === 'zh' ? '日期' : 'Fecha'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-on-dark-primary)', fontWeight: 600 }}>
                  {formatFullDate(event.startDatetime, locale)}
                </p>
              </div>

              {/* Time */}
              <div className="mb-4">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    letterSpacing: 'var(--tracking-label)',
                    textTransform: 'uppercase',
                    color: 'var(--text-on-dark-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {locale === 'en' ? 'Time' : locale === 'zh' ? '时间' : 'Hora'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-on-dark-primary)' }}>
                  {formatTime(event.startDatetime, locale)}
                  {event.endDatetime && ` – ${formatTime(event.endDatetime, locale)}`}
                </p>
              </div>

              {/* Location */}
              <div className="mb-4">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    letterSpacing: 'var(--tracking-label)',
                    textTransform: 'uppercase',
                    color: 'var(--text-on-dark-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {locale === 'en' ? 'Location' : locale === 'zh' ? '地点' : 'Ubicación'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-on-dark-primary)' }}>
                  {getSiteDisplayName(siteInfo, 'The Meridian')}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-on-dark-secondary)' }}>
                  {siteInfo?.address}
                </p>
              </div>

              {/* Price */}
              {priceLabel && (
                <div className="mb-4">
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.7rem',
                      letterSpacing: 'var(--tracking-label)',
                      textTransform: 'uppercase',
                      color: 'var(--text-on-dark-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en' ? 'Price' : locale === 'zh' ? '价格' : 'Precio'}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-on-dark-primary)', fontWeight: 600 }}>
                    {priceLabel}
                  </p>
                </div>
              )}

              {/* Capacity */}
              {event.capacity && (
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text-on-dark-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  {locale === 'en'
                    ? `Limited to ${event.capacity} guests`
                    : locale === 'zh'
                    ? `限${event.capacity}位客人`
                    : `Limitado a ${event.capacity} invitados`}
                </p>
              )}

              {/* CTA */}
              {!event.cancelled ? (
                event.reservationRequired ? (
                  <Link
                    href={event.reservationLink || `/${locale}/reservations`}
                    className="block text-center transition-opacity hover:opacity-80"
                    style={{
                      padding: '0.875rem',
                      borderRadius: 'var(--radius-base, 0.5rem)',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-on-dark-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en' ? 'Reserve Your Spot' : locale === 'zh' ? '预订席位' : 'Reserva Tu Lugar'}
                  </Link>
                ) : null
              ) : (
                <Link
                  href={`/${locale}/events`}
                  className="block text-center"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                  }}
                >
                  {locale === 'en' ? 'View Upcoming Events' : locale === 'zh' ? '查看即将举行的活动' : 'Ver Eventos Próximos'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
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
                color: 'var(--text-color-primary)',
              }}
            >
              {locale === 'en' ? 'You Might Also Enjoy' : locale === 'zh' ? '您可能还会喜欢' : 'También Podría Interesarte'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {relatedEvents.map((e) => (
                <EventCard key={e.id} event={e as EventCardData} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation CTA */}
      {event.reservationRequired && !event.cancelled && (
        <ReservationsCTA
          variant="minimal"
          headline={locale === 'en' ? 'Ready to join us?' : locale === 'zh' ? '准备加入我们？' : '¿Listo para unirte?'}
          ctaLabel={locale === 'en' ? 'Make a Reservation' : locale === 'zh' ? '预订' : 'Reservar'}
          ctaHref={`/${locale}/reservations`}
        />
      )}
    </main>
  );
}
