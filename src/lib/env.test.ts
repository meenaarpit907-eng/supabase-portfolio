import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getClerkConfig,
  getSiteUrl,
  getSourceRepoUrl,
  getSupabaseConfig,
  isClerkConfigured,
  missingAdminServices,
  storagePublicUrl,
} from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSupabaseConfig", () => {
  it("returns null when not configured, so the site can use placeholders", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(getSupabaseConfig()).toBeNull();
  });

  it("rejects invalid URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not a url");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    expect(getSupabaseConfig()).toBeNull();
  });

  it("prefers the publishable key over the legacy anon key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co/");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_x");
    expect(getSupabaseConfig()).toEqual({ url: "https://abc.supabase.co", key: "sb_publishable_x" });
  });
});

describe("storagePublicUrl", () => {
  it("builds public bucket URLs and encodes segments", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    expect(storagePublicUrl("projects/a b.png")).toBe(
      "https://abc.supabase.co/storage/v1/object/public/portfolio/projects/a%20b.png",
    );
  });

  it("passes through absolute and root-relative URLs and handles empty values", () => {
    expect(storagePublicUrl("https://cdn.example.com/x.png")).toBe("https://cdn.example.com/x.png");
    expect(storagePublicUrl("/og.png")).toBe("/og.png");
    expect(storagePublicUrl(null)).toBeNull();
  });
});

describe("getSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL, then Vercel's production URL, then localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://arpit.dev/");
    expect(getSiteUrl()).toBe("https://arpit.dev");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.vercel.app");
    expect(getSiteUrl()).toBe("https://portfolio.vercel.app");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("getSourceRepoUrl", () => {
  it("can be hidden with an empty value", () => {
    vi.stubEnv("NEXT_PUBLIC_SOURCE_REPO_URL", "");
    expect(getSourceRepoUrl()).toBeNull();
  });
});

describe("Clerk config", () => {
  it("is disabled without keys, so the site builds and previews without Clerk", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    vi.stubEnv("CLERK_SECRET_KEY", "");
    expect(getClerkConfig()).toBeNull();
    expect(isClerkConfigured()).toBe(false);
  });

  it("needs both the publishable key and the secret key", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k");
    vi.stubEnv("CLERK_SECRET_KEY", "");
    expect(getClerkConfig()).toEqual({ publishableKey: "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k" });
    expect(isClerkConfigured()).toBe(false);
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_secret");
    expect(isClerkConfigured()).toBe(true);
  });

  it("ignores values that are not publishable keys", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "sk_test_oops");
    expect(getClerkConfig()).toBeNull();
  });

  it("lists which admin services are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_x");
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    vi.stubEnv("CLERK_SECRET_KEY", "");
    expect(missingAdminServices()).toEqual(["Clerk"]);
  });
});
