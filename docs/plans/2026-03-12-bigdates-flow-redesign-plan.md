# BigDates Flow Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the invitation platform to match BigDates.ai's flow: Landing → Event Page → Chatbot → Template Selection → Preview (free) → Pricing/Checkout, with duration-based pricing.

**Architecture:** Install react-router-dom for client-side routing. Convert the single-component App.tsx into a multi-page app with shared layout (Navbar/Footer). Event config and color system centralized in a constants file. State flows via URL params + React context.

**Tech Stack:** React 19, react-router-dom v7, Vite 7.3, Tailwind CSS 4, Framer Motion 12, Swiper 12, Lucide React

---

## Task 0: Install react-router-dom and set up routing shell

**Files:**
- Modify: `package.json`
- Rewrite: `src/main.tsx`
- Create: `src/router.tsx`
- Create: `src/layouts/MainLayout.tsx`

**Step 1: Install react-router-dom**

Run: `cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npm install react-router-dom`

**Step 2: Create router.tsx**

```tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', lazy: () => import('./pages/Home') },
      { path: '/create-your-:eventSlug-website', lazy: () => import('./pages/EventPage') },
      { path: '/chatbot', lazy: () => import('./pages/ChatbotPage') },
      { path: '/templates', lazy: () => import('./pages/TemplatePage') },
      { path: '/preview', lazy: () => import('./pages/PreviewPage') },
      { path: '/pricing', lazy: () => import('./pages/PricingPage') },
      { path: '/dashboard', lazy: () => import('./pages/DashboardPage') },
    ],
  },
]);

export default router;
```

**Step 3: Create MainLayout.tsx (minimal shell)**

```tsx
// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] font-sans">
      {/* Navbar and Footer added in Task 1 */}
      <Outlet />
    </div>
  );
}
```

**Step 4: Update main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

**Step 5: Create placeholder pages so router doesn't crash**

Create these minimal files so the app compiles:
- `src/pages/Home.tsx` — `export function Component() { return <div>Home</div>; }`
- `src/pages/EventPage.tsx` — same pattern
- `src/pages/ChatbotPage.tsx` — same pattern
- `src/pages/TemplatePage.tsx` — same pattern
- `src/pages/PreviewPage.tsx` — same pattern
- `src/pages/PricingPage.tsx` — same pattern
- `src/pages/DashboardPage.tsx` — same pattern

**Step 6: Verify app compiles**

Run: `cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: install react-router-dom and set up routing shell with lazy pages"
```

---

## Task 1: Create constants file and shared Navbar component

**Files:**
- Create: `src/constants/events.ts`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/layouts/MainLayout.tsx`

**Step 1: Create event constants**

```ts
// src/constants/events.ts
export type EventType = 'wedding' | 'betrothal' | 'birthday' | 'baptism' | 'holy_communion' | 'naming_ceremony' | 'baby_shower' | 'housewarming';

export interface EventConfig {
  type: EventType;
  label: string;
  slug: string;           // URL slug: "wedding", "birthday", etc.
  urlPath: string;        // Full path: "/create-your-wedding-website"
  accentColor: string;
  person1Label: string;
  person2Label?: string;
  isCoupleEvent: boolean;
  tagline: string;
  subtitle: string;
  heroTitle: string;
  socialProof: string;
  countdownLabel: string;
  footerText: string;
}

