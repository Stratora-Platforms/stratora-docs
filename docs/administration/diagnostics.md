---
title: Diagnostics
sidebar_label: Diagnostics
sidebar_position: 6
---

# Diagnostics

The Diagnostics page provides a real-time summary of your Stratora server's health and configuration, and lets you download a support bundle to share with Stratora support when troubleshooting.

## Accessing Diagnostics

Navigate to **Administration > Diagnostics** in the sidebar. This page is visible to admin users only.

## Summary Cards

| Section | Details |
|---|---|
| **Server** | Version, build time, hostname, uptime, Go runtime info |
| **Database** | Connectivity status, latency, connection pool stats, full applied migration history |
| **VictoriaMetrics** | Connectivity status, latency, base URL |
| **Collectors** | Total, online, stale, and offline counts with per-collector node assignments |
| **Agents** | Total count and stale count (stale = no check-in within 5 minutes) |
| **Alerts** | Total active alerts and breakdown by state |
| **License** | Edition, active node count vs. limit, trial status, expiry |

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

When opening a support request, attach the `diagnostic.json` file or the full ZIP. This gives the support team an accurate snapshot of your environment without requiring manual information gathering or follow-up questions.
