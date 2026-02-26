---
sidebar_label: External Notifications
title: External Notifications
---

# External Notifications

Stratora delivers alert notifications to external systems through multiple channels — **email**, **Slack**, **Microsoft Teams**, and **generic webhooks**. Notifications are configured on [escalation team](../alerting/escalation-teams.md) steps, so you control exactly who gets notified, through which channel, and at what point in the escalation process.

---

## Supported Channels

| Channel | Format | Status |
|---------|--------|--------|
| **Email** | HTML (customizable via [templates](./email-templates.md)) | Available |
| **Slack** | Block Kit messages | Available |
| **Microsoft Teams** | Adaptive Cards (v1.4) | Available |
| **Generic Webhook** | JSON payload via HTTP POST | Available |
| **SMS** | Text messages via Twilio | Planned |
| **Voice** | Automated voice calls via Twilio | Planned |

---

## Email (SMTP)

Email notifications use your organization's SMTP server to deliver HTML-formatted alert emails.

### SMTP Configuration

Navigate to **Administration → SMTP Settings** to configure your mail server.

| Field | Required | Description |
|-------|----------|-------------|
| Host | Yes | SMTP server hostname (e.g., `smtp.office365.com`) |
| Port | Yes | SMTP port (typically 587 for STARTTLS, 465 for SSL) |
| Encryption | Yes | `TLS` (STARTTLS), `SSL` (implicit TLS), or `None` |
| Username | No | SMTP authentication username |
| Password | No | SMTP authentication password (encrypted at rest) |
| From Address | Yes | Sender email address (e.g., `alerts@example.com`) |
| From Name | No | Sender display name (default: "Stratora Alerts") |
| Enabled | Yes | Master toggle |

### Testing

Enter a recipient email address and click **Send Test Email** to verify delivery. The test sends a confirmation email through your SMTP server.

### Email Content

Alert emails are rendered from customizable [email templates](./email-templates.md) that include:
- Severity-colored header banner
- Node name, IP address, and site
- Alert details and timestamps
- "View in Stratora" action button
- Branded footer

### Global Email Settings

In addition to per-escalation-team email channels, Stratora has global notification settings that apply as a fallback when alert configurations don't specify an escalation team:

| Setting | Default | Description |
|---------|---------|-------------|
| Email Enabled | Yes | Master switch for fallback email notifications |
| Recipients | — | Default email addresses |
| On Trigger | Yes | Send when an alert fires |
| On Resolve | Yes | Send when an alert resolves |
| On Acknowledge | No | Send when an alert is acknowledged |

---

## Slack

