import { describe, expect, it } from "vitest";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions, verifySessionToken } from "../src/lib/auth/session";
const secret = "s".repeat(32);
describe("sessions", () => {
  it("uses a project-specific cookie", () => expect(SESSION_COOKIE).toBe("selfhost_session"));
  it("round-trips a signed session", () => { const token = createSessionToken("admin", secret, 0); expect(verifySessionToken(token, secret, 1)?.sub).toBe("admin"); });
  it("rejects tampering", () => { const token = createSessionToken("admin", secret); expect(verifySessionToken(`${token}x`, secret)).toBeNull(); });
  it("rejects expired sessions", () => { const token = createSessionToken("admin", secret, 0); expect(verifySessionToken(token, secret, 8 * 24 * 60 * 60_000)).toBeNull(); });
  it("sets hardened production cookie flags", () => expect(sessionCookieOptions(true)).toMatchObject({ httpOnly: true, secure: true, sameSite: "strict" }));
});
