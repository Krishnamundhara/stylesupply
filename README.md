# StyleSupply



A modern, responsive fashion rental and subscription platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16 |
| UI Library | React | 19 |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | v4 |
| Scroll | Lenis smooth scrolling | 1.x |
| Build | Turbopack | — |
| React Compiler | Enabled | — |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd web-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Development

```bash
npm run dev      # Start dev server (uses Turbopack)
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production

```bash
npm run build    # Production build
npm run start    # Start production server
```

### Linting

```bash
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (landing)/              # Landing page route group
│   ├── home/                   # Home (authenticated)
│   ├── products/               # Product listing + [id]/ detail + [id]/reviews/
│   ├── brands/                 # All brands + [brand]/ brand detail
│   ├── collections/            # All collections + [slug]/ collection detail
│   ├── wishlist/               # Wishlist + [collectionId]/ collection view
│   ├── box/                    # my-box/ session/ delivery/ payment/ confirm/ returns/
│   ├── accounts/               # Dashboard + membership/ orders/ reviews/ wardrobe/ settings/ help/
│   ├── login/                  # Login
│   ├── signup/                 # Signup
│   ├── forgot-password/        # Password reset
│   ├── request-access/         # Early access / waitlist
│   ├── howitworks/             # How It Works
│   ├── faq/                    # FAQ
│   ├── about/                  # About
│   ├── legal/                  # Legal / terms
│   ├── sitemap/                # Sitemap
│   ├── coming-soon/            # Coming soon placeholder
│   └── globals.css             # Tailwind theme
│
├── components/
│   ├── layout/             # Header, Footer, MAQ
│   ├── sections/           # Page section components
│   └── providers/          # Context providers
│
├── context/                # React contexts (Auth, etc.)
├── hooks/                  # Custom hooks
├── services/               # API service layer
├── types/                  # TypeScript interfaces
└── utils/                  # Utility functions
```

## Documentation

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](./CLAUDE.md) | AI coding assistant instructions, design system, conventions |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, database schema, infrastructure decisions |
| [INTEGRATION.md](./INTEGRATION.md) | Frontend + backend integration guide |
| [LAUNCH_MODE.md](./LAUNCH_MODE.md) | Prelaunch gating, route protection, bypass setup |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | PR workflow, branch naming, commit conventions |

## Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # Server-only
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [INTEGRATION.md](./INTEGRATION.md) for complete environment setup.

## License

Private repository. All rights reserved.

# Style-Supply-
