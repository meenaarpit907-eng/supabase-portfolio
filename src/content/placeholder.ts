import type { Tables } from "@/lib/supabase/database.types";

/**
 * Fallback content, shown when Supabase is not configured or unreachable.
 *
 * It mirrors supabase/seed.sql (same ids and slugs; a test keeps them in sync),
 * so a fresh `supabase db reset` and an offline preview look the same.
 * Everything here is real: only add facts that can be checked (public repos,
 * LinkedIn certificates). Empty lists hide their section on the site.
 */

const SEEDED_AT = "2026-10-30T00:00:00.000Z";

export const placeholderProfile: Tables<"profile"> = {
  id: 1,
  full_name: "Arpit Meena",
  headline: "Full-stack developer building web apps with Next.js, Supabase, Clerk and Vercel.",
  bio: [
    "I build web apps with Next.js, Supabase, Clerk and Vercel. My public repositories on GitHub show the work: the source of this site and TeamBoard, a multi-tenant team workspace.",
    "Both projects use Clerk for sign-in and Supabase third-party auth, so Postgres Row Level Security trusts Clerk session tokens directly. Their schemas, policies, migrations and tests are all public.",
  ].join("\n\n"),
  location: "India",
  email: "meenaarpit907@gmail.com",
  avatar_path: null,
  resume_path: null,
  github_url: "https://github.com/meenaarpit907-eng",
  linkedin_url: "https://www.linkedin.com/in/arpit-meena-018a19341/",
  x_url: null,
  website_url: null,
  available_for_work: true,
  created_at: SEEDED_AT,
  updated_at: SEEDED_AT,
};

export const placeholderProjects: Tables<"projects">[] = [
  {
    id: "6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0001",
    slug: "supabase-portfolio",
    title: "Clerk + Supabase Portfolio",
    summary:
      "This site: a Next.js 15 portfolio on Vercel with Clerk sign-in and Supabase Postgres, RLS and Storage.",
    body: [
      "Every section of this site is a row in Postgres. Visitors read published rows through the Data API as the anon role; Row Level Security hides drafts and keeps contact messages write-only.",
      "The /admin dashboard signs in with Clerk. Supabase trusts Clerk as a third-party auth provider, so the Clerk session token goes straight to Postgres with no JWT template or shared secret, and RLS reads the Clerk user ID from auth.jwt()->>'sub'. Admin rights come from a public.admins table of Clerk user IDs checked by a security definer function in a private schema, never from user-editable metadata.",
      "Images and the resume live in a public Storage bucket whose upload, replace and delete policies only admins pass. The contact form stores messages in Supabase, where visitors can add a message but never read one back.",
      "It deploys on Vercel: public pages are statically rendered with incremental revalidation, clerkMiddleware verifies sessions before /admin renders, and metadata, CSP and the custom domain come from environment variables. The pgTAP tests for the RLS policies and the Vitest unit tests are in the repository.",
    ].join("\n\n"),
    tech_stack: ["Clerk", "Supabase", "Vercel", "Postgres", "RLS", "Next.js 15", "TypeScript", "pgTAP", "Vitest"],
    cover_image_path: null,
    repo_url: "https://github.com/meenaarpit907-eng/supabase-portfolio",
    live_url: "https://arpitm.me",
    featured: true,
    published: true,
    sort_order: 10,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
  {
    id: "6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0002",
    slug: "teamboard",
    title: "TeamBoard",
    summary:
      "A multi-tenant team workspace built on Clerk Organizations, Supabase and Next.js 15, where Postgres Row Level Security keeps each organisation's projects, tasks and files apart.",
    body: [
      "Organisations, roles and invitations come from Clerk Organizations. The Clerk session token is the only credential sent to Supabase, which trusts Clerk as a third-party auth provider, and the RLS policies read the active organisation and role from the token's claims.",
      "It has projects, a realtime kanban board (Supabase Realtime, filtered by the same RLS), task details with comments and file attachments in a private Storage bucket, an activity feed written by database triggers, and a weekly digest Edge Function that pg_cron calls through pg_net.",
      "Clerk webhooks, verified with svix, copy users, organisations and memberships into Postgres for display only; access never depends on them. Composite foreign keys and triggers stop any row from pointing at another tenant's data.",
      "The repository has Vitest unit tests, RLS tests that load the real migrations into PGlite and run queries as different Clerk users, and pgTAP tests for a local Supabase stack.",
    ].join("\n\n"),
    tech_stack: ["Clerk", "Supabase", "Next.js 15", "Vercel", "Postgres", "RLS", "Realtime", "Edge Functions", "pg_cron", "Vitest", "PGlite", "pgTAP"],
    cover_image_path: null,
    repo_url: "https://github.com/meenaarpit907-eng/teamboard",
    live_url: "https://teamboard-silk.vercel.app",
    featured: true,
    published: true,
    sort_order: 20,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
];

// Skills shown on the site are the ones used in the two public repositories.
// Proficiency is required by the table but is not shown anywhere.
type SkillSeed = [id: string, category: string, name: string, sortOrder: number];

const skillSeeds: SkillSeed[] = [
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0001", "Supabase", "Postgres & SQL", 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0002", "Supabase", "Row Level Security", 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0003", "Supabase", "Third-party auth (Clerk)", 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0004", "Supabase", "Storage policies", 40],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0005", "Supabase", "Edge Functions (Deno)", 50],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0006", "Supabase", "Migrations & Supabase CLI", 60],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0015", "Supabase", "Realtime", 70],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0007", "Frontend", "Next.js (App Router)", 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0008", "Frontend", "React", 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0009", "Frontend", "TypeScript", 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0010", "Frontend", "Tailwind CSS", 40],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0011", "Backend & Tooling", "Node.js", 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0016", "Backend & Tooling", "Clerk Organizations & webhooks", 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0013", "Backend & Tooling", "Vercel", 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0014", "Backend & Tooling", "Vitest & pgTAP", 40],
];

export const placeholderSkills: Tables<"skills">[] = skillSeeds.map(([id, category, name, sortOrder]) => ({
  id,
  category,
  name,
  proficiency: 3,
  published: true,
  sort_order: sortOrder,
  created_at: SEEDED_AT,
  updated_at: SEEDED_AT,
}));

// Add real roles only (e.g. from LinkedIn). The section is hidden while empty.
export const placeholderExperience: Tables<"experience">[] = [];

/**
 * Certificates, e.g. from LinkedIn > Licenses & certifications. The live site
 * reads public.certifications; this list is the offline fallback and mirrors
 * seed.sql. The section is hidden while it is empty.
 */
export const placeholderCertifications: Tables<"certifications">[] = [];
