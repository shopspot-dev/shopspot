import React, { useState } from 'react';
import { ChevronDown, LogOut, Store, UserCircle, SwitchCamera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export default function AccountSwitcher() {
  const { merchant, logout, switchAccount } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const accounts = [
    { id: '1', name: merchant?.storeName || 'Current Store' },
    { id: '2', name: 'Second Store' },
    { id: '3', name: 'Third Store' },
  ];

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
          <p className="text-sm font-medium text-gray-700">{merchant?.storeName}</p>
          <p className="text-xs text-gray-500">{merchant?.email}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Account Settings</p>
            <p className="text-xs text-gray-500">{merchant?.email}</p>
          </div>

          <div className="py-1">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  switchAccount(account.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Store className="w-4 h-4 mr-2 text-gray-400" />
                {account.name}
                {account.id === merchant?.id && (
                  <span className="ml-auto text-xs text-indigo-600">Current</span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile or settings
              }}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
              Profile Settings
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to account switching page
              }}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <SwitchCamera className="w-4 h-4 mr-2 text-gray-400" />
              Switch Account
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