// Pure presentation helpers shared by the public site and admin (unit-tested).

export type SkillLike = { category: string; name: string; sort_order: number };

/** Groups skills by category, keeping categories in first-seen order and skills by sort_order. */
export function groupSkills<T extends SkillLike>(skills: T[]): { category: string; skills: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return [...groups.entries()].map(([category, list]) => ({
    category,
    skills: [...list].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
  }));
}

const MONTH_FORMAT = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

/** "Jan 2024 – Present" from ISO dates (YYYY-MM-DD). */
export function formatDateRange(start: string, end: string | null): string {
  const from = MONTH_FORMAT.format(new Date(`${start}T00:00:00Z`));
  const to = end ? MONTH_FORMAT.format(new Date(`${end}T00:00:00Z`)) : "Present";
  return `${from} – ${to}`;
}

/** Splits a plain-text body into paragraphs on blank lines. */
export function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** URL-safe slug matching the database check constraint. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** "Next.js, Postgres , ,RLS" -> ["Next.js", "Postgres", "RLS"] (deduplicated). */
export function parseList(value: string, separator: RegExp = /[,\n]/): string[] {
  const seen = new Set<string>();
  const items: string[] = [];
  for (const raw of value.split(separator)) {
    const item = raw.trim();
    if (item && !seen.has(item.toLowerCase())) {
      seen.add(item.toLowerCase());
      items.push(item);
    }
  }
  return items;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
