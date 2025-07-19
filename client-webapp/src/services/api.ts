import { supabase, SupabaseStore, SupabaseMenuItem, SupabaseCategory } from '../lib/supabase';
import { Store, Product, Category } from '../types';
import { stores as mockStores, products as mockProducts, categories as mockCategories } from '../data/mockData';

// API service for fetching data from Supabase
export const apiService = {
  // Fetch all stores from Supabase
  async getStores(): Promise<Store[]> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true); // Assuming you have an is_active field

      if (error) {
        console.error('Error fetching stores from Supabase:', error);
        return mockStores; // Fallback to mock data
      }

      if (!data || data.length === 0) {
        console.log('No stores found in Supabase, using mock data');
        return mockStores;
      }

      // Transform Supabase data to match our Store interface
      return data.map((store: SupabaseStore): Store => ({
        id: store.id,
        name: store.name,
        description: store.description || 'No description available',
        image: store.logo_url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04', // Default image
        location: {
          lat: 40.7128, // Default coordinates - you might want to add lat/lng to your stores table
          lng: -74.0060,
          address: store.address || 'Address not available'
        },
        categories: [], // Will be populated separately
        rating: 4.5, // Default rating - you might want to add this to your stores table
        featured: true, // Default featured status
        openingHours: {
          'Monday': '9:00 AM - 9:00 PM',
          'Tuesday': '9:00 AM - 9:00 PM',
          'Wednesday': '9:00 AM - 9:00 PM',
          'Thursday': '9:00 AM - 9:00 PM',
          'Friday': '9:00 AM - 10:00 PM',
          'Saturday': '10:00 AM - 10:00 PM',
          'Sunday': '10:00 AM - 6:00 PM'
        }
      }));
    } catch (error) {
      console.error('Error in getStores:', error);
      return mockStores;
    }
  },

  // Fetch all menu items (products) from Supabase
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          store:stores(name),
          category:categories(name)
        `)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        return mockProducts;
      }

      if (!data || data.length === 0) {
        console.log('No products found in Supabase, using mock data');
        return mockProducts;
      }

      // Transform Supabase data to match our Product interface
      return data.map((item: any): Product => ({
        id: item.id,
        name: item.name,
        description: item.description || 'No description available',
        price: item.price,
        category: item.category?.name || 'Uncategorized',
        image: item.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', // Default image
        stockStatus: item.is_available ? 'available' : 'out',
        storeId: item.store_id,
        featured: true // Default featured status
      }));
    } catch (error) {
      console.error('Error in getProducts:', error);
      return mockProducts;
    }
  },

  // Fetch categories from Supabase
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        return mockCategories;
      }

      if (!data || data.length === 0) {
        console.log('No categories found in Supabase, using mock data');
        return mockCategories;
      }

      // Transform Supabase data to match our Category interface
      return data.map((category: SupabaseCategory): Category => ({
        id: category.id,
        name: category.name,
        icon: 'Package', // Default icon - you might want to add this to your categories table
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04', // Default image
        storeId: category.store_id
      }));
    } catch (error) {
      console.error('Error in getCategories:', error);
      return mockCategories;
    }
  },

  // Fetch products by store
  async getProductsByStore(storeId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('store_id', storeId)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching store products from Supabase:', error);
        return mockProducts.filter(p => p.storeId === storeId);
      }

      if (!data || data.length === 0) {
        console.log(`No products found for store ${storeId}, using mock data`);
        return mockProducts.filter(p => p.storeId === storeId);
      }

      return data.map((item: any): Product => ({
        id: item.id,
        name: item.name,
        description: item.description || 'No description available',
        price: item.price,
        category: item.category?.name || 'Uncategorized',
        image: item.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stockStatus: item.is_available ? 'available' : 'out',
        storeId: item.store_id,
        featured: true
      }));
    } catch (error) {
      console.error('Error in getProductsByStore:', error);
      return mockProducts.filter(p => p.storeId === storeId);
    }
  },

  // Fetch a single store by ID
  async getStoreById(storeId: string): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) {
        console.error('Error fetching store from Supabase:', error);
        return mockStores.find(s => s.id === storeId) || null;
      }

      if (!data) {
        return mockStores.find(s => s.id === storeId) || null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || 'No description available',
        image: data.logo_url || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: data.address || 'Address not available'
        },
        categories: [],
        rating: 4.5,
        featured: true,
        openingHours: {
          'Monday': '9:00 AM - 9:00 PM',
          'Tuesday': '9:00 AM - 9:00 PM',
          'Wednesday': '9:00 AM - 9:00 PM',
          'Thursday': '9:00 AM - 9:00 PM',
          'Friday': '9:00 AM - 10:00 PM',
          'Saturday': '10:00 AM - 10:00 PM',
          'Sunday': '10:00 AM - 6:00 PM'
        }
      };
    } catch (error) {
      console.error('Error in getStoreById:', error);
      return mockStores.find(s => s.id === storeId) || null;
    }
  }
}; 