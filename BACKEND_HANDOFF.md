# StyleSupply — Frontend Handoff Document for Backend Team

**Document Date:** March 22, 2026
**Project:** StyleSupply — Fashion Rental & Subscription Platform
**Prepared by:** Frontend Team
**Status:** Frontend UI Complete — Backend Integration Pending

---

## 1. Project Overview

StyleSupply is a **fashion rental and subscription platform** where users can browse, rent, and manage a rotating wardrobe of designer clothing. The business model is subscription-based — users pay a recurring fee to access a curated closet of items.

**Core User Flows (Frontend built):**
- Browse all products with category and collection filtering
- View individual product detail with size selection
- Explore by Brand or Collection (category filters live on `/browse`, not a dedicated route)
- Join / Subscription onboarding flow
- FAQ and How It Works informational pages

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.9.3 (strict mode) |
| Styling | Tailwind CSS | v4 (no config file — theme in `globals.css`) |
| Scroll | Lenis smooth scrolling | 1.3.18 |
| Build | Turbopack (via Next.js) | — |
| React Compiler | Enabled (auto-memoization) | — |
| Image Handling | next/image (built-in) | — |
| Font Loading | next/font/google | — |

**No external state management, HTTP client, or data-fetching library is installed yet.** These will be added when backend integration begins.

---

## 3. Project Structure

```
c:\FRONTEND-NEWW\
├── src/
│   ├── app/                        # All routes (Next.js App Router)
│   │   ├── (home)/page.tsx         # Home page
│   │   ├── browse/page.tsx         # Product listing (all products)
│   │   ├── brands/page.tsx         # Browse by brand
│   │   ├── collections/page.tsx    # Browse by collection
│   │   ├── product/[id]/page.tsx   # Product detail page (dynamic)
│   │   ├── join/page.tsx           # Subscription join flow
│   │   ├── howitworks/page.tsx     # How It Works
│   │   ├── faq/page.tsx            # FAQ
│   │   ├── maq/page.tsx            # MAQ (Member Agreement / Questions)
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   └── globals.css             # Tailwind theme + global styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Sticky header with scroll behavior
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   └── MAQ.tsx             # Reusable MAQ component
│   │   ├── sections/               # Page-level section components
│   │   │   ├── BrowseLandingClient.tsx   # Core product grid (reused across /browse, /brands, /collections)
│   │   │   ├── CollectionShowcase.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── CareSection.tsx
│   │   │   ├── ExperienceFashion.tsx
│   │   │   ├── ComparisonSection.tsx
│   │   │   ├── experienceFashionItems.ts # Static data file
│   │   │   └── index.ts            # Barrel export
│   │   └── providers/
│   │       └── SmoothScrollProvider.tsx  # Lenis wrapper
│   │
│   ├── context/        # EMPTY — reserved for AuthContext, CartContext
│   ├── hooks/          # EMPTY — reserved for useProducts, useAuth, etc.
│   ├── services/       # EMPTY — reserved for API service layer
│   ├── types/          # EMPTY — reserved for shared TypeScript interfaces
│   └── utils/
│       └── cn.ts       # Classname join utility
│
├── public/
│   ├── image/          # Product images (placeholder/design images)
│   └── icon/           # UI icons (vuesax icon set)
│
├── next.config.ts      # Next.js config (security headers, image settings)
├── package.json
└── BACKEND_HANDOFF.md  # This document
```

---

## 4. All Routes & Pages

| Route | File | Description | Data Needed from Backend |
|-------|------|-------------|--------------------------|
| `/` | `(home)/page.tsx` | Home / Landing page | Featured products, hero content |
| `/browse` | `browse/page.tsx` | All products listing | Products list (paginated, filterable) |
| `/brands` | `brands/page.tsx` | Products filtered by brand | Brands list, products by brand |
| `/collections` | `collections/page.tsx` | Products filtered by collection | Collections list, products by collection |
| `/product/[id]` | `product/[id]/page.tsx` | Product detail page | Product by ID, related products |
| `/join` | `join/page.tsx` | Subscription sign-up flow | Subscription plans, user registration |
| `/howitworks` | `howitworks/page.tsx` | Static informational | Mostly static, possibly CMS |
| `/faq` | `faq/page.tsx` | FAQ | FAQ entries (possibly CMS) |
| `/maq` | `maq/page.tsx` | Member Agreement Questions | Static / CMS |

---

## 5. Component Architecture

### BrowseLandingClient (Core Product Component)

This is the **most important component** for backend integration. It is a `"use client"` component reused across `/browse`, `/brands`, and `/collections` pages.

**Props it accepts:**
```typescript
type BrowseLandingClientProps = {
  pageTitle?: string;           // Page heading (e.g. "Browse All", "Brands")
  defaultCategory?: string;     // Pre-selected category tab
  showCollectionTabs?: boolean; // Whether to show top collection tab row
  defaultCollection?: string;   // Pre-selected collection tab
};
```

