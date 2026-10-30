import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { missingAdminServices } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export { safeNextPath } from "@/lib/redirects";

type ServerClient = NonNullable<ReturnType<typeof createClient>>;

export const SIGN_IN_PATH = "/sign-in";

export type AdminContext =
  | { status: "unconfigured"; missing: Array<"Supabase" | "Clerk"> }
  | { status: "signed-out" }
  | {
      status: "forbidden";
      email: string | null;
      userId: string;
      /** False when the Clerk session token has no role=authenticated claim (Supabase integration not activated in Clerk). */
      hasSupabaseRole: boolean;
    }
  | { status: "admin"; email: string | null; userId: string; supabase: ServerClient };

async function primaryEmail(): Promise<string | null> {
  try {
    const user = await currentUser();
    return user?.primaryEmailAddress?.emailAddress ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolves who is calling.
 *
 * Authentication is Clerk: auth() reads the session that clerkMiddleware
 * verified. Authorization is Postgres: the caller is an admin only if their
 * Clerk user ID is in public.admins. That table is readable only for your own
 * row (RLS on auth.jwt()->>'sub'), and the same check guards every write, so
 * this function is a UX shortcut, not the security boundary.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const missing = missingAdminServices();
  const supabase = createClient();
  if (missing.length > 0 || !supabase) {
    return { status: "unconfigured", missing };
  }

  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return { status: "signed-out" };
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  const email = await primaryEmail();

  if (!adminRow) {
    const hasSupabaseRole = (sessionClaims as Record<string, unknown> | null)?.role === "authenticated";
    return { status: "forbidden", email, userId, hasSupabaseRole };
  }

  return { status: "admin", email, userId, supabase };
});

/**
 * For admin pages: the admin client, or null when the caller is not an admin
 * (the admin layout then shows sign-in / not-authorized instead).
 */
export async function getAdminClient(): Promise<ServerClient | null> {
  const context = await getAdminContext();
  return context.status === "admin" ? context.supabase : null;
}

/**
 * For Server Actions: returns an admin-scoped client or redirects. RLS would
 * reject writes from non-admins anyway; this just fails fast with a clear path.
 */
export async function requireAdmin(): Promise<Extract<AdminContext, { status: "admin" }>> {
  const context = await getAdminContext();
  if (context.status === "admin") {
    return context;
  }
  if (context.status === "signed-out") {
    redirect(`${SIGN_IN_PATH}?redirect_url=${encodeURIComponent("/admin")}`);
  }
  redirect("/admin");
}
