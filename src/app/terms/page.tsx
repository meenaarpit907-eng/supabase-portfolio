import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use this portfolio website.",
};

const CONTACT_EMAIL = "meenaarpit907@gmail.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" lastUpdated="October 30, 2026">
      <section>
        <p>
          These terms apply to your use of this portfolio website, operated by Arpit Meena. By using
          the site you agree to them.
        </p>
      </section>

      <section>
        <h2>Content</h2>
        <p>
          The text, images and project descriptions on this site are mine unless stated otherwise.
          You may link to and quote them with attribution. Source code in the linked repository is
          covered by that repository&apos;s license.
        </p>
      </section>

      <section>
        <h2>Contact form</h2>
        <p>
          Please use the contact form only for genuine enquiries. Do not send spam, malware or
          unlawful content. How messages are handled is described in the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The site is provided &quot;as is&quot;, without warranties of any kind. Information may be
          incomplete or out of date.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
