---
sidebar_label: Maintenance
title: Maintenance
---

# Maintenance

**Maintenance windows** suppress alert notifications during planned work — patching, reboots, migrations, and other activities that would otherwise trigger a flood of alerts. Alerts are still evaluated and recorded, but notifications are silenced until the window ends.

---

## Types of Maintenance

Stratora supports two ways to suppress alerts.

### Manual Mute

An immediate, ad-hoc mute for when you need to silence alerts right now. Navigate to a node, node group, or site and click **Mute**.

| Field | Required | Description |
|-------|----------|-------------|
| Duration | No | How long to mute (leave empty for indefinite — until manually ended) |
| Reason | No | Why the mute was applied |

Manual mutes start immediately and don't require a name or schedule.

### Scheduled Maintenance Window

A planned maintenance event with a defined start time. Navigate to **Alerting → Maintenance** and click **New Maintenance Window**.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Display name (e.g., "February Patch Tuesday", "UPS battery replacement") |
| Scope | Yes | What to mute — a node, node group, or site |
| Start Time | Yes | When the window begins (can be in the future) |
| End Time | No | When the window ends (leave empty for indefinite) |
| Recurrence | No | Repeating schedule in iCal RRULE format |
| Reason | No | Description of the maintenance activity |

---

## Scoping

Every maintenance window or manual mute targets a specific scope.

| Scope | Effect |
|-------|--------|
| **Node** | Suppresses alerts on a single node |
| **Node Group** | Suppresses alerts on all nodes in the [group](../infrastructure/node-groups.md) |
| **Site** | Suppresses alerts on all nodes in the [site](../infrastructure/sites.md) |

### Scope Inheritance

Mutes cascade down through the hierarchy. When a site is muted, every node in that site is effectively muted — even if the node doesn't have its own direct mute.

The system checks for muting in this order:
1. **Direct node mute** — is the specific node muted?
2. **Node group mute** — is the node a member of a muted group?
3. **Site mute** — does the node belong to a muted site?

If any level matches, the node's alerts are suppressed. The mute source (direct, node group, or site) is displayed in the UI so you can see why a node is muted.

---

## How Maintenance Suppresses Alerts

During a maintenance window, the alert evaluator still runs its normal 10-second cycle. When it detects a condition that would normally fire an alert:

1. The alert is **created in the database** with its normal severity and details
2. The alert is **marked as muted** and linked to the maintenance window
3. The **suppressed alert count** on the maintenance window is incremented
4. The [escalation engine](./escalation-teams.md) **skips the muted alert** — no notifications are sent

This means you don't lose visibility into what happened during maintenance. After the window ends, you can review which alerts were suppressed and investigate any that remain active.

:::tip
Nodes in maintenance display a **Maintenance** health status badge. This makes it clear in dashboards and node lists that alerts are being suppressed intentionally.
:::

---

## Recurrence

Scheduled maintenance windows can repeat on a regular schedule using **iCal RRULE** format.

Examples:

| Pattern | RRULE |
|---------|-------|
| Every Tuesday at the same time | `FREQ=WEEKLY;BYDAY=TU` |
| Second Tuesday of every month | `FREQ=MONTHLY;BYDAY=2TU` |
| Every 2 weeks on Saturday | `FREQ=WEEKLY;INTERVAL=2;BYDAY=SA` |
| First Sunday of each quarter | `FREQ=MONTHLY;INTERVAL=3;BYDAY=1SU` |

---

## Quick Mute

For fast, one-click muting, every node has a **Mute** action available from:
- The node detail view
- The node list (right-click or actions menu)
- The alerts view

Quick mute creates a manual mute with optional duration and reason. No name or schedule required.

You can also **bulk mute** multiple nodes at once by selecting them in the node list and choosing **Actions → Mute**.

---

## Ending Maintenance

Maintenance windows end automatically when their end time is reached. The system checks for expired windows every **1 minute** and:

1. Closes the maintenance window
2. Records the end time and reason ("auto-ended") in the maintenance history
3. Unmutes all affected alerts

You can also end a maintenance window early by clicking **End Now** from the maintenance detail view. Alerts that are still in a firing condition will resume normal notification behavior.

For indefinite mutes (no end time), you must end them manually.

---

## Maintenance History

Every maintenance event is recorded in the **maintenance history** for auditing and review.

Each history entry includes:

| Field | Description |
|-------|-------------|
| Scope | What was muted (node, group, or site name) |
| Type | Manual mute or scheduled maintenance |
| Reason | The stated reason for maintenance |
| Started At | When the window became active |
| Ended At | When the window closed |
| Ended By | Who ended it (or "auto-ended" if it expired) |
| Alerts Suppressed | Count of alerts that were silenced during the window |

View maintenance history from **Alerting → Maintenance → History**.

---

## Maintenance in Node Views

When a node is in maintenance (directly or via group/site inheritance), the node detail view shows:

- **Maintenance badge** on the health status
- **Mute source** — whether the mute is direct, from a node group, or from a site
- **Mute source name** — the group or site name if inherited
- **Mute type** — manual or scheduled maintenance
- **Ends at** — when the mute expires (or "indefinite")
