import Link from "next/link";
import { cn } from "@/lib/utils";

type LegalLinksProps = {
  className?: string;
};

export function LegalLinks({ className }: LegalLinksProps) {
  return (
    <nav
      aria-label="Legal"
      className={cn("flex items-center gap-4 text-sm text-muted-foreground", className)}
    >
      <Link href="/privacy" className="underline-offset-4 hover:text-foreground hover:underline">
        Privacy
      </Link>
      <Link href="/terms" className="underline-offset-4 hover:text-foreground hover:underline">
        Terms
      </Link>
    </nav>
  );
}