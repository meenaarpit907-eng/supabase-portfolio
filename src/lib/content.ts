import "server-only";

import { cache } from "react";
import {
  placeholderExperience,
  placeholderProfile,
  placeholderProjects,
  placeholderSkills,
} from "@/content/placeholder";
import { createPublicClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Profile = Tables<"profile">;
export type Project = Tables<"projects">;
export type Skill = Tables<"skills">;
export type Experience = Tables<"experience">;

export type ContentSource = "supabase" | "placeholder";

export type PortfolioContent = {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  source: ContentSource;
};

export const PLACEHOLDER_CONTENT: PortfolioContent = {
  profile: placeholderProfile,
  projects: placeholderProjects,
  skills: placeholderSkills,
  experience: placeholderExperience,
  source: "placeholder",
};

function logFallback(reason: string) {
  console.warn(`[content] using placeholder content: ${reason}`);
}

/**
 * Loads everything the public site shows in one round of parallel queries.
 * Runs as the anon role: RLS returns only published rows. Falls back to the
 * bundled placeholder content when Supabase is not configured or unreachable,
 * so the site always renders.
 */
export const getPortfolioContent = cache(async (): Promise<PortfolioContent> => {
  const supabase = createPublicClient();
  if (!supabase) {
    return PLACEHOLDER_CONTENT;
  }

  try {
    const [profile, projects, skills, experience] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("skills")
        .select("*")
        .eq("published", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
      supabase
        .from("experience")
        .select("*")
        .eq("published", true)
        .order("start_date", { ascending: false }),
    ]);

    const error = profile.error ?? projects.error ?? skills.error ?? experience.error;
    if (error) {
      logFallback(error.message);
      return PLACEHOLDER_CONTENT;
    }

    return {
      // An empty database (no seed yet) still renders a sensible profile.
      profile: profile.data ?? placeholderProfile,
      projects: projects.data ?? [],
      skills: skills.data ?? [],
      experience: experience.data ?? [],
      source: "supabase",
    };
  } catch (error) {
    logFallback(error instanceof Error ? error.message : String(error));
    return PLACEHOLDER_CONTENT;
  }
});

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const content = await getPortfolioContent();
  return content.projects.find((project) => project.slug === slug) ?? null;
}
