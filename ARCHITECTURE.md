# StyleSupply — Architecture Roadmap

**Date:** April 2, 2026
**Status:** Locked In

---

## Overview

StyleSupply is a fashion rental/subscription platform. The frontend is built and deployed — this document defines the backend architecture, infrastructure decisions, and integration plan going forward.

```
┌──────────────────────────────────────────────┐
│                    Users                      │
└─────────────────────┬────────────────────────┘
                      │
             ┌────────▼────────┐
             │   Vercel CDN    │  Next.js 16 (App Router)
             │   Edge + SSR    │  Auto-deploy from GitHub
             └────────┬────────┘
                      │
           ┌──────────▼──────────┐
           │  Next.js API Routes │  Server-side proxy layer
           │  (Route Handlers)   │  Keeps Supabase keys server-side
           └──────────┬──────────┘
                      │
        ┌─────────────▼─────────────┐
        │         Supabase          │
        │  ┌────────┬────────────┐  │
        │  │  Auth  │  Postgres  │  │
        │  │        │   (RLS)    │  │
        │  ├────────┼────────────┤  │
        │  │Storage │  Edge Fns  │  │
        │  │(Images)│ (Webhooks) │  │
        │  └────────┴────────────┘  │
        └───────────────────────────┘
                      │
        ┌─────────────▼─────────────┐
        │    Stripe / Razorpay      │
        │    (Payment Processing)   │
        └───────────────────────────┘
```

---

## Infrastructure Decisions

### Frontend: Vercel (No Change)

The Next.js frontend stays on Vercel. No EC2.

- Next.js 16 + App Router + Turbopack + React Compiler — Vercel is purpose-built for this
- Global edge CDN, ISR, image optimization, zero-config deploys out of the box
- EC2 would mean managing Node processes, nginx, SSL, auto-scaling, deploy pipelines — unnecessary overhead
- If Vercel pricing becomes a blocker at scale, revisit then

### Backend: Supabase (All-in-One)

Supabase handles auth, database, storage, and serverless functions.

| Service | Supabase Feature | Purpose |
|---------|-----------------|---------|
| Auth | Supabase Auth | Email/password, OAuth, JWT, session handling |
| Database | Postgres + RLS | Products, users, orders, subscriptions, reviews, cart, wishlist |
| Storage | Supabase Storage | Product images, user avatars, brand assets |
| Serverless | Edge Functions (Deno) | Payment webhooks, custom business logic, email triggers |
| Realtime | Supabase Realtime | Inventory availability, cart sync (future) |

### Image Storage: Supabase Storage

Supabase Storage is S3-compatible under the hood.

**Why not raw S3 + CloudFront right now:**
- Supabase Storage has built-in image transformations (resize, crop, format)
- RLS integration — access control via same Postgres policies as DB
- No separate infra to manage
- 5-minute setup vs 1-2 hours for S3 + CloudFront + Lambda@Edge

**Migration path when needed:**
Supabase Storage → export objects → S3 bucket → CloudFront CDN → update `next.config.ts` `remotePatterns`. Straightforward, one-afternoon migration if/when traffic demands 400+ global edge nodes.

### Payments: Stripe or Razorpay

Supabase does not handle payments. A payment provider is needed for subscription billing.

- Webhook handlers live as Supabase Edge Functions or Next.js API routes
- Subscription state synced to Supabase Postgres via webhooks
- Payment provider choice depends on target market (Razorpay for India-first, Stripe for global)

### Repo Structure: Polyrepo

No monorepo. No shared code between frontend and backend to justify it.

```
Repo 1: web-frontend (this repo)
├── Deploys to Vercel
├── src/types/          ← API response types
├── src/services/       ← Supabase client + API layer
├── src/hooks/          ← Data fetching hooks
├── src/context/        ← AuthContext, CartContext
└── src/app/api/        ← Next.js route handlers

Repo 2: stylesupply-supabase
├── supabase/migrations/    ← Database schema (version controlled)
├── supabase/functions/     ← Edge functions (webhooks, custom logic)
├── supabase/seed.sql       ← Seed data for dev/staging
└── supabase/config.toml    ← Project config
```

