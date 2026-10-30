import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { RemoveButton } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";
import { getAdminClient } from "@/lib/admin";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.title} description={project.published ? "Published" : "Draft (hidden from visitors)"} />
      <Panel>
        <ProjectForm project={project} />
      </Panel>
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/projects/${project.slug}`} target="_blank">
            <ExternalLink /> View page
          </Link>
        </Button>
        <RemoveButton table="projects" id={project.id} label={project.title} />
      </div>
    </>
  );
}
