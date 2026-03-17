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

A planned maintenance event with a defined start time. Navigate to **Alerting > Maintenance** and click **New Maintenance Window**.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Display name (e.g., "February Patch Tuesday", "UPS battery replacement") |
| Scope | Yes | What to mute — a node, node group, or site |
| Start Time | Yes | When the window begins (can be in the future) |
| End Time | No | When the window ends (leave empty for indefinite) |
| Recurrence | No | Repeating schedule in iCal RRULE format |
| Reason | No | Description of the maintenance activity |

### Recurring Schedules

For automated, timezone-aware recurring windows (e.g. "every weekday 2-4 AM"), see [Recurring Maintenance Schedules](#recurring-maintenance-schedules) below.

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

---

## Recurring Maintenance Schedules

Recurring maintenance schedules let you define time windows that repeat on a regular cadence — daily, weekly, monthly, or a custom pattern. During an active window, Stratora silently drops new alerts for nodes in scope — no alert instance is created, no notification is sent, and the alert does not queue for delivery after the window ends. Alerts that were already firing before the window started continue until they naturally resolve.

:::info How recurring schedules differ from one-time windows
One-time maintenance windows (above) create alert instances but suppress notifications. Recurring schedules go further — they prevent alert instances from being created entirely. Both approaches suppress paging; recurring schedules leave no alert artifact to review afterward.
:::

### Creating a Recurring Schedule

Navigate to **Alerting > Maintenance > Recurring** tab and click **Add Recurring Schedule**. The wizard walks you through five steps:

#### Step 1 — Details

Give the schedule a name and optional description. Use the **Enabled** toggle to activate or pause the schedule without deleting it.

#### Step 2 — Scope

Choose which nodes this window applies to:

| Scope | Coverage |
|-------|----------|
| **Global** | All nodes in your environment |
| **Site** | All nodes assigned to a specific site |
| **Node Group** | All nodes in a specific group or tag |
| **Node** | One or more specific nodes |

For node scope, use the transfer list to move nodes from Available to Selected. You can search within either column and add or remove nodes at any time by editing the schedule.

#### Step 3 — Schedule

Configure when the window recurs:

**Recurrence presets**
- **Daily** — every day
- **Weekdays** — Monday through Friday
- **Weekends** — Saturday and Sunday
- **Weekly** — one or more specific days of the week
- **Monthly** — one specific day of the month (1-31)
- **Custom** — any combination of days

**Timing**
- Select your **timezone** — Stratora evaluates the window in the timezone you choose, so a 2:00 AM window always fires at 2:00 AM local time regardless of daylight saving changes.
- Set a **start time** and either an **end time** or a **duration**.
- Overnight windows are supported — a window starting at 11:00 PM and ending at 2:00 AM will correctly span midnight.

The preview at the bottom of the step shows a plain-English summary of your configuration as you build it.

#### Step 4 — Notifications

Stratora can notify your team when a maintenance window starts and ends, so on-call engineers know alert suppression is active.

- **Notify on start** — sends a notification when the window becomes active
- **Notify on end** — sends a notification when monitoring resumes
- Select which **channels** to use: Email, Slack, Teams, or Webhook

Only channels you have configured under Integrations will appear.

#### Step 5 — Review

Confirm your settings and click **Save Schedule**. The schedule appears in the Recurring tab and takes effect immediately if the current time falls within an active window.

### Managing Recurring Schedules

From the Recurring tab you can:
- **Enable/disable** a schedule with the toggle in the Enabled column
- **Edit** any schedule to change scope, timing, or notifications
- **Delete** a schedule to remove it permanently

The **Active Now** badge in the table shows which schedules currently have an open window. The **Next Window** column shows when the next occurrence starts.

### Conflict Resolution

If a node matches more than one active schedule simultaneously, suppression wins — the node's alerts are suppressed as long as any matching schedule is active.

Recurring schedules and one-time maintenance windows work independently. A node is suppressed if it is covered by either a recurring schedule or a one-time window that is currently active.

### Timezone Guidance

Always set the timezone to match the location or team responsible for the maintenance window — not necessarily the server's timezone. Stratora stores all window times in the selected timezone and handles daylight saving transitions automatically.

If you manage sites across multiple regions, create separate schedules per timezone rather than trying to offset times manually.
