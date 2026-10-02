---
sidebar_label: Event catalog
title: Event Catalog
sidebar_position: 3
---

# Event Catalog

This is the complete list of events Stratora records and can forward to a [syslog destination](./index.md). Every event has:

- a stable **event type** (e.g. `alert.fired`) — match on it for specific events;
- a **wire MSGID** — what lands in the syslog `MSGID` field. Audit events use the bare action (`create`, `login`, …) so existing receiver rules keep matching; every other event uses its dotted type;
- a **category** (the six sections below) — the unit a [destination filter](./configuration.md#step-4--filtering) matches on; and
- a **syslog severity** — also filterable, and carried in the PRI of every forwarded message.

Use the category and severity columns to build receiver-side routing rules, and the [per-destination filter](./configuration.md#step-4--filtering) to forward only what each destination needs.

:::note
This catalog is generated from Stratora's event registry and reflects the current release.
:::

## Severity scale

Syslog severity is **lower = more severe**. A destination's minimum-severity
filter forwards an event when its severity value is **at or below** the threshold.

| Value | Name | Used for |
|---|---|---|
| 2 | critical | A fired critical alert |
| 3 | error | Notification/escalation delivery failures |
| 4 | warning | Security negatives, destructive ops, downgrades, filter/credential changes, evaluator skip onset |
| 5 | notice | Configuration CRUD, login/logout, alert resolve/ack |
| 6 | informational | Delivery attempts/success, escalation steps, system start/stop/upgrade |

A `✓` in the **Dynamic** column means the severity can be raised from the
payload at emit time (an `alert.fired` follows the alert's own severity; a
role-changing user update escalates to warning; a version downgrade escalates to
warning).

## Security

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `audit.decrypt` | `decrypt` | 4 (warning) |  | Audit log action 'decrypt' |
| `audit.login` | `login` | 5 (notice) |  | Audit log action 'login' |
| `audit.login_failed` | `login_failed` | 4 (warning) |  | Audit log action 'login_failed' |
| `audit.logout` | `logout` | 5 (notice) |  | Audit log action 'logout' |
| `audit.reveal` | `reveal` | 4 (warning) |  | Audit log action 'reveal' |
| `audit.revoke` | `revoke` | 5 (notice) |  | Audit log action 'revoke' |
| `audit.rotate` | `rotate` | 5 (notice) |  | Audit log action 'rotate' |
| `auth.denied` | `auth.denied` | 4 (warning) |  | Authorization denied (403), aggregated per user+route per minute |
| `auth.webhook_rejected` | `auth.webhook_rejected` | 4 (warning) |  | Inbound webhook signature validation failed (path, source IP, reason) — surfaces a misconfigured external_url instead of a silent 403 |
| `enrollment.failed` | `enrollment.failed` | 4 (warning) |  | Component enrollment rejected (bad/expired token) |
| `license.blocked` | `license.blocked` | 4 (warning) |  | Node addition blocked by the license gate |

## Configuration

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `audit.acme_renewal` | `acme_renewal` | 5 (notice) |  | Audit log action 'acme_renewal' |
| `audit.approve` | `approve` | 5 (notice) |  | Audit log action 'approve' |
| `audit.assign` | `assign` | 5 (notice) |  | Audit log action 'assign' |
| `audit.attach` | `attach` | 5 (notice) |  | Audit log action 'attach' |
| `audit.bulk_upsert` | `bulk_upsert` | 5 (notice) |  | Audit log action 'bulk_upsert' |
| `audit.create` | `create` | 5 (notice) |  | Audit log action 'create' |
| `audit.delete` | `delete` | 5 (notice) |  | Audit log action 'delete' |
| `audit.delete_blocked` | `delete_blocked` | 5 (notice) |  | Audit log action 'delete_blocked' |
| `audit.detach` | `detach` | 5 (notice) |  | Audit log action 'detach' |
| `audit.disable` | `disable` | 5 (notice) |  | Audit log action 'disable' |
| `audit.download` | `download` | 5 (notice) |  | Audit log action 'download' |
| `audit.enable` | `enable` | 5 (notice) |  | Audit log action 'enable' |
| `audit.import` | `import` | 5 (notice) |  | Audit log action 'import' |
| `audit.merge` | `merge` | 5 (notice) |  | Audit log action 'merge' |
| `audit.refresh_dns` | `refresh_dns` | 5 (notice) |  | Audit log action 'refresh_dns' |
| `audit.regenerate` | `regenerate` | 5 (notice) |  | Audit log action 'regenerate' |
| `audit.reject` | `reject` | 5 (notice) |  | Audit log action 'reject' |
| `audit.reload` | `reload` | 5 (notice) |  | Audit log action 'reload' |
| `audit.rewrap` | `rewrap` | 5 (notice) |  | Audit log action 'rewrap' |
| `audit.run` | `run` | 5 (notice) |  | Audit log action 'run' |
| `audit.syslog_destination_create` | `syslog_destination_create` | 4 (warning) |  | Audit log action 'syslog_destination_create' |
| `audit.syslog_destination_delete` | `syslog_destination_delete` | 4 (warning) |  | Audit log action 'syslog_destination_delete' |
| `audit.syslog_destination_disable` | `syslog_destination_disable` | 4 (warning) |  | Audit log action 'syslog_destination_disable' |
| `audit.syslog_destination_enable` | `syslog_destination_enable` | 4 (warning) |  | Audit log action 'syslog_destination_enable' |
| `audit.syslog_destination_test` | `syslog_destination_test` | 4 (warning) |  | Audit log action 'syslog_destination_test' |
| `audit.syslog_destination_update` | `syslog_destination_update` | 4 (warning) |  | Audit log action 'syslog_destination_update' |
| `audit.unassign` | `unassign` | 5 (notice) |  | Audit log action 'unassign' |
| `audit.update` | `update` | 5 (notice) | ✓ | Audit log action 'update' |

## Alert

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `alert.acknowledged` | `alert.acknowledged` | 5 (notice) |  | Alert acknowledged (actor_channel = ui/api/email_token/sms/voice) |
| `alert.fired` | `alert.fired` | 4 (warning) | ✓ | Alert instance fired (severity follows the alert: crit=2, warning=4, info=6) |
| `alert.muted` | `alert.muted` | 5 (notice) |  | Alert muted |
| `alert.refired` | `alert.refired` | 4 (warning) | ✓ | Alert re-fired after a prior resolution |
| `alert.resolved` | `alert.resolved` | 5 (notice) |  | Alert resolved (auto or manual; actor in envelope) |
| `alert.severity_changed` | `alert.severity_changed` | 5 (notice) |  | Alert severity transitioned (from/to in details) |
| `alert.suppressed` | `alert.suppressed` | 5 (notice) |  | An existing alert transitioned to suppressed (node entered a maintenance window) |
| `alert.unmuted` | `alert.unmuted` | 5 (notice) |  | Alert unmuted |
| `alert.unsuppressed` | `alert.unsuppressed` | 5 (notice) |  | An existing alert left the suppressed state (maintenance window ended) |
| `audit.acknowledge` | `acknowledge` | 5 (notice) |  | Audit log action 'acknowledge' |
| `audit.escalate` | `escalate` | 5 (notice) |  | Audit log action 'escalate' |
| `audit.mute` | `mute` | 5 (notice) |  | Audit log action 'mute' |
| `audit.unmute` | `unmute` | 5 (notice) |  | Audit log action 'unmute' |

## Escalation

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `escalation.dispatch_resolved` | `escalation.dispatch_resolved` | 6 (informational) |  | Escalation dispatch recipient set resolved |
| `escalation.dispatch_skipped` | `escalation.dispatch_skipped` | 4 (warning) |  | Escalation dispatch skipped a recipient (diagnosis in envelope; also rotation_contact_load_failed) |
| `escalation.exhausted` | `escalation.exhausted` | 3 (error) |  | Escalation reached its final step with no acknowledgement (terminal) |
| `escalation.step_advanced` | `escalation.step_advanced` | 6 (informational) |  | Escalation advanced to a step (reason: initial, timeout, manual, or repeat) |
| `escalation.stopped` | `escalation.stopped` | 6 (informational) |  | Active escalation stopped before exhaustion (reason: acknowledged, resolved, or suppressed; actor/channel/contact in details) — terminal |

## Notification

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `notification.accepted` | `notification.accepted` | 6 (informational) |  | Notification accepted by the provider/relay (SMTP relay-accepted = final; Twilio API-accepted with SID = intermediate, delivery confirmed later) |
| `notification.attempt` | `notification.attempt` | 6 (informational) |  | Notification delivery attempt (per recipient/channel; attempt_number in details) |
| `notification.delivered` | `notification.delivered` | 6 (informational) |  | Provider-confirmed notification delivery (HTTP 2xx for webhook/Slack/Teams; Twilio terminal 'delivered') |
| `notification.failed` | `notification.failed` | 3 (error) |  | Notification delivery failed (provider error / HTTP status in details; outcome=failed|undelivered|exhausted) |

## System

| Event type | MSGID (wire) | Severity | Dynamic | Description |
|---|---|---|---|---|
| `audit.migrate` | `migrate` | 6 (informational) |  | Audit log action 'migrate' |
| `audit.purge` | `purge` | 4 (warning) |  | Audit log action 'purge' |
| `audit.retention_purged` | `audit.retention_purged` | 4 (warning) |  | Audit/event retention purge ran (deleted count in details) |
| `evaluator.cycle_skip_ended` | `evaluator.cycle_skip_ended` | 5 (notice) |  | Alert evaluator resumed (skipped-cycle count and duration in details) |
| `evaluator.cycle_skip_started` | `evaluator.cycle_skip_started` | 4 (warning) |  | Alert evaluator began skipping cycles (metric source unavailable) |
| `system.cursor_reset` | `system.cursor_reset` | 4 (warning) |  | Syslog destination cursor was beyond the transaction horizon (dump/restore) and was reset to head |
| `system.shutdown` | `system.shutdown` | 6 (informational) |  | Server graceful shutdown |
| `system.upgraded` | `system.upgraded` | 6 (informational) | ✓ | Server version changed since last run (from/to/direction in details; downgrade raised to warning=4) |

