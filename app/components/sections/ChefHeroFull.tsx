import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/media-url';

interface ChefHeroFullProps {
  variant?: 'full-bleed' | 'contained';
  photo?: string;
  name: string;
  role: string;
  philosophy?: string;
  credentials?: string[];
  awards?: string[];
}

export default function ChefHeroFull({
  variant = 'full-bleed',
  photo,
  name,
  role,
  philosophy,
  credentials = [],
  awards = [],
}: ChefHeroFullProps) {
  const resolvedPhoto = resolveMediaUrl(photo);

  if (variant === 'contained') {
    return (
      <section
        className="px-6"
        style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
      >
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden"
          style={{
            maxWidth: 'var(--container-max, 1200px)',
            borderRadius: 'var(--radius-base, 0.75rem)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          {/* Photo */}
          <div className="relative aspect-[3/4] md:aspect-auto">
            {resolvedPhoto ? (
              <Image
                src={resolvedPhoto}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
            )}
          </div>
          {/* Content */}
          <div className="flex flex-col justify-center" style={{ padding: 'var(--card-pad, 2rem)' }}>
            <ChefContent
              name={name}
              role={role}
              philosophy={philosophy}
              credentials={credentials}
              awards={awards}
            />
          </div>
        </div>
      </section>
    );
  }

  // full-bleed (default)
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '70vh' }}>
      {/* Background photo — left side on desktop, top on mobile */}
      <div className="absolute inset-0">
        {resolvedPhoto ? (
          <Image
            src={resolvedPhoto}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
        )}
      </div>

      {/* Gradient overlay — fades from transparent on left to backdrop on right (desktop) */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: 'linear-gradient(to right, transparent 30%, var(--backdrop-primary) 65%)',
        }}
      />
      {/* Mobile: bottom gradient */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: 'linear-gradient(to bottom, transparent 30%, var(--backdrop-primary) 60%)',
        }}
      />

      {/* Content panel */}
      <div className="relative z-10 min-h-[70vh] flex items-center">
        <div className="mx-auto w-full px-6" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <div className="md:ml-auto md:w-[55%] pt-[50vh] md:pt-0">
            <ChefContent
              name={name}
              role={role}
              philosophy={philosophy}
              credentials={credentials}
              awards={awards}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChefContent({
  name,
  role,
  philosophy,
  credentials,
  awards,
}: {
  name: string;
  role: string;
  philosophy?: string;
  credentials: string[];
  awards: string[];
}) {
  return (
    <div>
      {/* Role label */}
      <span
        className="inline-block mb-4"
        style={{
          fontFamily: 'var(--font-ui, var(--font-body))',
          fontSize: 'var(--text-small, 0.75rem)',
          letterSpacing: 'var(--tracking-label, 0.1em)',
          textTransform: 'uppercase',
          color: 'var(--primary)',
          fontWeight: 600,
        }}
      >
        {role}
      </span>

      {/* Name */}
      <h2
        className="mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-display, 3rem)',
          fontWeight: 'var(--weight-display, 400)' as any,
          letterSpacing: 'var(--tracking-display)',
          lineHeight: 'var(--leading-display, 1.1)',
          color: 'var(--text-color-primary)',
        }}
      >
        {name}
      </h2>

      {/* Philosophy quote */}
      {philosophy && (
        <div className="mb-8 relative" style={{ paddingLeft: '1.5rem' }}>
          {/* Decorative quote mark */}
          <span
            className="absolute top-0 left-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '4rem',
              lineHeight: '0.8',
              color: 'var(--primary)',
              opacity: 0.6,
            }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-subheading, 1.25rem)',
              lineHeight: 'var(--leading-heading, 1.3)',
              color: 'var(--text-color-secondary)',
              paddingTop: '0.5rem',
            }}
          >
            {philosophy}
          </p>
        </div>
      )}

      {/* Credentials */}
      {credentials.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {credentials.map((cred, i) => (
            <span
              key={i}
              className="inline-block px-3 py-1"
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-body)',
                borderRadius: 'var(--badge-radius)',
                backgroundColor: 'var(--backdrop-secondary)',
                color: 'var(--text-color-secondary)',
              }}
            >
              {cred}
            </span>
          ))}
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {awards.map((award, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-color-muted)',
              }}
            >
              {award}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
