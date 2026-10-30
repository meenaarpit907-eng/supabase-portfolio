import { PageHeader, Panel } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";
import { getAdminClient } from "@/lib/admin";

export default async function AdminProfilePage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: profile } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <PageHeader title="Profile" description="Name, bio, links, avatar and resume shown on the homepage." />
      <Panel>
        <ProfileForm profile={profile} />
      </Panel>
    </>
  );
}
