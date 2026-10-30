import { Section } from "@/components/site/section";
import type { Skill } from "@/lib/content";
import { groupSkills } from "@/lib/portfolio";

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
                <li key={skill.id} className="text-sm text-muted-foreground">
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
