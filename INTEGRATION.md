# StyleSupply — Frontend + Backend Integration Guide

**Last Updated:** April 2, 2026
**Architecture:** Poly-repo (separate `web-frontend` and `web-backend` repositories)

---

## Repository Overview

| Repo | Purpose | Stack |
|------|---------|-------|
| `web-frontend` | Next.js UI, client-side routing, SSR | Next.js 16, React 19, Tailwind CSS v4 |
| `web-backend` | API, auth, database, business logic | Node.js, Supabase (Auth + DB + Storage) |

---

## Authentication Architecture (Supabase)

We use **Supabase Auth** for authentication with the following flow:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend API   │      │   Supabase      │
│   (Next.js)     │      │   (Express)     │      │   (Auth + DB)   │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │  1. Login/Signup       │                        │
         │───────────────────────>│                        │
         │                        │  2. Verify with        │
         │                        │     Supabase Auth      │
         │                        │───────────────────────>│
         │                        │                        │
         │                        │  3. JWT + Refresh      │
         │                        │<───────────────────────│
         │  4. Set HTTP-only      │                        │
         │     cookie + response  │                        │
         │<───────────────────────│                        │
         │                        │                        │
         │  5. Subsequent requests│                        │
         │     (cookie attached)  │                        │
         │───────────────────────>│  6. Validate JWT       │
         │                        │───────────────────────>│
         │                        │                        │
```

### Auth Methods Supported

| Method | Frontend Component | Backend Endpoint |
|--------|-------------------|------------------|
| Email/Password | `LoginForm.tsx`, `SignupForm.tsx` | `POST /api/auth/login`, `POST /api/auth/register` |
| Google OAuth | Social buttons in forms | `GET /api/auth/google`, `GET /api/auth/callback/google` |
| Facebook OAuth | Social buttons in forms | `GET /api/auth/facebook`, `GET /api/auth/callback/facebook` |
| Phone OTP | Stage 2 of `SignupForm.tsx` | `POST /api/auth/otp/send`, `POST /api/auth/otp/verify` |

### Session Handling

- **Access Token:** Short-lived JWT (15 min), stored in HTTP-only cookie
- **Refresh Token:** Long-lived (7 days), stored in HTTP-only cookie
- **Token Refresh:** Automatic via `/api/auth/refresh` when access token expires
- **Logout:** Clears cookies + invalidates refresh token in Supabase

---

## Environment Variables

### Frontend (`web-frontend/.env.local`)

```bash
# API Connection
NEXT_PUBLIC_API_URL=http://localhost:3001          # Backend API base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000          # Frontend URL (for redirects)

# Supabase (client-side, only for realtime/storage if needed)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Backend (`web-backend/.env`)

```bash
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # Admin key, NEVER expose to client
SUPABASE_ANON_KEY=eyJ...

# Auth
JWT_SECRET=your-jwt-secret                      # For signing additional tokens if needed
COOKIE_DOMAIN=localhost                         # .stylesupply.com in production

# OAuth (configured in Supabase dashboard)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Integration Checklist

### Files to Create

| File | Purpose |
|------|---------|
| `src/services/api-client.ts` | Fetch wrapper with base URL, credentials, error handling |
| `src/services/auth.ts` | Auth-specific API calls (login, register, logout, etc.) |
| `src/context/AuthContext.tsx` | React context for auth state |
| `src/hooks/useAuth.ts` | Hook to access auth context |
| `src/types/auth.ts` | TypeScript types for User, Session |
| `middleware.ts` | Next.js middleware for protected routes |

### 1. API Client (`src/services/api-client.ts`)

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Required for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API Error');
  }

  return res.json();
}
```

### 2. Auth Context (`src/context/AuthContext.tsx`)

```tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/auth';
import { apiClient } from '@/services/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    apiClient<{ user: User }>('/api/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await apiClient<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(user);
  };

  const logout = async () => {
    await apiClient('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    const { user } = await apiClient<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### 3. Update Header (`src/components/layout/Header.tsx`)

```tsx
// Add to imports
import { useAuth } from '@/context/AuthContext';

// Inside component
const { user, isAuthenticated, isLoading } = useAuth();

// Replace Sign In button with:
{isLoading ? (
  <div className="w-[80px] h-[40px] bg-gray-100 rounded-[15px] animate-pulse" />
) : isAuthenticated ? (
  <Link href="/accounts" className="...">My Account</Link>
) : (
  <Link href="/login" className="...">Sign In</Link>
)}
```

### 4. Update Root Layout (`src/app/layout.tsx`)

```tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 5. Connect LoginForm

```tsx
// In LoginForm.tsx
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const { login } = useAuth();
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    router.push('/');
  } catch (error) {
    // Handle error
  }
};

// Add onClick to button
<button type="submit" onClick={handleSubmit}>Sign in</button>

// OAuth buttons
<button onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}>
  Sign in with Google
</button>
```

### 6. Protected Routes Middleware (`middleware.ts`)

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/accounts', '/wishlist', '/box'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/accounts/:path*', '/wishlist/:path*', '/box/:path*'],
};
```

---

## Existing Components Ready for Integration

| Component | Location | Auth Integration Needed |
|-----------|----------|------------------------|
| LoginForm | `src/components/sections/LoginForm.tsx` | Connect to `/api/auth/login` |
| SignupForm | `src/components/sections/SignupForm.tsx` | Connect to `/api/auth/register` + OTP endpoints |
| Header | `src/components/layout/Header.tsx` | Add auth state for Sign In / My Account toggle |

---

## OAuth Flow

1. User clicks "Sign in with Google" button
2. Frontend redirects to `{API_URL}/api/auth/google`
3. Backend redirects to Google OAuth consent screen
4. Google redirects back to `{API_URL}/api/auth/callback/google`
5. Backend creates/updates user, sets cookies
6. Backend redirects to `{FRONTEND_URL}/?auth=success`
7. Frontend AuthContext detects cookies via `/api/auth/me`

---

## Testing Auth Locally

1. Start backend on port 3001
2. Start frontend on port 3000
3. Ensure both `.env` files have correct URLs
4. Test email/password flow first
5. Test OAuth after configuring providers in Supabase dashboard

---

## Contact

- **Frontend Team:** Manages UI, client-side state, protected routes
- **Backend Team:** Manages API, Supabase config, OAuth setup, database schema
