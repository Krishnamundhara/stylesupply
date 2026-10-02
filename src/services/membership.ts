import { apiClient } from './api-client';
import type { Membership } from '@/types/membership';

export const membershipApi = {
  async get(): Promise<{ membership: Membership | null }> {
    return apiClient<{ membership: Membership | null }>('/api/membership');
  },

  async activate(code: string): Promise<{ membership: Membership }> {
    return apiClient<{ membership: Membership }>('/api/membership/activate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async cancel(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>('/api/membership/cancel', {
      method: 'POST',
    });
  },

  async reactivate(): Promise<{ membership: Membership }> {
    return apiClient<{ membership: Membership }>('/api/membership/reactivate', {
      method: 'POST',
    });
  },
};
