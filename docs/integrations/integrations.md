---
sidebar_label: Overview
title: Integrations
---

# Integrations

Stratora connects to other systems in two ways: it sends alert notifications to people and tools, and it forwards the events it records to syslog receivers.

## Alert notifications

Configured in **Settings → External Notifications** and used on escalation team steps. See [External Notifications](./external-notifications.md).

- **Email (SMTP)**, with customizable HTML [email templates](./email-templates.md) and branding.
- **Slack** and **Microsoft Teams**, through incoming webhooks.
- **Generic webhooks**: a JSON payload sent by HTTP POST to any URL, for tools that accept webhooks, such as ticketing or automation platforms.
- **SMS and voice calls** through your own Twilio account. Voice calls are announcement-only.

## Event forwarding to syslog

Every event Stratora records (sign-ins, configuration changes, alerts, escalations, notification delivery, and system events) can be forwarded to syslog destinations over UDP, TCP or TCP with TLS. See [Syslog Destinations](./syslog-destinations/index.md), with setup notes for Splunk, Elastic and Graylog.

Stratora has no built-in connectors for ticketing or PSA platforms. To send alerts to one, use a generic webhook.
