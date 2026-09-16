# Contributing to SelfHost

Thanks for helping improve SelfHost. Infrastructure software deserves careful, reviewable changes.

## Before opening a pull request

- Keep changes focused and explain the problem being solved.
- Never commit credentials, server identifiers, customer data or private infrastructure configuration.
- Add or update tests for behavior changes, especially validation and privileged operations.
- Run `npm run typecheck` and `npm test`.
- Update documentation when configuration, security boundaries or operator behavior changes.

## Security-sensitive changes

Changes involving authentication, sessions, filesystem access, Hestia commands, sudo, cloud providers, archives, DNS, backups or secret handling require explicit security reasoning in the pull request. Do not add generic shell execution or user-controlled executable paths.

## Commit and PR quality

Use clear commit messages. Describe risks, testing performed and any migration impact. Small, auditable pull requests are preferred over broad rewrites.

## Reporting vulnerabilities

Do not open public issues for vulnerabilities. Follow `SECURITY.md`.
