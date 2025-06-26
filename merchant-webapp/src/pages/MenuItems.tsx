import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpDown, Trash2, Copy, Search } from 'lucide-react';
import MenuItemCard from '../components/menu/MenuItemCard';
import MenuItemForm from '../components/menu/MenuItemForm';
import { useAuth } from '../contexts/AuthContext';
import { menuItems, categories, MenuItem, Category, supabase } from '../lib/supabase'; // ✅ import properly

type AvailabilityOption = 'all' | 'available' | 'unavailable';
type StockStatusOption = 'all' | 'inStock' | 'outOfStock';
type DietaryOption = 'all' | 'vegetarian' | 'vegan' | 'gluten-free';

interface FilterOptions {
    availability: AvailabilityOption;
    stockStatus: StockStatusOption;
    priceRange: 'all';
    dietary: DietaryOption;
}

export default function MenuItems() {
  const { merchant } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
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
    console.log("🧪 merchant?.id in useEffect:", merchant?.id);
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
  
      // ✅ Get actual store_id from store_users
      const { data: storeUserLink, error: storeUserError } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', merchant.id)
        .maybeSingle();
  
      if (storeUserError) throw storeUserError;
      if (!storeUserLink?.store_id) {
        setError('No store linked to this user.');
        return;
      }
  
      const storeId = storeUserLink.store_id;
  
      console.log("🛒 Corrected storeId for fetching:", storeId);
  
      const [itemsData, categoriesData] = await Promise.all([
        menuItems.getAll(storeId),
        categories.getAll()
      ]);
  
      console.log("✅ Raw itemsData from Supabase:", itemsData);
      console.log("✅ Category List:", categoriesData);
  
      setItems(itemsData);
      setCategoryList(categoriesData);
    } catch (err) {
      console.error("❌ loadData error:", err);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleAddItem = async (itemData: Partial<MenuItem>) => {
    if (!merchant?.id) {
      setError('User not authenticated.');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
  
      // ✅ Step 1: Get store_id linked to the current user
      const { data: storeUserLink, error: storeUserError } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', merchant.id)
        .limit(1)
        .maybeSingle();
  
      if (storeUserError) throw storeUserError;
      if (!storeUserLink?.store_id) {
        setError('No store linked to this user. Cannot add item.');
        return;
      }
  
      const actualStoreId = storeUserLink.store_id;
  
      console.log('Item data being sent:', itemData);
      console.log('Authenticated User ID (merchant.id):', merchant.id);
      console.log('Actual Store ID to be used:', actualStoreId);
  
      // ✅ Step 2: Insert directly with supabase
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert([{ ...itemData, store_id: actualStoreId }]);
  
      if (insertError) throw insertError;
  
      await loadData();
      setShowForm(false);
    } catch (err: any) {
      console.error('Add error:', err);
      if (err.message) {
        setError(`Failed to add item: ${err.message}`);
      } else {
        setError('Failed to add item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };  

  const handleEditItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setLoading(true);
      setError('');
  
      const { error: updateError } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);
  
      if (updateError) throw updateError;
  
      await loadData();
      setShowForm(false);
      setSelectedItem(null);
    } catch (err: any) {
      console.error('Update error:', err);
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
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
      // ✅ Get the actual store_id from store_users
      const { data: storeUserLink, error: storeUserError } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', merchant.id)
        .maybeSingle();

      if (storeUserError) throw storeUserError;
      if (!storeUserLink?.store_id) {
        setError('No store linked to this user.');
        return;
      }

      const actualStoreId = storeUserLink.store_id;
      const selectedItemsData = items.filter(item => selectedItems.has(item.id));

      await Promise.all(
        selectedItemsData.map(item => {
          const { category, ...cleanedItem } = item as any; // remove joined field
          const duplicateItem: Partial<MenuItem> = {
            ...cleanedItem,
            id: undefined, // Let Supabase generate a new ID
            store_id: actualStoreId,
            name: `${item.name} (Copy)`
          };
          return menuItems.create(duplicateItem);
        })
      );

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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your menu items, prices, and availability
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </button>
      </div>
  
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
  
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.availability}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  availability: e.target.value as AvailabilityOption,
                })
              }              
              className="rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 px-3 bg-white"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              value={filters.stockStatus}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  stockStatus: e.target.value as StockStatusOption,
                })
              }
              className="rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 px-3 bg-white"
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
            <select
              value={filters.dietary}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dietary: e.target.value as DietaryOption,
                })
              }
              className="rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 px-3 bg-white"
            >
              <option value="all">All Dietary</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten Free</option>
            </select>
          </div>
        </div>
  
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Items
          </button>
          {categoryList.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
  
      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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
          <div className="flex gap-2">
            <button
              onClick={handleBulkDuplicate}
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1.5" />
              Duplicate
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </button>
          </div>
        </div>
      )}
  
      {/* Sort Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleSort('name')}
          className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            sortField === 'name'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1.5" />
          Name
        </button>
        <button
          onClick={() => handleSort('price')}
          className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            sortField === 'price'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1.5" />
          Price
        </button>
        <button
          onClick={() => handleSort('stock')}
          className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            sortField === 'stock'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1.5" />
          Stock
        </button>
      </div>
  
      {/* Menu Items Grid */}
      <div className="space-y-3">
      {filteredItems.map((item) => (
        <MenuItemCard
          key={item.id} // ✅ this is the fix
          item={item}
          isSelected={selectedItems.has(item.id)}
          onSelect={() => handleSelectItem(item.id)}
          onEdit={() => {
            setSelectedItem(item);
            setShowForm(true);
          }}
          onDelete={() => handleDeleteItem(item.id)}
          onToggleAvailability={() => handleToggleAvailability(item.id, !item.is_available)}
        />
      ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg text-gray-500">
            No items found matching your criteria
          </div>
        )}
      </div>
  
      {/* Add/Edit Form Modal */}
      {showForm && (
        <MenuItemForm
          item={selectedItem}
          categories={categoryList}
          onSubmit={(data) => {
            if (selectedItem) {
              handleEditItem(selectedItem.id, data);
            } else {
              handleAddItem(data);
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );  
}
