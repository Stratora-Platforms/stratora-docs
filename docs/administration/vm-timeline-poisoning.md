---
sidebar_label: VM Timeline Poisoning (Recovery)
title: VictoriaMetrics Timeline Poisoning — Recovery Runbook
---

# VictoriaMetrics Timeline Poisoning — Recovery Runbook

## Symptom

**Every node reads offline at once, with no obvious cause.** Metrics stop updating even though collectors and agents are running and reporting successfully.

## Cause

A **clock-skew event** — the server's clock jumping forward by hours or years (RTC/CMOS battery, domain-controller time drift, a hypervisor time-sync glitch, or a manual change) — can make VictoriaMetrics record data at a **future timestamp**, establishing a future "high-water mark." After the clock corrects back to the present, VictoriaMetrics **silently stops storing current samples**: the ingest endpoint still returns success (HTTP 204), but nothing new lands. Because no fresh metrics arrive, every node's health goes stale and the UI shows all nodes offline.

This is **not a node outage.** The nodes are fine; VictoriaMetrics is rejecting their data.

## How to confirm

- The red **"VictoriaMetrics is rejecting samples"** banner at the top of the app.
- The built-in **VictoriaMetrics Timeline Poisoning** alert (fires and notifies/escalates like any other alert).
- Node-offline symptom alerts are **suppressed** while this condition is active by design, so you get one clear cause instead of a storm of false node-offline pages.
- Optional deep check: on the server, VictoriaMetrics' `/metrics` shows `vm_rows_ignored_total{reason="big_timestamp"|"small_timestamp"}` climbing and/or `vm_rows_added_to_storage_total` flat while ingest is active. Check the server's NTP offset for the trigger.

## Recovery

:::warning No automatic remediation
Stratora **never** deletes VictoriaMetrics data automatically — historical loss is irreversible. Recovery below is a deliberate, manual operator decision.
:::

### 1. Fix the clock first

Re-sync the server clock (NTP / `w32tm /resync` on Windows) and confirm the offset is near zero. **If you skip this, any recovery below will simply re-poison** as soon as new future-dated samples arrive.

### 2. Clear the future-dated data — understand the constraint

The poisoning persists because future-timestamped data sits ahead of "now." You cannot simply wait it out:

- **Retention does not help.** VictoriaMetrics prunes data older than the retention period. Future-timestamped data is *newer* than now, so it never falls out of retention — it will not age away on its own.
- **`delete_series` is whole-series, not time-ranged.** VictoriaMetrics' `POST /api/v1/admin/tsdb/delete_series?match[]=…` deletes **entire matching series**, not a time window. There is **no time-range delete** — you cannot surgically remove only the future-dated points while keeping each series' history.

Because of that constraint, the two real options are:

| Option | Effect | Data loss |
|---|---|---|
| **A. Full data-dir wipe** — stop VictoriaMetrics, clear its storage directory, restart | Clears the future high-water mark completely | **All** historical metrics |
| **B. `delete_series` on affected series** — `match[]={__name__=~".+"}` (or a narrower matcher) | Removes the poisoned series so ingest resumes | The **full history** of every deleted series (not just the future points) |

Neither preserves only the future points — that is not possible with `delete_series`. Choose based on how much history you can afford to lose. Take a snapshot first if the data matters.

### 3. Verify recovery

After the clock is fixed and the future data cleared:

- New samples start landing again (metrics update; `vm_rows_added_to_storage_total` advances, `vm_rows_ignored_total` stops climbing).
- The **VictoriaMetrics Timeline Poisoning** alert resolves and the banner clears automatically.
- Node-offline suppression lifts, and normal node health / alerting resumes.

## Prevention

Bounding ingest timestamps at the proxy so a future-dated sample can never establish the high-water mark is planned architectural hardening. Until then, keep the server on reliable time sync (NTP), and treat any large clock jump as an event to watch for this condition.
