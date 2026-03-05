import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                'peer h-5 w-5 appearance-none rounded-[var(--radius-base,0.25rem)] border-2 border-[var(--border-default)] bg-[var(--color-surface)] transition-all',
                'checked:border-primary checked:bg-primary',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:bg-[var(--backdrop-secondary)]',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
            <Check
              size={16}
              className="absolute left-0.5 top-0.5 text-[var(--text-color-inverse)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
              strokeWidth={3}
            />
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-small font-medium text-[var(--text-color-secondary)] cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="text-small text-[var(--color-error)] ml-8">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Component
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const radioId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={cn(
              'h-5 w-5 border-2 border-[var(--border-default)] text-primary transition-all',
              'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-[var(--backdrop-secondary)]',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          
          {label && (
            <label
              htmlFor={radioId}
              className="text-small font-medium text-[var(--text-color-secondary)] cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="text-small text-[var(--color-error)] ml-8">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Checkbox;
