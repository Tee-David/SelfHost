# Private Source Audit

This document records migration findings without reproducing sensitive source values.

Source: private repository `Tee-David/rp-vps`.

## Canonical implementation

`panel-ts/` is the likely canonical foundation. It has the broader TypeScript application and includes domains for websites, SSL, DNS, mail, databases, backups, cron, files, FTP, logs, metrics, performance, security, uptime, WordPress/staging, server management, settings, and branding.

The older `panel/` implementation is reference-only. Functionality will be ported from it only where it is demonstrably useful and not superseded by `panel-ts`.

The private `plans/` directory contains a large set of design/inspiration assets and is excluded from migration. No image or third-party reference asset is presumed redistributable.

## Findings requiring remediation

### Cloud configuration — BLOCKING

The OCI module contains a real infrastructure resource identifier as a source-code fallback, a deployment-specific filesystem path, and internal project/service-account references. None of these values will be copied. OCI support in SelfHost will be optional and require explicit runtime configuration.

### Authentication — REVIEW REQUIRED

The source uses signed JWT sessions with a runtime session secret. The credential store uses a deployment-specific path and environment names. The design is reusable, but names/paths must be generalized and cookie attributes/routes reviewed before porting.

### Rate limiting — REVIEW REQUIRED

The login limiter is in-process and was intentionally designed for a single-process deployment. That assumption is not suitable as an undocumented public default. SelfHost must document the limitation or provide a replaceable/shared limiter for multi-instance deployments.

### Hestia command execution — SECURITY CRITICAL

The source uses `execFile` with argument arrays rather than interpolated shell commands, which is a positive baseline. It nevertheless crosses a passwordless-sudo privilege boundary. SelfHost will narrow this behind explicit command allowlists, operation-specific validation, typed errors, and a documented least-privilege sudoers policy.

The source currently masks some Hestia JSON command failures by returning an empty object. Public code should preserve useful typed failures without leaking sensitive stderr.

### Filesystem operations — SECURITY CRITICAL

The source includes path normalization/traversal checks, filename checks, argument-array process execution, text-size limits, streaming uploads/downloads, and a fixed ZIP helper instead of inline shell execution. These are useful foundations.

However, the implementation contains deployment-specific root/helper paths and user assumptions. Archive extraction also needs a dedicated Zip Slip/symlink review before public release, rather than relying only on the destination path being safe.

### Dependencies — BLOCKING

The canonical TypeScript package uses several `latest` dependencies and a nightly Nitro package. A committed lockfile helps reproducibility but public release should use reviewed/pinned versions and avoid nightly production dependencies unless explicitly justified.

## Rules for migration

- Do not copy secrets or real infrastructure identifiers, including values that appear harmless because they are not passwords.
- Do not copy deployment-specific emails, hostnames, paths, service-account names, project names, or private documentation references.
- Do not copy private screenshots/reference assets.
- Prefer small reviewed ports over repository-wide copying.
- Preserve good security properties from the source, including argument-array process execution and path validation.
- Strengthen assumptions that were acceptable for a single private server but unsafe as generic open-source defaults.

This audit is incomplete until every migrated source file and Git history is reviewed. See `RELEASE_READINESS.md`.
