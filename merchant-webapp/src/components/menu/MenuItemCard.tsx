import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

type MenuItem = {
  image_url: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  preparation_time?: number;
  tags?: string[];
  dietary_restrictions?: string[];
  is_available: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onMarkOutOfStock: () => void; // <-- add this
}

export default function MenuItemCard({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAvailability,
  onMarkOutOfStock,
}: MenuItemCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 flex items-start justify-between ${
      isSelected ? 'ring-2 ring-indigo-500' : ''
    }`}>
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
          <img
            src={item.image_url || '/placeholder.png'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500 break-words">{item.description}</p>
          <div className="mt-1 flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
            <span className="text-sm text-gray-500">•</span>
            <p className="text-sm text-gray-500">Stock: {item.stock_quantity}</p>
            {item.preparation_time && (
              <>
                <span className="text-sm text-gray-500">•</span>
                <p className="text-sm text-gray-500">{item.preparation_time} mins prep</p>
              </>
            )}
          </div>
          {(item.tags?.length || 0) > 0 || (item.dietary_restrictions?.length || 0) > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags?.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
              {item.dietary_restrictions?.map(restriction => (
                <span key={restriction} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  {restriction}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={item.stock_quantity === 0 ? undefined : onToggleAvailability}
          title={
            item.stock_quantity === 0
              ? "Cannot make available: item is out of stock"
              : item.is_available
                ? "Mark as unavailable"
                : "Mark as available"
          }
          className={`p-2 rounded-full ${
            item.is_available ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
          }`}
          disabled={item.stock_quantity === 0}
          style={item.stock_quantity === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {item.is_available ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent any default browser behavior
            onDelete();
          }}
          title="Delete"
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        {item.stock_quantity > 0 && (
          <button
            onClick={onMarkOutOfStock}
            title="Mark as Out of Stock"
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 