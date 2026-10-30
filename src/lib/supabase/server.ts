import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig, isClerkConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

const REQUEST_TIMEOUT_MS = 5000;

/** fetch with a timeout so an unreachable database cannot hang a render. */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const signal = init?.signal
    ? AbortSignal.any([init.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
    : AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return fetch(input, { ...init, signal });
}

/**
 * Supabase client for Server Components, Server Actions and Route Handlers that
 * acts as the signed-in Clerk user (Clerk's native Supabase integration).
 *
 * Supabase is configured with Clerk as a third-party auth provider, so it
 * verifies Clerk session tokens against Clerk's JWKS. No JWT template and no
 * shared JWT secret: `accessToken` hands over the current session token and
 * every query is checked by RLS (auth.jwt()->>'sub' is the Clerk user ID).
 *
 * Returns null when Supabase or Clerk env vars are missing.
 */
export function createClient() {
  const config = getSupabaseConfig();
  if (!config || !isClerkConfigured()) {
    return null;
  }

  return createSupabaseClient<Database>(config.url, config.key, {
    global: { fetch: fetchWithTimeout },
    async accessToken() {
      return (await auth()).getToken();
    },
  });
}

/**
 * Cookie-free client for public, cacheable reads (portfolio pages) and the
 * contact form insert. Runs as the `anon` role, so RLS limits it to published
 * content and contact-message inserts. Using it keeps public pages static/ISR:
 * reading cookies would opt every page into dynamic rendering.
 */
export function createPublicClient() {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  return createSupabaseClient<Database>(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout },
  });
}
