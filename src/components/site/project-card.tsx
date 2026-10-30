import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { storagePublicUrl } from "@/lib/env";
import type { Project } from "@/lib/content";

export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const cover = storagePublicUrl(project.cover_image_path);
  if (cover) {
    return (
      <Image
        src={cover}
        alt=""
        width={1200}
        height={675}
        className={className ?? "aspect-video w-full object-cover"}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`relative grid aspect-video w-full place-items-center overflow-hidden bg-gradient-to-br from-primary/20 via-card to-card ${className ?? ""}`}
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <span className="relative font-mono text-sm text-primary/80">/{project.slug}</span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-heading text-lg font-medium">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.title}
            </Link>
            {project.featured ? <Star className="size-4 fill-primary text-primary" aria-label="Featured" /> : null}
            <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">{project.summary}</p>
        </div>
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <li key={tech}>
              <Badge variant="secondary" className="font-normal">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
