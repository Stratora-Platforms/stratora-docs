---
sidebar_label: Splunk
title: Forwarding Audit Logs to Splunk
sidebar_position: 3
---

# Forwarding Audit Logs to Splunk

This page walks through configuring Stratora to forward audit events to **Splunk Enterprise** or **Splunk Cloud** via TCP+TLS. Splunk's syslog receiver path (Universal Forwarder / Heavy Forwarder / Cloud HEC) accepts RFC 5424 traffic natively.

## Splunk-side setup

### Option 1 — TCP+TLS on a Universal/Heavy Forwarder

Most production Splunk deployments use a Forwarder to terminate the syslog connection and parse events before sending to indexers. Configure the Forwarder to listen on TCP+TLS port 6514:

`$SPLUNK_HOME/etc/system/local/inputs.conf`:

```ini
[tcp-ssl:6514]
sourcetype = syslog
index = stratora_audit
disabled = 0
```

`$SPLUNK_HOME/etc/system/local/server.conf`:

```ini
[sslConfig]
serverCert = $SPLUNK_HOME/etc/auth/server-cert.pem
sslPassword = <your-password>
requireClientCert = false
```

Restart `splunkd` after editing both files.

### Option 2 — Splunk Connect for Syslog (SC4S)

For larger deployments, **Splunk Connect for Syslog (SC4S)** is the recommended pattern. SC4S runs as a container fronting Splunk indexers and handles syslog at the edge. SC4S accepts RFC 5424 / 3164 over UDP, TCP, and TCP+TLS out of the box.

Point Stratora at the SC4S endpoint instead of a Forwarder; the receiver-side configuration is identical from Stratora's perspective.

### Firewall configuration

If your SIEM runs on a RHEL-family Linux distribution (RHEL, Rocky Linux, AlmaLinux, CentOS Stream), the default `firewalld` policy blocks incoming syslog ports. Allow the port with:

```bash
sudo firewall-cmd --add-port=6514/tcp --permanent
sudo firewall-cmd --reload
```

Debian and Ubuntu deployments don't have this gate by default.

---

## Certificate setup

Splunk's TLS listener presents the cert configured in `server.conf`. Stratora needs to trust that cert's signing chain.

**If the cert is signed by a publicly-trusted CA:** leave Stratora's **Custom CA Certificate** field empty.

**If the cert is self-signed or signed by an internal CA:** paste the CA's PEM into Stratora's **Custom CA Certificate** field at wizard Step 3.

### Certificate SAN requirement

Stratora's TLS verification (Go `crypto/tls`) requires the receiver certificate to have **Subject Alternative Name (SAN)** entries matching the destination Host you configured. Common Name (CN) alone is not sufficient under modern Go clients.

When generating a self-signed cert for Splunk, ensure the SAN includes both the FQDN and short name:

```bash
openssl req -x509 -newkey rsa:2048 -keyout splunk.key -out splunk.pem \
  -days 365 -nodes \
  -subj "/CN=splunk-hf-01.example.com" \
  -addext "subjectAltName=DNS:splunk-hf-01.example.com,DNS:splunk-hf-01"
```

If the cert SAN doesn't match the Host field you entered in Stratora, the handshake fails with `x509: certificate is not valid for any names, but wanted to match <Host>`.

---

## Stratora-side configuration

Navigate to **Settings → Syslog Destinations → Add Destination** and walk through the wizard:

| Step | Field | Value |
|---|---|---|
| 1 — Details | Name | `Splunk Production` (or your own naming convention) |
| 2 — Connection | Host | The Splunk Forwarder / SC4S hostname matching the cert SAN |
| 2 — Connection | Port | `6514` |
| 2 — Connection | Protocol | `TCP + TLS (recommended)` |
| 3 — Format | RFC Format | `RFC 5424 (modern)` |
| 3 — Format | Facility | `local0` (or non-default if you segregate sources at the receiver) |
| 3 — Format | Verify server certificate | ON |
| 3 — Format | Custom CA Certificate | Paste your CA cert PEM here if self-signed or internal CA |
| 4 — Review | Enabled | ON |
| 4 — Review | — | Click **Test Connection**; expect "Test event sent successfully" |
| 4 — Review | — | Click **Create** |

Within seconds, the destination's Health pill should show **Healthy** and counters start incrementing.

---

## Verifying ingest in Splunk

Run a search like:

```
index=stratora_audit sourcetype=syslog | head 10
```

Expected events look like:

```
<133>1 2026-05-24T12:00:00.000000Z stratora-host stratora 392 login - user=admin resource=session ip=10.0.0.10
```

Field extractions can be set up via Splunk's field aliases or a custom `props.conf` / `transforms.conf` pair targeting the `stratora_audit` index.

### Suggested field extractions

In `$SPLUNK_HOME/etc/system/local/props.conf`:

```ini
[syslog]
EXTRACT-stratora_action = stratora\s+\d+\s+(?<stratora_action>\S+)\s+-
EXTRACT-stratora_kv = (?<stratora_user>user=\S+)\s+(?<stratora_resource>resource=\S+)
```

---

## Operational notes

- **Per-destination isolation:** if your Splunk Forwarder goes down, Stratora's other destinations (if any) continue shipping. Splunk's counter accumulates `events_dropped_total` until the Forwarder recovers.
- **Restart drain:** Stratora drains in-flight events to Splunk on backend restart.
- **Test isolation:** Test Connection events are tagged as `syslog_destination_test` and bypass the `audit_logs` table — they appear at the Splunk Forwarder but are not part of Stratora's persistent audit history.
