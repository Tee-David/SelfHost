import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "selfhost_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = { sub: string; exp: number };

function encode(value: string | Buffer): string { return Buffer.from(value).toString("base64url"); }
function sign(payload: string, secret: string): string { return createHmac("sha256", secret).update(payload).digest("base64url"); }

export function createSessionToken(user: string, secret: string, now = Date.now()): string {
  const payload = encode(JSON.stringify({ sub: user, exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS } satisfies SessionPayload));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string, secret: string, now = Date.now()): SessionPayload | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = sign(payload, secret);
  const a = Buffer.from(signature); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof decoded.sub !== "string" || !decoded.sub || typeof decoded.exp !== "number" || decoded.exp <= Math.floor(now / 1000)) return null;
    return { sub: decoded.sub, exp: decoded.exp };
  } catch { return null; }
}

export function sessionCookieOptions(production: boolean) {
  return { httpOnly: true, secure: production, sameSite: "strict" as const, path: "/", maxAge: SESSION_TTL_SECONDS };
}
