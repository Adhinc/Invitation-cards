# Supabase Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Add Supabase backend (auth, DB, storage, payments) so users can publish shareable invitation links and manage RSVPs from a dashboard.

**Architecture:** Frontend-only Vite+React app gets Supabase client SDK. Auth via Google OAuth (login only at payment). Two Supabase Edge Functions handle Razorpay order creation and payment verification. Published invitations served at `/i/:slug` using same preview components.

**Tech Stack:** Supabase (Auth, PostgreSQL, Storage, Edge Functions), Razorpay, `@supabase/supabase-js`, `qrcode.react`

---

### Task 0: Supabase Project Setup & Environment

**Files:**
- Create: `.env.local`
- Create: `src/lib/supabase.ts`
- Modify: `package.json` (add dependency)
- Modify: `.gitignore` (add `.env.local`)

**Step 1: Install Supabase client SDK**

Run: `npm install @supabase/supabase-js`

**Step 2: Create Supabase project**

Go to https://supabase.com/dashboard → New Project → choose region (Mumbai for India).
Copy the project URL and anon key from Settings → API.

**Step 3: Create `.env.local`**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

**Step 4: Add `.env.local` to `.gitignore`**

Append to `.gitignore`:
```
.env.local
```

**Step 5: Create Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 6: Commit**

```bash
git add src/lib/supabase.ts .gitignore package.json package-lock.json
git commit -m "feat: add Supabase client SDK and env config"
```

---

### Task 1: Database Schema & RLS Policies

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

This runs in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

**Step 1: Create the migration file locally for reference**

```sql
-- invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  slug text unique,
  event_type text not null,
  template_id text not null,
  status text not null default 'draft',
  form_data jsonb not null,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_invitations_slug on public.invitations(slug);
create index idx_invitations_user on public.invitations(user_id);

-- invitation_images
create table public.invitation_images (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references public.invitations on delete cascade not null,
  storage_path text not null,
  display_order int not null default 0,
  type text not null,
  created_at timestamptz default now()
);

-- rsvps
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references public.invitations on delete cascade not null,
  guest_name text not null,
  status text not null,
  phone text,
  created_at timestamptz default now()
);

create index idx_rsvps_invitation on public.rsvps(invitation_id);

-- payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  invitation_id uuid references public.invitations on delete cascade not null,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  amount int not null,
  plan_duration int not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- RLS
alter table public.invitations enable row level security;
alter table public.invitation_images enable row level security;
alter table public.rsvps enable row level security;
alter table public.payments enable row level security;

-- Invitations: owner CRUD
create policy "Users manage own invitations" on public.invitations
  for all using (auth.uid() = user_id);

-- Invitations: public read active
create policy "Public read active invitations" on public.invitations
  for select using (status = 'active' and expires_at > now());

-- Images: owner CRUD
create policy "Users manage own images" on public.invitation_images
  for all using (
    invitation_id in (select id from public.invitations where user_id = auth.uid())
  );

-- Images: public read for active invitations
create policy "Public read images for active" on public.invitation_images
  for select using (
    invitation_id in (select id from public.invitations where status = 'active' and expires_at > now())
  );

-- RSVPs: public insert for active invitations
create policy "Public insert rsvps" on public.rsvps
  for insert with check (
    invitation_id in (select id from public.invitations where status = 'active')
  );

-- RSVPs: owner reads
create policy "Owners read rsvps" on public.rsvps
  for select using (
    invitation_id in (select id from public.invitations where user_id = auth.uid())
  );

-- Payments: owner only
create policy "Users manage own payments" on public.payments
  for all using (auth.uid() = user_id);
```

**Step 2: Run in Supabase SQL Editor**

Go to Dashboard → SQL Editor → paste the SQL → Run.

**Step 3: Create Storage bucket**

Go to Dashboard → Storage → New bucket:
- Name: `invitation-images`
- Public: Yes (images need to be viewable by guests)
- File size limit: 5MB

Add storage policy:
- Public read: Allow `select` for all
- Authenticated upload: Allow `insert` for authenticated users where `bucket_id = 'invitation-images'`