Slack notifications are delivered via [incoming webhooks](https://api.slack.com/messaging/webhooks) using Slack's Block Kit format.

### Configuration

Each escalation step channel needs:

| Field | Required | Description |
|-------|----------|-------------|
| Webhook URL | Yes | Slack incoming webhook URL |
| Channel | No | Override the webhook's default channel (e.g., `#critical-alerts`) |
| Username | No | Override the bot display name (default: "Stratora") |

### Message Format

Alert notifications include:
- Severity emoji and header (red circle for critical, orange diamond for warning)
- Node name and severity in a structured fields layout
- Alert summary and description
- Escalation team and step information
- Timestamp footer

Resolution notifications use a green checkmark with the alert name, node, duration, and resolved timestamp.

### Testing

Use the **Test** button when configuring an escalation step channel to send a test message to your Slack webhook.

---

## Microsoft Teams

Teams notifications are delivered via [incoming webhooks](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) using the **Adaptive Cards v1.4** format for rich, interactive messages.

### Configuration

Each escalation step channel needs:

| Field | Required | Description |
|-------|----------|-------------|
| Webhook URL | Yes | Teams incoming webhook URL |

### Card Types

Stratora sends four types of Adaptive Cards:

| Card | When Sent | Style |
|------|-----------|-------|
| **Alert** | When an alert fires | Red (critical) or yellow (warning) severity styling, with node details, metric values, and an "Acknowledge" action button |
| **Resolved** | When an alert resolves | Green styling with node details and alert duration |
| **Acknowledged** | When an alert is acknowledged | Yellow styling with acknowledger name and timestamp |
| **Test** | When testing the channel | Accent styling with confirmation message |

Alert cards include an **Acknowledge** button that links directly to the alert in Stratora, allowing on-call engineers to acknowledge from the Teams notification without opening the full UI.

### Reliable Delivery

Teams notifications are processed through a **notification queue** with automatic retry:

- Up to **5 delivery attempts** per notification
- **Exponential backoff** between retries (1s, 2s, 4s, 8s, up to 60s max)
- Transient failures (HTTP 408, 429, 502, 503, 504) are retried; permanent failures (4xx) are not
- All delivery attempts are logged for troubleshooting

### Testing

Use the **Test** button to send a test Adaptive Card to your Teams channel and verify the webhook is working.

---

## Generic Webhooks

Generic webhooks send a JSON payload via HTTP POST to any URL, enabling integration with ticketing systems, automation platforms, PagerDuty, custom dashboards, or any system that accepts webhook callbacks.

### Configuration

Each escalation step channel needs:

| Field | Required | Description |
|-------|----------|-------------|
| Webhook URL | Yes | Destination URL |
| Custom Headers | No | Key-value pairs added to the HTTP request (e.g., `Authorization`, `X-API-Key`) |

### Alert Payload

```json
{
  "type": "alert",
  "source": "stratora",
  "timestamp": "2026-01-15T20:45:00Z",
  "alert_id": "...",
  "node_id": "...",
  "node_name": "SERVER-01",
  "severity": "critical",
  "summary": "High CPU Usage on SERVER-01",
  "description": "CPU has been above 95% for 5 minutes",
  "alert_type": "metric",
  "alert_key": "cpu_high",
  "triggered_at": "2026-01-15T20:45:00Z",
  "escalation": "IT On-Call",
  "escalation_step": 1,
  "details": {}
}
```

### Resolution Payload

```json
{
  "type": "alert_resolved",
  "source": "stratora",
  "timestamp": "2026-01-15T20:52:00Z",
  "alert_id": "...",
  "node_id": "...",
  "node_name": "SERVER-01",
  "severity": "critical",
  "summary": "High CPU Usage on SERVER-01",
  "alert_type": "metric",
  "alert_key": "cpu_high",
  "triggered_at": "2026-01-15T20:45:00Z",
  "resolved_at": "2026-01-15T20:52:23Z",
  "duration": "7 minutes 23 seconds",
  "escalation_team": "IT On-Call",
  "escalation_step": 1,
  "details": {}
}
```

### Testing

Use the **Test** button to send a test payload to your webhook URL:

```json
{
  "type": "test",
  "source": "stratora",
  "timestamp": "2026-01-15T20:45:00Z",
  "message": "This is a test notification to verify your escalation team webhook configuration."
}
```

A successful test confirms the URL is reachable and returns an HTTP 2xx response. Custom headers are included in the test request.

---

## SMS and Voice

:::info
**SMS** (text message) and **Voice** (automated phone call) notification channels via Twilio integration are planned for a future release. The escalation team configuration UI includes these channel types, but delivery is not yet active.
:::

---

## How Notifications Connect to Alerting

Notifications are delivered through the [escalation team](../alerting/escalation-teams.md) system:

1. An [alert configuration](../alerting/alert-configurations.md) is linked to an escalation team
2. When an alert fires, the escalation engine starts at Step 1
3. Each step has one or more **channels** (email, Slack, Teams, webhook)
4. If the alert isn't resolved, the engine advances through steps with configured delays
5. When the alert resolves, resolution notifications are sent to all channels that were previously notified

For on-call rotation teams, channels can dynamically target the **current on-call** person, **next on-call**, or **all rotation members** instead of static recipients.

See [Escalation Teams](../alerting/escalation-teams.md) for full details on multi-step escalation, schedules, and on-call rotation.

---

## Notification Audit Trail

All notification delivery attempts are recorded in an audit log, including:

- Notification type and channel
- Delivery status (sent, failed, retried)
- HTTP response code and response time
- Alert and device information
- Escalation team and step

This audit trail helps diagnose delivery issues and provides evidence of notification compliance.
