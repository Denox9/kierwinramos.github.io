-- =====================================================================
-- RX DESIGN ARCHIVE // SUPABASE SCHEMA
-- Run once in Supabase → SQL Editor → New query → Run
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 01 / ADMINS  — only users listed here can upload / edit
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- (no policies = nobody can read/write this table through the API)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 02 / PROJECTS
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (code ~ '^[A-Z0-9-]{3,24}$'),
  title       text not null,
  category    text not null default 'other'
              check (category in ('ppt','logo','infographic','branding','ui','other')),
  client      text,
  year        int,
  summary     text,
  problem     text,
  direction   text,
  result      text,
  tags        text[] not null default '{}',
  cover_url   text,
  cover_path  text,
  featured    boolean not null default false,
  status      text not null default 'draft' check (status in ('draft','published')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status, featured, sort_order);

-- ---------------------------------------------------------------------
-- 03 / PROJECT IMAGES (gallery)
-- ---------------------------------------------------------------------
create table if not exists public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  url         text not null,
  path        text not null,
  caption     text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 04 / PRIVILEGES + ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
grant select on public.projects, public.project_images to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images to authenticated;

alter table public.projects       enable row level security;
alter table public.project_images enable row level security;

drop policy if exists "public read published"   on public.projects;
drop policy if exists "admin insert projects"   on public.projects;
drop policy if exists "admin update projects"   on public.projects;
drop policy if exists "admin delete projects"   on public.projects;

create policy "public read published" on public.projects
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());
create policy "admin insert projects" on public.projects
  for insert to authenticated with check (public.is_admin());
create policy "admin update projects" on public.projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete projects" on public.projects
  for delete to authenticated using (public.is_admin());

drop policy if exists "public read images"  on public.project_images;
drop policy if exists "admin insert images" on public.project_images;
drop policy if exists "admin update images" on public.project_images;
drop policy if exists "admin delete images" on public.project_images;

create policy "public read images" on public.project_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and (p.status = 'published' or public.is_admin())
  ));
create policy "admin insert images" on public.project_images
  for insert to authenticated with check (public.is_admin());
create policy "admin update images" on public.project_images
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete images" on public.project_images
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- 05 / STORAGE BUCKET  (public read via URL, admin-only write)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 15728640,
        array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio admin insert" on storage.objects;
drop policy if exists "portfolio admin update" on storage.objects;
drop policy if exists "portfolio admin delete" on storage.objects;

create policy "portfolio admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

-- =====================================================================
-- 06 / MAKE YOURSELF ADMIN  (run AFTER creating your user in
--      Authentication → Users → Add user). Replace the email.
-- =====================================================================
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
