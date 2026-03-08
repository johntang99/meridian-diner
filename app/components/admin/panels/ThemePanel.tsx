interface ThemePanelProps {
  formData: Record<string, any>;
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
}

function toLabel(key: string): string {
  if (!key) return '';
  const normalized = key.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function pathLabel(path: string[], key: string): string {
  const joined = [...path, key].join('.');
  const labelMap: Record<string, string> = {
    'colors.primary.DEFAULT': 'Brand Primary (Accent)',
    'colors.text.primary': 'Text Primary (Default)',
    'colors.text.secondary': 'Text Secondary',
    'colors.text.muted': 'Text Muted',
    'colors.text.inverse': 'Text Inverse',
    'colors.text.onDarkPrimary': 'Text On Dark Primary',
    'colors.text.onDarkSecondary': 'Text On Dark Secondary',
  };
  return labelMap[joined] || toLabel(key);
}

function isRecord(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isColorLikeValue(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return (
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ||
    /^rgba?\(/i.test(v) ||
    /^hsla?\(/i.test(v)
  );
}

function toPickerHex(value: string): string {
  const v = value.trim();
  if (/^#([0-9a-f]{6})$/i.test(v)) return v;
  const shortHex = v.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    const expanded = shortHex[1]
      .split('')
      .map((c) => `${c}${c}`)
      .join('');
    return `#${expanded}`;
  }

  const rgb = v.match(
    /^rgba?\(\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i
  );
  if (rgb) {
    const toHex = (n: string) => Number(n).toString(16).padStart(2, '0');
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
  }

  return '#000000';
}

export function ThemePanel({ formData, getPathValue, updateFormValue }: ThemePanelProps) {
  const orderedCategories = Object.keys(formData || {});

  const orderKeys = (path: string[], keys: string[]): string[] => {
    const joined = path.join('.');
    const preferredByPath: Record<string, string[]> = {
      colors: ['primary', 'secondary', 'backdrop', 'text', 'border', 'status'],
      'colors.primary': ['DEFAULT', 'dark', 'light', '50', '100'],
      'colors.secondary': ['DEFAULT', 'dark', 'light', '50', '100'],
      'colors.backdrop': ['primary', 'secondary', 'surface', 'overlay'],
      'colors.text': ['primary', 'secondary', 'muted', 'inverse', 'accent', 'onDarkPrimary', 'onDarkSecondary'],
      'colors.border': ['DEFAULT', 'subtle', 'emphasis'],
      'colors.status': ['success', 'warning', 'error'],
      typography: ['display', 'heading', 'subheading', 'body', 'small', 'fonts', 'tracking', 'lineHeight', 'weight'],
      shape: ['radius', 'shadow'],
      layout: ['spacingDensity'],
      spacing: ['sectionPy', 'sectionPySm', 'containerMax', 'containerPx', 'cardPad', 'menuItemPy', 'navHeight', 'heroMinH', 'gridGap'],
      effects: ['cardRadius', 'btnRadius', 'badgeRadius', 'cardShadow', 'cardShadowHover', 'heroOverlay', 'menuDivider'],
      motion: ['durationFast', 'durationBase', 'durationSlow', 'easing', 'hoverLift', 'entranceDist'],
      _preset: ['id', 'name', 'category', 'description'],
    };

    const preferred = preferredByPath[joined];
    if (!preferred) return keys;

    return [
      ...preferred.filter((key) => keys.includes(key)),
      ...keys.filter((key) => !preferred.includes(key)),
    ];
  };

  const renderPrimitiveField = (label: string, path: string[], value: any, asColor = false) => {
    const stringValue = value == null ? '' : String(value);
    const isBoolean = typeof value === 'boolean';
    const colorInputId = `theme-color-${path.join('-').replace(/[^a-zA-Z0-9-_]/g, '-')}`;
    const pickerValue = toPickerHex(stringValue || '#000000');
    return (
      <div key={path.join('.')} className="grid gap-2 md:grid-cols-[1fr_auto] items-center min-w-0">
        <div>
          <label className="block text-xs text-gray-500">{label}</label>
          {isBoolean ? (
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) => updateFormValue(path, event.target.checked)}
              />
              Enabled
            </label>
          ) : (
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={stringValue}
              onChange={(event) => updateFormValue(path, event.target.value)}
            />
          )}
        </div>
        {asColor && !isBoolean && (
          <div className="mt-6">
            <button
              type="button"
              className="h-10 w-10 rounded-md border border-gray-200 cursor-pointer"
              style={{ background: stringValue || 'transparent' }}
              title="Pick color"
              onClick={() => {
                const input = document.getElementById(colorInputId) as HTMLInputElement | null;
                if (input) input.click();
              }}
            />
            <input
              id={colorInputId}
              type="color"
              className="sr-only"
              value={pickerValue}
              onChange={(event) => updateFormValue(path, event.target.value.toUpperCase())}
              aria-label={`${label} color picker`}
            />
          </div>
        )}
      </div>
    );
  };

  const renderObjectFields = (
    node: Record<string, any>,
    path: string[],
    depth: number,
    colorMode = false
  ): JSX.Element[] => {
    const keys = orderKeys(path, Object.keys(node));
    return keys.map((key) => {
      const nextPath = [...path, key];
      const value = getPathValue(nextPath);

      if (isRecord(value)) {
        return (
          <div
            key={nextPath.join('.')}
            className={`space-y-3 md:col-span-2 ${depth > 0 ? 'border border-gray-200 rounded-lg p-3' : ''}`}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase">
              {toLabel(key)}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {renderObjectFields(value, nextPath, depth + 1, colorMode)}
            </div>
          </div>
        );
      }

      return renderPrimitiveField(
        pathLabel(path, key),
        nextPath,
        value,
        colorMode || isColorLikeValue(value)
      );
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-6">
      <div className="text-xs font-semibold text-gray-500 uppercase">Theme</div>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        Brand colors and text colors are different tokens: use Brand Primary for accents/CTAs, and
        Text Primary for readable content text.
      </div>
      {orderedCategories.map((category) => {
        const categoryValue = getPathValue([category]);
        const isColorsCategory = category === 'colors';
        return (
          <div key={category} className="space-y-4 border border-gray-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              {toLabel(category)}
            </div>
            {isRecord(categoryValue) ? (
              <div className="grid gap-3 md:grid-cols-2">
                {renderObjectFields(categoryValue, [category], 0, isColorsCategory)}
              </div>
            ) : (
              renderPrimitiveField(toLabel(category), [category], categoryValue)
            )}
          </div>
        );
      })}
    </div>
  );
}
