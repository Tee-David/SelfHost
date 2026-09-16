type Env = Record<string, string | undefined>;

export type SelfHostConfig = {
  nodeEnv: "development" | "test" | "production";
  baseUrl: URL;
  sessionSecret: string;
  adminUser: string;
  hestia: { binDir: string; user: string; filesRoot: string; zipHelper: string };
  oci: { enabled: boolean; configFile?: string; profile: string; compartmentId?: string; instanceId?: string };
};

export class ConfigurationError extends Error {
  constructor(message: string) { super(message); this.name = "ConfigurationError"; }
}

function required(env: Env, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new ConfigurationError(`${name} is required`);
  return value;
}

function absolutePath(env: Env, name: string, fallback: string): string {
  const value = env[name]?.trim() || fallback;
  if (!value.startsWith("/")) throw new ConfigurationError(`${name} must be an absolute path`);
  return value;
}

function boolean(env: Env, name: string, fallback = false): boolean {
  const value = env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ConfigurationError(`${name} must be true or false`);
}

export function loadConfig(env: Env = process.env): SelfHostConfig {
  const nodeEnv = env.NODE_ENV || "development";
  if (!["development", "test", "production"].includes(nodeEnv)) throw new ConfigurationError("Invalid NODE_ENV");

  const baseUrl = new URL(required(env, "SELFHOST_BASE_URL"));
  if (nodeEnv === "production" && baseUrl.protocol !== "https:") throw new ConfigurationError("SELFHOST_BASE_URL must use HTTPS in production");

  const sessionSecret = required(env, "SESSION_SECRET");
  if (sessionSecret.length < 32) throw new ConfigurationError("SESSION_SECRET must contain at least 32 characters");

  const enabled = boolean(env, "OCI_ENABLED");
  const oci = {
    enabled,
    configFile: env.OCI_CONFIG_FILE?.trim() || undefined,
    profile: env.OCI_PROFILE?.trim() || "DEFAULT",
    compartmentId: env.OCI_COMPARTMENT_ID?.trim() || undefined,
    instanceId: env.OCI_INSTANCE_ID?.trim() || undefined,
  };
  if (enabled && (!oci.configFile || !oci.compartmentId || !oci.instanceId)) throw new ConfigurationError("OCI_CONFIG_FILE, OCI_COMPARTMENT_ID and OCI_INSTANCE_ID are required when OCI_ENABLED=true");

  return {
    nodeEnv: nodeEnv as SelfHostConfig["nodeEnv"], baseUrl, sessionSecret,
    adminUser: env.SELFHOST_ADMIN_USER?.trim() || "admin",
    hestia: {
      binDir: absolutePath(env, "HESTIA_BIN", "/usr/local/hestia/bin"),
      user: env.HESTIA_USER?.trim() || "admin",
      filesRoot: absolutePath(env, "SELFHOST_FILES_ROOT", "/home/admin/web"),
      zipHelper: absolutePath(env, "SELFHOST_ZIP_HELPER", "/usr/local/lib/selfhost/zip-helper.sh"),
    }, oci,
  };
}
