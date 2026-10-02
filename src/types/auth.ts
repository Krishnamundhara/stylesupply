export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  phoneVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
