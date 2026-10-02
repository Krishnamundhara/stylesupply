'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Box, BoxItem, BoxWithItems } from '@/types/box';
import { boxApi } from '@/services/box';
import { ApiError } from '@/services/api-client';
import { useAuth } from './AuthContext';

export interface BoxItemDisplay {
  id: string;
  productId: string;
  variantId: string;
  brand: string;
  name: string;
  size: string;
  retailPrice: number;
  currency: string;
  thumbnailUrl: string | null;
}

interface BoxContextValue {
  box: Box | null;
  items: BoxItemDisplay[];
  isLoading: boolean;
  error: string | null;
  addItem: (params: {
    productId: string;
    variantId: string;
    brand: string;
    name: string;
    size: string;
    retailPrice: number;
    currency: string;
    thumbnailUrl: string | null;
  }) => Promise<{ ok: boolean; error?: string }>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BoxContext = createContext<BoxContextValue | null>(null);

function mapBoxItemToDisplay(item: BoxItem): BoxItemDisplay {
  return {
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    brand: item.product?.brand ?? '',
    name: item.product?.name ?? '',
    size: item.variant?.size ?? '',
    retailPrice: item.product?.retail_price_minor ?? 0,
    currency: item.product?.currency ?? 'INR',
    thumbnailUrl: item.product?.thumbnail_url ?? null,
  };
}

export function BoxProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [box, setBox] = useState<Box | null>(null);
  const [items, setItems] = useState<BoxItemDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBox = useCallback(async () => {
    if (!isAuthenticated) {
      setBox(null);
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const boxWithItems = await boxApi.getCurrent();
      setBox(boxWithItems);
      setItems(boxWithItems.items.map(mapBoxItemToDisplay));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load box';
      setError(message);
      setBox(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchBox();
    }
  }, [authLoading, fetchBox]);

  const addItem = useCallback(async (params: {
    productId: string;
    variantId: string;
    brand: string;
    name: string;
    size: string;
    retailPrice: number;
    currency: string;
    thumbnailUrl: string | null;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (items.length >= 5) {
      return { ok: false, error: 'Box is full (max 5 items)' };
    }

    const optimisticItem: BoxItemDisplay = {
      id: `temp-${Date.now()}`,
      productId: params.productId,
      variantId: params.variantId,
      brand: params.brand,
      name: params.name,
      size: params.size,
      retailPrice: params.retailPrice,
      currency: params.currency,
      thumbnailUrl: params.thumbnailUrl,
    };

    setItems((prev) => [...prev, optimisticItem]);

    try {
      const newItem = await boxApi.addItem(params.productId, params.variantId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === optimisticItem.id
            ? {
                ...item,
                id: newItem.id,
                brand: newItem.product?.brand ?? params.brand,
                name: newItem.product?.name ?? params.name,
                retailPrice: newItem.product?.retail_price_minor ?? params.retailPrice,
                currency: newItem.product?.currency ?? params.currency,
                thumbnailUrl: newItem.product?.thumbnail_url ?? params.thumbnailUrl,
              }
            : item
        )
      );
      return { ok: true };
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== optimisticItem.id));
      const message = err instanceof ApiError ? err.message : 'Failed to add item';
      return { ok: false, error: message };
    }
  }, [items.length]);

  const removeItem = useCallback(async (itemId: string) => {
    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await boxApi.removeItem(itemId);
    } catch (err) {
      setItems(previousItems);
      const message = err instanceof ApiError ? err.message : 'Failed to remove item';
      setError(message);
    }
  }, [items]);

  const refresh = useCallback(async () => {
    await fetchBox();
  }, [fetchBox]);

  return (
    <BoxContext.Provider
      value={{
        box,
        items,
        isLoading: authLoading || isLoading,
        error,
        addItem,
        removeItem,
        refresh,
      }}
    >
      {children}
    </BoxContext.Provider>
  );
}

export function useBox() {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error('useBox must be used within BoxProvider');
  return ctx;
}
