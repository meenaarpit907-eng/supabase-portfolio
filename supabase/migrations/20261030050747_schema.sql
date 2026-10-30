-- =============================================================================
-- Portfolio schema
--
-- Content tables (profile, projects, skills, experience) are publicly readable
-- when published and writable only by an admin. contact_messages is write-only
-- for visitors and readable only by an admin.
--
-- "Admin" is defined by membership in public.admins, which only the database
-- owner (SQL editor / migrations / service role) can change. Nothing here trusts
-- JWT user_metadata, which users can edit themselves.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Private schema for helpers. It is NOT in the Data API's exposed schemas, so
-- these functions cannot be called over REST/RPC, only from policies/triggers.
-- -----------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;
-- Policies run as the calling role, so anon/authenticated need USAGE to
-- evaluate private.is_admin() inside a policy. They still cannot reach the
-- schema over the API.
grant usage on schema private to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Admins
-- -----------------------------------------------------------------------------
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Users allowed to manage portfolio content. Insert rows from the SQL editor; there is deliberately no API write path.';

-- security definer so policies can check admins without the caller needing
-- SELECT on the table; empty search_path so objects must be schema-qualified
-- and cannot be hijacked by a malicious search_path.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profile (single row)
-- -----------------------------------------------------------------------------
create table public.profile (
  id                 smallint primary key default 1 check (id = 1),
  full_name          text not null check (char_length(full_name) between 1 and 120),
  headline           text not null check (char_length(headline) between 1 and 200),
  bio                text not null default '' check (char_length(bio) <= 5000),
  location           text check (char_length(location) <= 120),
  email              text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  avatar_path        text check (char_length(avatar_path) <= 512),
  resume_path        text check (char_length(resume_path) <= 512),
  github_url         text check (github_url ~* '^https://'),
  linkedin_url       text check (linkedin_url ~* '^https://'),
  x_url              text check (x_url ~* '^https://'),
  website_url        text check (website_url ~* '^https://'),
  available_for_work boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.profile is 'Single-row table (id = 1) with the portfolio owner''s public profile.';

create trigger profile_set_updated_at
  before update on public.profile
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title            text not null check (char_length(title) between 1 and 120),
  summary          text not null check (char_length(summary) between 1 and 300),
  body             text not null default '' check (char_length(body) <= 20000),
  tech_stack       text[] not null default '{}' check (cardinality(tech_stack) <= 20),
  cover_image_path text check (char_length(cover_image_path) <= 512),
  repo_url         text check (repo_url ~* '^https://'),
  live_url         text check (live_url ~* '^https://'),
  featured         boolean not null default false,
  published        boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Public query: published projects ordered for the grid. Partial index keeps
-- drafts out of the index entirely.
create index projects_published_order_idx
  on public.projects (sort_order, created_at desc)
  where published;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Skills
-- -----------------------------------------------------------------------------
create table public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 60),
  category    text not null check (char_length(category) between 1 and 60),
  proficiency smallint not null default 3 check (proficiency between 1 and 5),
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (category, name)
);

create index skills_published_order_idx
  on public.skills (category, sort_order)
  where published;

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Experience
-- -----------------------------------------------------------------------------
create table public.experience (
  id          uuid primary key default gen_random_uuid(),
  company     text not null check (char_length(company) between 1 and 120),
  role        text not null check (char_length(role) between 1 and 120),
  location    text check (char_length(location) <= 120),
  company_url text check (company_url ~* '^https://'),
  start_date  date not null,
  end_date    date,
  summary     text not null default '' check (char_length(summary) <= 2000),
  highlights  text[] not null default '{}' check (cardinality(highlights) <= 12),
  tech_stack  text[] not null default '{}' check (cardinality(tech_stack) <= 20),
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint experience_dates_check check (end_date is null or end_date >= start_date)
);

create index experience_published_start_idx
  on public.experience (start_date desc)
  where published;

