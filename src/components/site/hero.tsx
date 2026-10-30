import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SocialLinks } from "@/components/site/social-links";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/content";

function PolicySnippet() {
  const k = "text-primary";
  const s = "text-amber-300/90";
  const c = "text-muted-foreground/70";
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-foreground/90">
      <code>
        <span className={c}>-- Visitors read published work. Only admins write.</span>
        {"\n"}
        <span className={k}>create policy</span> <span className={s}>&quot;Published projects are public&quot;</span>
        {"\n  "}
        <span className={k}>on</span> public.projects <span className={k}>for select</span>
        {"\n  "}
        <span className={k}>to</span> anon, authenticated
        {"\n  "}
        <span className={k}>using</span> (published <span className={k}>or</span> (<span className={k}>select</span> private.is_admin()));
        {"\n\n"}
        <span className={c}>-- Admins are Clerk user IDs from the session token.</span>
        {"\n"}
        <span className={k}>create policy</span> <span className={s}>&quot;Users can see their own admin row&quot;</span>
        {"\n  "}
        <span className={k}>on</span> public.admins <span className={k}>for select</span>
        {"\n  "}
        <span className={k}>to</span> authenticated
        {"\n  "}
        <span className={k}>using</span> (user_id = (<span className={k}>select</span> auth.jwt() -&gt;&gt;{" "}
        <span className={s}>&apos;sub&apos;</span>));
      </code>
    </pre>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-7">
          {profile.available_for_work ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Open to Clerk, Supabase &amp; Vercel work
            </p>
          ) : null}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{profile.full_name}</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">{profile.headline}</p>
            {profile.location ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {profile.location}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-10 px-4">
              <Link href="/#projects">
                View projects <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-10 px-4">
              <Link href="/#contact">Get in touch</Link>
            </Button>
            <SocialLinks profile={profile} />
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5 ring-1 ring-primary/10 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">supabase/migrations/…sql</span>
            </div>
            <PolicySnippet />
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
            Real policies from this site&apos;s database
          </p>
        </div>
      </div>
    </section>
  );
}