**Step 4: Enable Google OAuth**

Go to Dashboard → Authentication → Providers → Google:
- Enable Google provider
- Add OAuth credentials from Google Cloud Console
- Set redirect URL to `http://localhost:3001` (dev) and your production URL

**Step 5: Commit migration file**

```bash
mkdir -p supabase/migrations
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add database schema and RLS policies"
```

---

### Task 2: Auth Context & Google OAuth

**Files:**
- Create: `src/lib/auth.tsx`
- Modify: `src/router.tsx` (wrap with AuthProvider)
- Modify: `src/layouts/MainLayout.tsx` (add login button to navbar conditionally)

**Step 1: Create auth context**

Create `src/lib/auth.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/pricing' },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

**Step 2: Wrap router with AuthProvider**

Modify `src/router.tsx` — wrap the `RouterProvider` or the root layout with `<AuthProvider>`.

In the root component that renders `<RouterProvider>`, wrap it:

```typescript
import { AuthProvider } from './lib/auth';

// In the App/root component:
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

**Step 3: Commit**

```bash
git add src/lib/auth.tsx src/router.tsx
git commit -m "feat: add Google OAuth with AuthProvider context"
```

---

### Task 3: Invitation Service (Save to Supabase)

**Files:**
- Create: `src/lib/invitations.ts`

**Step 1: Create invitation service**

Create `src/lib/invitations.ts`:

```typescript
import { supabase } from './supabase';

interface FormData {
  eventType: string;
  person1Name: string;
  person2Name?: string;
  date: string;
  time?: string;
  address?: string;
  location?: string;
  coords?: { lat: number; lng: number };
  parents?: Record<string, string | null> | null;
  images?: string[];
  [key: string]: unknown;
}

function generateSlug(formData: FormData): string {
  const { eventType, person1Name, person2Name } = formData;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const coupleEvents = ['wedding', 'betrothal'];
  if (coupleEvents.includes(eventType) && person2Name) {
    return `${clean(person1Name)}-and-${clean(person2Name)}`;
  }

  const eventLabels: Record<string, string> = {
    birthday: 'birthday',
    baptism: 'baptism',
    holy_communion: 'holy-communion',
    naming_ceremony: 'naming-ceremony',
    baby_shower: 'baby-shower',
    housewarming: 'housewarming',
  };

  const label = eventLabels[eventType] ?? eventType;
  return `${clean(person1Name)}-${label}`;
}

async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function saveInvitation({
  userId,
  formData,
  templateId,
}: {
  userId: string;
  formData: FormData;
  templateId: string;
}) {
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      user_id: userId,
      event_type: formData.eventType,
      template_id: templateId,
      status: 'draft',
      form_data: formData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function publishInvitation(invitationId: string, planDuration: number) {
  const { data: invitation } = await supabase
    .from('invitations')
    .select('form_data')
    .eq('id', invitationId)
    .single();

  if (!invitation) throw new Error('Invitation not found');

  const baseSlug = generateSlug(invitation.form_data as FormData);
  const slug = await getUniqueSlug(baseSlug);

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + planDuration);

  const { data, error } = await supabase
    .from('invitations')
    .update({
      slug,
      status: 'active',
      published_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', invitationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInvitationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*, invitation_images(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data;
}

export async function getUserInvitations(userId: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*, rsvps(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function submitRsvp(invitationId: string, guestName: string, status: 'attending' | 'declined', phone?: string) {
  const { data, error } = await supabase
    .from('rsvps')
    .insert({ invitation_id: invitationId, guest_name: guestName, status, phone });

  if (error) throw error;
  return data;
}

export async function getRsvps(invitationId: string) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

**Step 2: Commit**

```bash
git add src/lib/invitations.ts
git commit -m "feat: add invitation service with slug generation and RSVP"
```

---

### Task 4: Image Upload Service

**Files:**
- Create: `src/lib/storage.ts`

**Step 1: Create storage service**

Create `src/lib/storage.ts`:

```typescript
import { supabase } from './supabase';

