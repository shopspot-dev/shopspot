import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ===== Interfaces =====
interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  category_id: string;
  preparation_time: number;
  stock_quantity: number;
  tags: string[];
  dietary_restrictions: string[];
  customization_options: string[];
  special_instructions: string;
  is_available: boolean;
  images?: string[];
}

interface Props {
  item?: MenuItem;
  categories?: Category[];
  storeId: string;
  onSubmit: (item: MenuItem) => void;
  onCancel: () => void;
}

export default function MenuItemForm({ item, categories, storeId, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<MenuItem>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category_id: item?.category_id || '',
    preparation_time: item?.preparation_time || 15,
    stock_quantity: item?.stock_quantity || 0,
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

    // ✅ DEBUG: Log the category_id to make sure it's a UUID
    console.log('Submitting item with category UUID:', formData.category_id);
    try {
      await onSubmit({ ...formData, images });
    } catch (err) {
      setError('Failed to save item. Please try again.');
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl bg-white shadow-lg rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Price, Time, Stock */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={isNaN(formData.price) ? '' : formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preparation Time (mins)</label>
              <input
                type="number"
                min="0"
                value={isNaN(formData.preparation_time) ? '' : formData.preparation_time}
                onChange={(e) =>
                  setFormData({ ...formData, preparation_time: parseFloat(e.target.value) || 0 })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={isNaN(formData.stock_quantity) ? '' : formData.stock_quantity}
                onChange={(e) =>
                  setFormData({ ...formData, stock_quantity: parseFloat(e.target.value) || 0 })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
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
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags and Dietary */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                value={formData.tags.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
              <input
                type="text"
                placeholder="E.g., vegetarian, gluten-free"
                value={formData.dietary_restrictions.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietary_restrictions: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
            <textarea
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}