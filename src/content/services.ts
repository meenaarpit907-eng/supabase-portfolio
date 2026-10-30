/**
 * Services page copy — edit everything here; src/app/(site)/services/page.tsx only renders it.
 *
 * PRICES ARE SUGGESTIONS for Arpit to confirm (based on 2026 market research, USD,
 * India-based freelancer selling to international clients). They are hidden on the
 * live page until `showPrices` is set to true.
 */

export type ServicePackage = {
  id: string;
  name: string;
  tagline: string;
  includes: string[];
  timeline: string;
  /** SUGGESTED — confirm before publishing. */
  price: string;
};

export const showPrices = false;

export const servicesIntro = {
  eyebrow: "Services",
  title: "Supabase, Clerk and Vercel, built properly",
  description:
    "I'm Arpit, a developer in India building web apps on Next.js, Supabase, Clerk and Vercel. I'm available for projects at a fixed scope and a fixed price, agreed in writing before work starts.",
};

export const packages: ServicePackage[] = [
  {
    id: "auth-security",
    name: "Auth & database setup / RLS security audit",
    tagline: "Get the foundations right, or find out what's exposed before someone else does.",
    includes: [
      "Postgres schema and migrations for your data model",
      "Clerk (or Supabase Auth) sign-in, wired to Supabase via third-party auth",
      "Row Level Security policies for every table, with pgTAP tests",
      "Audit option: written report of RLS gaps, exposed keys and risky queries, with fixes ranked by severity",
    ],
    timeline: "1–2 weeks",
    price: "$500 – $1,500",
  },
  {
    id: "saas-mvp",
    name: "SaaS MVP build",
    tagline: "From idea to a deployed product on Next.js + Supabase + Clerk + Vercel.",
    includes: [
      "Scoped core feature set agreed up front",
      "Auth, user and organisation (multi-tenant) accounts with roles",
      "Supabase database, Storage, Edge Functions and Realtime where needed",
      "Stripe or Razorpay payments if required",
      "Preview deployment for every change, production deploy on Vercel",
      "Tests, README and handover docs",
    ],
    timeline: "5–8 weeks",
    price: "$4,000 – $9,000",
  },
  {
    id: "migration",
    name: "Migration to Supabase",
    tagline: "Move from Firebase, Appwrite or another backend without losing users or data.",
    includes: [
      "Audit of current data, auth and storage, plus a written migration plan",
      "Document-to-relational schema design with RLS",
      "Data, users and files migrated with record reconciliation",
      "Staged cut-over that keeps the old app running until you're ready",
    ],
    timeline: "2–4 weeks",
    price: "$2,500 – $6,000",
  },
  {
    id: "performance",
    name: "Performance & Vercel deployment optimisation",
    tagline: "Faster pages, cheaper queries and a deployment pipeline you can trust.",
    includes: [
      "Query plans, indexes and connection pooling review",
      "Caching and rendering strategy for Next.js on Vercel",
      "Core Web Vitals fixes and Vercel Analytics setup",
      "Environment variables, preview deployments and CI checks",
    ],
    timeline: "1–2 weeks",
    price: "$600 – $1,500",
  },
  {
    id: "retainer",
    name: "Monthly support retainer",
    tagline: "An engineer on call for your Supabase + Next.js app after launch.",
    includes: [
      "A set number of hours each month for features and fixes",
      "Dependency, security and RLS policy updates",
      "Database and deployment monitoring",
      "Replies within a couple of days",
    ],
    timeline: "Monthly, cancel anytime",
    price: "$500 – $1,500 / month",
  },
];

export const process = [
  { step: "Discovery call", detail: "A free 30-minute call about your product, users and deadline." },
  { step: "Scope & fixed quote", detail: "A written scope, timeline and fixed price within a couple of days of the call. Nothing starts until you approve it." },
  { step: "Build with preview deployments", detail: "Every change ships to a Vercel preview URL you can click through, with progress updates each week." },
  { step: "Handover", detail: "You own the code, Supabase project and Clerk app. You get docs, tests and a walkthrough call." },
];

export const faqs = [
  { q: "Can you work with clients outside India?", a: "Yes, I work remotely. Payment terms and currency are agreed in the written quote." },
  { q: "Why Clerk with Supabase instead of Supabase Auth?", a: "Clerk gives you ready-made organisations, roles, MFA and user management. With Supabase third-party auth, Clerk tokens drive Row Level Security directly. If Supabase Auth suits you better, I'll use that instead." },
  { q: "Who owns the code and accounts?", a: "You do. Projects are created in your Supabase, Clerk, Vercel and GitHub accounts, or transferred to you at handover." },
  { q: "How do payments work?", a: "Payment terms and currency are agreed in the written quote, before any work starts." },
  { q: "Can you fix an app built with an AI tool or another developer?", a: "Yes. Start with the security audit, and you'll get a clear list of what's safe, what's exposed and what it costs to fix." },
];

export const servicesCta = {
  title: "Have a project in mind?",
  description: "Tell me what you're building. I'll reply within a couple of days with next steps.",
  label: "Start a conversation",
  href: "/#contact",
};
