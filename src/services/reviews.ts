import { apiClient } from './api-client';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  rating: number;
  body?: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    brand: string;
  };
}

export interface ProductReview {
  id: string;
  rating: number;
  body?: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export const reviewsApi = {
  async getMine(): Promise<{ reviews: Review[] }> {
    return apiClient<{ reviews: Review[] }>('/api/reviews/mine');
  },

  async getForProduct(productId: string): Promise<{ reviews: ProductReview[] }> {
    return apiClient<{ reviews: ProductReview[] }>(`/api/reviews/product/${productId}`);
  },

  async create(data: { product_id: string; rating: number; body?: string; order_id?: string }): Promise<Review> {
    return apiClient<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