export async function uploadInvitationImage({
  userId,
  invitationId,
  file,
  type,
  displayOrder,
}: {
  userId: string;
  invitationId: string;
  file: File;
  type: 'profile_person1' | 'profile_person2' | 'gallery';
  displayOrder: number;
}) {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${invitationId}/${type}-${displayOrder}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('invitation-images')
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase
    .from('invitation_images')
    .insert({
      invitation_id: invitationId,
      storage_path: path,
      display_order: displayOrder,
      type,
    });

  if (dbError) throw dbError;

  return path;
}

export function getImageUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('invitation-images')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function uploadAllImages({
  userId,
  invitationId,
  images,
}: {
  userId: string;
  invitationId: string;
  images: { file: File; type: 'profile_person1' | 'profile_person2' | 'gallery' }[];
}) {
  const results = [];
  for (let i = 0; i < images.length; i++) {
    const { file, type } = images[i];
    const path = await uploadInvitationImage({
      userId,
      invitationId,
      file,
      type,
      displayOrder: i,
    });
    results.push(path);
  }
  return results;
}
```

**Step 2: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add image upload service for Supabase Storage"
```

---

### Task 5: Razorpay Edge Functions

**Files:**
- Create: `supabase/functions/create-order/index.ts`
- Create: `supabase/functions/verify-payment/index.ts`

These are deployed via Supabase CLI: `supabase functions deploy create-order` and `supabase functions deploy verify-payment`.

**Step 1: Create `create-order` edge function**

Create `supabase/functions/create-order/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Unauthorized');

    const { invitation_id, plan_id, amount, plan_duration } = await req.json();

    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

    // Create Razorpay order
    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount: amount * 100, // paise
        currency: 'INR',
        receipt: `inv_${invitation_id}_${plan_id}`,
      }),
    });

    const order = await rpRes.json();

    // Save pending payment
    await supabase.from('payments').insert({
      user_id: user.id,
      invitation_id,
      razorpay_order_id: order.id,
      amount: amount * 100,
      plan_duration,
      status: 'pending',
    });

    return new Response(JSON.stringify({ order_id: order.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**Step 2: Create `verify-payment` edge function**

Create `supabase/functions/verify-payment/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Unauthorized');

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Verify signature
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Get payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (!payment) throw new Error('Payment not found');

    // Update payment status
    await supabase
      .from('payments')
      .update({ razorpay_payment_id, status: 'paid' })
      .eq('id', payment.id);

    // Generate slug and publish invitation
    const { data: invitation } = await supabase
      .from('invitations')
      .select('form_data')
      .eq('id', payment.invitation_id)
      .single();

    const formData = invitation!.form_data as any;
    const baseSlug = generateSlug(formData);
    const slug = await getUniqueSlug(supabase, baseSlug);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + payment.plan_duration);

    await supabase
      .from('invitations')
      .update({
        slug,
        status: 'active',
        published_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', payment.invitation_id);

    return new Response(JSON.stringify({ slug, expires_at: expiresAt.toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSlug(formData: any): string {
  const { eventType, person1Name, person2Name } = formData;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (['wedding', 'betrothal'].includes(eventType) && person2Name) {
    return `${clean(person1Name)}-and-${clean(person2Name)}`;
  }

  const labels: Record<string, string> = {
    birthday: 'birthday', baptism: 'baptism', holy_communion: 'holy-communion',
    naming_ceremony: 'naming-ceremony', baby_shower: 'baby-shower', housewarming: 'housewarming',
  };
  return `${clean(person1Name)}-${labels[eventType] ?? eventType}`;
}

async function getUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}
```

**Step 3: Set Edge Function secrets in Supabase Dashboard**

Go to Dashboard → Edge Functions → Secrets:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

**Step 4: Commit**

```bash
git add supabase/functions/
git commit -m "feat: add Razorpay edge functions (create-order, verify-payment)"
```

---

### Task 6: Razorpay Checkout on PricingPage

**Files:**
- Modify: `src/pages/PricingPage.tsx` (add Razorpay checkout flow)
- Modify: `index.html` (add Razorpay script)

**Step 1: Add Razorpay script to index.html**

Add before `</head>`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Step 2: Create payment hook**

Create `src/lib/payments.ts`:

```typescript
import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  invitationId: string;
  planId: string;
  amount: number;
  planDuration: number;
  userEmail: string;
  onSuccess: (data: { slug: string; expires_at: string }) => void;
  onFailure: (error: string) => void;
}

export async function initiatePayment({
  invitationId,
  planId,
  amount,
  planDuration,
  userEmail,
  onSuccess,
  onFailure,
}: PaymentOptions) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // Create order via edge function
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { invitation_id: invitationId, plan_id: planId, amount, plan_duration: planDuration },
    });

    if (error) throw error;

    // Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'InvitationAI',
      description: `Invitation - ${planId}`,
      order_id: data.order_id,
      prefill: { email: userEmail },
      theme: { color: '#B8405E' },
      handler: async (response: any) => {
        // Verify payment via edge function
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
          body: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
        });

        if (verifyError) {
          onFailure(verifyError.message);
          return;
        }

        onSuccess(verifyData);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error.description);
    });
    rzp.open();
  } catch (err) {
    onFailure((err as Error).message);
  }
}
```

**Step 3: Modify PricingPage to use Razorpay**

In `src/pages/PricingPage.tsx`, the Individual Plan "Proceed" button currently links to `/`. Replace it with:

1. Import `useAuth` and `initiatePayment`
2. On "Proceed" click:
   - If not logged in → call `signInWithGoogle()` (save selected plan to sessionStorage)
   - If logged in → save invitation to DB (from sessionStorage form data) → call `initiatePayment()`
3. On payment success → navigate to `/dashboard`

The key changes to the Individual Plan card's CTA button:

```typescript
import { useAuth } from '../lib/auth';
import { initiatePayment } from '../lib/payments';
import { saveInvitation } from '../lib/invitations';

