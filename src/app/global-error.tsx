"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            Try again. If it keeps failing, reload the app.
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
