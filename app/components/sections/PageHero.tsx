import Image from 'next/image';

export type PageHeroVariant =
  | 'default'
  | 'centered'
  | 'split-photo-right'
  | 'split-photo-left'
  | 'photo-background'
  | 'overlap'
  | 'video-background'
  | 'gallery-background'
  | 'split-ambiance';

interface PageHeroData {
  variant?: PageHeroVariant | string;
  headline: string;
  subline?: string;
  eyebrow?: string;
  image?: string;
  video?: string;
  gallery?: string[];
}

interface PageHeroProps {
  hero: PageHeroData;
}

function resolveVariant(rawVariant?: string): Exclude<PageHeroVariant, 'split-ambiance'> {
  if (!rawVariant || rawVariant === 'default') return 'centered';
  if (rawVariant === 'split-ambiance') return 'centered';
  if (
    rawVariant === 'centered' ||
    rawVariant === 'split-photo-right' ||
    rawVariant === 'split-photo-left' ||
    rawVariant === 'photo-background' ||
    rawVariant === 'overlap' ||
    rawVariant === 'video-background' ||
    rawVariant === 'gallery-background'
  ) {
    return rawVariant;
  }
  return 'centered';
}

function Eyebrow({ text, dark }: { text?: string; dark?: boolean }) {
  if (!text) return null;
  return (
    <span
      className="inline-block mb-3"
      style={{
        fontFamily: 'var(--font-ui, var(--font-body))',
        fontSize: 'var(--text-small, 0.75rem)',
        letterSpacing: 'var(--tracking-label, 0.1em)',
        textTransform: 'uppercase',
        color: dark ? 'var(--text-color-accent)' : 'var(--primary)',
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}

function Headline({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <h1
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-display, 3rem)',
        fontWeight: 'var(--weight-display, 400)' as any,
        letterSpacing: 'var(--tracking-display)',
        lineHeight: 'var(--leading-display, 1.1)',
        color: dark ? '#F5F0E8' : 'var(--text-color-primary)',
      }}
    >
      {text}
    </h1>
  );
}

function Subline({ text, dark, centered }: { text?: string; dark?: boolean; centered?: boolean }) {
  if (!text) return null;
  return (
    <p
      className={centered ? 'mt-4 mx-auto' : 'mt-4'}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body, 1rem)',
        color: dark ? 'rgba(245,240,232,0.88)' : 'var(--text-color-secondary)',
        maxWidth: centered ? '600px' : undefined,
        lineHeight: 'var(--leading-body, 1.65)',
      }}
    >
      {text}
    </p>
  );
}

export default function PageHero({ hero }: PageHeroProps) {
  const variant = resolveVariant(hero.variant);
  const backgroundImage = hero.gallery?.[0] || hero.image;
  const heroPaddingStyle = {
    paddingTop: 'calc(var(--section-padding-y, 5rem) + 2rem)',
    paddingBottom: 'var(--section-padding-y, 5rem)',
  };
  const surfaceTokenStyle = {
    borderRadius: 'var(--radius-base, 0.75rem)',
    boxShadow: 'var(--shadow-base, 0 4px 20px rgba(0,0,0,0.08))',
  };

  if (variant === 'split-photo-right') {
    return (
      <section
        className="px-6"
        style={{
          ...heroPaddingStyle,
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto grid gap-8 md:grid-cols-2 items-center" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <div>
            <Eyebrow text={hero.eyebrow} />
            <Headline text={hero.headline} />
            <Subline text={hero.subline} />
          </div>
          {backgroundImage && (
            <div className="overflow-hidden" style={{ ...surfaceTokenStyle, aspectRatio: '4/3' }}>
              <Image src={backgroundImage} alt={hero.headline} width={1200} height={900} priority className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'split-photo-left') {
    return (
      <section
        className="px-6"
        style={{
          ...heroPaddingStyle,
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto grid gap-8 md:grid-cols-2 items-center" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          {backgroundImage && (
            <div className="overflow-hidden order-2 md:order-1" style={{ ...surfaceTokenStyle, aspectRatio: '4/3' }}>
              <Image src={backgroundImage} alt={hero.headline} width={1200} height={900} priority className="w-full h-full object-cover" />
            </div>
          )}
          <div className="order-1 md:order-2">
            <Eyebrow text={hero.eyebrow} />
            <Headline text={hero.headline} />
            <Subline text={hero.subline} />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'photo-background' || variant === 'video-background' || variant === 'gallery-background') {
    return (
      <section
        className="relative px-6 text-center"
        style={{
          minHeight: 'min(72vh, 720px)',
          ...heroPaddingStyle,
          backgroundColor: 'var(--backdrop-primary)',
        }}
      >
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt={hero.headline}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'var(--color-overlay, rgba(0,0,0,0.48))' }} />
        <div className="relative z-10 mx-auto" style={{ maxWidth: '820px', paddingTop: '8rem' }}>
          <Eyebrow text={hero.eyebrow} dark />
          <Headline text={hero.headline} dark />
          <Subline text={hero.subline} dark centered />
        </div>
      </section>
    );
  }

  if (variant === 'overlap') {
    return (
      <section
        className="px-6"
        style={{
          ...heroPaddingStyle,
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          {backgroundImage && (
            <div className="overflow-hidden" style={{ ...surfaceTokenStyle, aspectRatio: '16/7' }}>
              <Image src={backgroundImage} alt={hero.headline} width={1600} height={700} priority className="w-full h-full object-cover" />
            </div>
          )}
          <div
            className="mx-auto text-center"
            style={{
              marginTop: '-2.5rem',
              maxWidth: '760px',
              borderRadius: 'var(--radius-base, 0.75rem)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-base, 0 4px 20px rgba(0,0,0,0.08))',
              padding: '1.5rem 2rem',
            }}
          >
            <Eyebrow text={hero.eyebrow} />
            <Headline text={hero.headline} />
            <Subline text={hero.subline} centered />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="px-6 text-center"
      style={{
        ...heroPaddingStyle,
        backgroundColor: 'var(--backdrop-secondary)',
      }}
    >
      {backgroundImage && (
        <div
          className="mx-auto mb-6 overflow-hidden"
          style={{ maxWidth: '960px', ...surfaceTokenStyle, aspectRatio: '16/7' }}
        >
          <Image
            src={backgroundImage}
            alt={hero.headline}
            width={1600}
            height={700}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <Eyebrow text={hero.eyebrow} />
      <Headline text={hero.headline} />
      <Subline text={hero.subline} centered />
    </section>
  );
}
