export type RateLimitDecision = { allowed: boolean; retryAfterMs: number };
export interface RateLimiter { consume(key: string, now?: number): RateLimitDecision; reset(key: string): void; }

/** Process-local limiter suitable for a single SelfHost instance. Use a shared implementation when horizontally scaling. */
export class MemoryRateLimiter implements RateLimiter {
  private readonly attempts = new Map<string, number[]>();
  constructor(private readonly maxAttempts = 5, private readonly windowMs = 15 * 60_000) {}
  consume(key: string, now = Date.now()): RateLimitDecision {
    const cutoff = now - this.windowMs;
    const recent = (this.attempts.get(key) ?? []).filter((time) => time > cutoff);
    if (recent.length >= this.maxAttempts) return { allowed: false, retryAfterMs: Math.max(0, recent[0]! + this.windowMs - now) };
    recent.push(now); this.attempts.set(key, recent); return { allowed: true, retryAfterMs: 0 };
  }
  reset(key: string) { this.attempts.delete(key); }
}
