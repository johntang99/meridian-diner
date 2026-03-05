'use client';

import { useEffect, useRef, useState } from 'react';

interface ReservationWidgetResyProps {
  venueId?: string;
  apiKey?: string;
  phone?: string;
  locale?: string;
}

export default function ReservationWidgetResy({
  venueId,
  apiKey,
  phone,
  locale = 'en',
}: ReservationWidgetResyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!venueId || !apiKey) {
      setError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://widgets.resy.com/embed.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [venueId, apiKey]);

  if (error || !venueId) {
    return (
      <PhoneFallback phone={phone} locale={locale} />
    );
  }

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: '640px',
        padding: 'var(--card-pad, 2rem)',
        borderRadius: 'var(--radius-base, 0.75rem)',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {!loaded && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: '3rem',
                borderRadius: 'var(--radius-base, 0.5rem)',
                backgroundColor: 'var(--backdrop-secondary)',
              }}
            />
          ))}
        </div>
      )}
      <div
        ref={containerRef}
        id="resy-widget"
        data-resy-venue-id={venueId}
        data-resy-api-key={apiKey}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}

function PhoneFallback({ phone, locale }: { phone?: string; locale: string }) {
  return (
    <div
      className="mx-auto text-center"
      style={{
        maxWidth: '480px',
        padding: 'var(--card-pad, 2rem)',
        borderRadius: 'var(--radius-base, 0.75rem)',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <p
        className="mb-4"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-subheading, 1.25rem)',
          color: 'var(--text-color-primary)',
        }}
      >
        {locale === 'en' ? 'Reserve by Phone' : locale === 'zh' ? '电话预订' : 'Reservar por Teléfono'}
      </p>
      <a
        href={`tel:${(phone || '').replace(/[^\d+]/g, '')}`}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--primary)',
        }}
      >
        {phone || '(212) 555-0142'}
      </a>
      <p
        className="mt-3"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-small, 0.875rem)',
          color: 'var(--text-color-muted)',
        }}
      >
        {locale === 'en'
          ? 'We\'ll confirm your reservation via email.'
          : locale === 'zh'
          ? '我们将通过电子邮件确认您的预订。'
          : 'Confirmaremos su reserva por correo electrónico.'}
      </p>
    </div>
  );
}
