import { apiClient } from './api-client';
import type { CollectionWithProducts } from '@/types/collection';
import type { ProductCard } from '@/types/product';

export const collectionsApi = {
  async getAll(): Promise<{ collections: CollectionWithProducts[] }> {
    return apiClient<{ collections: CollectionWithProducts[] }>('/api/collections');
  },

  async getBySlug(
    slug: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<{ collection: CollectionWithProducts; cards: ProductCard[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));
    const qs = searchParams.toString();
    return apiClient(`/api/collections/${slug}${qs ? `?${qs}` : ''}`);
  },
};
