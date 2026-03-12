# Invitation Card Platform — Session Log (March 12, 2026)

## Project
AI-Powered Digital Invitation Platform (SaaS)
Path: `/Users/admin/Desktop/Workspace/projects/adhin-cureocity/startup/invitation-card/`

## Tech Stack
- **Framework:** Vite 7.3 + React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- **Animation:** Framer Motion 12
- **Icons:** Lucide React
- **Gallery:** Swiper 12
- **Image Cropping:** react-easy-crop 5
- **Date Utils:** date-fns 4, react-day-picker 9

## PRD
Saved at `PRD.md` in project root. Key modules: Landing, AI Chatbot, Live Preview, Dashboard.
Focus: **B2C only** (no B2B/agency features for now).

## Git
- Repo: `https://github.com/Adhinc/Invitation-cards.git`
- Cloned with token auth

## Features Built This Session (15 total)

### 1. Promo Code Engine (SAVE10)
- File: `src/components/TemplateGallery.tsx`
- PROMO_CODES map, input field, apply/remove, 10% discount
- Price updates in sidebar badge + free trial text

### 2. Parents' Names in Chatbot
- File: `src/components/Chatbot.tsx`
- Optional step after priority selection
- "Yes, add them" / "Skip" buttons
- Collects up to 4 parents (couple events) or 2 (single events)
- Each parent has individual "Skip this" option

### 3. Visual Calendar Date Picker
- File: `src/components/DatePicker.tsx` (NEW)
- Custom inline calendar, month navigation, past dates disabled
- Today highlighted, selected date gets rose fill
- Confirm button sends YYYY-MM-DD format

### 4. HH:MM Time Picker with AM/PM Toggle
- File: `src/components/TimePicker.tsx` (NEW)
- Spinner-style hour (1-12) and minute (00-55, 5-min steps)
- AM/PM toggle buttons
- "Set Time" confirm sends "HH:MM AM/PM"

### 5. Template-Driven Crop Aspect Ratio
- Files: `src/components/Chatbot.tsx`, `src/components/ImageCropper.tsx`
- cropAspect state controls ratio per step
- Profile photos = Square (1:1)
- ImageCropper shows aspect label badge (Square/Landscape/Portrait)

### 6. Real Maps Integration (Nominatim + OpenStreetMap)
- File: `src/components/MapPicker.tsx` (REWRITTEN)
- Real venue search via Nominatim API (debounced, 5 results)
- Dropdown with name + address, click to select
- Live map preview with pin (OpenStreetMap embed)
- "Use my location" GPS button with reverse geocoding
- Stores real lat/lng coordinates
- File: `src/components/VenueMap.tsx` (REWRITTEN)
- Real embedded map with pin at exact coordinates
- "Directions" button opens Google Maps navigation
- No API key needed

### 7. WhatsApp Support Button
- File: `src/components/Dashboard.tsx`
- Floating green button (bottom-right), red notification dot
- Hover tooltip "Chat with Support"
- Opens WhatsApp with pre-filled message
- Phone number placeholder: 919876543210

### 8. Photo Gallery Limits per Tier
- Files: `src/App.tsx`, `src/components/CinematicGallery.tsx`
- Basic: no gallery, no countdown
- Standard: up to 25 photos, countdown visible
- Premium: up to 50 photos, countdown visible
- Gallery footer shows "X / Y photos" + tier label
- Tier flows from TemplateGallery → App → preview

### 9. Basic Tier Template
- File: `src/components/TemplateGallery.tsx`
- "Simple Blossom" template (₹99) added
- Features: Basic Customization, Shareable link, Venue map, Event details
- "Not included" section with crossed-out items
- activeTemplate now dynamically updates when switching tiers (was hardcoded)

### 10. More Event Types (8 total)
- File: `src/components/Chatbot.tsx`
- Wedding, Betrothal, Birthday, Baptism, Holy Communion, Naming Ceremony, Baby Shower, Housewarming
- Adaptive chatbot flow: couple events (2 people) vs single-person events
- Dynamic labels: "Child's name" for Baptism, "Host's name" for Housewarming, etc.
- Parents flow adapts: couple = 4 parents, single = 2 parents

