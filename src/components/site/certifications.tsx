import { ExternalLink } from "lucide-react";
import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import type { Certification } from "@/lib/content";

const MONTH_FORMAT = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

function formatMonth(date: string): string {
  return MONTH_FORMAT.format(new Date(`${date}T00:00:00Z`));
}

/** Rendered from public.certifications (or the fallback list). Hidden when there are none. */
export function Certifications({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <Section id="certifications" eyebrow="Certifications" title="Certificates" className="border-t border-border/60">
      <ul className="grid gap-6 md:grid-cols-2">
        {certifications.map((cert) => (
          <li key={cert.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-medium">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">
                {cert.issuer}
                {cert.issued_on ? ` · Issued ${formatMonth(cert.issued_on)}` : ""}
                {cert.expires_on ? ` · Expires ${formatMonth(cert.expires_on)}` : ""}
              </p>
              {cert.credential_id ? (
                <p className="font-mono text-xs text-muted-foreground">Credential ID {cert.credential_id}</p>
              ) : null}
            </div>
            {cert.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            {cert.credential_url ? (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Show credential <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
