"use client";

import { Button } from "@/components/ui/button";

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <h1 className="font-heading text-2xl font-medium tracking-tight">This page could not be loaded</h1>
      <p className="text-sm text-muted-foreground">Try again. If it keeps failing, reload the app.</p>
      <Button type="button" onClick={reset} className="w-fit">
        Try again
      </Button>
    </main>
  );
}
