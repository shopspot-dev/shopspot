import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import AccountSwitcher from './AccountSwitcher';

export default function TopBar({ onMenuClick }) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          {/* Add search or other controls here */}
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <AccountSwitcher />
        </div>
      </div>
    </div>
  );
}