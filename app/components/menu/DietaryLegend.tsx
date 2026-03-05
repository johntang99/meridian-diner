const dietaryInfo: Record<string, { icon: string; label: string }> = {
  vegetarian: { icon: '🌿', label: 'Vegetarian' },
  vegan: { icon: '🌱', label: 'Vegan' },
  'gluten-free': { icon: '🌾', label: 'Gluten-Free' },
  'dairy-free': { icon: '🥛', label: 'Dairy-Free' },
  'nut-free': { icon: '🥜', label: 'Nut-Free' },
};

interface DietaryLegendProps {
  usedFlags: string[];
}

export default function DietaryLegend({ usedFlags }: DietaryLegendProps) {
  const flags = usedFlags.filter(f => dietaryInfo[f]);
  if (flags.length === 0) return null;

  return (
    <div
      className="flex items-center gap-4 flex-wrap py-3 px-4"
      style={{
        borderRadius: 'var(--radius-base, 0.75rem)',
        backgroundColor: 'var(--menu-list-legend-bg, #F8FAFC)',
        border: '1px solid var(--menu-list-border, #E5E7EB)',
        fontSize: '0.75rem',
      }}
    >
      <span style={{ color: 'var(--menu-list-text-muted, #6B7280)', fontWeight: 500 }}>Key:</span>
      {flags.map((flag) => {
        const info = dietaryInfo[flag];
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1"
            style={{ color: 'var(--menu-list-text-secondary, #374151)' }}
          >
            {info.icon} {info.label}
          </span>
        );
      })}
    </div>
  );
}
