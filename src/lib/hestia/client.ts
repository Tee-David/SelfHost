import path from "node:path";
import type { SelfHostConfig } from "../config";
import { runCommand, type CommandResult } from "../command-runner";
import { assertDomain, assertHestiaUser } from "./validation";
import { integer, yes, type Database, type DnsZone, type HestiaRecordMap, type MailDomain, type WebDomain } from "./types";

const SUDO = "/usr/bin/sudo";
const ALLOWED_COMMANDS = new Set([
  "v-list-web-domains", "v-list-databases", "v-list-mail-domains", "v-list-dns-domains",
  "v-list-user-backups", "v-list-cron-jobs", "v-list-sys-services", "v-list-firewall",
  "v-add-web-domain", "v-delete-web-domain", "v-add-letsencrypt-domain",
  "v-add-web-domain-ssl-force", "v-delete-web-domain-ssl-force",
  "v-suspend-web-domain", "v-unsuspend-web-domain",
]);

export class HestiaResponseError extends Error {
  constructor(message = "Hestia returned an invalid response") { super(message); this.name = "HestiaResponseError"; }
}

function parseJsonObject(stdout: string): HestiaRecordMap {
  try {
    const value: unknown = JSON.parse(stdout);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new HestiaResponseError();
    for (const record of Object.values(value as Record<string, unknown>)) {
      if (!record || typeof record !== "object" || Array.isArray(record)) throw new HestiaResponseError();
    }
    return value as HestiaRecordMap;
  } catch (error) {
    if (error instanceof HestiaResponseError) throw error;
    throw new HestiaResponseError();
  }
}

export class HestiaClient {
  constructor(private readonly config: SelfHostConfig) {}

  private async execute(command: string, args: readonly string[], timeoutMs?: number): Promise<CommandResult> {
    if (!ALLOWED_COMMANDS.has(command)) throw new Error("Hestia command is not allowlisted");
    const executable = path.posix.join(this.config.hestia.binDir, command);
    return runCommand({ executable: SUDO, args: ["-n", executable, ...args], ...(timeoutMs ? { timeoutMs } : {}) });
  }

  private async list(command: string, args: readonly string[] = []): Promise<HestiaRecordMap> {
    const result = await this.execute(command, [...args, "json"]);
    return parseJsonObject(result.stdout);
  }

  async listWebDomains(user = this.config.hestia.user): Promise<WebDomain[]> {
    const data = await this.list("v-list-web-domains", [assertHestiaUser(user)]);
    return Object.entries(data).map(([domain, d]) => ({ domain, ip: d.IP ?? "", ssl: yes(d.SSL), letsEncrypt: yes(d.LETSENCRYPT), suspended: yes(d.SUSPENDED), aliases: (d.ALIAS ?? "").split(",").map(v => v.trim()).filter(Boolean), bandwidthMb: integer(d.U_BANDWIDTH), diskMb: integer(d.U_DISK) }));
  }
  async listDatabases(user = this.config.hestia.user): Promise<Database[]> {
    const data = await this.list("v-list-databases", [assertHestiaUser(user)]);
    return Object.entries(data).map(([name, d]) => ({ name, type: d.TYPE ?? "", user: d.DBUSER ?? "", sizeMb: integer(d.U_DISK), host: d.HOST ?? "localhost" }));
  }
  async listMailDomains(user = this.config.hestia.user): Promise<MailDomain[]> {
    const data = await this.list("v-list-mail-domains", [assertHestiaUser(user)]);
    return Object.entries(data).map(([domain, d]) => ({ domain, accounts: integer(d.ACCOUNTS), dkim: yes(d.DKIM), antispam: yes(d.ANTISPAM), antivirus: yes(d.ANTIVIRUS) }));
  }
  async listDnsZones(user = this.config.hestia.user): Promise<DnsZone[]> {
    const data = await this.list("v-list-dns-domains", [assertHestiaUser(user)]);
    return Object.entries(data).map(([domain, d]) => ({ domain, ip: d.IP ?? "", records: integer(d.RECORDS), ns1: d.NS1 ?? "", ns2: d.NS2 ?? "" }));
  }

  async addWebDomain(domain: string, user = this.config.hestia.user): Promise<void> {
    await this.execute("v-add-web-domain", [assertHestiaUser(user), assertDomain(domain)]);
  }
  async deleteWebDomain(domain: string, user = this.config.hestia.user): Promise<void> {
    await this.execute("v-delete-web-domain", [assertHestiaUser(user), assertDomain(domain)]);
  }
  async issueLetsEncrypt(domain: string, user = this.config.hestia.user): Promise<void> {
    await this.execute("v-add-letsencrypt-domain", [assertHestiaUser(user), assertDomain(domain)], 120_000);
  }
  async setSslForce(domain: string, enabled: boolean, user = this.config.hestia.user): Promise<void> {
    await this.execute(enabled ? "v-add-web-domain-ssl-force" : "v-delete-web-domain-ssl-force", [assertHestiaUser(user), assertDomain(domain), "yes"]);
  }
  async setWebDomainSuspended(domain: string, suspended: boolean, user = this.config.hestia.user): Promise<void> {
    await this.execute(suspended ? "v-suspend-web-domain" : "v-unsuspend-web-domain", [assertHestiaUser(user), assertDomain(domain), "yes"]);
  }
}
