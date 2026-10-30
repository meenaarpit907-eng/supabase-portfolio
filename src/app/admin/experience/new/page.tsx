import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader, Panel } from "@/components/admin/page-header";
import { getAdminClient } from "@/lib/admin";

export default async function NewExperiencePage() {
  if (!(await getAdminClient())) return null;
  return (
    <>
      <PageHeader title="Add role" />
      <Panel>
        <ExperienceForm />
      </Panel>
    </>
  );
}
