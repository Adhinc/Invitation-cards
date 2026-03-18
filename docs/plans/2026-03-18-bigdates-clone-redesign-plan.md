# Invitation.AI — BigDates.ai Clone Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Pixel-perfect clone of BigDates.ai UI/UX across all 6 pages, rebranded as Invitation.AI with clean white design system.

**Architecture:** Replace the warm cream/rose design system with a clean white/neutral system matching BigDates.ai. Rewrite all 6 pages and shared components (Navbar, Footer) to match their layout, spacing, typography, and color scheme. Add Business pricing tier and 6-month plan.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, Swiper, Lucide Icons, Vite

---

### Task 1: Update Design System Tokens (index.css)

**Files:**
- Modify: `src/index.css`

**Step 1: Replace CSS custom properties and global styles**

Replace the entire `index.css` with clean BigDates-style tokens:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import "tailwindcss";

:root {
  /* Brand */
  --color-primary: #111827;
  --color-primary-hover: #1f2937;
  --color-accent: #6366f1;
  --color-accent-hover: #4f46e5;

  /* Surfaces */
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-surface-muted: #f9fafb;
  --color-surface-elevated: #ffffff;

  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Borders */
  --color-border: #e5e7eb;
  --color-border-hover: #d1d5db;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Legacy aliases */
  --primary-rose: #111827;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --bg-cream: #ffffff;
  --font-serif: 'Inter', system-ui, sans-serif;
  --font-script: 'Inter', system-ui, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.6;
}

