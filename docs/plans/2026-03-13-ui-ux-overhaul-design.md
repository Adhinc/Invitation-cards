# UI/UX Overhaul Design — Invitation Card Platform

**Date:** 2026-03-13
**Approach:** Hybrid — Foundation Layer + Page Sweeps
**Dependencies:** None new. Uses existing Tailwind, Framer Motion, Lucide.

---

## 1. Design Tokens (CSS Variables)

Centralize all hardcoded values in `index.css`:

### Colors
- `--color-primary`: #C85C6C (brand rose)
- `--color-primary-hover`: #b34d5c (darker)
- `--color-primary-light`: #C85C6C1A (10% opacity)
- `--color-surface`: #ffffff
- `--color-surface-elevated`: #ffffff
- `--color-text-primary`: #111827 (gray-900)
- `--color-text-secondary`: #4b5563 (gray-600)
- `--color-text-muted`: #9ca3af (gray-400)
- `--color-border`: #e5e7eb (gray-200)
- `--color-success`: #10b981 (emerald-500)
- `--color-warning`: #f59e0b (amber-500)
- `--color-error`: #ef4444 (red-500)

### Shadows
- `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
- `--shadow-md`: 0 4px 6px -1px rgba(0,0,0,0.1)
- `--shadow-lg`: 0 10px 15px -3px rgba(0,0,0,0.1)

### Transitions
- `--transition-fast`: 150ms ease
- `--transition-normal`: 300ms ease

### Typography
- `--font-heading`: existing serif stack
- `--font-body`: existing sans stack

### Focus
- Standardized focus-visible ring: 2px offset, `--color-primary`

---

## 2. Utilities

### `src/utils/cn.ts`
Class merging utility — filters falsy values and joins.

### `src/utils/animations.ts`
Shared Framer Motion variants replacing duplicated objects across pages:
- `fadeUp` — y:20 to y:0 + opacity
- `fadeIn` — opacity only
- `scaleIn` — scale 0.95 to 1 + opacity
- `stagger` — parent with staggerChildren
- `slideInLeft` / `slideInRight` — horizontal entrances
- All wrapped to respect `prefers-reduced-motion`

### `src/utils/accessibility.ts`
- `srOnly` class string constant
- Live region announcement helper

---

## 3. Core Component Kit

All in `src/components/ui/`. All use `forwardRef`, accept `className`, include focus-visible styling.

### Button
- Variants: `primary`, `secondary`, `ghost`, `outline`
- Sizes: `sm`, `md`, `lg`
- Props: `isLoading`, `leftIcon`, `rightIcon`, `disabled`

### IconButton
- For icon-only actions. Requires `aria-label`.
- Variants: `ghost`, `outline`

### Card
- Compound: `Card`, `Card.Header`, `Card.Body`, `Card.Footer`
- Variants: `default`, `glass`, `elevated`

### SectionTitle
- Props: `title`, `subtitle`, `align`
- Renders h2 + subtitle + decorative divider

### Badge
- Variants: `success`, `warning`, `error`, `info`, `premium`

### Input
- Wraps `<input>` with `<label>`, error state, `aria-describedby`

### Accordion
- Compound: `Accordion`, `Accordion.Item`
- `aria-expanded`, keyboard support (Enter/Space, arrow keys)

### Section
- Semantic `<section>` with consistent max-width, padding, `aria-labelledby`

---

## 4. Page Sweeps

### Home.tsx
- Extract inline data to constants
- Replace patterns with Card, SectionTitle, Section
- Add semantic landmarks
- Replace hardcoded colors with CSS vars

### EventPage.tsx
- Split into sub-components (HeroSection, FeaturesSection, TestimonialsSection, PricingSection)
- Use Card, Badge, SectionTitle
- Replace div comparison table with semantic `<table>`

### Chatbot.tsx
- aria-live="polite" for bot messages
- Proper `<label>` on input
- Named step constants replacing magic numbers
- IconButton for actions

### PreviewPage.tsx
- Card for content sections
- aria-label on icon buttons
- Button component for CTAs
- CSS vars for colors

### PricingPage.tsx
- Card for pricing tiers, Badge for "Most Popular"
- Accordion for FAQ
- Input component for promo code

### Dashboard.tsx
- `<nav>` landmark for sidebar
- Badge for status labels
- Card for stat/invitation cards
- aria-current="page" on active nav

### Navbar.tsx
- aria-current="page" on active links
- Focus trap in mobile menu
- Escape key to close

### Footer.tsx
- Verify color contrast
- Proper `<footer>` landmark

### MainLayout.tsx
- Skip-to-content link
- `<main id="main-content">` landmark

---

## 5. Final Polish
- `prefers-reduced-motion` support across all animations
- Cross-cutting accessibility audit
- Consistent spacing verification
