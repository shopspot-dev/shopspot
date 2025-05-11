import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Store, Menu, Package, Settings, BarChart3, DollarSign, Users } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Menu Items', href: '/dashboard/menu', icon: Menu },
  { name: 'Store Profile', href: '/dashboard/profile', icon: Store },
  { name: 'Orders', href: '/dashboard/orders', icon: Package },
  { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        {onClose && (
          <button
            type="button"
            className="md:hidden ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        )}
        <Store className="w-8 h-8 text-indigo-600" />
        <span className="ml-2 text-xl font-semibold">ShopSpot</span>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                onClick={onClose}
              >
                <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}