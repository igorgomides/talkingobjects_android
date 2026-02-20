-- Analytics & Usage Logging Schema

-- 1. Usage Logs Table (Audit Trail)
-- Tracks every AI generation attempt, cost, and latency.
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action_type text not null check (action_type in ('script', 'image', 'video')),
  model_used text not null, -- e.g. 'veo-3.1', 'imagen-3.0'
  cost_tokens int, -- For text models
  cost_seconds int, -- For video/audio models
  credits_deducted int not null,
  latency_ms int not null,
  status text not null check (status in ('success', 'error')),
  error_message text,
  created_at timestamp with time zone default now()
);

-- Enable RLS for usage_logs
alter table public.usage_logs enable row level security;

-- RLS Policy: Users can NEVER write directly, only read their own logs (optional, or just restrict entirely).
-- For now, let's allow users to read their own logs if needed in the future, but writes are Server-Side only (Service Role).
create policy "Users can view their own usage logs" on public.usage_logs
  for select using (auth.uid() = user_id);

-- 2. Enhance Generations Table (Business Intelligence)
-- Adding metadata to track user behavior and content trends.
alter table public.generations 
add column if not exists meta_voice_style text, 
add column if not exists meta_language text,
add column if not exists is_viral_mode boolean default false;
