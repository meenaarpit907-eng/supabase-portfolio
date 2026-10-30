import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist.",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="font-heading text-2xl font-medium tracking-tight">This page does not exist</h1>
      <p className="text-sm text-muted-foreground">
        The link may be out of date, or the page was moved.
      </p>
      <Button asChild className="w-fit">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