If shared types are ever needed across repos, publish a `@stylesupply/types` npm package rather than adopting a monorepo.

---

## Database Schema (Supabase Postgres)

### Core Tables

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Brands
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  description text,
  created_at timestamptz default now()
);

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,           -- "Dresses", "Tops", "Bottoms", "Shoes", "Accessories"
  slug text unique not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,           -- "Everyday", "Workwear", "Vacation", etc.
  slug text unique not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) not null,
  category_id uuid references public.categories(id) not null,
  name text not null,
  slug text unique not null,
  description text,
  retail_price int not null,     -- in paise (e.g. 640000 = ₹6,400)
  rental_price int not null,     -- in paise
  images text[] not null,        -- ordered array of storage URLs
  availability_count int default 0,
  rating numeric(2,1),
  review_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product ↔ Collection (many-to-many)
create table public.product_collections (
  product_id uuid references public.products(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- Product Sizes
create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  label text not null,           -- "XS", "S", "M", "L", "XL", "2XL", "3XL"
  available boolean default true
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Subscription Plans
create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price int not null,            -- in paise
  billing_cycle text not null,   -- "monthly", "quarterly", "annual"
  items_per_cycle int not null,
  features text[] not null,
  is_popular boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User Subscriptions
create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references public.subscription_plans(id),
  status text not null,          -- "active", "cancelled", "past_due", "trialing"
  payment_provider text,         -- "stripe" or "razorpay"
  payment_provider_id text,      -- external subscription ID
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Wishlist / Closet
create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  collection_name text default 'Default',
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Cart
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  size_id uuid references public.product_sizes(id),
  created_at timestamptz default now(),
  unique(user_id, product_id, size_id)
);

-- Related Products
create table public.related_products (
  product_id uuid references public.products(id) on delete cascade,
  related_product_id uuid references public.products(id) on delete cascade,
  relation_type text default 'complete_the_look',  -- or "recommendation"
  primary key (product_id, related_product_id)
);
```

### Row Level Security (RLS)

```sql
-- Profiles: users can read all, update own
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products, brands, categories, collections: public read
alter table public.products enable row level security;
create policy "Products are viewable by everyone" on public.products for select using (is_active = true);

-- Wishlist: users can only access own
alter table public.wishlist enable row level security;
create policy "Users can manage own wishlist" on public.wishlist for all using (auth.uid() = user_id);

-- Cart: users can only access own
alter table public.cart_items enable row level security;
create policy "Users can manage own cart" on public.cart_items for all using (auth.uid() = user_id);

-- Reviews: public read, authenticated write
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Authenticated users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);
```

---

## API Layer

### Approach: Next.js Route Handlers → Supabase

The frontend talks to Next.js API routes (`src/app/api/`), which talk to Supabase server-side. This keeps `SUPABASE_SERVICE_ROLE_KEY` off the client.

For auth-related operations, use `@supabase/ssr` to manage cookies in Next.js middleware.

### Endpoint Mapping

| Frontend Needs | Next.js Route | Supabase Query |
|---------------|---------------|----------------|
| Product list (filtered, paginated) | `GET /api/products` | `supabase.from('products').select('*, brands(*), product_sizes(*)')` with filters |
| Single product | `GET /api/products/[id]` | `supabase.from('products').select('*, brands(*), product_sizes(*), reviews(*, profiles(*))').eq('id', id)` |
| Categories | `GET /api/categories` | `supabase.from('categories').select('*').order('sort_order')` |
| Collections | `GET /api/collections` | `supabase.from('collections').select('*').order('sort_order')` |
| Brands | `GET /api/brands` | `supabase.from('brands').select('*')` |
| Reviews | `GET /api/products/[id]/reviews` | `supabase.from('reviews').select('*, profiles(*)').eq('product_id', id)` |
| Wishlist | `GET /api/closet` | `supabase.from('wishlist').select('*, products(*, brands(*))').eq('user_id', uid)` |
| Cart | `GET /api/cart` | `supabase.from('cart_items').select('*, products(*, brands(*)), product_sizes(*)').eq('user_id', uid)` |
| Auth | Supabase Auth SDK | `@supabase/ssr` handles cookies + middleware |

### Pagination

Page-based: `?page=1&limit=12&category=dresses&collection=everyday`

```typescript
// Example: product list query
const { data, count } = await supabase
  .from('products')
  .select('*, brands(*), product_sizes(*)', { count: 'exact' })
  .eq('is_active', true)
  .eq('category_id', categoryId)
  .range((page - 1) * limit, page * limit - 1)
  .order('created_at', { ascending: false });
