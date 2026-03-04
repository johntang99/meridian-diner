'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

export interface RestaurantHeaderConfig {
  topbar?: {
    phone?: string;
    phoneHref?: string;
    message?: string;
    show?: boolean;
  };
  menu?: {
    variant?: 'default' | 'transparent';
    fontWeight?: 'regular' | 'semibold';
    logo?: {
      type?: 'text' | 'image';
      text?: string;
      subtext?: string;
      image?: { src?: string; alt?: string };
    };
    items?: Array<{
      text: string;
      url: string;
      feature_gate?: string;
      children?: Array<{ text: string; url: string; feature_gate?: string }>;
    }>;
  };
  cta?: {
    text?: string;
    link?: string;
  };
  transparent_hero?: boolean;
}

interface RestaurantHeaderProps {
  locale: Locale;
  siteId: string;
  siteInfo?: SiteInfo;
  headerConfig?: RestaurantHeaderConfig;
  features?: Record<string, boolean>;
}

export default function RestaurantHeader({
  locale,
  siteId,
  siteInfo,
  headerConfig,
  features,
}: RestaurantHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onLocaleHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const isTransparent =
    (headerConfig?.menu?.variant === 'transparent' || headerConfig?.transparent_hero) &&
    onLocaleHome;
  const transparentLight = isTransparent && !scrolled;

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('#')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    if (url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const normalizePath = (value?: string | null) => {
    if (!value) return '';
    const noHash = value.split('#')[0];
    const noQuery = noHash.split('?')[0];
    if (!noQuery) return '';
    return noQuery.length > 1 ? noQuery.replace(/\/+$/, '') : noQuery;
  };

  const isActive = (itemUrl: string) => {
    if (!itemUrl.startsWith('/')) return false;
    const current = normalizePath(pathname);
    const target = normalizePath(itemUrl);
    if (!current || !target) return false;
    if (current === target) return true;
    if (target !== `/${locale}` && current.startsWith(`${target}/`)) return true;
    return false;
  };

  // Filter items by feature gate
  const isFeatureEnabled = (gate?: string) => {
    if (!gate) return true;
    if (!features) return true;
    return features[gate] !== false;
  };

  const navItems = (headerConfig?.menu?.items || []).filter(item => isFeatureEnabled(item.feature_gate));
  const cta = headerConfig?.cta || { text: 'Reserve a Table', link: '/reservations' };
  const ctaLink = localizeUrl(cta.link || '/reservations');

  const topbar = headerConfig?.topbar;
  const showTopbar = topbar?.show !== false && (topbar?.phone || topbar?.message);
  const logoConfig = headerConfig?.menu?.logo;
  const siteDisplayName = getSiteDisplayName(siteInfo, 'The Meridian');

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const renderLogo = () => {
    if (logoConfig?.type === 'image' && logoConfig.image?.src) {
      return (
        <Image
          src={logoConfig.image.src}
          alt={logoConfig.image.alt || siteDisplayName}
          width={160}
          height={40}
          className={`h-8 w-auto transition-all ${transparentLight ? 'brightness-0 invert' : ''}`}
          style={{ transitionDuration: 'var(--duration-base)' }}
        />
      );
    }

    return (
      <div className="flex flex-col items-start">
        <span
          className="font-semibold transition-colors"
          style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: 'var(--tracking-nav)',
            fontSize: 'var(--text-subheading, 1.125rem)',
            color: transparentLight ? '#FFFFFF' : 'var(--text-color-primary)',
            transitionDuration: 'var(--duration-base)',
          }}
        >
          {logoConfig?.text || siteDisplayName}
        </span>
        {logoConfig?.subtext && (
          <span
            className="transition-colors"
            style={{
              fontFamily: 'var(--font-body)',
              letterSpacing: 'var(--tracking-label)',
              fontSize: '0.65rem',
              color: transparentLight ? 'rgba(255,255,255,0.7)' : 'var(--text-color-muted)',
              transitionDuration: 'var(--duration-base)',
            }}
          >
            {logoConfig.subtext}
          </span>
        )}
      </div>
    );
  };

  const spacerHeight = isTransparent && onLocaleHome
    ? '0px'
    : showTopbar
      ? 'calc(var(--nav-height, 72px) + 36px)'
      : 'var(--nav-height, 72px)';

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)' }}
      >
        Skip to main content
      </a>

      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top Bar */}
        {showTopbar && (
          <div
            className={`hidden md:block overflow-hidden transition-all`}
            style={{
              transitionDuration: 'var(--duration-slow, 500ms)',
              maxHeight: scrolled ? '0px' : '40px',
              opacity: scrolled ? 0 : 1,
            }}
          >
            <div
              style={{
                height: '36px',
                backgroundColor: 'var(--backdrop-primary)',
                color: 'var(--text-color-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
              }}
            >
              <div
                className="mx-auto h-full flex items-center justify-between px-6"
                style={{ maxWidth: 'var(--container-max, 1200px)' }}
              >
                {/* Left: Phone */}
                <div>
                  {topbar?.phone && (
                    <a
                      href={topbar.phoneHref || `tel:${topbar.phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-color-secondary)' }}
                    >
                      <Phone className="w-3 h-3" />
                      {topbar.phone}
                    </a>
                  )}
                </div>
                {/* Center: Message */}
                <div style={{ color: 'var(--text-color-muted)', letterSpacing: 'var(--tracking-label)' }}>
                  {topbar?.message || ''}
                </div>
                {/* Right: Language Switcher */}
                <div>
                  <LanguageSwitcher currentLocale={locale} variant="topbar" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <header
          className="transition-all"
          style={{
            backgroundColor: transparentLight ? 'transparent' : 'var(--backdrop-primary)',
            borderBottom: transparentLight ? 'none' : 'var(--menu-divider)',
            transitionDuration: 'var(--duration-base)',
            transitionTimingFunction: 'var(--easing)',
            backdropFilter: !transparentLight && scrolled ? 'blur(12px)' : undefined,
          }}
        >
          <nav
            className="mx-auto flex items-center justify-between px-6"
            style={{ height: 'var(--nav-height, 72px)', maxWidth: 'var(--container-max, 1200px)' }}
          >
            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0">
              {renderLogo()}
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center" style={{ gap: '2rem' }}>
              {navItems.map((item) => {
                const url = localizeUrl(item.url);
                const hasChildren = item.children && item.children.filter(c => isFeatureEnabled(c.feature_gate)).length > 0;

                if (hasChildren) {
                  return (
                    <div
                      key={item.text}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.text)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <Link
                        href={url}
                        className="flex items-center gap-1 transition-colors"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.875rem',
                          letterSpacing: 'var(--tracking-nav)',
                          fontWeight: headerConfig?.menu?.fontWeight === 'regular' ? 400 : 600,
                          color: isActive(url)
                            ? transparentLight ? '#FFFFFF' : 'var(--text-color-primary)'
                            : transparentLight ? 'rgba(255,255,255,0.8)' : 'var(--text-color-muted)',
                          transitionDuration: 'var(--duration-base)',
                        }}
                      >
                        {item.text}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Link>

                      {/* Dropdown */}
                      {activeDropdown === item.text && (
                        <div
                          className="absolute top-full left-0 pt-2"
                          style={{ minWidth: '180px' }}
                        >
                          <div
                            className="py-2"
                            style={{
                              backgroundColor: 'var(--color-surface, #FFFFFF)',
                              borderRadius: 'var(--card-radius)',
                              boxShadow: 'var(--shadow-card-hover)',
                              border: 'var(--menu-divider)',
                            }}
                          >
                            {item.children!.filter(c => isFeatureEnabled(c.feature_gate)).map((child) => (
                              <Link
                                key={child.url}
                                href={localizeUrl(child.url)}
                                className="block px-4 py-2 transition-colors hover:opacity-80"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '0.8125rem',
                                  color: isActive(localizeUrl(child.url)) ? 'var(--primary)' : 'var(--text-color-primary)',
                                }}
                              >
                                {child.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.text}
                    href={url}
                    className="transition-colors"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      letterSpacing: 'var(--tracking-nav)',
                      fontWeight: headerConfig?.menu?.fontWeight === 'regular' ? 400 : 600,
                      color: isActive(url)
                        ? transparentLight ? '#FFFFFF' : 'var(--text-color-primary)'
                        : transparentLight ? 'rgba(255,255,255,0.8)' : 'var(--text-color-muted)',
                      transitionDuration: 'var(--duration-base)',
                    }}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center transition-all"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  letterSpacing: 'var(--tracking-label)',
                  fontWeight: 600,
                  padding: '0.625rem 1.5rem',
                  borderRadius: 'var(--btn-radius)',
                  backgroundColor: transparentLight ? 'rgba(255,255,255,0.15)' : 'var(--primary)',
                  color: '#F5F0E8',
                  border: transparentLight ? '1px solid rgba(255,255,255,0.3)' : 'none',
                  transitionDuration: 'var(--duration-base)',
                }}
              >
                {cta.text || 'Reserve a Table'}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              style={{ color: transparentLight ? '#FFFFFF' : 'var(--text-color-primary)' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </header>
      </div>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div style={{ height: spacerHeight }} />

      {/* Mobile Full-Screen Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] lg:hidden flex flex-col overflow-y-auto"
          style={{
            backgroundColor: 'var(--backdrop-primary)',
            opacity: 0.98,
          }}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              style={{ color: 'var(--text-color-primary)' }}
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Nav items */}
          <div className="flex-1 flex flex-col px-6 pb-6 gap-1">
            {navItems.map((item) => {
              const url = localizeUrl(item.url);
              const hasChildren = item.children && item.children.filter(c => isFeatureEnabled(c.feature_gate)).length > 0;
              const isExpanded = expandedMobileItem === item.text;

              return (
                <div key={item.text}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={url}
                      className="py-3 transition-colors flex-1"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-subheading, 1.125rem)',
                        letterSpacing: 'var(--tracking-heading)',
                        color: isActive(url) ? 'var(--primary)' : 'var(--text-color-primary)',
                      }}
                    >
                      {item.text}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => setExpandedMobileItem(isExpanded ? null : item.text)}
                        className="p-2"
                        style={{ color: 'var(--text-color-muted)' }}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform`}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transitionDuration: 'var(--duration-base)',
                          }}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile dropdown children */}
                  {hasChildren && isExpanded && (
                    <div className="pl-4 pb-2">
                      {item.children!.filter(c => isFeatureEnabled(c.feature_gate)).map((child) => (
                        <Link
                          key={child.url}
                          href={localizeUrl(child.url)}
                          className="block py-2 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9375rem',
                            color: isActive(localizeUrl(child.url)) ? 'var(--primary)' : 'var(--text-color-secondary)',
                          }}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div style={{ borderBottom: 'var(--menu-divider)' }} />
                </div>
              );
            })}

            {/* Mobile CTA */}
            <div className="mt-6">
              <Link
                href={ctaLink}
                className="block text-center py-3 transition-all"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-label)',
                  borderRadius: 'var(--btn-radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-color-inverse)',
                }}
              >
                {cta.text || 'Reserve a Table'}
              </Link>
            </div>

            {/* Mobile phone */}
            {topbar?.phone && (
              <a
                href={topbar.phoneHref || `tel:${topbar.phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2 py-3 mt-2 transition-colors"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--text-color-secondary)',
                }}
              >
                <Phone className="w-4 h-4" />
                {topbar.phone}
              </a>
            )}

            {/* Mobile Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher currentLocale={locale} variant="topbar" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
