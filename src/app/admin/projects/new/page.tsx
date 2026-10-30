import { PageHeader, Panel } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminClient } from "@/lib/admin";

export default async function NewProjectPage() {
  if (!(await getAdminClient())) return null;
  return (
    <>
      <PageHeader title="New project" />
      <Panel>
        <ProjectForm />
      </Panel>
    </>
  );
}
