# Configuration

SelfHost is configured exclusively through environment variables. Real infrastructure identifiers and credentials must never be committed.

## Required

| Variable | Purpose |
| --- | --- |
| `SELFHOST_BASE_URL` | Absolute public URL. HTTPS is mandatory in production. |
| `SESSION_SECRET` | Session signing secret, at least 32 characters. Generate a unique random value per installation. |

## Hestia

`HESTIA_BIN` defaults to `/usr/local/hestia/bin`. `HESTIA_USER` defaults to `admin`. `SELFHOST_FILES_ROOT` defaults to `/home/admin/web`. `SELFHOST_ZIP_HELPER` defaults to `/usr/local/lib/selfhost/zip-helper.sh`.

SelfHost invokes Hestia through an explicit command allowlist using `/usr/bin/sudo -n` and argument arrays. Do not grant the application unrestricted sudo access. Production installation documentation will ship a minimal sudoers policy matching the supported command set.

## OCI

OCI integration is disabled by default. Set `OCI_ENABLED=true` only when required. When enabled, `OCI_CONFIG_FILE`, `OCI_COMPARTMENT_ID`, and `OCI_INSTANCE_ID` are mandatory. The config file path must be absolute. `OCI_PROFILE` defaults to `DEFAULT`.

No OCI OCID, tenancy identifier, fingerprint, key, email address, host name, or environment-specific value belongs in source control.

## Production rules

Use HTTPS, keep secrets outside the repository, run SelfHost as an unprivileged service account, expose only the minimum Hestia commands through sudoers, and keep filesystem roots as narrow as possible.
