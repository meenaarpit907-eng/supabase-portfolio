import { About } from "@/components/site/about";
import { Architecture } from "@/components/site/architecture";
import { Certifications } from "@/components/site/certifications";
import { Contact } from "@/components/site/contact";
import { Experience } from "@/components/site/experience";
import { Hero } from "@/components/site/hero";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import { getPortfolioContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/env";

// Static + ISR: rebuilt at most every 5 minutes, and immediately after admin
// edits (revalidatePath in the admin actions).
export const revalidate = 300;

export default async function HomePage() {
  const content = await getPortfolioContent();
  const { profile } = content;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    description: profile.headline,
    url: getSiteUrl(),
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    sameAs: [profile.github_url, profile.linkedin_url, profile.x_url, profile.website_url].filter(Boolean),
    knowsAbout: content.skills.map((skill) => skill.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped so content cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero profile={profile} />
      <About content={content} />
      <Projects projects={content.projects} />
      <Skills skills={content.skills} />
      <Experience experience={content.experience} />
      <Certifications certifications={content.certifications} />
      <Architecture />
      <Contact profile={profile} />
    </>
  );
}
