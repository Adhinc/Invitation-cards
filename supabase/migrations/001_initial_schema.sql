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
