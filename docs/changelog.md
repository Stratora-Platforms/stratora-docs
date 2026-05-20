---
sidebar_label: Changelog
sidebar_position: 110
---

# Changelog

All notable changes to Stratora are listed here, newest first.
For detailed installation instructions see [Getting Started](/docs/getting-started).

## v2.1.16 — May 18, 2026

### Fixed

- **Agent-enrolled hosts now receive network-path probing from their
  site's preferred collector.** When you install the Stratora Agent
  on a host and approve it (either manually from the approval queue
  or automatically via a bootstrap enrollment token), Stratora now
  assigns the host to the site's preferred collector for ICMP
  reachability monitoring. Previously, agent-enrolled hosts showed
  "-" in the Response and Collector columns of the Nodes UI because
  no probe assignment was created. The agent's own OS metrics (CPU,
  memory, disk, services, uptime) were unaffected — only the
  collector-observed network metrics were missing. Routine version
  upgrades preserve existing collector assignments unchanged.

### Bundled Components
- Agent 2.1.16 (Windows)
- Agent 2.1.16 (Linux)
- Collector 2.1.16

## v2.1.15 — May 16, 2026

### Fixed

- **Agent and Collector uninstallers now clean configuration files.**
  Uninstalling the Stratora Agent or Stratora Collector with
  `msiexec /x` (or via Add/Remove Programs) now correctly removes
  the agent's `config.json` and runtime log files, ensuring a
  subsequent fresh install starts from a clean state. Previously,
  these files persisted on disk after uninstall, which could cause
  a subsequent fresh install to silently drop the enrollment token
  passed at install time, leaving the agent unable to connect.
  Routine version upgrades continue to preserve existing
  configuration — unchanged from v2.1.14.

### Bundled Components
- Agent 2.1.15 (Windows)
- Agent 2.1.15 (Linux)
- Collector 2.1.15

## v2.1.14 — May 15, 2026

### Fixed

- **Agent registration site assignment.** Agents enrolling on a
  Stratora server now correctly inherit the site assignment from
  the IPAM subnet they live on. Previously, when more than one
  site existed, an agent installed without an explicit site
  override could be assigned to the wrong site (alphabetically-
  first by site name), requiring manual reassignment after
  enrollment. Customers on single-site deployments, and customers
  who passed an explicit site override during agent install, were
  unaffected. This is the agent-side parallel of the Setup Wizard
  fix shipped in v2.1.13.

## v2.1.13 — May 15, 2026

### Fixed

- **Setup Wizard device-to-site assignment.** Devices discovered by the
  wizard now correctly inherit the site assignment from the IPAM
  subnet they live on. Previously, when more than one site existed,
  the wizard could assign discovered devices to the wrong site
  (alphabetically-first by site name), requiring manual reassignment
  after wizard completion.
- **Per-site node counts on the Home dashboard.** Empty sites
  (with no nodes assigned) now correctly show a total of 0.
  Previously, empty sites could display a total of 1 with no
  matching nodes in any status category — a cosmetic count
  discrepancy with no underlying data issue.

### Bundled Components
- Agent 2.1.13 (Windows)
- Agent 2.1.13 (Linux)
- Collector 2.1.13

## v2.1.12 — May 14, 2026

### What's new

**Outbound notification delivery tracking.** SMS and voice alerts
now show a live delivery state in the Alert Detail view's
Dispatches panel: each notification appears as `Sent`, `Delivered`,
or `Undelivered`, and undelivered messages surface the carrier's
error code and explanation in place. This closes a class of silent
failures where Stratora's UI would mark an alert dispatch as
successful (the message was accepted by the carrier), but the
recipient never actually received it — most commonly seen on US
Twilio accounts that have not yet completed A2P 10DLC carrier
registration, where the message is silently dropped at the
carrier level and the recipient sees nothing. With v2.1.12, this
shows up immediately in the Alert Detail view so on-call responders
and operators can diagnose without digging through Twilio logs.

The delivery-state check runs outbound from your Stratora server
and does not require any public webhook endpoint, so it works in
on-prem and air-gapped-style deployments without additional
network configuration.

### Fixed

- **License page now visible to all roles authorized to view it.**
  Previously, the `/license` page enforced an admin-only check at
  the route level even though Operator and Viewer roles are
  authorized to view license details. Operators and Viewers can
  now reach the page; license upload and removal remain admin-only.
- **Alert summary formatting.** Threshold values, current values,
  and units in alert summaries now render consistently across the
  in-app Alert Detail view, the Alert Configuration list, the
  Dashboard gauges, and the email / Slack / Teams notification
  bodies. No more mixed precision or missing unit suffixes between
  the in-app surface and the notification body for the same alert.
