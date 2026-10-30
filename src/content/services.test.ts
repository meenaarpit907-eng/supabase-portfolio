import { describe, expect, it } from "vitest";
import { faqs, packages, process, servicesCta, servicesIntro } from "@/content/services";

describe("services content", () => {
  it("has 3–5 complete packages with unique ids", () => {
    expect(packages.length).toBeGreaterThanOrEqual(3);
    expect(packages.length).toBeLessThanOrEqual(5);
    expect(new Set(packages.map((p) => p.id)).size).toBe(packages.length);
    for (const p of packages) {
      expect(p.includes.length).toBeGreaterThan(0);
      expect(p.timeline).not.toBe("");
      expect(p.price).toMatch(/\$/);
    }
  });
  it("has a process and FAQ", () => {
    expect(process.length).toBeGreaterThan(0);
    expect(faqs.length).toBeGreaterThan(0);
  });
  it("makes no unverified claims about clients, hours or reply time", () => {
    const copy = JSON.stringify({ servicesIntro, packages, process, faqs, servicesCta });
    expect(copy).not.toMatch(/worldwide|founders and small teams|overlap|one working day|48 hours/i);
  });
});
