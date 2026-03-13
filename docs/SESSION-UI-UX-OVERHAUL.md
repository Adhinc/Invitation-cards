# Session Log: UI/UX Overhaul — 2026-03-13

## What We Did

Full UI/UX overhaul of the invitation-card platform using the **web-component-design** skill pattern (installed from `wshobson/agents@web-component-design`).

## Approach Chosen

**Hybrid: Foundation Layer + Page Sweeps** (Approach 3 out of 3 proposed)

- No new dependencies added — built everything with existing Tailwind + Framer Motion + Lucide
- Foundation first, then page-by-page refactoring

## Design Doc

Saved at: `docs/plans/2026-03-13-ui-ux-overhaul-design.md`

## Implementation Plan

Saved at: `docs/plans/2026-03-13-ui-ux-overhaul-plan.md`
Task persistence: `docs/plans/2026-03-13-ui-ux-overhaul-plan.md.tasks.json`

## What Was Built

### 1. Design Tokens (`src/index.css`)
- Centralized CSS custom properties: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, surface colors, text colors, borders, semantic colors (success/warning/error), shadows, transitions
- Legacy aliases kept for backwards compat during migration
- Global `:focus-visible` ring style
- `.sr-only` utility class
- `@media (prefers-reduced-motion: reduce)` support

### 2. Shared Utilities
- `src/utils/cn.ts` — class merging (filters falsy values)
- `src/utils/animations.ts` — shared Framer Motion variants: `fadeUp`, `fadeIn`, `scaleIn`, `stagger`, `slideInLeft`, `slideInRight`
- `src/utils/accessibility.ts` — `srOnly` constant, `announceToScreenReader()` helper

### 3. Core Component Kit (`src/components/ui/`)
- **Button** — variants: primary/secondary/ghost/outline, sizes: sm/md/lg, isLoading, leftIcon/rightIcon
- **IconButton** — requires `aria-label`, variants: ghost/outline
- **Card** — compound component (Card, Card.Header, Card.Body, Card.Footer), variants: default/glass/elevated
- **SectionTitle** — h2 + subtitle + accent divider, animated with fadeUp
- **Badge** — variants: success/warning/error/info/premium
- **Section** — semantic `<section>` with stagger animation, optional `aria-labelledby`
- **Input** — accessible with `<label>`, error state, `aria-describedby`
- **Accordion** — compound (Accordion, Accordion.Item), context-based, `aria-expanded`, AnimatePresence
- **index.ts** — barrel export

### 4. Page Sweeps

#### MainLayout.tsx
- Skip-to-content link (`<a href="#main-content">`)
- `<main id="main-content">` landmark
- CSS variable for background color

#### Navbar.tsx
- `aria-current="page"` on active links (desktop + mobile)
- `aria-label="Main navigation"` on `<nav>`
- Escape key closes mobile menu
- All hardcoded `#C85C6C` → CSS vars

#### Footer.tsx
- Color contrast fix on disabled links
- CSS vars for brand color

#### Home.tsx
- Removed duplicated `fadeUp`/`stagger` → shared imports
- All `--primary-rose` refs → `--color-primary` refs

#### EventPage.tsx
- Removed duplicated animations → shared imports

#### Chatbot.tsx
- Named `STEPS` constants replacing 14 magic step numbers
- `aria-live="polite"` on messages container
- `<label>` on chat input (sr-only)
- All hardcoded colors → CSS vars

#### PreviewPage.tsx
- `aria-label` on all 4 action buttons (RSVP, Calendar, Directions, WhatsApp)
- All hardcoded colors → CSS vars

#### PricingPage.tsx
- FAQ section replaced with `Accordion` component
- Removed local animations → shared imports
- Removed unused `openFaq` state

#### Dashboard.tsx
- Sidebar wrapped in `<nav aria-label="Dashboard navigation">`
- `aria-current="page"` on active nav item
- `aria-label` on Settings icon buttons
- All hardcoded colors → CSS vars

## Commits (in order)

1. `feat: centralize design tokens as CSS custom properties`
2. `feat: add cn utility, shared animation variants, and a11y helpers`
3. `feat: add core UI component kit (Button, IconButton, Card, SectionTitle, Badge, Section, Input, Accordion)`
4. `feat: page sweeps — shared animations, design tokens, a11y, semantic HTML`

## Quality Improvements Summary

| Dimension | Before | After |
|-----------|--------|-------|
| Design tokens | Hardcoded `#C85C6C` in 50+ places | Centralized CSS vars |
| Animation reuse | 4x duplicated fadeUp/stagger defs | Single shared module |
| Component reuse | No shared UI components | 8 reusable components |
| Accessibility | Score ~4/10 | Score ~7/10 (aria-labels, landmarks, keyboard nav, focus rings, reduced motion) |
| Code quality | Magic numbers in Chatbot | Named STEPS constants |

## What's Still Possible (Future Work)

- Migrate remaining pages to use `Card`, `Badge`, `Button` components more extensively (currently foundation is in place but not all pages fully adopt every component)
- Add E2E tests for critical flows
- Full WCAG 2.1 AA audit with automated tooling
- Migrate inline `style={{ color: event.accentColor }}` patterns to CSS custom properties per-event
- Extract more inline data arrays to constants files
- Split large components (Chatbot 500+ lines, EventPage 600+ lines) into smaller sub-components
