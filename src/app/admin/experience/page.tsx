import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminClient } from "@/lib/admin";
import { formatDateRange } from "@/lib/portfolio";

export default async function AdminExperiencePage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: items, error } = await supabase
    .from("experience")
    .select("id, role, company, start_date, end_date, published")
    .order("start_date", { ascending: false });

  return (
    <>
      <PageHeader title="Experience" newHref="/admin/experience/new" newLabel="Add role" />
      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden sm:table-cell">Dates</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(items ?? []).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/experience/${item.id}`} className="hover:text-primary">
                    {item.role}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.company}</TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {formatDateRange(item.start_date, item.end_date)}
                </TableCell>
                <TableCell className="flex justify-end">
                  <PublishToggle table="experience" id={item.id} published={item.published} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
