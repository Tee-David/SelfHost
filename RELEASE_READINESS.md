# Release Readiness

**Status: NOT READY FOR PUBLICATION**

SelfHost remains private until every blocking item below is complete and the maintainer explicitly approves publication.

## Source provenance and privacy

- [ ] Complete source-by-source port review from the private `rp-vps` repository.
- [ ] Confirm no credentials, tokens, private keys, emails, customer data, server addresses, OCI identifiers, tenancy identifiers, deployment IDs, or internal-only paths were copied.
- [ ] Review the new repository's entire Git history for secrets before publication.
- [ ] Confirm no third-party inspiration screenshots/assets from the private source were copied without redistribution rights.
- [ ] Record provenance for selectively ported code.

## Architecture and security

- [ ] Replace environment-specific Hestia assumptions with validated configuration.
- [ ] Implement a strict privileged-command boundary and documented least-privilege sudoers policy.
- [ ] Add path-traversal, identifier-validation, authorization, and command-boundary tests.
- [ ] Make OCI support optional and free of account-specific defaults.
- [ ] Review session security, cookies, CSRF posture, rate limiting, upload/download handling, archive extraction, and error redaction.
- [ ] Document the threat model and trust boundaries.

## Engineering quality

- [ ] Pin/review direct dependencies and commit a reproducible lockfile.
- [ ] Remove nightly/`latest` production dependencies or document a justified exception.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] Clean install succeeds from documented instructions.
- [ ] CI passes without production secrets.

## Open-source project health

- [x] Security policy started.
- [ ] README completed.
- [ ] Architecture documentation completed.
- [ ] Configuration and deployment documentation completed.
- [ ] CONTRIBUTING.md completed.
- [ ] CODE_OF_CONDUCT.md completed.
- [ ] Issue and pull request templates completed.
- [ ] Changelog/release process completed.
- [ ] License and third-party notices reviewed.
- [ ] CI, dependency update automation, CodeQL, and secret scanning configured.

## Publication gate

- [ ] Final maintainer review by Taiwo David Dayomola.
- [ ] Explicit maintainer approval to make the repository public.

Publication is intentionally blocked until the final two items are satisfied, even if all technical checks pass.
