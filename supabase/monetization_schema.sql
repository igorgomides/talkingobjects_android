-- Monetization Schema (Stripe Integration)

-- 1. Transactions Table (Audit Log)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_session_id text unique not null,
  amount_paid integer not null, -- In cents (e.g., 2900 for R$ 29,00)
  credits_added integer not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.transactions enable row level security;

-- 3. RLS Policies
-- Users can view their own transactions
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- Only Service Role (Server Actions/Webhooks) can insert/update
-- (Implicitly denied for anon/authenticated roles unless defined)
