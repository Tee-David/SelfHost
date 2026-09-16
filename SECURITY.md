# Security Policy

SelfHost is infrastructure software with privileged access to hosting services. Security reports are treated as high priority.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting / Security Advisory workflow for this repository. Include affected versions, reproduction details, impact, and any suggested mitigation.

Do not include real credentials, private keys, customer data, server addresses, or other sensitive information in reports beyond what is necessary to reproduce the issue.

## Security principles

SelfHost follows these rules:

- No arbitrary shell execution from web requests.
- Privileged operations must pass through explicit, reviewed command adapters.
- User-controlled paths and identifiers are validated before reaching operating-system or Hestia commands.
- Secrets are supplied at runtime and never committed.
- Cloud integrations are optional and must not contain account-specific defaults.
- Error responses must not expose credentials, filesystem internals, or command output unnecessarily.
- CI must be able to run without production credentials.

## Supported versions

Until the first stable release, only the latest commit on the default release branch is supported.

## Deployment responsibility

SelfHost can perform privileged server administration. Operators should expose it only over HTTPS, keep the host patched, use least-privilege sudo rules, restrict administrative access, and review the deployment security documentation before production use.
