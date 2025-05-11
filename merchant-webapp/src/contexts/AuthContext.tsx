import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Merchant } from '../types/auth';

interface AuthContextType {
  merchant: Merchant | null;
  login: (merchant: Merchant) => void;
  logout: () => void;
  switchAccount: (accountId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  const login = useCallback((merchantData: Merchant) => {
    setMerchant(merchantData);
  }, []);

  const logout = useCallback(() => {
    setMerchant(null);
    navigate('/signin');
  }, [navigate]);

  const switchAccount = useCallback((accountId: string) => {
    // In a real app, this would make an API call to get the new account details
    setMerchant(prev => prev ? {
      ...prev,
      id: accountId,
      storeName: `Store ${accountId}`,
    } : null);
  }, []);

  const value = {
    merchant,
    login,
    logout,
    switchAccount,
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