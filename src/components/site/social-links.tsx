import { Globe, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/content";

export function SocialLinks({ profile }: { profile: Profile }) {
  const items = [
    profile.github_url ? { href: profile.github_url, label: "GitHub", icon: <GitHubIcon /> } : null,
    profile.linkedin_url ? { href: profile.linkedin_url, label: "LinkedIn", icon: <LinkedInIcon /> } : null,
    profile.x_url ? { href: profile.x_url, label: "X", icon: <XIcon /> } : null,
    profile.website_url ? { href: profile.website_url, label: "Website", icon: <Globe /> } : null,
    profile.email ? { href: `mailto:${profile.email}`, label: "Email", icon: <Mail /> } : null,
  ].filter((item) => item !== null);

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.label}>
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <a
              href={item.href}
              aria-label={item.label}
              title={item.label}
              {...(item.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
            >
              {item.icon}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
