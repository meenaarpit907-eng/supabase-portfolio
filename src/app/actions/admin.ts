"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import {
  experienceSchema,
  fieldErrors,
  formDataToObject,
  profileSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validation";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors?: Record<string, string>;
};

type Table = "projects" | "skills" | "experience";

const UNIQUE_VIOLATION = "23505";

function parse<T extends z.ZodType>(schema: T, formData: FormData) {
  return schema.safeParse(formDataToObject(formData));
}

function invalid(error: z.ZodError): FormState {
  return { status: "error", message: "Fix the highlighted fields.", errors: fieldErrors(error) };
}

function dbError(error: { code?: string; message: string }, uniqueField?: string): FormState {
  if (error.code === UNIQUE_VIOLATION && uniqueField) {
    return {
      status: "error",
      message: "That value is already used.",
      errors: { [uniqueField]: "Already used by another entry" },
    };
  }
  return { status: "error", message: `Database error: ${error.message}` };
}

/** Public pages are ISR-cached; refresh them right after content changes. */
function refreshPublicPages() {
  revalidatePath("/", "layout");
}

const SAVED: FormState = { status: "success", message: "Saved." };

// ---------------------------------------------------------------- profile

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parse(profileSchema, formData);
  if (!parsed.success) return invalid(parsed.error);

  const { error } = await supabase.from("profile").upsert({ id: 1, ...parsed.data });
  if (error) return dbError(error);

  refreshPublicPages();
  return SAVED;
}

// --------------------------------------------------------------- projects

export async function saveProject(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parse(projectSchema, formData);
  if (!parsed.success) return invalid(parsed.error);

  const { error } = id
    ? await supabase.from("projects").update(parsed.data).eq("id", id)
    : await supabase.from("projects").insert(parsed.data);
  if (error) return dbError(error, "slug");

  refreshPublicPages();
  if (!id) redirect("/admin/projects");
  return SAVED;
}

// ----------------------------------------------------------------- skills

export async function saveSkill(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parse(skillSchema, formData);
  if (!parsed.success) return invalid(parsed.error);

  const { error } = id
    ? await supabase.from("skills").update(parsed.data).eq("id", id)
    : await supabase.from("skills").insert(parsed.data);
  if (error) return dbError(error, "name");

  refreshPublicPages();
  if (!id) redirect("/admin/skills");
  return SAVED;
}

// ------------------------------------------------------------- experience

export async function saveExperience(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parse(experienceSchema, formData);
  if (!parsed.success) return invalid(parsed.error);

  const { error } = id
    ? await supabase.from("experience").update(parsed.data).eq("id", id)
    : await supabase.from("experience").insert(parsed.data);
  if (error) return dbError(error);

  refreshPublicPages();
  if (!id) redirect("/admin/experience");
  return SAVED;
}

// ------------------------------------------------------- shared row tools

const LIST_PATH: Record<Table, string> = {
  projects: "/admin/projects",
  skills: "/admin/skills",
  experience: "/admin/experience",
};

function isTable(value: unknown): value is Table {
  return value === "projects" || value === "skills" || value === "experience";
}

export async function removeRow(formData: FormData): Promise<void> {
  const table = formData.get("table");
  const id = formData.get("id");
  if (!isTable(table) || typeof id !== "string") return;

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  refreshPublicPages();
  redirect(LIST_PATH[table]);
}

export async function setPublished(formData: FormData): Promise<void> {
  const table = formData.get("table");
  const id = formData.get("id");
  const published = formData.get("published") === "true";
  if (!isTable(table) || typeof id !== "string") return;

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).update({ published }).eq("id", id);
  if (error) throw new Error(error.message);

  refreshPublicPages();
  revalidatePath(LIST_PATH[table]);
}

// --------------------------------------------------------------- messages

export async function setMessageRead(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const read = formData.get("read") === "true";
  if (typeof id !== "string") return;

  const { supabase } = await requireAdmin();
  // Column grant: authenticated users may only update read_at on messages.
  const { error } = await supabase
    .from("contact_messages")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}

export async function removeMessage(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}
