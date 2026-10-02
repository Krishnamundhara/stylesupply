# Frontend-Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire StyleSupply frontend to existing backend APIs for box, membership, profile, orders, and reviews.

**Architecture:** Service layer wraps API calls, contexts manage state and sync with backend, components consume contexts. All services use existing `apiClient()` which handles auth refresh and CSRF.

**Tech Stack:** Next.js 16, React 19, TypeScript, react-hot-toast for notifications

---

## File Structure

### New Files
| File | Responsibility |
|------|----------------|
| `src/types/box.ts` | Box and BoxItem type definitions |
| `src/types/membership.ts` | Membership type definition |
| `src/types/profile.ts` | Profile and Address type definitions |
| `src/services/box.ts` | Box API wrapper (CRUD, confirm, pay, keep/return) |
| `src/services/membership.ts` | Membership API wrapper (get, activate, cancel) |
| `src/services/profile.ts` | Profile API wrapper (get, update, address, password) |
| `src/services/orders.ts` | Orders API wrapper (list, getById) |
| `src/services/reviews.ts` | Reviews API wrapper (mine, product, create) |
| `src/context/MembershipContext.tsx` | Membership state management |

### Modified Files
| File | Changes |
|------|---------|
| `src/context/BoxContext.tsx` | Refactor from local state to backend-synced |
| `src/app/layout.tsx` | Add MembershipProvider to provider tree |
| `src/components/sections/MembershipContent.tsx` | Use context, add code input |
| `src/components/sections/box/my-box/BoxStageBuilder.tsx` | Add loading/error states |
| `src/app/box/confirm/page.tsx` | Use real membership status |
| `src/components/sections/profile-landing/SettingsContent.tsx` | Wire change password and address |
| `src/components/sections/profile-landing/PastBoxesContent.tsx` | Fetch from API |
| `src/components/sections/profile-landing/MyReviewsContent.tsx` | Fetch from API |

---

## Task 1: Create Type Definitions

**Files:**
- Create: `src/types/box.ts`
- Create: `src/types/membership.ts`
- Create: `src/types/profile.ts`

- [ ] **Step 1: Create box types**

Create `src/types/box.ts`:

```typescript
export type BoxStatus = 'draft' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'completed';

export interface Box {
  id: string;
  user_id: string;
  status: BoxStatus;
  created_at: string;
  confirmed_at?: string;
  paid_at?: string;
}

export interface BoxItemProduct {
  id: string;
  name: string;
  brand: string;
  retail_price_minor: number;
  currency: string;
  thumbnail_url: string | null;
}

export interface BoxItem {
  id: string;
  box_id: string;
  product_id: string;
  variant_id: string;
  decision?: 'keep' | 'return';
  product?: BoxItemProduct;
}

export interface BoxWithItems extends Box {
  items: BoxItem[];
}
```

- [ ] **Step 2: Create membership types**

Create `src/types/membership.ts`:

```typescript
export type MembershipStatus = 'active' | 'cancelled' | 'expired';

export interface Membership {
  id: string;
  user_id: string;
  plan: string;
  status: MembershipStatus;
  credit_balance_minor: number;
  activated_at: string;
  expires_at: string;
}
```

- [ ] **Step 3: Create profile types**

Create `src/types/profile.ts`:

```typescript
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
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors related to the new type files

- [ ] **Step 5: Commit**

```bash
git add src/types/box.ts src/types/membership.ts src/types/profile.ts
git commit -m "feat: add type definitions for box, membership, profile"
```

---

## Task 2: Create Box Service

**Files:**
- Create: `src/services/box.ts`

- [ ] **Step 1: Create box service**

Create `src/services/box.ts`:

```typescript
import { apiClient } from './api-client';
import type { Box, BoxItem, BoxWithItems } from '@/types/box';

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/box.ts
git commit -m "feat: add box service for API calls"
```

---

## Task 3: Create Membership Service

**Files:**
- Create: `src/services/membership.ts`

- [ ] **Step 1: Create membership service**

Create `src/services/membership.ts`:

```typescript
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
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/membership.ts
git commit -m "feat: add membership service for API calls"
```

---

## Task 4: Create Profile Service

**Files:**
- Create: `src/services/profile.ts`

- [ ] **Step 1: Create profile service**

Create `src/services/profile.ts`:

```typescript
import { apiClient } from './api-client';
import type { Profile, Address, ProfileData } from '@/types/profile';

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/profile.ts
git commit -m "feat: add profile service for API calls"
```

---

## Task 5: Create Orders Service

**Files:**
- Create: `src/services/orders.ts`

- [ ] **Step 1: Create orders service**

Create `src/services/orders.ts`:

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/orders.ts
git commit -m "feat: add orders service for API calls"
```

