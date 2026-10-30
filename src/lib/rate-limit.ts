/**
 * Small fixed-window rate limiter for the contact form.
 *
 * In-memory, so on serverless it is per instance: a first line of defence
 * only. The database enforces the real limit in a trigger
 * (private.enforce_contact_rate_limit), which every instance shares.
 */
export type RateLimiter = {
  check(key: string, now?: number): { allowed: boolean; retryAfterMs: number };
};

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key, now = Date.now()) {
      // Opportunistic cleanup so the map cannot grow without bound.
      if (hits.size > 5000) {
        for (const [k, v] of hits) {
          if (v.resetAt <= now) hits.delete(k);
        }
      }

      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterMs: 0 };
      }
      if (entry.count >= limit) {
        return { allowed: false, retryAfterMs: entry.resetAt - now };
      }
      entry.count += 1;
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
