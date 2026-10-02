import { apiClient } from './api-client';
import type { Brand } from '@/types/brand';
import type { BrowseResponse, BrowseParams } from '@/types/product';

export const brandsApi = {
  async getAll(): Promise<{ brands: Brand[] }> {
    return apiClient<{ brands: Brand[] }>('/api/brands');
  },

  async getBySlug(slug: string): Promise<Brand> {
    return apiClient<Brand>(`/api/brands/${slug}`);
  },

  async getProducts(slug: string, params: BrowseParams = {}): Promise<BrowseResponse> {
    const searchParams = new URLSearchParams();
    if (params.category_type) searchParams.set('category', params.category_type);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));

    const qs = searchParams.toString();
    return apiClient<BrowseResponse>(`/api/brands/${slug}/products${qs ? `?${qs}` : ''}`);
  },
};