export const EVENTS: EventConfig[] = [
  {
    type: 'wedding', label: 'Wedding', slug: 'wedding',
    urlPath: '/create-your-wedding-website',
    accentColor: '#e8dbdc',
    person1Label: 'Groom', person2Label: 'Bride', isCoupleEvent: true,
    tagline: 'Together with their families',
    subtitle: 'request the pleasure of your company',
    heroTitle: 'Create Your Dream Wedding Website',
    socialProof: '12,847+ happy couples',
    countdownLabel: 'Countdown to Forever',
    footerText: "Can't wait to see you there!",
  },
  {
    type: 'betrothal', label: 'Betrothal', slug: 'betrothal',
    urlPath: '/create-your-betrothal-website',
    accentColor: '#c084fc',
    person1Label: 'Groom', person2Label: 'Bride', isCoupleEvent: true,
    tagline: 'With joy in our hearts',
    subtitle: 'we invite you to celebrate our engagement',
    heroTitle: 'Create Your Betrothal Website',
    socialProof: '3,200+ happy couples',
    countdownLabel: 'Countdown to Our Day',
    footerText: "Can't wait to celebrate with you!",
  },
  {
    type: 'birthday', label: 'Birthday', slug: 'birthday',
    urlPath: '/create-your-birthday-website',
    accentColor: '#8499dd',
    person1Label: 'Birthday Person', isCoupleEvent: false,
    tagline: "You're invited to celebrate",
    subtitle: 'a very special birthday',
    heroTitle: 'Create Your Birthday Website',
    socialProof: '8,542+ parents & party planners',
    countdownLabel: 'Countdown to the Party',
    footerText: 'Come celebrate with us!',
  },
  {
    type: 'baptism', label: 'Baptism', slug: 'baptism',
    urlPath: '/create-your-baptism-website',
    accentColor: '#57aa53',
    person1Label: 'Child', isCoupleEvent: false,
    tagline: 'With gratitude and joy',
    subtitle: 'we invite you to witness the baptism of',
    heroTitle: 'Create Your Baptism Website',
    socialProof: '4,100+ blessed families',
    countdownLabel: 'Countdown to the Ceremony',
    footerText: 'Your presence is a blessing!',
  },
  {
    type: 'holy_communion', label: 'Holy Communion', slug: 'holy-communion',
    urlPath: '/create-your-holy-communion-website',
    accentColor: '#57aa53',
    person1Label: 'Child', isCoupleEvent: false,
    tagline: 'With hearts full of faith',
    subtitle: 'we invite you to the Holy Communion of',
    heroTitle: 'Create Your Holy Communion Website',
    socialProof: '2,800+ families of faith',
    countdownLabel: 'Countdown to the Ceremony',
    footerText: 'Join us in this sacred celebration!',
  },
  {
    type: 'naming_ceremony', label: 'Naming Ceremony', slug: 'naming-ceremony',
    urlPath: '/create-your-naming-ceremony-website',
    accentColor: '#f4c542',
    person1Label: 'Baby', isCoupleEvent: false,
    tagline: 'With love and happiness',
    subtitle: 'we invite you to the naming ceremony of',
    heroTitle: 'Create Your Naming Ceremony Website',
    socialProof: '1,900+ joyful families',
    countdownLabel: 'Countdown to the Celebration',
    footerText: 'Come bless our little one!',
  },
  {
    type: 'baby_shower', label: 'Baby Shower', slug: 'baby-shower',
    urlPath: '/create-your-baby-shower-website',
    accentColor: '#f9a8d4',
    person1Label: 'Mother-to-be', isCoupleEvent: false,
    tagline: 'A little one is on the way!',
    subtitle: 'join us to shower love and blessings on',
    heroTitle: 'Create Your Baby Shower Website',
    socialProof: '2,300+ expecting families',
    countdownLabel: 'Countdown to the Shower',
    footerText: "We can't wait to celebrate!",
  },
  {
    type: 'housewarming', label: 'Housewarming', slug: 'housewarming',
    urlPath: '/create-your-housewarming-website',
    accentColor: '#f97316',
    person1Label: 'Host', isCoupleEvent: false,
    tagline: 'New home, new beginnings',
    subtitle: 'you are cordially invited to the housewarming of',
    heroTitle: 'Create Your Housewarming Website',
    socialProof: '1,500+ new homeowners',
    countdownLabel: 'Countdown to the Celebration',
    footerText: 'Come bless our new home!',
  },
];

export const getEventBySlug = (slug: string): EventConfig | undefined =>
  EVENTS.find(e => e.slug === slug);

export const getEventByType = (type: EventType): EventConfig | undefined =>
  EVENTS.find(e => e.type === type);

export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'SAVE10': { discount: 10, label: '10% OFF' },
};

