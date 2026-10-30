import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import type { Experience as ExperienceRow } from "@/lib/content";
import { formatDateRange } from "@/lib/portfolio";

export function Experience({ experience }: { experience: ExperienceRow[] }) {
  if (experience.length === 0) {
    return null;
  }

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked" className="border-t border-border/60">
      <ol className="relative space-y-10 border-l border-border pl-8">
        {experience.map((item) => (
          <li key={item.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[37px] size-3 rounded-full border-2 border-background bg-primary ring-4 ring-primary/20"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-heading text-lg font-medium">
                {item.role}{" "}
                <span className="text-muted-foreground">
                  ·{" "}
                  {item.company_url ? (
                    <a href={item.company_url} target="_blank" rel="noreferrer" className="hover:text-primary">
                      {item.company}
                    </a>
                  ) : (
                    item.company
                  )}
                </span>
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {formatDateRange(item.start_date, item.end_date)}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            {item.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.summary}</p> : null}
            {item.highlights.length > 0 ? (
              <ul className="mt-3 max-w-3xl list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground marker:text-primary">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
            {item.tech_stack.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {item.tech_stack.map((tech) => (
                  <li key={tech}>
                    <Badge variant="outline" className="font-normal">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
