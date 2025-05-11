import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function MenuItemCard({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 flex items-center justify-between ${
      isSelected ? 'ring-2 ring-indigo-500' : ''
    }`}>
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
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
          {(item.tags?.length > 0 || item.dietary_restrictions?.length > 0) && (
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
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleAvailability}
          className={`p-2 rounded-full ${
            item.is_available ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          {item.is_available ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}