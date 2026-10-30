import { describe, expect, it } from "vitest";
import { formatDateRange, groupSkills, initials, parseList, slugify, toParagraphs } from "@/lib/portfolio";

describe("groupSkills", () => {
  it("keeps category order and sorts skills inside a category", () => {
    const groups = groupSkills([
      { category: "Supabase", name: "RLS", sort_order: 2 },
      { category: "Frontend", name: "React", sort_order: 1 },
      { category: "Supabase", name: "Auth", sort_order: 1 },
    ]);
    expect(groups.map((g) => g.category)).toEqual(["Supabase", "Frontend"]);
    expect(groups[0].skills.map((s) => s.name)).toEqual(["Auth", "RLS"]);
  });
});

describe("formatDateRange", () => {
  it("formats closed and open ranges", () => {
    expect(formatDateRange("2023-01-15", "2024-06-01")).toBe("Jan 2023 – Jun 2024");
    expect(formatDateRange("2024-07-01", null)).toBe("Jul 2024 – Present");
  });
});

describe("text helpers", () => {
  it("splits paragraphs on blank lines", () => {
    expect(toParagraphs("One\nstill one\n\n  Two  \n\n\n")).toEqual(["One\nstill one", "Two"]);
  });

  it("slugifies to the database slug format", () => {
    expect(slugify("  Supabase Portfolio — v2! ")).toBe("supabase-portfolio-v2");
    expect(slugify("Crème brûlée")).toBe("creme-brulee");
    expect(slugify("x".repeat(100))).toHaveLength(80);
  });

  it("parses comma lists without blanks or duplicates", () => {
    expect(parseList("Next.js, Postgres , ,RLS, postgres")).toEqual(["Next.js", "Postgres", "RLS"]);
  });

  it("builds initials", () => {
    expect(initials("Arpit Meena")).toBe("AM");
    expect(initials("Ada")).toBe("A");
  });
});
