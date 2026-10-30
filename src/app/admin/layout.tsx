import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSignOut, AdminUserButton } from "@/components/admin/sign-out";
import { ClerkIcon, SupabaseIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { getAdminContext, SIGN_IN_PATH } from "@/lib/admin";

// Per-request: depends on the signed-in user's cookies.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-4 px-6 py-16">
      <ShieldAlert className="size-8 text-primary" />
      <h1 className="font-heading text-2xl font-medium tracking-tight">{title}</h1>
      <div className="space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </main>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const context = await getAdminContext();

  if (context.status === "unconfigured") {
    const needsSupabase = context.missing.includes("Supabase");
    const needsClerk = context.missing.includes("Clerk");
    return (
      <Notice title={`${context.missing.join(" and ")} ${context.missing.length > 1 ? "are" : "is"} not configured`}>
        <p>
          The admin area signs in with <strong className="text-foreground">Clerk</strong> and reads and writes{" "}
          <strong className="text-foreground">Supabase</strong> as the signed-in Clerk user, so it needs both. Set
          these (see <code>.env.example</code>) and restart the app:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {needsClerk ? (
            <li>
              <ClerkIcon className="mr-1 inline size-3.5 text-primary" />
              <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>
            </li>
          ) : null}
          {needsSupabase ? (
            <li>
              <SupabaseIcon className="mr-1 inline size-3.5 text-primary" />
              <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (or the
              legacy <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)
            </li>
          ) : null}
        </ul>
        <p>The public site keeps working in preview mode with the bundled content in the meantime.</p>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/">Back to the site</Link>
        </Button>
      </Notice>
    );
  }

  if (context.status === "signed-out") {
    redirect(`${SIGN_IN_PATH}?redirect_url=${encodeURIComponent("/admin")}`);
  }

  if (context.status === "forbidden") {
    return (
      <Notice title="Not an admin">
        <p>
          You are signed in with Clerk as <strong className="text-foreground">{context.email ?? context.userId}</strong>,
          but this Clerk user ID is not in <code>public.admins</code>. Admin access is granted in the database, for
          example from the Supabase SQL editor:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
          {`insert into public.admins (user_id)\nvalues ('${context.userId}');`}
        </pre>
        {!context.hasSupabaseRole ? (
          <p className="rounded-md bg-amber-400/10 px-3 py-2 text-amber-200">
            Your Clerk session token has no <code>role: &quot;authenticated&quot;</code> claim, so Supabase treats it as
            anonymous. Activate the Supabase integration in the Clerk dashboard and add Clerk as a third-party auth
            provider in Supabase.
          </p>
        ) : null}
        <AdminSignOut size="default" />
      </Notice>
    );
  }

  const { count: unread } = await context.supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-6">
          <Link href="/admin" className="flex items-center gap-2 font-heading text-sm font-medium">
            <SupabaseIcon className="size-4 text-primary" /> Portfolio admin
          </Link>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{context.email}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                <ExternalLink /> View site
              </Link>
            </Button>
            <AdminUserButton />
            <AdminSignOut />
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8 md:grid-cols-[200px_1fr]">
        <aside>
          <AdminNav unread={unread ?? 0} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
