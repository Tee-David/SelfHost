# Privilege boundary

SelfHost must run as an unprivileged operating-system user. It must never receive unrestricted passwordless sudo.

The Hestia adapter executes only commands present in its source-level allowlist. Commands are invoked through `/usr/bin/sudo -n` with an argument array and no shell. User and domain identifiers are validated before they reach the process boundary.

## Current command surface

Read operations cover web domains, databases, mail domains, DNS zones, backups, cron jobs, services, and firewall state. The first mutating operations cover web-domain creation/deletion, Let's Encrypt issuance, HTTPS force, and domain suspension.

## Sudoers guidance

Production installers should generate a dedicated sudoers file containing only the exact Hestia binaries required by the installed SelfHost version. Do not use a wildcard such as `/usr/local/hestia/bin/v-*` in production because it grants future commands automatically.

Changes to the allowlist are security-sensitive. Every new command must document its inputs, validate identifiers before execution, avoid shell evaluation, define a timeout appropriate to the operation, and include tests for malicious input.
