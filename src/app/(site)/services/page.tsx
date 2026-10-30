import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs, packages, process, servicesCta, servicesIntro, showPrices } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Section id="services" eyebrow={servicesIntro.eyebrow} title={servicesIntro.title} description={servicesIntro.description}>
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <Card key={pkg.id} id={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <ul className="space-y-2 text-sm">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-4" aria-hidden /> {pkg.timeline}
                  </span>
                  <span className="font-mono text-primary">{showPrices ? pkg.price : "Fixed quote after a call"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="process" eyebrow="Process" title="How I work" className="border-t border-border/60">
        <ol className="grid gap-6 md:grid-cols-4">
          {process.map((item, index) => (
            <li key={item.step} className="space-y-2">
              <p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="font-heading font-semibold">{item.step}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Common questions" className="border-t border-border/60">
        <dl className="max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-heading font-semibold">{faq.q}</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="start" eyebrow="Next step" title={servicesCta.title} description={servicesCta.description} className="border-t border-border/60">
        <Button asChild size="lg">
          <Link href={servicesCta.href}>{servicesCta.label}</Link>
        </Button>
      </Section>
    </>
  );
}
