import { Mail } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Section } from "@/components/site/section";
import { SocialLinks } from "@/components/site/social-links";
import type { Profile } from "@/lib/content";

export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something on Supabase"
      description="Hiring for a Supabase, Postgres or full-stack role, or have a project in mind? Send a message. It is stored in Supabase, and I reply within a couple of days."
      className="border-t border-border/60"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Mail className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Email me directly</span>
                <span className="block font-medium">{profile.email}</span>
              </span>
            </a>
          ) : null}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or find me on</p>
            <SocialLinks profile={profile} />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Spam protection: a hidden honeypot field, a minimum fill time, a per-IP limit in the app and a per-address
            limit enforced by a Postgres trigger.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
