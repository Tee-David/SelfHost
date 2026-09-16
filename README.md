# SelfHost

**A secure, open-source control plane for your own server.**

SelfHost is a modern TypeScript interface for managing common self-hosted infrastructure without turning the web application into a general-purpose root shell. The project is being built around explicit, reviewable integrations with HestiaCP and optional infrastructure providers.

> **Pre-release:** this repository is currently undergoing a security and open-source readiness migration. It is not ready for public deployment or publication yet. See [`RELEASE_READINESS.md`](RELEASE_READINESS.md).

## Why SelfHost

Running your own VPS should not require choosing between an expensive hosting panel and manually administering every routine task over SSH. SelfHost aims to provide a focused interface for websites, domains, DNS, SSL, email, databases, backups, cron jobs, files, WordPress, server health and related operations while keeping the underlying privilege boundary narrow and auditable.

SelfHost does not try to reimplement the services a mature hosting stack already provides. The initial integration uses HestiaCP as the host-management layer and presents those capabilities through a modern application architecture.

## Principles

- **Self-hosted by default.** Your server remains under your control.
- **Least privilege.** Administrative operations are explicit and constrained; arbitrary remote shell execution is not a product feature.
- **Safe configuration.** Credentials and infrastructure identifiers are runtime configuration, never source defaults.
- **Provider-aware, not provider-locked.** Cloud integrations are optional adapters.
- **Reviewable infrastructure code.** Security-sensitive boundaries stay small, typed, documented and tested.
- **Reproducible development.** A contributor should be able to build and test the project without access to the maintainer's infrastructure.

## Planned capabilities

The private prototype already explored management flows for websites, SSL, DNS, mail, databases, backups, cron, files, FTP, logs, metrics, performance, security, uptime, WordPress and server operations. These capabilities are being selectively migrated only after security and portability review.

## Architecture

```text
Browser
   |
   v
SelfHost web application
   |
   +-- authentication / authorization
   +-- validation / rate limiting
   |
   v
Application services
   |
   +-- Hestia adapter --> constrained privileged runner --> Hestia CLI
   +-- Files adapter  --> constrained filesystem operations
   +-- OCI adapter    --> optional cloud integration
   +-- Metrics / logs / uptime
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for trust boundaries and design rules.

## Configuration

No real server identifiers or credentials are included. Start from [`.env.example`](.env.example); cloud integrations are optional and must be configured explicitly.

The full development quick start will be published once the clean application skeleton and reproducible dependency set are committed and verified.

## Security

SelfHost is infrastructure software and should be treated as security-sensitive. Please read [`SECURITY.md`](SECURITY.md) before deploying or reporting a vulnerability. The migration audit is tracked in [`docs/SOURCE_AUDIT.md`](docs/SOURCE_AUDIT.md).

## Project status

SelfHost is being prepared as a new open-source project from a private prototype. The private source is reference material, not a repository that will simply be made public. Every migrated component is being reviewed for secrets, environment-specific assumptions, privilege boundaries, dependency quality and redistribution safety.

The repository must remain private until the release-readiness checklist passes and the maintainer explicitly approves publication.

## Maintainer

Created and maintained by **Taiwo David Dayomola, Senior Software Engineer**.

## License

The intended source license is Apache License 2.0, subject to the final third-party dependency and asset review before publication.