h1, h2, h3, .serif {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.script {
  font-family: var(--font-sans);
  font-style: italic;
}

.glass-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
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
  padding: 12px 28px;
  border-radius: var(--radius-full);
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-premium:hover {
  background: var(--color-primary-hover);
}

.text-gradient {
  color: var(--color-text-primary);
  font-weight: 800;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #bbb; }

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

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

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify dev server compiles**

Run: `cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: replace design system with clean BigDates.ai tokens — Inter font, white bg, neutral palette"
```

---

### Task 2: Update Constants — Add Business Tier, 6-Month Plan, Remove Promo

**Files:**
- Modify: `src/constants/events.ts`

**Step 1: Update pricing plans and remove promo codes**

Replace the `PROMO_CODES` and `PRICING_PLANS` exports:

```typescript
export const PRICING_PLANS = [
  { id: '1month', label: '1 Month', price: 99, duration: 30, preferred: false },
  { id: '3months', label: '3 Months', price: 199, duration: 90, preferred: true },
  { id: '6months', label: '6 Months', price: 399, duration: 180, preferred: false },
  { id: '1year', label: '1 Year', price: 499, duration: 365, preferred: false },
];

export interface BusinessPlan {
  registrationFee: number;
  domain: string;
  features: string[];
}

export const BUSINESS_PLAN: BusinessPlan = {
  registrationFee: 1000,
  domain: 'events.yourdomain.com',
  features: [
    'Postpaid plan — pay per invitation',
    'All invitations under your branding',
    'Catalog management',
    'Ad-free invitations',
    'Dedicated customer support',
  ],
};
```

Remove the `PROMO_CODES` export entirely.

**Step 2: Commit**

```bash
git add src/constants/events.ts
git commit -m "feat: add Business tier, 6-month plan, remove promo codes"
```

---

### Task 3: Update UI Button Component

**Files:**
- Modify: `src/components/ui/Button.tsx`

**Step 1: Update button variants and sizes to match BigDates clean style**

Replace `VARIANT_CLASSES`:

```typescript
const VARIANT_CLASSES = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  outline: 'bg-transparent border border-[var(--color-border)] text-gray-700 hover:border-gray-400 hover:text-gray-900',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
} as const;
```

Replace `SIZE_CLASSES`:

```typescript
const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-sm rounded-lg gap-2',
  xl: 'h-14 px-8 text-base rounded-lg gap-2.5',
} as const;
```

**Step 2: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat: update Button to clean BigDates style — no glow, rounded-lg, accent variant"
```

---

### Task 4: Rewrite Navbar — Invitation.AI Branding

**Files:**
- Modify: `src/components/Navbar.tsx`

**Step 1: Rewrite with BigDates-style layout**

Full rewrite of Navbar.tsx with: Invitation.AI brand, clean white nav, event links center, Create + Login right, mobile hamburger.

```tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

const NAV_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''} border-b border-gray-100`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Invitation.AI
            </span>
          </Link>

          {/* Desktop Nav — Event Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                aria-current={isActive(event.urlPath) ? 'page' : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(event.urlPath)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {event.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right — Create + Login */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/events/wedding"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Website
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(event.urlPath) ? 'page' : undefined}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(event.urlPath)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {event.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-medium text-gray-600 text-center hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/events/wedding"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg text-center hover:bg-gray-800"
                >
                  Create Website
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: rewrite Navbar — Invitation.AI branding, clean BigDates layout"
```

---

### Task 5: Rewrite Footer — Invitation.AI Branding

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Rewrite with BigDates-style footer**

```tsx
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { EVENTS } from '../constants/events';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <span className="text-gray-900 text-xs font-bold">I</span>
              </div>
              <span className="text-base font-bold text-white">Invitation.AI</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-[240px]">
              Create beautiful digital invitation websites for every celebration. Trusted by 10,000+ families.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Events</h4>
            <ul className="space-y-2.5">
              {EVENTS.slice(0, 5).map(ev => (
                <li key={ev.slug}>
                  <Link to={ev.urlPath} className="text-sm hover:text-white transition-colors">
                    {ev.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Events */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">More</h4>
            <ul className="space-y-2.5">
              {EVENTS.slice(5).map(ev => (
                <li key={ev.slug}>
                  <Link to={ev.urlPath} className="text-sm hover:text-white transition-colors">
                    {ev.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/pricing" className="text-sm hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact Us'].map(label => (
                <li key={label}>
                  <span className="text-sm cursor-not-allowed">{label}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-600 mt-6 leading-relaxed">
              INVITATION.AI SOFTWARES<br />
              Kerala, India
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Invitation.AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-600 cursor-not-allowed">Privacy</span>
            <span className="text-xs text-gray-600 cursor-not-allowed">Terms</span>
            <span className="text-xs text-gray-600 cursor-not-allowed">Refund</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer — Invitation.AI branding, social icons, BigDates layout"
```

---

### Task 6: Rewrite Homepage

**Files:**
- Modify: `src/pages/Home.tsx`

**Step 1: Full rewrite of Home.tsx**

Complete rewrite matching BigDates.ai homepage sections: Hero (bold headline, 41k stat, CTA), Gallery carousel, Event category grid, 3-step How It Works, WhatsApp mockup section, QR code section, 6 "Why Choose" cards, Testimonials, Stats bar, Pricing preview, Final CTA.

Key changes:
- Remove cream/rose gradient hero → clean white hero with dark text
- Headline: "Create beautiful invitations for your special moments"
- Subtitle: "Weddings, birthdays, and celebrations deserve to be remembered..."
- CTA: "Create Website" (dark bg button)
- Stat: "41,000+ Trusted Worldwide"
- Remove "SAVE10" promo badge
- Remove rose-colored accents → neutral/dark
- "Why Choose Invitation.AI" instead of "Why Go Digital?"
- 6 benefit cards (not 8): More Than an Invite, Effortless to Create, One Simple Link, Personal by Design, Always Accessible, Trusted by Thousands
- Stats bar: dark/gray background instead of rose
- Pricing section shows 3 plans (remove detailed 4-plan view — that's pricing page)

This is a full page rewrite — see the complete code in the implementation.

**Step 2: Verify page renders**

Run dev server and check http://localhost:3003/

**Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: rewrite Homepage — BigDates.ai clone layout, clean white design"
```

---

### Task 7: Rewrite Event Pages

**Files:**
- Modify: `src/pages/EventPage.tsx`

**Step 1: Rewrite EventPage with BigDates event page structure**

Key changes:
- Clean hero with event accent color as subtle gradient
- Remove serif fonts → Inter headings
- Template showcase carousel section
- Paper vs Digital comparison table
- 6 feature cards in clean grid
- 4-step How It Works
- Event testimonials
- Stats bar (starting price, templates, guests served)
- 3-tier pricing
- Limited offer countdown banner
- Clean CTA

**Step 2: Verify with http://localhost:3003/events/wedding**

**Step 3: Commit**

```bash
git add src/pages/EventPage.tsx
git commit -m "feat: rewrite EventPage — BigDates.ai event page clone"
```

---

### Task 8: Rewrite Pricing Page — Individual + Business

**Files:**
- Modify: `src/pages/PricingPage.tsx`

**Step 1: Rewrite with BigDates two-tier pricing layout**

Key changes:
- Remove promo code section entirely
- Remove SAVE10 banner
- Add Free tier card
- Individual plan: 4 pricing tiers (1mo, 3mo, 6mo, 1yr) in single card
- Business plan card: ₹1000 lifetime registration + per-invitation features
- Trust section
- FAQ accordion

**Step 2: Verify with http://localhost:3003/pricing**

**Step 3: Commit**

```bash
git add src/pages/PricingPage.tsx
git commit -m "feat: rewrite PricingPage — Individual + Business tiers, no promo codes"
```

---

### Task 9: Restyle Chatbot Page

**Files:**
- Modify: `src/components/Chatbot.tsx`
- Modify: `src/pages/ChatbotPage.tsx`

**Step 1: Update chatbot styling**

Key changes:
- Bot messages: light gray background (`bg-gray-50`), no colored border
- User messages: dark background (`bg-gray-900 text-white`)
- Choice chips: white bg, gray border, no rose coloring
- Input field: clean border style
- Typing indicator: gray dots
- Remove all rose/cream color references
- Keep all logic and flow identical

**Step 2: Verify chatbot flow works**

**Step 3: Commit**

```bash
git add src/components/Chatbot.tsx src/pages/ChatbotPage.tsx
git commit -m "feat: restyle Chatbot — neutral gray/white theme, no rose accents"
```

---

### Task 10: Restyle Preview Page

**Files:**
- Modify: `src/pages/PreviewPage.tsx`
- Modify: `src/components/CountdownTimer.tsx`
- Modify: `src/components/CinematicGallery.tsx`
- Modify: `src/components/Shagun.tsx`
- Modify: `src/components/VenueMap.tsx`

**Step 1: Update PreviewPage styling**

Key changes:
- Upgrade banner: clean gray-900 bg, white text
- Remove rose accents → use event accent color or neutral dark
- Countdown: clean white cards, dark numbers
- Gallery: remove rose gradients
- Floating bar: dark bg buttons
- Action buttons: clean outlined style

**Step 2: Update sub-components to match neutral palette**

CountdownTimer, CinematicGallery, Shagun, VenueMap — replace any rose/cream references.

**Step 3: Commit**

```bash
git add src/pages/PreviewPage.tsx src/components/CountdownTimer.tsx src/components/CinematicGallery.tsx src/components/Shagun.tsx src/components/VenueMap.tsx
git commit -m "feat: restyle PreviewPage + sub-components — neutral palette, clean cards"
```

---

### Task 11: Restyle Dashboard Page

**Files:**
- Modify: `src/components/Dashboard.tsx`
- Modify: `src/pages/DashboardPage.tsx`

**Step 1: Update Dashboard styling**

Key changes:
- Sidebar: white bg, gray borders, no rose accents
- Active nav: dark bg (`bg-gray-900 text-white`)
- Stats cards: clean white with subtle borders
- Invitation cards: white bg, gray border
- Upgrade card: dark bg instead of rose
- WhatsApp FAB: green bg (keep WhatsApp color)
- Brand references: "Invitation.AI"

**Step 2: Commit**

```bash
git add src/components/Dashboard.tsx src/pages/DashboardPage.tsx
git commit -m "feat: restyle Dashboard — clean neutral theme, Invitation.AI branding"
```

---

### Task 12: Restyle Template Selection Page

**Files:**
- Modify: `src/pages/TemplatePage.tsx`

**Step 1: Update template page styling**

Key changes:
- Selected template: dark checkmark overlay instead of rose
- Action bar: dark bg buttons
- Card hover: neutral shadow
- Remove any rose color references

**Step 2: Commit**

```bash
git add src/pages/TemplatePage.tsx
git commit -m "feat: restyle TemplatePage — neutral selection style, dark accents"
```

---

### Task 13: Update Remaining UI Components

**Files:**
- Modify: `src/components/ui/Card.tsx`
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/components/ui/Section.tsx`
- Modify: `src/components/ui/SectionTitle.tsx`
- Modify: `src/components/ui/Accordion.tsx`
- Modify: `src/components/ui/Input.tsx`

**Step 1: Update Card, Badge, Section, SectionTitle, Accordion, Input**

- Card: remove glow shadow, use clean border + hover shadow
- Badge: `premium` variant → dark bg instead of rose
- Section: `muted` bg → `#f9fafb`
- SectionTitle: remove serif → clean sans heading
- Accordion: remove rose accent → gray/dark
- Input: remove rose focus → accent blue focus

**Step 2: Commit**

```bash
git add src/components/ui/
git commit -m "feat: update UI component kit — neutral BigDates palette across all components"
```

---

### Task 14: Full Build Verification & Polish

**Files:**
- All modified files

**Step 1: Run full build**

```bash
cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npx vite build
```

Expected: Build succeeds with no errors.

**Step 2: Manual verification checklist**

- [ ] Homepage renders clean white design
- [ ] Navbar shows "Invitation.AI" with dark theme
- [ ] Footer shows "Invitation.AI" with social icons
- [ ] Event pages render with accent colors on white bg
- [ ] Pricing shows Individual + Business cards
- [ ] Chatbot has neutral color scheme
- [ ] Preview page renders clean
- [ ] Dashboard renders clean
- [ ] Template page renders clean
- [ ] No rose/cream colors visible anywhere
- [ ] Mobile responsive on all pages

**Step 3: Fix any TypeScript or build errors**

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete BigDates.ai clone redesign — all 6 pages, Invitation.AI branding"
```
