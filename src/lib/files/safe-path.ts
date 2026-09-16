import path from "node:path";

export class UnsafePathError extends Error { constructor() { super("Path is outside the configured files root"); this.name = "UnsafePathError"; } }

export function resolveSafePath(root: string, requested = "."): string {
  const normalizedRoot = path.resolve(root);
  if (requested.includes("\\")) throw new UnsafePathError();
  const resolved = path.resolve(normalizedRoot, requested);
  if (resolved !== normalizedRoot && !resolved.startsWith(`${normalizedRoot}${path.sep}`)) throw new UnsafePathError();
  return resolved;
}

export function assertSafeFileName(name: string): string {
  if (!name || name.length > 255 || name === "." || name === ".." || name.startsWith("-") || name.includes("/") || name.includes("\\") || name.includes("\0")) throw new UnsafePathError();
  return name;
}
