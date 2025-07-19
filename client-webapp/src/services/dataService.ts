import { supabase, SupabaseStore } from '../lib/supabase';
import { stores as mockStores } from '../data/mockData';
import { Store } from '../types';

export const dataService = {
  async getStores(): Promise<Store[]> {
    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error || !data) throw error;
      // Transform SupabaseStore to your Store type if needed
      return data.map((s: SupabaseStore) => ({
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
  }
};