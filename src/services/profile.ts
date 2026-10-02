import { apiClient } from './api-client';
import type { Profile, Address, ProfileData } from '@/types/profile';

export const profileApi = {
  async get(): Promise<ProfileData> {
    return apiClient<ProfileData>('/api/profile');
  },

  async update(data: { full_name?: string; phone?: string; preferred_size?: string; dob?: string; age?: string; height?: string; shoulder?: string; bust?: string; waist?: string; hips?: string }): Promise<Profile> {
    return apiClient<Profile>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async updateAddress(data: { apartment: string; locality: string; state: string; pincode: string }): Promise<Address> {
    return apiClient<Address>('/api/profile/address', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async changePassword(newPassword: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  },
};