```

### Error Response Shape

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product does not exist"
  }
}
```

---

## Environment Variables

### Frontend (`web-frontend/.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...         # Public anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # Server-only — never expose to client
NEXT_PUBLIC_APP_URL=https://stylesupply.com

# Payments (when integrated)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Supabase Project Config

```bash
# Set via Supabase dashboard or CLI
SUPABASE_PROJECT_ID=xxxxx
SUPABASE_DB_PASSWORD=...
```

---

## Frontend Integration Plan

Order of integration once Supabase project is set up:

### Phase 1: Auth

1. Install `@supabase/supabase-js` + `@supabase/ssr`
2. Create Supabase client utilities (`src/services/supabase.ts`)
3. Add auth middleware (`src/middleware.ts`) for session management
4. Build `AuthContext` in `src/context/`
5. Wire up `LoginForm.tsx` and `SignupForm.tsx`
6. Update `Header.tsx` — toggle "Sign In" vs user avatar based on auth state

### Phase 2: Product Data

1. Define TypeScript types in `src/types/`
2. Create data fetching hooks in `src/hooks/`
3. Replace hardcoded products in `BrowseLandingClient.tsx` with API calls
4. Wire up `product/[id]/page.tsx` to fetch by ID
5. Move filtering/pagination to URL search params
6. Add loading skeletons and error states

### Phase 3: User Features

1. Wishlist — save/remove products, collection grouping
2. Cart — add/remove items with size selection
3. Reviews — display + authenticated submission

### Phase 4: Subscriptions & Payments

1. Display plans from DB on `/accounts/membership` page
2. Integrate Stripe/Razorpay checkout for `/box/payment`
3. Set up webhook handlers for payment events
4. Sync subscription status to `user_subscriptions` table

### Phase 5: Polish

1. Add `next/image` remote patterns for Supabase Storage domain
2. Migrate static images from `/public/` to Supabase Storage
3. Add error boundaries
4. SEO metadata from DB content
5. Admin tooling (if needed — Supabase dashboard may suffice initially)

---

## Key Conventions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Currency | Integers in paise | Avoids floating-point issues (₹6,400 = `640000`) |
| Dates | ISO 8601 (`2026-04-02T00:00:00Z`) | Standard, timezone-safe |
| IDs | UUID v4 | Supabase default, no sequential ID leaks |
| API versioning | None initially | Single consumer (this frontend), version when needed |
| Image aspect ratio | 1:1.3 (portrait) | Matches existing product card grid layout |
| Pagination | Page-based (`?page=1&limit=12`) | Simpler than cursor for grid browsing |
| Auth | Supabase Auth + `@supabase/ssr` | Cookie-based sessions in Next.js, no manual JWT handling |

---

## Supabase Storage Buckets

```
stylesupply-storage/
├── products/          ← Product images (public read)
├── brands/            ← Brand logos (public read)
├── avatars/           ← User avatars (public read)
└── uploads/           ← Admin uploads, temporary (private)
```

Storage policies:
- `products`, `brands`, `avatars` — public read, authenticated admin write
- `uploads` — authenticated read/write, private

Add Supabase Storage domain to `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "xxxxx.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

---

*This document is the source of truth for architecture decisions. Update it as decisions evolve.*
