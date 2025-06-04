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
  login: (merchantData: Merchant) => Promise<void>;
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
      return;
    }

    const { data: storeData } = await supabase
      .from('stores')
      .select('description, logo_url, address, phone')
      .eq('merchant_id', merchantData.id)
      .maybeSingle();

    const isSetupComplete = !!(
      storeData?.description &&
      storeData?.logo_url &&
      storeData?.address &&
      storeData?.phone
    );

    setStoreSetupComplete(isSetupComplete);
    setMerchant(merchantData);

    if (isSetupComplete) {
      navigate('/dashboard');
    } else {
      navigate('/store-setup');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setMerchant(null);
    setStoreSetupComplete(false);
    navigate('/signin');
  }, [navigate]);

  const switchAccount = useCallback((accountId: string) => {
    setMerchant(prev => prev ? {
      ...prev,
      id: accountId,
      storeName: `Store ${accountId}`,
    } : null);
  }, []);

  const completeStoreSetup = useCallback(() => {
    setStoreSetupComplete(true);
    navigate('/dashboard');
  }, [navigate]);

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
