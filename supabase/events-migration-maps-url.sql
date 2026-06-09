-- Run if you already created public.events without maps_url
alter table public.events add column if not exists maps_url text;
