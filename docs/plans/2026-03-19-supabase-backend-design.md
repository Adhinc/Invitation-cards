# Supabase Backend Design — Invitation Card Platform

**Date:** 2026-03-19
**Status:** Approved

## Decisions

| Area | Decision |
|---|---|
| Backend | Supabase (Auth + DB + Storage + Edge Functions) |
| Auth | Google OAuth, required only at payment |
| URLs | Path style: `/i/{auto-generated-slug}` |
| Payment | Razorpay, Individual plan only (₹99–₹499) |
| Images | Supabase Storage |
| Database | 5 tables: users, invitations, invitation_images, rsvps, payments |
| Guest view | Clean invitation, no CTAs, public RSVP |
| Dashboard | Link + QR, RSVP list, edit, share, subscription status |
| Edge Functions | `create-order` + `verify-payment` for Razorpay |

## Out of Scope (MVP)

- Business plan
- Phone OTP auth
- Custom domains / subdomains
- "Made with InvitationAI" branding
- Email notifications
- Analytics/view tracking

---

## 1. Database Schema

```sql
-- users: managed by Supabase Auth (auth.users)
-- Fields: id, email, name, avatar_url, created_at

-- invitations
create table invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  slug text unique,
  event_type text not null, -- wedding | birthday | baptism | etc.
  template_id text not null, -- e.g. "midnight", "lavender"
  status text not null default 'draft', -- draft | active | expired
  form_data jsonb not null, -- all chatbot fields: names, date, time, address, coords, parents
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- invitation_images
create table invitation_images (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade not null,
  storage_path text not null, -- Supabase Storage path
  display_order int not null default 0,
  type text not null, -- profile_person1 | profile_person2 | gallery
  created_at timestamptz default now()
);

-- rsvps
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade not null,
  guest_name text not null,
  status text not null, -- attending | declined
  phone text,
  created_at timestamptz default now()
);

-- payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  invitation_id uuid references invitations on delete cascade not null,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  amount int not null, -- paise
  plan_duration int not null, -- months: 1, 3, 6, 12
  status text not null default 'pending', -- pending | paid | failed
  created_at timestamptz default now()
);
```

`form_data` as JSONB keeps the schema flexible — chatbot fields can evolve without migrations.

---

## 2. Auth & User Flow

```
1. User lands on EventPage → clicks "Create Your Wedding Website"
2. TryItFreeModal → TemplateOverlay → Chatbot (no login needed)
3. PreviewPage shows the invitation with "Activate Now" button
4. User clicks "Activate Now" → prompted to Sign in with Google
5. After auth → redirected to PricingPage with invitation data preserved
6. User picks plan (₹99/₹199/₹349/₹499) → Razorpay checkout opens
7. Payment success → invitation saved to DB, images uploaded to Storage, slug generated
8. User lands on Dashboard → sees their live link + QR code + RSVP list
```

- No login required until payment — zero friction to try the product
- Invitation data stays in `sessionStorage` throughout the free flow
- Only persists to Supabase after successful payment
- Google OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Auth state managed with Supabase's `onAuthStateChange` listener

---

## 3. Payment Flow (Razorpay)

```
Frontend                          Supabase Edge Function              Razorpay
───────                          ──────────────────────              ────────
1. User picks plan
   → calls edge fn "create-order"
                                  2. Creates Razorpay order
                                     (amount, currency: INR)    ──→   3. Returns order_id
                                  4. Saves to payments table
                                     (status: pending)
                                  5. Returns order_id to frontend

6. Opens Razorpay checkout
   (order_id, prefill email)
                                                                      7. User pays
8. Razorpay returns payment_id
   → calls edge fn "verify-payment"
                                  9. Verifies signature using
                                     Razorpay secret
                                  10. Updates payment (status: paid)
                                  11. Updates invitation:
                                      - status → active
                                      - published_at → now
                                      - expires_at → now + plan duration
                                      - generates unique slug
                                  12. Returns { slug, expires_at }

13. Frontend redirects to Dashboard
    showing live link + QR
```

Two Edge Functions:
- `create-order` — creates Razorpay order + pending payment row
- `verify-payment` — verifies signature, activates invitation, generates slug

Razorpay keys stored as Supabase Edge Function secrets (not in frontend code).

---

## 4. Slug Generation

Auto-generated from names entered in the chatbot:

- **Wedding:** `rahul-and-priya`
- **Birthday:** `rahul-25th-birthday`
- **Baptism:** `baby-noah-baptism`
- **Housewarming:** `sharma-family-housewarming`

Pattern: lowercase names + event type, spaces → hyphens. Duplicates get `-2`, `-3`, etc.

---

## 5. Published Invitation (Guest View)

```
Guest visits: invitationai.events/i/rahul-and-priya

Frontend route: /i/:slug
  → Fetches invitation from Supabase by slug
  → Checks status === 'active' and expires_at > now
  → Renders invitation (same components as PreviewPage, minus all CTAs)
```

**Guests see:**
- Hero with names, date, time, parents
- Photo gallery (images from Supabase Storage)
- Countdown timer
- Venue map
- Shagun/UPI section
- Action buttons: RSVP, Add to Calendar, Get Directions, WhatsApp Share

**Guests DON'T see:**
- No "Activate Now" banner
- No "Change Theme" button
- No pricing CTAs
- No bottom bar

**RSVP:** Guest taps RSVP → enters name + optional phone → saved to `rsvps` table. No login required (public insert with RLS policy scoped to invitation_id).

**Edge cases:**
- Expired → "This invitation has expired" message
- Invalid slug → 404 page
- Draft → not accessible (only `active` status is public)

---

## 6. Host Dashboard

Route: `/dashboard` (protected — requires auth)

**Features:**
- Invitation card with live link + copy button + QR code (`qrcode` npm package)
- RSVP list — table with guest name, phone, status, timestamp. Realtime updates via Supabase Realtime
- Edit — reopens chatbot with existing data pre-filled, saves changes back to DB
- Share — WhatsApp share button with pre-filled link
- Subscription info — plan, expiry, renew button (opens Razorpay again)
- User can have multiple invitations (one per event)

---

## 7. Supabase RLS Policies

```sql
-- invitations: owners can CRUD their own
alter table invitations enable row level security;
create policy "Users manage own invitations" on invitations
  for all using (auth.uid() = user_id);

-- Public read for active invitations (guest view)
create policy "Public read active invitations" on invitations
  for select using (status = 'active' and expires_at > now());

-- invitation_images: same as invitations
alter table invitation_images enable row level security;
create policy "Users manage own images" on invitation_images
  for all using (invitation_id in (select id from invitations where user_id = auth.uid()));
create policy "Public read images for active invitations" on invitation_images
  for select using (invitation_id in (select id from invitations where status = 'active' and expires_at > now()));

-- rsvps: public insert, owner reads
alter table rsvps enable row level security;
create policy "Public insert rsvps" on rsvps
  for insert with check (invitation_id in (select id from invitations where status = 'active'));
create policy "Owners read rsvps" on rsvps
  for select using (invitation_id in (select id from invitations where user_id = auth.uid()));

-- payments: owner only
alter table payments enable row level security;
create policy "Users manage own payments" on payments
  for all using (auth.uid() = user_id);
```

---

## 8. Supabase Storage Buckets

```
invitation-images/
  {user_id}/
    {invitation_id}/
      profile-person1.jpg
      profile-person2.jpg
      gallery-001.jpg
      gallery-002.jpg
      ...
```

- Public read for active invitations
- Authenticated write for owners only
