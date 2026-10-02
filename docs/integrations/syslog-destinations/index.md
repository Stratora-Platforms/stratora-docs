---
sidebar_label: Overview
title: Syslog Destinations
sidebar_position: 1
---

# Syslog Destinations

Stratora can forward **every event it records** — sign-ins and configuration changes, alerts firing and resolving, escalations, notification delivery, and security and system events — to an external syslog destination in real time. This is the standard interface for **SIEM integration** (Splunk, Elastic, Graylog), **compliance log retention** (SOC 2, HIPAA, PCI-DSS), and **centralized security monitoring**.

Every event carries a stable event type, a category, and a meaningful syslog severity — the complete list is the [**Event catalog**](./event-catalog.md). Events ship via UDP, TCP, or TCP+TLS using the RFC 5424 (modern) or RFC 3164 (legacy/BSD) wire format. Each destination is independent — a slow or failing destination does not block events to a healthy one — and each can be **filtered** to only the categories and severities you care about.

Delivery is **at-least-once and durable**: events are staged in a transactional outbox and forwarded from a persisted per-destination position, so a backend restart or a receiver outage does not lose events. Receivers de-duplicate on the event ID (see [Delivery and reliability](#delivery-and-reliability)).

---

## What gets forwarded

Every event Stratora records is forwarded to every enabled destination (subject to that destination's filter). Events fall into six categories:

| Category | What it covers | Example event types |
|---|---|---|
| **Security** | Sign-ins, access denials, credential reveals, enrollment, license gate | `audit.login`, `auth.denied`, `enrollment.failed`, `license.blocked` |
| **Configuration** | Create / update / delete of resources and settings | `audit.create`, `audit.update`, `audit.delete` |
| **Alert** | Alert lifecycle | `alert.fired`, `alert.resolved`, `alert.acknowledged`, `alert.suppressed` |
| **Escalation** | On-call escalation | `escalation.step_advanced`, `escalation.exhausted`, `escalation.stopped` |
| **Notification** | Delivery of email / SMS / voice / Slack / Teams / webhook | `notification.attempt`, `notification.delivered`, `notification.failed` |
| **System** | Server lifecycle and maintenance | `system.shutdown`, `system.upgraded`, `audit.retention_purged`, `system.cursor_reset` |

The [**Event catalog**](./event-catalog.md) lists every type with its category, severity, and wire MSGID. Use categories and severity to build receiver routing rules, and the per-destination filter (below) to forward only what a given destination needs.

Test events triggered from the wizard's **Test Connection** action are explicitly tagged and **do not appear in the persisted audit history** — they exercise the encoder and transport without polluting compliance records.

---

## Wire format

Stratora encodes events per **RFC 5424** by default. Example shipped event:

```
<132>1 2026-10-02T14:28:54.123456Z DJN-DC-DEV01 stratora 10620 auth.denied [stratora@32473 event_id="7b2c…" category="security" severity="4" actor="admin" route="/api/v1/settings" count="20"] authorization denied user=admin route=/api/v1/settings
```

| Field | Value |
|---|---|
| PRI | `132` (local0.warning — facility 16 × 8 + severity 4). The severity is the **event's** severity, not a fixed value. |
| VERSION | `1` |
| TIMESTAMP | RFC 3339 with microseconds + Z UTC suffix |
| HOSTNAME | Stratora server hostname |
| APP-NAME | `stratora` |
| PROCID | Backend process ID |
| MSGID | The event's wire MSGID: the dotted event type for stream events (`alert.fired`, `auth.denied`, …) and the **bare audit action** (`create`, `login`, …) for audit events, so v2.2 receiver rules keep matching |
| STRUCTURED-DATA | A `stratora@<PEN>` element carrying the event's **redacted** detail fields (including `event_id`, the de-duplication key). Secret-shaped values are masked before they leave Stratora |
| MSG | Space-separated `key=value` summary |

The **severity** of each event type is listed in the [Event catalog](./event-catalog.md); it is no longer a uniform `notice`. RFC 3164 is available for legacy receivers — it has no structured-data field, so the same detail fields are folded into the message text. Choose the format your SIEM expects when configuring the destination.

### Validation reference

Stratora's RFC 5424 encoder has been validated against multiple production syslog receivers: **rsyslog 8.2102 (Rocky Linux 8)** and **rsyslog 8.2504 (Debian 13)**. Wire format is byte-identical across receivers, ensuring consistent SIEM ingest regardless of your collector platform.

---

## Health & reliability

Stratora classifies each destination's health based on shipping reliability only — not on event volume. A destination that hasn't received events recently because the system is quiet remains **Healthy**.

| State | Meaning |
|---|---|
| **Healthy** | Last successful ship is the most recent activity (or no failure history exists). |
| **Failing** | The most recent activity was a failed ship (`last_failure_at > last_success_at`, or failures recorded with no success ever). |
| **Unknown** | Destination is disabled, or has no shipping history yet. |

Hover the health pill in the **Settings → Syslog Destinations** list to see the underlying timestamps, failure message (if any), and shipped/dropped counters.

If any enabled destination enters the **Failing** state, an admin-only banner appears at the top of every page in Stratora until the destination recovers or is dismissed.

---

## Delivery and reliability

- **At-least-once, durable.** Every event is written to a transactional outbox in the **same database transaction** as the action that caused it, then forwarded to each destination from a persisted position (cursor). A backend restart, a receiver outage, or a crash mid-backlog does not lose events — forwarding resumes from where each destination left off.
- **De-duplicate on event ID.** Because delivery is at-least-once, a destination may occasionally receive the same event twice (for example, if Stratora restarts between sending an event and recording that it was sent). Every event carries a unique `event_id` in its structured data; configure your SIEM to de-duplicate on it.
- **Per-destination isolation.** Each destination forwards from its own cursor on its own schedule. A failing or filtered destination cannot block, slow, or starve events to another.
- **Retry with backoff.** A failed send is retried with exponential backoff (1, 2, 4, 8, 16, 32, 60 seconds, capped at 7 attempts) before the message is dropped and counted; the cursor only advances past an event once it is sent (or intentionally filtered).
- **Backlog lag is visible.** The destinations list shows a **Lag** column — the number of events a destination has not yet forwarded, and the age of the oldest unsent one. In steady state this is `0`; a persistent non-zero lag means the receiver is unreachable or slow.
- **Filtered events are not failures.** An event a destination filters out (by category or severity) is skipped and its cursor advances — it is **not** counted as a dropped event, and it never contributes to lag.
- **New and re-enabled destinations start at "now".** A destination begins forwarding from the current head of the stream; it does not replay history from before it was created or re-enabled.

---

## Sections in this guide

- [**Configuration**](./configuration.md) — wizard walkthrough (including category/severity filtering), field reference, Test Connection
- [**Event catalog**](./event-catalog.md) — every event type with its category, severity, and wire MSGID
- [**Splunk Enterprise / Splunk Cloud**](./splunk.md) — receiver setup + Stratora destination config
- [**Elastic (Logstash / Filebeat)**](./elastic.md) — pipeline setup + Stratora destination config
- [**Graylog**](./graylog.md) — input setup + Stratora destination config
- [**Troubleshooting**](./troubleshooting.md) — common failure modes and resolutions
