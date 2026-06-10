-- Run in Supabase SQL Editor if you already created the events table.
-- Adds gallery support for previous event recap pages.

alter table public.events
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

-- Ensure event image bucket is public (fixes cover/gallery images not loading)
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read event images" on storage.objects;
create policy "Public read event images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-images');

notify pgrst, 'reload schema';
