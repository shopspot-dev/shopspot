import React from 'react';
import { X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

interface FilterSidebarProps {
  title: string;
  filters: FilterOption[];
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  title,
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  isMobile,
  onClose,
}: FilterSidebarProps) {
  return (
    <div className={`
      bg-white
      ${isMobile ? 'fixed inset-0 z-40' : 'w-64 flex-shrink-0'}
    `}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          onClick={onClearFilters}
          className="mt-2 text-sm text-green-600 hover:text-green-700"
        >
          Clear all filters
        </button>
      </div>

      <div className="p-4 space-y-6">
        {filters.map((filter) => (
          <div key={filter.id}>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {filter.label}
            </h3>

            {filter.type === 'checkbox' && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.id]?.includes(option.value)}
                      onChange={(e) => {
                        const current = selectedFilters[filter.id] || [];
                        const value = e.target.checked
                          ? [...current, option.value]
                          : current.filter((v: string) => v !== option.value);
                        onFilterChange(filter.id, value);
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {filter.type === 'range' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min={filter.min}
                    max={filter.max}
                    value={selectedFilters[filter.id]?.min || ''}
                    onChange={(e) => onFilterChange(filter.id, {
                      ...selectedFilters[filter.id],
                      min: e.target.value,
                    })}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min={filter.min}
                    max={filter.max}
                    value={selectedFilters[filter.id]?.max || ''}
                    onChange={(e) => onFilterChange(filter.id, {
                      ...selectedFilters[filter.id],
                      max: e.target.value,
                    })}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}