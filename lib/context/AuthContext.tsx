'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, clearToken } from '@/lib/api';
import type { User, Donor } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  donor: Donor | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lifelink_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });
      setDonor(data.donor || null);
    } catch {
      clearToken();
      setUser(null);
      setDonor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    });
    await refreshUser();
  };

  const register = async (data: Record<string, unknown>) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser({
      _id: res._id,
      name: res.name,
      email: res.email,
      phone: res.phone,
      role: res.role,
    });
    await refreshUser();
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setDonor(null);
  };

  return (
    <AuthContext.Provider value={{ user, donor, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
