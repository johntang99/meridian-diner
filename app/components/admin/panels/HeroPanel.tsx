interface HeroPanelProps {
  hero: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function HeroPanel({ hero, updateFormValue, openImagePicker }: HeroPanelProps) {
  const heroGallery = Array.isArray(hero.gallery) ? hero.gallery : [];
  const setHeroGallery = (nextGallery: string[]) => {
    updateFormValue(['hero', 'gallery'], nextGallery);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Hero</div>
      {'title' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.title || ''}
            onChange={(event) => updateFormValue(['hero', 'title'], event.target.value)}
          />
        </div>
      )}
      {'subtitle' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Subtitle</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.subtitle || ''}
            onChange={(event) => updateFormValue(['hero', 'subtitle'], event.target.value)}
          />
        </div>
      )}
      {('businessName' in hero || 'clinicName' in hero) && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Business Name</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.businessName || hero.clinicName || ''}
            onChange={(event) =>
              updateFormValue(
                ['hero', 'businessName' in hero ? 'businessName' : 'clinicName'],
                event.target.value
              )
            }
          />
        </div>
      )}
      {'tagline' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Tagline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.tagline || ''}
            onChange={(event) => updateFormValue(['hero', 'tagline'], event.target.value)}
          />
        </div>
      )}
      {'description' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.description || ''}
            onChange={(event) => updateFormValue(['hero', 'description'], event.target.value)}
          />
        </div>
      )}
      {'backgroundImage' in hero && (
        <div>
          <label className="block text-xs text-gray-500">Background Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={hero.backgroundImage || ''}
              onChange={(event) => updateFormValue(['hero', 'backgroundImage'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'backgroundImage'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {'image' in hero && (
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={hero.image || ''}
              onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {('image' in hero || 'variant' in hero) && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-gray-500">Gallery Background Images</label>
            <button
              type="button"
              onClick={() => setHeroGallery([...(heroGallery as string[]), ''])}
              className="px-2 py-1 rounded-md border border-gray-200 text-xs"
            >
              Add Photo
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mb-2">
            Used by Home hero when variant is <code>gallery-background</code>.
          </p>
          {heroGallery.length === 0 ? (
            <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-md p-3">
              No gallery images yet. Click Add Photo.
            </div>
          ) : (
            <div className="space-y-2">
              {heroGallery.map((url: string, index: number) => (
                <div key={`hero-gallery-${index}`} className="flex gap-2 items-center">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={url || ''}
                    onChange={(event) => {
                      const next = [...heroGallery];
                      next[index] = event.target.value;
                      setHeroGallery(next);
                    }}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker(['hero', 'gallery', String(index)])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroGallery(heroGallery.filter((_: string, i: number) => i !== index))}
                    className="px-3 rounded-md border border-red-200 text-red-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
