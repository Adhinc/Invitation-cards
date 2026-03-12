# BigDates Flow Redesign — Design Document

## Overview
Restructure the invitation card platform to match BigDates.ai's proven user flow and pricing model.

## New User Flow
```
Landing Page → Event Type Page (/create-your-[event]-website) → AI Chatbot → Template Selection → Preview (Free) → Pricing/Checkout
```

## 1. Landing Page (Home — rewrite)

### Hero Section
- Headline: "Make Your Special Moments Unforgettable"
- Subtext: "Create a stunning digital invitation in under 5 minutes"
- Primary CTA: "Create Website" button
- Stats bar: "10,000+ families" | "12,847+ invitations created" | "50 Lakh+ guests reached"

### Sections (top to bottom)
1. **Sample Invitation Carousel** — Swiper grouped by event type, showing mockup screenshots
2. **Event Category Cards** — "Your Moment, Your Invitation" — 8 cards with themed colors, icons, short descriptions, links to event pages
3. **How It Works** — 4 steps: Start Chat → Share Details → Choose Design → Share & Celebrate
4. **Feature Highlights** — 6 cards: Digital Invitations, WhatsApp Sharing, Google Maps, Photo Gallery, RSVP, Background Music
5. **Paper vs Digital** — Comparison table, eco-friendly messaging, "One small choice today. A greener tomorrow."
6. **Testimonials** — 3 cards with names, cities, star ratings, quotes
7. **Urgency Banner** — "X people created invitations in the last 24 hours"
8. **Footer** — Company info, legal links, social links, contact

### Navbar
```
Logo | Wedding | Birthday | Baptism | Holy Communion | Naming Ceremony | Baby Shower | Housewarming | Betrothal | Pricing | Login | Create
```
- Event types as direct nav links
- Mobile: hamburger menu with all items

## 2. Event Type Pages (/create-your-[event]-website)

8 pages, one per event. Each page has:

### Event-Specific Content
- Hero: "Create Your Dream [Event] Website" + event-specific social proof
- Accent color per event (see color system below)
- QR invitation card mockup (sample names/date)
- WhatsApp sharing demo (mock chat bubble with invite link)
- Paper vs Digital comparison
- 6 feature highlights (event-themed icons)
- How It Works (4 steps)
- Event-specific testimonials (3 cards)
- Stats: "₹49 Starting price" | "500+ Templates" | guest count
- Duration pricing cards: 1 Month ₹99 | 3 Months ₹199 (preferred) | 1 Year ₹499
- Limited time offer banner with countdown timer + SAVE10 code
- CTA: "Start Now" → launches chatbot pre-loaded with this event type

### Color System
| Event | Accent Color |
|-------|-------------|
| Wedding | #e8dbdc (dusty rose) |
| Birthday | #8499dd (periwinkle) |
| Baptism | #57aa53 (sage green) |
| Holy Communion | #57aa53 (sage green) |
| Naming Ceremony | #f4c542 (gold) |
| Baby Shower | #f9a8d4 (pink) |
| Housewarming | #f97316 (orange) |
| Betrothal | #c084fc (purple) |

## 3. AI Chatbot (modify existing)

### Changes
- Remove Step 0 (event type selection) — event is pre-set from the event page
- Accept eventType as prop/parameter
- Flow starts directly at name collection
- All other steps remain the same

### Preserved Steps
- Person 1 Name → Person 1 Image → Person 2 Name (couple) → Person 2 Image (couple) → View Priority (couple) → Parents Names → Date (calendar) → Time (picker) → Venue (map)
- On completion → navigate to Template Selection (not preview)

## 4. Template Selection Page (NEW)

### Design
- Full page grid of template thumbnails for the selected event type
- No tier labels — all templates available to all users
- Generic mockup thumbnails (not pre-filled with user data)
- Click to select → highlighted border
- "Continue" button → goes to Preview
- Back button → return to chatbot

