'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSessionAction, logoutAction } from '@/app/actions/auth';

type UserSession = {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'staff';
  name: string;
  businessId?: number | null;
} | null;

type AuthContextType = {
  user: UserSession;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const payload = await getSessionAction();
      setUser(payload as UserSession);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutAction();
    } finally {
      setUser(null);
      setLoading(false);
      window.location.replace('/login');
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshSession: fetchSession }}>
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