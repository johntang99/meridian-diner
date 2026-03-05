import Image from 'next/image';
import Link from 'next/link';

interface AboutPreviewStat {
  value: string;
  label: string;
}

interface AboutPreviewProps {
  variant?: 'split-image' | 'stacked' | 'minimal-text';
  image?: string;
  eyebrow?: string;
  headline: string;
  body: string;
  stats?: AboutPreviewStat[];
  cta?: { text: string; link: string };
}

export default function AboutPreview({
  variant = 'split-image',
  image,
  eyebrow,
  headline,
  body,
  stats,
  cta,
}: AboutPreviewProps) {
  if (variant === 'stacked') {
    return (
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '720px' }}>
          {eyebrow && (
            <span
              className="uppercase block mb-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: 'var(--tracking-label)',
                color: 'var(--heading-on-light, #111827)',
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className="mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              lineHeight: 'var(--leading-heading, 1.35)',
              color: 'var(--heading-on-light, #111827)',
            }}
          >
            {headline}
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              lineHeight: 'var(--leading-body, 1.65)',
              color: 'var(--body-on-light, #4B5563)',
            }}
          >
            {body}
          </p>
          {cta && (
            <Link
              href={cta.link}
              className="inline-flex items-center gap-2 transition-all hover:opacity-80"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--heading-on-light, #111827)',
              }}
            >
              {cta.text} →
            </Link>
          )}
        </div>
      </section>
    );
  }

  // split-image (default)
  return (
    <section
      className="px-6"
      style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
    >
      <div
        className="mx-auto grid grid-cols-1 md:grid-cols-2 items-center"
        style={{ maxWidth: 'var(--container-max, 1200px)', gap: 'var(--grid-gap, 3rem)' }}
      >
        {/* Image */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 'var(--radius-base, 0.75rem)' }}>
            {image ? (
              <Image
                src={image}
                alt={headline}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
            )}
          </div>
          {/* Decorative frame */}
          <div
            className="absolute -bottom-3 -right-3 w-full h-full hidden md:block"
            style={{
              border: '3px solid var(--primary)',
              borderRadius: 'var(--radius-base, 0.75rem)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Content */}
        <div className="py-4">
          {eyebrow && (
            <span
              className="uppercase block mb-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: 'var(--tracking-label)',
                color: 'var(--heading-on-light, #111827)',
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className="mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              lineHeight: 'var(--leading-heading, 1.35)',
              color: 'var(--heading-on-light, #111827)',
            }}
          >
            {headline}
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body, 1rem)',
              lineHeight: 'var(--leading-body, 1.65)',
              color: 'var(--body-on-light, #4B5563)',
            }}
          >
            {body}
          </p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex gap-8 mb-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-heading, 2rem)',
                      color: 'var(--heading-on-light, #111827)',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--muted-on-light, #6B7280)',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {cta && (
            <Link
              href={cta.link}
              className="inline-flex items-center gap-2 px-6 py-3 transition-all hover:opacity-80"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-label)',
                borderRadius: 'var(--radius-base, 0.5rem)',
                border: '1px solid var(--border-default)',
                color: 'var(--heading-on-light, #111827)',
              }}
            >
              {cta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
