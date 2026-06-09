-- Events CMS — run in Supabase → SQL Editor after schema.sql
-- Also enable MFA: Authentication → Settings → Multi-Factor Authentication → TOTP

-- ─── Events table ───
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
  published boolean not null default false,
  sort_order int not null default 0
);

create index if not exists events_type_published_idx
  on public.events (event_type, published, sort_order desc, event_date desc);

alter table public.events enable row level security;

drop policy if exists "Public read published events" on public.events;
create policy "Public read published events"
  on public.events for select
  to anon, authenticated
  using (published = true);

-- Writes go through API using service_role (after MFA-verified admin session check)

-- ─── Updated-at trigger ───
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ─── Storage bucket for event images ───
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read event images" on storage.objects;
create policy "Public read event images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-images');

-- Upload/delete via service role in API routes only

grant select on table public.events to anon, authenticated, service_role;
grant all on table public.events to service_role;

-- Refresh PostgREST schema cache (fixes "table not found in schema cache" right after create)
notify pgrst, 'reload schema';
