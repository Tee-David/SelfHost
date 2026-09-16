const USER_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const DOMAIN_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const DB_RE = /^[a-zA-Z0-9_]{1,64}$/;
const ACCOUNT_RE = /^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/i;
const RECORD_RE = /^(?:@|\*|[a-z0-9](?:[a-z0-9._*-]{0,251}[a-z0-9])?)$/i;
const DNS_TYPES = new Set(["A", "AAAA", "CAA", "CNAME", "MX", "NS", "SRV", "TXT"]);

export class InvalidIdentifierError extends Error {
  constructor(kind: string) { super(`Invalid ${kind}`); this.name = "InvalidIdentifierError"; }
}
function assertMatch(value: string, re: RegExp, kind: string): string {
  const normalized = value.trim();
  if (!re.test(normalized)) throw new InvalidIdentifierError(kind);
  return normalized;
}
export function assertHestiaUser(value: string): string { return assertMatch(value, USER_RE, "Hestia user"); }
export function assertDomain(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/\.$/, "");
  if (!DOMAIN_RE.test(normalized)) throw new InvalidIdentifierError("domain");
  return normalized;
}
export function assertDatabaseName(value: string): string { return assertMatch(value, DB_RE, "database name"); }
export function assertAccountName(value: string): string { return assertMatch(value, ACCOUNT_RE, "account name"); }
export function assertDnsRecordName(value: string): string { return assertMatch(value, RECORD_RE, "DNS record name"); }
export function assertDnsType(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!DNS_TYPES.has(normalized)) throw new InvalidIdentifierError("DNS record type");
  return normalized;
}
export function assertDnsPriority(value: string): string {
  if (!/^\d{1,5}$/.test(value) || Number(value) > 65535) throw new InvalidIdentifierError("DNS priority");
  return value;
}
export function assertRecordId(value: string): string {
  if (!/^\d{1,10}$/.test(value)) throw new InvalidIdentifierError("record id");
  return value;
}
export function assertPassword(value: string): string {
  if (value.length < 12 || value.length > 256 || /[\r\n\0]/.test(value)) throw new InvalidIdentifierError("password");
  return value;
}
export function assertDnsValue(value: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > 1024 || /[\r\n\0]/.test(normalized)) throw new InvalidIdentifierError("DNS value");
  return normalized;
}
