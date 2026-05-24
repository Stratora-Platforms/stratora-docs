---
sidebar_label: Graylog
title: Forwarding Audit Logs to Graylog
sidebar_position: 5
---

# Forwarding Audit Logs to Graylog

Graylog accepts RFC 5424 syslog via its **Syslog TCP** or **Syslog UDP** inputs. This page covers the TLS-encrypted TCP path; UDP and plaintext-TCP setups are simpler and follow the same pattern.

## Graylog-side setup

### Create a Syslog TCP input

In Graylog's web UI:

1. **System → Inputs**
2. Select **Syslog TCP** from the dropdown and click **Launch new input**
3. Configure:
   - **Title:** `Stratora Audit`
   - **Bind address:** `0.0.0.0`
   - **Port:** `6514`
   - **Allow throttling this input:** unchecked
   - **TLS cert file:** `/etc/graylog/server/certs/graylog.pem`
   - **TLS key file:** `/etc/graylog/server/certs/graylog.key`
   - **TLS client authentication:** `disabled` (Stratora does not present a client cert in v2.2.0)
   - **TLS Enable:** ON
   - **Allow overriding date?** OFF (use Stratora's wire timestamp)
   - **Store full message:** ON (preserves the full RFC 5424 wire for forensics)
4. Click **Save**

The input starts immediately. Confirm it shows "running" with no errors in the Graylog UI.

### Firewall configuration

If your Graylog runs on a RHEL-family Linux distribution (RHEL, Rocky Linux, AlmaLinux, CentOS Stream), the default `firewalld` policy blocks incoming syslog ports. Allow the port with:

```bash
sudo firewall-cmd --add-port=6514/tcp --permanent
sudo firewall-cmd --reload
```

Debian and Ubuntu deployments don't have this gate by default.

---

## Certificate setup

Graylog's TLS input requires the cert + key paths in the input config. Generate a cert with SAN entries matching the destination Host you configure in Stratora:

```bash
openssl req -x509 -newkey rsa:2048 -keyout graylog.key -out graylog.pem \
  -days 365 -nodes \
  -subj "/CN=graylog-01.example.com" \
  -addext "subjectAltName=DNS:graylog-01.example.com,DNS:graylog-01"

sudo chown graylog:graylog graylog.pem graylog.key
sudo chmod 640 graylog.key
sudo chmod 644 graylog.pem
sudo mv graylog.pem graylog.key /etc/graylog/server/certs/
```

For internal CAs, paste the CA PEM into Stratora's **Custom CA Certificate** field at wizard Step 3.

Restart Graylog after the cert is in place:

```bash
sudo systemctl restart graylog-server
```

---

## Stratora-side configuration

Navigate to **Settings → Syslog Destinations → Add Destination** and walk through the wizard:

| Step | Field | Value |
|---|---|---|
| 1 — Details | Name | `Graylog Production` (or your own naming convention) |
| 2 — Connection | Host | The Graylog hostname matching the cert SAN |
| 2 — Connection | Port | `6514` |
| 2 — Connection | Protocol | `TCP + TLS (recommended)` |
| 3 — Format | RFC Format | `RFC 5424 (modern)` |
| 3 — Format | Facility | `local0` |
| 3 — Format | Verify server certificate | ON |
| 3 — Format | Custom CA Certificate | Paste your CA cert PEM here if self-signed or internal CA |
| 4 — Review | Enabled | ON |
| 4 — Review | — | Click **Test Connection**; expect "Test event sent successfully" |
| 4 — Review | — | Click **Create** |

---

## Verifying ingest in Graylog

In Graylog's web UI, **Search** → use a query like:

```
source:stratora-host AND application_name:stratora
```

Graylog's structured-data extraction populates fields directly from RFC 5424 wire bytes:

| Graylog field | Stratora wire field |
|---|---|
| `application_name` | APP-NAME (`stratora`) |
| `process_id` | PROCID (backend PID) |
| `level` | computed from PRI (notice=5) |
| `facility` | computed from PRI (local0=16) |
| `source` | HOSTNAME |
| `message` | MSG body (`user=admin resource=… ip=…`) |

### Extracting key=value pairs from MSG

Graylog's **Key=Value Pairs Extractor** can split the MSG body into individual fields. Configure on the input:

1. Input → **Manage extractors**
2. **Add extractor → Key=Value Pairs**
3. Source field: `message`
4. Save

After the extractor is in place, audit metadata appears as top-level Graylog fields: `user`, `resource`, `ip`, `resource_id`, etc.

### Streams and alerts

Route Stratora audit events into a dedicated stream with rule `application_name = stratora`. From there, build alert rules on specific actions — e.g., `audit_action = user_disable AND resource = admin` to flag admin-level user disables.

---

## Operational notes

- **Graylog journal:** if Elasticsearch is slow or down, Graylog's journal buffers incoming syslog to disk; events resume processing when Elasticsearch recovers.
- **Throttling:** the Stratora destination's per-queue cap (1,000 events) means extreme bursts may drop events before they reach Graylog. Monitor `events_dropped_total` on the destination during heavy use.
- **Test isolation:** Test Connection events are tagged as `syslog_destination_test` and bypass Stratora's `audit_logs` table — they appear at Graylog but are not part of Stratora's persistent audit history.
