import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MenuItemCard from '../components/menu/MenuItemCard';
import { MenuItem } from '../types';

const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and special sauce',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons with Caesar dressing',
    price: 9.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

export default function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(items.map(item => item.category))];

  const handleEdit = (item: MenuItem) => {
    // Implement edit functionality
    console.log('Edit item:', item);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your menu items, prices, and availability
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
          />
        ))}
      </div>
    </div>
  );
}