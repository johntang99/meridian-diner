import Link from 'next/link';

interface ReservationsCTAProps {
  variant?: 'banner' | 'split' | 'minimal';
  headline: string;
  subline?: string;
  urgencyNote?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ReservationsCTA({
  variant = 'banner',
  headline,
  subline,
  urgencyNote,
  ctaLabel = 'Reserve Now',
  ctaHref = '/reservations',
}: ReservationsCTAProps) {
  if (variant === 'minimal') {
    return (
      <section className="px-6 py-12 text-center">
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-subheading, 1.125rem)',
            color: 'var(--heading-on-light, #111827)',
          }}
        >
          {headline}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 mt-4 transition-all hover:opacity-80"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--body-on-light, #4B5563)',
          }}
        >
          {ctaLabel} →
        </Link>
      </section>
    );
  }

  // banner (default)
  return (
    <section
      className="px-6"
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: 'var(--primary)',
      }}
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: 'var(--container-max, 1200px)' }}
      >
        <h2
          className="mb-3"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-heading, 2rem)',
            letterSpacing: 'var(--tracking-heading)',
            lineHeight: 'var(--leading-heading, 1.35)',
            color: 'var(--text-on-dark-primary)',
          }}
        >
          {headline}
        </h2>
        {subline && (
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              color: 'var(--text-on-dark-secondary)',
              opacity: 0.8,
            }}
          >
            {subline}
          </p>
        )}
        {urgencyNote && (
          <p
            className="italic mb-6"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
              color: 'var(--text-on-dark-secondary)',
              opacity: 0.7,
            }}
          >
            {urgencyNote}
          </p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-8 py-3.5 transition-all hover:opacity-90"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-label)',
            borderRadius: 'var(--radius-base, 0.5rem)',
            backgroundColor: 'var(--text-color-accent)',
            color: 'var(--primary)',
          }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
