import { apiClient } from './api-client';
import type { WishlistSummary, WishlistDetail } from '@/types/wishlist';

export const wishlistApi = {
  async getAll(): Promise<{ wishlists: WishlistSummary[] }> {
    return apiClient<{ wishlists: WishlistSummary[] }>('/api/wishlist');
  },

  async getById(id: string): Promise<WishlistDetail> {
    return apiClient<WishlistDetail>(`/api/wishlist/${id}`);
  },

  async create(name: string): Promise<{ id: string; name: string }> {
    return apiClient('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async deleteWishlist(id: string): Promise<void> {
    await apiClient(`/api/wishlist/${id}`, { method: 'DELETE' });
  },

  async addItem(wishlistId: string, productId: string): Promise<void> {
    await apiClient(`/api/wishlist/${wishlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeItem(wishlistId: string, productId: string): Promise<void> {
    await apiClient(`/api/wishlist/${wishlistId}/items/${productId}`, {
      method: 'DELETE',
    });
  },

  async toggleSaved(productId: string): Promise<{ saved: boolean }> {
    return apiClient<{ saved: boolean }>('/api/wishlist/saved/toggle', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async getSavedIds(): Promise<{ product_ids: string[] }> {
    return apiClient<{ product_ids: string[] }>('/api/wishlist/saved');
  },
};
