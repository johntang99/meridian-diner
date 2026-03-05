'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string | string[];
  className?: string;
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultOpen) return [];
    return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  });
  
  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);
      
      if (allowMultiple) {
        return isOpen ? prev.filter((item) => item !== id) : [...prev, id];
      } else {
        return isOpen ? [] : [id];
      }
    });
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div
            key={item.id}
            className="border border-[var(--border-subtle)] rounded-[var(--radius-base,0.75rem)] overflow-hidden"
          >
            {/* Header */}
            <button
              id={`${item.id}-trigger`}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left bg-[var(--color-surface)] hover:bg-[var(--backdrop-secondary)] transition-colors"
              aria-expanded={isOpen}
              aria-controls={`${item.id}-content`}
            >
              <span className="font-semibold text-[var(--text-color-primary)]">
                {item.title}
              </span>
              <ChevronDown
                size={20}
                className={cn(
                  'text-[var(--text-color-muted)] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            
            {/* Content */}
            <div
              id={`${item.id}-content`}
              role="region"
              aria-labelledby={`${item.id}-trigger`}
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[1000px]' : 'max-h-0'
              )}
            >
              <div className="p-4 pt-0 text-[var(--text-color-secondary)] bg-[var(--backdrop-secondary)]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
