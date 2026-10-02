# Tablet Responsiveness Fix — Landing Page + Header

**Date:** 2026-05-30
**Scope:** Landing page (`/`) + global `Header`

---

## Core Problem

The codebase only had two breakpoints:
- **Mobile:** default styles (designed for 360px)
- **Desktop:** `lg:` (1024px+)

Tablets (768–1023px) fell into the gap — they received mobile-sized text, mobile layouts, and mobile images on a much wider screen.

---

## Breakpoint Strategy

| Viewport | Breakpoint | Role |
|----------|-----------|------|
| < 768px | default | Mobile (360px Figma comp) |
| 768–1023px | `md:` | Tablet — intermediate styles |
| 1024px+ | `lg:` | Desktop (1440px Figma comp) |

**Rule:** Use `md:` as the tablet pivot. Never use `sm:` (640px) as a layout toggle — it's too narrow for tablet-specific fixes.

---

## Changes Per Component

### `src/components/sections/landing/LandingHero.tsx`
- Video source JS check: `max-width: 639px` → `max-width: 767px` (tablet loads desktop video)
- Video aspect ratio: `sm:aspect-[1440/720]` → `md:aspect-[1440/720]`
- Heading: added `md:text-[5.5vw] md:leading-[1.05]` between mobile `9.4vw` and desktop `5.139vw`
- Padding: added `md:pt-[60px] md:pb-[60px]` between mobile 40px and desktop 70px

### `src/components/sections/landing/LandingValueProp.tsx`
- Layout toggle: `lg:hidden` / `lg:block` → `md:hidden` / `md:block`
- Desktop heading: added `md:text-[4.5vw]` before `lg:text-[5.139vw]`
- Subtitle: added `md:text-[2vw]`
- CTA button: added `md:h-[7vw] md:w-[22vw] md:text-[1.8vw]`
- Spacing: `lg:mt-[...]` / `lg:gap-[...]` → `md:mt-[...]` / `md:gap-[...]`

### `src/components/sections/landing/LandingHowItWorks.tsx`
- Section heading: added `md:text-[4.8vw]` between mobile `9.444vw` and desktop `5.139vw`
- Card grid: `sm:grid-cols-3` → `md:grid-cols-3`
- Card aspect ratio: `sm:aspect-[453/549]` → `md:aspect-[453/549]`
- Card title: `md:text-[3.3vw]` (reduced ~5% after visual review)
- Card description: `md:text-[2.1vw]`
- CTA button in card: added `md:h-[7vw] md:w-[16vw] md:text-[1.8vw]`
- Image `sizes` attr: `(max-width: 640px)` → `(max-width: 767px)`

### `src/components/sections/landing/LandingOurPromise.tsx`
- Layout toggle: `lg:hidden` / `lg:flex` → `md:hidden` / `md:flex`
- "Our Promise" label: added `md:text-[2vw]`
- Carousel headline: added `md:text-[5vw]` (larger vw value since viewport is smaller)
- Carousel image: `h-[494px] w-[352px]` → `h-[min(45vw,494px)] w-[min(32vw,352px)]` so it scales on tablet
- Description: added `md:text-[2vw]`

### `src/components/sections/landing/LandingBrandsYouLove.tsx`
- Image swap: `lg:hidden` / `lg:block` → `md:hidden` / `md:block`
- Tablet+ shows the **desktop landscape image** (`brand_coming_soon_desktop.png`)
- "Coming Soon" text: simplified to `clamp(14px,1.8vw,24px)` covering all sizes

### `src/app/(landing)/page.tsx`
- Section gap: added `md:gap-[80px]` between mobile `gap-[60px]` and desktop `lg:gap-[120px]`

---

## Header Fix (`src/components/layout/Header.tsx`)

### Problem
Mobile icon row used `style={{ width: "44.444vw" }}` + `justify-between`.
- On 360px mobile → 160px wide (fine)
- On 768px tablet → 341px wide (icons spread too far apart)

### Fix
- Replaced fixed-vw-width + `justify-between` with `flex gap-1 md:gap-2`
- Icon images: `h-5 w-5` on mobile → `md:h-6 md:w-6` (24×24) on tablet
- Hit targets: `h-8 w-8` on mobile → `md:h-10 md:w-10` on tablet
- Same fix applied to both the main header row AND the mobile menu overlay header row
- Removed vw-based inline `style` from icon `<Image>` elements

---

## Reusable Patterns for Other Pages

1. **Layout toggles** (`hidden`/`block` pairs) — change `lg:` to `md:` so tablet gets the desktop layout
2. **vw font sizes** — add an intermediate `md:` value roughly midpoint between mobile and desktop vw
3. **Desktop/mobile image variants** — swap at `md:` not `lg:`
4. **Icon rows with `justify-between` + fixed vw width** — replace with `flex gap-*`
5. **Video source JS breakpoint** — must match the CSS aspect-ratio breakpoint (`767px`)
6. **Page-level section gaps** — add `md:gap-[80px]` between mobile `60px` and desktop `120px`