- **Setup Wizard step counter.** The "Step N of M" indicator in
  the Setup Wizard now matches the actual step count.
- **World Map pin count.** The summary text alongside the World
  Map view now matches the actual count of pinned sites displayed
  on the map.
- **License page first-load reliability.** Resolves a rare
  client-side rendering error that could appear on a slow license
  fetch at first load. The page now loads reliably under any
  load timing.
- **Linux Agent rpm upgrade reliability.** Linux Agent upgrades
  installed via `rpm` (Rocky, RHEL, Alma) now restart the agent
  service automatically as part of the upgrade. Previously, the
  new agent binary was placed on disk during the rpm upgrade but
  the running service continued executing the previous binary
  until the host was rebooted or the service was manually
  restarted. Debian/Ubuntu hosts using `.deb` packages were
  unaffected.

### Upgrading

This is a routine point release with no breaking changes from
v2.1.11. Standard upgrade path:

1. Install `Stratora-Server-2.1.12.msi` on your Stratora server.
2. Upgrade agents on your hosts as scheduled:
   - Windows hosts: `StratoraAgent-2.1.12.msi`
   - Linux hosts (Debian/Ubuntu): `stratora-agent_2.1.12_amd64.deb`
   - Linux hosts (RHEL/Rocky/Alma): `stratora-agent-2.1.12-1.x86_64.rpm`
3. Collector hosts: install `StratoraCollector-2.1.12.msi`. The
   bundled agent on a collector host is upgraded as part of the
   Collector MSI — do not install `StratoraAgent-2.1.12.msi`
   separately on a collector host.

### Bundled Components

- Agent 2.1.12 (Windows)
- Agent 2.1.12 (Linux)
- Collector 2.1.12

---

## v2.1.10 / v2.1.11 — May 11–12, 2026

### Security

**Agent endpoint authentication.** Heartbeat and status endpoints now require authenticated agent components. Previously, requests to these endpoints were accepted from any caller knowing a node identifier — a value that appears in admin URLs, notification payloads, and audit logs and is not designed to be confidential. The previous behavior could allow an attacker to suppress reachability alerts, modify node identity fields, or discover internal system endpoints. 2.1.10 closes this gap by requiring agents to authenticate every heartbeat and status request.

This is a security fix. We recommend upgrading promptly.

**v2.1.11 follow-up (May 12, 2026).** A subsequent v2.1.11 release improves upgrade reliability for collector hosts running the bundled agent. Under the v2.1.10 upgrade path, the bundled agent on a collector host could lose its enrollment state during a Collector MSI upgrade and need to re-enroll manually. v2.1.11 closes this gap so the bundled agent's enrollment survives upgrades transparently. **v2.1.11 is the recommended starting point for new deployments and for upgrades from 2.1.9.x or earlier.**

### What's new

**Active-hours suppression on Time-Based escalation schedules.** Alerts firing outside a team's configured active hours are tracked but not dispatched. When the active window opens, dispatch resumes from the existing step — no rewind, no skip.

**Voice notifications use inline TwiML.** Voice alert calls no longer make an outbound fetch for call instructions, which removes a public DNS dependency and simplifies on-premises deployments.

**Hostname pronunciation in voice announcements.** Voice alerts now announce node identifiers character-by-character (e.g., "D-E-V-zero-one" instead of "devzeroone"), so on-call responders can write them down without replaying the message.

**Mobile phone field on contact records.** Contacts can now record both a primary phone and a mobile phone, separately addressable for SMS and voice routing.

**Per-rotation-member phone source selection.** Schedule tab now exposes per-member control over which phone number a given rotation member should be reached on (primary, mobile, or an override).

**Target-type-aware Slack, Teams, and Email dispatch.** Alert channel dispatch now selects the correct delivery shape based on the target type, so the same alert flows correctly to a Slack channel webhook, a Teams workflow, or an email distribution list.

**Multi-channel test dispatch.** The "Test alert" flow now exercises all configured channels (SMS, voice, email, chat) for an escalation team in a single test, with per-channel result reporting.

**Warning badge for alerts with no escalation team.** Built-in and custom alerts that haven't been assigned to an escalation team now surface a visible warning in the Alerts UI, so the assignment gap is discoverable before an incident.

**Rotation correctness improvements.** Schedule rotation handoffs now respect a 20-second grace window during on-call pill transitions, eliminating a class of spurious "on-call swap" alerts at handoff time.

