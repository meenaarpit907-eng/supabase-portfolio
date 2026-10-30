import { PreviewBanner } from "@/components/site/preview-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPortfolioContent } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getPortfolioContent();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      {content.source === "placeholder" ? <PreviewBanner /> : null}
      <SiteHeader
        profile={content.profile}
        hasExperience={content.experience.length > 0}
        hasCertifications={content.certifications.length > 0}
      />
      <main id="main">{children}</main>
      <SiteFooter profile={content.profile} />
    </>
  );
}
