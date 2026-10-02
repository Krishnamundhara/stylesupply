# Launch Mode & Route Protection

Controls site access during prelaunch period and handles auth-based route protection.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LAUNCH_MODE` | `prelaunch` | `prelaunch` = gated, `live` = full access |
| `NEXT_PUBLIC_LAUNCH_MODE` | `prelaunch` | Same value, exposed to client components |
| `BYPASS_SECRET` | `ss-internal-preview` | Secret key for team testing |

**Important:** Set both `LAUNCH_MODE` and `NEXT_PUBLIC_LAUNCH_MODE` to the same value in Vercel.

## Modes

### Prelaunch Mode (`LAUNCH_MODE=prelaunch`)

Only these routes are accessible:
- `/` (landing page)
- `/request-access`
- `/faq`, `/howitworks`, `/about`
- `/legal`, `/accessibility`, `/your-privacy-choices`
- `/sitemap`, `/coming-soon`

Everything else redirects to `/`.

### Live Mode (`LAUNCH_MODE=live`)

Full site with auth protection:

| Route | Behavior |
|-------|----------|
| `/home`, `/accounts/*`, `/box/*`, `/wishlist/*` | Require login |
| `/login`, `/signup`, `/forgot-password` | Redirect to `/home` if logged in |
| `/` | Logged-in users redirect to `/home` |
| `/brands`, `/brands/[brand]`, `/collections`, `/collections/[slug]`, `/products/*` | Public, no auth required |

## Bypass for Testing

Visit the site with the bypass param to set a 30-day cookie:

```
https://stylesupply.io?bypass=YOUR_BYPASS_SECRET
```

Once set, you'll see the full site regardless of `LAUNCH_MODE`.

## How It Works

### Middleware (Route Protection)
- Gates routes at the edge based on `LAUNCH_MODE` env var
- Sets `ss_bypass` (httpOnly) + `ss_bypass_ui` (client-readable) cookies on bypass

### UI Components (Header, Footer)
- Use `useLaunchMode()` hook from `src/hooks/useLaunchMode.ts`
- Hook checks `NEXT_PUBLIC_LAUNCH_MODE` and `ss_bypass_ui` cookie
- Returns `{ isLive, isPrelaunch }` to conditionally render links

### Prelaunch UI Gating (Header)
In prelaunch mode the following header elements redirect to `/coming-soon`:
- **Browse** nav link
- **Membership** nav link (desktop + mobile menu panel)
- **Hamburger menu** icon (desktop + mobile) — does not open overlay
- **Wishlist** (heart icon)
- **My Box** (box icon)
- **Account** (user icon)
- Search already points to `/coming-soon` permanently

How It Works remains live as it's an allowed prelaunch route.

### Prelaunch UI Gating (Footer)
In prelaunch mode the following footer links redirect to `/coming-soon`:
- Browse
- By Brands
- By Collection

### Files Changed
- `src/middleware.ts` — route gating + bypass cookies
- `src/hooks/useLaunchMode.ts` — client-side launch mode detection
- `src/components/layout/Header.tsx` — dynamic nav links + icon gating
- `src/components/layout/Footer.tsx` — dynamic nav links

## Workflow

1. **Development**: Add to `.env.local`:
   ```
   BYPASS_SECRET=techteam2026
   LAUNCH_MODE=prelaunch
   NEXT_PUBLIC_LAUNCH_MODE=prelaunch
   ```
   Then visit `http://localhost:3000/?bypass=techteam2026` to unlock the full UI locally.
   Without `.env.local`, the default secret is `ss-internal-preview`.

2. **Team testing**: Share the bypass URL — `https://yourdomain.com?bypass=<BYPASS_SECRET>`
   Cookie lasts 30 days. Appending `?bypass=` to any path works, e.g. `/?bypass=…` then navigate to `/accounts`.

3. **Launch day**: Change `LAUNCH_MODE=live` and `NEXT_PUBLIC_LAUNCH_MODE=live` in Vercel, redeploy

## Revoking Bypass Access

Change `BYPASS_SECRET` to a new value. Old cookies will no longer work.
