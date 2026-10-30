import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader, Panel } from "@/components/admin/page-header";
import { RemoveButton } from "@/components/admin/row-actions";
import { getAdminClient } from "@/lib/admin";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: item } = await supabase.from("experience").select("*").eq("id", id).maybeSingle();
  if (!item) notFound();

  return (
    <>
      <PageHeader title={item.role} description={item.company} />
      <Panel>
        <ExperienceForm item={item} />
      </Panel>
      <div className="mt-6 flex justify-end">
        <RemoveButton table="experience" id={item.id} label={`${item.role} at ${item.company}`} />
      </div>
    </>
  );
}
