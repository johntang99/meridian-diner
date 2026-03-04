'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MapPin, ArrowRight } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

interface FooterColumn {
  heading: string;
  links: Array<{ text: string; url: string; feature_gate?: string }>;
}

export interface RestaurantFooterConfig {
  variant?: 'dark' | 'light';
  tagline?: string;
  columns?: {
    story?: boolean;
    hours?: boolean;
    address?: boolean;
    links?: boolean;
  };
  explore?: FooterColumn;
  show_newsletter?: boolean;
  newsletter_headline?: string;
  newsletter_placeholder?: string;
  newsletter_button?: string;
  show_lang_switcher?: boolean;
  copyright?: string;
  legal_links?: Array<{ text: string; url: string }>;
}

interface SiteData {
  businessName?: string;
  clinicName?: string;
  name?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    wechat?: string;
    yelp?: string;
    google_maps?: string;
  };
  hours?: {
    schedule?: Array<{ day: string; hours: string }>;
    note?: string;
  } | string[];
}

interface RestaurantFooterProps {
  locale: Locale;
  siteId: string;
  siteData?: SiteData;
  footerConfig?: RestaurantFooterConfig;
  features?: Record<string, boolean>;
}

export default function RestaurantFooter({
  locale,
  siteId,
  siteData,
  footerConfig,
  features,
}: RestaurantFooterProps) {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const currentYear = new Date().getFullYear();

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('#')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    if (url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const isFeatureEnabled = (gate?: string) => {
    if (!gate) return true;
    if (!features) return true;
    return features[gate] !== false;
  };

  const columns = footerConfig?.columns || { story: true, hours: true, address: true, links: true };
  const businessName = siteData?.businessName || siteData?.clinicName || siteData?.name || 'The Meridian';
  const copyright = (footerConfig?.copyright || `© {year} ${businessName}. All rights reserved.`).replace('{year}', String(currentYear));

  // Hours rendering
  const renderHours = () => {
    if (!siteData?.hours) return null;
    if (Array.isArray(siteData.hours)) {
      return siteData.hours.map((line, i) => (
        <div key={i} style={{ fontSize: '0.8125rem', lineHeight: '1.8', color: 'var(--text-color-secondary)' }}>
          {line}
        </div>
      ));
    }
    if (siteData.hours.schedule) {
      return siteData.hours.schedule.map((s, i) => (
        <div key={i} className="flex justify-between gap-4" style={{ fontSize: '0.8125rem', lineHeight: '1.8' }}>
          <span style={{ color: 'var(--text-color-secondary)' }}>{s.day}</span>
          <span style={{ color: s.hours.toLowerCase() === 'closed' ? 'var(--text-color-muted)' : 'var(--text-color-secondary)' }}>
            {s.hours}
          </span>
        </div>
      ));
    }
    return null;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, siteId }),
      });
      setNewsletterStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  // Social icons — only show non-empty
  const socialLinks = [
    { key: 'instagram', url: siteData?.social?.instagram, icon: Instagram },
    { key: 'facebook', url: siteData?.social?.facebook, icon: Facebook },
  ].filter(s => s.url);

  const exploreLinks = footerConfig?.explore?.links || [
    { text: locale === 'en' ? 'Menu' : locale === 'zh' ? '菜单' : 'Menú', url: '/menu' },
    { text: locale === 'en' ? 'About' : locale === 'zh' ? '关于' : 'Acerca', url: '/about' },
    { text: locale === 'en' ? 'Events' : locale === 'zh' ? '活动' : 'Eventos', url: '/events' },
    { text: locale === 'en' ? 'Gallery' : locale === 'zh' ? '画廊' : 'Galería', url: '/gallery' },
    { text: locale === 'en' ? 'Private Dining' : locale === 'zh' ? '私人宴会' : 'Comedor Privado', url: '/private-dining' },
    { text: locale === 'en' ? 'Gift Cards' : locale === 'zh' ? '礼品卡' : 'Tarjetas de Regalo', url: '/gift-cards' },
    { text: locale === 'en' ? 'Careers' : locale === 'zh' ? '招聘' : 'Carreras', url: '/careers' },
    { text: locale === 'en' ? 'Contact' : locale === 'zh' ? '联系' : 'Contacto', url: '/contact' },
  ];

  const headingLabels = {
    hours: locale === 'en' ? 'Hours' : locale === 'zh' ? '营业时间' : 'Horarios',
    findUs: locale === 'en' ? 'Find Us' : locale === 'zh' ? '地址' : 'Encuéntranos',
    explore: locale === 'en' ? 'Explore' : locale === 'zh' ? '探索' : 'Explorar',
    directions: locale === 'en' ? 'Get Directions' : locale === 'zh' ? '获取路线' : 'Cómo Llegar',
  };

  return (
    <footer style={{ backgroundColor: 'var(--backdrop-primary)', color: 'var(--text-color-secondary)' }}>
      {/* Main Footer */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-max, 1200px)', paddingTop: 'var(--section-py-sm, 3.5rem)', paddingBottom: 'var(--section-py-sm, 3.5rem)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Story */}
          {columns.story && (
            <div>
              <div
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.5rem)',
                  lineHeight: '1.15',
                  letterSpacing: 'var(--tracking-heading)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {businessName}
              </div>
              <p
                className="mb-5"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  lineHeight: 'var(--leading-body, 1.65)',
                  color: 'var(--text-color-muted)',
                }}
              >
                {footerConfig?.tagline || siteData?.tagline || ''}
              </p>

              {/* Social icons */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mb-4">
                  {socialLinks.map(({ key, url, icon: Icon }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-color-muted)' }}
                      aria-label={key}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                  {siteData?.social?.yelp && (
                    <a
                      href={siteData.social.yelp}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-color-muted)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700 }}
                      aria-label="Yelp"
                    >
                      Yelp
                    </a>
                  )}
                </div>
              )}

              {/* Lang switcher */}
              {footerConfig?.show_lang_switcher !== false && (
                <LanguageSwitcher currentLocale={locale} variant="topbar" />
              )}
            </div>
          )}

          {/* Column 2: Hours */}
          {columns.hours && (
            <div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  letterSpacing: 'var(--tracking-label)',
                  textTransform: 'uppercase' as const,
                  color: 'var(--text-color-primary)',
                }}
              >
                {headingLabels.hours}
              </h3>
              {renderHours()}
            </div>
          )}

          {/* Column 3: Find Us */}
          {columns.address && (
            <div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  letterSpacing: 'var(--tracking-label)',
                  textTransform: 'uppercase' as const,
                  color: 'var(--text-color-primary)',
                }}
              >
                {headingLabels.findUs}
              </h3>
              <div style={{ fontSize: '0.8125rem', lineHeight: '1.8', color: 'var(--text-color-secondary)' }}>
                {siteData?.address && <div>{siteData.address}</div>}
                {(siteData?.city || siteData?.state) && (
                  <div>{[siteData.city, siteData.state, siteData.zip].filter(Boolean).join(', ')}</div>
                )}
                {siteData?.phone && (
                  <div className="mt-3">
                    <a
                      href={`tel:${siteData.phone.replace(/\D/g, '')}`}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-color-secondary)' }}
                    >
                      {siteData.phone}
                    </a>
                  </div>
                )}
                {siteData?.email && (
                  <div>
                    <a
                      href={`mailto:${siteData.email}`}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-color-secondary)' }}
                    >
                      {siteData.email}
                    </a>
                  </div>
                )}
                {siteData?.social?.google_maps && (
                  <div className="mt-3">
                    <a
                      href={siteData.social.google_maps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--primary)', fontSize: '0.8125rem' }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {headingLabels.directions}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Column 4: Explore links */}
          {columns.links && (
            <div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  letterSpacing: 'var(--tracking-label)',
                  textTransform: 'uppercase' as const,
                  color: 'var(--text-color-primary)',
                }}
              >
                {headingLabels.explore}
              </h3>
              <ul className="space-y-2">
                {exploreLinks.filter(l => isFeatureEnabled(l.feature_gate)).map((link) => (
                  <li key={link.url}>
                    <Link
                      href={localizeUrl(link.url)}
                      className="hover:opacity-80 transition-opacity"
                      style={{ fontSize: '0.8125rem', color: 'var(--text-color-secondary)' }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter */}
      {footerConfig?.show_newsletter !== false && (
        <div style={{ borderTop: 'var(--menu-divider)' }}>
          <div className="mx-auto px-6 py-8" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-subheading, 1.125rem)',
                  color: 'var(--text-color-primary)',
                }}
              >
                {footerConfig?.newsletter_headline || (locale === 'en' ? 'Stay in the loop' : locale === 'zh' ? '保持联系' : 'Mantente informado')}
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={footerConfig?.newsletter_placeholder || (locale === 'en' ? 'Enter your email' : locale === 'zh' ? '输入您的邮箱' : 'Tu correo electrónico')}
                  className="flex-1 md:w-64 px-4 py-2.5 outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--btn-radius)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--text-color-primary)',
                    border: 'var(--menu-divider)',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="inline-flex items-center gap-1 px-5 py-2.5 transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-color-inverse)',
                    borderRadius: 'var(--btn-radius)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {footerConfig?.newsletter_button || (locale === 'en' ? 'Subscribe' : locale === 'zh' ? '订阅' : 'Suscribir')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <span style={{ color: 'var(--color-success)', fontSize: '0.8125rem' }}>
                  {locale === 'en' ? 'Thank you!' : locale === 'zh' ? '谢谢！' : '¡Gracias!'}
                </span>
              )}
              {newsletterStatus === 'error' && (
                <span style={{ color: 'var(--color-error)', fontSize: '0.8125rem' }}>
                  {locale === 'en' ? 'Something went wrong.' : locale === 'zh' ? '出错了' : 'Algo salió mal.'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div style={{ borderTop: 'var(--menu-divider)' }}>
        <div className="mx-auto px-6 py-5" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3" style={{ fontSize: '0.75rem', color: 'var(--text-color-muted)' }}>
            <div>{copyright}</div>
            {footerConfig?.legal_links && footerConfig.legal_links.length > 0 && (
              <div className="flex gap-6">
                {footerConfig.legal_links.map((link) => (
                  <Link
                    key={link.url}
                    href={localizeUrl(link.url)}
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-color-muted)' }}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
