# Frontend-Backend Integration Design

**Date:** 2026-05-15  
**Status:** Approved  
**Scope:** Wire StyleSupply frontend to existing backend APIs

## Overview

The backend has fully built APIs that the frontend does not use. The frontend currently uses local state (`useState`, Context with `Date.now()` IDs) instead of calling the backend. This design wires them together.

## Backend APIs to Integrate

| Route Group | Endpoints | Purpose |
|-------------|-----------|---------|
| `/api/box/*` | GET/POST current, history, items, confirm, pay, keep, return | Box lifecycle |
| `/api/membership/*` | GET, POST activate, POST cancel | Membership management |
| `/api/profile/*` | GET, PATCH, PATCH address, POST change-password | User profile |
| `/api/orders/*` | GET list, GET by id | Order history |
| `/api/reviews/*` | GET mine, GET product, POST create | Product reviews |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Components    │────▶│    Contexts     │────▶│    Services     │
│   (UI layer)    │     │  (state mgmt)   │     │   (API calls)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │   apiClient()   │
                                                │ (auth, CSRF)    │
                                                └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │  Backend API    │
                                                └─────────────────┘
```

## 1. Service Layer

Create 5 new service files in `src/services/`:

### `box.ts`

```typescript
import { apiClient } from './api-client';

export interface Box {
  id: string;
  user_id: string;
  status: 'draft' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'completed';
  created_at: string;
  confirmed_at?: string;
  paid_at?: string;
}

export interface BoxItem {
  id: string;
  box_id: string;
  product_id: string;
  variant_id: string;
  decision?: 'keep' | 'return';
  product?: {
    id: string;
    name: string;
    brand: string;
    retail_price_minor: number;
    currency: string;
    thumbnail_url: string | null;
  };
}

export interface BoxWithItems extends Box {
  items: BoxItem[];
}

export const boxApi = {
  async getCurrent(): Promise<BoxWithItems> {
    return apiClient<BoxWithItems>('/api/box/current');
  },

  async getHistory(): Promise<{ boxes: Box[] }> {
    return apiClient<{ boxes: Box[] }>('/api/box/history');
  },

  async getById(id: string): Promise<BoxWithItems> {
    return apiClient<BoxWithItems>(`/api/box/${id}`);
  },

  async addItem(productId: string, variantId: string): Promise<BoxItem> {
    return apiClient<BoxItem>('/api/box/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, variant_id: variantId }),
    });
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient(`/api/box/items/${itemId}`, { method: 'DELETE' });
  },

  async confirm(): Promise<Box> {
    return apiClient<Box>('/api/box/confirm', { method: 'POST' });
  },

  async pay(boxId: string): Promise<Box> {
    return apiClient<Box>('/api/box/pay', {
      method: 'POST',
      body: JSON.stringify({ box_id: boxId }),
    });
  },

  async keepItem(boxId: string, itemId: string): Promise<void> {
    await apiClient(`/api/box/${boxId}/items/${itemId}/keep`, { method: 'POST' });
  },

  async returnItem(boxId: string, itemId: string): Promise<void> {
    await apiClient(`/api/box/${boxId}/items/${itemId}/return`, { method: 'POST' });
  },
};
```

### `membership.ts`

```typescript
import { apiClient } from './api-client';

export interface Membership {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  credit_balance_minor: number;
  activated_at: string;
  expires_at: string;
}

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
};
```

### `profile.ts`

```typescript
import { apiClient } from './api-client';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  phone_verified: boolean;
  avatar_url: string | null;
  preferred_size?: string;
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

export const profileApi = {
  async get(): Promise<ProfileData> {
    return apiClient<ProfileData>('/api/profile');
  },

  async update(data: { full_name?: string; phone?: string; preferred_size?: string }): Promise<Profile> {
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
```

### `orders.ts`

```typescript
import { apiClient } from './api-client';

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string;
    thumbnail_url: string | null;
  };
}

export const ordersApi = {
  async list(limit = 20, offset = 0): Promise<{ orders: Order[]; total: number }> {
    return apiClient<{ orders: Order[]; total: number }>(`/api/orders?limit=${limit}&offset=${offset}`);
  },

  async getById(id: string): Promise<Order> {
    return apiClient<Order>(`/api/orders/${id}`);
  },
};
```

### `reviews.ts`

```typescript
import { apiClient } from './api-client';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  rating: number;
  body?: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    brand: string;
  };
}

