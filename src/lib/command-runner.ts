import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type CommandSpec = { executable: string; args: readonly string[]; timeoutMs?: number; maxBufferBytes?: number };
export type CommandResult = { stdout: string; stderr: string };

export class CommandExecutionError extends Error {
  readonly code?: string | number;
  constructor(message: string, code?: string | number) { super(message); this.name = "CommandExecutionError"; this.code = code; }
}

/** Low-level no-shell executor. HTTP handlers must never supply executable or raw argument arrays. */
export async function runCommand(spec: CommandSpec): Promise<CommandResult> {
  try {
    const result = await execFileAsync(spec.executable, [...spec.args], {
      shell: false, timeout: spec.timeoutMs ?? 20_000, maxBuffer: spec.maxBufferBytes ?? 4 * 1024 * 1024, encoding: "utf8",
    });
    return { stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const err = error as { code?: string | number };
    // Raw stderr is intentionally not exposed because it can contain deployment details.
    throw new CommandExecutionError("Privileged command failed", err.code);
  }
}
