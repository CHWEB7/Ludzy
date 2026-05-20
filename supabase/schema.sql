-- Run in Supabase → SQL Editor (run the whole script once).

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

-- Allow website/API inserts via anon key (when not using service role on server)
drop policy if exists "Allow anon insert booking_inquiries" on public.booking_inquiries;

create policy "Allow anon insert booking_inquiries"
  on public.booking_inquiries
  for insert
  to anon
  with check (true);

-- Explicit grants (some projects need these for anon inserts)
grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.booking_inquiries to anon, service_role;

-- View rows in Dashboard → Table Editor, or use service_role / authenticated policies later.
