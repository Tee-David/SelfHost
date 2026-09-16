const USER_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const DOMAIN_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const DB_RE = /^[a-zA-Z0-9_]{1,64}$/;

export class InvalidIdentifierError extends Error {
  constructor(kind: string) { super(`Invalid ${kind}`); this.name = "InvalidIdentifierError"; }
}
export function assertHestiaUser(value: string): string {
  if (!USER_RE.test(value)) throw new InvalidIdentifierError("Hestia user"); return value;
}
export function assertDomain(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/\.$/, "");
  if (!DOMAIN_RE.test(normalized)) throw new InvalidIdentifierError("domain"); return normalized;
}
export function assertDatabaseName(value: string): string {
  if (!DB_RE.test(value)) throw new InvalidIdentifierError("database name"); return value;
}
