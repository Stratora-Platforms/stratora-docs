---
sidebar_label: Configuration
title: Configuring a Syslog Destination
sidebar_position: 2
---

# Configuring a Syslog Destination

Stratora's syslog forwarder is configured per-destination from **Settings → Syslog Destinations**. Add as many destinations as you need — each ships every audit event independently.

The Add Destination wizard collects configuration in four steps: **Details**, **Connection**, **Format**, and **Review**.

---

## Permissions

Configuring syslog destinations requires the **`syslog_destination:manage`** permission, granted to the **Admin** role by default. Operator and Viewer roles cannot create, edit, or test destinations.

The Syslog Destinations page is also hidden from the **Integrations** sidebar dropdown for non-admin users.

---

## Step 1 — Details

The first step captures a recognizable name for the destination. The name appears in:

- The destinations list
- The health banner ("Syslog forwarding degraded" message when failing)
- Audit history entries that reference the destination (`resource_name=…`)

| Field | Required | Notes |
|---|---|---|
| Name | Yes | 1–100 characters, must be unique. Example: `Production SIEM`, `SOC2 Compliance`, `Splunk-HF-01` |

The step closes with a brief info card noting Stratora supports RFC 5424 / 3164 over UDP, TCP, and TCP+TLS.

---

## Step 2 — Connection

Specifies the network target and transport.

| Field | Required | Notes |
|---|---|---|
| Host | Yes | FQDN or IP. Use FQDN when verify=true (cert SAN/CN matching). |
| Port | Yes | Default switches with Protocol: `6514` for TCP+TLS, `514` for UDP/TCP. |
| Protocol | Yes | `TCP + TLS (recommended)`, `TCP plaintext`, or `UDP plaintext`. |

A warning callout appears when **UDP plaintext** or **TCP plaintext** is selected: *"Events will ship unencrypted over the network. Use TCP+TLS for production deployments."* Both plaintext modes are supported for lab or transitional configurations but are not recommended for compliance use.

### Port defaults

| Protocol | Default port | RFC reference |
|---|---|---|
| TCP + TLS | 6514 | RFC 5425 / IANA assignment |
| TCP plaintext | 514 | Historical |
| UDP plaintext | 514 | RFC 3164 |

You can override the port for any protocol. The defaults are suggestions only.

---

## Step 3 — Format

Specifies the syslog wire format, facility code, and (for TCP+TLS) TLS settings.

| Field | Required | Notes |
|---|---|---|
| RFC Format | Yes | `RFC 5424 (modern)` or `RFC 3164 (legacy / BSD)`. RFC 5424 is the default; pick 3164 only if your receiver explicitly requires it. |
| Facility | Yes | `local0` through `local7`. Defaults to `local0`. Use a non-default facility if you want to segregate Stratora events from other syslog sources at the receiver. |

### TLS Settings (visible when Protocol = TCP+TLS)

| Field | Required | Notes |
|---|---|---|
| Verify server certificate | No | Default ON. Stratora validates the receiver's certificate chain and hostname. **Recommended for production.** |
| Custom CA Certificate | No | PEM-encoded CA certificate that signed the receiver's leaf cert. Pasted text; validated server-side for PEM markers. |

#### When to provide a Custom CA

If your SIEM receiver uses a certificate signed by a CA not in the Stratora server's system trust store (self-signed cert, internal PKI, lab cert), paste the CA (or self-signed leaf) into the Custom CA field. The destination will trust the chain entirely from this CA rather than from the system trust store.

If your SIEM receiver uses a publicly-trusted CA (Let's Encrypt, DigiCert, etc.) that's in the Stratora server's OS trust store, leave Custom CA blank.

#### When to disable Verify

Only disable verification for transitional lab setups or when the receiver's certificate cannot be remediated. With verify=false, the destination is reachable but **not authenticated** — any TCP+TLS endpoint on that Host:Port combination will be accepted, exposing the connection to MITM attacks. The wizard surfaces this warning inline.

---

## Step 4 — Review

The Review step displays a read-only summary of all entered fields grouped by section (Details, Connection, Format) plus three affordances:

- **Test Connection** — sends a single test event end-to-end (encoder → transport → receiver acknowledgment for TCP) without writing to the persistent audit log. Surfaces success or failure with the verbatim error message and the encoded payload preview.
- **Enabled toggle** — controls whether the destination receives events after save. A destination saved as Enabled=false exists in the DB but ships nothing.
- **Create / Save** — commits the configuration. The destination starts shipping the next audit event Stratora generates.

The rail entries for Steps 1–3 show green checks once their validation passes; you can click any prior step rail entry to navigate back and edit.

### What Test Connection actually does

Test Connection bypasses the persistent `audit_logs` table — it does not write the test event to your audit history. The encoder serializes a synthetic event (`syslog_destination_test` action), the transport layer dials + handshakes + writes the payload to the receiver, and the result is surfaced inline. The destination's `events_shipped_total` and `events_dropped_total` counters are not affected by Test Connection.

If your destination requires the test event to appear in audit history (some compliance setups want every action persisted), trigger a real audit event after save — for example, toggle the destination's Enabled state off and back on. Each toggle persists a `syslog_destination_enable` / `syslog_destination_disable` audit row that fans out to all enabled destinations.

---

## After save

The destination appears in the **Settings → Syslog Destinations** list. The Health column shows the current state (Unknown until the first audit event ships). Counters increment as events ship.

To make changes after save, click the destination's row or use the kebab menu's **Edit** action. The Edit modal re-opens the wizard at Step 1 with all fields prefilled.

To trigger a one-shot test against the saved destination (writes a `syslog_destination_test` audit event but doesn't persist to `audit_logs`), use the kebab menu's **Test** action.

---

## Bulk operations

You can select multiple destinations via the row checkboxes for bulk delete. Other bulk operations are not yet exposed; each destination's Enable / Disable toggle is per-row.
