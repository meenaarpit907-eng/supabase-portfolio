import { ProjectCard } from "@/components/site/project-card";
import { Section } from "@/components/site/section";
import type { Project } from "@/lib/content";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="Each project is a row in public.projects. Drafts stay hidden from visitors by RLS until they are published."
      className="border-t border-border/60"
    >
      {projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No published projects yet.</p>
      )}
    </Section>
  );
}
