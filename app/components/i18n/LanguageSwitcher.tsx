'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale, switchLocale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  variant?: 'default' | 'topbar';
}

const languages: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'ES' },
  { code: 'ko', label: '한국' },
];

export default function LanguageSwitcher({ currentLocale, variant = 'default' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    const newPath = switchLocale(pathname, newLocale);
    router.push(newPath);
  };

  if (variant === 'topbar') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang, i) => (
          <span key={lang.code} className="flex items-center">
            <button
              onClick={() => handleLocaleChange(lang.code)}
              className={`text-small transition-colors ${
                currentLocale === lang.code
                  ? 'font-semibold'
                  : ''
              }`}
              style={{
                color:
                  currentLocale === lang.code
                    ? 'var(--text-on-dark-primary, #fff)'
                    : 'var(--text-on-dark-secondary, rgba(255,255,255,0.9))',
              }}
            >
              {lang.label}
            </button>
            {i < languages.length - 1 && (
              <span className="mx-1" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.65))' }}>|</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center border border-[var(--border-default)] overflow-hidden"
      style={{ borderRadius: 'var(--radius-base, 0.5rem)' }}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLocaleChange(lang.code)}
          className={`px-2.5 py-1.5 text-small font-medium transition-colors ${
            currentLocale === lang.code
              ? 'bg-primary text-[var(--text-color-inverse)]'
              : 'bg-[var(--color-surface)] text-[var(--text-color-secondary)] hover:bg-[var(--backdrop-secondary)]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
