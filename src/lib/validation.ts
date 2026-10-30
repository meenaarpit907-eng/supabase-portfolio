import { z } from "zod";
import { parseList } from "@/lib/portfolio";

// Optional form fields may be missing from FormData entirely, so each one
// defaults to "" before it is normalised to null.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .default("")
    .transform((value) => (value === "" ? null : value));

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(500)
  .default("")
  .refine((value) => value === "" || /^https:\/\/[^\s]+$/i.test(value), "Use a full https:// URL")
  .transform((value) => (value === "" ? null : value));

// An unchecked checkbox is simply absent from FormData.
const checkbox = z
  .string()
  .optional()
  .transform((value) => value === "on" || value === "true");

const listField = (maxItems: number, separator?: RegExp) =>
  z
    .string()
    .max(5000)
    .default("")
    .transform((value) => parseList(value, separator))
    .refine((items) => items.length <= maxItems, `At most ${maxItems} items`);

const storagePath = z
  .string()
  .trim()
  .max(512)
  .default("")
  .refine((value) => value === "" || /^[\w./-]+$/.test(value), "Invalid file path")
  .transform((value) => (value === "" ? null : value));

/** Minimum time between rendering the contact form and submitting it. Bots are faster. */
export const CONTACT_MIN_FILL_MS = 3000;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Tell me your name").max(120),
  email: z.string().trim().max(254).email("Enter a valid email address"),
  subject: optionalText(200),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters")
    .max(5000, "Keep it under 5000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Spam heuristics that run before validation. `website` is a honeypot field
 * hidden from people. `startedAt` is set by the browser when the form mounts;
 * a submission faster than CONTACT_MIN_FILL_MS is almost certainly a bot.
 * (startedAt is missing when JavaScript is off, so that alone is not spam.)
 */
export function isLikelySpam(
  fields: { website?: string | null; startedAt?: string | null },
  now: number = Date.now(),
): boolean {
  if (fields.website && fields.website.trim() !== "") {
    return true;
  }
  if (!fields.startedAt) {
    return false;
  }
  const started = Number(fields.startedAt);
  if (!Number.isFinite(started) || started <= 0 || started > now) {
    return true;
  }
  return now - started < CONTACT_MIN_FILL_MS;
}

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  summary: z.string().trim().min(1, "Summary is required").max(300),
  body: z.string().trim().max(20000).default(""),
  tech_stack: listField(20),
  cover_image_path: storagePath,
  repo_url: optionalHttpsUrl,
  live_url: optionalHttpsUrl,
  featured: checkbox,
  published: checkbox,
  sort_order: z.coerce.number().int().min(-100000).max(100000).default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.string().trim().min(1, "Category is required").max(60),
  proficiency: z.coerce.number().int().min(1).max(5),
  sort_order: z.coerce.number().int().min(-100000).max(100000).default(0),
  published: checkbox,
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required").max(120),
    role: z.string().trim().min(1, "Role is required").max(120),
    location: optionalText(120),
    company_url: optionalHttpsUrl,
    start_date: isoDate,
    end_date: z
      .union([isoDate, z.literal("")])
      .default("")
      .transform((value) => (value === "" ? null : value)),
    summary: z.string().trim().max(2000).default(""),
    highlights: listField(12, /\n/),
    tech_stack: listField(20),
    published: checkbox,
  })
  .refine((value) => value.end_date === null || value.end_date >= value.start_date, {
    message: "End date must be after the start date",
    path: ["end_date"],
  });

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  headline: z.string().trim().min(1, "Headline is required").max(200),
  bio: z.string().trim().max(5000).default(""),
  location: optionalText(120),
  email: z
    .string()
    .trim()
    .max(254)
    .default("")
    .refine((value) => value === "" || z.string().email().safeParse(value).success, "Enter a valid email")
    .transform((value) => (value === "" ? null : value)),
  avatar_path: storagePath,
  resume_path: storagePath,
  github_url: optionalHttpsUrl,
  linkedin_url: optionalHttpsUrl,
  x_url: optionalHttpsUrl,
  website_url: optionalHttpsUrl,
  available_for_work: checkbox,
});

/** FormData -> plain object with string values (files ignored). */
export function formDataToObject(formData: FormData): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      result[key] = value;
    }
  }
  return result;
}

/** First error message per field, for showing next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
