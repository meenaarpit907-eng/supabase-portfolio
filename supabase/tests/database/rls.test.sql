-- pgTAP tests for Row Level Security. Run with: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;

select plan(36);

-- ---------------------------------------------------------------------------
-- Fixtures (as postgres)
-- ---------------------------------------------------------------------------
-- Users come from Clerk, so there are no auth.users rows: identity is the
-- "sub" claim of the Clerk session token (a text user ID, not a uuid).
insert into public.admins (user_id) values ('user_2admin0000000000000000000');

insert into public.projects (id, slug, title, summary, published)
values ('00000000-0000-4000-b000-000000000001', 'secret-draft', 'Secret draft', 'Not yet published', false);

insert into public.skills (category, name, published) values ('Hidden', 'Unpublished skill', false);

insert into public.contact_messages (name, email, message)
values ('Existing', 'existing@example.test', 'An earlier message for the inbox.');

-- ---------------------------------------------------------------------------
-- Structure
-- ---------------------------------------------------------------------------
select is(
  (select count(*)::int from pg_class c
   where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and not c.relrowsecurity),
  0,
  'RLS is enabled on every table in public'
);

select ok(
  (select prosecdef from pg_proc where oid = 'private.is_admin()'::regprocedure),
  'private.is_admin() is security definer'
);

select ok(
  (select proconfig @> array['search_path=""'] from pg_proc where oid = 'private.is_admin()'::regprocedure),
  'private.is_admin() pins an empty search_path'
);

select col_type_is('public', 'admins', 'user_id', 'text', 'admins are keyed by text Clerk user IDs');

select hasnt_fk('public', 'admins', 'admins no longer reference auth.users');

select has_trigger('public', 'contact_messages', 'contact_messages_notify', 'contact notification trigger exists');
select has_trigger('public', 'projects', 'projects_set_updated_at', 'projects updated_at trigger exists');

-- ---------------------------------------------------------------------------
-- anon (website visitor)
-- ---------------------------------------------------------------------------
set local role anon;
set local request.jwt.claims to '{"role": "anon"}';

select ok(
  (select count(*) from public.projects) > 0,
  'anon can read published projects'
);

select is_empty(
  $$ select 1 from public.projects where slug = 'secret-draft' $$,
  'anon cannot see draft projects'
);

select is_empty(
  $$ select 1 from public.skills where published = false $$,
  'anon cannot see unpublished skills'
);

select is((select count(*)::int from public.profile), 1, 'anon can read the profile');

select throws_ok(
  $$ insert into public.projects (slug, title, summary, published) values ('hack', 'Hack', 'Nope', true) $$,
  '42501', null,
  'anon cannot insert projects'
);

select lives_ok(
  $$ insert into public.contact_messages (name, email, subject, message)
     values ('Visitor', 'visitor@example.test', 'Hello', 'I would like to talk about a role.') $$,
  'anon can send a contact message'
);

select throws_ok(
  $$ select * from public.contact_messages $$,
  '42501', null,
  'anon cannot read contact messages'
);

select throws_ok(
  $$ insert into public.contact_messages (name, email, message, read_at)
     values ('Sneaky', 'sneaky@example.test', 'Trying to set read_at.', now()) $$,
  '42501', null,
  'anon cannot set columns other than name/email/subject/message'
);

select throws_ok(
  $$ insert into public.admins (user_id) values ('user_2visitor00000000000000000') $$,
  '42501', null,
  'anon cannot add admins'
);

select is(private.is_admin(), false, 'anon is not an admin');

-- ---------------------------------------------------------------------------
-- Signed-in Clerk user who is not an admin (even with admin-looking claims
-- that a user could influence: public/unsafe metadata or an org role)
-- ---------------------------------------------------------------------------
reset role;
set local role authenticated;
set local request.jwt.claims to '{"sub": "user_2visitor00000000000000000", "role": "authenticated", "iss": "https://example.clerk.accounts.dev", "metadata": {"role": "admin"}, "user_metadata": {"role": "admin", "is_admin": true}, "o": {"id": "org_2x", "rol": "admin"}}';

