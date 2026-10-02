import { apiClient } from './api-client';
import type { CategoryTreeNode } from '@/types/category';

export interface ColourOption {
  id: string;
  name: string;
  slug: string;
  hex: string | null;
  sort_order: number;
}

export interface MaterialOption {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export const categoriesApi = {
  async tree(): Promise<{ tree: CategoryTreeNode[] }> {
    return apiClient<{ tree: CategoryTreeNode[] }>('/api/categories/tree');
  },
};

export const taxonomyApi = {
  async colours(): Promise<{ items: ColourOption[] }> {
    return apiClient<{ items: ColourOption[] }>('/api/colours');
  },
  async materials(): Promise<{ items: MaterialOption[] }> {
    return apiClient<{ items: MaterialOption[] }>('/api/materials');
  },
};