// Inside component:
const { user, signInWithGoogle } = useAuth();
const navigate = useNavigate();
const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS.find(p => p.preferred)!);
const [processing, setProcessing] = useState(false);

const handleProceed = async () => {
  if (!user) {
    sessionStorage.setItem('pendingPlan', JSON.stringify(selectedPlan));
    await signInWithGoogle();
    return;
  }

  setProcessing(true);
  try {
    const formDataStr = sessionStorage.getItem('inviteFormData');
    const templateStr = sessionStorage.getItem('inviteSelectedTemplate');
    if (!formDataStr) {
      navigate('/');
      return;
    }

    const formData = JSON.parse(formDataStr);
    const template = templateStr ? JSON.parse(templateStr) : { id: 'midnight' };

    // Save invitation as draft
    const invitation = await saveInvitation({
      userId: user.id,
      formData,
      templateId: template.id,
    });

    // Initiate Razorpay
    await initiatePayment({
      invitationId: invitation.id,
      planId: selectedPlan.id,
      amount: selectedPlan.price,
      planDuration: selectedPlan.duration,
      userEmail: user.email!,
      onSuccess: ({ slug }) => {
        sessionStorage.removeItem('inviteFormData');
        sessionStorage.removeItem('inviteSelectedTemplate');
        sessionStorage.removeItem('pendingPlan');
        navigate('/dashboard');
      },
      onFailure: (error) => {
        alert(`Payment failed: ${error}`);
        setProcessing(false);
      },
    });
  } catch (err) {
    alert(`Error: ${(err as Error).message}`);
    setProcessing(false);
  }
};
```

Replace the Individual Plan's CTA `<Link>` with:
```tsx
<button onClick={handleProceed} disabled={processing}>
  {processing ? 'Processing...' : 'Proceed to Pay'}
