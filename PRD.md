# Product Requirements Document (PRD): AI-Powered Digital Invitation Platform

## 1. Product Overview
The product is an AI-powered Software-as-a-Service (SaaS) platform designed to help users create highly customizable, responsive digital invitation websites for special events. The platform's primary value proposition is enabling users to build a personalized website in under 5 minutes without requiring any coding or design skills. The creation process is driven by an interactive, friendly AI chatbot rather than traditional web forms.

## 2. Target Audience & Personas

**B2C (Direct Consumers):** Individuals and families organizing life events, such as Weddings, Birthdays, Baptisms, Holy Communions, Naming Ceremonies, Baby Showers, and Housewarmings. The platform has a proven product-market fit with over 10,000 families and 12,847+ happy couples using it.

**B2B (Agencies/Event Planners):** Professional users who manage multiple events. They are targeted via an "Upgrade to Business" pathway within the dashboard to unlock advanced analytics and custom branding.

## 3. Functional Requirements by Module

### Module A: Landing & Template Selection
- **Hero Section:** Must display clear calls-to-action ("Create Website") and highlight the sub-5-minute creation time.
- **Template Categorization:** Templates must be categorized into three distinct pricing tiers: Basic, Standard, and Premium.
- **Promotional Engine:** The system must support promotional codes, specifically a global "SAVE10" code offering 10% off for new users.

### Module B: AI Chatbot Experience (Data Collection)
The core onboarding mechanism is a multi-step conversational interface. The chatbot must collect the following sequentially:

- **Event Context:** Visual buttons for selecting the event type (e.g., Wedding, Betrothal).
- **Text Data:** Inputs for the Groom's name, Bride's name, and optionally the parents' names (Mother/Father).
- **Structural Preferences:** A visual selection tool to decide "Who should be viewed first? Bride or Groom".
- **Media Management:** The chat must support image uploads with a built-in interactive cropping tool to enforce specific aspect ratios (Square, Landscape, Portrait). It must include "Skip for Now" or "Add Image later" options to prevent user drop-off.
- **Schedule Picker:** A visual calendar module for selecting the date and an interactive button grid (including an AM/PM toggle) for selecting the hour of the event.
- **Location API:** A "Pick from Google Map" button that triggers a browser location permission modal, opens a map interface, allows users to search for venues, and confirms exact coordinates via a dropped pin.

### Module C: Live Rendering & Checkout
- **Loading State:** A dynamic loading animation (e.g., "Just a Sec... Unwrapping Your Invite Magic") while the server maps the chatbot data to the template.
- **Live Preview:** Instantly render the populated invitation, featuring UI elements like an active countdown timer (Days, Hours, Minutes, Seconds).
- **Checkout Gateway:** A floating panel offering a "1-day free trial" and displaying the one-time activation fee to unlock the shareable link.

### Module D: User Dashboard (Event Manager)
- **Analytics Tracking:** A post-purchase dashboard that displays real-time metrics, specifically "Active Websites" and "Total Views".
- **Event Categorization:** A sidebar menu allowing users to filter their active sites by event type (Wedding, Birthday, Baptism, etc.).
- **Support & Upsell:** Deep integration with a "Support Team" WhatsApp button and a prominent banner to "Upgrade to Business".

## 4. Monetization & Pricing Tier Constraints
The platform utilizes a structured freemium-to-premium model:

- **Basic Tier (₹49 - ₹99):** Limited customization, no photo gallery, and no countdown timer.
- **Standard Tier (₹199 - ₹399):** Access to standard templates, advanced customization, multiple inline components, photo gallery supporting up to 25 photos, countdown timer, and 24/7 support.
- **Premium Tier (₹499 - ₹699):** Exclusive premium templates, personalized website link, YouTube integration, photo gallery supporting up to 50 photos, and interactive action buttons.
