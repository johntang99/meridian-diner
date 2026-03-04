'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  headline?: string;
  items: FAQItem[];
  locale?: string;
}

export default function FAQSection({ headline, items, locale = 'en' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultHeadline =
    locale === 'en' ? 'Frequently Asked Questions'
    : locale === 'zh' ? '常见问题'
    : 'Preguntas Frecuentes';

  return (
    <section
      className="px-6"
      style={{
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        ['--text-color-primary' as any]: 'var(--heading-on-light, #111827)',
        ['--text-color-secondary' as any]: 'var(--body-on-light, #4B5563)',
        ['--text-color-muted' as any]: 'var(--muted-on-light, #6B7280)',
      } as any}
    >
      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        <h2
          className="text-center mb-10"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-heading, 2rem)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--text-color-primary)',
          }}
        >
          {headline || defaultHeadline}
        </h2>

        <div style={{ borderTop: '1px solid var(--border-default)' }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body, 1rem)',
                    fontWeight: 600,
                    color: 'var(--text-color-primary)',
                  }}
                >
                  <span className="pr-4">{item.question}</span>
                  <span
                    className="flex-shrink-0 transition-transform"
                    style={{
                      fontSize: '1.25rem',
                      color: 'var(--text-color-muted)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transitionDuration: 'var(--duration-base)',
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all"
                  style={{
                    maxHeight: isOpen ? '500px' : '0',
                    transitionDuration: 'var(--duration-base)',
                  }}
                >
                  <p
                    className="pb-5"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-small, 0.875rem)',
                      color: 'var(--text-color-secondary)',
                      lineHeight: 'var(--leading-body, 1.65)',
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
