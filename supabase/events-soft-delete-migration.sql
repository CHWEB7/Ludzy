-- Run in Supabase SQL Editor if the events table already exists.
-- Soft delete: deleted events stay in the DB for 7 days, hidden from the public site.

alter table public.events
  add column if not exists deleted_at timestamptz;

create index if not exists events_deleted_at_idx
  on public.events (deleted_at)
  where deleted_at is not null;

drop policy if exists "Public read published events" on public.events;
create policy "Public read published events"
  on public.events for select
  to anon, authenticated
  using (published = true and deleted_at is null);

notify pgrst, 'reload schema';