export interface ProductReview {
  id: string;
  rating: number;
  body?: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export const reviewsApi = {
  async getMine(): Promise<{ reviews: Review[] }> {
    return apiClient<{ reviews: Review[] }>('/api/reviews/mine');
  },

  async getForProduct(productId: string): Promise<{ reviews: ProductReview[] }> {
    return apiClient<{ reviews: ProductReview[] }>(`/api/reviews/product/${productId}`);
  },

  async create(data: { product_id: string; rating: number; body?: string; order_id?: string }): Promise<Review> {
    return apiClient<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

## 2. Context Refactoring

### `BoxContext.tsx` — Refactored

Replace local state with backend-synced state:

```typescript
interface BoxContextValue {
  box: Box | null;
  items: BoxItem[];
  isLoading: boolean;
  error: string | null;
  
  addItem(productId: string, variantId: string, displayData: {
    brand: string;
    name: string;
    size: string;
    retailPrice: number;
    currency: string;
    thumbnailUrl: string | null;
  }): Promise<{ ok: boolean; error?: string }>;
  
  removeItem(itemId: string): Promise<void>;
  refresh(): Promise<void>;
}
```

**Behavior:**
- On mount (when authenticated): fetch `boxApi.getCurrent()`
- `addItem`: POST to backend, update local state with response
- `removeItem`: DELETE from backend, remove from local state
- Optimistic updates for responsive UX, rollback on error

### `MembershipContext.tsx` — New

```typescript
interface MembershipContextValue {
  membership: Membership | null;
  isLoading: boolean;
  isActive: boolean;
  error: string | null;
  
  activate(code: string): Promise<{ ok: boolean; error?: string }>;
  cancel(): Promise<void>;
  refresh(): Promise<void>;
}
```

**Behavior:**
- On mount (when authenticated): fetch `membershipApi.get()`
- `activate`: POST with code, update state on success
- `cancel`: POST cancel, clear membership state

### Provider Setup

Both contexts should be added to the app's provider tree in `layout.tsx`, nested inside `AuthProvider` so they can check authentication state.

## 3. Component Changes

### `MembershipContent.tsx`

Current: `useState(false)` for activation, no backend

Changes:
- Use `useMembership()` context
- Add text input for access code (required by backend)
- "Activate Now" button calls `activate(code)` with loading/error states
- Display real `expires_at` as renewal date when active
- Add cancel membership option in "Manage Membership" view

### `BoxStageBuilder.tsx`

Current: Uses `useBox()` with local items

Changes:
- Already structured correctly, will work once context is refactored
- Add loading skeleton while fetching initial box
- Show error message if API fails

### `ConfirmPage.tsx`

Current: Hardcoded `USER_HAS_MEMBERSHIP = false`

Changes:
- Use `useMembership().isActive` for membership check
- Call `boxApi.confirm()` at appropriate stage
- Wire membership stage to real activation API

### `SettingsContent.tsx`

Current: Toggle states local, buttons are no-ops

Changes:
- "Change Password" → modal with new password input, calls `profileApi.changePassword()`
- "Delivery Addresses" → fetch via `profileApi.get()`, update via `profileApi.updateAddress()`
- "Payment Methods" → leave as static display (no backend endpoint exists for payment method CRUD)

### `PastBoxesContent.tsx`

Current: Renders `SAMPLE_BOXES` static data

Changes:
- Fetch `boxApi.getHistory()` on mount
- Map `Box` response to existing `PastBox` interface
- Show loading state, handle empty state

### `MyReviewsContent.tsx`

Current: Renders `SAMPLE_REVIEWS` static data

Changes:
- Fetch `reviewsApi.getMine()` on mount
- Map `Review` response to existing `Review` interface
- Show loading state, handle empty state

## 4. Type Definitions

Add/update types in `src/types/`:

### `src/types/box.ts` (new)

```typescript
export interface Box {
  id: string;
  user_id: string;
  status: 'draft' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'completed';
  created_at: string;
  confirmed_at?: string;
  paid_at?: string;
}

export interface BoxItem {
  id: string;
  box_id: string;
  product_id: string;
  variant_id: string;
  decision?: 'keep' | 'return';
  product?: {
    id: string;
    name: string;
    brand: string;
    retail_price_minor: number;
    currency: string;
    thumbnail_url: string | null;
  };
}
```

### `src/types/membership.ts` (new)

```typescript
export interface Membership {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  credit_balance_minor: number;
  activated_at: string;
  expires_at: string;
}
```

### `src/types/profile.ts` (new)

```typescript
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  phone_verified: boolean;
  avatar_url: string | null;
  preferred_size?: string;
}

export interface Address {
  id: string;
  apartment: string;
  locality: string;
  state: string;
  pincode: string;
  is_default: boolean;
}
```

## 5. Error Handling Strategy

All service calls can throw `ApiError` (from `api-client.ts`). Components should:

1. Catch errors in context methods
2. Set error state for UI display
3. Use toast notifications for transient errors
4. Show inline error messages for form validation errors

Example pattern:
```typescript
const activate = async (code: string) => {
  setError(null);
  try {
    const { membership } = await membershipApi.activate(code);
    setMembership(membership);
    return { ok: true };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Activation failed';
    setError(message);
    return { ok: false, error: message };
  }
};
```

## 6. Files to Create/Modify

### New Files
- `src/services/box.ts`
- `src/services/membership.ts`
- `src/services/profile.ts`
- `src/services/orders.ts`
- `src/services/reviews.ts`
- `src/context/MembershipContext.tsx`
- `src/types/box.ts`
- `src/types/membership.ts`
- `src/types/profile.ts`

### Modified Files
- `src/context/BoxContext.tsx` — refactor to use `boxApi`
- `src/app/layout.tsx` — add `MembershipProvider`
- `src/components/sections/MembershipContent.tsx` — use context + add code input
- `src/components/sections/box/my-box/BoxStageBuilder.tsx` — add loading/error states
- `src/app/box/confirm/page.tsx` — use real membership status
- `src/components/sections/profile-landing/SettingsContent.tsx` — wire to profile API
- `src/components/sections/profile-landing/PastBoxesContent.tsx` — fetch from API
- `src/components/sections/profile-landing/MyReviewsContent.tsx` — fetch from API

## 7. Testing Considerations

- Services can be unit tested by mocking `apiClient`
- Contexts can be tested with mock services
- Component tests should mock contexts
- E2E tests should verify full flow with real backend

## 8. Out of Scope

- Payment processing (Stripe/Razorpay integration)
- Real-time updates (WebSocket for box status)
- Push notifications
- Payment methods CRUD (no backend endpoint exists)
