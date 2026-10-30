import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/redirects";

describe("safeNextPath", () => {
  it("keeps same-site paths", () => {
    expect(safeNextPath("/admin/projects")).toBe("/admin/projects");
  });

  it("rejects open redirects", () => {
    expect(safeNextPath("https://evil.example")).toBe("/admin");
    expect(safeNextPath("//evil.example")).toBe("/admin");
    expect(safeNextPath("/\\evil.example")).toBe("/admin");
    expect(safeNextPath(null)).toBe("/admin");
  });
});
