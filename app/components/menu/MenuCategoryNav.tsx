'use client';

import { useEffect, useRef, useState } from 'react';

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface MenuCategoryNavProps {
  variant?: 'tabs' | 'sidebar' | 'dropdown';
  categories: Category[];
}

export default function MenuCategoryNav({ variant = 'tabs', categories }: MenuCategoryNavProps) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const navRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // IntersectionObserver to update active tab on scroll
    const sections = categories.map(c => document.getElementById(c.slug)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach(section => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, [categories]);

  const scrollToSection = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72');
    const tabHeight = 56;
    const offset = navHeight + tabHeight + 16;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSlug(slug);
  };

  if (variant === 'dropdown') {
    return (
      <div
        className="sticky z-40 px-6 py-3"
        style={{
          top: 'var(--nav-height, 72px)',
          backgroundColor: 'var(--menu-list-surface, #FFFFFF)',
          borderBottom: 'var(--menu-list-divider, 1px solid #E5E7EB)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <select
            value={activeSlug}
            onChange={(e) => scrollToSection(e.target.value)}
            className="w-full md:w-auto px-4 py-2 outline-none"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              backgroundColor: 'var(--menu-list-surface, #FFFFFF)',
              color: 'var(--menu-list-text-primary, #111827)',
              borderRadius: 'var(--radius-base, 0.5rem)',
              border: '1px solid var(--menu-list-border, #D1D5DB)',
            }}
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // tabs (default)
  return (
    <div
      className="sticky z-40 overflow-hidden"
      style={{
        top: 'var(--nav-height, 72px)',
        backgroundColor: 'var(--menu-list-surface, #FFFFFF)',
        borderBottom: 'var(--menu-list-divider, 1px solid #E5E7EB)',
      }}
    >
      <div
        ref={navRef}
        className="mx-auto px-6 flex overflow-x-auto scrollbar-hide md:justify-center"
        style={{
          maxWidth: 'var(--container-max, 1200px)',
          gap: '2rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => scrollToSection(cat.slug)}
              className="relative whitespace-nowrap py-4 transition-colors flex-shrink-0"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: 'var(--tracking-nav)',
                color: isActive ? 'var(--menu-list-text-primary, #111827)' : 'var(--menu-list-text-muted, #6B7280)',
                transitionDuration: 'var(--duration-base)',
              }}
            >
              {cat.name}
              {/* Active indicator */}
              <span
                className="absolute bottom-0 left-0 right-0 transition-all"
                style={{
                  height: '2px',
                  backgroundColor: 'var(--menu-list-accent, #111827)',
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transitionDuration: 'var(--duration-base)',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
