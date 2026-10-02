# Contributing to StyleSupply Frontend

## Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New feature | `feat/wishlist-page` |
| `fix/` | Bug fix | `fix/header-scroll-behavior` |
| `refactor/` | Code refactoring | `refactor/product-card-component` |
| `docs/` | Documentation | `docs/api-integration-guide` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `style/` | Styling changes | `style/mobile-responsive-fixes` |

## Commit Messages

Follow conventional commit format:

```
<type>: <short description>

[optional body]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring (no behavior change)
- `style` — Styling/CSS changes
- `docs` — Documentation
- `chore` — Maintenance (deps, config, etc.)
- `test` — Adding/updating tests
- `ci` — CI/CD changes

**Examples:**
```
feat: add wishlist functionality to product cards
fix: resolve header z-index issue on mobile
refactor: extract product filtering logic into hook
style: update button hover states for consistency
```

Keep the first line under 70 characters. Use imperative mood ("add" not "added").

## Pull Request Workflow

### 1. Create a branch

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Make changes

- Follow the design system in [CLAUDE.md](./CLAUDE.md)
- Run `npm run lint` before committing
- Test on both desktop and mobile viewports

### 3. Commit and push

```bash
git add .
git commit -m "feat: description of changes"
git push -u origin feat/your-feature-name
```

### 4. Open a Pull Request

- Use a clear, descriptive title
- Reference any related issues
- Include screenshots for UI changes
- Request review from a team member

### 5. PR Template

```markdown
## Summary
Brief description of what this PR does.

## Changes
- Change 1
- Change 2

## Screenshots (if applicable)
Before | After

## Checklist
- [ ] Code follows project conventions
- [ ] Tested on desktop and mobile
- [ ] No console errors or warnings
- [ ] Ran `npm run lint`
```

## Code Review Guidelines

**Reviewers should check:**
- Code follows existing patterns and conventions
- No unnecessary complexity or over-engineering
- Responsive design works on mobile (360px) and desktop (1440px+)
- No hardcoded spacing inside components (spacing at page level)
- Colors and typography match design system

**Authors should:**
- Respond to feedback constructively
- Make requested changes promptly
- Resolve conversations after addressing feedback

## Development Guidelines

### Styling

- Use Tailwind CSS only (no inline styles or CSS modules)
- Follow the spacing system: 80px desktop / 60px mobile between sections
- Apply spacing at the page level, not inside components
- Use design system colors: `#7A021D` (primary), `#2C0505` (dark brown), `#F2F2F2` (background)

### Components

- Keep components modular and reusable
- Export section components via `src/components/sections/index.ts`
- Use `"use client"` directive only when necessary
- Avoid prop drilling — use context for shared state

### TypeScript

- Enable strict mode (already configured)
- Define interfaces in `src/types/`
- Use path alias `@/*` for imports

### Performance

- Use `next/image` for all images
- Lazy load below-the-fold content
- Avoid unnecessary re-renders

## Questions?

If you're unsure about conventions or approach, check existing code patterns or ask before implementing.
