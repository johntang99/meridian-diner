import { useState } from 'react';

interface MenuLayoutPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
}

type LayoutEntry = { id: string; variant?: string };

const HOME_SECTION_OPTIONS = [
  'hero',
  'trustBar',
  'todaysSpecial',
  'chefSignatures',
  'aboutPreview',
  'reservationsCTA',
  'testimonials',
  'eventsPreview',
  'gallery',
  'blog',
  'cta',
];

const MENU_SECTION_OPTIONS = [
  'hero',
  'todaysSpecial',
  'weeklySpecials',
  'chefSignatures',
  'menuCards',
];

const VARIANT_ENABLED = new Set(['todaysSpecial', 'weeklySpecials', 'chefSignatures']);
const VARIANT_OPTIONS = ['compact', 'rich'];

function normalizeEntries(input: any): LayoutEntry[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (typeof item === 'string') {
        return { id: item };
      }
      if (item && typeof item === 'object' && typeof item.id === 'string') {
        return {
          id: item.id,
          variant: typeof item.variant === 'string' ? item.variant : undefined,
        };
      }
      return null;
    })
    .filter(Boolean) as LayoutEntry[];
}

export function MenuLayoutPanel({ formData, updateFormValue }: MenuLayoutPanelProps) {
  const [pendingHomeSection, setPendingHomeSection] = useState('todaysSpecial');
  const [pendingMenuSection, setPendingMenuSection] = useState('weeklySpecials');

  const homeEntries = normalizeEntries(formData?.pages?.home);
  const menuEntries = normalizeEntries(formData?.pages?.menu);

  const updateEntries = (pageKey: 'home' | 'menu', next: LayoutEntry[]) => {
    updateFormValue(['pages', pageKey], next);
  };

  const moveEntry = (pageKey: 'home' | 'menu', index: number, direction: -1 | 1) => {
    const entries = pageKey === 'home' ? [...homeEntries] : [...menuEntries];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    const [entry] = entries.splice(index, 1);
    entries.splice(targetIndex, 0, entry);
    updateEntries(pageKey, entries);
  };

  const removeEntry = (pageKey: 'home' | 'menu', index: number) => {
    const entries = pageKey === 'home' ? [...homeEntries] : [...menuEntries];
    entries.splice(index, 1);
    updateEntries(pageKey, entries);
  };

  const addEntry = (pageKey: 'home' | 'menu', id: string) => {
    if (!id) return;
    const entries = pageKey === 'home' ? [...homeEntries] : [...menuEntries];
    entries.push({ id, variant: VARIANT_ENABLED.has(id) ? 'compact' : undefined });
    updateEntries(pageKey, entries);
  };

  const updateEntryId = (pageKey: 'home' | 'menu', index: number, id: string) => {
    const entries = pageKey === 'home' ? [...homeEntries] : [...menuEntries];
    const current = entries[index];
    if (!current) return;
    entries[index] = {
      id,
      variant: VARIANT_ENABLED.has(id) ? current.variant : undefined,
    };
    updateEntries(pageKey, entries);
  };

  const updateEntryVariant = (pageKey: 'home' | 'menu', index: number, variant: string) => {
    const entries = pageKey === 'home' ? [...homeEntries] : [...menuEntries];
    const current = entries[index];
    if (!current) return;
    entries[index] = {
      ...current,
      variant: variant || undefined,
    };
    updateEntries(pageKey, entries);
  };

  const renderSectionEditor = (
    pageKey: 'home' | 'menu',
    entries: LayoutEntry[],
    availableOptions: string[],
    pending: string,
    setPending: (value: string) => void
  ) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">
          {pageKey === 'home' ? 'Home Sections' : 'Menu Hub Sections'}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-gray-200 px-2 py-1 text-xs bg-white"
            value={pending}
            onChange={(event) => setPending(event.target.value)}
          >
            {availableOptions.map((option) => (
              <option key={`${pageKey}-add-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => addEntry(pageKey, pending)}
            className="px-2 py-1 rounded border border-gray-200 text-xs"
          >
            Add Section
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const variantAllowed = VARIANT_ENABLED.has(entry.id);
          return (
            <div
              key={`${pageKey}-${entry.id}-${index}`}
              className="border rounded-md p-2 grid gap-2 md:grid-cols-[1fr_140px_auto]"
            >
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Section ID</label>
                <select
                  className="w-full rounded-md border border-gray-200 px-2 py-2 text-sm bg-white"
                  value={entry.id}
                  onChange={(event) => updateEntryId(pageKey, index, event.target.value)}
                >
                  {availableOptions.map((option) => (
                    <option key={`${pageKey}-${index}-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Variant</label>
                <select
                  className="w-full rounded-md border border-gray-200 px-2 py-2 text-sm bg-white disabled:bg-gray-100"
                  value={variantAllowed ? entry.variant || '' : ''}
                  disabled={!variantAllowed}
                  onChange={(event) => updateEntryVariant(pageKey, index, event.target.value)}
                >
                  <option value="">Default</option>
                  {VARIANT_OPTIONS.map((option) => (
                    <option key={`${pageKey}-${index}-variant-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-1">
                <button
                  type="button"
                  onClick={() => moveEntry(pageKey, index, -1)}
                  disabled={index === 0}
                  className="px-2 py-2 rounded border border-gray-200 text-xs disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveEntry(pageKey, index, 1)}
                  disabled={index === entries.length - 1}
                  className="px-2 py-2 rounded border border-gray-200 text-xs disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeEntry(pageKey, index)}
                  className="px-2 py-2 rounded border border-red-200 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
          Page Layout: Home + Menu
        </div>
        <p className="text-xs text-gray-600">
          Reorder sections and choose section variants for `todaysSpecial`, `weeklySpecials`, and
          `chefSignatures`.
        </p>
      </div>
      {renderSectionEditor('home', homeEntries, HOME_SECTION_OPTIONS, pendingHomeSection, setPendingHomeSection)}
      {renderSectionEditor('menu', menuEntries, MENU_SECTION_OPTIONS, pendingMenuSection, setPendingMenuSection)}
    </div>
  );
}
