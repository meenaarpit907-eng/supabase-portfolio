import { ArrowRight, Database, HardDrive, KeyRound, Rocket, ShieldCheck, Zap } from "lucide-react";
import { GitHubIcon } from "@/components/site/icons";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getSourceRepoUrl } from "@/lib/env";

const pillars = [
  {
    icon: Database,
    title: "Postgres schema",
    body: "profile, projects, skills, experience and contact_messages, created by versioned migrations with check constraints, partial indexes for published rows and updated_at triggers.",
    file: "supabase/migrations/*_schema.sql",
  },
  {
    icon: ShieldCheck,
    title: "Row Level Security",
    body: "RLS on every table. Visitors read only published rows and can insert contact messages they can never read back. Column grants stop them setting read_at. pgTAP tests cover each rule.",
    file: "supabase/tests/database/rls.test.sql",
  },
  {
    icon: KeyRound,
    title: "Clerk + Supabase auth",
    body: "Clerk handles sign-in and sessions; clerkMiddleware guards /admin. Supabase trusts Clerk as a third-party auth provider, so the Clerk session token goes straight to PostgREST and Storage with no JWT template or shared secret. Admin rights come from a public.admins table of Clerk user IDs (auth.jwt()->>'sub') checked by a security definer function, never from editable metadata.",
    file: "src/lib/supabase/*, src/middleware.ts, *_clerk_auth.sql",
  },
  {
    icon: HardDrive,
    title: "Storage",
    body: "A public portfolio bucket for project images, avatar and resume, limited to 5 MB images/PDFs. Upload, replace and delete policies on storage.objects only pass for admins.",
    file: "supabase/migrations/*_storage.sql",
  },
  {
    icon: Zap,
    title: "Edge Function",
    body: "An AFTER INSERT trigger calls the contact-notify Deno function through pg_net, authenticated with a shared secret kept in Vault. The function emails me through Resend.",
    file: "supabase/functions/contact-notify",
  },
  {
    icon: Rocket,
    title: "Vercel deployment",
    body: "Deployed on Vercel: public pages are prerendered and revalidated with ISR, read as the anon role without cookies; metadata, CSP and the custom domain come from env vars. Without Supabase or Clerk keys the site still builds and falls back to bundled seed content.",
    file: "src/lib/content.ts, next.config.ts",
  },
];

const flows = [
  {
    label: "Visitor request flow",
    steps: ["Visitor", "Vercel (Next.js ISR)", "PostgREST + RLS (anon)", "Postgres", "pg_net trigger", "Edge Function", "Resend"],
  },
  {
    label: "Admin request flow",
    steps: ["Admin", "Clerk sign-in", "clerkMiddleware", "Clerk session token", "PostgREST + RLS (sub)", "Postgres + Storage"],
  },
];

export function Architecture() {
  const repoUrl = getSourceRepoUrl();

  return (
    <Section
      id="architecture"
      eyebrow="How this site is built"
      title="A small, production-shaped Clerk + Supabase app on Vercel"
      description="This portfolio doubles as a code sample. Everything below is in the repository: Clerk integration, schema, policies, tests and the Edge Function."
      className="border-t border-border/60 bg-card/30"
    >
      <div className="mb-10 space-y-3">
        {flows.map((flow) => (
          <ol key={flow.label} className="flex flex-wrap items-center gap-2 font-mono text-xs" aria-label={flow.label}>
            {flow.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">{step}</span>
                {index < flow.steps.length - 1 ? (
                  <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map(({ icon: Icon, title, body, file }) => (
          <article key={title} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="font-heading font-medium">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            <p className="mt-auto pt-2 font-mono text-[11px] text-muted-foreground/80">{file}</p>
          </article>
        ))}
      </div>
      {repoUrl ? (
        <Button asChild variant="outline" size="lg" className="mt-10 h-10 px-4">
          <a href={repoUrl} target="_blank" rel="noreferrer">
            <GitHubIcon /> Read the source
          </a>
        </Button>
      ) : null}
    </Section>
  );
}
