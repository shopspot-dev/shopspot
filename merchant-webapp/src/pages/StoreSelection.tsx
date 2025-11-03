import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, ArrowLeft, Crown, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function StoreSelection() {
  const navigate = useNavigate();
  const { merchant, switchStore, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStoreSelect = async (storeId: string) => {
    setLoading(true);
    try {
      await switchStore(storeId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error switching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    navigate('/store-setup');
  };

  const handleBackToSignIn = () => {
    logout();
    navigate('/signin');
  };

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackToSignIn}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Select Store</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {merchant.name || merchant.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Stores</h2>
          <p className="text-gray-600">Choose a store to manage or create a new one</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Stores */}
          {merchant.stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleStoreSelect(store.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Store className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      Owner
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {store.name}
                </h3>
                
                {store.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {store.description}
                  </p>
                )}
                
                <div className="space-y-2 text-xs text-gray-500">
                  {store.address && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      <span className="truncate">{store.email}</span>
                    </div>
                  )}
                  {store.category && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                        {store.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Enter Store</span>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full group-hover:bg-indigo-700 transition-colors"></div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Store Card */}
          <div
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group"
            onClick={handleCreateStore}
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Create New Store
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Set up a new store to start selling
              </p>
              
              <div className="flex items-center justify-center text-indigo-600 group-hover:text-indigo-700">
                <span className="text-sm font-medium">Get Started</span>
                <Plus className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-gray-700">Switching store...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


