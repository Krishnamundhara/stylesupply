'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Membership } from '@/types/membership';
import { membershipApi } from '@/services/membership';
import { ApiError } from '@/services/api-client';
import { useAuth } from './AuthContext';

interface MembershipContextType {
  membership: Membership | null;
  isLoading: boolean;
  isActive: boolean;
  isCancelled: boolean;
  error: string | null;
  activate: (code: string) => Promise<{ ok: boolean; error?: string }>;
  cancel: () => Promise<void>;
  reactivate: () => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembership = useCallback(async () => {
    if (!isAuthenticated) {
      setMembership(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { membership } = await membershipApi.get();
      setMembership(membership);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load membership';
      setError(message);
      setMembership(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchMembership();
    }
  }, [authLoading, fetchMembership]);

  const activate = useCallback(async (code: string): Promise<{ ok: boolean; error?: string }> => {
    setError(null);
    try {
      const { membership } = await membershipApi.activate(code);
      setMembership(membership);
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Activation failed';
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const cancel = useCallback(async () => {
    setError(null);
    try {
      await membershipApi.cancel();
      // Re-fetch so we get the cancelled row (status: 'cancelled') rather than null.
      await fetchMembership();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Cancellation failed';
      setError(message);
      throw new Error(message);
    }
  }, [fetchMembership]);

  const reactivate = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    setError(null);
    try {
      const { membership } = await membershipApi.reactivate();
      setMembership(membership);
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Reactivation failed';
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchMembership();
  }, [fetchMembership]);

  const isActive = membership?.status === 'active';
  const isCancelled = membership?.status === 'cancelled';

  return (
    <MembershipContext.Provider
      value={{
        membership,
        isLoading: authLoading || isLoading,
        isActive,
        isCancelled,
        error,
        activate,
        cancel,
        reactivate,
        refresh,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within MembershipProvider');
  }
  return context;
}
