import { apiClient } from './api-client';
import type { ClosetItem } from '@/types/closet';

export const closetApi = {
  async getItems(): Promise<{ items: ClosetItem[] }> {
    return apiClient<{ items: ClosetItem[] }>('/api/closet');
  },

  async addItem(productId: string, variantId: string): Promise<ClosetItem> {
    return apiClient<ClosetItem>('/api/closet/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, variant_id: variantId }),
    });
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient(`/api/closet/${itemId}`, { method: 'DELETE' });
  },
};
