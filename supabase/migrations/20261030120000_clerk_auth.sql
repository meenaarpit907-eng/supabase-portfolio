-- =============================================================================
-- Clerk as the identity provider (Supabase third-party auth)
--
-- The admin area now signs in with Clerk instead of Supabase Auth. Supabase is
-- configured with Clerk as a third-party auth provider, so PostgREST and
-- Storage accept Clerk session tokens (verified against Clerk's JWKS) and
-- auth.jwt() exposes their claims. Clerk's Supabase integration adds
-- "role": "authenticated" to session tokens, which maps requests to the
-- `authenticated` Postgres role; "sub" is the Clerk user ID (user_...), which
-- is text, not a uuid, and has no row in auth.users.
--
-- So admin membership is keyed by the Clerk user ID:
--   * public.admins.user_id becomes text, without the auth.users foreign key
--   * private.is_admin() compares it with auth.jwt()->>'sub'
--
-- Every content/storage policy calls private.is_admin(), so they pick up the
-- new definition without being recreated. auth.uid() is not used anywhere any
-- more: it casts "sub" to uuid and would fail on Clerk IDs.
-- =============================================================================

-- The old policy compares user_id with auth.uid(); drop it before the type change.
drop policy if exists "Users can see their own admin row" on public.admins;

alter table public.admins
  drop constraint if exists admins_user_id_fkey;

-- Existing rows (Supabase Auth uuids) are kept as text. They can never match a
-- Clerk session, so they grant nothing; delete them once you have added your
-- Clerk user ID.
alter table public.admins
  alter column user_id type text using user_id::text;

alter table public.admins
  add constraint admins_user_id_format
  check (char_length(user_id) between 1 and 255 and user_id !~ '\s');

comment on table public.admins is
  'Clerk user IDs (user_...) allowed to manage portfolio content. Insert rows from the SQL editor; there is deliberately no API write path.';
comment on column public.admins.user_id is
  'Clerk user ID, matched against the "sub" claim of the Clerk session token (auth.jwt()->>''sub'').';

-- A signed-in Clerk user can see only whether they themselves are an admin.
create policy "Users can see their own admin row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.jwt() ->> 'sub'));

-- security definer so policies can check admins without the caller needing
-- SELECT on the table; empty search_path so objects must be schema-qualified.
-- Only "sub" is trusted: it is set by Clerk and covered by the token
-- signature. Never metadata a user can edit.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select auth.jwt() ->> 'role') = 'authenticated'
    and exists (
      select 1
      from public.admins a
      where a.user_id = (select auth.jwt() ->> 'sub')
    ),
    false
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated, service_role;
