import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Phone, Mail } from 'lucide-react';

export interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  contactInfo?: string;
  variant?: 'centered' | 'split' | 'banner' | 'card-elevated';
  image?: string;
  className?: string;
}

export default function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  contactInfo,
  variant = 'centered',
  image,
  className,
}: CTASectionProps) {
  const onDarkPrimary = 'var(--text-on-dark-primary, #fff)';
  const onDarkSecondary = 'var(--text-on-dark-secondary, rgba(255,255,255,0.9))';
  const tokenSurfaceStyle = {
    borderRadius: 'var(--radius-base, 0.75rem)',
    boxShadow: 'var(--shadow-base, 0 4px 20px rgba(0,0,0,0.08))',
  };

  // Render based on variant
  switch (variant) {
    case 'split':
      return (
        <section className={cn('section-padding bg-[var(--backdrop-secondary)]', className)}>
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <h2 className="text-heading font-bold mb-4">{title}</h2>
                {subtitle && <p className="text-body text-[var(--text-color-secondary)] mb-8">{subtitle}</p>}
                <div className="flex gap-4 flex-wrap">
                  {primaryCta && (
                    <Button variant="primary" size="lg" asChild>
                      <Link href={primaryCta.link}>{primaryCta.text}</Link>
                    </Button>
                  )}
                  {secondaryCta && (
                    <Button variant="outline" size="lg" asChild>
                      <Link href={secondaryCta.link}>{secondaryCta.text}</Link>
                    </Button>
                  )}
                </div>
                {contactInfo && (
                  <p className="mt-6 text-[var(--text-color-secondary)] flex items-center gap-2">
                    <Phone size={18} className="text-primary" />
                    {contactInfo}
                  </p>
                )}
              </div>
              
              {/* Image */}
              {image && (
                <div className="relative h-64 md:h-96 overflow-hidden" style={tokenSurfaceStyle}>
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    
    case 'banner':
      return (
        <section className={cn('relative overflow-hidden', className)}>
          {/* Background */}
          {image ? (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/90 to-primary-dark/90" />
            </>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary-dark" />
          )}
          
          {/* Content */}
          <div className="relative z-10 container-custom py-20 md:py-32 text-center">
            <h2 className="text-heading font-bold mb-6" style={{ color: onDarkPrimary }}>{title}</h2>
            {subtitle && (
              <p className="text-subheading mb-8 max-w-2xl mx-auto" style={{ color: onDarkSecondary }}>{subtitle}</p>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              {primaryCta && (
                <Button variant="outline" size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                  <Link href={primaryCta.link}>{primaryCta.text}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button variant="ghost" size="lg" asChild className="border-2 border-white hover:bg-white/10" style={{ color: onDarkPrimary }}>
                  <Link href={secondaryCta.link}>{secondaryCta.text}</Link>
                </Button>
              )}
            </div>
            {contactInfo && (
              <p className="mt-8" style={{ color: onDarkSecondary }}>{contactInfo}</p>
            )}
          </div>
        </section>
      );
    
    case 'card-elevated':
      return (
        <section className={cn('section-padding bg-[var(--backdrop-secondary)]', className)}>
          <div className="container-custom">
            <Card variant="elevated" className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-dark" style={{ color: onDarkPrimary }}>
              <CardContent className="text-center py-12">
                <h2 className="text-heading font-bold mb-4">{title}</h2>
                {subtitle && (
                  <p className="text-body mb-8 max-w-2xl mx-auto" style={{ color: onDarkSecondary }}>{subtitle}</p>
                )}
                <div className="flex gap-4 justify-center flex-wrap">
                  {primaryCta && (
                    <Button variant="outline" size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                      <Link href={primaryCta.link}>{primaryCta.text}</Link>
                    </Button>
                  )}
                  {secondaryCta && (
                    <Button variant="ghost" size="lg" asChild className="border-2 border-white hover:bg-white/10" style={{ color: onDarkPrimary }}>
                      <Link href={secondaryCta.link}>{secondaryCta.text}</Link>
                    </Button>
                  )}
                </div>
                {contactInfo && (
                  <p className="mt-6" style={{ color: onDarkSecondary }}>{contactInfo}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      );
    
    case 'centered':
    default:
      return (
        <section
          className={cn('section-padding relative overflow-hidden', className)}
          style={!image ? { background: 'linear-gradient(135deg, var(--backdrop-primary) 0%, var(--backdrop-secondary) 100%)' } : undefined}
        >
          {image && (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 z-0" style={{ background: 'var(--color-overlay, rgba(0,0,0,0.45))' }} />
            </>
          )}
          <div className="container-custom text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-heading font-bold mb-6"
                style={{ color: image ? onDarkPrimary : 'var(--text-color-primary)' }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  className="text-body mb-8"
                  style={{ color: image ? onDarkSecondary : 'var(--text-color-secondary)' }}
                >
                  {subtitle}
                </p>
              )}
              <div className="flex gap-4 justify-center flex-wrap">
                {primaryCta && (
                  <Link
                    href={primaryCta.link}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 px-8 py-4 text-subheading bg-primary text-[var(--text-color-inverse)] hover:bg-primary-dark"
                    style={{ ...tokenSurfaceStyle, borderRadius: 'var(--radius-base, 0.5rem)' }}
                  >
                    {primaryCta.text}
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.link}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 px-8 py-4 text-subheading border-2"
                    style={{
                      ...tokenSurfaceStyle,
                      borderRadius: 'var(--radius-base, 0.5rem)',
                      borderColor: 'var(--text-color-accent)',
                      color: 'var(--text-color-accent)',
                    }}
                  >
                    {secondaryCta.text}
                  </Link>
                )}
              </div>
              {contactInfo && (
                <p className="mt-8 text-[var(--text-color-secondary)] flex items-center justify-center gap-2" style={{ color: image ? onDarkSecondary : 'var(--text-color-secondary)' }}>
                  <Phone size={18} className="text-primary" />
                  {contactInfo}
                </p>
              )}
            </div>
          </div>
        </section>
      );
  }
}
