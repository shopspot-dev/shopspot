import React from 'react';
import { Link } from 'react-router-dom';
import { StoreCategory } from '../types';
import * as Icons from 'lucide-react';

interface StoreCategoryListProps {
  storeId: string;
  categories: StoreCategory[];
}

export default function StoreCategoryList({ storeId, categories }: StoreCategoryListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const IconComponent = (Icons as any)[category.icon];
        
        return (
          <Link
            key={category.id}
            to={`/stores/${storeId}/categories/${category.id}`}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {IconComponent && (
              <IconComponent className="h-8 w-8 text-gray-600 mb-2" />
            )}
            <h3 className="text-sm font-medium text-gray-900 text-center">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {category.productCount} items
            </p>
          </Link>
        );
      })}
    </div>
  );
}