# Security model

SelfHost is an infrastructure control plane. A compromise can affect hosted websites, databases, mail and DNS, so the application is designed around narrow trust boundaries rather than treating authenticated input as trusted.

## Principles

1. The web application is not a general-purpose root shell.
2. Privileged operations use fixed executables and operation-specific argument validation.
3. User-controlled values never select an executable or shell fragment.
4. Filesystem operations are confined to a configured root and reject traversal and unsafe filenames.
5. Secrets and cloud identifiers are runtime configuration, never repository defaults.
6. Authentication cookies are HTTP-only, SameSite strict, and secure in production.
7. Login throttling is explicit. The bundled memory limiter is single-process only; multi-instance deployments must provide shared state.
8. Errors crossing the privilege boundary are redacted by default.

## Hestia boundary

The initial adapter exposes only explicitly allowlisted read operations. New commands must be added as named methods, validate every identifier, include tests, and document required sudo privileges. Arbitrary command passthrough is intentionally unsupported.

## Filesystem boundary

Paths are resolved against `SELFHOST_FILES_ROOT`. Absolute paths, parent traversal, backslash-based traversal and unsafe filenames are rejected. Archive extraction is not part of the initial public core until archive entries and symlink behavior have dedicated validation.

## Cloud providers

OCI support is optional and disabled by default. Enabling it requires the operator to provide configuration and resource identifiers. SelfHost must not ship maintainer infrastructure identifiers or credentials.

## Deployment responsibility

SelfHost reduces the privileged surface but cannot secure a poorly configured host. Operators should use HTTPS, patched dependencies, least-privilege sudo rules, restricted network exposure, backups and host-level monitoring.
