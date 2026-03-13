# UI/UX Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Centralize design tokens, create a reusable component kit, and refactor all pages for consistency, accessibility, and visual polish — using only existing dependencies (Tailwind, Framer Motion, Lucide).

**Architecture:** Foundation-first approach — CSS variables and shared utilities first, then a component kit in `src/components/ui/`, then page-by-page sweeps that adopt the new components. Each page sweep replaces hardcoded values with tokens, swaps duplicated patterns for shared components, and adds ARIA/semantic HTML.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, Vite

---

### Task 1: Design Tokens & CSS Variables

**Files:**
- Modify: `src/index.css`

**Step 1: Update CSS custom properties in `:root`**

Replace the existing `:root` block and add focus/shadow/transition tokens:

```css
:root {
  /* Brand */
  --color-primary: #C85C6C;
  --color-primary-hover: #b34d5c;
  --color-primary-light: rgba(200, 92, 108, 0.1);

  /* Surfaces */
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-bg: #FFF9F5;

  /* Text */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Borders */
  --color-border: #f0f0f0;
  --color-border-hover: #e5e7eb;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;

  /* Typography */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-script: 'Great Vibes', cursive;
}
```

**Step 2: Add global focus-visible style**

Add after the scrollbar styles:

```css
/* Focus ring */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 3: Update `.btn-premium` and `.glass-card` to use tokens**

```css
.glass-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.glass-card:hover {
  box-shadow: var(--shadow-md);
}

.btn-premium {
  background: var(--color-primary);
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(200, 92, 108, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-premium:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(200, 92, 108, 0.3);
  background: var(--color-primary-hover);
}
```

**Step 4: Verify the build compiles**

Run: `cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npm run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat: centralize design tokens as CSS custom properties"
```

---

### Task 2: Utility Functions (cn, animations, accessibility)

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/utils/animations.ts`
- Create: `src/utils/accessibility.ts`

**Step 1: Create `src/utils/cn.ts`**

```ts
/**
 * Merges class names, filtering out falsy values.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**Step 2: Create `src/utils/animations.ts`**

```ts
import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};
```

**Step 3: Create `src/utils/accessibility.ts`**

```ts
/** Tailwind class string for screen-reader-only elements */
export const srOnly = 'sr-only';

/**
 * Creates a visually hidden live region announcement.
 * Append the returned element to the DOM; remove after ~1s.
 */
export function announceToScreenReader(message: string): void {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.className = 'sr-only';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/cn.ts src/utils/animations.ts src/utils/accessibility.ts
git commit -m "feat: add cn utility, shared animation variants, and a11y helpers"
```

---

### Task 3: Core Component Kit — Button & IconButton

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/IconButton.tsx`

**Step 1: Create `src/components/ui/Button.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  outline:
    'bg-transparent border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
} as const;

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-5 text-sm rounded-full gap-2',
  lg: 'h-12 px-8 text-base rounded-full gap-2.5',
} as const;

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  ),
);
Button.displayName = 'Button';
```

**Step 2: Create `src/components/ui/IconButton.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900',
  outline:
    'bg-transparent border border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
} as const;

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  'aria-label': string; // required
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', icon, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  ),
);
IconButton.displayName = 'IconButton';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/IconButton.tsx
git commit -m "feat: add Button and IconButton components"
```

---

### Task 4: Core Component Kit — Card (Compound)

**Files:**
- Create: `src/components/ui/Card.tsx`

**Step 1: Create `src/components/ui/Card.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-white border border-gray-100',
  glass: 'bg-white/80 backdrop-blur border border-[var(--color-border)]',
  elevated: 'bg-white border border-gray-100 shadow-lg',
} as const;

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: keyof typeof VARIANT_CLASSES;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl overflow-hidden transition-shadow duration-200',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  ),
);
CardRoot.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pt-5 pb-0', className)} {...props} />
  ),
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-4', className)} {...props} />
  ),
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 pb-5 pt-0 border-t border-gray-100', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
```

**Step 2: Verify build**

Run: `npm run build`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ui/Card.tsx
git commit -m "feat: add Card compound component"
```

---

### Task 5: Core Component Kit — SectionTitle, Badge, Section

**Files:**
- Create: `src/components/ui/SectionTitle.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Section.tsx`

**Step 1: Create `src/components/ui/SectionTitle.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUp } from '../../utils/animations';

interface SectionTitleProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  /** Accent color for the decorative divider. Defaults to --color-primary */
  accentColor?: string;
}

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, align = 'center', accentColor, ...props }, ref) => {
    const id = useId();
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        className={cn(
          'mb-12',
          align === 'center' && 'text-center',
          className,
        )}
        {...props}
      >
        <h2 id={id} className="text-2xl sm:text-3xl md:text-4xl font-bold serif">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div
          className="mt-4 mx-auto w-16 h-1 rounded-full"
          style={{ background: accentColor || 'var(--color-primary)' }}
        />
      </motion.div>
    );
  },
);
SectionTitle.displayName = 'SectionTitle';
```

**Step 2: Create `src/components/ui/Badge.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  premium: 'bg-[var(--color-primary)] text-white',
} as const;

interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: keyof typeof VARIANT_CLASSES;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'info', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
```

**Step 3: Create `src/components/ui/Section.tsx`**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { stagger } from '../../utils/animations';

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** Used for aria-labelledby if provided */
  label?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, label, children, ...props }, ref) => {
    const id = useId();
    return (
      <motion.section
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className={cn('max-w-5xl mx-auto px-5 py-16 md:py-24', className)}
        aria-labelledby={label ? id : undefined}
        {...props}
      >
        {label && <span id={id} className="sr-only">{label}</span>}
        {children}
      </motion.section>
    );
  },
);
Section.displayName = 'Section';
```

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/ui/SectionTitle.tsx src/components/ui/Badge.tsx src/components/ui/Section.tsx
git commit -m "feat: add SectionTitle, Badge, and Section components"
```

---

### Task 6: Core Component Kit — Input & Accordion

**Files:**
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Accordion.tsx`

**Step 1: Create `src/components/ui/Input.tsx`**

```tsx
import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  /** Visually hide label (still available to screen readers) */
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hideLabel, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp || generatedId;
    const errorId = `${id}-error`;

    return (
      <div>
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium text-[var(--color-text-primary)] mb-1.5',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 rounded-full border bg-[var(--color-surface)] text-sm outline-none transition-all',
            error
              ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-200'
              : 'border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)]',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
```

**Step 2: Create `src/components/ui/Accordion.tsx`**

```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

// Context
interface AccordionContextValue {
  openItem: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.Item must be used within Accordion');
  return ctx;
}

// Root
interface AccordionProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: string;
}

function AccordionRoot({ children, className, defaultOpen }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen ?? null);

  const toggle = useCallback((id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  }, []);

  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className={cn('space-y-3', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

// Item
interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

function AccordionItem({ id, title, children, className }: AccordionItemProps) {
  const { openItem, toggle } = useAccordionContext();
  const isOpen = openItem === id;

  return (
    <div
      className={cn(
        'border border-[var(--color-border)] rounded-2xl overflow-hidden',
        className,
      )}
    >
      <button
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="region"
          >
            <div className="px-6 pb-4 text-[var(--color-text-secondary)] text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
```

**Step 3: Create barrel export `src/components/ui/index.ts`**

```ts
export { Button } from './Button';
export { IconButton } from './IconButton';
export { Card } from './Card';
export { SectionTitle } from './SectionTitle';
export { Badge } from './Badge';
export { Section } from './Section';
export { Input } from './Input';
export { Accordion } from './Accordion';
```

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Input, Accordion components and barrel export"
```

---

### Task 7: Page Sweep — MainLayout, Navbar, Footer

**Files:**
- Modify: `src/layouts/MainLayout.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

**Step 1: Add skip-to-content link and semantic landmarks to MainLayout**

Replace `MainLayout.tsx` content:

```tsx
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const hideNavFooter = ['/chatbot', '/preview'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      {!hideNavFooter && <Navbar />}
      <main id="main-content" className={!hideNavFooter ? 'pt-16' : ''}>
        <Outlet />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}
```

**Step 2: Update Navbar with aria-current, focus trap, Escape key**

In `Navbar.tsx`, make these changes:

1. Replace all `#C85C6C` hardcoded references with `var(--color-primary)` / `var(--color-primary-hover)` via Tailwind arbitrary values: `bg-[var(--color-primary)]`, `text-[var(--color-primary)]`, `hover:bg-[var(--color-primary-hover)]`.

2. Add `aria-current="page"` to active links:
```tsx
aria-current={isActive(event.urlPath) ? 'page' : undefined}
```

3. Add Escape key handler and focus trap to mobile menu:
```tsx
// Add useEffect for Escape key
useEffect(() => {
  if (!mobileOpen) return;
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setMobileOpen(false);
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [mobileOpen]);
```

4. Add `role="navigation"` and `aria-label="Main navigation"` to the `<nav>`.

**Step 3: Update Footer with proper semantic structure**