</button>
```

**Step 4: Handle post-OAuth redirect**

After Google OAuth redirects back to `/pricing`, check for pending plan in sessionStorage and auto-proceed:

```typescript
useEffect(() => {
  if (user) {
    const pendingPlan = sessionStorage.getItem('pendingPlan');
    if (pendingPlan) {
      setSelectedPlan(JSON.parse(pendingPlan));
      // Auto-trigger payment after brief delay
      setTimeout(() => handleProceed(), 500);
    }
  }
}, [user]);
```

**Step 5: Commit**

```bash
git add src/lib/payments.ts src/pages/PricingPage.tsx index.html
git commit -m "feat: integrate Razorpay checkout on pricing page"
```

---

### Task 7: Published Invitation Page (Guest View)

**Files:**
- Create: `src/pages/InvitationPage.tsx`
- Modify: `src/router.tsx` (add `/i/:slug` route)

**Step 1: Create InvitationPage**

Create `src/pages/InvitationPage.tsx`:

This reuses the same rendering logic as `PreviewPage.tsx` but:
- Fetches data from Supabase by slug (not sessionStorage)
- No "Activate Now" banner
- No "Change Theme" button
- No floating bottom bar
- RSVP saves to database
- Images loaded from Supabase Storage

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Cake, Church, Baby, Home, CalendarPlus, MapPin, Share2, CheckCircle2 } from 'lucide-react';
import { getEventByType, type EventType } from '../constants/events';
import CountdownTimer from '../components/CountdownTimer';
import CinematicGallery from '../components/CinematicGallery';
import VenueMap from '../components/VenueMap';
import Shagun from '../components/Shagun';
import { getInvitationBySlug, submitRsvp } from '../lib/invitations';
import { getImageUrl } from '../lib/storage';

// Copy formatDate, formatTime, generateICS from PreviewPage.tsx (lines 66-111)
// Copy EVENT_ICONS map from PreviewPage.tsx (lines 41-50)

export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending' | 'declined'>('none');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [showRsvpForm, setShowRsvpForm] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getInvitationBySlug(slug)
      .then((data) => {
        setInvitation(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Invitation not found or has expired');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (error || !invitation) return <ErrorScreen message={error ?? 'Not found'} />;

  const formData = invitation.form_data;
  const eventConfig = getEventByType(formData.eventType as EventType);
  const images = invitation.invitation_images?.map((img: any) => getImageUrl(img.storage_path)) ?? [];

  const handleRsvp = async (status: 'attending' | 'declined') => {
    if (!rsvpName.trim()) return;
    await submitRsvp(invitation.id, rsvpName.trim(), status, rsvpPhone || undefined);
    setRsvpStatus(status);
    setShowRsvpForm(false);
  };

  // Render same sections as PreviewPage:
  // Hero, Gallery, Countdown, Venue, Shagun, Action Buttons, Footer
  // But NO upgrade banner, NO bottom bar, NO "Activate Now"
  // RSVP button opens a form modal that saves to DB

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF8', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Hero Section — same as PreviewPage lines 262-294 */}
      {/* Gallery — use images from Supabase Storage */}
      {/* Countdown */}
      {/* Venue Map */}
      {/* Shagun */}
      {/* Action Buttons — RSVP opens form, others same as PreviewPage */}
      {/* Footer — simple, no branding link */}

      {/* RSVP Modal */}
      {showRsvpForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 360, width: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>RSVP</h3>
            <input
              placeholder="Your Name"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 12, fontSize: 14 }}
            />
            <input
              placeholder="Phone (optional)"
              value={rsvpPhone}
              onChange={(e) => setRsvpPhone(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16, fontSize: 14 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => handleRsvp('attending')}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Attending
              </button>
              <button
                onClick={() => handleRsvp('declined')}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Can't Make It
              </button>
            </div>
            <button
              onClick={() => setShowRsvpForm(false)}
              style={{ width: '100%', marginTop: 12, padding: '8px 0', border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFBF8' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Heart style={{ width: 32, height: 32, color: '#B8405E' }} />
      </motion.div>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFBF8', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Oops!</h1>
      <p style={{ fontSize: 15, color: '#64748b' }}>{message}</p>
    </div>
  );
}
```

**Note:** The actual Hero, Gallery, Countdown, Venue, Shagun, and Action Button rendering should be copied from `PreviewPage.tsx` (lines 262-395) with these modifications:
- Replace `formData` from sessionStorage with `invitation.form_data`
- Replace hardcoded sample images with Supabase Storage URLs
- Replace RSVP toggle with `setShowRsvpForm(true)`
- Remove all "Activate Now" and "Change Theme" buttons

