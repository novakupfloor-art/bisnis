-- Supabase SQL schema for login logs
-- Run this script in your Supabase project SQL editor

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists public.login_logs (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip inet not null,
  user_agent text,
  timestamp timestamptz not null default now(),
  success boolean not null
);

-- Optional: index on timestamp for faster queries
create index if not exists idx_login_logs_timestamp on public.login_logs (timestamp);
