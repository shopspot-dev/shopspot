import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoreCategory } from '../types';
import * as Icons from 'lucide-react';

interface StoreCategoryListProps {
  storeId: string;
  categories: StoreCategory[];
}

const categoryIconMap: Record<string, string> = {
  'clothing & apparel': 'Shirt',
  'footwear': 'Footprints',
  'food & groceries': 'ShoppingCart',
  'beverages': 'Coffee',
  'electronics & accessories': 'Laptop',
  'home & kitchen essentials': 'Home',
  'other (not listed)': 'Box',
};

export default function StoreCategoryList({ storeId, categories }: StoreCategoryListProps) {
  
  useEffect(() => {
    console.log('Available Shirt:', (Icons as any).Shirt);
    console.log('Available Tshirt:', (Icons as any).Tshirt);
    console.log('Available Footprints:', (Icons as any).Footprints);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        // Normalize the name (trim + lowercase)
        const normalizedName = category.name.trim().toLowerCase();
        const iconName = categoryIconMap[normalizedName] || 'Box';

        const IconComponent = (Icons as any)[iconName] ?? (Icons as any)['Box'];

        return (
          <Link
            key={category.id}
            to={`/stores/${storeId}/categories/${category.id}`}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <IconComponent className="h-8 w-8 text-gray-600 mb-2" />
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
