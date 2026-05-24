---
sidebar_label: Overview
title: Syslog Destinations
sidebar_position: 1
---

# Syslog Destinations

Stratora can forward every audit event — sign-ins, configuration changes, alert acknowledgments, license operations, and more — to an external syslog destination in real time. This is the standard interface for **SIEM integration** (Splunk, Elastic, Graylog), **compliance log retention** (SOC 2, HIPAA, PCI-DSS), and **centralized security monitoring**.

Stratora's forwarder is a passive, fire-and-forget projection of its internal `audit_logs` table. Events ship via UDP, TCP, or TCP+TLS using the RFC 5424 (modern) or RFC 3164 (legacy/BSD) wire format. Each destination is independent — a slow or failing destination does not block events to a healthy one.

---

## What gets forwarded

Every row written to Stratora's `audit_logs` table is forwarded to every enabled destination. Examples:

| Event class | Examples |
|---|---|
| Authentication | `login`, `logout`, `password_change`, `mfa_enroll` |
| Configuration | `node_create`, `site_update`, `alert_definition_modify` |
| Alert lifecycle | `alert_acknowledge`, `alert_resolve`, `maintenance_window_open` |
| License | `license_install`, `license_remove`, `license_expire` |
| Syslog destinations | `syslog_destination_create`, `syslog_destination_enable`, `syslog_destination_disable` |
| User management | `user_create`, `user_role_change`, `user_disable` |

Test events triggered from the wizard's **Test Connection** action are explicitly tagged and **do not appear in the persisted audit history** — they exercise the encoder and transport without polluting compliance records.

---

## Wire format

Stratora encodes events per **RFC 5424** by default. Example shipped event:

```
<133>1 2026-05-24T15:55:20.135069Z DJN-DC-DEV01 stratora 10620 syslog_destination_enable - user=admin resource=settings resource_id=87f508e6-7290-45b5-8c01-6e895bbdf211 resource_name=Production-SIEM ip=10.0.0.10
```

| Field | Value |
|---|---|
| PRI | `133` (local0.notice — facility 16 × 8 + severity 5) |
| VERSION | `1` |
| TIMESTAMP | RFC 3339 with microseconds + Z UTC suffix |
| HOSTNAME | Stratora server hostname |
| APP-NAME | `stratora` |
| PROCID | Backend process ID |
| MSGID | Audit action type (e.g., `syslog_destination_enable`) |
| STRUCTURED-DATA | `-` (none — v2.2.0) |
| MSG | Space-separated `key=value` pairs from the audit row's metadata |

RFC 3164 is available for legacy receivers; choose the format your SIEM expects when configuring the destination.

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

## Reliability properties

- **Per-destination isolation.** Each destination has its own goroutine and send queue. A failing destination cannot block, slow, or starve events to other destinations.
- **Retry on per-message send failures.** When a connection is established but a message write fails, Stratora retries the message with exponential backoff (1, 2, 4, 8, 16, 32, 60 seconds, capped at 7 attempts) before dropping it and incrementing the dropped counter.
- **Graceful restart drain.** When the Stratora backend restarts, the syslog fanout service drains in-flight events to enabled destinations before shutdown. Events generated after restart resume shipping cleanly.
- **No dual-write to disk.** Stratora does not buffer events to local disk; the in-memory channel + per-destination queues (10,000 channel cap, 1,000 per-destination queue cap) are the entire reliability surface. Saturation under extreme bursts surfaces as channel/queue full warnings in backend logs and dropped events in the destination counter.

---

## Sections in this guide

- [**Configuration**](./configuration.md) — wizard walkthrough, field reference, Test Connection
- [**Splunk Enterprise / Splunk Cloud**](./splunk.md) — receiver setup + Stratora destination config
- [**Elastic (Logstash / Filebeat)**](./elastic.md) — pipeline setup + Stratora destination config
- [**Graylog**](./graylog.md) — input setup + Stratora destination config
- [**Troubleshooting**](./troubleshooting.md) — common failure modes and resolutions
