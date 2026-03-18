# Invitation.AI — Full UI/UX Redesign (BigDates.ai Clone)

**Date:** 2026-03-18
**Goal:** Pixel-perfect clone of BigDates.ai UI/UX across all 6 pages. User will differentiate later.
**Brand:** Invitation.AI

## Global Design System

### Colors
- Background: `#ffffff` (white), `#f9fafb` (light gray sections)
- Text primary: `#111827`
- Text secondary: `#6b7280`
- Text muted: `#9ca3af`
- Border: `#e5e7eb`
- Event accent colors remain per-event (wedding dusty rose, birthday periwinkle, etc.)

### Typography
- Primary font: Inter or DM Sans (clean sans-serif)
- Minimal serif usage — only for special decorative moments
- Remove Playfair Display as dominant heading font
- Remove Great Vibes script font
- Remove gradient text effects

### Components
- Cards: White bg, 1px border `#e5e7eb`, subtle shadow on hover
- Buttons: Solid fill, 8px radius, clean hover darkening
- Sections: Generous vertical padding (80-112px), clean separation
- No cream/rose theme — white-first, neutral with event accents

## Page 1: Homepage

### Navbar
- Fixed top, white bg, subtle bottom border
- Logo left: "Invitation.AI" text mark
- Center: Event type links (Wedding, Birthday, Baptism, Holy Communion, Naming Ceremony, Baby Shower, Housewarming)
- Right: "Create" dropdown + "Login" button
- Mobile: Hamburger menu with full-screen overlay

### Hero Section
- Bold headline: "Create beautiful invitations for your special moments"
- Subtitle: "Weddings, birthdays, and celebrations deserve to be remembered. Create your invitation website in minutes — no design skills needed."
- Primary CTA: "Create Website" button
- Secondary text: "No credit card required - Ready in minutes"
- Large stat: "41,000+" Trusted Worldwide
- Clean white background

### Gallery Carousel
- Horizontal scrollable carousel
- Real invitation screenshots (mobile device mockups)
- Labels per screenshot (Wedding, Birthday, etc.)
- Previous/Next navigation arrows

### Event Categories Grid
- 8 event cards in responsive grid
- Each card: event icon/image, event name, tagline
- Accent color per event type
- Click navigates to /events/:slug

### How It Works (3 Steps)
1. "Start with a Chat" — AI chatbot icon
2. "Choose Your Style" — Template selection icon
3. "Share Instantly" — Social sharing icon
- Clean numbered steps with icons

### WhatsApp Sharing Section
- Left: descriptive text about one-tap sharing
- Right: Realistic WhatsApp chat bubble mockup
- Three benefit pills: "One-Tap Access", "Share to Groups", "No App Needed"

### QR Code Section (Paper + Digital)
- Reversed layout (image left, text right)
- Physical invitation card mockup with QR code
- "Scan for E-Invite" concept
- Hybrid print+digital messaging

### Why Choose Invitation.AI (6 Cards)
- "More Than an Invite"
- "Effortless to Create"
- "One Simple Link"
- "Personal by Design"
- "Always Accessible"
- "Trusted by Thousands"
- 3x2 grid, clean card design

### Testimonials Carousel
- 3 customer quotes with names and occasion types
- Star ratings
- Carousel with dots navigation

### Social Proof Stats Bar
- "10,000+ Happy families"
- "50,000+ Websites created"
- "4.9/5 User rating"
- Dark or accent background, large numbers

### Pricing Preview
- 3 cards: 1 Month (₹99), 3 Months (₹199, preferred), 1 Year (₹499)
- Feature highlights per card
- "Get Started" CTA per card

### Final CTA Section
- Bold headline encouraging action
- Single "Create Website" button
- Trust signals

### Footer
- Dark background (gray-900)
- Logo + company description
- 4 columns: Events, Features, Company, Legal
- Company: "INVITATION.AI SOFTWARES"
- Social links: Instagram, WhatsApp, Email
- Copyright notice

## Page 2: Event Pages (/events/:slug)

### Event Hero
- Event-specific accent color theming
- Event title + tagline
- Person labels (Bride/Groom for couples, Celebrant for singles)
- Social proof number
- "Create [Event] Invitation" CTA

### Template Showcase Carousel
- Example invitation screenshots for this event type
- Swiper carousel with navigation

### WhatsApp Sharing Demo
- Same as homepage but with event-specific names

### Paper vs Digital Comparison
- Side-by-side comparison table
- Digital advantages highlighted

### Feature Highlight Cards (6)
- Event-specific features
- Icon + title + description
- 3x2 grid

### How It Works (4 Steps)
1. Chat with AI
2. Pick a template
3. Preview for free
4. Activate & share

### Event-Specific Testimonials
- 3 testimonials relevant to event type

### Stats Bar
- Starting price, template count, guest count

### Pricing Cards (3 Tiers)
- Same as homepage pricing
- "Most Popular" badge on 3-month plan

### Limited Offer Banner
- Urgency messaging with countdown
- 10% off messaging

### Final CTA
- Event-specific call to action

## Page 3: Pricing Page

### Header
- "Simple, Transparent Pricing" title
- Subtitle about value

### Free Tier Card
- "Website Preview — Completely FREE"
- What's included in free tier

### Individual Plan Card
- Domain: "your-name.invitationai.events"
- Pricing tiers: ₹99 (1mo), ₹199 (3mo), ₹399 (6mo), ₹499 (1yr)
- Features: Ad-free, dedicated support
- "Proceed" CTA

### Business Plan Card
- Domain: "events.yourdomain.com"
- ₹1000 lifetime registration
- Postpaid per-invitation pricing
- Features: Custom branding, catalog management, dedicated support
- "Proceed" CTA

### Trust Section
- "Trusted by 4500+ happy customers"
- Secure payment, instant activation, no hidden fees

### FAQ Accordion
- Common pricing questions
- Expandable Q&A format

## Page 4: Chatbot Flow

### Clean Chat Interface
- Full-screen chat layout
- Bot messages: left-aligned, light gray background, no colored borders
- User messages: right-aligned, dark/accent background, white text
- Bot avatar icon
- Clean choice chips (white bg, border, no rose coloring)
- Modern input field at bottom
- Typing indicator (3 dots)
- Same multi-step flow: event → names → images → date → time → location

## Page 5: Preview Page

### Upgrade Banner
- Fixed top, clean design
- "Free Preview — Upgrade for shareable link"
- "Activate Now" button

### Invitation Sections
- Hero with names, date, time, parents
- Cinematic gallery carousel
- Countdown timer (clean card design)
- Venue map (OpenStreetMap)
- Shagun/Gift section
- Action buttons (RSVP, Calendar, Directions, WhatsApp)
- Footer message

### Floating Bottom Bar
- "Change Theme" + "Activate Now" buttons

## Page 6: Dashboard

### Sidebar
- Brand logo
- Nav items: Overview, My Invitations, Analytics, Billing
- Event type filters
- Upgrade to Business card
- Logout

### Main Content
- Welcome header + "Create New Invite" CTA
- Subscription status banner
- 4 stats cards (Views, Active, RSVPs, Revenue)
- Invitations grid with cards
- WhatsApp support FAB

## Key Removals from Current Design
- Cream background (#FFFBF8) → white (#ffffff)
- Rose primary (#C85C6C) → neutral dark with event accents
- Playfair Display serif dominance → Inter/DM Sans sans-serif
- Great Vibes script font → remove
- Gradient text effects → solid text
- Glass card effects → clean bordered cards
- Promo code system → removed entirely
