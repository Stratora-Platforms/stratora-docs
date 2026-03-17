---
title: Recurring Maintenance Schedules
sidebar_label: Recurring Schedules
sidebar_position: 6
---

# Recurring Maintenance Schedules

Recurring maintenance schedules let you define time windows that repeat on a
regular cadence — daily, weekly, monthly, or a custom pattern. During an active
window, Stratora suppresses alert notifications for the nodes in scope, so your
team isn't paged for expected downtime like nightly backups, patch cycles, or
scheduled reboots.

## How it works

When a maintenance window is active, Stratora silently drops new alerts for
nodes in scope — no alert instance is created, no notification is sent, and
the alert does not queue for delivery after the window ends. Alerts that were
already firing before the window started continue until they naturally resolve.

## Getting started

Navigate to **Alerting > Maintenance > Recurring** tab and click **Add Recurring Schedule**.

The wizard walks you through five steps:

### 1. Details
Give the schedule a name and optional description. Use the **Enabled** toggle
to activate or pause the schedule without deleting it.

### 2. Scope
Choose which nodes this window applies to:

| Scope | Coverage |
|-------|----------|
| **Global** | All nodes in your environment |
| **Site** | All nodes assigned to a specific site |
| **Node Group** | All nodes in a specific group or tag |
| **Node** | One or more specific nodes |

For node scope, use the transfer list to move nodes from Available to Selected.
You can search within either column and add or remove nodes at any time by
editing the schedule.

### 3. Schedule
Configure when the window recurs:

**Recurrence presets**
- **Daily** — every day
- **Weekdays** — Monday through Friday
- **Weekends** — Saturday and Sunday
- **Weekly** — one or more specific days of the week
- **Monthly** — one specific day of the month (1-31)
- **Custom** — any combination of days

**Timing**
- Select your **timezone** — Stratora evaluates the window in the timezone you
  choose, so a 2:00 AM window always fires at 2:00 AM local time regardless of
  daylight saving changes.
- Set a **start time** and either an **end time** or a **duration**.
- Overnight windows are supported — a window starting at 11:00 PM and ending
  at 2:00 AM will correctly span midnight.

The preview at the bottom of the step shows a plain-English summary of your
configuration as you build it.

### 4. Notifications
Stratora can notify your team when a maintenance window starts and ends, so
on-call engineers know alert suppression is active.

- **Notify on start** — sends a notification when the window becomes active
- **Notify on end** — sends a notification when monitoring resumes
- Select which **channels** to use: Email, Slack, Teams, or Webhook

Only channels you have configured under Integrations will appear.

### 5. Review
Confirm your settings and click **Save Schedule**. The schedule appears in the
Recurring tab and takes effect immediately if the current time falls within
an active window.

## Managing schedules

From the Recurring tab you can:
- **Enable/disable** a schedule with the toggle in the Enabled column
- **Edit** any schedule to change scope, timing, or notifications
- **Delete** a schedule to remove it permanently

The **Active Now** badge in the table shows which schedules currently have an
open window. The **Next Window** column shows when the next occurrence starts.

## Conflict resolution

If a node matches more than one active schedule simultaneously, suppression
wins — the node's alerts are suppressed as long as any matching schedule is
active.

## Interaction with one-time maintenance windows

Recurring schedules and one-time maintenance windows (the **Active** and
**Scheduled** tabs) work independently. A node is suppressed if it is covered
by either a recurring schedule or a one-time window that is currently active.

## Timezone guidance

Always set the timezone to match the location or team responsible for the
maintenance window — not necessarily the server's timezone. Stratora stores
all window times in the selected timezone and handles daylight saving
transitions automatically.

If you manage sites across multiple regions, create separate schedules per
timezone rather than trying to offset times manually.
