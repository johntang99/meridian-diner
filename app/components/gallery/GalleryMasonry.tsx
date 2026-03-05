'use client';

import Image from 'next/image';

export interface GalleryItemData {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: string;
  featured?: boolean;
  displayOrder: number;
}

interface GalleryMasonryProps {
  items: GalleryItemData[];
  onTileClick: (index: number) => void;
}

const categoryAspectRatio: Record<string, string> = {
  food: '4 / 3',
  interior: '16 / 9',
  team: '3 / 4',
  events: '16 / 9',
  'behind-the-scenes': '4 / 3',
  seasonal: '4 / 3',
};

export default function GalleryMasonry({ items, onTileClick }: GalleryMasonryProps) {
  return (
    <>
      <style jsx global>{`
        .gallery-masonry {
          column-count: 3;
          column-gap: var(--grid-gap, 1.5rem);
        }
        @media (max-width: 1024px) {
          .gallery-masonry {
            column-count: 2;
          }
        }
        @media (max-width: 640px) {
          .gallery-masonry {
            column-count: 2;
            column-gap: 0.75rem;
          }
        }
      `}</style>
      <div className="gallery-masonry">
        {items.map((item, index) => (
          <GalleryTile
            key={item.id}
            item={item}
            index={index}
            eager={index < 6}
            onClick={() => onTileClick(index)}
          />
        ))}
      </div>
    </>
  );
}

function GalleryTile({
  item,
  index,
  eager,
  onClick,
}: {
  item: GalleryItemData;
  index: number;
  eager: boolean;
  onClick: () => void;
}) {
  const aspect = categoryAspectRatio[item.category] || '4 / 3';

  return (
    <div
      className="group overflow-hidden cursor-pointer"
      onClick={onClick}
      style={{
        breakInside: 'avoid',
        marginBottom: 'var(--grid-gap, 1.5rem)',
        borderRadius: 'var(--radius-base, 0.75rem)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: aspect, width: '100%' }}>
        {item.url ? (
          <Image
            src={item.url}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            loading={eager ? 'eager' : 'lazy'}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: 'var(--backdrop-secondary)' }}
          />
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            transitionDuration: 'var(--duration-base, 300ms)',
          }}
        >
          {item.caption && (
            <p
              className="text-center px-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--text-on-dark-primary, #fff)',
                lineHeight: 1.4,
              }}
            >
              {item.caption}
            </p>
          )}
          {/* Expand icon */}
          <span
            className="absolute bottom-3 right-3"
            style={{ color: 'var(--text-on-dark-primary, #fff)', fontSize: '1.25rem', opacity: 0.8 }}
          >
            ⤢
          </span>
        </div>
      </div>
    </div>
  );
}