### URL
`/templates?event=[eventType]`

## 5. Preview Page (modify existing)

### Changes
- Free to view — no trial gate, no "Start Free Trial" button
- Live preview populated with user's chatbot data
- "Change Theme" button → back to template selection
- Share options: WhatsApp, SMS, Copy Link
- Banner at top: "Upgrade to remove ads & unlock all features"
- "Activate Now" CTA → goes to pricing/checkout

### Removed
- 1-day trial logic
- Tier-based feature gating on preview
- "Finish & Buy" button

## 6. Pricing Page (/pricing — rewrite)

### Duration-Based Model
| Plan | Price | Duration |
|------|-------|----------|
| 1 Month | ₹99 | 30 days |
| 3 Months | ₹199 | 90 days (preferred/highlighted) |
| 1 Year | ₹499 | 365 days |

### All Paid Plans Include
- Zero Ads
- All templates
- Photo gallery (50 photos)
- Countdown timer
- RSVP & interactive buttons
- WhatsApp sharing
- Google Maps integration
- Background music
- Personalized shareable link
- 24/7 support

### Free Tier
- Basic preview with watermark/ads
- Limited sharing
- No personalized link

### Checkout
- Promo code input (SAVE10 = 10%)
- Payment gateway (Razorpay)
- "Trusted by 4500+ customers" badge
- Money-back guarantee text

## 7. Dashboard (minor updates)

### Changes
- Remove tier-based display (Basic/Standard/Premium labels)
- Show subscription duration + expiry date
- Active/Expired status per invitation
- Renewal CTA for expired subscriptions

### Preserved
- Event type filtering sidebar
- WhatsApp support button
- Analytics (views, shares)

## 8. Components to Create/Modify

### New Components
- `src/pages/Home.tsx` — New landing page
- `src/pages/EventPage.tsx` — Dynamic event type page (parameterized)
- `src/pages/TemplateSelection.tsx` — Post-chatbot template picker
- `src/pages/Pricing.tsx` — Duration-based pricing page
- `src/components/Navbar.tsx` — New navbar with event type links
- `src/components/Footer.tsx` — Full footer
- `src/components/TestimonialCard.tsx` — Reusable testimonial
- `src/components/FeatureCard.tsx` — Reusable feature highlight
- `src/components/HowItWorks.tsx` — 4-step process section
- `src/components/PaperVsDigital.tsx` — Comparison section
- `src/components/PricingCards.tsx` — Duration pricing cards
- `src/components/OfferBanner.tsx` — Countdown + promo banner

### Modified Components
- `src/components/Chatbot.tsx` — Remove Step 0, accept eventType prop
- `src/components/TemplateGallery.tsx` — Repurpose or replace
- `src/components/Dashboard.tsx` — Remove tier labels, add duration display
- `src/App.tsx` — New routing, remove old flow

### Removed Logic
- Feature-tier pricing (Basic/Standard/Premium price differentiation)
- 1-day trial system (localStorage trial data)
- Tier-based photo limits
- Tier-based feature gating

## 9. Routing

```
/                                    → Landing Page (Home)
/create-your-wedding-website         → Event Page (wedding)
/create-your-birthday-website        → Event Page (birthday)
/create-your-baptism-website         → Event Page (baptism)
/create-your-holy-communion-website   → Event Page (holy-communion)
/create-your-naming-ceremony-website  → Event Page (naming-ceremony)
/create-your-baby-shower-website      → Event Page (baby-shower)
/create-your-housewarming-website     → Event Page (housewarming)
/create-your-betrothal-website        → Event Page (betrothal)
/chatbot?event=[type]                → Chatbot
/templates?event=[type]              → Template Selection
/preview                             → Live Preview
/pricing                             → Pricing/Checkout
/dashboard                           → User Dashboard
```

## 10. Dependencies Needed
- `react-router-dom` — Client-side routing (currently not used, Vite SPA)
