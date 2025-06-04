import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ========== TYPES ==========
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
  category_id: number;
  dietary_restrictions?: string[];
  store_id: string;
}

export interface Category {
  id: number;
  name: string;
  store_id: string;
}

export interface Order {
  id: number;
  store_id: string;
  status: string;
  [key: string]: any;
}

export interface User {
  id: number;
  store_id: string;
  [key: string]: any;
}

export interface Settings {
  id: number;
  store_id: string;
  [key: string]: any;
}

export interface Store {
  id: string;
  name: string;
  [key: string]: any;
}

// ========== CRUD METHODS ==========

export const menuItems = {
  async getAll(storeId: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`*, category:categories(name)`)
      .eq('store_id', storeId);

    if (error) throw error;
    return data as MenuItem[];
  },

  async create(item: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as MenuItem;
  },

  async update(id: number, updates: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as MenuItem;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleAvailability(id: number, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as MenuItem;
  }
};

export const categories = {
  async getAll() {
    const { data, error } = await supabase
    .from('categories')
    .select('id, name');

    if (error) throw error;
    return data as Category[];
  },

  async create(category: Category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Category;
  }
};

// Keep the rest of your orders, users, settings, stores sections the same
export const orders = {
  async getAll(storeId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id,
          quantity,
          price_at_time,
          menu_item:menu_items(name)
        )
      `)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  async updateStatus(id: number, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Order;
  }
};

export const users = {
  async getAll(storeId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('store_id', storeId);

    if (error) throw error;
    return data as User[];
  },

  async create(user: User) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as User;
  },

  async update(id: number, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as User;
  }
};

export const settings = {
  async get(storeId: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('store_id', storeId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Settings;
  },

  async update(storeId: string, updates: Partial<Settings>) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ store_id: storeId, ...updates })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Settings;
  }
};

export const stores = {
  async get(storeId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        hours:store_hours(*)
      `)
      .eq('id', storeId)
      .maybeSingle();

    if (error) throw error;
    return data as Store;
  },

  async update(id: string, updates: Partial<Store>) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Store;
  }
};
