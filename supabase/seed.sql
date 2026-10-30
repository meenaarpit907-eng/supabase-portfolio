-- =============================================================================
-- Seed data for local development (`supabase db reset` runs this file).
--
-- Real content only. The same content lives in src/content/placeholder.ts as
-- the offline fallback; a vitest test keeps ids, slugs and copy in sync.
-- Experience and certifications are empty until real entries are added; the
-- site hides empty sections.
--
-- seed.sql is NOT applied to hosted projects by `supabase db push`. To load it
-- into a hosted project, paste it into the SQL editor once (optional).
-- =============================================================================

-- Admins are Clerk user IDs (Clerk dashboard > Users > copy the user_... ID).
-- Add yours after `db reset` / `db push`, from the SQL editor or psql:
--   insert into public.admins (user_id) values ('user_xxxxxxxxxxxxxxxxxxxxxxxxxxx');

insert into public.profile (
  id, full_name, headline, bio, location, email, github_url, linkedin_url, available_for_work
) values (
  1,
  'Arpit Meena',
  'Full-stack developer building web apps with Next.js, Supabase, Clerk and Vercel.',
  $bio$I build web apps with Next.js, Supabase, Clerk and Vercel. My public repositories on GitHub show the work: the source of this site and TeamBoard, a multi-tenant team workspace.

Both projects use Clerk for sign-in and Supabase third-party auth, so Postgres Row Level Security trusts Clerk session tokens directly. Their schemas, policies, migrations and tests are all public.$bio$,
  'India',
  'meenaarpit907@gmail.com',
  'https://github.com/meenaarpit907-eng',
  'https://www.linkedin.com/in/arpit-meena-018a19341/',
  true
)
on conflict (id) do nothing;

insert into public.projects (
  id, slug, title, summary, body, tech_stack, repo_url, live_url, featured, published, sort_order
) values
(
  '6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0001',
  'supabase-portfolio',
  'Clerk + Supabase Portfolio',
  'This site: a Next.js 15 portfolio on Vercel with Clerk sign-in and Supabase Postgres, RLS and Storage.',
  $body$Every section of this site is a row in Postgres. Visitors read published rows through the Data API as the anon role; Row Level Security hides drafts and keeps contact messages write-only.

The /admin dashboard signs in with Clerk. Supabase trusts Clerk as a third-party auth provider, so the Clerk session token goes straight to Postgres with no JWT template or shared secret, and RLS reads the Clerk user ID from auth.jwt()->>'sub'. Admin rights come from a public.admins table of Clerk user IDs checked by a security definer function in a private schema, never from user-editable metadata.

Images and the resume live in a public Storage bucket whose upload, replace and delete policies only admins pass. The contact form stores messages in Supabase, where visitors can add a message but never read one back.

It deploys on Vercel: public pages are statically rendered with incremental revalidation, clerkMiddleware verifies sessions before /admin renders, and metadata, CSP and the custom domain come from environment variables. The pgTAP tests for the RLS policies and the Vitest unit tests are in the repository.$body$,
  array['Clerk', 'Supabase', 'Vercel', 'Postgres', 'RLS', 'Next.js 15', 'TypeScript', 'pgTAP', 'Vitest'],
  'https://github.com/meenaarpit907-eng/supabase-portfolio',
  'https://arpitm.me',
  true, true, 10
),
(
  '6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0002',
  'teamboard',
  'TeamBoard',
  'A multi-tenant team workspace built on Clerk Organizations, Supabase and Next.js 15, where Postgres Row Level Security keeps each organisation''s projects, tasks and files apart.',
  $body$Organisations, roles and invitations come from Clerk Organizations. The Clerk session token is the only credential sent to Supabase, which trusts Clerk as a third-party auth provider, and the RLS policies read the active organisation and role from the token's claims.

It has projects, a realtime kanban board (Supabase Realtime, filtered by the same RLS), task details with comments and file attachments in a private Storage bucket, an activity feed written by database triggers, and a weekly digest Edge Function that pg_cron calls through pg_net.

Clerk webhooks, verified with svix, copy users, organisations and memberships into Postgres for display only; access never depends on them. Composite foreign keys and triggers stop any row from pointing at another tenant's data.

The repository has Vitest unit tests, RLS tests that load the real migrations into PGlite and run queries as different Clerk users, and pgTAP tests for a local Supabase stack.$body$,
  array['Clerk', 'Supabase', 'Next.js 15', 'Vercel', 'Postgres', 'RLS', 'Realtime', 'Edge Functions', 'pg_cron', 'Vitest', 'PGlite', 'pgTAP'],
  'https://github.com/meenaarpit907-eng/teamboard',
  'https://teamboard-silk.vercel.app',
  true, true, 20
)
on conflict (id) do nothing;

-- Proficiency is required by the table but not shown on the site.
insert into public.skills (id, category, name, proficiency, sort_order) values
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0001', 'Supabase', 'Postgres & SQL', 3, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0002', 'Supabase', 'Row Level Security', 3, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0003', 'Supabase', 'Third-party auth (Clerk)', 3, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0004', 'Supabase', 'Storage policies', 3, 40),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0005', 'Supabase', 'Edge Functions (Deno)', 3, 50),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0006', 'Supabase', 'Migrations & Supabase CLI', 3, 60),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0015', 'Supabase', 'Realtime', 3, 70),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0007', 'Frontend', 'Next.js (App Router)', 3, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0008', 'Frontend', 'React', 3, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0009', 'Frontend', 'TypeScript', 3, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0010', 'Frontend', 'Tailwind CSS', 3, 40),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0011', 'Backend & Tooling', 'Node.js', 3, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0016', 'Backend & Tooling', 'Clerk Organizations & webhooks', 3, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0013', 'Backend & Tooling', 'Vercel', 3, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0014', 'Backend & Tooling', 'Vitest & pgTAP', 3, 40)
on conflict (id) do nothing;

-- Experience: add real roles only, e.g.
-- insert into public.experience (company, role, location, start_date, end_date, summary, highlights, tech_stack)
-- values ('Company', 'Role', 'City', '2025-01-01', null, 'What you did.', array['Highlight'], array['Next.js']);

-- Certifications (e.g. from LinkedIn > Licenses & certifications), e.g.
-- insert into public.certifications (name, issuer, issued_on, credential_id, credential_url, skills, sort_order)
-- values ('Certificate name', 'Issuer', '2025-06-01', 'ABC123', 'https://...', array['Skill'], 10);
