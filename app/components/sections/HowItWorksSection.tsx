import { Badge, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Step } from '@/lib/types';

export interface HowItWorksSectionProps {
  badge?: string;
  title: string;
  subtitle?: string;
  steps: Step[];
  variant?: 'horizontal' | 'vertical' | 'cards' | 'vertical-image-right';
  image?: string;
  imageAlt?: string;
  className?: string;
}

export default function HowItWorksSection({
  badge,
  title,
  subtitle,
  steps,
  variant = 'horizontal',
  image,
  imageAlt,
  className,
}: HowItWorksSectionProps) {
  return (
    <section className={cn('section-padding bg-[var(--color-surface)]', className)}>
      <div className="container-custom">
        <div
          className="bg-[var(--color-surface)] p-8 md:p-12"
          style={{ borderRadius: 'var(--radius-base, 1.5rem)', boxShadow: 'var(--shadow-base)' }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
          {badge && (
            <Badge variant="primary" className="mb-4">
              {badge}
            </Badge>
          )}
          <h2 className="text-heading font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-[var(--text-color-secondary)] max-w-2xl mx-auto">{subtitle}</p>
          )}
          </div>

          {/* Render based on variant */}
          {variant === 'horizontal' && (
            <HowItWorksHorizontal steps={steps} />
          )}
          
          {variant === 'vertical' && (
            <HowItWorksVertical steps={steps} />
          )}
          
          {variant === 'cards' && (
            <HowItWorksCards steps={steps} />
          )}

          {variant === 'vertical-image-right' && (
            <HowItWorksVerticalImage steps={steps} image={image} imageAlt={imageAlt} />
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// VARIANT COMPONENTS
// ============================================

function HowItWorksHorizontal({ steps }: { steps: Step[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/30" />
          )}
          
          <div className="relative z-10">
            {/* Step Number */}
            <div
              className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-6 mx-auto"
              style={{ boxShadow: 'var(--shadow-base)' }}
            >
              <span className="text-heading font-bold text-[var(--text-color-inverse)]">
                {step.number}
              </span>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="text-subheading font-bold mb-3">{step.title}</h3>
              {step.duration && (
                <Badge variant="secondary" size="sm" className="mb-3">
                  {step.duration}
                </Badge>
              )}
              <p className="text-[var(--text-color-secondary)]">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HowItWorksVertical({ steps }: { steps: Step[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-6 items-start">
          {/* Step Number */}
          <div
            className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center"
            style={{ boxShadow: 'var(--shadow-base)' }}
          >
            <span className="text-subheading font-bold text-[var(--text-color-inverse)]">
              {step.number}
            </span>
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-subheading font-bold">{step.title}</h3>
              {step.duration && (
                <Badge variant="secondary" size="sm">
                  {step.duration}
                </Badge>
              )}
            </div>
            <p className="text-[var(--text-color-secondary)]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HowItWorksCards({ steps }: { steps: Step[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {steps.map((step, index) => (
        <Card key={index} variant="default" hover className="relative overflow-hidden">
          {/* Number Badge */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-subheading font-bold text-primary">
              {step.number}
            </span>
          </div>
          
          <CardContent className="pt-6">
            <h3 className="text-subheading font-bold mb-3 pr-12">
              {step.title}
            </h3>
            {step.duration && (
              <Badge variant="secondary" size="sm" className="mb-3">
                {step.duration}
              </Badge>
            )}
            <p className="text-[var(--text-color-secondary)]">{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HowItWorksVerticalImage({
  steps,
  image,
  imageAlt,
}: {
  steps: Step[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <HowItWorksVertical steps={steps} />
      </div>
      <div
        className="relative aspect-square overflow-hidden bg-transparent"
        style={{ borderRadius: 'var(--radius-base, 1rem)' }}
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt || 'How it works'}
            className="h-full w-full object-contain object-top"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5" />
        )}
      </div>
    </div>
  );
}
