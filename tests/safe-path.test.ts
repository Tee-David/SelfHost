import { describe, expect, it } from "vitest";
import { assertSafeFileName, resolveSafePath } from "../src/lib/files/safe-path";
describe("filesystem boundary", () => {
  it("resolves descendants", () => expect(resolveSafePath("/srv/selfhost", "site/public")).toBe("/srv/selfhost/site/public"));
  it.each(["../etc/passwd", "/etc/passwd", "site/../../etc", "..\\etc\\passwd"])("rejects traversal %s", (value) => expect(() => resolveSafePath("/srv/selfhost", value)).toThrow());
  it.each(["../x", "-rf", "a/b", "a\\b", "..", ""])("rejects unsafe filename %s", (value) => expect(() => assertSafeFileName(value)).toThrow());
});
