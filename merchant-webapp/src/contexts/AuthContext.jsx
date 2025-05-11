import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
  const [storeSetupComplete, setStoreSetupComplete] = useState(false);

  const login = useCallback(async (merchantData) => {
    if (!merchantData?.id) {
      console.error('Invalid merchant data: missing id');
      return;
    }

    // Check if store setup is complete
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

    // Redirect based on setup status
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

  const switchAccount = useCallback((accountId) => {
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

  const value = {
    merchant,
    login,
    logout,
    switchAccount,
    storeSetupComplete,
    completeStoreSetup,
    isAuthenticated: !!merchant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}