import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-small font-medium text-[var(--text-color-secondary)]"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-[var(--radius-base,0.5rem)] border border-[var(--border-default)] bg-[var(--color-surface)] px-4 py-2.5 text-[var(--text-color-primary)] transition-colors',
            'placeholder:text-[var(--text-color-muted)]',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:bg-[var(--backdrop-secondary)] disabled:cursor-not-allowed',
            'resize-y min-h-[100px]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="text-small text-[var(--color-error)]">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-small text-[var(--text-color-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
