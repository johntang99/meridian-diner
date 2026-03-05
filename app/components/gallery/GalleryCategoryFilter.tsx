'use client';

interface GalleryCategoryFilterProps {
  categories: { key: string; count: number }[];
  activeCategory: string;
  onSelect: (category: string) => void;
  locale?: string;
}

const categoryLabels: Record<string, Record<string, string>> = {
  all: { en: 'All', zh: '全部', es: 'Todo' },
  food: { en: 'Food', zh: '美食', es: 'Comida' },
  interior: { en: 'Interior', zh: '室内', es: 'Interior' },
  events: { en: 'Events', zh: '活动', es: 'Eventos' },
  team: { en: 'Team', zh: '团队', es: 'Equipo' },
  'behind-the-scenes': { en: 'Behind the Scenes', zh: '幕后', es: 'Detrás de Escenas' },
  seasonal: { en: 'Seasonal', zh: '时令', es: 'Estacional' },
};

export default function GalleryCategoryFilter({
  categories,
  activeCategory,
  onSelect,
  locale = 'en',
}: GalleryCategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center" style={{ gap: '0.5rem' }}>
      {categories.map(({ key, count }) => {
        const isActive = activeCategory === key;
        const label = categoryLabels[key]?.[locale] || categoryLabels[key]?.en || key.replace(/-/g, ' ');
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="transition-colors"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: isActive ? 'var(--primary)' : 'var(--backdrop-secondary)',
              color: isActive ? 'var(--text-color-primary)' : 'var(--text-color-secondary)',
              transitionDuration: 'var(--duration-fast, 150ms)',
              textTransform: 'capitalize',
            }}
          >
            {label}
            <span
              style={{
                marginLeft: '0.35rem',
                fontSize: '0.7rem',
                opacity: 0.7,
              }}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
