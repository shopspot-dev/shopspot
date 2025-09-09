import { supabase } from '../lib/supabase';
import { products as mockProducts } from '../data/mockData';
import { Product } from '../types';

export const dataService = {
  async getStores(): Promise<any[]> { // Changed return type to any[] as Store type is removed
    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error || !data) throw error;
      // Transform SupabaseStore to your Store type if needed
      return data.map((s: any) => ({ // Changed SupabaseStore to any
        id: s.id,
        name: s.name,
        description: s.description || '',
        image: s.logo_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        location: {
          lat: 0, // Add real lat/lng if you have them in your schema
          lng: 0,
          address: s.address || 'No address'
        },
        categories: [],
        rating: 4.5,
        featured: false,
        openingHours: {}
      }));
    } catch (e) {
      console.warn('Falling back to mock stores:', e);
      return mockStores;
    }
  },

  async getMenuItems(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error || !data) throw error;
      // Transform to your Product type
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category_id,
        image: item.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stockStatus: item.stock_quantity === 0 ? 'out' : (item.stock_quantity < 10 ? 'low' : 'available'),
        storeId: item.store_id,
        featured: item.featured || false,
        created_at: item.created_at // Add this if you want to sort by date
      }));
    } catch (e) {
      console.warn('Falling back to mock products:', e);
      return []; // Return empty array as mockProducts is removed
    }
  },

  async getMenuItemsByStore(storeId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("store_id", storeId);
  
      if (error || !data) throw error;
  
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        category: item.category_id,
        image: item.image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        stockStatus:
          item.stock_quantity === 0
            ? "out"
            : item.stock_quantity < 10
            ? "low"
            : "available",
        storeId: item.store_id,
        featured: item.featured || true,
        created_at: item.created_at,
      }));
    } catch (e) {
      console.error("Error fetching menu items by store:", e);
      return [];
    }
  },  

  async getStoreById(id: string) {
    try {
      // 1️⃣ Fetch the store data
      const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .single();

      if (storeError || !storeData) throw storeError;

      // 2️⃣ Fetch the category details
      let categories: any[] = [];
      if (storeData.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("id", storeData.category_id)
          .single();

        if (!categoryError && categoryData) {
          categories = [
            {
              id: categoryData.id,
              name: categoryData.name,
              image: categoryData.image_url || "",
              icon: categoryData.icon || "",
            },
          ];
        }
      }
      // 3️⃣ Return a store object with categories included
      return {
        id: storeData.id,
        name: storeData.name,
        description: storeData.description || "",
        image:
          storeData.logo_url ||
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        location: {
          lat: 0,
          lng: 0,
          address: storeData.address || "No address",
        },
        categories, // ✅ Now contains [{ id, name, image }]
        rating: 4.5,
        featured: false,
        openingHours: {},
      };
    } catch (e) {
      console.warn("Falling back to mock store:", e);
      return null;
    }
  },

  async getMenuItemById(id: string) {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single();
      if (error || !data) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        category: data.category_id,
        image: data.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stockStatus: data.stock_quantity === 0 ? 'out' : (data.stock_quantity < 10 ? 'low' : 'available'),
        storeId: data.store_id,
        featured: data.featured || false,
        created_at: data.created_at
      };
    } catch (e) {
      console.warn('Falling back to mock product:', e);
      return null;
    }
  },

  getStoreHours: async (storeId: string) => {
    const { data, error } = await supabase
      .from("store_hours")
      .select("*")
      .eq("store_id", storeId);
  
    if (error) {
      console.error("Error fetching store hours:", error.message);
      return [];
    }
  
    return data || [];
  },
  
};