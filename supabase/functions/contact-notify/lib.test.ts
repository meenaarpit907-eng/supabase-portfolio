import { describe, expect, it } from "vitest";
import { buildNotificationEmail, escapeHtml, parsePayload, timingSafeEqual } from "./lib";

const record = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Ada <script>",
  email: "ada@example.com",
  subject: "Role at Supabase\r\nBcc: attacker@example.com",
  message: "Hi Arpit,\n<b>loved</b> the RLS write-up.",
  created_at: "2026-10-30T05:00:00.000Z",
};

describe("contact-notify helpers", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("compares secrets in constant time and rejects mismatches", () => {
    expect(timingSafeEqual("secret", "secret")).toBe(true);
    expect(timingSafeEqual("secret", "secreT")).toBe(false);
    expect(timingSafeEqual("secret", "secret-longer")).toBe(false);
    expect(timingSafeEqual("", "x")).toBe(false);
  });

  it("accepts only contact_messages INSERT payloads", () => {
    expect(parsePayload({ type: "INSERT", table: "contact_messages", record })).not.toBeNull();
    expect(parsePayload({ type: "UPDATE", table: "contact_messages", record })).toBeNull();
    expect(parsePayload({ type: "INSERT", table: "projects", record })).toBeNull();
    expect(parsePayload({ type: "INSERT", table: "contact_messages", record: { ...record, email: 42 } })).toBeNull();
    expect(parsePayload("nope")).toBeNull();
  });

  it("builds a safe email with reply-to set to the visitor", () => {
    const email = buildNotificationEmail(record, {
      from: "Portfolio <hi@example.com>",
      to: "me@example.com",
      adminUrl: "https://example.com/",
    });
    expect(email.reply_to).toBe("ada@example.com");
    expect(email.to).toEqual(["me@example.com"]);
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;b&gt;loved&lt;/b&gt;");
    expect(email.html).toContain("https://example.com/admin/messages");
    expect(email.text).toContain("Hi Arpit,");
  });
});
