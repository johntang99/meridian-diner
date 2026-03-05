'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import type { MenuSpecial, WeeklySpecial } from '@/lib/menuHub';

interface TodaySpecialSectionProps {
  locale: string;
  special: MenuSpecial;
  weeklySpecials?: WeeklySpecial[];
  currentDayNumber?: number;
  callHref?: string;
  title?: string;
  variant?: 'rich' | 'compact';
}

const fallbackImage =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80&auto=format&fit=crop';

export default function TodaySpecialSection({
  locale,
  special,
  weeklySpecials = [],
  currentDayNumber = new Date().getDay(),
  callHref = 'tel:+12125550142',
  title = "Today's Special",
  variant = 'rich',
}: TodaySpecialSectionProps) {
  const [open, setOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<number>(currentDayNumber);
  const isCompact = variant === 'compact';
  const hasWeekly = weeklySpecials.length > 0;
  const hasNumberedWeekly = weeklySpecials.some((item) => typeof item.dayNumber === 'number');
  const activeSpecial =
    hasWeekly && hasNumberedWeekly
      ? weeklySpecials.find((item) => item.dayNumber === activeDay) || special
      : special;
  const menuType = activeSpecial.menuType || 'dinner';
  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];
  const weekdayLabels: Record<string, string[]> = {
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    zh: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    es: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
  };
  const dayLabels = weekdayLabels[locale] || weekdayLabels.en;
  const dayLabelByNumber = new Map(weekdayOrder.map((day, index) => [day, dayLabels[index]]));
  const availabilityLabel =
    locale === 'zh'
      ? '今日供应 · 数量有限'
      : locale === 'es'
      ? 'Disponible hoy · Cantidad limitada'
      : 'Available today · Limited quantity';
  const includesLabel = locale === 'zh' ? '包含' : locale === 'es' ? 'Incluye' : 'Includes';
  const detailsLabel = locale === 'zh' ? '查看详情' : locale === 'es' ? 'Ver detalles' : 'View details';
  const orderNowLabel = locale === 'zh' ? '立即下单' : locale === 'es' ? 'Ordenar ahora' : 'Order Now';
  const callNowLabel = locale === 'zh' ? '立即致电' : locale === 'es' ? 'Llamar ahora' : 'Call Now';
  const orderHref = `/${locale}/menu/${menuType}`;

  return (
    <>
      <section className="px-6" style={{ paddingTop: isCompact ? 'var(--section-py-xs, 1.5rem)' : 'var(--section-py-sm)', paddingBottom: isCompact ? 'var(--section-py-xs, 1.5rem)' : 'var(--section-py-sm)' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          {!isCompact ? (
            <div className="mb-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'var(--text-color-accent)',
                      color: 'var(--text-color-inverse)',
                      fontWeight: 700,
                    }}
                  >
                    ★
                  </span>
                  <div>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--text-subheading, 1.5rem)', fontFamily: 'var(--font-heading)' }}>
                      {title}
                    </p>
                    <p style={{ color: 'var(--primary-light)', fontSize: '0.875rem' }}>
                      {locale === 'zh' ? '今日推荐' : locale === 'es' ? 'Especial del dia' : 'Chef selected for today'}
                    </p>
                  </div>
                </div>
                <p style={{ color: 'var(--primary-light)', fontSize: '0.9375rem', fontWeight: 600 }}>
                  {availabilityLabel}
                </p>
              </div>

              {hasWeekly && hasNumberedWeekly && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {weekdayOrder.map((dayNumber) => {
                    const isActive = dayNumber === activeDay;
                    return (
                      <button
                        key={dayNumber}
                        type="button"
                        onClick={() => setActiveDay(dayNumber)}
                        className="rounded-full px-5 py-2 text-small transition-all"
                        style={{
                          border: isActive ? '2px solid var(--text-color-accent)' : '1px solid var(--border-default)',
                          color: isActive ? 'var(--primary)' : 'var(--text-color-secondary)',
                          backgroundColor: isActive ? 'rgba(201,168,76,0.12)' : 'var(--color-surface)',
                          fontWeight: isActive ? 700 : 500,
                        }}
                      >
                        {dayLabelByNumber.get(dayNumber)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <p className="mb-2" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {title}
            </p>
          )}

          <div
            className="w-full border border-[var(--border-default)] text-left overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-base, 1rem)' }}
          >
            <div className={`grid gap-0 ${isCompact ? 'md:grid-cols-[0.9fr_1fr]' : 'md:grid-cols-[1.1fr_1fr]'}`}>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={`relative ${isCompact ? 'aspect-[3/2]' : 'aspect-[16/10] md:aspect-auto'} overflow-hidden transition-opacity hover:opacity-90`}
                aria-label={detailsLabel}
              >
                <Image
                  src={activeSpecial.image || fallbackImage}
                  alt={activeSpecial.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </button>
              <div className={isCompact ? 'p-4 md:p-5' : 'p-6'}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: isCompact ? '1.125rem' : 'var(--text-subheading, 1.5rem)', color: 'var(--text-color-primary)' }}>
                  {activeSpecial.name}
                </h2>
                <p className="mt-2" style={{ color: 'var(--text-color-secondary)', fontSize: isCompact ? '0.9rem' : undefined }}>
                  {activeSpecial.description}
                </p>
                {!isCompact && (activeSpecial.includes || []).length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-small font-semibold" style={{ color: 'var(--text-color-secondary)' }}>
                      {includesLabel}
                    </p>
                    <ul className="space-y-1.5">
                      {(activeSpecial.includes || []).slice(0, 3).map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-small"
                          style={{ color: 'var(--text-color-primary)' }}
                        >
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--text-color-accent)' }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className={`${isCompact ? 'mt-3' : 'mt-5'} flex items-center justify-between gap-4`}>
                  <span style={{ fontWeight: 700, color: 'var(--text-color-accent)', fontSize: isCompact ? '1rem' : '1.8rem' }}>
                    ${activeSpecial.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-small"
                    style={{ color: 'var(--text-color-accent)', fontWeight: 600 }}
                  >
                    {detailsLabel}
                  </button>
                </div>
                {!isCompact && (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={orderHref}
                      className="inline-flex items-center justify-center px-5 py-3 text-small font-semibold"
                      style={{ backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', borderRadius: 'var(--radius-base, 0.5rem)' }}
                    >
                      {orderNowLabel}
                    </Link>
                    <a
                      href={callHref}
                      className="inline-flex items-center justify-center px-5 py-3 text-small font-semibold"
                      style={{
                        border: '1px solid var(--text-color-accent)',
                        color: 'var(--text-color-accent)',
                        backgroundColor: 'transparent',
                        borderRadius: 'var(--radius-base, 0.5rem)',
                      }}
                    >
                      {callNowLabel}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={activeSpecial.name}
        size="lg"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--radius-base, 0.75rem)' }}>
            <Image
              src={activeSpecial.image || fallbackImage}
              alt={activeSpecial.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(activeSpecial.badges || []).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full px-3 py-1 text-small"
                  style={{ backgroundColor: 'var(--backdrop-secondary)', color: 'var(--text-color-primary)' }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--text-color-secondary)' }}>{activeSpecial.description}</p>
            {(activeSpecial.includes || []).length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-small font-semibold">{includesLabel}</p>
                <ul className="space-y-1 text-small" style={{ color: 'var(--text-color-secondary)' }}>
                  {activeSpecial.includes?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-subheading font-bold">${activeSpecial.price.toFixed(2)}</p>
            <div className="mt-6">
              <Link
                href={`/${locale}/menu/${menuType}`}
                className="inline-flex items-center px-4 py-2 text-small font-semibold"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', borderRadius: 'var(--radius-base, 0.5rem)' }}
              >
                {activeSpecial.ctaLabel || 'View Menu Category'}
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
