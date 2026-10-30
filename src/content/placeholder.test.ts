import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  placeholderCertifications,
  placeholderExperience,
  placeholderProfile,
  placeholderProjects,
  placeholderSkills,
} from "@/content/placeholder";
import { projectSchema } from "@/lib/validation";

// The offline preview should match what `supabase db reset` seeds.
const seed = readFileSync(path.join(process.cwd(), "supabase/seed.sql"), "utf8");

describe("placeholder content", () => {
  it("uses the same ids and slugs as supabase/seed.sql", () => {
    for (const row of [
      ...placeholderProjects,
      ...placeholderSkills,
      ...placeholderExperience,
      ...placeholderCertifications,
    ]) {
      expect(seed).toContain(row.id);
    }
    for (const project of placeholderProjects) {
      expect(seed).toContain(`'${project.slug}'`);
    }
    expect(seed).toContain(placeholderProfile.full_name);
  });

  it("uses the same visible copy as supabase/seed.sql", () => {
    const sql = (value: string) => `'${value.replace(/'/g, "''")}'`;
    expect(seed).toContain(sql(placeholderProfile.headline));
    for (const paragraph of placeholderProfile.bio.split("\n\n")) {
      expect(seed).toContain(paragraph);
    }
    for (const project of placeholderProjects) {
      expect(seed, project.slug).toContain(sql(project.title));
      expect(seed, project.slug).toContain(sql(project.summary));
      expect(seed, project.slug).toContain(`array[${project.tech_stack.map(sql).join(", ")}]`);
      for (const paragraph of project.body.split("\n\n")) {
        expect(seed, project.slug).toContain(paragraph);
      }
    }
    for (const skill of placeholderSkills) {
      expect(seed).toContain(`${sql(skill.category)}, ${sql(skill.name)}`);
    }
  });

  it("only contains published rows that pass the admin validation rules", () => {
    for (const project of placeholderProjects) {
      expect(project.published).toBe(true);
      const result = projectSchema.safeParse({
        ...project,
        tech_stack: project.tech_stack.join(", "),
        cover_image_path: project.cover_image_path ?? "",
        repo_url: project.repo_url ?? "",
        live_url: project.live_url ?? "",
        featured: project.featured ? "on" : "",
        published: "on",
        sort_order: String(project.sort_order),
      });
      expect(result.success, project.slug).toBe(true);
    }
  });

  it("has unique project slugs", () => {
    const slugs = placeholderProjects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("contains no placeholder or example copy", () => {
    const visible = JSON.stringify([
      placeholderProfile,
      placeholderProjects,
      placeholderSkills,
      placeholderExperience,
      placeholderCertifications,
    ]);
    expect(visible).not.toMatch(/placeholder|example|lorem|todo/i);
    const seedRows = seed.replace(/^--.*$/gm, "");
    expect(seedRows).not.toMatch(/placeholder|example|lorem|todo/i);
  });
});
