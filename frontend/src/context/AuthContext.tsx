"use client"

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout as authLogout } from '@/services/api/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Buyer' | 'Supplier';
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const currentUser = getCurrentUser() as User | null;
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Wrap in setTimeout to avoid setting state synchronously during initial render
    const timer = setTimeout(() => {
      refreshUser();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    refreshUser,
    logout
  }), [user, loading, refreshUser, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
