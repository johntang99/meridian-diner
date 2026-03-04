interface MenuTypePanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function MenuTypePanel({
  formData,
  updateFormValue,
  openImagePicker,
}: MenuTypePanelProps) {
  const categories = Array.isArray(formData?.categories) ? formData.categories : [];
  const items = Array.isArray(formData?.items) ? formData.items : [];
  const isDinnerMenu = String(formData?.menuType || '') === 'dinner';

  const addCategory = () => {
    updateFormValue(['categories'], [
      ...categories,
      {
        id: `category-${categories.length + 1}`,
        name: '',
        description: '',
        displayOrder: categories.length + 1,
      },
    ]);
  };

  const removeCategory = (index: number) => {
    const next = [...categories];
    next.splice(index, 1);
    updateFormValue(['categories'], next);
  };

  const addItem = () => {
    const fallbackCategoryId = categories[0]?.id || '';
    updateFormValue(['items'], [
      ...items,
      {
        id: `item-${items.length + 1}`,
        categoryId: fallbackCategoryId,
        name: '',
        description: '',
        price: '',
        image: '',
        available: true,
        displayOrder: items.length + 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const next = [...items];
    next.splice(index, 1);
    updateFormValue(['items'], next);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Menu Type Settings
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Menu Type Slug"
            value={formData?.menuType || ''}
            onChange={(event) => updateFormValue(['menuType'], toSlug(event.target.value))}
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Title"
            value={formData?.title || ''}
            onChange={(event) => updateFormValue(['title'], event.target.value)}
          />
          <textarea
            className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Subtitle"
            value={formData?.subtitle || ''}
            onChange={(event) => updateFormValue(['subtitle'], event.target.value)}
          />
          <div className="md:col-span-2 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Default item photo URL (Unsplash)"
              value={formData?.defaultItemImage || ''}
              onChange={(event) => updateFormValue(['defaultItemImage'], event.target.value)}
            />
            {formData?.defaultItemImage ? (
              <div className="h-10 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <img
                  src={String(formData.defaultItemImage)}
                  alt="Default menu item preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => openImagePicker(['defaultItemImage'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Categories</div>
          <button
            type="button"
            onClick={addCategory}
            className="px-2 py-1 rounded border border-gray-200 text-xs"
          >
            Add Category
          </button>
        </div>
        <div className="space-y-3">
          {categories.map((category: any, index: number) => (
            <div key={`${category?.id || 'category'}-${index}`} className="border rounded-md p-3">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Category ID"
                  value={category?.id || ''}
                  onChange={(event) =>
                    updateFormValue(['categories', String(index), 'id'], toSlug(event.target.value))
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Category Name"
                  value={category?.name || ''}
                  onChange={(event) =>
                    updateFormValue(['categories', String(index), 'name'], event.target.value)
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  type="number"
                  placeholder="Display Order"
                  value={category?.displayOrder ?? ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['categories', String(index), 'displayOrder'],
                      event.target.value === '' ? '' : Number(event.target.value)
                    )
                  }
                />
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Category Description"
                value={category?.description || ''}
                onChange={(event) =>
                  updateFormValue(['categories', String(index), 'description'], event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Menu Items</div>
          <button
            type="button"
            onClick={addItem}
            className="px-2 py-1 rounded border border-gray-200 text-xs"
          >
            Add Item
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <div key={`${item?.id || 'item'}-${index}`} className="border rounded-md p-3">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Item ID"
                  value={item?.id || ''}
                  onChange={(event) =>
                    updateFormValue(['items', String(index), 'id'], toSlug(event.target.value))
                  }
                />
                <select
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                  value={item?.categoryId || ''}
                  onChange={(event) =>
                    updateFormValue(['items', String(index), 'categoryId'], event.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category: any, categoryIndex: number) => (
                    <option key={`${category?.id || 'cat'}-${categoryIndex}`} value={category?.id || ''}>
                      {category?.name || category?.id || `Category ${categoryIndex + 1}`}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  type="number"
                  placeholder="Display Order"
                  value={item?.displayOrder ?? ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['items', String(index), 'displayOrder'],
                      event.target.value === '' ? '' : Number(event.target.value)
                    )
                  }
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2 mt-2">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Item Name"
                  value={item?.name || ''}
                  onChange={(event) =>
                    updateFormValue(['items', String(index), 'name'], event.target.value)
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  type="number"
                  placeholder="Price (cents)"
                  value={item?.price ?? ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['items', String(index), 'price'],
                      event.target.value === '' ? '' : Number(event.target.value)
                    )
                  }
                />
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Item Description"
                value={item?.description || ''}
                onChange={(event) =>
                  updateFormValue(['items', String(index), 'description'], event.target.value)
                }
              />
              <div className="mt-2 flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Item Photo URL (Unsplash)"
                  value={item?.image || ''}
                  onChange={(event) =>
                    updateFormValue(['items', String(index), 'image'], event.target.value)
                  }
                />
                {item?.image ? (
                  <div className="h-10 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    <img
                      src={String(item.image)}
                      alt={`${item?.name || item?.id || 'Menu item'} photo preview`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => openImagePicker(['items', String(index), 'image'])}
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={item?.available !== false}
                  onChange={(event) =>
                    updateFormValue(['items', String(index), 'available'], event.target.checked)
                  }
                />
                Available
              </label>
              {isDinnerMenu && (
                <label className="mt-2 ml-4 inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={item?.signature === true}
                    onChange={(event) =>
                      updateFormValue(['items', String(index), 'signature'], event.target.checked)
                    }
                  />
                  Signature Dish
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
