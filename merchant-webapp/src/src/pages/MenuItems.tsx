import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpDown, Trash2, Copy, Search } from 'lucide-react';
import MenuItemCard from '../components/menu/MenuItemCard';
import MenuItemForm from '../components/menu/MenuItemForm';
import { menuItems, categories } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
  category_id: string;
  dietary_restrictions?: string[];
  [key: string]: any;
}

interface Category {
  id: string;
  name: string;
}

interface FilterOptions {
  availability: 'all' | 'available' | 'unavailable';
  stockStatus: 'all' | 'inStock' | 'outOfStock';
  priceRange: 'all';
  dietary: 'all' | 'vegetarian' | 'vegan' | 'gluten-free';
}

export default function MenuItems() {
  const { merchant } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    availability: 'all',
    stockStatus: 'all',
    priceRange: 'all',
    dietary: 'all',
  });

  useEffect(() => {
    if (merchant?.id) {
      loadData();
    } else {
      setError('No store selected');
      setLoading(false);
    }
  }, [merchant?.id]);

  const loadData = async () => {
    if (!merchant?.id) return;
    try {
      setLoading(true);
      setError('');
      const [itemsData, categoriesData] = await Promise.all([
        menuItems.getAll(merchant.id),
        categories.getAll(merchant.id),
      ]);
      setItems(itemsData);
      setCategoryList(categoriesData);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData: Partial<MenuItem>) => {
    if (!merchant?.id) return;
    try {
      await menuItems.create({ ...itemData, store_id: merchant.id });
      await loadData();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add item');
      console.error('Add error:', err);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await menuItems.delete(id);
      await loadData();
      setSelectedItems(new Set());
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedItems).map(id => menuItems.delete(id)));
      await loadData();
      setSelectedItems(new Set());
    } catch (err) {
      setError('Failed to delete selected items');
      console.error('Bulk delete error:', err);
    }
  };

  const handleBulkDuplicate = async () => {
    if (!merchant?.id) return;
    try {
      const selectedItemsData = items.filter(item => selectedItems.has(item.id));
      await Promise.all(selectedItemsData.map(item => {
        const duplicateItem: Partial<MenuItem> = {
          ...item,
          name: `${item.name} (Copy)`,
          id: undefined,
          store_id: merchant.id,
        };
        return menuItems.create(duplicateItem);
      }));
      await loadData();
      setSelectedItems(new Set());
    } catch (err) {
      setError('Failed to duplicate selected items');
      console.error('Bulk duplicate error:', err);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await menuItems.toggleAvailability(id, isAvailable);
      await loadData();
    } catch (err) {
      setError('Failed to update item availability');
      console.error('Update error:', err);
    }
  };

  const handleSort = (field: 'name' | 'price' | 'stock') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const filteredItems = items
    .filter(item => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.availability !== 'all' && item.is_available !== (filters.availability === 'available')) return false;
      if (filters.stockStatus === 'inStock' && item.stock_quantity <= 0) return false;
      if (filters.stockStatus === 'outOfStock' && item.stock_quantity > 0) return false;
      if (filters.dietary !== 'all' && !item.dietary_restrictions?.includes(filters.dietary)) return false;
      return true;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') return direction * a.name.localeCompare(b.name);
      if (sortField === 'price') return direction * (a.price - b.price);
      if (sortField === 'stock') return direction * (a.stock_quantity - b.stock_quantity);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!merchant?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-600">
          <p className="text-lg font-medium">No store selected</p>
          <p className="mt-2">Please select a store to view menu items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your menu items, prices, and availability
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Item
        </button>
      </div>
  
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
  
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value as FilterOptions['availability'] })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              value={filters.stockStatus}
              onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value as FilterOptions['stockStatus'] })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
            <select
              value={filters.dietary}
              onChange={(e) => setFilters({ ...filters, dietary: e.target.value as FilterOptions['dietary'] })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Dietary</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten Free</option>
            </select>
          </div>
        </div>
  
        {/* Category Filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categoryList.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
  
      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredItems.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">
              {selectedItems.size} items selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkDuplicate}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
  
      {/* Sort Controls */}
      <div className="mb-4 flex space-x-4">
        {(['name', 'price', 'stock'] as const).map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
              sortField === field
                ? 'border-indigo-600 text-indigo-600'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {field[0].toUpperCase() + field.slice(1)}
          </button>
        ))}
      </div>
  
      {/* Menu Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={() => handleSelectItem(item.id)}
            onEdit={() => handleEditItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
            onToggleAvailability={() =>
              handleToggleAvailability(item.id, !item.is_available)
            }
          />
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No items found matching your criteria
          </div>
        )}
      </div>
  
      {/* Add/Edit Form Modal */}
      {showForm && (
        <MenuItemForm
          item={selectedItem}
          categories={categoryList}
          onSubmit={handleAddItem}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
  
}