**Step 2: Add route to router**

Modify `src/router.tsx` — add inside the routes array:

```typescript
{
  path: '/i/:slug',
  lazy: () => import('./pages/InvitationPage'),
}
```

This route should be **outside** the MainLayout (no navbar/footer for guests).

**Step 3: Commit**

```bash
git add src/pages/InvitationPage.tsx src/router.tsx
git commit -m "feat: add published invitation page at /i/:slug"
```

---

### Task 8: Host Dashboard

**Files:**
- Create: `src/pages/DashboardPage.tsx`
- Modify: `src/router.tsx` (uncomment and update dashboard route)

**Step 1: Install QR code library**

Run: `npm install qrcode.react`

**Step 2: Create DashboardPage**

Create `src/pages/DashboardPage.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Share2, Edit3, RefreshCw, Users, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../lib/auth';
import { getUserInvitations, getRsvps } from '../lib/invitations';

interface Invitation {
  id: string;
  slug: string | null;
  event_type: string;
  status: string;
  form_data: any;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  rsvps: { count: number }[];
}

interface Rsvp {
  id: string;
  guest_name: string;
  status: string;
  phone: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }
    if (user) {
      getUserInvitations(user.id).then((data) => {
        setInvitations(data ?? []);
        if (data?.length) setSelectedInvitation(data[0]);
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedInvitation?.id) {
      getRsvps(selectedInvitation.id).then((data) => setRsvps(data ?? []));
    }
  }, [selectedInvitation?.id]);

  if (authLoading || loading) return <LoadingDashboard />;

  const inv = selectedInvitation;
  const baseUrl = window.location.origin;
  const invitationUrl = inv?.slug ? `${baseUrl}/i/${inv.slug}` : null;
  const attending = rsvps.filter(r => r.status === 'attending').length;
  const declined = rsvps.filter(r => r.status === 'declined').length;

  const copyLink = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    if (invitationUrl) {
      const text = encodeURIComponent(`You're invited! View the invitation: ${invitationUrl}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const isExpired = inv?.expires_at ? new Date(inv.expires_at) < new Date() : false;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF8', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>My Dashboard</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>{user?.email}</span>
          <button onClick={signOut} style={{ fontSize: 13, color: '#B8405E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {invitations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No invitations yet</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, background: '#B8405E', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Create Your First Invitation
            </button>
          </div>
        ) : (
          <>
            {/* Invitation Card */}
            {inv && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                {/* Status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                    {inv.form_data.person1Name}
                    {inv.form_data.person2Name ? ` & ${inv.form_data.person2Name}` : ''}'s{' '}
                    {inv.event_type.charAt(0).toUpperCase() + inv.event_type.slice(1)}
                  </h2>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999,
                    background: inv.status === 'active' && !isExpired ? '#DCFCE7' : '#FEE2E2',
                    color: inv.status === 'active' && !isExpired ? '#166534' : '#991B1B',
                  }}>
                    {isExpired ? 'Expired' : inv.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </div>

                {/* Link + QR */}
                {invitationUrl && (
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                    <QRCodeSVG value={invitationUrl} size={120} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Your invitation link</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                        <span style={{ fontSize: 13, color: '#1e293b', flex: 1, wordBreak: 'break-all' }}>{invitationUrl}</span>
                        <button onClick={copyLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                          {copied ? <Check style={{ width: 18, height: 18, color: '#22c55e' }} /> : <Copy style={{ width: 18, height: 18 }} />}
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <button onClick={shareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <Share2 style={{ width: 14, height: 14 }} /> WhatsApp
                        </button>
                        <a href={invitationUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                          <ExternalLink style={{ width: 14, height: 14 }} /> View
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expiry */}
                {inv.expires_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Calendar style={{ width: 14, height: 14, color: '#64748b' }} />
                    <span style={{ fontSize: 13, color: '#64748b' }}>
                      Expires: {new Date(inv.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {isExpired && (
                      <button
                        onClick={() => navigate('/pricing')}
                        style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: '#B8405E', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Renew
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RSVP Section */}
            {inv && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                    <Users style={{ width: 18, height: 18, display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                    RSVPs
                  </h3>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{attending} attending</span>
                    <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>{declined} declined</span>
                  </div>
                </div>

                {rsvps.length === 0 ? (
                  <p style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>No RSVPs yet. Share your invitation link!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rsvps.map((r) => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: '#f8fafc' }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{r.guest_name}</p>
                          {r.phone && <p style={{ fontSize: 12, color: '#94a3b8' }}>{r.phone}</p>}
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999,
                          background: r.status === 'attending' ? '#DCFCE7' : '#FEE2E2',
                          color: r.status === 'attending' ? '#166534' : '#991B1B',
                        }}>
                          {r.status === 'attending' ? 'Attending' : 'Declined'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LoadingDashboard() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFBF8' }}>
      <RefreshCw style={{ width: 24, height: 24, color: '#B8405E', animation: 'spin 1s linear infinite' }} />
    </div>
  );
}
```

**Step 3: Update router**

In `src/router.tsx`, uncomment the dashboard route and add it as a protected route:

```typescript
{
  path: '/dashboard',
  lazy: () => import('./pages/DashboardPage'),
}
```

**Step 4: Commit**

```bash
npm install qrcode.react
git add src/pages/DashboardPage.tsx src/router.tsx package.json package-lock.json
git commit -m "feat: add host dashboard with QR code, RSVP list, and share"
```

---

### Task 9: Update MainLayout & Navbar for Auth State

**Files:**
- Modify: `src/layouts/MainLayout.tsx` (hide nav/footer on `/i/:slug` too)
- Modify: `src/components/Navbar.tsx` (add login/dashboard button)

**Step 1: Update MainLayout to hide nav on `/i/:slug`**

In `src/layouts/MainLayout.tsx`, change the `hideNavFooter` check:

```typescript
const hideNavFooter = ['/chatbot', '/preview', '/dashboard'].includes(location.pathname)
  || location.pathname.startsWith('/i/');
```

**Step 2: Add auth-aware button to Navbar**

In the Navbar component, add a conditional button:

```typescript
import { useAuth } from '../lib/auth';

// Inside Navbar:
const { user } = useAuth();

// In the nav items area, add:
{user ? (
  <Link to="/dashboard" style={{ ... }}>Dashboard</Link>
) : null}
```

**Step 3: Commit**

```bash
git add src/layouts/MainLayout.tsx src/components/Navbar.tsx
git commit -m "feat: update layout and navbar for auth state and guest routes"
```

---

### Task 10: Wire "Activate Now" Flow End-to-End

**Files:**
- Modify: `src/pages/PreviewPage.tsx` (pass invitation data to pricing)

**Step 1: Update "Activate Now" in PreviewPage**

The "Activate Now" buttons in `PreviewPage.tsx` currently do `navigate('/pricing')`. Update them to ensure form data and template are saved to sessionStorage before navigating:

```typescript
const handleActivate = () => {
  // Data is already in sessionStorage from chatbot flow
  // Just navigate to pricing
  navigate('/pricing');
};
```

This already works since `ChatbotPage.handleComplete` saves to sessionStorage. No changes needed here — just verify the flow works.

**Step 2: Handle returning from Google OAuth**

In `PricingPage.tsx`, after Google OAuth redirect, the user lands back on `/pricing`. The `useEffect` from Task 6 checks for `pendingPlan` in sessionStorage and auto-triggers payment.

**Step 3: Test the full flow**

```
1. EventPage → "Create Website" → TryItFreeModal → TemplateOverlay → select template
2. Chatbot → fill all steps → "Continue"
3. PreviewPage → "Activate Now"
4. PricingPage → select plan → "Proceed to Pay"
5. Google OAuth popup → sign in
6. Redirected back to /pricing → Razorpay checkout opens
7. Pay → verify-payment edge function → invitation published
8. Redirected to /dashboard → see live link + QR code
9. Share link → guest visits /i/:slug → sees invitation → submits RSVP
10. Host refreshes dashboard → sees RSVP in list
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire end-to-end activate → auth → pay → publish → dashboard flow"
```