**Current state it manages:**
- `viewMode` — "grid" | "mosaic" layout toggle
- `currentPage` — current pagination page
- `activeCategory` — selected category filter tab
- `activeCollection` — selected collection filter tab

**Current category tabs (hardcoded):**
```
All Products | Accessories | Bottoms | Dresses | Shoes | Tops
```

**Current collection tabs (hardcoded):**
```
Browse All | Sun & Build | Dream | Everyday | Workwear | Events | Vacation | Wedding | Designers
```

**Pagination:** 12 items per page, client-side sliced from array.

**When backend is connected:** These tabs should be driven by API responses, and all filtering/pagination should be server-side via query parameters.

---

### Product Card

Each product card (inside BrowseLandingClient) displays:
- Product image
- Brand name
- Product subtitle/name
- Retail price + Rental price
- Available sizes (XS, S, M, L, XL, 2XL) — hardcoded currently
- Hover interaction: size selector + "Save to Closet" button
- Click: navigates to `/product/${product.id}`

---

### Product Detail Page (`/product/[id]`)

Currently renders static data regardless of the `[id]` param. When backend is ready, it should fetch by ID.

**Sections on product page:**
1. `ProductHero` — main image gallery, size selector, Add to Bag, Save to Closet, accordion (description/shipping/returns)
2. `CompleteTheLook` — 4 related products
3. `ReviewsSection` — customer reviews
4. `CareSection` — care instructions
5. `MiniRecommendationGrid` — 16-item "you may also like" grid
6. `ExperienceFashion` — subscription CTA section

---

### Header

- Sticky with scroll-hide-on-scroll-down behavior (threshold differs on profile routes).
- **Two presentation modes (driven by client auth state, not a separate route):**
  - **External / guest (landing):** desktop uses centered wordmark, sign-in affordance, and a secondary row with Browse / Brands / Collections; mobile uses wordmark + sign-in and the same three nav links in the horizontal strip.
  - **Authenticated:** desktop uses emblem + wordmark, the same three nav links centered, and icon row (search, wishlist, cart + slot badge, profile); mobile uses compact emblem, log out, search, and the same strip + hamburger extras.
- Announcement bar → `/signup` (copy: join CTA).

**Needs from backend:**
- Cart / slot usage for the authenticated badge (e.g. `0/5`)
- Session / user for toggling guest vs authenticated chrome (`AuthContext` + cookies today)
- Wishlist count (optional)

---

## 6. Current Data Model (Placeholder / Frontend-Only)

All data is currently hardcoded. Below is the **data shape** the frontend already uses — this should inform your API response structure.

### Product
```typescript
// Current minimal type (needs expansion)
type Product = {
  id: string;
  name: string;       // Brand name (e.g. "A.L.C")
  subtitle: string;   // Product name (e.g. "Julie Striped Mini Dress")
  image: string;      // Image URL
};
```

**Recommended full Product type for API:**
```typescript
interface Product {
  id: string;
  brand: string;               // Brand name
  name: string;                // Product name
  description: string;
  retailPrice: number;         // Displayed as "Retail ₹X"
  rentalPrice: number;         // Displayed as "Rent for ₹X"
  images: string[];            // Ordered array, first = main image
  sizes: {
    label: string;             // "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL"
    available: boolean;
  }[];
  availabilityCount: number;   // e.g. "3 Left!!" badge
  category: string;            // "Dresses" | "Tops" | "Bottoms" | "Shoes" | "Accessories"
  collections: string[];       // e.g. ["Everyday", "Workwear"]
  relatedProducts: string[];   // Array of product IDs for "Complete the Look"
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Subscription Plan
```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "quarterly" | "annual";
  itemsPerCycle: number;
  features: string[];
  isPopular?: boolean;
}
```

### Review
```typescript
interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;       // 1–5
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}
```

---

## 7. API Endpoints the Frontend Will Need

These are the endpoints the frontend will call once backend is available. Please match these shapes or inform us of changes so we can update accordingly.

### Products

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Paginated product list |
| GET | `/api/products?page=1&limit=12&category=Dresses&collection=Everyday` | Filtered + paginated products |
| GET | `/api/products/:id` | Single product detail |
| GET | `/api/products/:id/related` | "Complete the Look" products |
| GET | `/api/products/:id/recommendations` | "You may also like" grid |

**Expected response shape for list:**
```json
{
  "data": [ ...products ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 248,
    "totalPages": 21
  }
}
```

### Categories & Collections

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/categories` | All category tabs |
| GET | `/api/collections` | All collection tabs |
| GET | `/api/brands` | All brands |

### Reviews

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products/:id/reviews` | Reviews for a product |
| POST | `/api/products/:id/reviews` | Submit a review (auth required) |

### Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | New user registration |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/refresh` | Token refresh |

