-- =============================================================================
-- Certifications (e.g. from LinkedIn > Licenses & certifications).
-- Same pattern as the other content tables: visitors read published rows,
-- only admins (private.is_admin(), Clerk user IDs in public.admins) write.
-- The site hides the Certifications section while this table has no
-- published rows.
-- =============================================================================

create table public.certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 1 and 160),
  issuer         text not null check (char_length(issuer) between 1 and 120),
  issued_on      date,
  expires_on     date,
  credential_id  text check (char_length(credential_id) <= 200),
  credential_url text check (credential_url ~* '^https://'),
  skills         text[] not null default '{}' check (cardinality(skills) <= 20),
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint certifications_dates_check
    check (expires_on is null or issued_on is null or expires_on >= issued_on)
);

comment on table public.certifications is
  'Certificates shown in the Certifications section of the portfolio. Published rows are public.';

create index certifications_published_order_idx
  on public.certifications (sort_order, issued_on desc)
  where published;

create trigger certifications_set_updated_at
  before update on public.certifications
  for each row execute function private.set_updated_at();

alter table public.certifications enable row level security;

create policy "Published certifications are public; admins see drafts"
  on public.certifications for select
  to anon, authenticated
  using (published or (select private.is_admin()));

create policy "Admins can insert certifications"
  on public.certifications for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update certifications"
  on public.certifications for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete certifications"
  on public.certifications for delete
  to authenticated
  using ((select private.is_admin()));

revoke insert, update, delete, truncate, references, trigger on public.certifications from anon;
-- TRUNCATE is not covered by RLS, so signed-in users must not have it.
revoke truncate, references, trigger on public.certifications from authenticated;
