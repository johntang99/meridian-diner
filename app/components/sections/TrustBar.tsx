import Image from 'next/image';

interface TrustBarItem {
  type: 'press' | 'award' | 'rating';
  label: string;
  logo?: string;
  value?: string;
  count?: string;
}

interface TrustBarProps {
  variant?: 'logos-only' | 'logos-with-rating' | 'awards-strip';
  items: TrustBarItem[];
}

export default function TrustBar({ variant = 'logos-only', items }: TrustBarProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      className="py-5 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: 'var(--menu-divider)',
        borderBottom: 'var(--menu-divider)',
      }}
    >
      <div
        className="mx-auto px-6 flex items-center justify-center gap-8 md:gap-12 flex-wrap"
        style={{ maxWidth: 'var(--container-max, 1200px)' }}
      >
        {items.map((item, i) => {
          if (item.type === 'rating' && variant === 'logos-with-rating') {
            return (
              <div key={i} className="flex items-center gap-2">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4"
                      fill={star <= Math.round(parseFloat(item.value || '5')) ? 'var(--primary)' : 'var(--border-default)'}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-color-secondary)',
                  }}
                >
                  {item.value} · {item.count}
                </span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className="flex items-center gap-2 transition-all hover:opacity-100 group"
              style={{ opacity: 0.9 }}
            >
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.label}
                  width={80}
                  height={28}
                  className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all"
                  style={{ transitionDuration: 'var(--duration-base)' }}
                />
              ) : (
                <span
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text-on-dark-secondary)',
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
