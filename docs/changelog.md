---
sidebar_label: Changelog
sidebar_position: 2
---

# Changelog

All notable changes to Stratora are listed here, newest first.
For detailed installation instructions see [Getting Started](/docs/getting-started).

---

## v2.1.3 — April 15, 2026

### Bundled Components
- Agent 2.1.3 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.3

### Audit Logging

- Full CRUD audit coverage across collectors, site photos, contact bulk import, OIDC provider config, component enrollment, server startup, and migration application events.
- Self-service password change and session cleanup events.
- IdP contact sync events (create, update, merge) with system actor attribution.
- License parse-failure downgrade events.
- DB-level soft immutability via trigger (migration 146) — direct mutation of audit_logs raises an error; retention managed via SECURITY DEFINER function only.

### Escalation Teams

- Contact references stored in `escalation_channel_contacts` junction table (migration 144); email/Slack/Teams dispatch resolves contacts from junction.
- Live on-call preview banner in rotation schedule showing current position holder and next shift handoff time.
- Drag-and-drop reordering for rotation members (with keyboard-accessible fallback).
- Save-time configuration warnings when rotation members lack phone/email for targeted channels.
- Dispatch-time audit log entries when SMS/Voice notifications are skipped due to missing phone numbers.
- SMS/Voice targeting chips (On-Call #1, All Members, Specific Contacts) now fully honored by backend dispatch.
- oncall_notify_sms / oncall_notify_voice toggles exposed in UI for rotation teams.
- Slack/Teams channels now support ContactPicker for individual contacts alongside freeform webhook URLs.

### Contact Registry

- IdP sync merge path — existing manual contacts promoted to managed on email match at login.
- Bulk import now logs aggregate audit entry with imported/merged/skipped/errors counts.
- Two-step modal redesign (Basic Info → Notification Channels).
- Phone number normalization via react-phone-number-input (country code enforcement, auto-formatting).
- ContactPicker filters to only show contacts with the required channel configured.

### Fixes

- User menu dropdown clipped by overflow-hidden on TopNavBar flex container.
- UpsertContactFromIdP: email no longer NULL on fresh IdP contact creation.
- Toast regressions: acknowledged alerts no longer re-appear; dismissing via "View" works correctly; tab sleep/wake no longer causes burst toasts; toasts no longer render above modals.
- Escalation teams: clone preserves junction-backed ContactIDs; ConfirmDialog renders via createPortal; SMS/Voice dispatch respects target_type and oncall_position_offset; delete of in-use teams succeeds.

### Changed

- escalation_step_channels.contact_ids column dropped (migration 144); replaced by junction table.
- contacts.external_id partial unique index added (migration 145).
- Alert toast polling: acknowledged alerts excluded from recent alerts endpoint.
- Escalation rotation-member SMS/Voice dispatch gated on oncall_notify_sms / oncall_notify_voice flags (migration 147).
- All components (Server, Agent, Collector) versioned in lockstep at 2.1.3.

---

## v2.1.1 — April 6, 2026

### New Built-In Reports

- **Alert Intelligence** (7-day and 30-day) — severity breakdown, top noisy nodes, time-to-acknowledge and time-to-resolve metrics.
- **Availability / SLA** (monthly and quarterly) — per-site uptime percentage, downtime, incident count, MTTR, MTBF.
- **Top Offenders** (24-hour and 7-day) — top nodes by CPU, memory, latency, interface errors.

### Linux CPU and Memory Alerts

Built-in alert definitions for Linux nodes added: High CPU Usage (warn 80%, crit 95%) and High Memory Usage (warn 80%, crit 95%) with a 5-minute sustain window. Evaluator queries `linux_cpu_usage_percent` and `linux_memory_usage_percent` scoped to `linux-server` nodes only.

Windows and Linux memory alert warning thresholds lowered from 85% to 80% in built-in definitions.

### Fixes

- NGINX reload (FQDN save, cert upload, ACME issuance, manual reload) no longer causes a 5-second HTTPS outage — service restart now runs asynchronously after the HTTP response is sent.
- Setup wizard step 3 now shows an error toast when the FQDN save fails on a network error instead of silently stalling.
- Top Resources widget no longer returns 500 — removed invalid `deleted_at` column reference from `GetFreshNodeIDs`; canonical `is_active = true` filter is sufficient.
- Discovery jobs stuck in `running` state after a server crash or unclean shutdown are now automatically recovered at startup and marked failed with a descriptive error.
- Discovery scan context now has a 1-hour maximum runtime deadline; scans that hang indefinitely are cancelled and marked failed.
- Collector Failover alert definition no longer fires false positives against non-collector nodes when they go offline — now correctly routed to the collector-scoped evaluator.
- Alert toast ACK/Escalate buttons now show "Alert already resolved" instead of a generic error when the alert resolved before the user could act.

---

## v2.1.0 — April 1, 2026

### Disk Capacity Reporting

New PDF report type showing disk usage trends across monitored nodes with projected full dates via linear regression. Available in the Reports engine with Run Now and scheduled delivery.

### Site Photos

Upload and manage photos for each site — equipment, rack layouts, floor plans. Photos are stored securely, served with authentication, and viewable in a lightbox gallery on the site detail page.

### Site Detail Page

Each site now has a dedicated page with eight tabs: Overview, Dashboard, Nodes, Topology, Racks, Alerts, Reports, and Photos. The Overview tab shows node health, device breakdown, and IPAM networks. An attention strip surfaces degraded, critical, and offline nodes at a glance.

### Node Quick Filters

The Nodes tab includes filter toggles (All / Warning / Critical / Offline / Healthy) with live counts, letting you focus on problem nodes without leaving the site context.

### About Page

Settings → About now shows the running platform version, build information, and open source component attribution.

### Bug Fixes & Polish

- Platform version now correctly reported across all API endpoints
- Homepage layout streamlined — cleaner health ring, reordered right rail, reactive accent bar and ambient glow reflecting node health state
- Report template names normalized
