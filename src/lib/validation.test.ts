import { describe, expect, it } from "vitest";
import {
  CONTACT_MIN_FILL_MS,
  contactSchema,
  experienceSchema,
  fieldErrors,
  formDataToObject,
  isLikelySpam,
  profileSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validation";

describe("contactSchema", () => {
  it("accepts a normal message and trims it", () => {
    const result = contactSchema.parse({
      name: "  Ada ",
      email: "ada@example.com",
      subject: "",
      message: "Hello, I would like to talk about a role.",
    });
    expect(result).toEqual({
      name: "Ada",
      email: "ada@example.com",
      subject: null,
      message: "Hello, I would like to talk about a role.",
    });
  });

  it("rejects bad email and short messages with field errors", () => {
    const result = contactSchema.safeParse({ name: "", email: "nope", message: "hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
    }
  });

  it("enforces the same limits as the database check constraints", () => {
    const tooLong = "x".repeat(5001);
    expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: tooLong }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "x".repeat(121), email: "a@b.co", message: "long enough" }).success).toBe(
      false,
    );
  });
});

describe("isLikelySpam", () => {
  const now = 1_800_000_000_000;

  it("flags a filled honeypot", () => {
    expect(isLikelySpam({ website: "http://spam.example", startedAt: String(now - 60_000) }, now)).toBe(true);
  });

  it("flags submissions faster than the minimum fill time", () => {
    expect(isLikelySpam({ startedAt: String(now - (CONTACT_MIN_FILL_MS - 1)) }, now)).toBe(true);
  });

  it("flags garbage or future timestamps", () => {
    expect(isLikelySpam({ startedAt: "abc" }, now)).toBe(true);
    expect(isLikelySpam({ startedAt: String(now + 10_000) }, now)).toBe(true);
  });

  it("lets a human through, including without JavaScript", () => {
    expect(isLikelySpam({ website: "", startedAt: String(now - 20_000) }, now)).toBe(false);
    expect(isLikelySpam({ website: "", startedAt: "" }, now)).toBe(false);
  });
});

describe("projectSchema", () => {
  const base = {
    title: "Portfolio",
    slug: "supabase-portfolio",
    summary: "A site",
    body: "",
    tech_stack: "Supabase, Next.js, supabase",
    cover_image_path: "",
    repo_url: "",
    live_url: "https://example.com",
    sort_order: "2",
  };

  it("normalises lists, checkboxes and empty strings", () => {
    const result = projectSchema.parse({ ...base, published: "on" });
    expect(result.tech_stack).toEqual(["Supabase", "Next.js"]);
    expect(result.published).toBe(true);
    expect(result.featured).toBe(false);
    expect(result.repo_url).toBeNull();
    expect(result.cover_image_path).toBeNull();
    expect(result.sort_order).toBe(2);
  });

  it("rejects slugs the database would reject", () => {
    expect(projectSchema.safeParse({ ...base, slug: "Bad Slug" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, slug: "trailing-" }).success).toBe(false);
  });

  it("only accepts https links and safe storage paths", () => {
    expect(projectSchema.safeParse({ ...base, live_url: "javascript:alert(1)" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, live_url: "http://example.com" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, cover_image_path: "projects/a b.png" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, cover_image_path: "projects/a-1.png" }).success).toBe(true);
  });
});

describe("skillSchema", () => {
  it("keeps proficiency within 1-5", () => {
    expect(skillSchema.safeParse({ name: "RLS", category: "Supabase", proficiency: "6" }).success).toBe(false);
    expect(skillSchema.parse({ name: "RLS", category: "Supabase", proficiency: "5" }).proficiency).toBe(5);
  });
});

describe("experienceSchema", () => {
  const base = { company: "Acme", role: "Engineer", start_date: "2024-01-01", end_date: "" };

  it("treats an empty end date as a current role", () => {
    expect(experienceSchema.parse(base).end_date).toBeNull();
  });

  it("splits highlights on new lines only", () => {
    const result = experienceSchema.parse({ ...base, highlights: "Cut p95 by 40%, using indexes\nShipped RLS" });
    expect(result.highlights).toEqual(["Cut p95 by 40%, using indexes", "Shipped RLS"]);
  });

  it("rejects an end date before the start date", () => {
    const result = experienceSchema.safeParse({ ...base, end_date: "2023-12-31" });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).end_date).toBeDefined();
  });
});

describe("profileSchema", () => {
  it("allows an empty email but validates a filled one", () => {
    const base = { full_name: "Arpit", headline: "Engineer" };
    expect(profileSchema.parse({ ...base, email: "" }).email).toBeNull();
    expect(profileSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });
});

describe("missing form fields", () => {
  it("treats absent optional fields and unchecked checkboxes as empty", () => {
    // Browsers omit unchecked checkboxes from FormData entirely.
    expect(profileSchema.parse({ full_name: "A", headline: "B" })).toMatchObject({
      website_url: null,
      avatar_path: null,
      email: null,
      available_for_work: false,
    });
    expect(experienceSchema.parse({ company: "A", role: "B", start_date: "2024-01-01" })).toMatchObject({
      end_date: null,
      highlights: [],
      published: false,
    });
  });
});

describe("formDataToObject", () => {
  it("keeps strings and drops files and Next.js action fields", () => {
    const formData = new FormData();
    formData.set("name", "Ada");
    formData.set("$ACTION_ID_abc", "");
    formData.set("file", new Blob(["x"]), "x.txt");
    expect(formDataToObject(formData)).toEqual({ name: "Ada" });
  });
});
