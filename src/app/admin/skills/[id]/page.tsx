import { notFound } from "next/navigation";
import { PageHeader, Panel } from "@/components/admin/page-header";
import { RemoveButton } from "@/components/admin/row-actions";
import { SkillForm } from "@/components/admin/skill-form";
import { getAdminClient } from "@/lib/admin";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: skill } = await supabase.from("skills").select("*").eq("id", id).maybeSingle();
  if (!skill) notFound();

  return (
    <>
      <PageHeader title={skill.name} description={skill.category} />
      <Panel>
        <SkillForm skill={skill} />
      </Panel>
      <div className="mt-6 flex justify-end">
        <RemoveButton table="skills" id={skill.id} label={skill.name} />
      </div>
    </>
  );
}
