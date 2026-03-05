'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface HeroFullscreenDishProps {
  variant?: 'dark-overlay' | 'light-overlay' | 'split-text' | 'gallery-background';
  image?: string;
  galleryImages?: string[];
  eyebrow?: string;
  headline: string;
  subline?: string;
  ctaPrimary?: { text: string; link: string };
  ctaSecondary?: { text: string; link: string };
  showScrollIndicator?: boolean;
}

export default function HeroFullscreenDish({
  variant = 'dark-overlay',
  image,
  galleryImages,
  eyebrow,
  headline,
  subline,
  ctaPrimary,
  ctaSecondary,
  showScrollIndicator = true,
}: HeroFullscreenDishProps) {
  const galleryPool = useMemo(() => {
    const list = (galleryImages || []).filter(Boolean);
    if (list.length > 0) return list;
    return image ? [image] : [];
  }, [galleryImages, image]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    if (variant !== 'gallery-background' || galleryPool.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveGalleryIndex((current) => (current + 1) % galleryPool.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [variant, galleryPool.length]);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [variant, galleryPool.length]);

  if (variant === 'split-text') {
    return (
      <section className="flex flex-col md:flex-row" style={{ minHeight: 'var(--hero-min-h, 100vh)' }}>
        {/* Left: Text */}
        <div
          className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 order-2 md:order-1"
          style={{ backgroundColor: 'var(--backdrop-primary)' }}
        >
          {eyebrow && (
            <span
              className="uppercase mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: 'var(--tracking-label)',
                color: 'var(--primary)',
              }}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display, 3.5rem)',
              fontWeight: 'var(--weight-display, 400)' as any,
              letterSpacing: 'var(--tracking-display)',
              lineHeight: 'var(--leading-display, 1.1)',
              color: 'var(--text-color-primary)',
              maxWidth: '600px',
            }}
          >
            {headline}
          </h1>
          {subline && (
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-subheading, 1.125rem)',
                lineHeight: 'var(--leading-body, 1.65)',
                color: 'var(--text-color-secondary)',
                maxWidth: '500px',
              }}
            >
              {subline}
            </p>
          )}
          <div className="flex gap-4 flex-wrap">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.link}
                className="inline-flex items-center justify-center px-7 py-3 transition-all hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-label)',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-color-inverse)',
                }}
              >
                {ctaPrimary.text}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.link}
                className="inline-flex items-center justify-center px-7 py-3 transition-all hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-label)',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {ctaSecondary.text}
              </Link>
            )}
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative flex-1 order-1 md:order-2" style={{ minHeight: '300px' }}>
          {image ? (
            <Image
              src={image}
              alt={headline}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
          )}
        </div>
      </section>
    );
  }

  // dark-overlay / light-overlay / gallery-background
  const overlayOpacity = variant === 'light-overlay' ? 0.3 : 0.55;

  return (
    <section
      className="relative flex items-center justify-center"
      style={{ minHeight: 'var(--hero-min-h, 100vh)' }}
    >
      {/* Background Image */}
      {variant === 'gallery-background' ? (
        galleryPool.length > 0 ? (
          <div className="absolute inset-0">
            {galleryPool.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: index === activeGalleryIndex ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`${headline} ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--backdrop-primary)' }} />
        )
      ) : image ? (
        <Image
          src={image}
          alt={headline}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--backdrop-primary)' }} />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {eyebrow && (
          <span
            className="inline-block uppercase mb-4 px-3 py-1.5"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: 'var(--tracking-label)',
              color: 'var(--text-on-dark-primary, #fff)',
              backgroundColor: 'rgba(17, 17, 17, 0.42)',
              border: '1px solid rgba(245, 240, 232, 0.25)',
              borderRadius: '999px',
              backdropFilter: 'blur(2px)',
            }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className="mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, var(--text-display, 3.5rem))',
            fontWeight: 'var(--weight-display, 400)' as any,
            letterSpacing: 'var(--tracking-display)',
            lineHeight: 'var(--leading-display, 1.1)',
            color: 'var(--text-on-dark-primary, #fff)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {headline}
        </h1>
        {subline && (
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 'var(--leading-body, 1.65)',
              color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.9))',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {subline}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          {ctaPrimary && (
            <Link
              href={ctaPrimary.link}
              className="inline-flex items-center justify-center px-8 py-3.5 transition-all hover:opacity-90"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-label)',
                borderRadius: 'var(--radius-base, 0.5rem)',
                backgroundColor: 'var(--primary)',
                color: 'var(--text-color-inverse)',
              }}
            >
              {ctaPrimary.text}
            </Link>
          )}
          {ctaSecondary && (
            <Link
              href={ctaSecondary.link}
              className="inline-flex items-center justify-center px-8 py-3.5 transition-all hover:opacity-80"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-label)',
                borderRadius: 'var(--radius-base, 0.5rem)',
                border: '1px solid rgba(245, 240, 232, 0.4)',
                color: 'var(--text-on-dark-primary, #fff)',
              }}
            >
              {ctaSecondary.text}
            </Link>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }} />
        </div>
      )}
    </section>
  );
}
