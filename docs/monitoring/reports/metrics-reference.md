---
sidebar_label: Metrics Reference
sidebar_position: 5
title: Report Metrics Reference
---

# Report Metrics Reference

This page provides detailed definitions of every metric used in Stratora reports, including how each value is calculated, what edge cases are handled, and how maintenance windows affect the results.

---

## Health Score

**Definition:** The average percentage of non-maintenance nodes in a healthy state, calculated from hourly snapshots across the reporting period.

**Calculation:**

1. Every hour, Stratora records a snapshot of each node's health status
2. For each snapshot, the health score is: `healthy nodes / (total nodes − maintenance nodes) × 100`
3. The reported health score is the **time-weighted average** of all hourly snapshots in the reporting period

**Example:** A site has 10 nodes. During one hourly snapshot, 2 nodes are in maintenance and 7 of the remaining 8 are healthy. The snapshot health score is `7 / 8 = 87.5%`.

:::info
Nodes in maintenance are **excluded from the denominator**, not counted as unhealthy. This prevents planned maintenance from artificially lowering health scores.
:::

---

## Uptime

**Definition:** The percentage of time a site was operational — meaning it was not fully offline (at least one non-maintenance node was reachable).

**Calculation:**

```
Uptime % = (1 − total offline duration / reporting period duration) × 100
```

A site is considered **offline** when all non-maintenance nodes are simultaneously unreachable. If even one node remains reachable, the site is still counted as "up" (though it may be degraded).

**Example:** Over a 30-day period (720 hours), a site was fully offline for 3.6 hours. Uptime = `(1 − 3.6 / 720) × 100 = 99.5%`.

---

## Healthy Time

**Definition:** The percentage of time **all** non-maintenance nodes at a site were simultaneously in a healthy status.

**Calculation:**

```
Healthy Time % = total fully-healthy duration / reporting period duration × 100
```

A site is in a "fully healthy" state only when every non-maintenance node has no active alerts and is reachable. Any single node in warning, critical, or offline status breaks the fully-healthy state.

**Example:** Over 30 days, a site was fully healthy for 612 out of 720 hours. Healthy Time = `612 / 720 × 100 = 85%`.

:::tip
Healthy Time is a stricter metric than Uptime. Use it to measure operational perfection — Uptime tells you "was the site available?", while Healthy Time tells you "was everything working as expected?"
:::

---

## Incidents

**Definition:** The number of transitions into offline status for a site or node, after flap debounce is applied.

### Detection Rules

An incident is triggered when a site or node transitions from any non-offline status (healthy, warning, critical) to **offline**. Only offline transitions count as incidents — transitions between warning and critical do not.

### Flap Debounce

To prevent transient connectivity issues from inflating incident counts, a **2-hour debounce window** is applied:

- If a site/node goes offline, recovers, and then goes offline again within **2 hours**, it is counted as a **single incident**
- The incident's duration spans from the first offline transition to the final recovery
- If the gap between offline periods exceeds 2 hours, they are counted as separate incidents

**Example:** A node goes offline at 10:00, recovers at 10:15, goes offline again at 11:30, and recovers at 11:45. Because the recovery gap (10:15–11:30 = 1h 15m) is within the 2-hour window, this counts as **one incident** lasting from 10:00 to 11:45.

---

## Mean Time to Recover (MTTR)

**Definition:** The average duration from incident start to resolution, calculated only from **resolved** incidents within the reporting period.

**Calculation:**

```
MTTR = sum of all incident durations / number of resolved incidents
```

### Rules

- Only **resolved incidents** are included — ongoing incidents that started but did not resolve within the reporting period are excluded from MTTR
- Incident duration is measured from the initial offline transition to the point where the site/node returns to a non-offline status and stays online past the flap debounce window
- If there are no resolved incidents, MTTR is displayed as **N/A**

---

## Empty Site Handling

Sites with **no monitored nodes** during the reporting period receive special treatment:

| Metric | Value for Empty Sites |
|--------|----------------------|
| Health Score | **N/A** |
| Uptime | **N/A** |
| Healthy Time | **N/A** |
| Incidents | **0** |
| MTTR | **N/A** |

Empty sites are **excluded from global averages** in the Executive Summary. They appear in per-site tables with N/A values so you know they exist, but they don't skew aggregate metrics.

:::info
A site is considered "empty" if it had zero non-maintenance nodes for the entire reporting period. If nodes were present for part of the period, metrics are calculated for the time they were active.
:::

---

## How Maintenance Affects Metrics

[Maintenance windows](../../alerting/maintenance.md) have specific effects on report metrics to ensure planned downtime doesn't distort your data.

| Metric | Maintenance Effect |
|--------|-------------------|
| **Health Score** | Nodes in maintenance are **excluded from the denominator** — they are not counted as healthy or unhealthy |
| **Uptime** | A site is not considered "offline" if all remaining online nodes are in maintenance — only non-maintenance nodes factor into the offline determination |
| **Healthy Time** | Maintenance nodes are excluded — fully-healthy is evaluated only against non-maintenance nodes |
| **Incidents** | Transitions to offline status **during a maintenance window do not trigger incidents** |
| **MTTR** | Maintenance-related offline events are excluded from MTTR calculations |
| **Heatmap** | Maintenance periods are shown as **gray** blocks, distinct from healthy or degraded states |

:::tip
Schedule [maintenance windows](../../alerting/maintenance.md) before performing planned work. This ensures your reports accurately reflect organic reliability rather than planned disruptions.
:::

---

## Metric Summary

| Metric | Scope | Unit | Calculation Basis |
|--------|-------|------|-------------------|
| Health Score | Site or Global | Percentage | Hourly snapshots, time-weighted average |
| Uptime | Site | Percentage | Continuous monitoring, offline = all nodes unreachable |
| Healthy Time | Site | Percentage | Continuous monitoring, healthy = all nodes healthy |
| Incidents | Site or Node | Count | Offline transitions with 2-hour flap debounce |
| MTTR | Site or Node | Duration | Resolved incidents only |
