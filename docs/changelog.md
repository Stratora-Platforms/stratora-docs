---
sidebar_label: Changelog
sidebar_position: 2
---

# Changelog

All notable changes to Stratora are listed here, newest first.
For detailed installation instructions see [Getting Started](/docs/getting-started).

---

## Agent v2.1.2 — April 11, 2026

Windows agent point release. Server and Collector are unchanged at 2.1.0.

### DHCP Scope Utilization

The Stratora Agent now collects per-scope DHCP utilization metrics on Windows
servers running the DHCP Server role. A bundled PowerShell collector
(`dhcp_scopes.ps1`) invokes `Get-DhcpServerv4ScopeStatistics` every 5 minutes
and emits one series per scope.

- **Node detail page** — new **DHCP Scope Utilization** table on Windows
  Server nodes showing Scope Name, Scope ID, In Use, Free, Reserved, Pending,
  Total, and % Used with a color-coded utilization column (green &lt; 75%,
  yellow 75–89%, red ≥ 90%).
- **Alerts** — two new built-in definitions:
  - **DHCP Scope High Utilization** — warning at 80%, critical at 90%
  - **DHCP Scope Exhaustion** — critical at 90%
- **Zero impact on non-DHCP hosts** — the collector script exits silently
  when the `DhcpServer` PowerShell module is not installed, so the same
  agent MSI is safe to deploy to every Windows server regardless of role.

### Upgrade

Redeploy `StratoraAgent-2.1.2.msi` over the existing install on any Windows
server running DHCP. Configuration and enrolled component credentials are
preserved — no re-enrollment required. After upgrade, wait one 5-minute
collection interval for scope metrics to appear on the node detail page.

Download: [v2.1.2 release](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.1.2)

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
