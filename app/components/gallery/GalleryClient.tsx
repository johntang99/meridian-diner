'use client';

import { useState, useMemo } from 'react';
import GalleryCategoryFilter from './GalleryCategoryFilter';
import GalleryMasonry, { type GalleryItemData } from './GalleryMasonry';
import Lightbox, { type LightboxItem } from './Lightbox';

interface GalleryClientProps {
  items: GalleryItemData[];
  locale?: string;
}

export default function GalleryClient({ items, locale = 'en' }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build category list with counts (only categories that have items)
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    const cats = [
      { key: 'all', count: items.length },
      ...Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => ({ key, count })),
    ];
    return cats;
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  // Lightbox items derived from filtered list
  const lightboxItems: LightboxItem[] = useMemo(
    () => filteredItems.map((item) => ({ url: item.url, alt: item.alt, caption: item.caption })),
    [filteredItems],
  );

  return (
    <>
      {/* Category Filter */}
      <div className="mb-10">
        <GalleryCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          locale={locale}
        />
      </div>

      {/* Masonry Grid */}
      <GalleryMasonry items={filteredItems} onTileClick={setLightboxIndex} />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
