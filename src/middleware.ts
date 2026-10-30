import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/env";

/**
 * Clerk session middleware. Verifies the Clerk session on every request so
 * auth() works in Server Components and Server Actions, and sends signed-out
 * visitors of /admin to the Clerk sign-in page.
 *
 * This is the first gate, not the only one: the admin layout checks
 * public.admins, and Postgres RLS checks the Clerk user ID on every write.
 */
const withClerk = clerkMiddleware(
  async (auth, request) => {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      await auth.protect();
    }
  },
  { signInUrl: "/sign-in" },
);

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  // Without Clerk keys the site runs in preview mode: no Clerk, no keyless
  // mode, and /admin renders a "configure Clerk" notice instead.
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  return withClerk(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
