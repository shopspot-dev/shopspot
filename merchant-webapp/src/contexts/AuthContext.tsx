import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Define merchant type (you can expand this based on your Supabase schema)
export interface Merchant {
  id: string;
  [key: string]: any;
}

interface AuthContextType {
  merchant: Merchant | null;
  storeSetupComplete: boolean;
  login: (merchantData: Merchant) => Promise<boolean>;
  logout: () => void;
  switchAccount: (accountId: string) => void;
  completeStoreSetup: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [storeSetupComplete, setStoreSetupComplete] = useState(false);

  const login = useCallback(async (merchantData: Merchant) => {
    if (!merchantData?.id) {
      console.error('Invalid merchant data: missing id');
      return false;
    }

    // Check if user has a store by looking in store_users table
    const { data: storeUserData, error: storeUserError } = await supabase
      .from('store_users')
      .select('store_id')
      .eq('user_id', merchantData.id)
      .single();

    const hasStore = !storeUserError && storeUserData?.store_id;
    setStoreSetupComplete(hasStore);
    setMerchant(merchantData);
    
    // Return the store status so the component can decide what to do
    return hasStore;
  }, []);

  const logout = useCallback(() => {
    setMerchant(null);
    setStoreSetupComplete(false);
    // Remove navigation, let the component handle it
  }, []);

  const switchAccount = useCallback((accountId: string) => {
    setMerchant(prev => prev ? {
      ...prev,
      id: accountId,
      storeName: `Store ${accountId}`,
    } : null);
  }, []);

  const completeStoreSetup = useCallback(() => {
    setStoreSetupComplete(true);
    // Remove navigation, let the component handle it
  }, []);

  const value: AuthContextType = {
    merchant,
    login,
    logout,
    switchAccount,
    completeStoreSetup,
    storeSetupComplete,
    isAuthenticated: !!merchant
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
