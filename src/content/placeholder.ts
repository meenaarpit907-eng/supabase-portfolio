import type { Tables } from "@/lib/supabase/database.types";

/**
 * Placeholder content, shown when Supabase is not configured or unreachable.
 *
 * It mirrors supabase/seed.sql (same ids and slugs; a test keeps them in sync),
 * so a fresh `supabase db reset` and an offline preview look the same.
 *
 * PLACEHOLDER: entries marked "placeholder" below are examples. Replace them
 * from /admin once your Supabase project is running (or edit seed.sql).
 */

const SEEDED_AT = "2026-10-30T00:00:00.000Z";

export const placeholderProfile: Tables<"profile"> = {
  id: 1,
  full_name: "Arpit Meena",
  headline: "Full-stack engineer building secure, fast products with Clerk, Supabase and Next.js on Vercel.",
  bio: [
    "I design Postgres schemas, write Row Level Security policies that hold up to review, and ship the Next.js apps that sit on top of them.",
    "Lately I have been focused on the Clerk + Supabase + Vercel stack: Clerk for sign-in and sessions, Supabase third-party auth so Postgres RLS trusts Clerk session tokens, Storage policies, Edge Functions and database-driven workflows with triggers and pg_net, all deployed on Vercel. This site is itself built on that stack, and its schema, policies and tests are public in the repository.",
    "(Placeholder bio: edit it in /admin > Profile.)",
  ].join("\n\n"),
  location: "India",
  email: "meenaarpit907@gmail.com",
  avatar_path: null,
  resume_path: null,
  github_url: "https://github.com/meenaarpit907-eng",
  linkedin_url: null,
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
      "This site: a Next.js 15 portfolio on Vercel with Clerk sign-in and Supabase Postgres, RLS, Storage and an Edge Function.",
    body: [
      "Every section of this site is a row in Postgres. Visitors read published rows through the Data API as the anon role; Row Level Security hides drafts and keeps contact messages write-only.",
      "The /admin dashboard signs in with Clerk. Supabase trusts Clerk as a third-party auth provider, so the Clerk session token goes straight to Postgres with no JWT template or shared secret, and RLS reads the Clerk user ID from auth.jwt()->>'sub'. Admin rights come from a public.admins table of Clerk user IDs checked by a security definer function in a private schema, never from user-editable metadata.",
      "Images and the resume live in a public Storage bucket whose upload, replace and delete policies only admins pass. A database trigger calls an Edge Function through pg_net to email new contact messages via Resend.",
      "It deploys on Vercel: public pages are statically rendered with incremental revalidation, clerkMiddleware verifies sessions before /admin renders, and metadata, CSP and the custom domain come from environment variables. RLS is covered by pgTAP tests in CI, and the app falls back to seed-like content when Supabase or Clerk is not configured.",
    ].join("\n\n"),
    tech_stack: ["Clerk", "Supabase", "Vercel", "Postgres", "RLS", "Next.js 15", "TypeScript", "Edge Functions", "pgTAP"],
    cover_image_path: null,
    repo_url: "https://github.com/meenaarpit907-eng/supabase-portfolio",
    live_url: null,
    featured: true,
    published: true,
    sort_order: 10,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
  {
    id: "6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0002",
    slug: "team-workspace-saas-kit",
    title: "Team Workspace SaaS Kit",
    summary:
      "A multi-tenant SaaS starter with workspaces, roles, invitations, shared files, MFA, realtime updates and Stripe billing.",
    body: [
      "A production-style starter for team products built with Next.js 15 and a backend-as-a-service: workspaces with owner/admin/member roles, email invitations, shared file storage with per-workspace permissions, and subscription billing with Stripe webhooks.",
      "It includes multi-factor auth, session management, realtime presence, scheduled maintenance jobs and an end-to-end test suite.",
      "(Placeholder description: adjust the details and links in /admin.)",
    ].join("\n\n"),
    tech_stack: ["Next.js", "TypeScript", "Appwrite", "Stripe", "Multi-tenancy", "Realtime", "Vitest", "Playwright"],
    cover_image_path: null,
    repo_url: null,
    live_url: null,
    featured: true,
    published: true,
    sort_order: 20,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
  {
    id: "6b1f1c2e-0a6d-4f0c-9c2a-2f6a4f1b0003",
    slug: "example-project",
    title: "Example Project (placeholder)",
    summary:
      "Placeholder project. Replace it with real work from /admin > Projects, or unpublish it.",
    body: "This is placeholder content from supabase/seed.sql. Sign in at /admin to edit or delete it.",
    tech_stack: ["Supabase", "Edge Functions", "pg_cron"],
    cover_image_path: null,
    repo_url: null,
    live_url: null,
    featured: false,
    published: true,
    sort_order: 30,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
];

type SkillSeed = [id: string, category: string, name: string, proficiency: number, sortOrder: number];

const skillSeeds: SkillSeed[] = [
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0001", "Supabase", "Postgres & SQL", 5, 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0002", "Supabase", "Row Level Security", 5, 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0003", "Supabase", "Third-party auth (Clerk)", 4, 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0004", "Supabase", "Storage policies", 4, 40],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0005", "Supabase", "Edge Functions (Deno)", 4, 50],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0006", "Supabase", "Migrations & Supabase CLI", 4, 60],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0007", "Frontend", "Next.js (App Router)", 5, 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0008", "Frontend", "React", 5, 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0009", "Frontend", "TypeScript", 5, 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0010", "Frontend", "Tailwind CSS", 4, 40],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0011", "Backend & Tooling", "Node.js", 4, 10],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0012", "Backend & Tooling", "Stripe billing", 4, 20],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0013", "Backend & Tooling", "Vercel", 4, 30],
  ["7c2e2d3f-1b7e-4a1d-8d3b-3a7b5a2c0014", "Backend & Tooling", "Vitest, pgTAP & Playwright", 4, 40],
];

export const placeholderSkills: Tables<"skills">[] = skillSeeds.map(
  ([id, category, name, proficiency, sortOrder]) => ({
    id,
    category,
    name,
    proficiency,
    published: true,
    sort_order: sortOrder,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  }),
);

export const placeholderExperience: Tables<"experience">[] = [
  {
    id: "8d3f3e4a-2c8f-4b2e-9e4c-4b8c6b3d0001",
    company: "Independent (placeholder)",
    role: "Full-stack Developer",
    location: "Remote",
    company_url: null,
    start_date: "2024-01-01",
    end_date: null,
    summary:
      "Placeholder role: replace with your real experience in /admin > Experience. Building SaaS products on Next.js with managed Postgres backends.",
    highlights: [
      "Designed multi-tenant schemas with row-level access rules.",
      "Shipped auth flows with MFA, sessions and server-side rendering.",
      "Integrated Stripe subscriptions with webhook reconciliation.",
    ],
    tech_stack: ["Next.js", "TypeScript", "Postgres", "Supabase"],
    published: true,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
  {
    id: "8d3f3e4a-2c8f-4b2e-9e4c-4b8c6b3d0002",
    company: "Example Company (placeholder)",
    role: "Web Developer",
    location: "India",
    company_url: null,
    start_date: "2022-06-01",
    end_date: "2023-12-31",
    summary: "Placeholder role: edit or delete it in /admin > Experience.",
    highlights: ["Built responsive React interfaces.", "Wrote REST APIs and SQL reports."],
    tech_stack: ["React", "Node.js", "SQL"],
    published: true,
    created_at: SEEDED_AT,
    updated_at: SEEDED_AT,
  },
];
