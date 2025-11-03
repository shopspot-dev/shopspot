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
  const { currentStore } = useAuth(); // ✅ Use currentStore
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
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (currentStore?.id) {
      loadData();
    } else {
      setError('No store selected');
      setLoading(false);
    }
  }, [currentStore?.id]); // ✅ Reload when store changes
  
  const loadData = async () => {
    if (!currentStore?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const [itemsData, categoriesData] = await Promise.all([
        menuItems.getAll(currentStore.id), // ✅ Use currentStore.id
        categories.getAll()
      ]);
      
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
    if (!currentStore?.id) {
      setError('No store selected');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('menu_items')
        .insert([{ ...itemData, store_id: currentStore.id }]);

      if (error) throw error;
      
      await loadData();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };  

  const handleEditItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setError('');
      // Find the previous item
      const prevItem = items.find(item => item.id === id);

      // If stock_quantity is being set
      if ('stock_quantity' in updates && prevItem) {
        const newStock = updates.stock_quantity ?? prevItem.stock_quantity;
        // If going from 0 to >0, set available
        if (prevItem.stock_quantity === 0 && newStock > 0) {
          updates.is_available = true;
        }
        // If setting to 0, set unavailable
        if (newStock === 0) {
          updates.is_available = false;
        }
      }

      const { error: updateError } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Optimistically update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      setShowForm(false);
      setSelectedItem(null);
    } catch (err: any) {
      console.error('Update error:', err);
      setError('Failed to update item');
      // Optionally reload if error
      await loadData();
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteItem = async (id: string) => {
    try {
      await menuItems.delete(id);
      // Remove the deleted item from local state instead of reloading all
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      setSelectedItems(new Set());
      setSuccessMessage('Item successfully deleted.');
      setTimeout(() => setSuccessMessage(''), 3000); // clear after 3s
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
      setSuccessMessage('Selected items deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError('Failed to delete selected items');
      console.error('Bulk delete error:', err);
    }
  };

  const handleBulkDuplicate = async () => {
    if (!currentStore?.id) return;
    try {
      // ✅ Get the actual store_id from store_users
      const { data: storeUserLink, error: storeUserError } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', currentStore.id)
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
      setSuccessMessage('Selected items duplicated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError('Failed to duplicate selected items');
      console.error('Bulk duplicate error:', err);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await menuItems.toggleAvailability(id, isAvailable);
      // Update the item in local state instead of reloading all
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, is_available: isAvailable } : item
        )
      );
    } catch (err) {
      setError('Failed to update item availability');
      console.error('Update error:', err);
      // Optionally reload if error
      await loadData();
    }
  };

  const handleMarkOutOfStock = async (id: string) => {
    try {
      setError('');
      const updates = { stock_quantity: 0, is_available: false };
      const { error: updateError } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    } catch (err) {
      setError('Failed to mark item as out of stock');
      console.error('Out of stock error:', err);
      // Optionally reload if error
      await loadData();
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

  if (!currentStore?.id) {
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

      {successMessage && (
        <div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 rounded-lg px-6 py-3 shadow-lg transition-all"
          style={{ minWidth: 250, maxWidth: 400, textAlign: 'center' }}
        >
          {successMessage}
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
          key={item.id}
          item={item}
          isSelected={selectedItems.has(item.id)}
          onSelect={() => handleSelectItem(item.id)}
          onEdit={() => {
            setSelectedItem(item);
            setShowForm(true);
          }}
          onDelete={() => handleDeleteItem(item.id)}
          onToggleAvailability={() => handleToggleAvailability(item.id, !item.is_available)}
          onMarkOutOfStock={() => handleMarkOutOfStock(item.id)}
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
