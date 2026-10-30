import Link from "next/link";
import { FileText } from "lucide-react";
import { MobileNav } from "@/components/site/mobile-nav";
import { Button } from "@/components/ui/button";
import { storagePublicUrl } from "@/lib/env";
import type { Profile } from "@/lib/content";
import { initials } from "@/lib/portfolio";

type NavLink = { href: string; label: string; show?: "experience" | "certifications" };

const allLinks: NavLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience", show: "experience" },
  { href: "/#certifications", label: "Certificates", show: "certifications" },
  { href: "/services", label: "Services" },
  { href: "/#architecture", label: "How it's built" },
  { href: "/#contact", label: "Contact" },
];

type SiteHeaderProps = { profile: Profile; hasExperience?: boolean; hasCertifications?: boolean };

export function SiteHeader({ profile, hasExperience = false, hasCertifications = false }: SiteHeaderProps) {
  const links = allLinks
    .filter(
      (link) =>
        !link.show ||
        (link.show === "experience" && hasExperience) ||
        (link.show === "certifications" && hasCertifications),
    )
    .map(({ href, label }) => ({ href, label }));
  const resumeUrl = storagePublicUrl(profile.resume_path);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2.5 font-heading text-sm font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/15 font-mono text-xs text-primary ring-1 ring-primary/30">
            {initials(profile.full_name)}
          </span>
          {profile.full_name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {resumeUrl ? (
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <FileText /> Resume
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/#contact">Hire me</Link>
          </Button>
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
