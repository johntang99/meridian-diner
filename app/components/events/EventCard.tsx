import Image from 'next/image';
import Link from 'next/link';

export interface EventCardData {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  eventType?: string;
  image?: string;
  startDatetime: string;
  endDatetime?: string;
  pricePerPerson?: number | null;
  reservationRequired?: boolean;
  capacity?: number;
  cancelled?: boolean;
  slug?: string;
}

interface EventCardProps {
  event: EventCardData;
  locale?: string;
  isPast?: boolean;
}

function formatEventDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') {
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' })
      + ' · ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (locale === 'es') {
    return d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })
      + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDayMonth(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  };
}

function eventSlug(event: EventCardData): string {
  return event.slug || event.id;
}

export default function EventCard({ event, locale = 'en', isPast = false }: EventCardProps) {
  const { day, month } = formatDayMonth(event.startDatetime);
  const priceLabel = event.pricePerPerson
    ? `From $${(event.pricePerPerson / 100).toFixed(0)}/person`
    : event.pricePerPerson === null
    ? (locale === 'en' ? 'Complimentary' : locale === 'zh' ? '免费' : 'Gratis')
    : null;

  return (
    <Link
      href={`/${locale}/events/${eventSlug(event)}`}
      className="group block overflow-hidden transition-all"
      style={{
        borderRadius: 'var(--radius-base, 0.75rem)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            style={{
              transitionDuration: 'var(--duration-base)',
              filter: isPast ? 'grayscale(100%)' : undefined,
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: 'var(--backdrop-secondary)',
              filter: isPast ? 'grayscale(100%)' : undefined,
            }}
          />
        )}

        {/* Date badge */}
        <div
          className="absolute top-3 left-3"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--badge-radius)',
            backgroundColor: 'var(--color-surface)',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-on-dark-primary)',
              lineHeight: 1,
            }}
          >
            {day}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-ui, var(--font-body))',
              fontSize: '0.6rem',
              letterSpacing: 'var(--tracking-label)',
              color: 'var(--text-on-dark-secondary)',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            {month}
          </div>
        </div>

        {/* Past event overlay */}
        {isPast && (
          <div
            className="absolute top-3 right-3 px-2 py-1"
            style={{
              borderRadius: 'var(--badge-radius)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'var(--text-on-dark-primary, #fff)',
              fontSize: '0.65rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}
          >
            Past Event
          </div>
        )}

        {/* Cancelled overlay */}
        {event.cancelled && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <span
              style={{
                color: 'var(--text-on-dark-primary, #fff)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              Cancelled
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
        {/* Event type badge */}
        {event.eventType && (
          <span
            className="inline-block px-2 py-0.5 mb-2"
            style={{
              fontSize: '0.6875rem',
              borderRadius: 'var(--badge-radius)',
              backgroundColor: 'var(--backdrop-secondary)',
              color: 'var(--text-color-secondary)',
              textTransform: 'capitalize',
              fontFamily: 'var(--font-body)',
            }}
          >
            {event.eventType.replace(/-/g, ' ')}
          </span>
        )}

        <h3
          className="mb-1"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-subheading, 1.125rem)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--text-color-primary)',
          }}
        >
          {event.title}
        </h3>

        {(event.shortDescription || event.description) && (
          <p
            className="line-clamp-2 mb-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
              color: 'var(--text-color-secondary)',
              lineHeight: 'var(--leading-body, 1.65)',
            }}
          >
            {event.shortDescription || event.description}
          </p>
        )}

        {/* Date + Time */}
        <p
          className="mb-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-color-muted)',
          }}
        >
          {formatEventDate(event.startDatetime, locale)}
        </p>

        {/* Price + Reservation badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {priceLabel && (
            <span
              style={{
                fontFamily: 'var(--font-ui, var(--font-body))',
                fontSize: '0.8rem',
                color: 'var(--text-on-dark-primary)',
                fontWeight: 600,
              }}
            >
              {priceLabel}
            </span>
          )}
          {event.reservationRequired && !event.cancelled && (
            <span
              className="px-2 py-0.5"
              style={{
                fontSize: '0.65rem',
                borderRadius: 'var(--badge-radius)',
                backgroundColor: 'rgba(217, 155, 40, 0.15)',
                color: 'var(--color-warning)',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
              }}
            >
              {locale === 'en' ? 'Reservation Required' : locale === 'zh' ? '需要预订' : 'Reserva Obligatoria'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
