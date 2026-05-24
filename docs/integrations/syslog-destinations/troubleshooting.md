---
sidebar_label: Troubleshooting
title: Syslog Destinations Troubleshooting
sidebar_position: 6
---

# Syslog Destinations Troubleshooting

When a syslog destination isn't behaving as expected, work through this page in order. Most failures fall into one of the categories below.

## Where to start

1. **Settings → Syslog Destinations** — check the destination's **Health** pill and hover for the underlying state, last failure message, and counters.
2. If the pill is **Failing**, the tooltip surfaces the exact failure message Stratora's transport layer returned. This is the single most useful diagnostic.
3. If the pill is **Healthy** but you don't see events at your SIEM, check the receiver side (Splunk Forwarder logs, Logstash logs, Graylog input metrics).
4. For load issues, watch `events_shipped_total` and `events_dropped_total` over time — Stratora's counters are authoritative for what left the box.

---

## Common failure modes

| Symptom | Likely cause | Resolution |
|---|---|---|
| **"dial tcp: i/o timeout"** | Receiver host is unreachable from the Stratora server, OR the destination port isn't listening. | `Test-NetConnection -ComputerName <host> -Port <port>` from the Stratora server. If False, check receiver process, listening port, and intermediate firewalls. |
| **"dial tcp: connection refused"** on a RHEL-family destination | The receiver host is reachable but the syslog port isn't open through `firewalld`. | Check firewalld allows your syslog port. See [SIEM Integrations](./splunk.md) for firewall config commands. |
| **"x509: certificate is not valid for any names, but wanted to match `<host>`"** | Receiver certificate's CN or SAN doesn't match the destination Host you entered. | Regenerate the receiver cert with proper SAN entries (Go requires SANs since 1.15+; CN-only is rejected). See [Configuration → SAN requirement](./splunk.md#certificate-san-requirement). |
| **"x509: certificate has expired or is not yet valid"** | Receiver certificate expired. | Rotate the cert on the receiver; if using a Custom CA, re-upload the new CA in Stratora's wizard. |
| **"x509: certificate signed by unknown authority"** | Stratora doesn't trust the chain that signed the receiver cert. | If self-signed or internal CA: paste the CA PEM into the destination's Custom CA Certificate field at wizard Step 3. |
| **"x509: certificate relies on legacy Common Name field, use SANs instead"** | Receiver cert has only Common Name; Go 1.15+ requires SAN. | Regenerate the cert with `-addext "subjectAltName=DNS:<host>"`. |
| **"sender init failed"** with no further detail | Connection couldn't be established at all (DNS resolve failure, dead network path, TLS handshake aborted by peer mid-flight). | Check DNS, route, and receiver process state. Try Test Connection from the wizard for a fast iteration loop. |
| **Health pill is Healthy but no events arrive at receiver** | Events are leaving Stratora but the receiver isn't accepting/indexing them. | Check receiver-side logs. For Splunk: `splunkd.log`. For Logstash: `logstash-plain.log`. For Graylog: input metrics + `server.log`. |
| **`events_dropped_total` keeps incrementing** | Per-destination queue saturation, or per-message send failures exhausting retry budget. | Reduce Stratora event volume, increase receiver throughput, OR add more destinations to spread load (each destination has its own queue). |
| **Destination shows Unknown indefinitely** | Destination is enabled but no events have shipped yet. | Trigger an audit event by logging out and back in, or toggle any non-destructive setting. Stratora generates audit events on state-changing operations; the destination's pill transitions to Healthy after the first ship. |
| **Destination shows Disabled in tooltip** | The Enabled toggle is off. | Toggle it back on from the list view or via the Edit modal. |
| **"Syslog forwarding degraded" banner persists** | At least one destination is in Failing state. | Click "View destinations" in the banner to identify which destination is failing; hover its health pill for the failure detail. |

---

## Sender-init vs per-message retry

Stratora's transport layer has two distinct fault paths with different retry semantics:

**Sender-init dial failure** — when a connection can't be established at all (TCP dial timeout, TLS handshake rejection, DNS failure). Single attempt with ~10s timeout, then the event is dropped and the destination is marked Failing. The destination's sender goroutine remains in a recovering state and retries connection establishment on the next audit event.

**Per-message send failure** — when a connection is established but a message write fails (TCP RST mid-write, TLS session torn down, partial frame). Exponential backoff retry: 1s → 2s → 4s → 8s → 16s → 32s → 60s capped, up to 7 attempts (~2 minutes total drain time per message), then drop.

The Failing-state pill is identical for both paths; the `last_failure_message` text differs:
- Sender-init: starts with `"sender init failed:"`
- Per-message: starts with `"send failed:"` (less common in practice — most failures show up at the dial layer)

---

## Wizard Test Connection behavior

The Test Connection action sends a synthetic `syslog_destination_test` event through the **full encoder + transport path** end-to-end, but **bypasses the persistent `audit_logs` table**. So:

- ✅ A green "Test event sent successfully" indicates Stratora can dial, handshake, and write to the receiver.
- ✅ The receiver should show the test event in its inbound stream (Splunk search, Logstash output, Graylog input).
- ❌ The test event will **not** appear in Stratora's audit history.
- ❌ The destination's `events_shipped_total` and `events_dropped_total` counters are not affected.

If you need an end-to-end test that does appear in Stratora's audit history, save the destination and trigger any normal audit action (e.g., toggle the destination's Enabled state off and back on — each toggle persists a real audit event that fans out to all enabled destinations).

---

## Banner behavior

The "Syslog forwarding degraded" banner at the top of every page is admin-only and fires when **any** enabled destination is in Failing state. It uses a SQL-side definition (`last_failure_at > last_success_at` or `last_failure_at IS NOT NULL AND last_success_at IS NULL`) — not the frontend's classification.

Dismissing the banner with the **X** button hides it for the current React tree lifetime (until you hard-refresh the page or restart the browser). It does NOT resolve the underlying failure; the destination remains Failing until it ships an event successfully.

The banner does not fire on the Syslog Destinations page itself — you're already there to remediate.

---

## Audit event volume planning

Stratora's audit log volume depends on user and system activity. As a rough sizing guide:

| Activity level | Approx events/day |
|---|---|
| Small lab (1–2 admins, light use) | 50–200 |
| Mid-size deployment (5–10 admins, daily ops) | 500–2,000 |
| Large deployment (20+ admins, automation-heavy) | 5,000–20,000 |

Each event is ~150–400 bytes on the wire (depending on action type and metadata). At 20k events/day, that's ~5 MB/day of syslog traffic per destination — well within capacity for any production SIEM.

Note: Stratora generates audit events on **state-changing operations** (writes, toggles, config edits), not on reads. Time spent browsing Stratora's UI doesn't generate audit volume.

---

## When to escalate

Open a Stratora support ticket if:

- Health is Failing with `last_failure_message` that doesn't match any pattern in the table above
- Backend logs show `channel full, dropping audit log fanout publish` warnings during normal (non-burst) operation
- A destination's counters are flat-lined despite the receiver being known-good and reachable

Include in the ticket: destination configuration (redact sensitive fields), Stratora backend log excerpt, receiver-side log excerpt, and the verbatim `last_failure_message` value.
