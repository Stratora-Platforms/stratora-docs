---
sidebar_label: Elastic
title: Forwarding Audit Logs to Elastic
sidebar_position: 4
---

# Forwarding Audit Logs to Elastic

This page covers Stratora → **Elastic (Elasticsearch + Kibana)** integration via either **Logstash** or **Filebeat** as the syslog receiver.

## Elastic-side setup

### Option 1 — Logstash syslog input with TLS

Logstash's syslog input plugin accepts RFC 5424 over TCP+TLS. Configure a pipeline:

`/etc/logstash/conf.d/stratora-syslog.conf`:

```ruby
input {
  syslog {
    port => 6514
    type => "stratora_audit"
    ssl_enable => true
    ssl_cert => "/etc/logstash/certs/logstash.pem"
    ssl_key => "/etc/logstash/certs/logstash.key"
    ssl_verify => false  # Stratora doesn't present a client cert
    codec => plain {
      charset => "UTF-8"
    }
  }
}

filter {
  if [type] == "stratora_audit" {
    grok {
      match => {
        "message" => "%{NONNEGINT:procid}\s+%{WORD:audit_action}\s+-\s+%{GREEDYDATA:audit_kv}"
      }
    }
    kv {
      source => "audit_kv"
      target => "audit"
    }
  }
}

output {
  if [type] == "stratora_audit" {
    elasticsearch {
      hosts => ["https://elastic:9200"]
      index => "stratora-audit-%{+YYYY.MM.dd}"
      user => "logstash_writer"
      password => "${LOGSTASH_ES_PW}"
    }
  }
}
```

Restart Logstash after the pipeline is in place:

```bash
sudo systemctl restart logstash
```

### Option 2 — Filebeat syslog module

Filebeat's syslog input supports RFC 5424 over TCP+TLS too, with simpler config than Logstash:

`/etc/filebeat/filebeat.yml`:

```yaml
filebeat.inputs:
  - type: syslog
    enabled: true
    format: rfc5424
    protocol.tcp:
      host: "0.0.0.0:6514"
      ssl:
        enabled: true
        certificate: "/etc/filebeat/certs/filebeat.pem"
        key: "/etc/filebeat/certs/filebeat.key"

output.elasticsearch:
  hosts: ["https://elastic:9200"]
  index: "stratora-audit-%{+yyyy.MM.dd}"
  username: "filebeat_writer"
  password: "${FILEBEAT_ES_PW}"
```

Filebeat is generally easier to operate at smaller scales; use Logstash if you need richer filtering or multi-output fan-out.

### Firewall configuration

If your SIEM runs on a RHEL-family Linux distribution (RHEL, Rocky Linux, AlmaLinux, CentOS Stream), the default `firewalld` policy blocks incoming syslog ports. Allow the port with:

```bash
sudo firewall-cmd --add-port=6514/tcp --permanent
sudo firewall-cmd --reload
```

Debian and Ubuntu deployments don't have this gate by default.

---

## Certificate setup

Generate a cert for the Logstash or Filebeat listener with SAN entries that match the destination Host you configure in Stratora:

```bash
openssl req -x509 -newkey rsa:2048 -keyout logstash.key -out logstash.pem \
  -days 365 -nodes \
  -subj "/CN=logstash-01.example.com" \
  -addext "subjectAltName=DNS:logstash-01.example.com,DNS:logstash-01"
```

For internal CAs, paste the CA PEM into Stratora's **Custom CA Certificate** field at wizard Step 3.

---

## Stratora-side configuration

Navigate to **Settings → Syslog Destinations → Add Destination** and walk through the wizard:

| Step | Field | Value |
|---|---|---|
| 1 — Details | Name | `Elastic Production` (or your own naming convention) |
| 2 — Connection | Host | The Logstash / Filebeat hostname matching the cert SAN |
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

## Verifying ingest in Kibana

In Kibana, navigate to **Discover** and search the index `stratora-audit-*`. Expected event fields after Logstash/Filebeat parsing:

```json
{
  "@timestamp": "2026-05-24T12:00:00.000Z",
  "host": "stratora-host",
  "program": "stratora",
  "procid": 392,
  "audit_action": "login",
  "audit": {
    "user": "admin",
    "resource": "session",
    "ip": "10.0.0.10"
  }
}
```

The grok pattern from the Logstash config above extracts `audit_action` and the key=value pairs into the `audit.*` namespace; adjust the pattern if your needs differ.

### Index lifecycle management

For long-running deployments, attach an ILM policy to the `stratora-audit-*` index pattern to handle rollover and retention per your compliance requirements (e.g., SOC 2 typically requires ≥1 year audit log retention).

---

## Operational notes

- **Logstash queue persistence:** if Stratora ships faster than Elasticsearch can index, Logstash buffers in its in-memory or persistent queue. Configure `queue.type: persisted` for compliance-critical deployments to survive Logstash restarts.
- **Filebeat backpressure:** Filebeat sends events with at-least-once delivery; if Elasticsearch is unreachable, Filebeat retries until the connection recovers.
- **Test isolation:** Test Connection events are tagged as `syslog_destination_test` and bypass Stratora's `audit_logs` table — they appear at Logstash/Filebeat but are not part of Stratora's persistent audit history.
