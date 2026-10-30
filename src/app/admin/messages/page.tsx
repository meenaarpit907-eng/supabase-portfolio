import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { removeMessage, setMessageRead } from "@/app/actions/admin";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminClient } from "@/lib/admin";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function MessagesPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, created_at, read_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader
        title="Messages"
        description="Contact form submissions. Visitors can insert but never read these rows (RLS)."
      />
      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
      <div className="space-y-4">
        {(messages ?? []).map((message) => {
          const unread = message.read_at === null;
          return (
            <article
              key={message.id}
              className={`rounded-xl border bg-card p-5 ${unread ? "border-primary/40" : "border-border"}`}
            >
              <header className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {message.name} <span className="font-normal text-muted-foreground">&lt;{message.email}&gt;</span>
                    {unread ? <Badge className="ml-2">New</Badge> : null}
                  </p>
                  {message.subject ? <p className="text-sm text-foreground/90">{message.subject}</p> : null}
                </div>
                <time dateTime={message.created_at} className="text-xs text-muted-foreground">
                  {dateFormat.format(new Date(message.created_at))} IST
                </time>
              </header>
              <p className="mt-3 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">{message.message}</p>
              <footer className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? "your message"}`)}`}>
                    <Reply /> Reply
                  </a>
                </Button>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="read" value={String(unread)} />
                  <Button type="submit" variant="outline" size="sm">
                    {unread ? <MailOpen /> : <Mail />}
                    {unread ? "Mark read" : "Mark unread"}
                  </Button>
                </form>
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                    <Trash2 /> Remove
                  </Button>
                </form>
              </footer>
            </article>
          );
        })}
        {messages?.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> : null}
      </div>
    </>
  );
}
