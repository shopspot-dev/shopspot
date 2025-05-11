import React, { useState, useEffect } from 'react';
import { Store, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const STORE_CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Bakery',
  'Grocery',
  'Retail',
  'Electronics',
  'Fashion',
  'Other'
];

export default function StoreSetup() {
  const { merchant, completeStoreSetup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    category: '',
    logo_url: '',
    additional_details: '',
  });

  useEffect(() => {
    if (merchant?.id) {
      loadExistingStore();
    }
  }, [merchant?.id]);

  const loadExistingStore = async () => {
    try {
      setLoading(true);
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('merchant_id', merchant?.id)
        .limit(1)
        .single();

      if (storeError) {
        throw storeError;
      }

      if (storeData) {
        setFormData({
          name: storeData.name || '',
          description: storeData.description || '',
          address: storeData.address || '',
          phone: storeData.phone || '',
          category: storeData.category || '',
          logo_url: storeData.logo_url || '',
          additional_details: storeData.additional_details || '',
        });
      }
    } catch (err) {
      console.error('Error loading store:', err);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleLogoUpload = async (file: File) => {
    if (!file || !merchant?.id) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      // Use merchant ID for the file path to match RLS policy
      const filePath = `${merchant.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('store-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-logos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (err) {
      console.error('Logo upload error:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleLogoUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant?.id) return;

    // Validate required fields
    if (!formData.name || !formData.address || !formData.phone || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // First check if store exists
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('merchant_id', merchant.id)
        .limit(1)
        .single();

      const storeData = {
        merchant_id: merchant.id,
        ...formData,
      };

      let result;
      if (existingStore?.id) {
        // Update existing store
        result = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', existingStore.id)
          .select()
          .single();
      } else {
        // Insert new store
        result = await supabase
          .from('stores')
          .insert(storeData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      completeStoreSetup();
    } catch (err) {
      console.error('Store setup error:', err);
      setError('Failed to save store details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Complete Your Store Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's get your store ready for customers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg transition-colors ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : formData.logo_url
                    ? 'border-transparent'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                {formData.logo_url ? (
                  <div className="relative group">
                    <img
                      src={formData.logo_url}
                      alt="Store logo"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="space-x-2">
                        <label className="cursor-pointer px-3 py-2 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file);
                            }}
                            className="sr-only"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                          className="px-3 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        <Upload className="h-5 w-5 mr-2" />
                        Choose Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(file);
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">or drag and drop your logo here</p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG or GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {STORE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tell customers about your store..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="123 Main St, City, State, ZIP"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1 for US/Canada)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Details
              </label>
              <textarea
                value={formData.additional_details}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_details: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Any additional information about your store..."
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}