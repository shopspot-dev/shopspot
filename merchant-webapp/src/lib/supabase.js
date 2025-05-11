import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Menu Items CRUD
export const menuItems = {
  async getAll(storeId) {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('store_id', storeId);
    
    if (error) throw error;
    return data;
  },

  async create(item) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleAvailability(id, isAvailable) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Categories CRUD
export const categories = {
  async getAll(storeId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId);
    
    if (error) throw error;
    return data;
  },

  async create(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Orders CRUD
export const orders = {
  async getAll(storeId) {
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
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Users CRUD
export const users = {
  async getAll(storeId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('store_id', storeId);
    
    if (error) throw error;
    return data;
  },

  async create(user) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Store Settings
export const settings = {
  async get(storeId) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('store_id', storeId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(storeId, updates) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ store_id: storeId, ...updates })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Store Profile
export const stores = {
  async get(storeId) {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        hours:store_hours(*)
      `)
      .eq('id', storeId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};