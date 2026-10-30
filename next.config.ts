import type { NextConfig } from "next";
import { clerkFrontendApiHost } from "./src/lib/clerk-key";

/** Origin of the Supabase project (hosted or local), for CSP and next/image. */
function supabaseOrigin(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * CSP sources Clerk needs (https://clerk.com/docs/guides/secure/best-practices/csp-headers):
 * the instance's Frontend API (decoded from the publishable key), Cloudflare
 * bot protection, Clerk's fraud protection hosts and img.clerk.com avatars.
 * Empty when Clerk is not configured, so preview mode keeps the tight policy.
 */
function clerkSources() {
  const fapi = clerkFrontendApiHost(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  if (!fapi) {
    return { script: [], connect: [], img: [], frame: [], worker: [] };
  }
  return {
    script: [`https://${fapi}`, "https://challenges.cloudflare.com", "https://*.protect.clerk.com"],
    connect: [`https://${fapi}`, "https://*.protect.clerk.com:*", "https://clerk-telemetry.com"],
    img: ["https://img.clerk.com"],
    frame: ["https://challenges.cloudflare.com", "https://*.protect.clerk.com"],
    worker: ["blob:"],
  };
}

function contentSecurityPolicy(): string {
  const supabase = supabaseOrigin();
  const clerk = clerkSources();
  const development = process.env.NODE_ENV !== "production";
  const supabaseSources = supabase
    ? [supabase.origin, `${supabase.protocol === "http:" ? "ws:" : "wss:"}//${supabase.host}`]
    : [];
  const scriptSrc = ["'self'", "'unsafe-inline'", ...(development ? ["'unsafe-eval'"] : []), ...clerk.script];
  const connectSrc = [
    "'self'",
    ...supabaseSources,
    ...clerk.connect,
    ...(development ? ["ws://localhost:*", "ws://127.0.0.1:*", "http://localhost:*", "http://127.0.0.1:*"] : []),
  ];
  const imageSrc = ["'self'", "data:", "blob:", ...(supabase ? [supabase.origin] : []), ...clerk.img];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSrc.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src 'self' ${clerk.frame.join(" ")}`.trim(),
    `worker-src 'self' ${clerk.worker.join(" ")}`.trim(),
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

function storageImagePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
    { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
  ];
  const supabase = supabaseOrigin();
  if (supabase && !supabase.hostname.endsWith(".supabase.co")) {
    patterns.push({
      protocol: supabase.protocol === "http:" ? "http" : "https",
      hostname: supabase.hostname,
      port: supabase.port,
      pathname: "/storage/v1/object/public/**",
    });
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageImagePatterns(),
  },
  async redirects() {
    // The old Supabase Auth login page moved to Clerk's sign-in.
    return [{ source: "/login", destination: "/sign-in", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
