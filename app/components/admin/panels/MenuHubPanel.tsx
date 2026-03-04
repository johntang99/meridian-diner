interface MenuHubPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const MENU_VARIANT_OPTIONS: Array<'compact' | 'rich'> = ['compact', 'rich'];

export function MenuHubPanel({
  formData,
  updateFormValue,
  openImagePicker,
}: MenuHubPanelProps) {
  const weeklySpecials = Array.isArray(formData?.weeklySpecials)
    ? formData.weeklySpecials
    : [];

  const addWeeklySpecial = () => {
    const next = [...weeklySpecials];
    next.push({
      day: '',
      dayNumber: '',
      name: '',
      description: '',
      price: '',
      image: '',
      badges: [],
      includes: [],
      menuType: '',
      ctaLabel: '',
    });
    updateFormValue(['weeklySpecials'], next);
  };

  const removeWeeklySpecial = (index: number) => {
    const next = [...weeklySpecials];
    next.splice(index, 1);
    updateFormValue(['weeklySpecials'], next);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Menu Section Variants
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Today/Weekly specials can use media URLs. Chef&apos;s Signature now references real menu items.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Menu: Today&apos;s Special</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(formData?.sectionVariants?.todaysSpecial || '')}
              onChange={(event) =>
                updateFormValue(['sectionVariants', 'todaysSpecial'], event.target.value)
              }
            >
              <option value="">Default</option>
              {MENU_VARIANT_OPTIONS.map((option) => (
                <option key={`menu-today-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Menu: Weekly Specials</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(formData?.sectionVariants?.weeklySpecials || '')}
              onChange={(event) =>
                updateFormValue(['sectionVariants', 'weeklySpecials'], event.target.value)
              }
            >
              <option value="">Default</option>
              {MENU_VARIANT_OPTIONS.map((option) => (
                <option key={`menu-weekly-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Menu: Chef&apos;s Signature</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(formData?.sectionVariants?.chefSignatures || '')}
              onChange={(event) =>
                updateFormValue(['sectionVariants', 'chefSignatures'], event.target.value)
              }
            >
              <option value="">Default</option>
              {MENU_VARIANT_OPTIONS.map((option) => (
                <option key={`menu-signature-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Home: Today&apos;s Special</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(formData?.homeSectionVariants?.todaysSpecial || '')}
              onChange={(event) =>
                updateFormValue(['homeSectionVariants', 'todaysSpecial'], event.target.value)
              }
            >
              <option value="">Default</option>
              {MENU_VARIANT_OPTIONS.map((option) => (
                <option key={`home-today-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Home: Chef&apos;s Signature</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(formData?.homeSectionVariants?.chefSignatures || '')}
              onChange={(event) =>
                updateFormValue(['homeSectionVariants', 'chefSignatures'], event.target.value)
              }
            >
              <option value="">Default</option>
              {MENU_VARIANT_OPTIONS.map((option) => (
                <option key={`home-signature-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {formData?.todaySpecial && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Today&apos;s Special
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Name"
              value={formData.todaySpecial.name || ''}
              onChange={(event) =>
                updateFormValue(['todaySpecial', 'name'], event.target.value)
              }
            />
            <input
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Price"
              type="number"
              value={formData.todaySpecial.price ?? ''}
              onChange={(event) =>
                updateFormValue(
                  ['todaySpecial', 'price'],
                  event.target.value === '' ? '' : Number(event.target.value)
                )
              }
            />
            <input
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Menu Type (e.g. dinner)"
              value={formData.todaySpecial.menuType || ''}
              onChange={(event) =>
                updateFormValue(['todaySpecial', 'menuType'], event.target.value)
              }
            />
            <input
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="CTA Label"
              value={formData.todaySpecial.ctaLabel || ''}
              onChange={(event) =>
                updateFormValue(['todaySpecial', 'ctaLabel'], event.target.value)
              }
            />
            <textarea
              className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Description"
              value={formData.todaySpecial.description || ''}
              onChange={(event) =>
                updateFormValue(['todaySpecial', 'description'], event.target.value)
              }
            />
            <div className="md:col-span-2 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Image URL"
                value={formData.todaySpecial.image || ''}
                onChange={(event) =>
                  updateFormValue(['todaySpecial', 'image'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => openImagePicker(['todaySpecial', 'image'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
            <input
              className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Badges (comma separated)"
              value={Array.isArray(formData.todaySpecial.badges) ? formData.todaySpecial.badges.join(', ') : ''}
              onChange={(event) =>
                updateFormValue(
                  ['todaySpecial', 'badges'],
                  event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
            />
            <input
              className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Includes (comma separated)"
              value={Array.isArray(formData.todaySpecial.includes) ? formData.todaySpecial.includes.join(', ') : ''}
              onChange={(event) =>
                updateFormValue(
                  ['todaySpecial', 'includes'],
                  event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Weekly Specials</div>
          <button
            type="button"
            onClick={addWeeklySpecial}
            className="px-2 py-1 rounded border border-gray-200 text-xs"
          >
            Add Special
          </button>
        </div>
        <div className="space-y-3">
          {weeklySpecials.map((special: any, index: number) => (
            <div key={`${special.day || 'weekly'}-${index}`} className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500">Special {index + 1}</div>
                <button
                  type="button"
                  onClick={() => removeWeeklySpecial(index)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Day"
                  value={special.day || ''}
                  onChange={(event) =>
                    updateFormValue(['weeklySpecials', String(index), 'day'], event.target.value)
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Day Number"
                  type="number"
                  min={0}
                  max={6}
                  value={special.dayNumber ?? ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'dayNumber'],
                      event.target.value === '' ? '' : Number(event.target.value)
                    )
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Price"
                  type="number"
                  value={special.price ?? ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'price'],
                      event.target.value === '' ? '' : Number(event.target.value)
                    )
                  }
                />
              </div>
              <input
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Name"
                value={special.name || ''}
                onChange={(event) =>
                  updateFormValue(['weeklySpecials', String(index), 'name'], event.target.value)
                }
              />
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Description"
                value={special.description || ''}
                onChange={(event) =>
                  updateFormValue(
                    ['weeklySpecials', String(index), 'description'],
                    event.target.value
                  )
                }
              />
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Menu Type"
                  value={special.menuType || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'menuType'],
                      event.target.value
                    )
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="CTA Label"
                  value={special.ctaLabel || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'ctaLabel'],
                      event.target.value
                    )
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Badges (comma separated)"
                  value={Array.isArray(special.badges) ? special.badges.join(', ') : ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'badges'],
                      event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Includes (comma separated)"
                  value={Array.isArray(special.includes) ? special.includes.join(', ') : ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['weeklySpecials', String(index), 'includes'],
                      event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Image URL"
                  value={special.image || ''}
                  onChange={(event) =>
                    updateFormValue(['weeklySpecials', String(index), 'image'], event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => openImagePicker(['weeklySpecials', String(index), 'image'])}
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Chef Signatures Source
        </div>
        <p className="text-sm text-gray-700">
          Chef&apos;s Signature cards are now auto-generated from <code>menu/dinner.json</code> items
          where <code>signature=true</code>.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Edit signatures in Admin → Menu → Dinner, then Save/Publish.
        </p>
      </div>
    </>
  );
}
