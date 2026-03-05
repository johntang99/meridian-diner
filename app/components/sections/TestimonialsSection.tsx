import { Testimonial } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Star, ArrowRight } from 'lucide-react';

export interface TestimonialsSectionProps {
  variant?: 'carousel' | 'grid' | 'masonry' | 'slider-vertical' | 'featured-single';
  badge?: string;
  title: string;
  subtitle?: string;
  testimonials: Array<{
    quote: string;
    name: string;
    condition: string;
  }>;
  moreLink?: {
    text: string;
    url: string;
  };
  className?: string;
}

export default function TestimonialsSection({
  variant = 'grid',
  badge,
  title,
  subtitle,
  testimonials,
  moreLink,
  className,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const limited = testimonials.slice(0, 6);
  const single = testimonials[0];
  
  return (
    <section className={cn('section-padding px-4 bg-[var(--color-surface)]', className)}>
      <div className="container-custom max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          {badge && (
            <span className="inline-block px-4 py-2 bg-[var(--backdrop-secondary)] text-[var(--text-on-dark-primary)] rounded-full text-small font-semibold mb-4">
              {badge}
            </span>
          )}
          <h2 className="text-heading font-bold mb-4 text-[var(--text-on-dark-primary)]">{title}</h2>
          {subtitle && <p className="text-subheading text-[var(--text-on-dark-secondary)]">{subtitle}</p>}
        </div>
        
        {variant === 'featured-single' && single ? (
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-[var(--color-surface)] p-10 border-2 border-[var(--border-subtle)]"
              style={{ borderRadius: 'var(--radius-base, 1rem)', boxShadow: 'var(--shadow-base)' }}
            >
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ fill: 'var(--secondary-light)', color: 'var(--secondary-light)' }} />
                ))}
              </div>
              <p className="text-[var(--text-color-secondary)] italic mb-8 leading-relaxed text-subheading text-center">
                &ldquo;{single.quote}&rdquo;
              </p>
              <div className="border-t border-[var(--border-subtle)] pt-4 text-center">
                <p className="font-semibold text-[var(--text-color-primary)]">{single.name}</p>
                <p className="text-small text-[var(--text-on-dark-primary)]">{single.condition}</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              variant === 'masonry' && 'columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]',
              variant === 'slider-vertical' && 'max-w-3xl mx-auto space-y-6',
              (variant === 'grid' || variant === 'carousel') && 'grid md:grid-cols-2 xl:grid-cols-4 gap-6'
            )}
          >
            {limited.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  'bg-[var(--color-surface)] p-8 border-2 border-[var(--border-subtle)] hover:border-primary transition-all',
                  variant === 'masonry' && 'break-inside-avoid mb-6',
                  variant === 'slider-vertical' && 'w-full'
                )}
                style={{ borderRadius: 'var(--radius-base, 0.75rem)', boxShadow: 'var(--shadow-base)' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: 'var(--secondary-light)', color: 'var(--secondary-light)' }} />
                  ))}
                </div>
                
                <p className="text-[var(--text-color-secondary)] italic mb-6 leading-relaxed text-body">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <p className="font-semibold text-[var(--text-color-primary)]">{testimonial.name}</p>
                  <p className="text-small text-[var(--text-on-dark-primary)]">{testimonial.condition}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* More Link */}
        {moreLink && (
          <div className="text-center mt-10">
            <a
              href={moreLink.url}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-subheading group"
            >
              {moreLink.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
