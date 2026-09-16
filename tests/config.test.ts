import { describe, expect, it } from "vitest";
import { ConfigurationError, loadConfig } from "../src/lib/config";
const base = { NODE_ENV: "test", SELFHOST_BASE_URL: "http://localhost:3000", SESSION_SECRET: "a".repeat(32) };
describe("loadConfig", () => {
  it("loads safe defaults without OCI", () => { const c = loadConfig(base); expect(c.oci.enabled).toBe(false); expect(c.hestia.binDir).toBe("/usr/local/hestia/bin"); });
  it("rejects short session secrets", () => { expect(() => loadConfig({ ...base, SESSION_SECRET: "short" })).toThrow(ConfigurationError); });
  it("requires HTTPS in production", () => { expect(() => loadConfig({ ...base, NODE_ENV: "production" })).toThrow(/HTTPS/); });
  it("requires OCI configuration only when enabled", () => { expect(() => loadConfig({ ...base, OCI_ENABLED: "true" })).toThrow(/OCI_CONFIG_FILE/); });
});
