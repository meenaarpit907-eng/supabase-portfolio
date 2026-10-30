// contact-notify: emails the site owner when a visitor submits the contact form.
//
// Invoked by the `contact_messages_notify` database trigger through pg_net
// (see supabase/migrations/*_contact_notifications.sql). The trigger sends a
// shared secret in `x-webhook-secret`; JWT verification is disabled for this
// function in config.toml because the caller is the database, not a user.
//
// Secrets (supabase secrets set ... / supabase/functions/.env locally):
//   RESEND_API_KEY          Resend API key
//   CONTACT_WEBHOOK_SECRET  same value as the `contact_webhook_secret` Vault secret
//   CONTACT_NOTIFY_TO       where notifications go
//   CONTACT_NOTIFY_FROM     verified Resend sender, e.g. "Portfolio <hello@yourdomain.com>"
//   SITE_URL                optional, used for the "Open the inbox" link

import { buildNotificationEmail, parsePayload, timingSafeEqual } from "./lib.ts";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  const expectedSecret = Deno.env.get("CONTACT_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret") ?? "";
  if (!expectedSecret || !timingSafeEqual(providedSecret, expectedSecret)) {
    return json(401, { error: "unauthorized" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return json(400, { error: "unexpected_payload" });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("CONTACT_NOTIFY_TO");
  const from = Deno.env.get("CONTACT_NOTIFY_FROM") ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("contact-notify: RESEND_API_KEY or CONTACT_NOTIFY_TO is not set");
    return json(500, { error: "not_configured" });
  }

  const email = buildNotificationEmail(payload.record, {
    from,
    to,
    adminUrl: Deno.env.get("SITE_URL") ?? undefined,
  });

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Resend de-duplicates retries with the same key for 24h.
      "Idempotency-Key": `contact-message-${payload.record.id}`,
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`contact-notify: Resend returned ${response.status}: ${detail.slice(0, 500)}`);
    return json(502, { error: "email_failed" });
  }

  return json(200, { ok: true });
});
