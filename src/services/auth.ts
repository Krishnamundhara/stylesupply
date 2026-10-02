import { apiClient, clearCsrfToken } from './api-client';
import type { User } from '@/types/auth';

export interface AuthResponse {
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: {
    apartment: string;
    locality: string;
    state: string;
    pincode: string;
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async checkEmail(email: string): Promise<{ available: boolean }> {
    return apiClient('/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyOtpMock(otp: string): Promise<{ verified: boolean }> {
    return apiClient('/api/auth/verify-otp-mock', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
  },

  async logout(): Promise<void> {
    await apiClient('/api/auth/logout', { method: 'POST' });
    clearCsrfToken();
  },

  async getMe(): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/me');
  },

  async refreshToken(): Promise<void> {
    await apiClient('/api/auth/refresh', { method: 'POST' });
  },

  async sendOtp(phone: string): Promise<void> {
    await apiClient('/api/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone: string, otp: string): Promise<{ verified: boolean }> {
    return apiClient('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  async completeOnboarding(data: {
    phone: string;
    address: { apartment: string; locality: string; state: string; pincode: string };
  }): Promise<{ success: boolean }> {
    return apiClient('/api/auth/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
