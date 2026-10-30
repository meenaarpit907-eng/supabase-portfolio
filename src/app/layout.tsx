import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPortfolioContent } from "@/lib/content";
import { ClerkProvider } from "@clerk/nextjs";
import { getClerkConfig, getSiteUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1a1d1c",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioContent();
  const siteName = profile.full_name;
  const title = `${profile.full_name} · Supabase, Clerk & Vercel engineer`;
  const description = profile.headline;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description,
    applicationName: siteName,
    authors: [{ name: profile.full_name, url: profile.github_url ?? undefined }],
    creator: profile.full_name,
    keywords: [
      "Supabase",
      "Clerk",
      "Vercel",
      "Postgres",
      "Row Level Security",
      "Next.js",
      "TypeScript",
      "Edge Functions",
      "Full-stack engineer",
      profile.full_name,
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: "/",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

/** Clerk components follow the site's dark shadcn palette. */
const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorBackground: "var(--card)",
    colorForeground: "var(--card-foreground)",
    colorMuted: "var(--muted)",
    colorMutedForeground: "var(--muted-foreground)",
    colorInput: "var(--input)",
    colorInputForeground: "var(--foreground)",
    colorNeutral: "var(--foreground)",
    colorDanger: "var(--destructive)",
    borderRadius: "0.625rem",
    fontFamily: "var(--font-geist-sans)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerk = getClerkConfig();

  const document = (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );

  // Without a publishable key the site runs in preview mode with no Clerk at
  // all (and never falls into Clerk's keyless mode). ClerkProvider is not
  // `dynamic`, so public pages stay static / ISR.
  if (!clerk) {
    return document;
  }

  return (
    <ClerkProvider
      publishableKey={clerk.publishableKey}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/admin"
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      {document}
    </ClerkProvider>
  );
}
