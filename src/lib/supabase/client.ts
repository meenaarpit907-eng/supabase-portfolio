"use client";

import { useMemo } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Browser Supabase client that sends the signed-in Clerk user's session token
 * (Clerk's native Supabase integration), so Storage uploads from the admin UI
 * run as that user and are checked by storage.objects RLS.
 *
 * Only call this under <ClerkProvider> (the admin area). Returns null when
 * Supabase env vars are missing.
 */
export function useSupabaseClient() {
  const { session } = useSession();

  return useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return null;
    }
    return createClient<Database>(url, key, {
      async accessToken() {
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);
}