The Footer already uses `<footer>`. Ensure text colors have adequate contrast:
- Change `text-gray-500` on description to `text-gray-400` (lighter on dark = fine)
- Change `text-gray-600` on disabled links to `text-gray-500` for better contrast on `bg-gray-900`

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/layouts/MainLayout.tsx src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: add skip-to-content, aria-current, escape-to-close, semantic landmarks"
```

---

### Task 8: Page Sweep — Home.tsx

**Files:**
- Modify: `src/pages/Home.tsx`

**Step 1: Replace local animation defs with shared imports**

Remove local `fadeUp` and `stagger` constants. Add at top:
```tsx
import { fadeUp, stagger } from '../utils/animations';
```

**Step 2: Replace hardcoded color strings**

Replace all instances of:
- `'#C85C6C'` → `'var(--color-primary)'`
- `'#b34d5c'` → `'var(--color-primary-hover)'`
- `bg-[#C85C6C]` → `bg-[var(--color-primary)]`
- `text-[#C85C6C]` → `text-[var(--color-primary)]`
- `text-[var(--primary-rose)]` → `text-[var(--color-primary)]`
- `bg-[var(--primary-rose)]` → `bg-[var(--color-primary)]`

**Step 3: Use Section component for major sections**

Import `Section` from `../components/ui` and wrap each `<section>` block with it where appropriate, or at minimum use the `SectionTitle` component for the repeated h2 + subtitle + divider pattern.

**Step 4: Add semantic roles**

Wrap the hero in a `<header>` tag (semantic, not visual). Add `aria-label` to the carousel section.

**Step 5: Verify build and visual regression**

Run: `npm run build && npm run dev`
Expected: Build passes. Visually identical with tokens.

**Step 6: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: Home page — shared animations, design tokens, semantic HTML"
```

---

### Task 9: Page Sweep — EventPage.tsx

**Files:**
- Modify: `src/pages/EventPage.tsx`

**Step 1: Replace local animation defs with shared imports**

Remove local `fadeUp` and `stagger`. Import from `../utils/animations`.

**Step 2: Replace local `Section` and `SectionTitle` with shared components**

Import from `../components/ui`. The EventPage has its own `Section` and `SectionTitle` — replace them with the shared versions. The shared `SectionTitle` accepts `accentColor` prop, which maps to what EventPage already passes as `color`.

**Step 3: Replace PaperVsDigital div grid with semantic `<table>`**

```tsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-gray-100">
      <th className="py-3 text-left pl-4 font-semibold" scope="col">Feature</th>
      <th className="py-3 text-center font-semibold text-gray-400" scope="col">Paper</th>
      <th className="py-3 text-center font-semibold text-white rounded-t-lg" style={{ background: event.accentColor }} scope="col">Digital</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((r) => (
      <tr key={r.label} className="border-b border-gray-50 last:border-0">
        <td className="py-3 pl-4 text-gray-600">{r.label}</td>
        <td className="py-3 text-center">...</td>
        <td className="py-3 text-center">...</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/EventPage.tsx
git commit -m "feat: EventPage — shared components, semantic table, design tokens"
```

---

### Task 10: Page Sweep — Chatbot.tsx

**Files:**
- Modify: `src/components/Chatbot.tsx`

**Step 1: Add named step constants**

Replace magic numbers with named constants at top of file:

```tsx
const STEPS = {
  EVENT_TYPE: 0,
  PERSON1_NAME: 1,
  PERSON1_IMAGE: 2,
  PERSON2_NAME: 3,
  PERSON2_IMAGE: 4,
  VIEW_PRIORITY: 5,
  PARENTS_QUESTION: 6,
  PARENTS_FLOW_START: 7,
  PARENTS_GROOM_MOTHER: 8,
  PARENTS_BRIDE_FATHER: 9,
  PARENTS_BRIDE_MOTHER: 10,
  DATE: 11,
  TIME: 12,
  ADDRESS: 13,
} as const;
```

Then replace `case 0:` with `case STEPS.EVENT_TYPE:`, etc.

**Step 2: Add aria-live to bot messages**

Add `aria-live="polite"` to the messages container:
```tsx
<div className="space-y-8 pb-10" aria-live="polite" aria-relevant="additions">
```

**Step 3: Add label to input field**

Replace the input with a labeled version:
```tsx
<label htmlFor="chat-input" className="sr-only">Type your message</label>
<input
  id="chat-input"
  type="text"
  ...
/>
```

**Step 4: Replace hardcoded colors with CSS vars**

Replace `#C85C6C` → `var(--color-primary)`, `#EBBAB9` → `var(--color-primary-light)`.

**Step 5: Verify build**

Run: `npm run build`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Chatbot.tsx
git commit -m "feat: Chatbot — named steps, aria-live, input label, design tokens"
```

---

### Task 11: Page Sweep — PreviewPage.tsx

**Files:**
- Modify: `src/pages/PreviewPage.tsx`

**Step 1: Replace hardcoded colors with CSS vars**

Replace all `#C85C6C` → `var(--color-primary)`.

**Step 2: Add aria-label to action buttons**

Each of the 4 action buttons (RSVP, Calendar, Directions, WhatsApp) should have explicit `aria-label`:
```tsx
aria-label={rsvpStatus === 'attending' ? 'Cancel RSVP' : 'RSVP to event'}
aria-label="Add event to calendar"
aria-label="Get directions to venue"
aria-label="Share on WhatsApp"
```

**Step 3: Add aria-label to banner dismiss button**

Already has `aria-label="Dismiss banner"` — good. Verify it's present.

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/PreviewPage.tsx
git commit -m "feat: PreviewPage — design tokens, aria-labels on action buttons"
```

---

### Task 12: Page Sweep — PricingPage.tsx

**Files:**
- Modify: `src/pages/PricingPage.tsx`

**Step 1: Replace local animations with shared imports**

Remove local `fadeUp` and `stagger`. Import from `../utils/animations`.

**Step 2: Replace FAQ section with Accordion component**

```tsx
import { Accordion } from '../components/ui';

// Replace the FAQ div with:
<Accordion>
  {FAQ.map((item, idx) => (
    <Accordion.Item key={idx} id={`faq-${idx}`} title={item.q}>
      {item.a}
    </Accordion.Item>
  ))}
</Accordion>
```

**Step 3: Replace promo code input with Input component**

```tsx
import { Input } from '../components/ui';

<Input
  label="Promo code"
  hideLabel
  value={promoInput}
  onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
  placeholder="Enter code"
  error={promoError || undefined}
/>
```

**Step 4: Add Badge for "Most Popular"**

```tsx
import { Badge } from '../components/ui';

// Replace the "Most Popular" span with:
<Badge variant="premium">Most Popular</Badge>
```

**Step 5: Verify build**

Run: `npm run build`
Expected: PASS

**Step 6: Commit**

```bash
git add src/pages/PricingPage.tsx
git commit -m "feat: PricingPage — Accordion, Input, Badge, shared animations"
```

---

### Task 13: Page Sweep — Dashboard.tsx

**Files:**
- Modify: `src/components/Dashboard.tsx`

**Step 1: Add `<nav>` landmark to sidebar navigation**

Wrap the sidebar nav buttons in `<nav aria-label="Dashboard navigation">`.

**Step 2: Add aria-current to active nav item**

```tsx
aria-current={item === 'Overview' ? 'page' : undefined}
```

**Step 3: Replace hardcoded `#C85C6C` with CSS vars**

Replace all instances throughout the file.

**Step 4: Add Badge for invitation status**

Import `Badge` from `../components/ui` and replace the status text:
```tsx
<Badge variant={inv.status === 'ACTIVE' ? 'success' : 'error'}>
  {inv.status}
</Badge>
```

**Step 5: Add aria-label to Settings icon button**

```tsx
aria-label={`Settings for ${inv.names}`}
```

**Step 6: Verify build**

Run: `npm run build`
Expected: PASS

**Step 7: Commit**

```bash
git add src/components/Dashboard.tsx
git commit -m "feat: Dashboard — nav landmark, aria-current, Badge, design tokens"
```

---

### Task 14: Final Polish & Accessibility Audit

**Files:**
- Verify: all modified files

**Step 1: Run build to ensure no regressions**

Run: `npm run build`
Expected: PASS with zero errors.

**Step 2: Verify prefers-reduced-motion**

Confirm the `@media (prefers-reduced-motion: reduce)` block is in `index.css` (added in Task 1). This disables all animations for users who prefer reduced motion.

**Step 3: Run the dev server and verify visually**

Run: `npm run dev`
Expected: All pages render correctly with consistent tokens and components.

**Step 4: Spot-check accessibility**

Verify in browser:
- Tab through Navbar — focus ring visible on all links
- Tab through pricing cards and FAQ accordion — keyboard-navigable
- Skip-to-content link appears on Tab from top of page
- Active nav links show `aria-current="page"` in inspector
- Chatbot input has associated label

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: final polish — verify build, a11y audit, prefers-reduced-motion"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1 | Design tokens in CSS | — |
| 2 | Utility functions | Task 1 |
| 3 | Button & IconButton | Task 2 |
| 4 | Card component | Task 2 |
| 5 | SectionTitle, Badge, Section | Task 2 |
| 6 | Input, Accordion, barrel export | Task 2 |
| 7 | MainLayout, Navbar, Footer | Task 3-6 |
| 8 | Home page sweep | Task 3-6 |
| 9 | EventPage sweep | Task 3-6 |
| 10 | Chatbot sweep | Task 2 |
| 11 | PreviewPage sweep | Task 2 |
| 12 | PricingPage sweep | Task 3-6 |
| 13 | Dashboard sweep | Task 3-6 |
| 14 | Final polish & a11y audit | Task 7-13 |
