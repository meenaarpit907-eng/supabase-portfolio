-- =============================================================================
-- Seed data for local development (`supabase db reset` runs this file).
--
-- PLACEHOLDER CONTENT: rows marked "placeholder" are examples. Replace them
-- from /admin once you are signed in, or edit this file. The same content lives
-- in src/content/placeholder.ts as the offline fallback; a vitest test keeps
-- ids and slugs in sync.
--
-- seed.sql is NOT applied to hosted projects by `supabase db push`. To load it
-- into a hosted project, paste it into the SQL editor once (optional).
-- =============================================================================

-- Admins are Clerk user IDs (Clerk dashboard > Users > copy the user_... ID).
-- Add yours after `db reset` / `db push`, from the SQL editor or psql:
--   insert into public.admins (user_id) values ('user_xxxxxxxxxxxxxxxxxxxxxxxxxxx');

insert into public.profile (
  id, full_name, headline, bio, location, email, github_url, available_for_work
) values (
  1,
  'Arpit Meena',
  'Full-stack engineer building secure, fast products with Clerk, Supabase and Next.js on Vercel.',
  $bio$I design Postgres schemas, write Row Level Security policies that hold up to review, and ship the Next.js apps that sit on top of them.

Lately I have been focused on the Clerk + Supabase + Vercel stack: Clerk for sign-in and sessions, Supabase third-party auth so Postgres RLS trusts Clerk session tokens, Storage policies, Edge Functions and database-driven workflows with triggers and pg_net, all deployed on Vercel. This site is itself built on that stack, and its schema, policies and tests are public in the repository.

(Placeholder bio: edit it in /admin > Profile.)$bio$,
  'India',
  'meenaarpit907@gmail.com',
  'https://github.com/meenaarpit907-eng',
  true
)
on conflict (id) do nothing;

insert into public.projects (
  id, slug, title, summary, body, tech_stack, repo_url, featured, published, sort_order
) values
(
  '6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0001',
  'supabase-portfolio',
  'Clerk + Supabase Portfolio',
  'This site: a Next.js 15 portfolio on Vercel with Clerk sign-in and Supabase Postgres, RLS, Storage and an Edge Function.',
  $body$Every section of this site is a row in Postgres. Visitors read published rows through the Data API as the anon role; Row Level Security hides drafts and keeps contact messages write-only.

The /admin dashboard signs in with Clerk. Supabase trusts Clerk as a third-party auth provider, so the Clerk session token goes straight to Postgres with no JWT template or shared secret, and RLS reads the Clerk user ID from auth.jwt()->>'sub'. Admin rights come from a public.admins table of Clerk user IDs checked by a security definer function in a private schema, never from user-editable metadata.

Images and the resume live in a public Storage bucket whose upload, replace and delete policies only admins pass. A database trigger calls an Edge Function through pg_net to email new contact messages via Resend.

It deploys on Vercel: public pages are statically rendered with incremental revalidation, clerkMiddleware verifies sessions before /admin renders, and metadata, CSP and the custom domain come from environment variables. RLS is covered by pgTAP tests in CI, and the app falls back to seed-like content when Supabase or Clerk is not configured.$body$,
  array['Clerk', 'Supabase', 'Vercel', 'Postgres', 'RLS', 'Next.js 15', 'TypeScript', 'Edge Functions', 'pgTAP'],
  'https://github.com/meenaarpit907-eng/supabase-portfolio',
  true, true, 10
),
(
  '6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0002',
  'team-workspace-saas-kit',
  'Team Workspace SaaS Kit',
  'A multi-tenant SaaS starter with workspaces, roles, invitations, shared files, MFA, realtime updates and Stripe billing.',
  $body$A production-style starter for team products built with Next.js 15 and a backend-as-a-service: workspaces with owner/admin/member roles, email invitations, shared file storage with per-workspace permissions, and subscription billing with Stripe webhooks.

It includes multi-factor auth, session management, realtime presence, scheduled maintenance jobs and an end-to-end test suite.

(Placeholder description: adjust the details and links in /admin.)$body$,
  array['Next.js', 'TypeScript', 'Appwrite', 'Stripe', 'Multi-tenancy', 'Realtime', 'Vitest', 'Playwright'],
  null,
  true, true, 20
),
(
  -- placeholder
  '6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0003',
  'example-project',
  'Example Project (placeholder)',
  'Placeholder project. Replace it with real work from /admin > Projects, or unpublish it.',
  'This is placeholder content from supabase/seed.sql. Sign in at /admin to edit or delete it.',
  array['Supabase', 'Edge Functions', 'pg_cron'],
  null,
  false, true, 30
)
on conflict (id) do nothing;

-- Proficiency values are placeholders (1-5); adjust them in /admin > Skills.
insert into public.skills (id, category, name, proficiency, sort_order) values
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0001', 'Supabase', 'Postgres & SQL', 5, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0002', 'Supabase', 'Row Level Security', 5, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0003', 'Supabase', 'Third-party auth (Clerk)', 4, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0004', 'Supabase', 'Storage policies', 4, 40),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0005', 'Supabase', 'Edge Functions (Deno)', 4, 50),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0006', 'Supabase', 'Migrations & Supabase CLI', 4, 60),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0007', 'Frontend', 'Next.js (App Router)', 5, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0008', 'Frontend', 'React', 5, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0009', 'Frontend', 'TypeScript', 5, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0010', 'Frontend', 'Tailwind CSS', 4, 40),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0011', 'Backend & Tooling', 'Node.js', 4, 10),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0012', 'Backend & Tooling', 'Stripe billing', 4, 20),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0013', 'Backend & Tooling', 'Vercel', 4, 30),
  ('7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0014', 'Backend & Tooling', 'Vitest, pgTAP & Playwright', 4, 40)
on conflict (id) do nothing;

insert into public.experience (
  id, company, role, location, start_date, end_date, summary, highlights, tech_stack
) values
(
  -- placeholder
  '8d3f3e4a-2c8f-4b2e-9e4c-4b8c6b3d0001',
  'Independent (placeholder)',
  'Full-stack Developer',
  'Remote',
  '2024-01-01',
  null,
  'Placeholder role: replace with your real experience in /admin > Experience. Building SaaS products on Next.js with managed Postgres backends.',
  array[
    'Designed multi-tenant schemas with row-level access rules.',
    'Shipped auth flows with MFA, sessions and server-side rendering.',
    'Integrated Stripe subscriptions with webhook reconciliation.'
  ],
  array['Next.js', 'TypeScript', 'Postgres', 'Supabase']
),
(
  -- placeholder
  '8d3f3e4a-2c8f-4b2e-9e4c-4b8c6b3d0002',
  'Example Company (placeholder)',
  'Web Developer',
  'India',
  '2022-06-01',
  '2023-12-31',
  'Placeholder role: edit or delete it in /admin > Experience.',
  array['Built responsive React interfaces.', 'Wrote REST APIs and SQL reports.'],
  array['React', 'Node.js', 'SQL']
)
on conflict (id) do nothing;