**Per-rotation-member test SMS and voice.** Each rotation member on an escalation team's schedule now has dedicated test SMS and test voice buttons, with result feedback per member rather than per team.

### Fixed

- Collector failover incorrectly mutated agent and HTTP node target types under retry storms.
- User setting writes intermittently corrupted JSON values stored in the user_settings table.
- Test alert dispatch now flows through the same engine as production alerts, so test results reflect real production behavior.
- Invalid license files are now rejected with a clear error rather than silently falling back to a degraded license tier.
- License expiry now uses wall-clock time consistently across the platform.
- Built-in alerts cannot be edited or deleted, with the UI reflecting the locked state correctly.
- Customer-visible queries now exclude test and system nodes, preventing internal test data from appearing in customer dashboards.
- Escalation step repeat intervals are now honored correctly — alerts re-dispatch on the configured cadence, not the default.
- Current on-call display now correctly reflects schedule handoff windows.
- Audit log entries now capture the authenticated user for actions taken through the API.
- The condition operator picker is now a single control, replacing the previous two-dropdown design that allowed inconsistent state.
- The Test Alert modal now uses the same wizard pattern as the rest of the application.

### Upgrading

**This release contains a breaking change for agent communication.** After upgrading the Stratora server, agents running pre-2.1.10 builds will no longer be able to send heartbeats. They must be upgraded to 2.1.11 (Windows or Linux) before they can resume reporting.

Recommended upgrade order:

1. Install the new Stratora server (`Stratora-Server-2.1.11.msi`). The server will start enforcing the new authentication requirement immediately.
2. Expect existing agents to start showing as `Agent heartbeat lost` in the Alerts view. This is the expected operational signal that enforcement is active.
3. Roll out the new agent installers to your hosts:
   - Windows hosts: `StratoraAgent-2.1.11.msi`
   - Linux hosts (Debian/Ubuntu): `stratora-agent_2.1.11_amd64.deb`
   - Linux hosts (RHEL/Rocky/Alma): `stratora-agent-2.1.11-1.x86_64.rpm`
4. Collector hosts: install `StratoraCollector-2.1.11.msi`. The Collector MSI also includes the bundled agent for that host; do not install `StratoraAgent-2.1.11.msi` separately on a collector host.
5. As each agent upgrades, the `Agent heartbeat lost` alert for that host will auto-resolve within one heartbeat cycle (approximately 10 seconds).

The 2.1.10 server includes a database migration that runs automatically on first startup. The migration backfills internal data required by the new authentication check. No manual operator action is required for the migration itself.

**Linux Agent version numbering.** Starting with this release, the Linux Agent version moves to the same number as the Server, Windows Agent, and Collector. The Linux Agent jumps from 1.2.2 directly to 2.1.11 — this is an intentional version realignment for lockstep clarity, not a major rewrite. Functionally, Linux Agent 2.1.11 is a successor to 1.2.2 and the upgrade path is a normal `dpkg`/`rpm` upgrade (no epoch declaration needed).

### Bundled Components

- Stratora Server 2.1.11
- Stratora Agent 2.1.11 (Windows)
- Stratora Agent 2.1.11 (Linux)
- Stratora Collector 2.1.11

---

## v2.1.9.2 — April 23, 2026

### Bundled Components
- Agent 2.1.9.2 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.9.2

### Fixed
- **Escalation Teams page failed to load on tenants with rotation teams** — a `pgx` v5 scan-plan gap caused the Escalation Teams page, alert configuration modal, onboarding wizard Alerts step, and on-call status API to error on any tenant whose escalation teams had a non-null rotation start date. Fixed at the database layer; wire format unchanged, no migration required.

---

## v2.1.9.1 — April 20, 2026

### Bundled Components
- Agent 2.1.9.1 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.9.1

### Fixed
- Agent auto-enrollment uses the server's configured FQDN. Agents deployed from the agent install page and collectors deployed from the collector install modal now consistently use the server's configured FQDN for their connection URL, matching the setup wizard's Deploy Agents step. Administrators accessing the server UI from different URLs (by hostname, IP, or FQDN) will always get the correct install command.
- Collector failover correctly identifies the local collector. On first startup after upgrade, the server flags its bundled local collector as the fallback target for the collector failover mechanism, so sites whose preferred collector becomes unreachable will automatically fail over to the local collector as designed.
- Node detail view reflects current collector assignment. The node edit dialog and node detail pages now consistently display the currently-assigned collector for each node.

### Operator Notes
- In-place MSI upgrade from v2.1.9 or earlier. No database migration required.
- Agents stuck in a Disconnected state from a v2.1.9 install that used the wrong server URL can be re-enrolled by re-running the MSI install from the agents page.

