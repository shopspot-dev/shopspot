import React, { useState } from 'react';
import { ChevronDown, LogOut, Store, SwitchCamera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';

export default function AccountSwitcher() {
  const { merchant, currentStore, logout, switchStore } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/signin');
  };

  const handleSwitchStore = () => {
    setIsOpen(false);
    navigate('/store-selection');
  };

  const handleStoreSelect = async (storeId: string) => {
    setIsOpen(false);
    await switchStore(storeId);
    // Refresh the page to load new store data
    window.location.reload();
  };

  if (!merchant || !currentStore) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <Store className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{currentStore.name}</p>
          <p className="text-xs text-gray-500">{merchant.email}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Account Settings</p>
            <p className="text-xs text-gray-500">{merchant.email}</p>
          </div>

          {/* Store List */}
          <div className="py-1">
            {merchant.stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store.id)}
                className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center ${
                  store.id === currentStore.id ? 'bg-indigo-50' : ''
                }`}
              >
                <Store className="w-4 h-4 mr-2 text-gray-400" />
                {store.name}
                {store.id === currentStore.id && (
                  <span className="ml-auto text-xs text-indigo-600">Current</span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={handleSwitchStore}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <SwitchCamera className="w-4 h-4 mr-2 text-gray-400" />
              Switch Store
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}