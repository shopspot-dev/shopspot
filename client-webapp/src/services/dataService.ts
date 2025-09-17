import { supabase } from '../lib/supabase';
import { products as mockProducts } from '../data/mockData';
import { Product } from '../types';
import { format, parse } from "date-fns";
 
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
 
      // 2️⃣ Fetch categories based on products (not store category_id)
      const categories = await this.getStoreCategoriesByProducts(storeData.id);

      // 3️⃣ Fetch store hours
      const openingHours = await this.getStoreHours(storeData.id);
     
      // 4️⃣ Return a store object with categories included
      return {
        id: storeData.id,
        name: storeData.name,
        description: storeData.description || "",
        image: storeData.logo_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        location: {
          lat: 0,
          lng: 0,
          address: storeData.address || "No address",
        },
        categories, // ✅ Now contains ALL categories with products
        rating: 4.5,
        featured: false,
        openingHours,
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
    console.log("🔍 Fetching store hours for storeId:", storeId);
    
    const { data, error } = await supabase
      .from("store_hours")
      .select("day_of_week, open_time, close_time, is_closed")
      .eq("store_id", storeId);

    console.log("📊 Raw Supabase response:", { data, error });

    if (error) {
      console.error("❌ Error fetching store hours:", error.message);
      console.error("❌ Full error object:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No store hours data found for storeId:", storeId);
      return [];
    }

    console.log("✅ Found store hours data:", data);

    const DAYS = [
      "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday", "Sunday",
    ];

    const formatTime = (t: string | null) => {
      if (!t) return "";
      const [h, m] = t.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m);
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };

    const map: Record<string, { open: string; close: string }> = {};

    (data || []).forEach((row: any) => {
      const day =
        row.day_of_week.charAt(0).toUpperCase() +
        row.day_of_week.slice(1).toLowerCase();

      // ✅ explicitly check boolean
      if (row.is_closed === true) {
        map[day] = { open: "Closed", close: "" };
      } else {
        map[day] = {
          open: formatTime(row.open_time),
          close: formatTime(row.close_time),
        };
      }

      console.log("Row from DB:", row.day_of_week, "is_closed:", row.is_closed);
    });

    const result = DAYS.map((day) => ({
      day,
      open: map[day]?.open || "Closed",
      close: map[day]?.close || "",
    }));

    console.log("🎯 Final processed hours:", result);
    return result;
  },
 
  // Add this temporary function to test database access
  testDatabaseAccess: async () => {
    console.log("🧪 Testing database access...");
    
    // Test 1: Can we access stores table?
    const { data: stores, error: storesError } = await supabase
      .from("stores")
      .select("id, name")
      .limit(1);
    
    console.log("Stores table access:", { stores, storesError });
    
    // Test 2: Can we access store_hours table?
    const { data: hours, error: hoursError } = await supabase
      .from("store_hours")
      .select("*")
      .limit(1);
    
    console.log("Store hours table access:", { hours, hoursError });
    
    // Test 3: Try to get hours for a specific store
    if (stores && stores.length > 0) {
      const storeId = stores[0].id;
      console.log("Testing hours for store:", storeId);
      
      const { data: storeHours, error: storeHoursError } = await supabase
        .from("store_hours")
        .select("*")
        .eq("store_id", storeId);
      
      console.log("Store hours for specific store:", { storeHours, storeHoursError });
    }
  },

  // Add this new function to get categories by store products
  async getStoreCategoriesByProducts(storeId: string): Promise<any[]> { // Assuming StoreCategory type is not defined, using 'any' for now
    try {
      // First get all products for this store
      const products = await this.getMenuItemsByStore(storeId);
      
      // Get unique category IDs from products
      const categoryIds = [...new Set(products.map(p => p.category))];
      
      if (categoryIds.length === 0) return [];
      
      // Fetch category details for all unique category IDs
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .in('id', categoryIds);
      
      if (error || !categoriesData) return [];
      
      // Transform to StoreCategory with product counts
      return categoriesData.map((category: any) => ({
        id: category.id,
        name: category.name,
        icon: category.icon || '',
        image: category.image_url || '',
        productCount: products.filter(p => p.category === category.id).length,
        storeId: storeId,
      }));
    } catch (error) {
      console.error('Error fetching store categories by products:', error);
      return [];
    }
  }
};