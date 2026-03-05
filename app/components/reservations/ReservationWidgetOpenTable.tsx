'use client';

import { useEffect, useRef, useState } from 'react';

interface ReservationWidgetOpenTableProps {
  restaurantId?: string;
  phone?: string;
  locale?: string;
}

export default function ReservationWidgetOpenTable({
  restaurantId,
  phone,
  locale = 'en',
}: ReservationWidgetOpenTableProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!restaurantId) {
      setError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.opentable.com/widget/reservation/loader';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [restaurantId]);

  if (error || !restaurantId) {
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
      </div>
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
        id="ot-widget"
        className="ot-widget"
        data-rid={restaurantId}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}
