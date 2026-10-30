"use server";

import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/rate-limit";
import { createPublicClient } from "@/lib/supabase/server";
import { contactSchema, fieldErrors, formDataToObject, isLikelySpam } from "@/lib/validation";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors?: Record<string, string>;
};

// 5 submissions per IP per 10 minutes per server instance. The database adds a
// shared per-email and global limit on top (see the rate limit trigger).
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const SUCCESS: ContactState = {
  status: "success",
  message: "Thanks! Your message is on its way. I usually reply within a couple of days.",
};

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const fields = formDataToObject(formData);

  // Validate first so a person who submits too quickly still sees field errors.
  const parsed = contactSchema.safeParse(fields);
  if (!parsed.success) {
    return { status: "error", message: "Check the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  // Honeypot / too-fast submissions: pretend it worked so bots learn nothing.
  if (isLikelySpam({ website: fields.website, startedAt: fields.startedAt })) {
    return SUCCESS;
  }

  const { allowed } = limiter.check(await clientIp());
  if (!allowed) {
    return { status: "error", message: "Too many messages. Please try again in a few minutes." };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return {
      status: "error",
      message: "The contact form isn't connected to a database yet. Please email me directly instead.",
    };
  }

  // Insert only; anon has no SELECT on contact_messages, so do not ask for the
  // row back (no .select()).
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    if (error.hint === "rate_limited") {
      return { status: "error", message: error.message };
    }
    console.error("[contact] insert failed", error.code, error.message);
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }

  return SUCCESS;
}
