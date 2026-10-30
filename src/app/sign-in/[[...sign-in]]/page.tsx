import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { LegalLinks } from "@/components/legal/legal-links";
import { ClerkIcon } from "@/components/site/icons";
import { isClerkConfigured } from "@/lib/env";
import { safeNextPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type SignInPageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

/**
 * Clerk's prebuilt <SignIn /> on a catch-all route (path routing). Sign-ups are
 * disabled in the Clerk dashboard (Restricted mode); admin rights come from
 * public.admins in Postgres, not from being able to sign in.
 */
export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectPath = safeNextPath(params.redirect_url);
  const configured = isClerkConfigured();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <Link
        href="/"
        className="mb-6 text-center font-heading text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground"
      >
        ← Back to the portfolio
      </Link>
      {configured ? (
        <SignIn path="/sign-in" routing="path" withSignUp={false} fallbackRedirectUrl={redirectPath} />
      ) : (
        <div className="w-full space-y-3 rounded-xl border border-border bg-card p-6 text-sm leading-6 text-muted-foreground">
          <ClerkIcon className="size-6 text-primary" />
          <h1 className="font-heading text-lg font-medium text-foreground">Clerk is not configured</h1>
          <p>
            Admin sign-in uses Clerk. Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
            <code>CLERK_SECRET_KEY</code> (see <code>.env.example</code>) and restart the app.
          </p>
        </div>
      )}
      <LegalLinks className="mt-6 justify-center" />
    </main>
  );
}
