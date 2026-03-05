import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      rounded = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors';
    
    const variants = {
      primary: 'bg-primary-50 text-primary',
      secondary: 'bg-secondary-50 text-primary',
      success: 'bg-green-50 text-green-700',
      warning: 'bg-amber-50 text-amber-700',
      error: 'bg-red-50 text-red-700',
      info: 'bg-blue-50 text-blue-700',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-small',
      md: 'px-3 py-1 text-body',
      lg: 'px-4 py-1.5 text-subheading',
    };
    
    const roundedStyle = rounded ? 'rounded-full' : 'rounded-[var(--radius-base,0.5rem)]';
    
    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyle,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
