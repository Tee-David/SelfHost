# Development

## Requirements

Node.js 22 or newer and npm 11 are the supported development baseline.

## Verification

Run `npm ci`, then `npm run typecheck`, then `npm test`. Pull requests must keep all three checks green.

## Architecture rule

The web application is not a root shell. Privileged operations belong behind small typed adapters with strict validation, explicit command allowlists, argument-array process execution, bounded timeouts, and sanitized errors.

New functionality should be introduced read-only first where practical. Mutating infrastructure operations require input validation, a documented privilege requirement, tests for unsafe input, and an explicit review of failure and rollback behavior.

## Source provenance

The private `rp-vps` repository is reference material. Do not bulk-copy it. Port behavior selectively, remove private defaults and infrastructure assumptions, and write public-facing tests and documentation as part of the port.
