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

function assertAbsolutePath(value: string, name: string): string {
  if (!value.startsWith("/")) throw new ConfigurationError(`${name} must be an absolute path`);
  return value;
}

function absolutePath(env: Env, name: string, fallback: string): string {
  return assertAbsolutePath(env[name]?.trim() || fallback, name);
}

function boolean(env: Env, name: string, fallback = false): boolean {
  const value = env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ConfigurationError(`${name} must be true or false`);
}

function optional(env: Env, name: string): string | undefined {
  return env[name]?.trim() || undefined;
}

function safeUser(value: string, name: string): string {
  if (!/^[a-z_][a-z0-9_-]{0,31}$/i.test(value)) throw new ConfigurationError(`${name} contains unsupported characters`);
  return value;
}

export function loadConfig(env: Env = process.env): SelfHostConfig {
  const nodeEnv = env.NODE_ENV || "development";
  if (!["development", "test", "production"].includes(nodeEnv)) throw new ConfigurationError("Invalid NODE_ENV");

  let baseUrl: URL;
  try {
    baseUrl = new URL(required(env, "SELFHOST_BASE_URL"));
  } catch (error) {
    if (error instanceof ConfigurationError) throw error;
    throw new ConfigurationError("SELFHOST_BASE_URL must be a valid absolute URL");
  }
  if (nodeEnv === "production" && baseUrl.protocol !== "https:") throw new ConfigurationError("SELFHOST_BASE_URL must use HTTPS in production");

  const sessionSecret = required(env, "SESSION_SECRET");
  if (sessionSecret.length < 32) throw new ConfigurationError("SESSION_SECRET must contain at least 32 characters");

  const enabled = boolean(env, "OCI_ENABLED");
  const configFileRaw = optional(env, "OCI_CONFIG_FILE");
  const compartmentId = optional(env, "OCI_COMPARTMENT_ID");
  const instanceId = optional(env, "OCI_INSTANCE_ID");
  const oci: SelfHostConfig["oci"] = {
    enabled,
    profile: optional(env, "OCI_PROFILE") || "DEFAULT",
    ...(configFileRaw ? { configFile: assertAbsolutePath(configFileRaw, "OCI_CONFIG_FILE") } : {}),
    ...(compartmentId ? { compartmentId } : {}),
    ...(instanceId ? { instanceId } : {}),
  };
  if (enabled && (!oci.configFile || !oci.compartmentId || !oci.instanceId)) throw new ConfigurationError("OCI_CONFIG_FILE, OCI_COMPARTMENT_ID and OCI_INSTANCE_ID are required when OCI_ENABLED=true");

  return {
    nodeEnv: nodeEnv as SelfHostConfig["nodeEnv"],
    baseUrl,
    sessionSecret,
    adminUser: safeUser(optional(env, "SELFHOST_ADMIN_USER") || "admin", "SELFHOST_ADMIN_USER"),
    hestia: {
      binDir: absolutePath(env, "HESTIA_BIN", "/usr/local/hestia/bin"),
      user: safeUser(optional(env, "HESTIA_USER") || "admin", "HESTIA_USER"),
      filesRoot: absolutePath(env, "SELFHOST_FILES_ROOT", "/home/admin/web"),
      zipHelper: absolutePath(env, "SELFHOST_ZIP_HELPER", "/usr/local/lib/selfhost/zip-helper.sh"),
    },
    oci,
  };
}
