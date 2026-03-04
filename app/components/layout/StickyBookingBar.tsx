'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { Locale } from '@/lib/i18n';

interface StickyBookingBarProps {
  locale: Locale;
  phone?: string;
  phoneDisplay?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function StickyBookingBar({
  locale,
  phone,
  phoneDisplay,
  ctaLabel,
  ctaHref,
}: StickyBookingBarProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on reservations page
  const isReservationsPage = pathname?.includes('/reservations');

  useEffect(() => {
    if (isReservationsPage) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReservationsPage]);

  if (isReservationsPage) return null;

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http') || url.startsWith('tel:')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    if (url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const resolvedCtaLabel = ctaLabel || (locale === 'en' ? 'Reserve a Table' : locale === 'zh' ? '预订餐位' : 'Reservar Mesa');
  const resolvedCtaHref = localizeUrl(ctaHref || '/reservations');
  const phoneHref = phone ? `tel:${phone.replace(/\D/g, '')}` : undefined;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden transition-transform"
      style={{
        height: '64px',
        backgroundColor: 'var(--backdrop-primary)',
        borderTop: 'var(--menu-divider)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transitionDuration: 'var(--duration-base, 300ms)',
        transitionTimingFunction: 'var(--easing)',
      }}
    >
      <div className="flex items-center h-full px-3 gap-2">
        {/* Phone button */}
        {phoneHref && (
          <a
            href={phoneHref}
            className="flex-1 flex items-center justify-center gap-2 h-11 transition-colors"
            style={{
              borderRadius: 'var(--btn-radius)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-color-primary)',
            }}
          >
            <Phone className="w-4 h-4" />
            {phoneDisplay || phone}
          </a>
        )}

        {/* Reserve CTA */}
        <Link
          href={resolvedCtaHref}
          className="flex-1 flex items-center justify-center h-11 transition-colors"
          style={{
            borderRadius: 'var(--btn-radius)',
            backgroundColor: 'var(--primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-color-inverse)',
          }}
        >
          {resolvedCtaLabel}
        </Link>
      </div>
    </div>
  );
}
