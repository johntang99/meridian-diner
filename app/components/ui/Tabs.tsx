'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id?: string;
  value?: string;
  label: string;
  content: React.ReactNode;
  icon?: string | React.ReactNode;
}

export interface TabsProps {
  tabs?: Tab[];
  items?: Tab[];
  defaultTab?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (tabId: string) => void;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export default function Tabs({
  tabs,
  items,
  defaultTab,
  defaultValue,
  value: controlledValue,
  onChange,
  onValueChange,
  variant = 'default',
  className,
}: TabsProps) {
  // Support both tabs and items prop
  const tabItems = items || tabs || [];
  
  // Support both id and value for tab identification
  const getTabId = (tab: Tab) => tab.value || tab.id || '';
  
  // Support both controlled and uncontrolled mode
  const initialTab = controlledValue || defaultValue || defaultTab || getTabId(tabItems[0]);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Use controlled value if provided
  const currentTab = controlledValue !== undefined ? controlledValue : activeTab;
  
  const handleTabChange = (tabId: string) => {
    if (controlledValue === undefined) {
      setActiveTab(tabId);
    }
    onChange?.(tabId);
    onValueChange?.(tabId);
  };
  
  const activeTabContent = tabItems.find((tab) => getTabId(tab) === currentTab)?.content;
  
  const variants = {
    default: {
      container: 'border-b border-[var(--border-subtle)]',
      button: 'px-4 py-2 font-medium transition-colors',
      active: 'border-b-2 border-primary text-primary',
      inactive: 'text-[var(--text-color-secondary)] hover:text-[var(--text-color-primary)]',
    },
    pills: {
      container: 'bg-[var(--backdrop-secondary)] rounded-[var(--radius-base,0.5rem)] p-1',
      button: 'px-4 py-2 rounded-[calc(var(--radius-base,0.5rem)-2px)] font-medium transition-all',
      active: 'bg-[var(--color-surface)] text-primary shadow-[var(--shadow-base)]',
      inactive: 'text-[var(--text-color-secondary)] hover:text-[var(--text-color-primary)]',
    },
    underline: {
      container: 'space-x-8',
      button: 'pb-3 font-medium transition-colors relative',
      active: 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary',
      inactive: 'text-[var(--text-color-secondary)] hover:text-[var(--text-color-primary)]',
    },
  };
  
  const styles = variants[variant];
  
  return (
    <div className={className}>
      {/* Tab List */}
      <div className={cn('flex flex-wrap', styles.container)}>
        {tabItems.map((tab) => {
          const tabId = getTabId(tab);
          const isActive = currentTab === tabId;
          
          return (
            <button
              key={tabId}
              onClick={() => handleTabChange(tabId)}
              className={cn(
                styles.button,
                'flex items-center gap-2',
                isActive ? styles.active : styles.inactive
              )}
            >
              {tab.icon && (
                typeof tab.icon === 'string' ? (
                  <span>{tab.icon}</span>
                ) : (
                  <span>{tab.icon}</span>
                )
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  );
}
