-- Run this in the Supabase SQL editor (Dashboard → SQL).
-- Adjust types or add columns (e.g. budget, venue_name) as you like.

create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  event_type text not null,
  event_date date,
  message text not null
);

alter table public.booking_inquiries enable row level security;

-- Allow anonymous inserts from the website (anon key, server-side API route).
create policy "Allow anon insert booking_inquiries"
  on public.booking_inquiries
  for insert
  to anon
  with check (true);

-- No public reads — view rows only from the Supabase Dashboard or a future admin UI.
