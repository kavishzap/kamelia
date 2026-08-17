-- Run this in the Supabase SQL editor (once).
-- Logs one row each time someone loads the Kamellia site.

create table if not exists public.device_visits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  ip_address text,
  user_agent text,
  platform text,
  os text,
  browser text,
  device_type text,
  language text,
  timezone text,
  screen_width integer,
  screen_height integer,
  viewport_width integer,
  viewport_height integer,
  pixel_ratio numeric,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists device_visits_tenant_created_at_idx
  on public.device_visits (tenant_id, created_at desc);

alter table public.device_visits enable row level security;
