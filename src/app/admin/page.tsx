import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminClient } from "@/lib/admin";

export default async function AdminHome() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const head = { count: "exact", head: true } as const;

  const [projects, drafts, skills, experience, messages, unread] = await Promise.all([
    supabase.from("projects").select("id", head),
    supabase.from("projects").select("id", head).eq("published", false),
    supabase.from("skills").select("id", head),
    supabase.from("experience").select("id", head),
    supabase.from("contact_messages").select("id", head),
    supabase.from("contact_messages").select("id", head).is("read_at", null),
  ]);

  const cards = [
    { label: "Projects", value: projects.count ?? 0, note: `${drafts.count ?? 0} drafts`, href: "/admin/projects" },
    { label: "Skills", value: skills.count ?? 0, note: "grouped by category", href: "/admin/skills" },
    { label: "Experience", value: experience.count ?? 0, note: "timeline entries", href: "/admin/experience" },
    { label: "Messages", value: messages.count ?? 0, note: `${unread.count ?? 0} unread`, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Every query here runs as you, through RLS. Admin rights come from public.admins."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="font-heading text-3xl font-semibold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.note}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
