import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ===== Interfaces =====
interface Category {
  id: string;
  name: string;
  store_id: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
  category_id: string;
  dietary_restrictions?: string[];
  store_id: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  preparation_time: string;
  stock_quantity: string;
  tags: string[];
  dietary_restrictions: string[];
  customization_options: string[];
  special_instructions: string;
  is_available: boolean;
}

interface Props {
  item?: MenuItem;
  categories?: Category[];
  storeId: string;
  onSubmit: (item: MenuItem) => void;
  onCancel: () => void;
}

export default function MenuItemForm({ item, categories, storeId, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price?.toString() || '',
    category_id: item?.category_id || '',
    preparation_time: item?.preparation_time?.toString() || '',
    stock_quantity: item?.stock_quantity?.toString() || '',
    tags: item?.tags || [],
    dietary_restrictions: item?.dietary_restrictions || [],
    customization_options: item?.customization_options || [],
    special_instructions: item?.special_instructions || '',
    is_available: item?.is_available ?? true,
  });

  const [images, setImages] = useState<string[]>(item?.images || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name');
        if (error) {
          console.error('❌ Error fetching categories:', error.message);
        } else {
          console.log('✅ Categories fetched from Supabase:', data);
          setCategoryList(data || []);
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log("Current Supabase user:", data.user);
    });
  }, []);

  // ===== Image Upload Handler =====
  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('menu-items')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('menu-items').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, []);
  // ===== Drag & Drop Image Support =====
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) handleImageUpload(files);
  }, [handleImageUpload]);

  // ===== Clipboard Paste Image Support =====
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    const imageFiles: File[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length) handleImageUpload(imageFiles);
    }
  }, [handleImageUpload]);

  // ===== Submit Form Handler =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prepared = prepareFormData(formData);
      console.log("Prepared form data to submit:", prepared);
      if (images.length > 0) {
        (prepared as any).image_url = images[0]; // Save the first uploaded image
      }
      await onSubmit(prepared);
    } catch (err: any) {
      console.error('Add error (full object):', err);
      if (err.message) {
        setError(`Failed to add item: ${err.message}`);
      } else {
        setError('Failed to add item. Please try again.');
      }
    }
  };

  // Add these helper functions
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleTagsInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'tags' | 'dietary_restrictions') => {
    const value = e.target.value;
    // Store the raw input value
    setFormData({
      ...formData,
      [field]: [value] // Store as a single string in the array
    });
  };

  // Add this helper function for form submission
  const prepareFormData = (data: FormData): Partial<MenuItem> => {
    // Process tags and dietary restrictions before submission
    const processedTags = data.tags[0] ? data.tags[0].split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const processedDietary = data.dietary_restrictions[0] ? data.dietary_restrictions[0].split(',').map(item => item.trim()).filter(Boolean) : [];

    return {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category_id: data.category_id,
      preparation_time: parseInt(data.preparation_time),
      stock_quantity: parseInt(data.stock_quantity),
      tags: processedTags,
      dietary_restrictions: processedDietary,
      customization_options: data.customization_options,
      special_instructions: data.special_instructions,
      is_available: data.is_available,
      image_url: images[0] || null
    } as Partial<MenuItem>;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-4xl bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                required
              >
                <option value="">Select a category</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">Other (Not listed)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
              required
            />
          </div>

          {/* Price, Time, Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                  type="text"
                  inputMode="decimal"
                  value={formData.price}
                  onChange={(e) => handleNumberInput(e, 'price')}
                  className="block w-full pl-7 rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                  placeholder="0.00"
                required
              />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (mins)</label>
              <div className="relative">
              <input
                  type="text"
                  inputMode="numeric"
                  value={formData.preparation_time}
                  onChange={(e) => handleNumberInput(e, 'preparation_time')}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                  placeholder="15"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">mins</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.stock_quantity}
                onChange={(e) => handleNumberInput(e, 'stock_quantity')}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onPaste={handlePaste}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags and Dietary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="relative">
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                  value={formData.tags[0] || ''}
                  onChange={(e) => handleTagsInput(e, 'tags')}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                />
                {formData.tags[0] && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags[0].split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {trimmedTag}
                          <button
                            type="button"
                            onClick={() => {
                              const tags = formData.tags[0].split(',');
                              tags.splice(index, 1);
                  setFormData({
                    ...formData,
                                tags: [tags.join(',')]
                              });
                            }}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
              <div className="relative">
              <input
                type="text"
                placeholder="E.g., vegetarian, gluten-free"
                  value={formData.dietary_restrictions[0] || ''}
                  onChange={(e) => handleTagsInput(e, 'dietary_restrictions')}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
                />
                {formData.dietary_restrictions[0] && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.dietary_restrictions[0].split(',').map((restriction, index) => {
                      const trimmedRestriction = restriction.trim();
                      if (!trimmedRestriction) return null;
                      return (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          {trimmedRestriction}
                          <button
                            type="button"
                            onClick={() => {
                              const restrictions = formData.dietary_restrictions[0].split(',');
                              restrictions.splice(index, 1);
                  setFormData({
                    ...formData,
                                dietary_restrictions: [restrictions.join(',')]
                              });
                            }}
                            className="ml-1 text-green-500 hover:text-green-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
              rows={2}
              className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none"
              placeholder="Any special preparation instructions or notes"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
              Item is available
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Uploading...' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}