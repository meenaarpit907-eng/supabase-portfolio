import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminClient } from "@/lib/admin";

export default async function AdminProjectsPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, slug, published, featured, sort_order, updated_at")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Projects" description="Drafts are hidden from visitors by RLS." newHref="/admin/projects/new" newLabel="New project" />
      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Slug</TableHead>
              <TableHead className="hidden md:table-cell">Order</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(projects ?? []).map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/projects/${project.id}`} className="hover:text-primary">
                    {project.title}
                  </Link>
                  {project.featured ? <Badge variant="secondary" className="ml-2">Featured</Badge> : null}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">{project.slug}</TableCell>
                <TableCell className="hidden md:table-cell">{project.sort_order}</TableCell>
                <TableCell className="flex justify-end">
                  <PublishToggle table="projects" id={project.id} published={project.published} />
                </TableCell>
              </TableRow>
            ))}
            {projects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No projects yet.</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
