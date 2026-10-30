import { Section } from "@/components/site/section";
import type { Skill } from "@/lib/content";
import { groupSkills } from "@/lib/portfolio";

function Level({ value }: { value: number }) {
  return (
    <span className="flex gap-1" aria-label={`${value} out of 5`} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 w-4 rounded-full ${index < value ? "bg-primary" : "bg-foreground/10"}`}
        />
      ))}
    </span>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  const groups = groupSkills(skills);

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I work with"
      className="border-t border-border/60"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.category} className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-heading font-medium">{group.category}</h3>
            <ul className="space-y-3">
              {group.skills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{skill.name}</span>
                  <Level value={skill.proficiency} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