select is(private.is_admin(), false, 'metadata and org claims do not make a Clerk user admin');

select is_empty(
  $$ select 1 from public.admins $$,
  'non-admin sees no admins rows'
);

select is_empty(
  $$ select 1 from public.projects where slug = 'secret-draft' $$,
  'non-admin cannot see draft projects'
);

select is_empty(
  $$ select 1 from public.contact_messages $$,
  'non-admin sees no contact messages'
);

select is_empty(
  $$ update public.projects set title = 'Defaced' returning id $$,
  'non-admin updates touch no projects'
);

select throws_ok(
  $$ insert into public.skills (category, name) values ('Hack', 'Injected') $$,
  '42501', null,
  'non-admin cannot insert skills'
);

select throws_ok(
  $$ insert into public.admins (user_id) values ('user_2visitor00000000000000000') $$,
  '42501', null,
  'non-admin cannot promote themselves'
);

select throws_ok(
  $$ insert into storage.objects (bucket_id, name, owner_id)
     values ('portfolio', 'projects/hack.png', 'user_2visitor00000000000000000') $$,
  '42501', null,
  'non-admin cannot upload to the portfolio bucket'
);

-- ---------------------------------------------------------------------------
-- Admin's "sub" claim, but without the role=authenticated claim that Clerk's
-- Supabase integration adds (integration not activated)
-- ---------------------------------------------------------------------------
reset role;
set local role anon;
set local request.jwt.claims to '{"sub": "user_2admin0000000000000000000"}';

select is(private.is_admin(), false, 'a token without role=authenticated is not an admin');

-- ---------------------------------------------------------------------------
-- admin (Clerk session token with the Supabase integration claims)
-- ---------------------------------------------------------------------------
reset role;
set local role authenticated;
set local request.jwt.claims to '{"sub": "user_2admin0000000000000000000", "role": "authenticated", "iss": "https://example.clerk.accounts.dev", "sid": "sess_2abc", "v": 2}';

select is(private.is_admin(), true, 'admins row with the Clerk user ID makes the user an admin');

select isnt_empty(
  $$ select 1 from public.projects where slug = 'secret-draft' $$,
  'admin can see draft projects'
);

select lives_ok(
  $$ insert into public.projects (slug, title, summary, published) values ('admin-new', 'New', 'Made by admin', true) $$,
  'admin can create projects'
);

select results_eq(
  $$ update public.projects set published = true where slug = 'secret-draft' returning slug $$,
  $$ values ('secret-draft'::text) $$,
  'admin can publish a draft'
);

select ok(
  (select count(*) from public.contact_messages) >= 2,
  'admin can read contact messages'
);

select results_eq(
  $$ update public.contact_messages set read_at = now() where email = 'existing@example.test' returning email $$,
  $$ values ('existing@example.test'::text) $$,
  'admin can mark a message as read'
);

select lives_ok(
  $$ insert into storage.objects (bucket_id, name, owner_id)
     values ('portfolio', 'projects/cover.png', 'user_2admin0000000000000000000') $$,
  'admin can upload to the portfolio bucket'
);

select is(
  (select count(*)::int from public.admins),
  1,
  'admin sees only their own admins row'
);

-- ---------------------------------------------------------------------------
-- Rate limit (as anon)
-- ---------------------------------------------------------------------------
reset role;
set local role anon;
set local request.jwt.claims to '{"role": "anon"}';

select lives_ok(
  $$ insert into public.contact_messages (name, email, message) values
       ('Spam', 'spam@example.test', 'Message number one.'),
       ('Spam', 'spam@example.test', 'Message number two.'),
       ('Spam', 'spam@example.test', 'Message number three.') $$,
  'three messages from one address are accepted'
);

select throws_ok(
  $$ insert into public.contact_messages (name, email, message) values ('Spam', 'SPAM@example.test', 'Message number four.') $$,
  'P0001', 'Too many messages from this address. Try again later.',
  'the fourth message within 10 minutes is rejected (case-insensitive)'
);

select * from finish();
rollback;
