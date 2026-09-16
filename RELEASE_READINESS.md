# Release Readiness

**Status: NOT READY FOR PUBLICATION**

SelfHost remains private until every blocking item below is complete and the maintainer explicitly approves publication.

## Source provenance and privacy

- [ ] Complete source-by-source port review from the private `rp-vps` repository.
- [ ] Confirm no credentials, tokens, private keys, emails, customer data, server addresses, OCI identifiers, tenancy identifiers, deployment IDs, or internal-only paths were copied.
- [ ] Review the new repository's entire Git history for secrets before publication.
- [x] No private inspiration screenshots/assets have been copied into SelfHost.
- [x] Selective-port policy documented in the source audit and development guide.

## Architecture and security

- [x] Environment-specific Hestia defaults replaced with validated configuration.
- [x] Privileged Hestia execution constrained by an explicit command allowlist, absolute sudo path, argument arrays, and identifier validation.
- [x] Path traversal and symlink escape protections have dedicated tests.
- [x] OCI support is optional and has no account-specific defaults.
- [x] Session signing, secure cookie defaults, rate-limiter boundary, command error redaction, and filesystem trust boundaries are documented and tested at the current foundation layer.
- [x] Threat model and trust boundaries documented.
- [ ] Complete security review of future upload/download and archive extraction implementations before enabling them.
- [ ] Add a generated least-privilege sudoers policy for the final supported command surface.

## Product migration

- [x] Typed read models for web domains, databases, mail domains, and DNS zones.
- [x] Guarded web-domain creation/deletion, Let's Encrypt issuance, HTTPS force, and suspension primitives.
- [ ] Port DNS record management.
- [ ] Port database lifecycle management.
- [ ] Port mail domain/account management.
- [ ] Port backup/restore, cron, firewall, service health, metrics, and uptime capabilities.
- [ ] Port safe file-management capabilities with real filesystem confinement.
- [ ] Port WordPress installation/staging only after its privilege and credential flows pass review.
- [ ] Build and test the public application/API layer around the hardened adapters.

## Engineering quality

- [ ] Commit a genuine npm-generated reproducible lockfile. The current bootstrap lockfile is not sufficient for release.
- [x] Direct development dependencies use exact versions.
- [ ] Lint passes once the application layer introduces the lint toolchain.
- [x] Typecheck passes on the current foundation.
- [x] Tests pass on the current foundation.
- [ ] Production build passes after the application layer is introduced.
- [ ] Clean install succeeds from final documented instructions using `npm ci`.
- [x] Primary CI passes without production secrets.

## Open-source project health

- [x] Security policy.
- [x] README foundation.
- [x] Architecture documentation.
- [x] Configuration and development documentation.
- [x] CONTRIBUTING.md.
- [x] CODE_OF_CONDUCT.md.
- [x] Bug, feature, and pull request templates.
- [x] Changelog foundation.
- [ ] Add and independently review the Apache-2.0 LICENSE file and any required third-party notices.
- [x] Dependency update automation configured.
- [x] CodeQL workflow configured to activate automatically when the repository becomes public; private SARIF upload is unsupported by the current repository/integration configuration.

## Publication gate

- [ ] Independent final security/provenance audit.
- [ ] Final maintainer review by Taiwo David Dayomola.
- [ ] Explicit maintainer approval to make the repository public.

Publication remains intentionally blocked until the final maintainer approval, even after every technical item is green.