### 11. Event Type Filtering in Dashboard
- File: `src/components/Dashboard.tsx` (REWRITTEN)
- Sidebar "Filter by Event" section with count badges
- 6 sample invitations across event types
- Grid heading updates dynamically
- Empty state with "Create One" button
- Layout animation on filter change

### 12. Event-Specific Preview Content
- File: `src/App.tsx`
- EVENT_CONTENT config: unique tagline, subtitle, icon, countdown label, footer text per event
- Wedding = Heart, Birthday = Cake, Baptism = Church, Baby = Baby icon, Housewarming = Home
- Template gallery mockup text varies by tier

### 13. 1-Day Free Trial Logic
- Files: `src/App.tsx`, `src/components/Dashboard.tsx`
- "Start Free Trial" button replaces "Finish & Buy"
- Trial data in localStorage: startedAt, expiresAt (24h), tier, paid
- Dashboard: amber banner with time remaining + "Activate Now"
- Expired: red banner + "Pay & Activate"
- Updates every minute

### 14. Interactive Action Buttons (Premium Tier)
- File: `src/App.tsx`
- Premium: RSVP (toggles to confirmed), Calendar, Directions, Share
- Standard: Calendar, Directions, Share
- Basic: Calendar + Share in footer only
- Add to Calendar: generates real .ics file download
- Get Directions: opens Google Maps with coordinates
- Share: WhatsApp with invite link

### 15. Responsive Mobile Layout
- Chatbot: full-screen on mobile, floating popup on desktop
- Template Gallery: stacked vertically, smaller phone mockup (260x520)
- Dashboard: sidebar hidden on mobile, 2-col stats, stacked cards
- Nav button: smaller on mobile

## Critical Fix: Tailwind CSS Installation
- **Problem:** Tailwind CSS was never installed — all utility classes were ignored, making UI look broken
- **Fix:** Installed `tailwindcss` + `@tailwindcss/vite`, added plugin to `vite.config.ts`, added `@import "tailwindcss"` to `index.css`

## File Structure
```
src/
├── App.tsx                    — Main app shell, view routing, preview
├── main.tsx                   — Entry point
├── index.css                  — Global styles + Tailwind import
├── components/
│   ├── Chatbot.tsx            — Multi-step AI chatbot (8 event types)
│   ├── TemplateGallery.tsx    — Template selection (3 tiers) + promo codes
│   ├── ImageCropper.tsx       — Image crop with aspect ratio badge
│   ├── DatePicker.tsx         — Visual calendar picker
│   ├── TimePicker.tsx         — HH:MM + AM/PM spinner
│   ├── MapPicker.tsx          — Real venue search (Nominatim)
│   ├── VenueMap.tsx           — Embedded map display (OpenStreetMap)
│   ├── CountdownTimer.tsx     — Days/Hours/Min/Sec countdown
│   ├── CinematicGallery.tsx   — Photo carousel with tier limits
│   ├── Dashboard.tsx          — User dashboard with filters + trial
│   └── Shagun.tsx             — Digital gifting / UPI
├── utils/
│   ├── cropUtils.ts           — Image crop utility
│   └── prompts.ts             — AI prompts
└── assets/
```

## Chatbot Flow (Steps)
```
Step 0:  Event Type (8 options)
Step 1:  Person 1 Name
Step 2:  Person 1 Image (upload/skip)
Step 3:  Person 2 Name (couple events only)
Step 4:  Person 2 Image (couple events only)
Step 5:  View Priority (couple events only)
Step 6:  Parents Names (yes/skip)
Step 7-10: Parent sub-flow (up to 4 parents)
Step 11: Date (calendar picker)
Step 12: Time (HH:MM AM/PM picker)
Step 13: Address (map picker)
→ Loading animation → Live preview
```

## Remaining To Build (from PRD)
- YouTube Integration (Premium tier) — user skipped for now
- Payment Gateway (Razorpay)
- User Authentication
- Backend/Database (PostgreSQL/Supabase)
- Real analytics tracking
- Personalized shareable links
- Multiple templates per tier (currently 1 each)

## Dev Server
- Command: `npx vite --port 3003 --host 0.0.0.0`
- Local: http://localhost:3003/
- Network: http://192.168.29.132:3003/
