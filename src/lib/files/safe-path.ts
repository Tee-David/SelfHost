import { realpath } from "node:fs/promises";
import path from "node:path";

export class UnsafePathError extends Error {
  constructor() {
    super("Path is outside the configured files root");
    this.name = "UnsafePathError";
  }
}

function assertInside(root: string, candidate: string): string {
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) throw new UnsafePathError();
  return candidate;
}

/** Lexical validation only. Use resolveExistingSafePath before accessing an existing filesystem target. */
export function resolveSafePath(root: string, requested = "."): string {
  const normalizedRoot = path.resolve(root);
  if (requested.includes("\\")) throw new UnsafePathError();
  return assertInside(normalizedRoot, path.resolve(normalizedRoot, requested));
}

/**
 * Resolves symlinks for both the configured root and an existing target, then proves the target remains inside the root.
 * Filesystem operations on existing targets should use this function instead of trusting lexical normalization alone.
 */
export async function resolveExistingSafePath(root: string, requested = "."): Promise<string> {
  const lexicalTarget = resolveSafePath(root, requested);
  const [realRoot, realTarget] = await Promise.all([realpath(path.resolve(root)), realpath(lexicalTarget)]);
  return assertInside(realRoot, realTarget);
}

export function assertSafeFileName(name: string): string {
  if (!name || name.length > 255 || name === "." || name === ".." || name.startsWith("-") || name.includes("/") || name.includes("\\") || name.includes("\0")) throw new UnsafePathError();
  return name;
}
