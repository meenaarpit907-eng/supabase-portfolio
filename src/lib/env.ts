/**
 * Environment helpers.
 *
 * NEXT_PUBLIC_* values are only inlined into browser bundles when read with a
 * literal `process.env.NAME` expression, so every public value is read that way.
 */

export type SupabasePublicConfig = {
  url: string;
  /** Publishable key (sb_publishable_...) or legacy anon key. Safe for browsers; RLS does the protecting. */
  key: string;
};

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Returns the Supabase URL and public key, or null when they are not set.
 * The site renders placeholder content when this is null, so it can be
 * previewed without a Supabase project.
 */
export function getSupabaseConfig(): SupabasePublicConfig | null {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key =
    clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
  } catch {
    return null;
  }

  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export type ClerkPublicConfig = {
  /** pk_test_... or pk_live_... Safe for browsers. */
  publishableKey: string;
};

/**
 * Returns the Clerk publishable key, or null when it is not set. Readable in
 * the browser (literal NEXT_PUBLIC_ reference). Use isClerkConfigured() on the
 * server, which also requires the secret key.
 */
export function getClerkConfig(): ClerkPublicConfig | null {
  const publishableKey = clean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  if (!publishableKey || !/^pk_(test|live)_[A-Za-z0-9+/=_-]+$/.test(publishableKey)) {
    return null;
  }
  return { publishableKey };
}

/**
 * True when Clerk can run: publishable key in the browser plus the secret key
 * on the server. When false, ClerkProvider and clerkMiddleware are skipped and
 * /admin shows a "configure Clerk" notice, so the public site still builds and
 * previews without any Clerk keys (and Clerk's keyless mode never kicks in).
 */
export function isClerkConfigured(): boolean {
  return getClerkConfig() !== null && clean(process.env.CLERK_SECRET_KEY) !== null;
}

/** Which backing services are missing, for the admin "not configured" notice. */
export function missingAdminServices(): Array<"Supabase" | "Clerk"> {
  const missing: Array<"Supabase" | "Clerk"> = [];
  if (!isSupabaseConfigured()) missing.push("Supabase");
  if (!isClerkConfigured()) missing.push("Clerk");
  return missing;
}

export function getSiteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) {
    return `https://${vercel}`;
  }
  return "http://localhost:3000";
}

/** Public URL for an object in the `portfolio` storage bucket. Absolute URLs are returned as-is. */
export function storagePublicUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) {
    return path;
  }
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${config.url}/storage/v1/object/public/${STORAGE_BUCKET}/${encoded}`;
}

export const STORAGE_BUCKET = "portfolio";

/** Public repository shown in "How this site is built". Set NEXT_PUBLIC_SOURCE_REPO_URL; unset or empty hides the link. */
export function getSourceRepoUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_SOURCE_REPO_URL;
  return clean(value);
}
