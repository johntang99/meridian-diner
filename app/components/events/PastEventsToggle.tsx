'use client';

import { useState } from 'react';
import EventCard, { type EventCardData } from './EventCard';

interface PastEventsToggleProps {
  events: EventCardData[];
  locale: string;
  count: number;
}

export default function PastEventsToggle({ events, locale, count }: PastEventsToggleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="px-6"
      style={{ paddingBottom: 'var(--section-py)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 mx-auto mb-6 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            fontWeight: 600,
            color: 'var(--text-color-muted)',
          }}
        >
          {expanded
            ? (locale === 'en' ? 'Hide Past Events' : locale === 'zh' ? '隐藏过往活动' : 'Ocultar Eventos Pasados')
            : (locale === 'en'
              ? `View Past Events (${count})`
              : locale === 'zh'
              ? `查看过往活动 (${count})`
              : `Ver Eventos Pasados (${count})`)}
          <span
            className="transition-transform"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </button>

        {expanded && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 'var(--grid-gap, 1.5rem)' }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} isPast />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
