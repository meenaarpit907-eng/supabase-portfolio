// Pure helpers for the contact-notify Edge Function. No Deno globals here, so
// the same file is unit-tested with vitest (see lib.test.ts).

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export type WebhookPayload = {
  type: "INSERT";
  table: "contact_messages";
  record: ContactRecord;
};

export type ResendEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
};

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** Constant-time string comparison for the shared webhook secret. */
export function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates the JSON body sent by the database trigger. Returns null if it is not a contact insert. */
export function parsePayload(body: unknown): WebhookPayload | null {
  if (!isRecord(body) || body.type !== "INSERT" || body.table !== "contact_messages") {
    return null;
  }
  const record = body.record;
  if (!isRecord(record)) {
    return null;
  }
  const { id, name, email, subject, message, created_at } = record;
  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof created_at !== "string" ||
    (subject !== null && subject !== undefined && typeof subject !== "string")
  ) {
    return null;
  }
  return {
    type: "INSERT",
    table: "contact_messages",
    record: { id, name, email, subject: subject ?? null, message, created_at },
  };
}

/** Strips CR/LF so user input cannot inject extra email headers via the subject. */
function singleLine(value: string, max = 150): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export function buildNotificationEmail(
  record: ContactRecord,
  options: { from: string; to: string; adminUrl?: string },
): ResendEmail {
  const subjectLine = singleLine(
    record.subject ? `Portfolio: ${record.subject} (from ${record.name})` : `Portfolio message from ${record.name}`,
  );
  const received = new Date(record.created_at).toUTCString();
  const adminLink = options.adminUrl ? `${options.adminUrl.replace(/\/$/, "")}/admin/messages` : null;

  const text = [
    `New message from your portfolio contact form.`,
    ``,
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    record.subject ? `Subject: ${record.subject}` : null,
    `Received: ${received}`,
    ``,
    record.message,
    adminLink ? `\nInbox: ${adminLink}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
<p>New message from your portfolio contact form.</p>
<table cellpadding="4" style="border-collapse:collapse">
<tr><td><strong>Name</strong></td><td>${escapeHtml(record.name)}</td></tr>
<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(record.email)}">${escapeHtml(record.email)}</a></td></tr>
${record.subject ? `<tr><td><strong>Subject</strong></td><td>${escapeHtml(record.subject)}</td></tr>` : ""}
<tr><td><strong>Received</strong></td><td>${escapeHtml(received)}</td></tr>
</table>
<blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #3ecf8e;background:#f6f8f7;white-space:pre-wrap">${escapeHtml(record.message)}</blockquote>
${adminLink ? `<p><a href="${escapeHtml(adminLink)}">Open the inbox</a></p>` : ""}
</body></html>`;

  return {
    from: options.from,
    to: [options.to],
    reply_to: record.email,
    subject: subjectLine,
    text,
    html,
  };
}
