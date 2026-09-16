import path from "node:path";
import type { SelfHostConfig } from "../config";
import { runCommand, type CommandResult } from "../command-runner";
import { assertHestiaUser } from "./validation";

const SUDO = "/usr/bin/sudo";
const ALLOWED_COMMANDS = new Set(["v-list-web-domains", "v-list-databases", "v-list-mail-domains", "v-list-dns-domains"]);

export class HestiaResponseError extends Error {
  constructor(message = "Hestia returned an invalid response") {
    super(message);
    this.name = "HestiaResponseError";
  }
}

function parseJsonObject(stdout: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(stdout);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new HestiaResponseError();
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HestiaResponseError) throw error;
    throw new HestiaResponseError();
  }
}

export class HestiaClient {
  constructor(private readonly config: SelfHostConfig) {}

  private async execute(command: string, args: readonly string[]): Promise<CommandResult> {
    if (!ALLOWED_COMMANDS.has(command)) throw new Error("Hestia command is not allowlisted");
    const executable = path.posix.join(this.config.hestia.binDir, command);
    return runCommand({ executable: SUDO, args: ["-n", executable, ...args] });
  }

  private async list(command: string, user: string): Promise<Record<string, unknown>> {
    const result = await this.execute(command, [assertHestiaUser(user), "json"]);
    return parseJsonObject(result.stdout);
  }

  listWebDomains(user = this.config.hestia.user) { return this.list("v-list-web-domains", user); }
  listDatabases(user = this.config.hestia.user) { return this.list("v-list-databases", user); }
  listMailDomains(user = this.config.hestia.user) { return this.list("v-list-mail-domains", user); }
  listDnsDomains(user = this.config.hestia.user) { return this.list("v-list-dns-domains", user); }
}
