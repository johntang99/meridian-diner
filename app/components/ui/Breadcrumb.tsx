import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumb({
  items,
  showHome = true,
  homeHref = '/',
  separator,
  className,
}: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight size={16} className="text-[var(--text-color-muted)]" />;
  const sep = separator || defaultSeparator;
  
  return (
    <nav className={cn('flex items-center space-x-2 text-small', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="text-[var(--text-color-secondary)] hover:text-primary transition-colors flex items-center"
              >
                <Home size={16} />
              </Link>
            </li>
            {items.length > 0 && <li className="flex items-center">{sep}</li>}
          </>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--text-color-secondary)] hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? 'text-[var(--text-color-primary)] font-medium' : 'text-[var(--text-color-secondary)]')}>
                  {item.label}
                </span>
              )}
              
              {!isLast && <span className="flex items-center">{sep}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
