-- Minimal events table only — run this if events-schema.sql fails partway through.
-- Supabase → SQL Editor → New query → paste all → Run

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_type text not null check (event_type in ('previous', 'upcoming')),
  slug text unique,
  title text not null,
  date_display text not null,
  event_date timestamptz,
  venue text,
  location text,
  maps_url text,
  time_display text,
  set_type text,
  excerpt text,
  summary text,
  details text,
  body jsonb not null default '[]'::jsonb,
  image_url text,
  gallery_images jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  sort_order int not null default 0,
  deleted_at timestamptz
);

alter table public.events enable row level security;

drop policy if exists "Public read published events" on public.events;
create policy "Public read published events"
  on public.events for select
  to anon, authenticated
  using (published = true and deleted_at is null);

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.events to anon, authenticated, service_role;
grant all on table public.events to service_role;

notify pgrst, 'reload schema';

-- Verify (should return one row with events):
-- select to_regclass('public.events') as events_table;
