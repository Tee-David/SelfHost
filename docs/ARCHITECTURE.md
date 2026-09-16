# Architecture

SelfHost is a self-hosted infrastructure control plane. The web application is intentionally separated from privileged host operations.

## Design goals

1. Keep the browser and HTTP layer unprivileged.
2. Validate every identifier, path, and operation before crossing a privilege boundary.
3. Expose explicit domain operations rather than arbitrary shell commands.
4. Keep cloud providers optional.
5. Keep hosted-instance configuration out of source code.
6. Make security-sensitive modules small enough to review and test independently.

## Target layers

```text
Browser
  |
  v
TanStack Start routes / API handlers
  |
  +--> authentication + authorization
  +--> request validation
  +--> rate limiting
  |
  v
Application services
  |
  +--> Hestia adapter --------> constrained command runner --> Hestia CLI
  +--> Files adapter ---------> constrained filesystem runner
  +--> OCI adapter (optional) -> OCI SDK
  +--> Metrics / logs / uptime
```

## Trust boundaries

### Browser to application

All browser input is untrusted. Authentication alone does not make route parameters, filenames, domains, database names, archive contents, or form fields safe.

### Application to operating system

This is the most sensitive boundary. SelfHost must never expose an endpoint that accepts an arbitrary executable, command name, shell fragment, or unrestricted argument list. Privileged operations are represented as typed application methods and mapped to a fixed allowlist of binaries/commands.

Shell interpolation (`sh -c`, `bash -c`, template-built command strings) is prohibited for user-controlled operations. Process execution should use argument arrays.

### Application to Hestia

Hestia operations use known `v-*` commands with operation-specific validation. The deployment must use least-privilege sudo rules rather than unrestricted passwordless sudo.

### Application to cloud providers

Cloud adapters are optional. Credentials and resource identifiers are runtime configuration. No maintainer tenancy, instance, account, region, email, or resource identifier belongs in source defaults.

## Source migration

The private `rp-vps` repository is reference material only. `panel-ts` is the canonical implementation candidate because it contains the broader TypeScript feature set. Code is ported selectively after review; the legacy implementation and private design/reference assets are not copied wholesale.

During migration, infrastructure-specific names such as old panel paths, project names, instance IDs, service-account names, deployment URLs, and private documentation references are removed or replaced with generic configuration.

## Security-sensitive modules

The following areas require focused tests and review before release:

- session creation and cookie handling
- credential storage and password changes
- rate limiting and proxy/IP handling
- Hestia command allowlisting
- filesystem path resolution
- upload/download streaming
- ZIP creation and extraction
- backups and restores
- WordPress installation/staging
- DNS and mail mutations
- SSL operations
- cloud instance actions
- log/error redaction

See `SECURITY.md` and `RELEASE_READINESS.md` for the release gate.
