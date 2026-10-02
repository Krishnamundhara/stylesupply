export type MembershipStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface Membership {
  id: string;
  user_id: string;
  plan: string;
  status: MembershipStatus;
  credit_balance_minor: number;
  activated_at: string;
  expires_at: string;
}