---

## Task 6: Create Reviews Service

**Files:**
- Create: `src/services/reviews.ts`

- [ ] **Step 1: Create reviews service**

Create `src/services/reviews.ts`:

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/reviews.ts
git commit -m "feat: add reviews service for API calls"
```

---

## Task 7: Create MembershipContext

**Files:**
- Create: `src/context/MembershipContext.tsx`

- [ ] **Step 1: Create MembershipContext**

Create `src/context/MembershipContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Membership } from '@/types/membership';
import { membershipApi } from '@/services/membership';
import { ApiError } from '@/services/api-client';
import { useAuth } from './AuthContext';

interface MembershipContextType {
  membership: Membership | null;
  isLoading: boolean;
  isActive: boolean;
  error: string | null;
  activate: (code: string) => Promise<{ ok: boolean; error?: string }>;
  cancel: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembership = useCallback(async () => {
    if (!isAuthenticated) {
      setMembership(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { membership } = await membershipApi.get();
      setMembership(membership);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load membership';
      setError(message);
      setMembership(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchMembership();
    }
  }, [authLoading, fetchMembership]);

  const activate = useCallback(async (code: string): Promise<{ ok: boolean; error?: string }> => {
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
  }, []);

  const cancel = useCallback(async () => {
    setError(null);
    try {
      await membershipApi.cancel();
      setMembership(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Cancellation failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchMembership();
  }, [fetchMembership]);

  const isActive = membership?.status === 'active';

  return (
    <MembershipContext.Provider
      value={{
        membership,
        isLoading: authLoading || isLoading,
        isActive,
        error,
        activate,
        cancel,
        refresh,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within MembershipProvider');
  }
  return context;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/context/MembershipContext.tsx
git commit -m "feat: add MembershipContext for membership state management"
```

---

## Task 8: Refactor BoxContext to Use Backend

**Files:**
- Modify: `src/context/BoxContext.tsx`

- [ ] **Step 1: Rewrite BoxContext**

Replace the entire contents of `src/context/BoxContext.tsx` with:

```typescript
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Box, BoxItem, BoxWithItems } from '@/types/box';
import { boxApi } from '@/services/box';
import { ApiError } from '@/services/api-client';
import { useAuth } from './AuthContext';

export interface BoxItemDisplay {
  id: string;
  productId: string;
  variantId: string;
  brand: string;
  name: string;
  size: string;
  retailPrice: number;
  currency: string;
  thumbnailUrl: string | null;
}

interface BoxContextValue {
  box: Box | null;
  items: BoxItemDisplay[];
  isLoading: boolean;
  error: string | null;
  addItem: (params: {
    productId: string;
    variantId: string;
    brand: string;
    name: string;
    size: string;
    retailPrice: number;
    currency: string;
    thumbnailUrl: string | null;
  }) => Promise<{ ok: boolean; error?: string }>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BoxContext = createContext<BoxContextValue | null>(null);

function mapBoxItemToDisplay(item: BoxItem): BoxItemDisplay {
  return {
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    brand: item.product?.brand ?? '',
    name: item.product?.name ?? '',
    size: '',
    retailPrice: item.product?.retail_price_minor ?? 0,
    currency: item.product?.currency ?? 'INR',
    thumbnailUrl: item.product?.thumbnail_url ?? null,
  };
}

export function BoxProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [box, setBox] = useState<Box | null>(null);
  const [items, setItems] = useState<BoxItemDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBox = useCallback(async () => {
    if (!isAuthenticated) {
      setBox(null);
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const boxWithItems = await boxApi.getCurrent();
      setBox(boxWithItems);
      setItems(boxWithItems.items.map(mapBoxItemToDisplay));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load box';
      setError(message);
      setBox(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchBox();
    }
  }, [authLoading, fetchBox]);

  const addItem = useCallback(async (params: {
    productId: string;
    variantId: string;
    brand: string;
    name: string;
    size: string;
    retailPrice: number;
    currency: string;
    thumbnailUrl: string | null;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (items.length >= 5) {
      return { ok: false, error: 'Box is full (max 5 items)' };
    }

    const optimisticItem: BoxItemDisplay = {
      id: `temp-${Date.now()}`,
      productId: params.productId,
      variantId: params.variantId,
      brand: params.brand,
      name: params.name,
      size: params.size,
      retailPrice: params.retailPrice,
      currency: params.currency,
      thumbnailUrl: params.thumbnailUrl,
    };

    setItems((prev) => [...prev, optimisticItem]);

    try {
      const newItem = await boxApi.addItem(params.productId, params.variantId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === optimisticItem.id
            ? {
                ...item,
                id: newItem.id,
                brand: newItem.product?.brand ?? params.brand,
                name: newItem.product?.name ?? params.name,
                retailPrice: newItem.product?.retail_price_minor ?? params.retailPrice,
                currency: newItem.product?.currency ?? params.currency,
                thumbnailUrl: newItem.product?.thumbnail_url ?? params.thumbnailUrl,
              }
            : item
        )
      );
      return { ok: true };
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== optimisticItem.id));
      const message = err instanceof ApiError ? err.message : 'Failed to add item';
      return { ok: false, error: message };
    }
  }, [items.length]);

  const removeItem = useCallback(async (itemId: string) => {
    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await boxApi.removeItem(itemId);
    } catch (err) {
      setItems(previousItems);
      const message = err instanceof ApiError ? err.message : 'Failed to remove item';
      setError(message);
    }
  }, [items]);

  const refresh = useCallback(async () => {
    await fetchBox();
  }, [fetchBox]);

  return (
    <BoxContext.Provider
      value={{
        box,
        items,
        isLoading: authLoading || isLoading,
        error,
        addItem,
        removeItem,
        refresh,
      }}
    >
      {children}
    </BoxContext.Provider>
  );
}

export function useBox() {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error('useBox must be used within BoxProvider');
  return ctx;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/context/BoxContext.tsx
git commit -m "refactor: BoxContext to sync with backend API"
```

---

## Task 9: Add MembershipProvider to Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import and add MembershipProvider**

In `src/app/layout.tsx`, add the import at the top:

```typescript
import { MembershipProvider } from "@/context/MembershipContext";
```

- [ ] **Step 2: Wrap BoxProvider with MembershipProvider**

Change the provider nesting in the body from:

```tsx
<AuthProvider>
  <BoxProvider>
    <SmoothScrollProvider>
```

To:

```tsx
<AuthProvider>
  <MembershipProvider>
    <BoxProvider>
      <SmoothScrollProvider>
```

And close the tag appropriately:

```tsx
      </SmoothScrollProvider>
    </BoxProvider>
  </MembershipProvider>
</AuthProvider>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add MembershipProvider to app layout"
```

---

## Task 10: Update MembershipContent Component

**Files:**
- Modify: `src/components/sections/MembershipContent.tsx`

- [ ] **Step 1: Rewrite MembershipContent**

Replace the entire contents of `src/components/sections/MembershipContent.tsx` with:

```typescript
"use client";

import Image from "next/image";
import { useState } from "react";
import { useMembership } from "@/context/MembershipContext";
import { useBox } from "@/context/BoxContext";
import toast from "react-hot-toast";

const HERO_DESKTOP = "/images/subscription/subscription_desktop.webp";
const HERO_MOBILE = "/images/subscription/subscription_mobile.webp";
const ORNAMENT_SRC = "/logo/ss%20logomark.svg";

const BOX_SLOTS = 5;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MembershipContent() {
  const { membership, isActive, isLoading, activate, cancel } = useMembership();
  const { items } = useBox();
  const [flipped, setFlipped] = useState(false);
  const [code, setCode] = useState("");
  const [activating, setActivating] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  async function handleActivate() {
    if (!code.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    setActivating(true);
    const result = await activate(code.trim());
    setActivating(false);
    if (result.ok) {
      toast.success("Membership activated!");
      setCode("");
      setShowCodeInput(false);
    } else {
      toast.error(result.error || "Activation failed");
    }
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your membership?")) return;
    try {
      await cancel();
      toast.success("Membership cancelled");
      setFlipped(false);
    } catch {
      toast.error("Failed to cancel membership");
    }
  }

  function handleActiveClick() {
    setFlipped((v) => !v);
  }

  const renewalDate = membership?.expires_at ? formatDate(membership.expires_at) : "";

  return (
    <div className="w-full min-w-0">
      {/* Membership card */}
      <div className="px-[2.778vw] md:px-[0.694vw]">
        <div
          className="relative w-full h-[136.111vw] md:h-[39.931vw]"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
              transform: isActive && flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                backgroundColor: isActive ? "#7A021D" : "#a0a0a0",
              }}
            >
              {/* Image area */}
              <div className="absolute top-[1.389vw] left-[1.389vw] right-[1.389vw] bottom-[19.444vw] md:top-[0.347vw] md:left-[0.347vw] md:right-[0.347vw] md:bottom-[4.861vw]">
                <Image
                  src={HERO_MOBILE}
                  alt="Premium Membership"
                  fill
                  className="object-cover object-top md:hidden"
                  sizes="100vw"
                />
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={HERO_DESKTOP}
                    alt="Premium Membership"
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>

                <div className="absolute top-[4.364vw] left-[6.944vw] w-[21.003vw] h-[24.215vw] md:top-[1.389vw] md:left-[4.167vw] md:w-[5.556vw] md:h-[6.111vw]">
                  <Image src={ORNAMENT_SRC} alt="" fill className="object-contain" unoptimized />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(16.667vw+5.556vw+5.556vw)] md:bottom-auto md:top-[2.778vw]">
                  <p className="text-white text-center font-[var(--font-manrope)] font-normal whitespace-nowrap" style={{ fontSize: "8.92vw", lineHeight: "10.494vw", letterSpacing: "-0.357vw" }}>
                    <span className="block md:hidden">Premium</span>
                    <span className="block md:hidden">Membership</span>
                    <span className="hidden md:block" style={{ fontSize: "3.056vw", lineHeight: "3.472vw", letterSpacing: "-0.122vw" }}>
                      Premium
                      <br />
                      Membership
                    </span>
                  </p>
                </div>

                {/* Inactive: Activate Now section */}
                {!isActive && !isLoading && (
                  <div className="absolute bottom-[8.333vw] md:bottom-[3.472vw] left-0 right-0 flex flex-col items-center gap-[2vw] md:gap-[0.8vw]">
                    {showCodeInput ? (
                      <>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Enter access code"
                          className="w-[55.556vw] md:w-[16.667vw] h-[12vw] md:h-[3.5vw] px-4 rounded-full border border-white bg-transparent text-white placeholder-white/70 text-center font-[var(--font-manrope)] text-[3.5vw] md:text-[1.1vw] focus:outline-none focus:ring-2 focus:ring-white/50"
                          disabled={activating}
                        />
                        <button
                          onClick={handleActivate}
                          disabled={activating}
                          className="bg-[#7A021D] rounded-full font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] whitespace-nowrap w-[55.556vw] h-[16.667vw] md:w-[16.667vw] md:h-[5.556vw] text-[3.889vw] md:text-[1.389vw] disabled:opacity-50"
                        >
                          {activating ? "Activating..." : "Activate"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowCodeInput(true)}
                        className="bg-[#7A021D] rounded-full font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] whitespace-nowrap w-[55.556vw] h-[16.667vw] md:w-[16.667vw] md:h-[5.556vw] text-[3.889vw] md:text-[1.389vw]"
                      >
                        Activate Now
                      </button>
                    )}
                  </div>
                )}

                {isLoading && (
                  <div className="absolute bottom-[8.333vw] md:bottom-[3.472vw] left-0 right-0 flex justify-center">
                    <div className="text-white font-[var(--font-manrope)] text-[3.889vw] md:text-[1.389vw]">
                      Loading...
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div
                className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-[5.556vw] md:px-[2.083vw] h-[19.444vw] md:h-[4.861vw]"
                style={{ backgroundColor: isActive ? "#7A021D" : "#a0a0a0" }}
              >
                <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[1.667vw] leading-[1.08]">
                  5 pieces per box
                </span>

                {isActive ? (
                  <button
                    onClick={handleActiveClick}
                    className="flex items-center gap-[2.778vw] md:gap-[0.694vw] cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-[var(--font-manrope)] font-semibold text-white text-[5.556vw] md:text-[1.667vw] tracking-[-0.04em]">
                      Active
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-[2.778vw] md:gap-[0.694vw]">
                    <span className="text-white text-[5.556vw] md:text-[1.667vw] leading-none">×</span>
                    <span className="font-[var(--font-manrope)] font-semibold text-white text-[5.556vw] md:text-[1.667vw] tracking-[-0.04em]">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* BACK face — active + flipped */}
            <div
              className="absolute inset-0 bg-[#7A021D] flex flex-col items-center justify-center px-[5.556vw] md:px-[4.167vw]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                gap: "8.333vw",
              }}
            >
              <p className="font-[var(--font-manrope)] font-normal text-white text-center tracking-[-0.04em] text-[8.333vw] md:text-[4.444vw] leading-[1.2]">
                Renews on {renewalDate}
              </p>
              <div className="flex flex-col gap-[4vw] md:gap-[1.5vw]">
                <button
                  onClick={() => setFlipped(false)}
                  className="bg-white rounded-full font-[var(--font-manrope)] font-semibold text-[#7a021d] tracking-[-0.02em] whitespace-nowrap border border-[#a0a0a0] px-[5.556vw] md:px-[2.083vw] h-[13.889vw] md:h-[5.556vw] text-[3.889vw] md:text-[1.25vw]"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-transparent rounded-full font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] whitespace-nowrap border border-white px-[5.556vw] md:px-[2.083vw] h-[13.889vw] md:h-[5.556vw] text-[3.889vw] md:text-[1.25vw]"
                >
                  Cancel Membership
                </button>
              </div>

              {/* Bottom bar on back */}
              <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-[5.556vw] md:px-[2.083vw] h-[19.444vw] md:h-[4.861vw] bg-[#7A021D]">
                <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[1.667vw] leading-[1.08]">
                  5 pieces per box
                </span>
                <button
                  onClick={() => setFlipped(false)}
                  className="flex items-center gap-[2.778vw] md:gap-[0.694vw] cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-[var(--font-manrope)] font-semibold text-white text-[5.556vw] md:text-[1.667vw] tracking-[-0.04em]">
                    Active
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Current Box */}
      <div className="flex w-full flex-col items-center gap-[8.333vw] md:gap-[3.472vw] mt-[16.667vw] md:mt-[5.556vw]">
        <h2 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.139vw]">
          Your Current Box
        </h2>

        {/* Slots — horizontal scroll on mobile, 5-col grid on desktop */}
        <div className="w-full overflow-x-auto scrollbar-hide lg:overflow-x-visible px-[2.778vw] md:px-[0.694vw]">
          <div className="flex gap-[1.389vw] lg:grid lg:grid-cols-5 lg:gap-[0.347vw]">
            {Array.from({ length: BOX_SLOTS }).map((_, i) => {
              const item = items[i];
              if (item) {
                return (
                  <div
                    key={item.id}
                    className="flex shrink-0 w-[67.949vw] h-[82.051vw] lg:w-auto lg:h-[22.917vw] flex-col items-center justify-center bg-white border border-black overflow-hidden"
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.name}
                        width={200}
                        height={240}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="flex shrink-0 w-[67.949vw] h-[82.051vw] lg:w-auto lg:h-[22.917vw] flex-col items-center justify-center gap-[clamp(1rem,3vw,1.95rem)] bg-[#7a021d] px-4"
                >
                  <span className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-white text-[clamp(2.5rem,6vw,3.163rem)]">
                    +
                  </span>
                  <p className="text-center font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.02em] text-white text-[clamp(0.875rem,2vw,0.988rem)]">
                    Add items to complete your box
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MembershipContent.tsx
git commit -m "feat: wire MembershipContent to backend API with code input"
```

---

## Task 11: Update BoxStageBuilder with Loading/Error States

**Files:**
- Modify: `src/components/sections/box/my-box/BoxStageBuilder.tsx`

- [ ] **Step 1: Add loading and error handling**

In `src/components/sections/box/my-box/BoxStageBuilder.tsx`, update the component to handle loading and error states.

First, update the imports and destructuring at the top of the component:

Change:
```typescript
const { items, removeItem } = useBox();
```

To:
```typescript
const { items, removeItem, isLoading, error } = useBox();
```

- [ ] **Step 2: Add loading skeleton**

After the line `const isFull = items.length >= TOTAL_SLOTS;` and before the return statement, add:

```typescript
if (isLoading) {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)] py-8">
      <div className="flex justify-center items-center h-[20.833vw]">
        <p className="text-gray-500">Loading your box...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add error display**

Right after the loading check, add:

```typescript
if (error) {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)] py-8">
      <div className="flex flex-col justify-center items-center h-[20.833vw] gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#7A021D] text-white rounded-full text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update the item interface**

The component currently uses `closetItemId` but the new context uses `id`. Update the FilledSlotDesktop and FilledSlotMobile components.

In `FilledSlotDesktop`, the item type is already compatible since `BoxItemDisplay` has matching property names (`name`, `brand`, `retailPrice`, `currency`, `thumbnailUrl`). No changes needed to the function signatures - they already work with the object structure.

- [ ] **Step 5: Update the mapping in the render**

Change the desktop items mapping from:
```typescript
{items.map((item) => (
  <FilledSlotDesktop
    key={item.closetItemId}
    item={item}
    onRemove={() => removeItem(item.closetItemId)}
  />
))}
```

To:
```typescript
{items.map((item) => (
  <FilledSlotDesktop
    key={item.id}
    item={item}
    onRemove={() => removeItem(item.id)}
  />
))}
```

And for mobile:
```typescript
{items.map((item) => (
  <FilledSlotMobile
    key={item.id}
    item={item}
    onRemove={() => removeItem(item.id)}
  />
))}
```

- [ ] **Step 6: Remove the old BoxItem import**

Remove this import line if it exists:
```typescript
import { useBox, type BoxItem } from "@/context/BoxContext";
```

Change to:
```typescript
import { useBox } from "@/context/BoxContext";
```

- [ ] **Step 7: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/box/my-box/BoxStageBuilder.tsx
git commit -m "feat: add loading/error states to BoxStageBuilder"
```

---

## Task 12: Update ConfirmPage to Use Real Membership Status

**Files:**
- Modify: `src/app/box/confirm/page.tsx`

- [ ] **Step 1: Import useMembership**

At the top of `src/app/box/confirm/page.tsx`, add:

```typescript
import { useMembership } from "@/context/MembershipContext";
```

- [ ] **Step 2: Remove hardcoded constant**

Delete this line:
```typescript
const USER_HAS_MEMBERSHIP = false;
```

- [ ] **Step 3: Use membership context**

Inside the `ConfirmPage` component, after `const router = useRouter();`, add:

```typescript
const { isActive: hasMembership, isLoading: membershipLoading } = useMembership();
```

- [ ] **Step 4: Update initial stage logic**

Change:
```typescript
const [stage, setStage] = useState<ConfirmStage>(
  USER_HAS_MEMBERSHIP ? "active" : "delivery"
);
```

To:
```typescript
const [stage, setStage] = useState<ConfirmStage>("delivery");

useEffect(() => {
  if (!membershipLoading && hasMembership) {
    setStage("active");
  }
}, [membershipLoading, hasMembership]);
```

- [ ] **Step 5: Add loading state**

Before the stage checks in the return, add:

```typescript
if (membershipLoading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/app/box/confirm/page.tsx
git commit -m "feat: use real membership status in ConfirmPage"
```

---

## Task 13: Wire SettingsContent to Profile API

**Files:**
- Modify: `src/components/sections/profile-landing/SettingsContent.tsx`

- [ ] **Step 1: Add imports**

At the top of `src/components/sections/profile-landing/SettingsContent.tsx`, add:

```typescript
import { useEffect, useState as useStateReact } from "react";
import { profileApi } from "@/services/profile";
import type { Address } from "@/types/profile";
import toast from "react-hot-toast";
import { ApiError } from "@/services/api-client";
```

Note: Keep the existing `useCallback, useId, useState` imports.

- [ ] **Step 2: Add state for modals and data**

Inside the `SettingsContent` component, after the existing `toggles` state, add:

```typescript
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [showAddressModal, setShowAddressModal] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordLoading, setPasswordLoading] = useState(false);
const [address, setAddress] = useState<Address | null>(null);
const [addressForm, setAddressForm] = useState({
  apartment: "",
  locality: "",
  state: "",
  pincode: "",
});
const [addressLoading, setAddressLoading] = useState(false);

useEffect(() => {
  async function loadProfile() {
    try {
      const data = await profileApi.get();
      if (data.address) {
        setAddress(data.address);
        setAddressForm({
          apartment: data.address.apartment,
          locality: data.address.locality,
          state: data.address.state,
          pincode: data.address.pincode,
        });
      }
    } catch {
      // Silently fail - user may not be logged in
    }
  }
  loadProfile();
}, []);

async function handleChangePassword() {
  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }
  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }
  setPasswordLoading(true);
  try {
    await profileApi.changePassword(newPassword);
    toast.success("Password changed successfully");
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Failed to change password";
    toast.error(message);
  } finally {
    setPasswordLoading(false);
  }
}

async function handleUpdateAddress() {
  if (!addressForm.apartment || !addressForm.locality || !addressForm.state || !addressForm.pincode) {
    toast.error("Please fill all fields");
    return;
  }
  if (!/^\d{6}$/.test(addressForm.pincode)) {
    toast.error("Pincode must be 6 digits");
    return;
  }
  setAddressLoading(true);
  try {
    const updated = await profileApi.updateAddress(addressForm);
    setAddress(updated);
    toast.success("Address updated successfully");
    setShowAddressModal(false);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Failed to update address";
    toast.error(message);
  } finally {
    setAddressLoading(false);
  }
}
```

- [ ] **Step 3: Update Change Password button**

Find the button for "Change Password" in the ACCOUNT_ROWS section and add onClick:

Change:
```typescript
<button
  type="button"
  className={`flex w-full flex-row items-center justify-between gap-4 text-left transition-opacity hover:opacity-80 ${ROW_PAD}`}
>
```

For the "Change Password" row, wrap it with a conditional or add onClick. The cleanest approach is to replace the ACCOUNT_ROWS map with explicit buttons. After the Account section's `<ul>`, replace the map with:

```typescript
<li className="border-b border-black">
  <button
    type="button"
    onClick={() => setShowPasswordModal(true)}
    className={`flex w-full flex-row items-center justify-between gap-4 text-left transition-opacity hover:opacity-80 ${ROW_PAD}`}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
      <p className={ROW_TITLE_MOBILE}>Change Password</p>
    </div>
    <ChevronRight className={CHEVRON_CLASS} />
  </button>
</li>
<li className="border-b border-black">
  <button
    type="button"
    className={`flex w-full flex-row items-center justify-between gap-4 text-left transition-opacity hover:opacity-80 ${ROW_PAD}`}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
      <p className={ROW_TITLE_MOBILE}>Payment Methods</p>
      <p className={`${ROW_SUB_MOBILE} lg:tracking-[-0.06em]`}>Visa ending with 6431</p>
    </div>
    <ChevronRight className={CHEVRON_CLASS} />
  </button>
</li>
<li className="border-b border-black lg:last:border-b-0">
  <button
    type="button"
    onClick={() => setShowAddressModal(true)}
    className={`flex w-full flex-row items-center justify-between gap-4 text-left transition-opacity hover:opacity-80 ${ROW_PAD}`}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
      <p className={ROW_TITLE_MOBILE}>Delivery Addresses</p>
      {address && (
        <p className={`${ROW_SUB_MOBILE} lg:tracking-[-0.06em]`}>
          {address.apartment}, {address.locality}
        </p>
      )}
    </div>
    <ChevronRight className={CHEVRON_CLASS} />
  </button>
</li>
```

And remove the `ACCOUNT_ROWS.map` call.

- [ ] **Step 4: Add modal components at the end of the return**

Before the closing `</div>` of the component, add:

```typescript
{/* Password Modal */}
{showPasswordModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">Change Password</h3>
      <div className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New password (min 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              setShowPasswordModal(false);
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="flex-1 px-4 py-3 bg-[#7A021D] text-white rounded-full font-semibold disabled:opacity-50"
          >
            {passwordLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Address Modal */}
{showAddressModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Apartment / House No."
          value={addressForm.apartment}
          onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <input
          type="text"
          placeholder="Locality / Area"
          value={addressForm.locality}
          onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <input
          type="text"
          placeholder="State"
          value={addressForm.state}
          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <input
          type="text"
          placeholder="Pincode (6 digits)"
          value={addressForm.pincode}
          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
          maxLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A021D]"
        />
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setShowAddressModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateAddress}
            disabled={addressLoading}
            className="flex-1 px-4 py-3 bg-[#7A021D] text-white rounded-full font-semibold disabled:opacity-50"
          >
            {addressLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/profile-landing/SettingsContent.tsx
git commit -m "feat: wire settings to profile API for password and address"
```

---

## Task 14: Wire PastBoxesContent to Backend API

**Files:**
- Modify: `src/components/sections/profile-landing/PastBoxesContent.tsx`

- [ ] **Step 1: Add imports and state**

At the top of the file, update imports:

```typescript
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { boxApi } from "@/services/box";
import type { Box } from "@/types/box";
```

- [ ] **Step 2: Update the component to fetch data**

Replace the component definition with:

```typescript
export default function PastBoxesContent() {
  const [boxes, setBoxes] = useState<PastBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoading(true);
        const { boxes: apiBoxes } = await boxApi.getHistory();
        
        // Map API response to PastBox format
        const mappedBoxes: PastBox[] = apiBoxes.map((box, index) => ({
          id: box.id,
          date: new Date(box.created_at).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          orderNumber: `Order #SS${String(2345 - index).padStart(4, '0')}`,
          products: [], // Products would need to be fetched separately or included in API
        }));
        
        setBoxes(mappedBoxes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-w-0 flex justify-center py-12">
        <p className="text-gray-500">Loading past boxes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-0 flex flex-col items-center py-12 gap-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#7A021D] text-white rounded-full text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (boxes.length === 0) {
    return (
      <div className="w-full min-w-0 flex justify-center py-12">
        <p className="text-gray-500">No past boxes yet</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-[8.333vw] sm:gap-[1.389vw] px-[0] sm:px-[1.042vw]">
      {boxes.map((box) => (
        <PastBoxRow key={box.id} box={box} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Remove SAMPLE_BOXES constant**

Delete the `SAMPLE_BOXES` constant from the file.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/profile-landing/PastBoxesContent.tsx
git commit -m "feat: fetch past boxes from backend API"
```

---

## Task 15: Wire MyReviewsContent to Backend API

**Files:**
- Modify: `src/components/sections/profile-landing/MyReviewsContent.tsx`

- [ ] **Step 1: Add imports and state**

At the top of the file, add:

```typescript
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { reviewsApi, Review as ApiReview } from "@/services/reviews";
```

- [ ] **Step 2: Update the component**

Replace the default export with:

```typescript
export default function MyReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const { reviews: apiReviews } = await reviewsApi.getMine();
        
        // Map API response to component's Review format
        const mappedReviews: Review[] = apiReviews.map((review) => ({
          id: review.id,
          brand: review.products?.brand?.toUpperCase() ?? 'UNKNOWN BRAND',
          productName: review.products?.name ?? 'Unknown Product',
          productImage: "/images/wardrobe-sample.webp", // Default image since API doesn't provide it
          rating: review.rating,
          tags: "", // API doesn't have tags
          reviewText: review.body ?? "",
          photos: [], // API doesn't have photos
        }));
        
        setReviews(mappedReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-12">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center py-12 gap-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#7A021D] text-white rounded-full text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex w-full justify-center py-12">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[2.778vw] px-[2.778vw] md:gap-[0.694vw] md:px-[0.694vw]">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Remove sample data constants**

Delete `SAMPLE_REVIEW` and `SAMPLE_REVIEWS` constants from the file.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/profile-landing/MyReviewsContent.tsx
git commit -m "feat: fetch reviews from backend API"
```

---

## Task 16: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run TypeScript check**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npx tsc --noEmit`

Expected: No errors

- [ ] **Step 2: Run linter**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npm run lint`

Expected: No errors (or only pre-existing warnings)

- [ ] **Step 3: Start development server**

Run: `cd /Users/harsh/Downloads/StyleSupply/web-frontend && npm run dev`

Expected: Server starts without errors

- [ ] **Step 4: Manual smoke test**

Test in browser:
1. Navigate to `/accounts/membership` - should show inactive card with code input
2. Navigate to `/box/my-box` - should show loading then empty box slots
3. Navigate to `/accounts/settings` - password and address buttons should open modals
4. Navigate to `/accounts/orders` - should show loading then past boxes (or empty state)
5. Navigate to `/accounts/reviews` - should show loading then reviews (or empty state)

- [ ] **Step 5: Final commit**

If any fixes were needed:
```bash
git add -A
git commit -m "fix: address issues found during verification"
```
