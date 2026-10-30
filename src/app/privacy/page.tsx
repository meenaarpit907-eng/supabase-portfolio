import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What this portfolio collects through its contact form and how it is used.",
};

const CONTACT_EMAIL = "meenaarpit907@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="October 30, 2026">
      <section>
        <p>
          This is the personal portfolio of Arpit Meena (&quot;I&quot;, &quot;me&quot;). It is a
          read-only website for visitors. This policy explains the little information it collects
          and how it is used.
        </p>
      </section>

      <section>
        <h2>Information collected</h2>
        <ul>
          <li>
            <strong>Contact form:</strong> if you send a message, I receive your name, email
            address, optional subject and message. They are stored in a Supabase Postgres database
            and emailed to me through Resend.
          </li>
          <li>
            <strong>No visitor accounts or tracking:</strong> visitors do not sign in, and the site
            sets no analytics or advertising cookies. Sign-in for the private admin pages is
            provided by Clerk, which may set essential session cookies (for example, to know that
            nobody is signed in); they are not used for tracking.
          </li>
          <li>
            <strong>Server logs:</strong> the hosting and service providers (Vercel, Supabase and Clerk) may keep
            standard request logs, such as IP address and browser type, for security and
            reliability.
          </li>
        </ul>
      </section>

      <section>
        <h2>How it is used</h2>
        <p>
          Contact messages are used only to reply to you. They are never sold or shared for
          marketing. A short-lived, in-memory record of your IP address is used to rate-limit the
          contact form against spam.
        </p>
      </section>

      <section>
        <h2>Retention and deletion</h2>
        <p>
          Messages are kept until I delete them from the admin inbox. To have your message deleted,
          email me and I will remove it.
        </p>
      </section>

      <section>
        <h2>Service providers</h2>
        <ul>
          <li>Vercel hosts the website.</li>
          <li>Supabase stores the site content and contact messages.</li>
          <li>Resend delivers contact-form notification emails.</li>
        </ul>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>The date at the top of this page shows when this policy was last changed.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
