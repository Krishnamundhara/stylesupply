import { apiClient } from './api-client';
import type { Box, BoxItem, BoxWithItems } from '@/types/box';

export const boxApi = {
  async getCurrent(): Promise<BoxWithItems> {
    return apiClient<BoxWithItems>('/api/box/current');
  },

  async getHistory(): Promise<{ boxes: Box[] }> {
    return apiClient<{ boxes: Box[] }>('/api/box/history');
  },

  async getById(id: string): Promise<BoxWithItems> {
    return apiClient<BoxWithItems>(`/api/box/${id}`);
  },

  async addItem(productId: string, variantId: string): Promise<BoxItem> {
    return apiClient<BoxItem>('/api/box/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, variant_id: variantId }),
    });
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient(`/api/box/items/${itemId}`, { method: 'DELETE' });
  },

  async confirm(): Promise<Box> {
    return apiClient<Box>('/api/box/confirm', { method: 'POST' });
  },

  async pay(boxId: string): Promise<Box> {
    return apiClient<Box>('/api/box/pay', {
      method: 'POST',
      body: JSON.stringify({ box_id: boxId }),
    });
  },

  async keepItem(boxId: string, itemId: string): Promise<void> {
    await apiClient(`/api/box/${boxId}/items/${itemId}/keep`, { method: 'POST' });
  },

  async returnItem(boxId: string, itemId: string): Promise<void> {
    await apiClient(`/api/box/${boxId}/items/${itemId}/return`, { method: 'POST' });
  },
};