### Subscription

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/subscriptions/plans` | Available subscription plans |
| POST | `/api/subscriptions` | Subscribe to a plan |
| GET | `/api/subscriptions/me` | Current user's subscription |

### User Closet (Wishlist / Saved Items)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/closet` | Saved items (auth required) |
| POST | `/api/closet/:productId` | Save item to closet |
| DELETE | `/api/closet/:productId` | Remove from closet |

### Cart / Bag

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cart` | Current cart contents |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:itemId` | Remove item from cart |

---

## 8. Security Headers Already Configured

The following security headers are already set in `next.config.ts` on all routes:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Backend should also set:**
- `CORS` — allow only the frontend domain
- `Content-Security-Policy` — configure after API domain is known
- JWT expiry and refresh token rotation strategy

---

## 9. Environment Variables Needed

The frontend will need these environment variables before API integration:

```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=https://api.stylesupply.com   # Base URL for all API calls
NEXT_PUBLIC_APP_URL=https://stylesupply.com        # Frontend URL (for redirects)

# If using NextAuth or token-based auth:
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

Please provide the base API URL when your backend is deployed (even a staging URL).

---

## 10. Design System (for API response consistency)

### Colors (used in UI, not needed from API — for reference)

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#7A021D` | CTA buttons, brand accent |
| Dark Brown | `#25080A` / `#2C0505` | Primary text, filled buttons |
| Light Background | `#F2F2F2` | Page backgrounds |

### Typography

- Primary font: **Manrope** (all body text, labels, prices)
- Display font: **Playfair Display** (editorial headings)
- Sans font: **Inter** (UI elements)

### Image Requirements

- Product images: recommend **1:1.3 aspect ratio** (portrait) for grid cards
- Images should be served from a CDN
- Next.js `next/image` is used — backend CDN domain must be added to `next.config.ts` `images.remotePatterns`

---

## 11. What is Currently Hardcoded (To Be Replaced)

| Location | Data | How to Replace |
|----------|------|----------------|
| `BrowseLandingClient.tsx` L37–86 | 48 placeholder products | `GET /api/products` |
| `BrowseLandingClient.tsx` L16–35 | Category and collection tab labels | `GET /api/categories`, `GET /api/collections` |
| `product/[id]/page.tsx` L30–63 | Product images, look items, recommendations | `GET /api/products/:id` |
| `product/[id]/page.tsx` L88–96 | Product name, price, brand | `GET /api/products/:id` |
| `Header.tsx` L7–12 | Nav category links | Can remain static or be CMS-driven |

---

## 12. Pages That Are Mostly Static

These pages have minimal dynamic data needs and may remain mostly static or be CMS-driven:

- `/howitworks` — informational flow steps
- `/faq` — questions and answers
- `/maq` — membership agreement content

If you have a CMS planned (e.g. Contentful, Sanity), these pages should pull from it. If not, they can stay hardcoded on the frontend.

---

## 13. Key Decisions Needed from Backend Team

Please confirm the following before integration begins:

1. **Authentication method** — JWT (access + refresh tokens) or session-based? Will you support Next.js middleware-level auth?
2. **API versioning** — Will routes be prefixed (e.g. `/api/v1/products`)?
3. **Image hosting** — Where will product images be stored? (S3 / Cloudinary / etc.) We need the CDN domain to whitelist in `next.config.ts`.
4. **Pagination style** — Page-based (`?page=1&limit=12`) or cursor-based?
5. **Currency format** — Are prices returned as integers (paise) or decimals (rupees)? e.g. `640000` or `6400.00`
6. **Date format** — ISO 8601 strings preferred (`2026-03-22T00:00:00Z`)
7. **Error response shape** — Standardize error format, e.g.:
   ```json
   { "error": { "code": "PRODUCT_NOT_FOUND", "message": "Product does not exist" } }
   ```
8. **CORS** — Confirm allowed origins for staging and production

---

## 14. Frontend Integration Plan (Once Backend is Ready)

When backend endpoints are available, the frontend will:

1. Create `src/services/api-client.ts` — fetch wrapper with base URL, auth headers, error handling
2. Create `src/types/product.ts`, `src/types/user.ts`, etc. — typed API responses
3. Create `src/hooks/useProducts.ts`, `src/hooks/useAuth.ts` — data fetching hooks
4. Replace hardcoded arrays in `BrowseLandingClient.tsx` and `product/[id]/page.tsx`
5. Move filter/pagination state to URL query params (`useSearchParams`)
6. Add `CartContext` and `AuthContext` to `src/context/`
7. Add loading skeletons and error states throughout

---

## 15. Running the Frontend Locally

```bash
# Prerequisites: Node.js 20+

# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Open in browser
http://localhost:3000
```

**Dev server port:** 3000 (default)

For local integration testing, set `NEXT_PUBLIC_API_URL=http://localhost:8000` (or your backend port) in `.env.local`.

---

*For questions or clarifications, reach out to the frontend team.*
