---
title: Diagnostic Snapshot
sidebar_label: Diagnostic Snapshot
sidebar_position: 6
---

# Diagnostic Snapshot

The Diagnostic Snapshot provides a real-time summary of your Stratora server's health and configuration, and lets you download a support bundle to share with Stratora support when troubleshooting.

## Accessing Diagnostics

Navigate to **Administration > Diagnostics**. This page is visible to admin users only.

## Summary Cards

The diagnostics page displays the following sections:

| Section | What it shows |
|---|---|
| **Server** | Version, build time, hostname, uptime, Go runtime info |
| **Database** | Connectivity, latency, connection pool stats, full migration history |
| **VictoriaMetrics** | Connectivity, latency, base URL |
| **Collectors** | Total, online, stale, and offline collector counts |
| **Agents** | Total agent count and stale agent count (stale = no check-in within 5 minutes) |
| **Alerts** | Total active alerts and firing count by state |
| **License** | Edition, active node count vs. limit, expiry |

## Downloading a Support Bundle

Click **Download Support Bundle** to generate and download a ZIP file containing a `diagnostic.json` snapshot of all the above data at the time of download.

The filename includes your hostname and timestamp:

```
stratora-diagnostic-<hostname>-<YYYYMMDD-HHMMSS>.zip
```

### What's included

- Server version, Go runtime, uptime
- Database host, name, connectivity, pool stats, full applied migration list
- VictoriaMetrics connectivity and base URL
- All collector statuses and assigned node counts
- All agent statuses and last check-in times
- Alert state summary
- License state
- Configuration posture: which notification channels are enabled (SMTP, Twilio, Slack, Teams)

### What's excluded

No credentials, passwords, API keys, tokens, or secrets of any kind are included in the bundle.

## Providing the Bundle to Support

When opening a support request, attach the `diagnostic.json` file (or the full ZIP) to give the support team an accurate picture of your environment without requiring manual information gathering.
