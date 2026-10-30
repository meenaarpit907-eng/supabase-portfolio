import Image from "next/image";
import { Section } from "@/components/site/section";
import { storagePublicUrl } from "@/lib/env";
import type { PortfolioContent } from "@/lib/content";
import { initials, toParagraphs } from "@/lib/portfolio";

// Literal class names so Tailwind generates them.
const STAT_COLUMNS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2" };

export function About({ content }: { content: PortfolioContent }) {
  const { profile, projects, skills, experience, certifications } = content;
  const avatar = storagePublicUrl(profile.avatar_path);
  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Skills", value: skills.length },
    { label: "Roles", value: experience.length },
    { label: "Certificates", value: certifications.length },
  ].filter((stat) => stat.value > 0);

  return (
    <Section id="about" eyebrow="About" title="About me">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
          {toParagraphs(profile.bio).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            {avatar ? (
              <Image
                src={avatar}
                alt={profile.full_name}
                width={64}
                height={64}
                className="size-16 rounded-full object-cover ring-2 ring-primary/40"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-primary/15 font-mono text-lg text-primary ring-2 ring-primary/30">
                {initials(profile.full_name)}
              </span>
            )}
            <div>
              <p className="font-heading font-medium">{profile.full_name}</p>
              {profile.location ? <p className="text-sm text-muted-foreground">{profile.location}</p> : null}
            </div>
          </div>
          <dl className={`grid gap-3 text-center ${STAT_COLUMNS[stats.length] ?? "grid-cols-3"}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-muted/50 px-2 py-3">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="font-heading text-2xl font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground">
            Counted from published rows, read as the <code className="font-mono text-foreground">anon</code> role
            through Row Level Security.
          </p>
        </aside>
      </div>
    </Section>
  );
}
