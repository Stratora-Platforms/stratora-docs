---
title: Alert Response Times
sidebar_label: Response Times
---

# Alert Response Times

Stratora's alerting pipeline has well-defined latency characteristics at each stage. This page documents expected detection, notification delivery, and action-response times so operators can set accurate expectations for their environment.

## Node Reachability (ICMP Ping)

Stratora uses ICMP loss percentage over a sliding window to determine node reachability. This approach eliminates spurious alerts from isolated packet drops while detecting sustained failures reliably.

| Event | Expected Time |
|-------|--------------|
| Detection (sustained packet loss) | ~50 seconds |
| Recovery detection (from stable ping) | ~110 seconds |
| Recovery detection (from power-on) | ~154 seconds (44s boot + 50s drain + 60s grace) |

**Detection requires sustained loss.** A single dropped packet will not trigger an alert. Loss must exceed the configured threshold (default: 5%) over the full evaluation window (default: 60 seconds).

## Alert Evaluation

Alert rules are evaluated on a configurable interval (default: 10 seconds). After a node transitions to offline/degraded, the alert rule evaluator must complete its next cycle before the alert fires and enters the notification pipeline.

## Notification Delivery

Notification delivery time depends on the channel:

| Channel | Typical Delivery |
|---------|-----------------|
| Email | 5-30 seconds (dependent on mail relay) |
| Slack | 1-5 seconds |
| Microsoft Teams | 1-5 seconds |
| Webhook | 1-3 seconds |
| SMS (Twilio - bidirectional) | 5-15 seconds |
| SMS (Twilio - polling mode) | 15-45 seconds (dependent on poll interval) |
| Voice (Twilio) | 10-30 seconds (call setup) |

## ACK / Escalate Response (SMS Polling Mode)

In air-gapped or outbound-only deployments, Stratora uses Twilio Sync polling to receive ACK and ESCALATE replies sent via SMS. The poll interval is configurable (default: 15 seconds).

| Action | Response Latency (polling mode) |
|--------|---------------------------------|
| ACK via SMS reply | Up to 1x poll interval (default: 15s or less) |
| ESCALATE via SMS reply | Up to 1x poll interval (default: 15s or less) |

In **bidirectional mode** (internet-accessible deployments), Twilio delivers inbound SMS replies directly to Stratora via webhook. ACK/Escalate response latency drops to approximately 1-3 seconds.

## End-to-End Example

For a node that goes offline:

1. **0s** - Node stops responding to ICMP ping
2. **~50s** - Loss threshold exceeded; node marked offline
3. **~60s** - Alert rule fires on next evaluation cycle
4. **~61-65s** - Slack/Teams notification delivered
5. **~70-90s** - Email delivered (mail relay dependent)
6. **~75-80s** - SMS delivered (Twilio bidirectional)
7. **~80-95s** - SMS delivered (Twilio polling mode)

> **Note:** The end-to-end times above reflect typical conditions. High-latency mail relays, Twilio rate limits, or large escalation team fan-out may add additional seconds.

## Tuning

The ping detection window and thresholds are configurable. Defaults are tuned to balance sensitivity against spurious alert suppression:

| Parameter | Default | Notes |
|-----------|---------|-------|
| Loss evaluation window | 60 seconds | Shorter = faster detection, more sensitive to transient loss |
| Alert threshold (degraded) | 5% | |
| Alert threshold (offline) | 20% | |
| Twilio poll interval | 15 seconds | Polling mode only |
