'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { User } from '@/types/auth';
import { authApi, RegisterData } from '@/services/auth';
import { ApiError } from '@/services/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount and handle token refresh automatically
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { user } = await authApi.getMe();
        if (mounted) setUser(user);
      } catch {
        // apiClient automatically tries to refresh on 401
        // If we still get here, user is truly not authenticated
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Periodic session check (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const { user: freshUser } = await authApi.getMe();
        setUser(freshUser);
      } catch {
        // Token refresh will be attempted automatically by apiClient
        // If it fails, user will be logged out on next action
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await authApi.login(email, password);
    setUser(user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const { user } = await authApi.register(data);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors, clear user anyway
    }
    setUser(null);
    // Redirect to home after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await authApi.getMe();
      setUser(user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