---

## v2.1.9 — April 19, 2026

### Bundled Components
- Agent 2.1.9 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.9

### Fixed
- Tray indicator starts automatically for all users. The Stratora tray indicator now launches for every interactive Windows user at logon after agent or collector installation, using a per-machine startup registration. Previous releases used a single-user registration path that left the indicator invisible on multi-admin servers.
- Orphan registry values cleaned up on upgrade. Upgrading from a prior release automatically removes the leftover registry values created by the previous single-user registration path.
- Single-instance guard on the tray indicator. If a host carries a legacy per-user auto-start entry alongside the new per-machine entry during the upgrade window, the tray indicator deduplicates within a logon session so users see exactly one icon.

### Operator Notes
- In-place MSI upgrade from v2.1.8 or earlier. Users will see the tray indicator on their next logon.
- The `-install-startup` and `-uninstall-startup` flags have been removed from `stratora-tray.exe`; auto-start registration is handled by the MSI installer. Remove any scripted invocations of those flags.

---

## v2.1.8 — April 17, 2026

### Bundled Components
- Agent 2.1.6 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.6

### Fixed
- Auto-generated topology maps now stay in sync with the site's live node set. Removing, rejecting, deactivating, or moving a node previously left an orphan element on the map; map reconciliation now adds new elements and prunes stale ones in a single pass.
- Three node-creation paths — discovery single import, discovery bulk import, and agent self-enrollment — now correctly fire the topology auto-generation chain. Before this release, bulk-importing discovered devices into a fresh site produced no topology map until a manual edit triggered regeneration.
- Deleting or rejecting a node now removes its element from the topology map. Moving a node between sites now prunes it from the old site's map.

### Changed
- Topology maps now cascade-delete with their site. Removing a site automatically removes the auto-generated map associated with it; user-created maps are preserved even if their parent site is deleted.
- On first startup of v2.1.8, every site with nodes is reconciled once to clean up element drift accumulated under the previous additive-only behavior. Idempotent and safe to re-run on subsequent restarts.

### Operator Notes
- The first 2.1.8 startup will clean accumulated orphan elements from auto-generated maps. User-edited maps are not touched.
- The schema change runs automatically on first 2.1.8 startup — no manual database intervention required.

---

## v2.1.7 — April 17, 2026

### Bundled Components
- Agent 2.1.6 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.6

### Fixed
- Fresh installs now correctly auto-generate the Network Topology panel on the default site's dashboard. Previous builds rendered "No map selected" on freshly-deployed servers because the default-site setup path bypassed the topology auto-generation hooks. Existing dashboards stuck in this state self-repair on the next page load — no manual action required.
- Site and node operations (create, edit, approve, bulk move) now generate the topology map before the dashboard so the dashboard panel always sees the live map. A timing race between the two background jobs in prior releases could occasionally leave the panel with no map linked even when the map existed.
- Dashboards that were persisted with an empty Network Topology panel from earlier builds now self-heal on read — the next time you load the dashboard, the panel renders the correct map.

### Changed
- Auto-generated topology map IDs are now deterministic. Deleting and regenerating an auto-map reuses the same ID, so dashboards that reference it continue to work without manual repair. Previously, regeneration produced a fresh random ID and any dashboard referencing the old ID became a dangling pointer.

---

## v2.1.6 — April 16, 2026

### Bundled Components
- Agent 2.1.6 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.6

### Added
- Node stabilization lifecycle — newly-created nodes receive a 5-minute stabilization window during which alert evaluation is skipped and the node is excluded from the system-wide health score. Prevents false alerts and health score dips immediately after discovery imports or agent enrollment.
- "Agent Not Reporting" alert — fires when an agent node completes stabilization but has never checked in. Resolves automatically when the first heartbeat arrives.
- Audit log events for the node stabilization lifecycle (stabilization started, stabilization completed).
- "Stabilizing" visual state in node list, node detail, site nodes, topology maps, and dashboard panels.

### Changed
- The alert evaluator's stabilization check is now a single helper driven by the node's `stabilization_until` timestamp instead of four copy-pasted grace-period blocks. Behavior is unchanged for customers; this is internal consolidation that prevents future drift between evaluators.
- Server MSI now supports in-place upgrades. The installer detects upgrade scenarios and preserves database credentials, SSL certificates, and service registrations across the upgrade. Services are stopped automatically before binary replacement.
- Fresh installs without a legacy collectors table no longer fail during initial schema setup.

### Known Issues
- Users upgrading from v2.1.5 may see a files-in-use dialog during installation. Click OK to continue — no reboot is required. This dialog will not appear on future upgrades (v2.1.6+).

