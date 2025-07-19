import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using mock data only.');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);

// Example type for a store (adjust as needed)
export interface SupabaseStore {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  // Add other fields as needed from your schema
}

export interface SupabaseMenuItem {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  store_id: string;
  name: string;
  created_at: string;
} 