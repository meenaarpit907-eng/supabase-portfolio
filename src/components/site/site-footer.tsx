import Link from "next/link";
import { ClerkIcon, SupabaseIcon, VercelIcon } from "@/components/site/icons";
import type { Profile } from "@/lib/content";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getUTCFullYear()} {profile.full_name}. Built with Next.js,{" "}
          <span className="inline-flex items-center gap-1 text-foreground">
            <ClerkIcon className="size-3.5 text-primary" /> Clerk
          </span>{" "}
          and{" "}
          <span className="inline-flex items-center gap-1 text-foreground">
            <SupabaseIcon className="size-3.5 text-primary" /> Supabase
          </span>
          , on{" "}
          <span className="inline-flex items-center gap-1 text-foreground">
            <VercelIcon className="size-3 text-foreground" /> Vercel
          </span>
          .
        </p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link href="/#architecture" className="hover:text-foreground">
            How it&apos;s built
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/admin" className="hover:text-foreground" prefetch={false}>
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
