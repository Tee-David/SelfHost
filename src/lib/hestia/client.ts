import path from "node:path";
import type { SelfHostConfig } from "../config";
import { runCommand, type CommandResult } from "../command-runner";
import { assertHestiaUser } from "./validation";

const ALLOWED_COMMANDS = new Set(["v-list-web-domains", "v-list-databases", "v-list-mail-domains", "v-list-dns-domains"]);

export class HestiaClient {
  constructor(private readonly config: SelfHostConfig) {}
  private async execute(command: string, args: readonly string[]): Promise<CommandResult> {
    if (!ALLOWED_COMMANDS.has(command)) throw new Error("Hestia command is not allowlisted");
    const executable = path.posix.join(this.config.hestia.binDir, command);
    return runCommand({ executable: "sudo", args: ["-n", executable, ...args] });
  }
  listWebDomains(user = this.config.hestia.user) { return this.execute("v-list-web-domains", [assertHestiaUser(user), "json"]); }
  listDatabases(user = this.config.hestia.user) { return this.execute("v-list-databases", [assertHestiaUser(user), "json"]); }
  listMailDomains(user = this.config.hestia.user) { return this.execute("v-list-mail-domains", [assertHestiaUser(user), "json"]); }
  listDnsDomains(user = this.config.hestia.user) { return this.execute("v-list-dns-domains", [assertHestiaUser(user), "json"]); }
}
