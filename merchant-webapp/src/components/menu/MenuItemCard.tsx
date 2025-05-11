import React from 'react';
import { MenuItem } from '../../types';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggleAvailability(item.id)}
          className={`p-2 rounded-full ${
            item.isAvailable ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          {item.isAvailable ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}