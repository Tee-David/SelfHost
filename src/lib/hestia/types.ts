export type WebDomain = {
  domain: string;
  ip: string;
  ssl: boolean;
  letsEncrypt: boolean;
  suspended: boolean;
  aliases: string[];
  bandwidthMb: number;
  diskMb: number;
};

export type Database = { name: string; type: string; user: string; sizeMb: number; host: string };
export type MailDomain = { domain: string; accounts: number; dkim: boolean; antispam: boolean; antivirus: boolean };
export type DnsZone = { domain: string; ip: string; records: number; ns1: string; ns2: string };

export type HestiaRecord = Record<string, string | undefined>;
export type HestiaRecordMap = Record<string, HestiaRecord>;

export function integer(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function yes(value: string | undefined): boolean { return value === "yes"; }
