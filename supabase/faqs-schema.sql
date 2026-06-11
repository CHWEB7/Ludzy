-- FAQs CMS — run in Supabase → SQL Editor (whole file once).

-- ─── Updated-at helper (safe if other schemas already created it) ───
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── FAQs table ───
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default false
);

create index if not exists faqs_published_idx
  on public.faqs (published, sort_order desc);

alter table public.faqs enable row level security;

drop policy if exists "Public read published faqs" on public.faqs;
create policy "Public read published faqs"
  on public.faqs for select
  to anon, authenticated
  using (published = true);

-- Writes go through API using service_role (after MFA-verified admin session check)

drop trigger if exists faqs_updated_at on public.faqs;
create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

grant select on table public.faqs to anon, authenticated, service_role;
grant all on table public.faqs to service_role;

notify pgrst, 'reload schema';
