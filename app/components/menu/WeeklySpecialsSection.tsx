'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

interface WeeklySpecial {
  day: string;
  dayNumber?: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  badges?: string[];
  includes?: string[];
}

interface WeeklySpecialsSectionProps {
  specials: WeeklySpecial[];
  currentDayNumber: number;
  variant?: 'rich' | 'compact';
}

const fallbackImage =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80&auto=format&fit=crop';

export default function WeeklySpecialsSection({
  specials,
  currentDayNumber,
  variant = 'rich',
}: WeeklySpecialsSectionProps) {
  const [selectedSpecial, setSelectedSpecial] = useState<WeeklySpecial | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const weekdayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const isCompact = variant === 'compact';

  const normalizedSpecials = useMemo(
    () =>
      specials.map((special) => ({
        ...special,
        image: special.image || fallbackImage,
        badges: Array.isArray(special.badges) ? special.badges : [],
        includes: Array.isArray(special.includes) ? special.includes : [],
      })),
    [specials]
  );

  const isToday = (special: WeeklySpecial) => {
    const byNumber =
      typeof special.dayNumber === 'number' && special.dayNumber === currentDayNumber;
    const byName =
      special.day.trim().toLowerCase() === weekdayNames[currentDayNumber];
    return byNumber || byName;
  };

  const scrollingSpecials = [...normalizedSpecials, ...normalizedSpecials];

  return (
    <>
      <section
        className="px-6"
        style={{ paddingBottom: isCompact ? 'var(--section-py-xs, 1.5rem)' : 'var(--section-py-sm)' }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isCompact ? '1.25rem' : 'var(--text-subheading, 1.5rem)',
              color: 'var(--primary)',
            }}
          >
            Weekly Specials
          </h2>
          <div
            className="weekly-specials-marquee relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="weekly-specials-track flex w-max gap-4"
              style={{
                animation: 'weekly-specials-scroll 58s linear infinite',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
            {scrollingSpecials.map((special, index) => {
              const today = isToday(special);
              return (
                <button
                  key={`${special.day}-${special.name}-${index}`}
                  type="button"
                  onClick={() => setSelectedSpecial(special)}
                  className={`flex-shrink-0 border p-0 text-left overflow-hidden transition-opacity hover:opacity-90 ${isCompact ? 'w-[260px]' : 'w-[300px]'}`}
                  style={{
                    borderColor: today ? 'var(--primary)' : 'var(--border-default)',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-base, 0.75rem)',
                  }}
                >
                  <div className={`relative ${isCompact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                    <Image
                      src={special.image || fallbackImage}
                      alt={special.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className={isCompact ? 'p-3' : 'p-4'}>
                    <p style={{ color: 'var(--text-color-accent)', fontWeight: 700 }}>
                      {special.day}
                      {today && ' • Today'}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: isCompact ? '0.95rem' : undefined, color: 'var(--text-color-primary)' }}>{special.name}</p>
                    <p className="mt-1" style={{ color: 'var(--text-color-secondary)', fontSize: isCompact ? '0.85rem' : undefined }}>
                      {special.description}
                    </p>
                    <p className="mt-2" style={{ fontWeight: 700, color: 'var(--text-color-accent)' }}>
                      ${special.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={Boolean(selectedSpecial)}
        onClose={() => setSelectedSpecial(null)}
        title={selectedSpecial ? `${selectedSpecial.day} Special` : 'Special'}
        size="lg"
      >
        {selectedSpecial && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--radius-base, 0.75rem)' }}>
              <Image
                src={selectedSpecial.image || fallbackImage}
                alt={selectedSpecial.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(selectedSpecial.badges || []).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full px-3 py-1 text-small"
                    style={{ backgroundColor: 'var(--backdrop-secondary)', color: 'var(--text-color-primary)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <h3 className="text-subheading font-bold">{selectedSpecial.name}</h3>
              <p className="mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                {selectedSpecial.description}
              </p>
              {(selectedSpecial.includes || []).length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-small font-semibold">Includes</p>
                  <ul className="space-y-1 text-small" style={{ color: 'var(--text-color-secondary)' }}>
                    {selectedSpecial.includes?.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-4 text-subheading font-bold">${selectedSpecial.price.toFixed(2)}</p>
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        @keyframes weekly-specials-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }
      `}</style>
    </>
  );
}
