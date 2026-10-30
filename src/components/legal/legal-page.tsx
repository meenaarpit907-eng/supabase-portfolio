import Link from "next/link";
import { LegalLinks } from "@/components/legal/legal-links";

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <Link href="/" className="font-heading text-sm font-medium tracking-tight">
          Arpit Meena
        </Link>
        <LegalLinks />
      </header>

      <article className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
        <div className="space-y-8 text-sm leading-6 text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </main>
  );
}