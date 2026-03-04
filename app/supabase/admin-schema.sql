-- BAAM System R — Restaurant Premium
-- Supabase schema for The Meridian restaurant template.

create extension if not exists pgcrypto;

-- Sites
create table if not exists public.sites (
  id text primary key,
  name text not null,
  domain text,
  enabled boolean not null default true,
  default_locale text not null default 'en',
  supported_locales text[] not null default array['en']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site domains (multi-tenant host routing)
create table if not exists public.site_domains (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  domain text not null,
  environment text not null default 'prod',
  is_primary boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, domain, environment)
);

create index if not exists site_domains_domain_idx on public.site_domains (domain);

-- Admin users
create table if not exists public.admin_users (
  id text primary key,
  email text not null unique,
  name text not null,
  role text not null,
  sites text[] not null default '{}'::text[],
  avatar text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

-- Media assets (Supabase Storage references)
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  path text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, path)
);

-- Admin audit logs
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id text,
  actor_email text,
  action text not null,
  site_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Content entries (DB-first CMS storage)
create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  locale text not null,
  path text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text,
  unique (site_id, locale, path)
);

-- Content revisions (audit trail for content changes)
create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.content_entries(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  created_by text,
  note text
);

-- Seed meridian-diner site
insert into public.sites (id, name, domain, enabled, default_locale, supported_locales)
values ('meridian-diner', 'The Meridian', 'themeridian.com', true, 'en', array['en','zh','es']::text[])
on conflict (id) do nothing;

insert into public.site_domains (site_id, domain, environment, is_primary, enabled)
values
  ('meridian-diner', 'localhost', 'dev', true, true),
  ('meridian-diner', 'themeridian.com', 'prod', true, true)
on conflict (site_id, domain, environment) do nothing;
