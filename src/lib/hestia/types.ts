export type WebDomain = { domain: string; ip: string; ssl: boolean; letsEncrypt: boolean; suspended: boolean; aliases: string[]; bandwidthMb: number; diskMb: number };
export type Database = { name: string; type: string; user: string; sizeMb: number; host: string };
export type MailDomain = { domain: string; accounts: number; dkim: boolean; antispam: boolean; antivirus: boolean };
export type MailAccount = { account: string; domain: string; quotaMb: number; usedMb: number; forward: string; suspended: boolean };
export type DnsZone = { domain: string; ip: string; records: number; ns1: string; ns2: string };
export type DnsRecord = { id: string; domain: string; record: string; type: string; value: string; priority: string };
export type Backup = { id: string; sizeMb: number; web: string; db: string; mail: string; date: string; time: string };
export type CronJob = { id: string; min: string; hour: string; day: string; month: string; wday: string; command: string };
export type Service = { name: string; system: string; state: string; cpu: number; mem: number };
export type FirewallRule = { id: string; action: string; protocol: string; port: string; ip: string; comment: string };
export type HestiaRecord = Record<string, string | undefined>;
export type HestiaRecordMap = Record<string, HestiaRecord>;
export function integer(value: string | undefined): number { const parsed = Number.parseInt(value ?? "0", 10); return Number.isFinite(parsed) ? parsed : 0; }
export function decimal(value: string | undefined): number { const parsed = Number.parseFloat(value ?? "0"); return Number.isFinite(parsed) ? parsed : 0; }
export function yes(value: string | undefined): boolean { return value === "yes"; }
