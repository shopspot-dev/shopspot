import React, { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import OpeningHours from '../components/profile/OpeningHours';

export default function StoreProfilePage() {
  const { merchant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    store_id: null as string | null,
    name: '',
    description: '',
    logo_url: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    additional_details: '',
    openingHours: {
      monday: { open: '09:00', close: '22:00', isClosed: false },
      tuesday: { open: '09:00', close: '22:00', isClosed: false },
      wednesday: { open: '09:00', close: '22:00', isClosed: false },
      thursday: { open: '09:00', close: '22:00', isClosed: false },
      friday: { open: '09:00', close: '23:00', isClosed: false },
      saturday: { open: '10:00', close: '23:00', isClosed: false },
      sunday: { open: '10:00', close: '21:00', isClosed: false },
    },
  });

  useEffect(() => {
    if (merchant?.id) {
      loadStoreProfile();
    } else {
      setLoading(false);
      setError('User not authenticated.');
    }
  }, [merchant?.id]);

  const loadStoreProfile = async () => {
    try {
      setLoading(true);
      setError('');

      if (!merchant?.id) {
        console.warn("Merchant ID not available, cannot load store profile.");
        setLoading(false);
        return;
      }

      const { data: storeUserLink, error: storeUserError } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', merchant.id)
        .limit(1)
        .maybeSingle();

      if (storeUserError && storeUserError.code !== 'PGRST116') {
         throw storeUserError;
      }

      let storeData = null;
      if (storeUserLink?.store_id) {
        const { data: fetchedStoreData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeUserLink.store_id)
          .limit(1)
          .single();

        if (storeError) {
          throw storeError;
        }
        storeData = fetchedStoreData;
      } else {
          console.warn("User not linked to any store. Cannot load profile.");
          setError('No store found for this user. Please complete store setup first.');
          setProfile(prev => ({ ...prev, store_id: null, name: '', description: '', logo_url: '', address: '', phone: '', email: '', category: '', additional_details: '' }));
      }

      if (storeData) {
        setProfile(prev => ({
          ...prev,
          store_id: storeData.id,
          name: storeData.name || '',
          description: storeData.description || '',
          logo_url: storeData.logo_url || '',
          address: storeData.address || '',
          phone: storeData.phone || '',
          email: storeData.email || '',
          category: storeData.category || '',
          additional_details: storeData.additional_details || '',
        }));
      }
    } catch (err: any) {
      console.error('Error loading store profile:', err);
      if (err.code === 'PGRST406') {
           setError('Permission denied to load store profile. Check RLS policies.');
      } else if (err.code) {
           setError(`Failed to load store profile: ${err.message || err.code}`);
      }
      else {
           setError('Failed to load store profile');
      }
      setProfile(prev => ({ ...prev, store_id: null }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant?.id) {
      setError('User not authenticated.');
      return;
    }
    if (!profile.store_id) {
      setError('No store found to update. Please complete store setup first.');
      console.error("Attempted to submit profile without a store_id");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { error: updateError } = await supabase
        .from('stores')
        .update({
          name: profile.name,
          description: profile.description,
          logo_url: profile.logo_url,
          address: profile.address,
          phone: profile.phone,
          email: profile.email,
          category: profile.category,
          additional_details: profile.additional_details,
        })
        .eq('id', profile.store_id);

      if (updateError) throw updateError;

      setIsEditing(false);
      setError('Store profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating store profile:', err);
       if (err.code === 'PGRST406') {
           setError('Permission denied to update store profile. Check RLS policies.');
       } else if (err.code) {
           setError(`Failed to update store profile: ${err.message || err.code}`);
       } else {
           setError('Failed to update store profile');
       }
    } finally {
      setLoading(false);
    }
  };

  const handleOpeningHoursUpdate = (
    day: string,
    hours: typeof profile.openingHours[keyof typeof profile.openingHours]
  ) => {
    setProfile({
      ...profile,
      openingHours: {
        ...profile.openingHours,
        [day]: hours,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile.store_id && !loading && error) {
     return (
         <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
              <Store className="mx-auto h-12 w-12 text-indigo-600" />
              <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                 Store Profile Not Found
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                 {error || 'Please complete your store setup to view your profile.'}
              </p>
                <div className="mt-6">
                   Check if you have completed the store setup.
                </div>
            </div>
         </div>
     );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Store Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your store's information and settings
        </p>
      </div>

      {error && (
         profile.store_id && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
               {error}
            </div>
         )
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Logo and Basic Info */}
              <div className="flex items-start space-x-6">
                <div>
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={profile.name}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Store className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Change Logo
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        value={profile.category}
                        onChange={(e) =>
                          setProfile({ ...profile, category: e.target.value })
                        }
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={profile.description}
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
                <textarea
                  value={profile.additional_details || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, additional_details: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Opening Hours */}
              <OpeningHours
                openingHours={profile.openingHours}
                isEditing={isEditing}
                onUpdate={handleOpeningHoursUpdate}
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}