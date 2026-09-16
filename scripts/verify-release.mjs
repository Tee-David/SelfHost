import { readFile, stat } from "node:fs/promises";

const requiredFiles = [
  "LICENSE", "NOTICE", "README.md", "SECURITY.md", "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md", "CHANGELOG.md", "RELEASE_READINESS.md",
  "docs/ARCHITECTURE.md", "docs/SECURITY_MODEL.md", "docs/SOURCE_AUDIT.md"
];

for (const file of requiredFiles) {
  await stat(file).catch(() => { throw new Error(`Missing release file: ${file}`); });
}

const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (lock.lockfileVersion !== 3) throw new Error("package-lock.json must use lockfileVersion 3");
if (lock.packages?.[""]?.devDependencies?.vitest !== pkg.devDependencies?.vitest) {
  throw new Error("package-lock.json root metadata is stale. Regenerate it with npm install --package-lock-only.");
}
if (Object.keys(lock.packages ?? {}).length < 2) {
  throw new Error("package-lock.json is only a bootstrap stub. Regenerate a genuine lockfile before release.");
}

console.log("Release structure verification passed.");
