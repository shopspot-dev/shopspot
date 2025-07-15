import React from 'react';
import { Truck, Store } from 'lucide-react';

interface DeliveryToggleProps {
  mode: 'delivery' | 'pickup';
  onChange: (mode: 'delivery' | 'pickup') => void;
}

export default function DeliveryToggle({ mode, onChange }: DeliveryToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
          mode === 'delivery'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        onClick={() => onChange('delivery')}
      >
        <Truck className="h-4 w-4 mr-1.5" />
        Delivery
      </button>
      <button
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
          mode === 'pickup'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        onClick={() => onChange('pickup')}
      >
        <Store className="h-4 w-4 mr-1.5" />
        Pickup
      </button>
    </div>
  );
}