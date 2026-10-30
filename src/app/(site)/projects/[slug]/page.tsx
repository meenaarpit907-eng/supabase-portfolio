import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/site/icons";
import { ProjectCover } from "@/components/site/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPortfolioContent, getProjectBySlug } from "@/lib/content";
import { storagePublicUrl } from "@/lib/env";
import { toParagraphs } from "@/lib/portfolio";

export const revalidate = 300;
// New projects published from /admin render on first request.
export const dynamicParams = true;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { projects } = await getPortfolioContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found", robots: { index: false } };
  }
  const cover = storagePublicUrl(project.cover_image_path);
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      ...(cover ? { images: [{ url: cover, alt: project.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground">
        <Link href="/#projects">
          <ArrowLeft /> All projects
        </Link>
      </Button>
      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <li key={tech}>
              <Badge variant="secondary" className="font-normal">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          {project.live_url ? (
            <Button asChild>
              <a href={project.live_url} target="_blank" rel="noreferrer">
                <ExternalLink /> Live site
              </a>
            </Button>
          ) : null}
          {project.repo_url ? (
            <Button asChild variant="outline">
              <a href={project.repo_url} target="_blank" rel="noreferrer">
                <GitHubIcon /> Source code
              </a>
            </Button>
          ) : null}
        </div>
      </header>
      <div className="my-10 overflow-hidden rounded-xl border border-border">
        <ProjectCover project={project} />
      </div>
      <div className="max-w-3xl space-y-5 text-base leading-8 text-muted-foreground">
        {toParagraphs(project.body).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