export const PRICING_PLANS = [
  { id: '1month', label: '1 Month', price: 99, duration: 30, preferred: false },
  { id: '3months', label: '3 Months', price: 199, duration: 90, preferred: true },
  { id: '1year', label: '1 Year', price: 499, duration: 365, preferred: false },
];
```

**Step 2: Create Navbar component**

```tsx
// src/components/Navbar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { EVENTS } from '../constants/events';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="serif text-xl font-black text-[#C85C6C] italic flex items-center gap-2">
            <Sparkles size={20} /> BigDate
          </Link>

          {/* Desktop Nav — Event Types */}
          <div className="hidden lg:flex items-center gap-1">
            {EVENTS.filter(e => e.type !== 'betrothal').map(event => (
              <Link
                key={event.type}
                to={event.urlPath}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  location.pathname === event.urlPath
                    ? 'bg-[#C85C6C] text-white'
                    : 'text-slate-500 hover:text-[#C85C6C] hover:bg-rose-50'
                }`}
              >
                {event.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                location.pathname === '/pricing'
                  ? 'bg-[#C85C6C] text-white'
                  : 'text-slate-500 hover:text-[#C85C6C] hover:bg-rose-50'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-[#C85C6C] transition-colors">
              Login
            </button>
            <Link
              to="/"
              className="px-5 py-2 bg-[#C85C6C] text-white rounded-full text-xs font-bold shadow-lg shadow-rose-100 hover:scale-105 transition-transform"
            >
              Create
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-rose-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {EVENTS.map(event => (
                <Link
                  key={event.type}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-[#C85C6C] transition-colors"
                >
                  {event.label}
                </Link>
              ))}
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-[#C85C6C] transition-colors"
              >
                Pricing
              </Link>
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button className="flex-1 py-3 text-sm font-bold text-slate-500 border border-slate-100 rounded-xl">Login</button>
                <Link to="/" className="flex-1 py-3 bg-[#C85C6C] text-white rounded-xl text-sm font-bold text-center">Create</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

**Step 3: Create Footer component**

```tsx
// src/components/Footer.tsx
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENTS } from '../constants/events';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="serif text-2xl font-black text-[#C85C6C] italic flex items-center gap-2 mb-4">
              <Sparkles size={20} /> BigDate
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create stunning digital invitations in under 5 minutes. No design skills needed.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Events</h4>
            <div className="space-y-2">
              {EVENTS.slice(0, 5).map(e => (
                <Link key={e.type} to={e.urlPath} className="block text-sm text-slate-500 hover:text-white transition-colors">{e.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">More Events</h4>
            <div className="space-y-2">
              {EVENTS.slice(5).map(e => (
                <Link key={e.type} to={e.urlPath} className="block text-sm text-slate-500 hover:text-white transition-colors">{e.label}</Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Company</h4>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-sm text-slate-500 hover:text-white transition-colors">Pricing</Link>
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Refund Policy</a>
              <a href="mailto:info@bigdates.ai" className="block text-sm text-slate-500 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-600 text-xs">&copy; {new Date().getFullYear()} BigDate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Update MainLayout to include Navbar + Footer**

```tsx
// src/layouts/MainLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const hideNavFooter = ['/chatbot', '/preview'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] font-sans">
      {!hideNavFooter && <Navbar />}
      <main className={!hideNavFooter ? 'pt-16' : ''}>
        <Outlet />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}
```

**Step 5: Verify build**

Run: `cd /Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card && npx vite build 2>&1 | tail -5`

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add event constants, Navbar with event links, and Footer"
```

---

## Task 2: Build the Landing Page (Home)

**Files:**
- Rewrite: `src/pages/Home.tsx`

**Step 1: Build full landing page**

The Home page must include these sections (matching BigDates):
1. Hero with "Make Your Special Moments Unforgettable" + "Create Website" CTA + stats bar
2. Sample invitation carousel (Swiper) grouped by event type
3. "Your Moment, Your Invitation" — 8 event category cards with accent colors, linking to event pages
4. How It Works — 4 steps with numbered indicators
5. 6 Feature highlight cards (Digital Invitations, WhatsApp Sharing, Google Maps, Photo Gallery, RSVP, Background Music)
6. Paper vs Digital comparison section with eco-friendly messaging
7. 3 Testimonial cards (names, cities, star ratings)
8. Urgency banner: "X people created invitations in the last 24 hours"
9. Pricing preview section with 3 duration cards

All sections use Framer Motion `whileInView` animations. Event cards link to `/create-your-[slug]-website`. Stats: "10,000+ families" | "12,847+ invitations" | "50 Lakh+ guests reached".

**Step 2: Verify in browser**

Run: `npx vite --port 3003 --host 0.0.0.0` and check http://localhost:3003/

**Step 3: Commit**

```bash
git add src/pages/Home.tsx && git commit -m "feat: build BigDates-style landing page with all sections"
```

---

## Task 3: Build Event Type Pages

**Files:**
- Rewrite: `src/pages/EventPage.tsx`

**Step 1: Build parameterized event page**

Uses `useParams()` to get `:eventSlug`, looks up event config via `getEventBySlug()`. Sections:
1. Hero: event-specific title, social proof, accent color theming, "Start Now" CTA
2. QR invitation card mockup (styled div with sample names/date)
3. WhatsApp sharing demo (mock chat bubble)
4. Paper vs Digital comparison
5. 6 feature highlights (event-themed)
6. How It Works (4 steps)
7. 3 event-specific testimonials
8. Stats bar: "₹49 Starting price" | "500+ Templates" | guest count
9. Duration pricing cards (1mo/3mo/1yr)
10. Limited time offer banner with countdown + SAVE10
11. "Start Now" CTA → navigates to `/chatbot?event=[eventType]`

Apply accent color throughout the page via inline styles or CSS variables. 404 handling if slug doesn't match any event.

**Step 2: Test multiple event URLs**

Visit: `/create-your-wedding-website`, `/create-your-birthday-website`, `/create-your-baptism-website`
Verify: different colors, different hero text, different social proof

**Step 3: Commit**

```bash
git add src/pages/EventPage.tsx && git commit -m "feat: build event-specific landing pages with accent colors"
```

---

## Task 4: Modify Chatbot for new flow

**Files:**
- Modify: `src/components/Chatbot.tsx`
- Rewrite: `src/pages/ChatbotPage.tsx`

**Step 1: Update Chatbot to accept eventType as prop**

- Add `eventType?: EventType` to `ChatbotProps`
- If `eventType` is provided, skip Step 0 (event selection) — start at Step 1 (person 1 name)
- Set `formData.eventType` from prop in initial state
- Update initial messages: skip "What's your Event?" if eventType is known
- On completion, instead of calling `onComplete`, navigate to `/templates?event=[eventType]` with form data in state

**Step 2: Build ChatbotPage**

```tsx
// src/pages/ChatbotPage.tsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import { getEventByType, EventType } from '../constants/events';

export function Component() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const eventType = params.get('event') as EventType | null;

  const handleComplete = (data: any) => {
    navigate('/templates', { state: { formData: data, eventType: data.eventType } });
  };

  return (
    <div className="fixed inset-0 bg-[#FFF9F5] z-50 flex items-center justify-center">
      <Chatbot
        eventType={eventType || undefined}
        onComplete={handleComplete}
      />
    </div>
  );
}
```

**Step 3: Update Chatbot.tsx**

In Chatbot component:
- Change `ChatbotProps` to `{ eventType?: EventType; onComplete?: (data: any) => void }`
- In `useState` for `step`: initialize to `1` if `eventType` prop is provided, else `0`
- In `useState` for `formData`: initialize with `{ eventType }` if prop provided
- Update initial messages: if eventType provided, show "I'll help you create a beautiful [Event Label] Website" then ask for person 1 name
- Remove the floating trigger button (FAB) — chatbot is now full-page via ChatbotPage

**Step 4: Verify chatbot flow**

Navigate to `/chatbot?event=wedding` — should skip event selection and ask for Groom's name directly.

**Step 5: Commit**

```bash
git add src/components/Chatbot.tsx src/pages/ChatbotPage.tsx && git commit -m "feat: chatbot accepts eventType prop, skip event selection step"
```

---

## Task 5: Build Template Selection Page (post-chatbot)

**Files:**
- Rewrite: `src/pages/TemplatePage.tsx`

**Step 1: Build template selection page**

Receives `formData` and `eventType` via `useLocation().state`. Displays:
- Header: "Choose Your Template"
- Grid of 6+ template thumbnails (can reuse existing template images + add more)
- No tier labels — all templates shown equally
- Click to select (highlighted border/glow)
- "Continue" button → navigates to `/preview` with `{ formData, selectedTemplate }` in state
- "Back" button → go back to chatbot
- Event accent color used for selection highlight

Templates are just visual designs now — no tier/price association.

**Step 2: Verify flow**

Complete chatbot → should land on template page → select template → proceed to preview.

**Step 3: Commit**

```bash
git add src/pages/TemplatePage.tsx && git commit -m "feat: build post-chatbot template selection page"
```

---

## Task 6: Build Preview Page (free view)

**Files:**
- Rewrite: `src/pages/PreviewPage.tsx`

**Step 1: Build preview page**

Receives `formData` and `selectedTemplate` via location state. Renders the full invitation preview using existing preview logic from App.tsx:
- Hero with names, date, time, event icon
- Photo gallery (all users get up to 50 photos)
- Countdown timer
- Venue map
- Shagun section
- Action buttons (RSVP, Calendar, Directions, Share) — all visible
- Footer text

**New elements:**
- Top banner: "This is a free preview. Upgrade to get your shareable link" with "Activate Now" → `/pricing`
- "Change Theme" floating button → back to `/templates`
- Share buttons work but link includes watermark/branding until paid
- No trial logic — just free preview

**Step 2: Verify preview renders with chatbot data**

Complete full flow: Event page → Chatbot → Templates → Preview. Verify names, date, venue show correctly.

**Step 3: Commit**

```bash
git add src/pages/PreviewPage.tsx && git commit -m "feat: build free preview page with upgrade banner"
```

---

## Task 7: Build Pricing Page (duration-based)

**Files:**
- Rewrite: `src/pages/PricingPage.tsx`

**Step 1: Build pricing page**

Layout:
- Header: "Pricing Plan" / "List of our pricing packages"
- Free tier card: "Website Preview — FREE — Completely FREE" with "Create Website" CTA
- 3 duration cards side by side:
  - 1 Month: ₹99
  - 3 Months: ₹199 (highlighted as "preferred" with badge)
  - 1 Year: ₹499
- All paid plans include: Zero Ads, all templates, photo gallery (50), countdown, RSVP, action buttons, WhatsApp sharing, Google Maps, background music, personalized link, 24/7 support
- Promo code input (SAVE10 = 10% off) — reuse promo logic from old TemplateGallery
- "Trusted by 4500+ happy customers" badge
- "Special Offer for New Users! Get 10% OFF Use Code: SAVE10" banner
- Payment button → placeholder (Razorpay integration later)

**Step 2: Verify pricing page at /pricing**

**Step 3: Commit**

```bash
git add src/pages/PricingPage.tsx && git commit -m "feat: build duration-based pricing page matching BigDates"
```

---

## Task 8: Update Dashboard for duration model

**Files:**
- Rewrite: `src/pages/DashboardPage.tsx`
- Modify: `src/components/Dashboard.tsx`

**Step 1: Update Dashboard component**

Changes:
- Remove tier labels (Basic/Standard/Premium) from invitation cards
- Remove 1-day trial logic (trialRemaining, trialExpired states)
- Replace with subscription duration display:
  - Active: "Subscription active — expires [date]" green banner
  - Expired: "Subscription expired — Renew" red banner
- Each invitation card shows: duration plan (1mo/3mo/1yr), expiry date, status
- "Renew" button → `/pricing`
- Keep: event type filtering, WhatsApp support button, stats grid, invitation grid

**Step 2: Create DashboardPage wrapper**

```tsx
// src/pages/DashboardPage.tsx
import Dashboard from '../components/Dashboard';

export function Component() {
  return <Dashboard />;
}
```

**Step 3: Verify dashboard at /dashboard**

**Step 4: Commit**

```bash
git add src/pages/DashboardPage.tsx src/components/Dashboard.tsx && git commit -m "feat: update dashboard for duration-based subscriptions"
```

---

## Task 9: Clean up old App.tsx and remove dead code

**Files:**
- Rewrite: `src/App.tsx` (now just re-exports router or is deleted)
- Remove from router: any old view-switching logic

**Step 1: Simplify App.tsx**

App.tsx is no longer the main shell. Either:
- Delete it and update imports, OR
- Make it a simple re-export: `export { default } from './router'`

Since main.tsx already uses RouterProvider, App.tsx can be removed entirely. Update any remaining imports.

**Step 2: Remove old TemplateGallery.tsx**

The old TemplateGallery with tier-based pricing is fully replaced by:
- `src/pages/TemplatePage.tsx` (post-chatbot template selection)
- `src/pages/PricingPage.tsx` (pricing)

Delete `src/components/TemplateGallery.tsx`.

**Step 3: Verify full build**

Run: `npx vite build 2>&1 | tail -10`
Expected: No errors, no unused imports

**Step 4: Verify full flow in browser**

1. `/` → Landing page with event cards
2. Click "Wedding" → `/create-your-wedding-website` → event page with wedding accent
3. Click "Start Now" → `/chatbot?event=wedding` → chatbot (no event selection step)
4. Complete chatbot → `/templates` → select template
5. Continue → `/preview` → full invitation preview with upgrade banner
6. Click "Activate Now" → `/pricing` → duration pricing cards
7. Visit `/dashboard` → dashboard with duration subscriptions

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: remove old App.tsx and TemplateGallery, clean up dead code"
```

---

## Task 10: Final polish and responsive testing

**Files:**
- Various — responsive fixes across all new pages

**Step 1: Mobile responsive audit**

Check every page at 375px width:
- Navbar: hamburger menu works, all links accessible
- Home: sections stack properly, event cards 2-col on mobile
- Event page: all sections readable, CTAs prominent
- Chatbot: full-screen on mobile (already works)
- Template selection: 2-col grid on mobile
- Preview: single column, all sections visible
- Pricing: cards stack vertically
- Dashboard: sidebar hidden on mobile (already works)

**Step 2: Fix any responsive issues found**

**Step 3: Final commit**

```bash
git add -A && git commit -m "feat: responsive polish across all redesigned pages"
```
