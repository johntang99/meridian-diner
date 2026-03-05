import Image from 'next/image';
import Link from 'next/link';

interface EventPreviewItem {
  title: string;
  type?: string;
  description?: string;
  date?: string;
  image?: string;
  price_per_person?: number;
  slug?: string;
}

interface EventsPreviewProps {
  variant?: 'cards-3' | 'cards-2' | 'list';
  headline?: string;
  subline?: string;
  items?: EventPreviewItem[];
  ctaText?: string;
  ctaLink?: string;
  locale?: string;
}

function formatEventDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function EventsPreview({
  variant = 'cards-3',
  headline,
  subline,
  items = [],
  ctaText,
  ctaLink,
  locale = 'en',
}: EventsPreviewProps) {
  const cols = variant === 'cards-2' ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const displayItems = items.slice(0, variant === 'cards-2' ? 2 : 3);

  return (
    <section
      className="px-6"
      style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
        {/* Heading */}
        {(headline || subline) && (
          <div className="text-center mb-12">
            {headline && (
              <h2
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading, 2rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--primary)',
                }}
              >
                {headline}
              </h2>
            )}
            {subline && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--body-on-light, #4B5563)',
                }}
              >
                {subline}
              </p>
            )}
          </div>
        )}

        {/* Event cards */}
        <div className={`grid grid-cols-1 ${cols}`} style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
          {displayItems.map((event, i) => (
            <div
              key={i}
              className="group overflow-hidden transition-all"
              style={{
                borderRadius: 'var(--radius-base, 0.75rem)',
                boxShadow: 'var(--shadow-card)',
                backgroundColor: 'var(--color-surface)',
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
                    style={{ transitionDuration: 'var(--duration-base)' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
                )}

                {/* Date badge */}
                {event.date && (
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-color-inverse)',
                      borderRadius: 'var(--badge-radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {formatEventDate(event.date)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
                {event.type && (
                  <span
                    className="inline-block px-2 py-0.5 mb-2"
                    style={{
                      fontSize: '0.6875rem',
                      borderRadius: 'var(--badge-radius)',
                      backgroundColor: 'var(--backdrop-secondary)',
                      color: 'var(--text-color-secondary)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {event.type.replace(/-/g, ' ')}
                  </span>
                )}
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-subheading, 1.125rem)',
                    letterSpacing: 'var(--tracking-heading)',
                    color: 'var(--text-color-primary)',
                  }}
                >
                  {event.title}
                </h3>
                {event.description && (
                  <p
                    className="line-clamp-2 mb-3"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {event.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {event.price_per_person && (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-small, 0.875rem)',
                        color: 'var(--text-color-muted)',
                      }}
                    >
                      From ${event.price_per_person}/person
                    </span>
                  )}
                  <Link
                    href={`/${locale}/events${event.slug ? `/${event.slug}` : ''}`}
                    className="transition-colors hover:opacity-80"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      fontWeight: 600,
                      color: 'var(--text-on-dark-primary)',
                    }}
                  >
                    {locale === 'en' ? 'Learn More' : locale === 'zh' ? '了解更多' : 'Más Info'} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {ctaText && ctaLink && (
          <div className="text-center mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 transition-all hover:opacity-80"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-label)',
                color: 'var(--primary)',
              }}
            >
              {ctaText} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
