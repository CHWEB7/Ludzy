-- Blogs CMS — run in Supabase → SQL Editor (whole file once).

-- ─── Updated-at helper (safe if events schema already created it) ───
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── Blogs table ───
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body jsonb not null default '[]'::jsonb,
  image_url text,
  gallery_images jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}'::text[],
  published boolean not null default false,
  sort_order int not null default 0,
  published_at timestamptz
);

create index if not exists blogs_published_idx
  on public.blogs (published, sort_order desc, published_at desc);

create index if not exists blogs_tags_idx
  on public.blogs using gin (tags);

alter table public.blogs enable row level security;

drop policy if exists "Public read published blogs" on public.blogs;
create policy "Public read published blogs"
  on public.blogs for select
  to anon, authenticated
  using (published = true);

-- Writes go through API using service_role (after MFA-verified admin session check)

-- ─── Updated-at trigger ───
drop trigger if exists blogs_updated_at on public.blogs;
create trigger blogs_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

grant select on table public.blogs to anon, authenticated, service_role;
grant all on table public.blogs to service_role;

notify pgrst, 'reload schema';
