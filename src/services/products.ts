import { apiClient } from './api-client';
import type { BrowseResponse, BrowseParams, ProductDetail } from '@/types/product';

export const productsApi = {
  async browse(params: BrowseParams = {}): Promise<BrowseResponse> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.category_type) searchParams.set('category_type', params.category_type);
    if (params.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params.sub_subcategory) searchParams.set('sub_subcategory', params.sub_subcategory);
    if (params.brand) searchParams.set('brand', params.brand);
    if (params.collection) searchParams.set('collection', params.collection);
    if (params.look) searchParams.set('look', params.look);
    if (params.colour) searchParams.set('colour', params.colour);
    if (params.material) searchParams.set('material', params.material);
    if (params.size) searchParams.set('size', params.size);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));

    const qs = searchParams.toString();
    return apiClient<BrowseResponse>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  async getById(id: string): Promise<ProductDetail> {
    return apiClient<ProductDetail>(`/api/products/${id}`);
  },
};
