import { apiClient } from './api-client';

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string;
    thumbnail_url: string | null;
  };
}

export const ordersApi = {
  async list(limit = 20, offset = 0): Promise<{ orders: Order[]; total: number }> {
    return apiClient<{ orders: Order[]; total: number }>(`/api/orders?limit=${limit}&offset=${offset}`);
  },

  async getById(id: string): Promise<Order> {
    return apiClient<Order>(`/api/orders/${id}`);
  },
};
