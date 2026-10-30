/** Only allow same-site relative redirects after sign-in (blocks //evil.com and /\evil.com). */
export function safeNextPath(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
