import { PageHeader, Panel } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { getAdminClient } from "@/lib/admin";

export default async function NewSkillPage() {
  if (!(await getAdminClient())) return null;
  return (
    <>
      <PageHeader title="Add skill" />
      <Panel>
        <SkillForm />
      </Panel>
    </>
  );
}
