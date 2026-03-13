# Invitation Card Platform — Session Log 2 (March 12, 2026)

## Project
AI-Powered Digital Invitation Platform (SaaS) — BigDates Flow Redesign
Path: `/Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card/`

## What Was Done This Session

### Goal
Restructure the entire app to match BigDates.ai's proven user flow and pricing model.

### Old Flow
Home → Template Gallery (with tiers) → Chatbot → Loading → Preview

### New Flow
Landing Page → Event Type Page (`/events/:slug`) → AI Chatbot → Template Selection → Preview (Free) → Pricing/Checkout

### Key Changes
1. **Routing** — Installed react-router-dom, lazy-loaded pages, MainLayout with Navbar/Footer
2. **Pricing Model** — Switched from feature-tiers (Basic/Standard/Premium) to duration-based (1mo ₹99 / 3mo ₹199 / 1yr ₹499)
3. **Free Preview** — No more 1-day trial. Preview is free, pay to activate shareable link
4. **Event Pages** — Each event type has its own page with accent color theming
5. **Navbar** — Event types as direct nav links (like BigDates)

## Files Created This Session

### New Pages (src/pages/)
- `Home.tsx` — Full landing page (9 sections: hero, carousel, event cards, how it works, features, paper vs digital, testimonials, urgency banner, pricing preview)
- `EventPage.tsx` — Parameterized event page (11 sections, accent colors per event)
- `ChatbotPage.tsx` — Wrapper that reads ?event= param and passes to Chatbot
- `TemplatePage.tsx` — Post-chatbot template selection grid (6 templates, no tiers)
- `PreviewPage.tsx` — Free invitation preview with all features, upgrade banner
- `PricingPage.tsx` — Duration-based pricing with promo codes, FAQ
- `DashboardPage.tsx` — Wrapper for Dashboard component

### New Components
- `src/components/Navbar.tsx` — Fixed top navbar with event links, hamburger mobile menu
- `src/components/Footer.tsx` — Dark footer with event links, company links

### New Config
- `src/constants/events.ts` — All 8 event configs (type, slug, urlPath, accentColor, labels, social proof), PRICING_PLANS, PROMO_CODES, helper functions
- `src/router.tsx` — React Router with lazy loading
- `src/layouts/MainLayout.tsx` — Navbar + Footer wrapper

### Design Docs
- `docs/plans/2026-03-12-bigdates-flow-redesign.md` — Full design document
- `docs/plans/2026-03-12-bigdates-flow-redesign-plan.md` — Implementation plan (11 tasks)

## Files Modified
- `src/components/Chatbot.tsx` — Accepts eventType prop, skips Step 0, full-screen mode, fixed non-couple parent flow
- `src/components/Dashboard.tsx` — Removed trial logic, added subscription duration display
- `src/components/MapPicker.tsx` — Fixed useRef TypeScript error
- `src/index.css` — Fixed CSS import ordering
- `src/main.tsx` — Uses RouterProvider instead of App

## Files Deleted
- `src/App.tsx` — Old view-switching logic (replaced by router)
- `src/components/TemplateGallery.tsx` — Old tier-based template selection (replaced by TemplatePage + PricingPage)

## Route Structure
```
/                          → Landing Page (Home)
/events/wedding            → Wedding Event Page
/events/betrothal          → Betrothal Event Page
/events/birthday           → Birthday Event Page
/events/baptism            → Baptism Event Page
/events/holy-communion     → Holy Communion Event Page
/events/naming-ceremony    → Naming Ceremony Event Page
/events/baby-shower        → Baby Shower Event Page
/events/housewarming       → Housewarming Event Page
/chatbot?event=[type]      → AI Chatbot
/templates                 → Template Selection
/preview                   → Live Preview (Free)
/pricing                   → Pricing/Checkout
/dashboard                 → User Dashboard
```

## Event Color System
| Event | Accent Color |
|-------|-------------|
| Wedding | #e8dbdc (dusty rose) |
| Betrothal | #c084fc (purple) |
| Birthday | #8499dd (periwinkle) |
| Baptism | #57aa53 (sage green) |
| Holy Communion | #57aa53 (sage green) |
| Naming Ceremony | #f4c542 (gold) |
| Baby Shower | #f9a8d4 (pink) |
| Housewarming | #f97316 (orange) |

## Pricing Model
| Plan | Price | Duration |
|------|-------|----------|
| Free | ₹0 | Preview only |
| 1 Month | ₹99 | 30 days |
| 3 Months | ₹199 (preferred) | 90 days |
| 1 Year | ₹499 | 365 days |

All paid plans include: Zero Ads, all templates, 50 photo gallery, countdown, RSVP, action buttons, WhatsApp sharing, Google Maps, background music, personalized link, 24/7 support.

## Bugs Found & Fixed (Code Audit)
1. Event slug routing broken for hyphenated slugs → Changed to `/events/:slug` pattern
2. MapPicker useRef missing argument → Added null initial value
3. Non-couple events with parents flow broken → Fixed jump to step 11
4. CSS @import ordering → Fonts before Tailwind
5. State lost on page refresh → Added sessionStorage fallback
6. Login link dead → Disabled placeholder
7. Footer policy links dead → Non-clickable placeholders
8. Parents renders as [object Object] → Object.values().join()
9. Deprecated onKeyPress → Changed to onKeyDown
10. Dashboard typo "Initation" → "BigDate"

## Git Commits
```
667c4bd feat: install react-router-dom and set up routing shell with lazy pages
0e8c62e feat: add event constants, Navbar with event links, and Footer
84b7ea5 feat: complete BigDates flow redesign — new pages, routing, duration pricing
5db905e feat: responsive polish across all redesigned pages
710f663 fix: resolve 12 audit bugs — routing, chatbot flow, state persistence, UI fixes
```

## Remaining To Build
- User Authentication (Login/Signup)
- Payment Gateway (Razorpay) integration
- Backend/Database (PostgreSQL/Supabase)
- Real analytics tracking
- Personalized shareable links
- Multiple templates per event type (currently 6 shared)
- Pro/Business tier features
- 404 page
- Privacy/Terms/Refund pages

## Dev Server
- Command: `npx vite --port 3003 --host 0.0.0.0`
- Repo: https://github.com/Adhinc/Invitation-cards.git