create trigger experience_set_updated_at
  before update on public.experience
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Contact messages
-- -----------------------------------------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 120),
  email      text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(btrim(message)) between 10 and 5000),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- Admin inbox: newest first; unread filter.
create index contact_messages_created_idx on public.contact_messages (created_at desc);
create index contact_messages_unread_idx on public.contact_messages (created_at desc) where read_at is null;
-- Supports the per-email rate limit lookup below.
create index contact_messages_email_created_idx on public.contact_messages (lower(email), created_at desc);

-- Database-side rate limit, independent of the web tier: at most 3 messages per
-- email address per 10 minutes and 50 messages overall per hour. Runs as
-- security definer because visitors cannot SELECT from this table.
create or replace function private.enforce_contact_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*)
    from public.contact_messages m
    where lower(m.email) = lower(new.email)
      and m.created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Too many messages from this address. Try again later.'
      using errcode = 'P0001', hint = 'rate_limited';
  end if;

  if (
    select count(*)
    from public.contact_messages m
    where m.created_at > now() - interval '1 hour'
  ) >= 50 then
    raise exception 'The contact form is busy. Try again later.'
      using errcode = 'P0001', hint = 'rate_limited';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_contact_rate_limit() from public;

create trigger contact_messages_rate_limit
  before insert on public.contact_messages
  for each row execute function private.enforce_contact_rate_limit();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- (select private.is_admin()) / (select auth.uid()) are wrapped in a subquery
-- so Postgres evaluates them once per statement (initPlan), not once per row.
-- -----------------------------------------------------------------------------
alter table public.admins           enable row level security;
alter table public.profile          enable row level security;
alter table public.projects         enable row level security;
alter table public.skills           enable row level security;
alter table public.experience       enable row level security;
alter table public.contact_messages enable row level security;

-- admins: a signed-in user can see only whether they themselves are an admin.
-- No insert/update/delete policies: membership is managed from SQL only.
create policy "Users can see their own admin row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

-- profile
create policy "Profile is public"
  on public.profile for select
  to anon, authenticated
  using (true);

create policy "Admins can insert the profile"
  on public.profile for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update the profile"
  on public.profile for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- projects / skills / experience: public sees published rows; admins see all.
create policy "Published projects are public; admins see drafts"
  on public.projects for select
  to anon, authenticated
  using (published or (select private.is_admin()));

create policy "Admins can insert projects"
  on public.projects for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using ((select private.is_admin()));

create policy "Published skills are public; admins see drafts"
  on public.skills for select
  to anon, authenticated
  using (published or (select private.is_admin()));

create policy "Admins can insert skills"
  on public.skills for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update skills"
  on public.skills for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete skills"
  on public.skills for delete
  to authenticated
  using ((select private.is_admin()));

create policy "Published experience is public; admins see drafts"
  on public.experience for select
  to anon, authenticated
  using (published or (select private.is_admin()));

create policy "Admins can insert experience"
  on public.experience for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update experience"
  on public.experience for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete experience"
  on public.experience for delete
  to authenticated
  using ((select private.is_admin()));

-- contact_messages: anyone may submit (but not pre-mark as read); only admins
-- can read, mark read, or delete.
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (read_at is null);

create policy "Admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admins can update contact messages"
  on public.contact_messages for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using ((select private.is_admin()));

-- -----------------------------------------------------------------------------
-- Grants (defense in depth on top of RLS)
-- Supabase grants ALL on new public tables to anon/authenticated by default.
-- Narrow that to what the policies actually need.
-- -----------------------------------------------------------------------------
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

revoke insert, update, delete, truncate, references, trigger on
  public.profile, public.projects, public.skills, public.experience
  from anon;

revoke all on public.contact_messages from anon, authenticated;
-- Visitors may only supply these columns; id/read_at/created_at use defaults.
grant insert (name, email, subject, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant update (read_at) on public.contact_messages to authenticated;