---

## v2.1.5 — April 15, 2026

### Bundled Components
- Agent 2.1.5 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.5

### Fixed
- Device templates now install to the correct path on fresh deployments. The previous installer staged template files at the wrong filesystem location, which silently disabled SNMP polling for 10 of 12 supported node types. Reinstalling or upgrading to v2.1.5+ resolves the issue automatically — no manual intervention required.
- SNMP fallback now reads the node's assigned credential from the encrypted credential vault instead of defaulting to the `public` community string. Nodes without a matching device template resolve their credential through the same secure path as template-based nodes.

---

## v2.1.4 — April 15, 2026

### Bundled Components
- Agent 2.1.4 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.4

### Fixed
- The setup page now redirects to the login screen as expected after fresh-install initialization. Previous releases left the setup page hanging on "Getting things ready..." because a browser security policy blocked the inline initialization script. The script was moved to a properly-served file so the redirect fires reliably.

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
- Audit log entries are now tamper-resistant — direct database edits to `audit_logs` are blocked at the database layer, and retention cleanup runs through a controlled administrative function only.

### Escalation Teams

- Slack, Teams, and Email contact references now persist correctly on team save (previously, repeated edits could lose contact assignments under specific edge cases).
- Live on-call preview banner in rotation schedule showing current position holder and next shift handoff time.
- Drag-and-drop reordering for rotation members (with keyboard-accessible fallback).
- Save-time configuration warnings when rotation members lack phone/email for targeted channels.
- Dispatch-time audit log entries when SMS/Voice notifications are skipped due to missing phone numbers.
- SMS/Voice targeting chips (On-Call #1, All Members, Specific contacts) now fully honored by backend dispatch.
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

- Internal storage shape for contact-to-channel assignments was modernized to fix the persistence regression noted above. No user-visible API change.
- Acknowledged alerts no longer reappear in the alert-toast polling stream.
- Rotation-member SMS / Voice dispatch is now gated on the per-member `Notify by SMS` and `Notify by Voice` toggles, so silencing one channel for a specific member no longer requires removing the channel from the entire team.
- All shipping components (Server, Agent, Collector) are versioned in lockstep starting with this release.

---

## v2.1.2 — April 12, 2026

### Bundled Components
- Agent 2.1.3 (Windows)
- Agent 1.2.1 (Linux)
- Collector 2.1.2

### Added

- **DHCP Scope Utilization for Windows DHCP servers** — Windows agents on hosts running the DHCP Server role now collect per-scope utilization metrics. Windows Server node detail pages display a Scope Utilization table showing scope name, addresses in use, free, reserved, pending, total, and percent utilization with warning / critical color coding.
- **Two new built-in alert definitions** — DHCP Scope High Utilization (warning at 80% utilization) and DHCP Scope Exhaustion (critical at 90% utilization).

### Fixed

- Agent and Telegraf services auto-start after MSI upgrade with no manual intervention required.
- Agent enrolled credentials (API key, node ID) are preserved across MSI upgrades — no re-enrollment required.
- Telegraf now runs as a single managed service, eliminating a duplicate-process bug that could stop metrics from flowing after upgrade.
- Resolved a race condition between agent startup and service installation that occasionally left Telegraf environment variables unwritten on first attempt.

---

## v2.1.1 — April 6, 2026

### New Built-In Reports

- **Alert Intelligence** (7-day and 30-day) — severity breakdown, top noisy nodes, time-to-acknowledge and time-to-resolve metrics.
- **Availability / SLA** (monthly and quarterly) — per-site uptime percentage, downtime, incident count, MTTR, MTBF.
- **Top Offenders** (24-hour and 7-day) — top nodes by CPU, memory, latency, interface errors.

### Linux CPU and Memory Alerts

Built-in alert definitions for Linux nodes added: High CPU Usage (warn 80%, crit 95%) and High Memory Usage (warn 80%, crit 95%) with a 5-minute sustain window. These built-ins evaluate against Linux-server nodes only — Windows nodes don't false-positive on them.

Windows and Linux memory alert warning thresholds lowered from 85% to 80% in built-in definitions.

### Fixes

- NGINX reload (FQDN save, cert upload, ACME issuance, manual reload) no longer causes a 5-second HTTPS outage — service restart now runs asynchronously after the HTTP response is sent.
- Setup wizard step 3 now shows an error toast when the FQDN save fails on a network error instead of silently stalling.
- Top Resources widget no longer returns 500. The internal query referenced a column that no longer exists; the canonical "active node" filter is now used directly.
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
