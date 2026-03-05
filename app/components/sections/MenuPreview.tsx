import Image from 'next/image';
import Link from 'next/link';

interface MenuPreviewItem {
  name: string;
  description?: string;
  price?: number;
  price_note?: string;
  image?: string;
  dietary_flags?: string[];
}

interface MenuPreviewProps {
  variant?: 'cards-4' | 'cards-3' | 'list-with-image';
  eyebrow?: string;
  headline?: string;
  subline?: string;
  items?: MenuPreviewItem[];
  ctaText?: string;
  ctaLink?: string;
  locale?: string;
}

const dietaryIcons: Record<string, string> = {
  vegetarian: '🌿',
  vegan: '🌱',
  'gluten-free': '🌾',
  'dairy-free': '🥛',
};

function formatPrice(price?: number, note?: string) {
  if (!price && note) return note;
  if (!price) return '';
  return `$${(price / 100).toFixed(0)}`;
}

export default function MenuPreview({
  variant = 'cards-4',
  eyebrow,
  headline,
  subline,
  items = [],
  ctaText,
  ctaLink,
}: MenuPreviewProps) {
  const cols = variant === 'cards-3' ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <section
      className="px-6"
      style={{
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        backgroundColor: 'var(--backdrop-primary)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
        {/* Section heading */}
        {(eyebrow || headline || subline) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <span
                className="uppercase block mb-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: 'var(--tracking-label)',
                  color: 'var(--text-color-accent)',
                }}
              >
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading, 2rem)',
                  letterSpacing: 'var(--tracking-heading)',
                  lineHeight: 'var(--leading-heading, 1.35)',
                  color: 'var(--text-color-primary)',
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
                  color: 'var(--text-color-secondary)',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                {subline}
              </p>
            )}
          </div>
        )}

        {/* Items grid */}
        <div className={`grid grid-cols-1 ${cols}`} style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="group transition-all"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-base, 0.75rem)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    style={{ transitionDuration: 'var(--duration-base)' }}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: 'var(--backdrop-secondary)' }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-subheading, 1.125rem)',
                      letterSpacing: 'var(--tracking-heading)',
                      color: 'var(--text-color-primary)',
                    }}
                  >
                    {item.name}
                  </h3>
                  {(item.price || item.price_note) && (
                    <span
                      className="whitespace-nowrap"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-body, 1rem)',
                        color: 'var(--text-color-accent)',
                      }}
                    >
                      {formatPrice(item.price, item.price_note)}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p
                    className="line-clamp-2 mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {item.description}
                  </p>
                )}

                {item.dietary_flags && item.dietary_flags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {item.dietary_flags.slice(0, 3).map((flag) => (
                      <span
                        key={flag}
                        className="inline-flex items-center gap-1 px-2 py-0.5"
                        style={{
                          fontSize: '0.6875rem',
                          borderRadius: 'var(--badge-radius)',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--text-color-muted)',
                        }}
                      >
                        {dietaryIcons[flag] || ''} {flag}
                      </span>
                    ))}
                  </div>
                )}
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
                color: 'var(--text-color-accent)',
              }}
            >
              {ctaText}
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
