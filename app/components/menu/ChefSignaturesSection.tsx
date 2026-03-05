'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';

interface ChefSignature {
  name: string;
  description: string;
  menuType: string;
  image?: string;
  badges?: string[];
  highlights?: string[];
  pairing?: string;
  ctaLabel?: string;
}

interface ChefSignaturesSectionProps {
  locale: string;
  signatures: ChefSignature[];
  variant?: 'rich' | 'compact';
  subtitle?: string;
  showViewAllMenusButton?: boolean;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80&auto=format&fit=crop';

export default function ChefSignaturesSection({
  locale,
  signatures,
  variant = 'rich',
  subtitle = 'Hand-selected dinner signatures from our kitchen.',
  showViewAllMenusButton = false,
}: ChefSignaturesSectionProps) {
  const [selectedSignature, setSelectedSignature] = useState<ChefSignature | null>(null);
  const isCompact = variant === 'compact';

  const normalizedSignatures = useMemo(
    () =>
      signatures.map((signature) => ({
        ...signature,
        image: signature.image || fallbackImage,
        badges: Array.isArray(signature.badges) ? signature.badges : [],
        highlights: Array.isArray(signature.highlights) ? signature.highlights : [],
      })),
    [signatures]
  );

  return (
    <>
      <section
        className="px-6"
        style={{
          paddingTop: isCompact ? 'var(--section-py-sm, 3rem)' : 'var(--section-py, 4rem)',
          paddingBottom: isCompact ? 'var(--section-py-sm, 3rem)' : 'var(--section-py, 4rem)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
          <h2
            className="mb-3 text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              fontWeight: 700,
              color: 'var(--text-on-dark-primary)',
            }}
          >
            Chef&apos;s Signature
          </h2>
          <p
            className="mx-auto mb-6 text-center"
            style={{
              maxWidth: '680px',
              color: 'var(--text-on-dark-secondary)',
              fontSize: 'var(--text-body, 1rem)',
              lineHeight: 'var(--leading-body, 1.65)',
            }}
          >
            {subtitle}
          </p>
          <div className={`grid grid-cols-1 ${isCompact ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'} gap-6`}>
            {normalizedSignatures.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedSignature(item)}
                className="border border-[var(--border-subtle)] p-0 text-left overflow-hidden transition-all duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-base, 0.75rem)',
                  boxShadow: 'var(--shadow-base)',
                }}
              >
                <div className={`relative ${isCompact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                  <Image
                    src={item.image || fallbackImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className={isCompact ? 'px-4 py-4' : 'px-5 py-5'}>
                  <p style={{ fontWeight: 700, fontSize: isCompact ? '0.95rem' : undefined, color: 'var(--text-color-primary)' }}>{item.name}</p>
                  <p className="mt-2" style={{ color: 'var(--text-color-secondary)', fontSize: isCompact ? '0.85rem' : undefined }}>
                    {item.description}
                  </p>
                  <p className={`${isCompact ? 'mt-2' : 'mt-3'} text-small`} style={{ color: 'var(--text-color-accent)', fontWeight: 600 }}>
                    View details
                  </p>
                </div>
              </button>
            ))}
          </div>
          {showViewAllMenusButton && (
            <div className="mt-8 text-center">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex items-center px-5 py-2.5 text-small font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', borderRadius: 'var(--radius-base, 0.5rem)' }}
              >
                View All Menus
              </Link>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={Boolean(selectedSignature)}
        onClose={() => setSelectedSignature(null)}
        title={selectedSignature?.name || 'Chef Signature'}
        size="lg"
      >
        {selectedSignature && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--radius-base, 0.75rem)' }}>
              <Image
                src={selectedSignature.image || fallbackImage}
                alt={selectedSignature.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(selectedSignature.badges || []).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full px-3 py-1 text-small"
                    style={{ backgroundColor: 'var(--backdrop-secondary)', color: 'var(--text-color-primary)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p style={{ color: 'var(--text-color-secondary)' }}>{selectedSignature.description}</p>
              {(selectedSignature.highlights || []).length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-small font-semibold">Highlights</p>
                  <ul className="space-y-1 text-small" style={{ color: 'var(--text-color-secondary)' }}>
                    {selectedSignature.highlights?.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedSignature.pairing && (
                <p className="mt-4 text-small">
                  <span className="font-semibold">Suggested pairing:</span> {selectedSignature.pairing}
                </p>
              )}
              <div className="mt-6">
                <Link
                  href={`/${locale}/menu/${selectedSignature.menuType}`}
                  className="inline-flex items-center px-4 py-2 text-small font-semibold"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', borderRadius: 'var(--radius-base, 0.5rem)' }}
                >
                  {selectedSignature.ctaLabel || 'View Menu Category'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
