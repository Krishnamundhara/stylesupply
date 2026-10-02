# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack)
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Start production server
```

## Architecture

**StyleSupply** is a fashion rental/subscription platform built with Next.js App Router.

### Stack

* Next.js 16 + React 19 with React Compiler enabled (`reactCompiler: true`)
* Tailwind CSS v4 — no `tailwind.config.js`; theme is defined via `@theme` in `src/app/globals.css`
* TypeScript strict mode, path alias `@/*` → `src/*`
* Lenis smooth scrolling via `SmoothScrollProvider` in root layout

### Routing

All routes live under `src/app/`. Pages follow a Server Component pattern: each `page.tsx` composes `Header` + section components + `Footer` inside a `max-w-360` container. The home page uses the `(home)` route group.

Key routes:

| Route | Description |
|-------|-------------|
| `/` | Landing page `(landing)` route group |
| `/home` | Home page |
| `/products` | Product listing/browse |
| `/products/[id]` | Product detail |
| `/products/[id]/reviews` | Product reviews |
| `/brands` | All brands listing |
| `/brands/[brand]` | Brand-specific product listing |
| `/collections` | All collections listing |
| `/collections/[slug]` | Collection-specific product listing |
| `/wishlist` | User wishlist |
| `/wishlist/[collectionId]` | Wishlist collection detail |
| `/box/my-box` | User's current rental box |
| `/box/session` | Box browsing session |
| `/box/delivery` | Delivery info/scheduling |
| `/box/payment` | Box payment |
| `/box/confirm` | Order confirmation |
| `/box/returns` | Returns management |
| `/accounts` | Account dashboard |
| `/accounts/membership` | Membership plan details |
| `/accounts/membership/manage` | Manage/change plan |
| `/accounts/orders` | Order history |
| `/accounts/reviews` | User's submitted reviews |
| `/accounts/wardrobe` | Saved wardrobe items |
| `/accounts/wardrobe/review` | Wardrobe review flow |
| `/accounts/settings` | Account settings |
| `/accounts/settings/profile` | Edit profile |
| `/accounts/settings/change-password` | Change password |
| `/accounts/settings/logout` | Logout confirmation |
| `/accounts/help` | Help & support |
| `/login` | Login page |
| `/signup` | Signup page |
| `/forgot-password` | Password reset |
| `/request-access` | Early access / waitlist |
| `/howitworks` | How it works |
| `/faq` | FAQ |
| `/about` | About page |
| `/legal` | Legal / terms |
| `/sitemap` | Sitemap |
| `/coming-soon` | Coming soon placeholder |

### Component structure

* `src/components/layout/` — `Header`, `Footer`, `MAQ` (reused across all pages)
* `src/components/sections/` — page-level section components, exported via `index.ts` barrel
* `src/components/providers/` — `SmoothScrollProvider` (Lenis)
* `src/utils/cn.ts` — simple classname join utility

### BrowseLandingClient

The main product grid component (`src/components/sections/BrowseLandingClient.tsx`) is a `"use client"` component reused across Browse, Brands, Collections, and Categories pages. It accepts props to configure the page:

* `pageTitle` — heading text
* `defaultCategory` — pre-selected category tab
* `showCollectionTabs` — renders the collection tabs row above category tabs
* `defaultCollection` — pre-selected collection tab

### Fonts

Three fonts are loaded in the root layout and exposed as CSS variables:

* `--font-sans` (Inter), `--font-display` (Playfair Display), `--font-manrope` (Manrope)

Use them in Tailwind as `font-[var(--font-manrope)]`.

### Data

All product/section data is currently hardcoded in component files and data files like `src/components/sections/experienceFashionItems.ts`. The `src/context/`, `src/hooks/`, `src/services/`, and `src/types/` directories exist as empty placeholders for future API integration.

---

## Design System

### Colors

* Primary Red: #7A021D
* Dark Brown: #2C0505
* Light Background: #F2F2F2

Guidelines:

* Use these colors consistently across all components
* Do not introduce new colors unless explicitly required
* Maintain proper contrast and accessibility

---

### Typography

* Primary Font: Manrope
* Usage: `font-[var(--font-manrope)]`

#### Typography Scale

| Style      | Desktop Size | Weight      | Mobile Size | Weight      | Letter-Spacing | Line-Height |
|------------|-------------|-------------|-------------|-------------|----------------|-------------|
| Display    | 84px        | Medium (500)| 32px        | Medium (500)| -5%            | 100px       |
| Heading    | 5.139vw     | Regular (400)| 5.139vw    | Regular (400)| -4%            | 46px        |
| Subheading | 24px        | Bold (700)  | 16px        | Medium (500)| -6%            | 110%        |
| Body 1     | 24px        | Medium (500)| 15px        | Medium (500)| -2%            | 140%        |
| Body 2     | 20px        | Medium (500)| 14px        | Medium (500)| -4%            | 110%        |
| Body 3     | 20px        | Regular (400)| 14px       | SemiBold (600)| -2%          | 110%        |
| Body 4     | 16px        | Regular (400)| 12px       | Regular (400)| -2%           | 110%        |

Guidelines:

* Use Manrope across the entire application
* Maintain consistent font sizes and weights
* Ensure clear visual hierarchy (heading → subheading → body)
* Heading style is always `text-black` — never use any other color for headings

---

### Hero Section

* Every page's hero component must have **70px top and bottom padding** applied to the text content on desktop
* Use `py-[70px]` or equivalent Tailwind utility on the hero text wrapper
* This applies to all pages consistently

---

### Spacing System (VERY IMPORTANT)

Spacing between major sections/components is controlled at the **page level**, not inside individual components.

Viewport 기준:

* Desktop (1440px and above): **80px vertical gap between sections**
* Mobile (360px): **60px vertical gap between sections**
* Desktop: **120px gap before the Footer**
* Mobile: **100px gap before the Footer**

Guidelines:

* Apply spacing when composing sections inside `page.tsx`
* Do NOT add large outer margins inside individual components
* Components should remain spacing-neutral and reusable
* Spacing must be responsive and adapt across screen sizes
* Use Tailwind responsive utilities (e.g., `gap`, `mt`, `mb`, `py`) to maintain consistency

Example approach:

* Desktop: `gap-[80px]`
* Mobile: `gap-[60px]`

---

## Claude Behavior Rules

### General

* Act as a senior software engineer
* Follow best practices for readability, scalability, and maintainability
* Respect the existing codebase and conventions

---

### Output Rules (IMPORTANT)

* Return ONLY the necessary code unless explanation is explicitly requested
* Do NOT rewrite entire files unless required
* Only modify the relevant parts of the code
* Avoid repeating unchanged code

---

### Code Changes

* Preserve existing logic unless explicitly instructed otherwise
* Make minimal, precise changes
* Ensure changes integrate cleanly with the current architecture

---

### Project Awareness

* Follow the existing folder structure and component patterns
* Use existing utilities and helpers where possible
* Do not introduce new libraries unless necessary

---

### Styling

* Use Tailwind CSS only
* Follow the defined Design System (colors, typography, spacing)
* Maintain consistency in layout and responsiveness

---

### Components

* Keep components modular and reusable
* Avoid duplication
* Do not hardcode layout spacing inside components

---

### Debugging

* Identify the root cause before suggesting fixes
* Provide minimal and targeted fixes
* Avoid unnecessary refactoring

---

### Performance

* Avoid unnecessary re-renders
* Prefer efficient and scalable solutions

---

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes � gives risk-scored analysis |
| `get_review_context` | Need source snippets for review � token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
