import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveExistingSafePath, UnsafePathError } from "../src/lib/files/safe-path";

describe("resolveExistingSafePath", () => {
  it("accepts existing targets that remain inside the configured root", async () => {
    const base = await mkdtemp(path.join(tmpdir(), "selfhost-safe-"));
    const root = path.join(base, "root");
    await mkdir(root);
    await writeFile(path.join(root, "index.txt"), "safe");

    await expect(resolveExistingSafePath(root, "index.txt")).resolves.toBe(path.join(root, "index.txt"));
  });

  it("rejects symlinks that escape the configured root", async () => {
    const base = await mkdtemp(path.join(tmpdir(), "selfhost-safe-"));
    const root = path.join(base, "root");
    const outside = path.join(base, "outside");
    await mkdir(root);
    await mkdir(outside);
    await writeFile(path.join(outside, "secret.txt"), "not reachable");
    await symlink(outside, path.join(root, "escape"));

    await expect(resolveExistingSafePath(root, "escape/secret.txt")).rejects.toBeInstanceOf(UnsafePathError);
  });
});
