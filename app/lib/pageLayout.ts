import { type Locale } from '@/lib/i18n';
import { loadPageContent } from '@/lib/content';

interface LayoutSection {
  id: string;
  variant?: string;
}

interface LayoutMap {
  pages?: Record<string, LayoutSection[]>;
}

export interface PageSectionLayout {
  id: string;
  variant?: string;
}

export async function loadLayoutEntries(
  pageKey: string,
  locale: Locale,
  siteId: string,
  fallbackSections: string[]
): Promise<PageSectionLayout[]> {
  let layoutMap = await loadPageContent<LayoutMap>('layout', locale, siteId);
  if ((!layoutMap?.pages || !layoutMap.pages[pageKey]) && locale !== 'en') {
    layoutMap = await loadPageContent<LayoutMap>('layout', 'en', siteId);
  }
  const mappedSections = layoutMap?.pages?.[pageKey];

  if (Array.isArray(mappedSections) && mappedSections.length > 0) {
    return mappedSections.filter((section) => Boolean(section?.id));
  }

  // Backward compatibility for existing per-page layout files.
  let legacyLayout = await loadPageContent<{ sections?: LayoutSection[] }>(
    `${pageKey}.layout`,
    locale,
    siteId
  );
  if (!legacyLayout?.sections?.length && locale !== 'en') {
    legacyLayout = await loadPageContent<{ sections?: LayoutSection[] }>(
      `${pageKey}.layout`,
      'en',
      siteId
    );
  }
  const legacySections = legacyLayout?.sections?.filter((section) => Boolean(section?.id));
  if (legacySections && legacySections.length > 0) {
    return legacySections;
  }

  return fallbackSections.map((id) => ({ id }));
}

export async function loadLayoutSections(
  pageKey: string,
  locale: Locale,
  siteId: string,
  fallbackSections: string[]
): Promise<string[]> {
  const entries = await loadLayoutEntries(pageKey, locale, siteId, fallbackSections);
  return entries.map((section) => section.id).filter(Boolean);
}
