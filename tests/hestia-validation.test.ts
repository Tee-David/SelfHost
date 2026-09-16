import { describe, expect, it } from "vitest";
import { assertDatabaseName, assertDomain, assertHestiaUser } from "../src/lib/hestia/validation";
describe("Hestia identifier validation", () => {
  it("normalizes domains", () => expect(assertDomain("Example.COM.")).toBe("example.com"));
  it("rejects command-like domains", () => expect(() => assertDomain("example.com;id")).toThrow());
  it("rejects option-like users", () => expect(() => assertHestiaUser("--help")).toThrow());
  it("accepts conventional database names", () => expect(assertDatabaseName("admin_site_1")).toBe("admin_site_1"));
});
