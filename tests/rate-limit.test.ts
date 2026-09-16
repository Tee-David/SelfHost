import { describe, expect, it } from "vitest";
import { MemoryRateLimiter } from "../src/lib/rate-limit";
describe("MemoryRateLimiter", () => {
  it("blocks after the configured attempt budget", () => { const limiter = new MemoryRateLimiter(2, 1000); expect(limiter.consume("ip", 0).allowed).toBe(true); expect(limiter.consume("ip", 1).allowed).toBe(true); expect(limiter.consume("ip", 2).allowed).toBe(false); });
  it("allows attempts after the window expires", () => { const limiter = new MemoryRateLimiter(1, 1000); limiter.consume("ip", 0); expect(limiter.consume("ip", 1001).allowed).toBe(true); });
});
