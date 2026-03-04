interface CtaPanelProps {
  cta: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function CtaPanel({ cta, updateFormValue, openImagePicker }: CtaPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">CTA</div>
      {'title' in cta && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={cta.title || ''}
            onChange={(event) => updateFormValue(['cta', 'title'], event.target.value)}
          />
        </div>
      )}
      {'description' in cta && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={cta.description || ''}
            onChange={(event) => updateFormValue(['cta', 'description'], event.target.value)}
          />
        </div>
      )}
      {'subtitle' in cta && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Subtitle</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={cta.subtitle || ''}
            onChange={(event) => updateFormValue(['cta', 'subtitle'], event.target.value)}
          />
        </div>
      )}
      <div className="mb-3">
        <label className="block text-xs text-gray-500">Background Image URL</label>
        <div className="mt-1 flex gap-2">
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="https://..."
            value={cta.image || ''}
            onChange={(event) => updateFormValue(['cta', 'image'], event.target.value)}
          />
          <button
            type="button"
            onClick={() => openImagePicker(['cta', 'image'])}
            className="px-3 rounded-md border border-gray-200 text-xs"
          >
            Choose
          </button>
          <button
            type="button"
            onClick={() => updateFormValue(['cta', 'image'], '')}
            className="px-3 rounded-md border border-gray-200 text-xs"
          >
            Clear
          </button>
        </div>
      </div>
      {cta?.primaryCta && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Primary CTA</div>
          <input
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Text"
            value={cta.primaryCta.text || ''}
            onChange={(event) => updateFormValue(['cta', 'primaryCta', 'text'], event.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Link"
            value={cta.primaryCta.link || ''}
            onChange={(event) => updateFormValue(['cta', 'primaryCta', 'link'], event.target.value)}
          />
        </div>
      )}
      {cta?.secondaryCta && (
        <div>
          <div className="text-xs text-gray-500 mb-1">Secondary CTA</div>
          <input
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Text"
            value={cta.secondaryCta.text || ''}
            onChange={(event) =>
              updateFormValue(['cta', 'secondaryCta', 'text'], event.target.value)
            }
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Link"
            value={cta.secondaryCta.link || ''}
            onChange={(event) =>
              updateFormValue(['cta', 'secondaryCta', 'link'], event.target.value)
            }
          />
        </div>
      )}
    </div>
  );
}
