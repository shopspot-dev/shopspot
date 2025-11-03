import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  category?: string;
  additional_details?: string;
  category_id?: string;
  role: string; // owner, admin, staff
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  email: string;
  name?: string;
  role?: string;
  status?: string;
  stores: Store[];
  currentStoreId?: string;
}

interface AuthContextType {
  merchant: Merchant | null;
  currentStore: Store | null;
  login: (merchantData: Merchant) => Promise<boolean>;
  logout: () => void;
  switchStore: (storeId: string) => Promise<void>;
  isAuthenticated: boolean;
  refreshStores: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserStores = useCallback(async (userId: string): Promise<Store[]> => {
    setLoading(true);
    try {
      // Get stores where user is owner
      const { data: stores, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add role as 'owner' for all stores
      const storesWithRole = stores?.map(store => ({ ...store, role: 'owner' })) || [];

      return storesWithRole;
    } catch (error) {
      console.error('Error fetching user stores:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (merchantData: Merchant) => {
    if (!merchantData?.id) {
      console.error('Invalid merchant data: missing id');
      return false;
    }

    try {
      // Fetch user's stores
      const stores = await fetchUserStores(merchantData.id);
      
      const updatedMerchant = {
        ...merchantData,
        stores,
        currentStoreId: stores.length > 0 ? stores[0].id : undefined
      };

      setMerchant(updatedMerchant);
      setCurrentStore(stores.length > 0 ? stores[0] : null);
      
      return stores.length > 0;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }, [fetchUserStores]);

  const switchStore = useCallback(async (storeId: string) => {
    if (!merchant) return;

    const store = merchant.stores.find(s => s.id === storeId);
    if (!store) {
      console.error('Store not found');
      return;
    }

    setCurrentStore(store);
    setMerchant(prev => prev ? { ...prev, currentStoreId: storeId } : null);
  }, [merchant]);

  const refreshStores = useCallback(async () => {
    if (!merchant) return;

    try {
      const stores = await fetchUserStores(merchant.id);
      setMerchant(prev => prev ? { ...prev, stores } : null);
      
      // If current store is no longer available, switch to first available
      if (currentStore && !stores.find(s => s.id === currentStore.id)) {
        if (stores.length > 0) {
          await switchStore(stores[0].id);
        } else {
          setCurrentStore(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing stores:', error);
    }
  }, [merchant, currentStore, switchStore, fetchUserStores]);

  const logout = useCallback(() => {
    setMerchant(null);
    setCurrentStore(null);
  }, []);

  const value: AuthContextType = {
    merchant,
    currentStore,
    login,
    logout,
    switchStore,
    isAuthenticated: !!merchant,
    refreshStores,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
