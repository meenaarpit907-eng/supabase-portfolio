import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminClient } from "@/lib/admin";

export default async function AdminSkillsPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: skills, error } = await supabase
    .from("skills")
    .select("id, name, category, proficiency, sort_order, published")
    .order("category")
    .order("sort_order");

  return (
    <>
      <PageHeader title="Skills" newHref="/admin/skills/new" newLabel="Add skill" />
      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Level</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(skills ?? []).map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/skills/${skill.id}`} className="hover:text-primary">
                    {skill.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{skill.category}</TableCell>
                <TableCell className="hidden sm:table-cell">{skill.proficiency}/5</TableCell>
                <TableCell className="flex justify-end">
                  <PublishToggle table="skills" id={skill.id} published={skill.published} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
