export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  phone_verified: boolean;
  avatar_url: string | null;
  preferred_size?: string;
  dob?: string;
  age?: string;
  height?: string;
  shoulder?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  apartment: string;
  locality: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface ProfileData {
  profile: Profile | null;
  address: Address | null;
  membership: {
    id: string;
    plan: string;
    status: string;
    credit_balance_minor: number;
    activated_at: string;
    expires_at: string;
  } | null;
}
