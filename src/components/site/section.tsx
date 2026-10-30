import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, eyebrow, title, description, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-20 py-20 sm:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">{eyebrow}</p>
          <h2 id={`${id}-title`} className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description ? <p className="text-base leading-7 text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
