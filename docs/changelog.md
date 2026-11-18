---
sidebar_label: Changelog
sidebar_position: 110
---

# Changelog

All notable changes to Stratora are listed here, newest first.
For detailed installation instructions see [Getting Started](/docs/getting-started).

## v2.5.3 — [release date — to be set at release]

### Bundled Components
- Server 2.5.3
- Agent 2.5.3 (Windows)
- Agent 2.5.3 (Linux)
- Collector 2.5.3

Stratora 2.5.3 adds **Facility maps**, **power and environment monitoring**, **faster collector failover** and **safer upgrades**, and makes agents and collectors verify the Stratora server's certificate by default. You can upgrade to 2.5.3 from 2.5.1 and 2.5.2. Read the upgrade notes below before you upgrade.

### Highlights

- **Facility maps.** Each site has a new Facility tab. Upload a floor plan, place nodes, racks
  and rooms on it, and see their live status. A floor plan can also be a dashboard panel.
- **Stronger security by default.** Agents and collectors now verify the Stratora server's
  certificate. Their API keys and device passwords are encrypted on disk. A fresh install no
  longer uses `admin`/`admin`.
- **Faster collector failover.** When a remote collector on 2.5.3 stops, its sites move to the
  server's collector after about 3-4 minutes instead of 10-11. Sites on segmented or OT networks
  can turn failover off.
- **Safer upgrades.** A server upgrade checks the database changes before it stops anything. If
  they would fail, the upgrade stops and the old version keeps running. After the upgrade,
  Stratora checks itself and reminds administrators to upgrade collectors and agents.
- **Power and environment monitoring.** New SNMP templates for UPSs, rack PDUs and environmental
  sensors, with built-in alerts. They are built from vendor MIBs and tested against simulated
  devices. They are not yet validated on real hardware.
- **Current bundled components.** PostgreSQL, NGINX, VictoriaMetrics, Telegraf, win-acme, the AWS
  CLI, the VC++ runtime and the Go toolchain are updated to current releases. The WinSW service
  wrapper stays at 2.12.0 (see "Bundled component updates").
- **SHA-256 checksums for every download.** See "Downloads and checksums".

### New features

#### Facility maps
- A **Facility** tab on each site shows a floor plan with the site's nodes and racks and their
  live status, refreshed every 30 seconds.
- Upload a floor plan as PNG or JPEG (up to 25 MB), or import one page of a PDF. The PDF is
  converted in your browser and is never sent to the server.
- **Set scale** calibrates a plan to real distances, so the map shows a scale bar.
- Add buildings, floors and spaces: rooms, network closets, MDFs, IDFs, server rooms and areas.
  A space can have an outline on the plan.
- Racks and spaces can have a photo. A rack without a photo shows a live picture of its
  elevation.
- **Edit layout** works like the dashboard and map builders: drag items onto the plan, then
  **Save**. Undo, Redo and Cancel are there too. If someone else changed the plan meanwhile,
  nothing is overwritten.
- Hover over a marker for a summary card. The card stays fully visible, also in a short browser
  window. Select a marker for a side panel with status, alerts, location, links, power and
  environment readings, and events.
- Viewers can see floor plans, read-only. Editing needs a screen at least 768 px wide.
- Dashboards have a new **Facility Floor Plan** panel. It is read-only.
- Clicking a node on a dashboard topology map, rack panel or map view opens the same node side
  panel instead of leaving the page.

#### Power and environment
- New SNMP templates: UPS (RFC 1628 UPS-MIB), APC Smart-UPS, APC Rack PDU (rPDU2), Environmental
  Sensor (ENTITY-SENSOR-MIB), Eaton UPS (XUPS-MIB), Eaton ePDU (G3/G4), Raritan PX, ServerTech
  Sentry4, APC NetBotz 750/755 and Vertiv Geist Watchdog.
- New built-in alerts for UPS on battery, low battery, low runtime and overload, PDU overload,
  and temperature and humidity out of range.
- These templates are built from the vendor and standard MIBs and tested end to end against
  simulated devices. They are not yet validated on real hardware. The [supported-devices list](/docs/supported-devices)
  shows them as "Code only".

#### Collectors and sites
- **Fail over to the server's collector** is a new site setting. It is on by default. Turn it off
  for sites the server cannot reach, such as segmented or OT networks.
- Rename a collector on the Collectors page.
- The Collectors and Nodes pages show an "Out of date" badge and filter for clients older than
  the server.

#### Upgrades and administration
- After a server upgrade, the first administrator to sign in sees a check page. It confirms the
  new version is running, the database is up to date and collectors and agents report again.
- Administrators then see how many collectors and agents are older than the server, with links
  to them.
- If an upgrade or repair could not fully restrict a custom install folder, administrators see a
  banner, and Diagnostics explains what to do.
- The node page shows how a vCenter or Proxmox certificate is trusted.
- Uploading a server certificate asks for confirmation when a collector or agent older than
  2.5.3 might stop trusting it, and names those clients.
- Permanently deleting a user moves their dashboards, folders and topology maps to the
  administrator who deletes them.

#### Events and API
- Node health changes are recorded as events and can be forwarded by syslog.
- New read API for the event log, and new Facility APIs.

#### Other changes
- The node detail page and node hover cards show every field the Nodes page can show.
- Devices with no status data show grey "Unknown" on racks and topology maps, not green.
- The Alerts page lists the newest activity first.
- SNMP v1/v2c forms recommend SNMPv3 with authentication and privacy.
- "Allow everyone to edit" on a shared dashboard now works. Only the owner or an administrator
  can delete a dashboard or change its sharing.
- Dashboards show who created and last edited them, and every saved edit is audited.
- The empty Integrations page is removed.

### Fixes

This is a selection.

#### Security
These are fixed in 2.5.3.
- The Windows agent and the collector keep their API keys encrypted with Windows DPAPI. Device
  passwords are no longer written into the collector's `telegraf.conf`.
- Agents, collectors and their probes verify the Stratora server's certificate. vCenter and
  Proxmox certificates are verified per credential.
- A fresh install uses a one-time admin password instead of `admin`/`admin`.
- Collectors need administrator approval, like agents.
- The server's encryption keys and installer secrets are readable only by SYSTEM and
  Administrators.
- DNS provider credentials for DNS-01 are no longer stored on disk.
- Audit log and alert history entries can no longer be changed or deleted through the server's
  database login.
- The enrolment endpoint is rate limited.
- The installers no longer use the installing user's environment for steps that run as SYSTEM,
  and refuse unsafe custom install folders.
- The world map's tile proxy verifies the tile server.
- Stratora's own programs are built with Go 1.26.11, which fixes GO-2026-6859.
- Many smaller hardening fixes.

#### Installers and upgrades
- A server upgrade whose database changes would fail now stops before it changes anything.
- A failed server upgrade rolls back to the old server with its services.
- The database step of a server upgrade now works on databases with many tables. Before, it
  could fail with "out of shared memory".
- Stopping the Stratora Web Server service no longer hangs when its pid file or certificate is
  missing, and no longer leaves an nginx.exe process running.
- The Server installer refuses an install folder reached through a junction, symbolic link or
  mounted folder, before it changes anything. Before, upgrading such a server could leave it
  without its data. The message gives the steps to move to a real folder.
- A server upgrade from 2.5.2 or earlier keeps your win-acme settings.
- A Repair of the server no longer leaves it stopped.
- Agent and Collector upgrades from 2.5.1 or 2.5.2 with basic UI or by double-click no longer stop
  at a files-in-use dialog for the tray app.
- A Collector upgrade on a host that also has the standalone Agent no longer leaves that agent
  without its services.
- A Collector upgrade keeps custom Telegraf and data folders.
- Upgrading the Linux agent `.deb` leaves the agent running on the new version.
- A cancelled or failed fresh install of the Remote Collector or the standalone Agent cleans up
  after itself, including the agent's entries in Credential Manager.
- A collector deployed with a site's Deploy Collector wizard now also enrols its bundled agent.
- Uninstalling the Server now also removes the bundled Collector that the Server installed. The
  `data\` folder (database and keys) is still kept. See "Uninstalling the Server".

#### Agents and collectors
- A Windows agent installed or reinstalled on a computer whose node already exists sends metrics
  from the start.
- If the Windows agent, the collector or their Telegraf service crashes, Windows restarts it.
- One node with bad settings no longer breaks a collector's whole configuration.
- A collector going offline no longer marks every node behind it unreachable.
- Aruba Instant access points now show their model and serial number.
- FortiGate nodes show their IPsec VPN tunnels.

#### Alerts and maintenance
- Many false alerts are fixed: after a server or collector pause, a clock step, an agent restart,
  or the first sample after a gap.
- Reachability alerting works above about 440 active nodes.
- Recurring maintenance windows end properly, keep their times on daylight-saving nights, and
  appear in maintenance history.
- Devices that were never reachable now go Offline instead of staying "Discovering".

#### Certificates
- Renewed Let's Encrypt certificates are put into service automatically.
- Stratora renews its own self-signed server certificate before it expires.
- Failed Let's Encrypt renewals back off instead of retrying at once.

#### Data retention
- Changing data retention now changes how long metrics are kept.
- New installations keep 365 days of metrics, matching the page's default.

#### Web interface
- The top-bar status badges are never cut off, and the left menu collapses at phone width.
- Site alert counts match the dashboard and Home.
- A node moved to another site leaves its rack at the old site.
- A user who has ever signed in can now be permanently deleted.

### Bundled component updates

| Component | 2.5.2 | 2.5.3 |
|---|---|---|
| PostgreSQL (Server) | 17.10 | 17.12 |
| NGINX (Server) | 1.30.4 | 1.30.6 (OpenSSL 3.5.9, PCRE2 10.49) |
| VictoriaMetrics (Server) | 1.147.0 | 1.156.0 |
| Telegraf (Collector, Windows Agent) | 1.39.1 | 1.40.3 |
| win-acme (Server) | 2.2.9.1701 | 2.4.1.2444 |
| AWS CLI for Route 53 DNS-01 (Server) | 2.36.2 | 2.40.4 |
| Microsoft VC++ runtime DLLs | 14.44.35211.0 | 14.52.37029.0 |
| Go toolchain (all Stratora programs) | 1.25.12 | 1.26.11 |
| WinSW service wrapper (Server) | 2.12.0 | 2.12.0 (unchanged) |

- PostgreSQL 17.12 is a minor update. The data folder is used as it is, with no dump or restore.
- The recommended Telegraf for the Linux agent's host is now 1.40.3.
- The web interface ships axios 1.20.0, React Router 7.18.4 and follow-redirects 1.16.2.
- WinSW stays at 2.12.0. In our testing, 2.13.0 sometimes did not stop a service cleanly, and
  Windows then restarted it. We will move to a later version once it passes the same test.
- With win-acme 2.4, Stratora always names Let's Encrypt when it orders a certificate. Existing
  ACME accounts, renewals and settings are kept.

### Upgrade notes

#### Before you upgrade
- **Upgrade the server first, then every collector and agent.** Older collectors and agents keep
  working with the 2.5.3 server, but some fixes only arrive with the new versions.
- **Supported upgrades:** you can upgrade to 2.5.3 from the two previous releases, 2.5.1 and
  2.5.2. Both paths were tested. Upgrading straight from an older version is not supported.
- **Windows versions:** Windows Server 2016, 2019, 2022 and 2025 (64-bit) are supported. This
  release was tested on Windows Server 2022.
- **Back up first.** Back up the database and the `data` folder, including the new
  `data\facility-plans` folder once you use Facility maps.
- **Check the download.** Compare each installer's SHA-256 checksum with the published value
  before you run it. See "Downloads and checksums".
- **Install folder through a link:** if your server's install folder, or a folder above it, is a
  junction, symbolic link or mounted folder, the upgrade stops before it changes anything. The
  message names the link and gives the steps to move to a real folder. See "The Server install
  folder is a link or a mounted folder" in the documentation.
- **Owner of the system drive (Route 53 DNS-01 users).** See "Route 53 DNS validation and the
  owner of C:\\" below. You can check the owner before you upgrade.

#### How long it takes
- A normal server upgrade takes about 4-7 minutes until all services run.
- On a server whose database has very many tables, it takes longer: up to about 15 minutes in
  our testing (a database with about 41,000 tables, indexes and sequences). Let the upgrade
  finish.
- The web interface and the API are unavailable for about 2.5 minutes during the upgrade.
- About 2 minutes after the server upgrade, the server's own collector and agent update
  themselves; graphs for the Stratora server itself may show a gap of about 2 minutes.
- In our test upgrades, collectors and agents did not show as Offline at any point.

#### What changes on upgrade
- **One-time admin password.** If the `admin` account still has the never-used `admin`/`admin`
  password, the upgrade replaces it with a one-time password in
  `data\initial-admin-password.txt`. A password you have set is never changed.
- **Certificate verification.** Collectors and agents on 2.5.3 trust the server through its
  server trust key, so a certificate renewal or a new certificate needs nothing on their hosts.
  Collectors and agents older than 2.5.3 still check the server certificate against their
  host's trust store. When you upload a certificate from a private CA, Stratora names any such
  clients and asks you to confirm.
- **Faster failover needs 2.5.3 collectors.** A collector on 2.5.2 or earlier keeps the
  10-minute failover until it is upgraded. Keep the Collector Offline alert enabled until then.
  Any outage over 3 minutes of a 2.5.3 collector, including a planned reboot, now moves its sites
  to the server's collector and back.
- **Alert types for integrations.** VM Timeline Poisoning, New Version Available, Stratora Server
  Certificate Expiring, Server Clock Implausible, Maintenance Release Failing and Collector
  Metrics Stale alerts have their own alert type instead of `node_unreachable`. Update webhook or
  email filters that rely on the old value.
- **Local receivers.** Webhooks, the custom geocoder, OIDC and vCenter or Proxmox checks no longer
  reach addresses on the Stratora server itself. Run such services on another host. SMTP to a
  local relay is unchanged.
- **Map tiles.** If your network inspects outbound HTTPS with its own certificate authority, the
  world map shows blank tiles.
- **Audit log retention** now follows Administration > Data Retention. An upgraded server keeps at
  least 90 days of audit log until you next save that page.
- **Route 53 DNS-01 on a `C:\Stratora` install.** The bundled AWS CLI folder there is refused.
  Install the AWS CLI v2 MSI, then run the provider test. See the [SSL certificates guide](/docs/administration/ssl-tls-certificates).
- **PDUs added as UPS.** Existing nodes keep their device type. To get PDU readings, change such
  a node's type to PDU and its template to APC Rack PDU (rPDU2).
- **Going back to an older collector.** After the upgrade, a 2.5.2 collector cannot read the
  stored key. Reinstalling 2.5.2 needs `SERVER_URL` and `ENROLLMENT_TOKEN`.

#### Route 53 DNS validation and the owner of C:\
- 2.5.3 runs the AWS CLI for Route 53 DNS validation only from a folder that nobody but SYSTEM,
  Administrators and TrustedInstaller can change, and that includes the folders above it. On a
  standard Windows install the root of the system drive (`C:\`) is owned by TrustedInstaller.
- If `C:\` has a different owner, Route 53 DNS validation refuses to run. 2.5.2 did not check
  this, so Route 53 validation that worked before the upgrade can stop after it. The provider
  test and the SSL/TLS page show a message that names the cause and the steps to fix it. Other
  DNS providers are not affected.
- With such an owner, the server can also log an "install folder permissions" warning that
  names `C:\` and its owner.
- To check the owner, run this in PowerShell:

  ```powershell
  (Get-Acl C:\).Owner
  ```

  A standard install shows `NT SERVICE\TrustedInstaller`.

#### Uninstalling the Server
- Uninstalling the Server now also removes the bundled Collector (with its agent) that the Server
  installed. Before, it stayed installed and kept running. A Remote Collector or Stratora Agent
  you installed yourself is not removed, unless the Server's install upgraded it.
- The `data\` folder (database and keys) is still kept, as is `acme-data\`.

#### Upgrading from 2.5.1 or 2.5.2: what the old version leaves
- An upgrade runs the old version's own uninstall steps once. When you upgrade a Remote Collector
  or Agent from 2.5.1 or 2.5.2 by hand, start the installer by double-clicking it or from an
  elevated Command Prompt, not from a PowerShell window.
- A Repair runs the installed version's own installer. Repairing 2.5.2 or older still leaves the
  server stopped until you start its services or reboot.
- A collector backup that a cancelled 2.5.2 upgrade left in clear text is still restored. The next
  upgrade replaces it with an encrypted one.
- A registry copy of the agent key that a 2.5.2 agent left is restricted to SYSTEM and
  Administrators while it is kept.
- Alerts that earlier versions left suppressed after a recurring maintenance window are resolved
  on the first check. If the condition still holds, a new alert is raised with fresh
  notifications.
- On a collector upgraded in place from 2.5.2 where a standalone agent once took over the bundled
  agent's enrolment, the bundled agent may need to be enrolled again. [Upgrading Stratora](/docs/administration/upgrading-stratora) gives the steps.

#### Linux agent
- There is no 2.5.2 Linux agent package: the 2.5.2 release shipped the 2.5.1 packages. Upgrade
  Linux agents from those 2.5.1 packages to 2.5.3 with `apt install ./<package>.deb` or
  `dnf install ./<package>.rpm`.
- After the upgrade, agents report version 2.5.3 and show "Up to date".
- 2.5.3 was tested on Rocky Linux 8, Debian 12 and Ubuntu 24.04.
- Upgrading the `.deb` now keeps the agent running. Upgrading from the 2.5.1 `.deb` restarts the
  enrolled agent and keeps its identity.
- Use `apt purge` for a full removal. `apt remove` keeps `/etc/stratora`, including the agent's
  API key.

### Downloads and checksums

Download the 2.5.3 installers from the [v2.5.3 release page](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.5.3).

SHA-256 checksums are published for every download. Check a file before you run or install it:

- Windows (PowerShell): `Get-FileHash .\<file> -Algorithm SHA256`
- Linux: `sha256sum <file>`

The value must match the table exactly.

| Download | SHA-256 |
|---|---|
| `Stratora-Server-2.5.3.msi` | `[to be filled at release]` |
| `StratoraCollector-2.5.3.msi` | `[to be filled at release]` |
| `StratoraAgent-2.5.3.msi` | `[to be filled at release]` |
| `stratora-agent_2.5.3_amd64.deb` | `[to be filled at release]` |
| `stratora-agent-2.5.3-1.x86_64.rpm` | `[to be filled at release]` |
| `stratora-server-2.5.3.cdx.json` (SBOM) | `[to be filled at release]` |

### Known issues

- **Unsigned installers.** The Stratora installers are not code-signed. Windows shows them as
  coming from an unknown publisher, and Microsoft Defender SmartScreen or Microsoft Defender
  Antivirus may warn about them or block them. Before you run an installer, check its SHA-256
  checksum against the published value (see "Downloads and checksums").
- **Phone dashboards.** On a phone, dashboards keep the desktop grid. Panels are not stacked into
  one column.
- **2.5.2 agent on an existing node.** A 2.5.2 agent installed or reinstalled on a computer whose
  node already exists may send no metrics. Upgrade the agent to 2.5.3, or restart its
  `stratora-agent-telegraf` service. A newly enrolled agent's node must also be approved under
  **Infrastructure > Nodes** before its metrics appear.
- **Cancelled install over an existing agent registration.** A cancelled or failed fresh install
  removes the agent entries it created in Credential Manager. If entries already existed and the
  agent enrolled again during the install, those entries keep the new key after the rollback. An
  administrator can revoke that key under **Collection > Enrollment > Registered Components**:
  select **Revoke** on the agent's row and confirm. The agent must then be enrolled again.
- **Deploy Collector wizard name.** The Deploy Collector wizard asks for a collector name, but
  the collector registers with its computer's hostname. Rename it on the Collectors page.
- **Site photos for viewers.** A viewer sees the upload area on a site's Photos tab. The server
  refuses the upload. Viewers cannot add photos.
- **Bundled VictoriaMetrics and Telegraf.** The vendors' current builds use a Go release that
  is listed for GO-2026-6859. Stratora's own programs are fixed. The bundled VictoriaMetrics
  listens only on the server itself. We will update both when fixed vendor builds are available.

## v2.5.2 — October 11, 2026

### Bundled Components
- Server 2.5.2
- Agent 2.5.2 (Windows)
- Agent 2.5.1 (Linux)
- Collector 2.5.2

Stratora 2.5.2 is a patch release on top of 2.5.1 with three fixes. **Upgrading from 2.4.x? 2.5.2 includes everything in 2.5.0 and 2.5.1.** If you are on 2.4.2 or later, upgrade to 2.5.2.

### Fixed
- **Auto-generated site dashboards are visible again.** Since 2.4.2, the dashboard Stratora generates for each site could be hidden from every user: the Dashboards page listed none under Auto-Generated, and the site's Dashboard tab was empty. This affected every new installation, and every site added after upgrading to 2.4.2 or later. After you upgrade, each site's dashboard appears for all users again; nothing needs to be recreated.
- **Escalation teams can use selected contacts as their only recipients.** Saving a team failed with an error when an email, Slack or Teams notification listed selected contacts but no typed addresses or webhook URL, including from the setup wizard's Alerts step. These teams now save, and notifications go to the contacts' email addresses or webhooks. If none of a notification's selected contacts has the address or webhook it needs, Stratora names those contacts. Editing a team also no longer clears its typed email addresses or its selected contacts.
- **On a new installation, the Stratora server appears as a monitored node without a restart.** The agent bundled with the server tried to register before the first site existed, then stopped trying, so the server didn't appear under Nodes until its Stratora Agent service was restarted. The agent now keeps retrying and registers shortly after the first site is created. Upgrading the server to 2.5.2 updates its own agent. Windows agents on other machines get the same fix by installing the 2.5.2 Agent installer (Collection → Agents → Download Agent MSI); on collector hosts, install the 2.5.2 Collector installer instead.

### Downloads
- Installers: [v2.5.2 release page](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.5.2)
- SHA-256 (Stratora-Server-2.5.2.msi): 3c310a4359182b005a8edf8ad1b24d045eab02759cc2fb43483701d67402b7bb

### Known issues
- **Collector offline can clear existing alerts for its nodes.** Keep the built-in Collector Offline alert enabled; when it fires, treat auto-resolved alerts for that collector's nodes as unconfirmed until the collector is back. A fix is planned for an upcoming release.
- **Let's Encrypt renewal doesn't redeploy the certificate to NGINX.** After each renewal, re-upload the renewed certificate under Administration → SSL / TLS Certificate (full steps in the [2.5.0 notes](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.5.0)).
- **Some status alerts still show raw codes** for certain values (for example RAID status); full labels are coming.
- **FortiGate VPN tunnel panel** can read "No ports found"; under investigation.
- **After a Repair from Programs & Features, start the Stratora services or reboot.** In Services, start every service whose name begins with "Stratora", or run `Get-Service Stratora* | Start-Service`.
- **Hardware status can be wrong when Dell and HPE controllers share a collector.** When Dell iDRAC and HPE iLO devices are monitored by the same collector, a server's hardware status (fans, power supplies, temperature) can be reported incorrectly: healthy components may show as failed, or failures as healthy. Workaround: monitor Dell and HPE management controllers from separate collectors until the fix ships.
- **QNAP memory readings can be wrong when several QNAP devices share a collector.** With two or more QNAP NAS devices monitored by the same collector, memory usage is reported incorrectly and the memory alert cannot fire. Workaround: monitor each QNAP device from a separate collector until the fix ships.

## v2.5.1 — October 7, 2026

### Bundled Components
- Server 2.5.1
- Agent 2.5.1 (Windows)
- Agent 2.5.1 (Linux)
- Collector 2.5.1

Stratora 2.5.1 is a patch release on top of 2.5.0. **Upgrading from 2.4.x? 2.5.1 includes everything in 2.5.0** — the full event stream for syslog/SIEM, the redesigned Home, sites on the map, the new node detail pages, and security and installer hardening. See the [2.5.0 release notes](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.5.0) for the full list. If you are on 2.5.0, upgrade to 2.5.1.

### Fixed
- **The Home page no longer appears blank on a deployment with no monitored nodes yet** — for example right after a fresh install, or after upgrading an empty environment. Every Home panel now shows its empty state.
- **Pages recover from errors instead of going blank.** If a panel or page hits a problem, Stratora shows a recoverable message in its place, and the navigation stays available.
- **The "Setup wizard" button in the Home header is now clearly readable** over the map, matching the time-range and refresh controls beside it.

### Changed
- **The setup wizard now opens automatically only on a brand-new installation.** After an upgrade, or when a user is asked to change their password, Stratora opens Home normally. If setup hasn't been completed, Home shows a "Start setup" or "Continue setup" prompt.

### Known issues (carried forward from 2.5.0)
- **Collector offline can clear existing alerts for its nodes.** Keep the built-in Collector Offline alert enabled; when it fires, treat auto-resolved alerts for that collector's nodes as unconfirmed until the collector is back. A fix is planned for an upcoming release.
- **Let's Encrypt renewal doesn't redeploy the certificate to NGINX.** After each renewal, re-upload the renewed certificate under Administration → SSL / TLS Certificate (full steps in the [2.5.0 notes](https://github.com/Stratora-Platforms/stratora-releases/releases/tag/v2.5.0)).
- **Some status alerts still show raw codes** for certain values (for example RAID status); full labels are coming.
- **FortiGate VPN tunnel panel** can read "No ports found"; under investigation.
- **After a Repair from Programs & Features, start the Stratora services or reboot.** In Services, start every service whose name begins with "Stratora", or run `Get-Service Stratora* | Start-Service`.

## v2.5.0 — October 5, 2026

### Bundled Components
- Server 2.5.0
- Agent 2.5.0 (Windows)
- Agent 2.5.0 (Linux)
- Collector 2.5.0

All four components ship and upgrade together at a single matching version.

Stratora 2.5.0 turns audit-log forwarding into a complete **event stream**, redesigns **Home**, puts your **sites on the map**, and gives every node a cleaner **detail page** — alongside a refreshed look and feel and security and installer hardening.

### Event stream — syslog now forwards everything
- Syslog forwarding now covers **every** Stratora event, not just audit actions: alerts (fired, resolved, acknowledged, muted, suppressed), escalation steps and outcomes, notification delivery attempts and results, security events (authorization denied, failed enrollment, license blocks, rejected webhooks), and system events (shutdown, upgrade, retention purge). Every event carries a stable type, category, and a meaningful severity.
- **Per-destination filtering:** each destination can forward only chosen categories and only events at or above a minimum severity.
- **At-least-once delivery that survives restarts and receiver outages:** events are staged in a transactional outbox and forwarded from a persisted cursor; receivers dedupe on the event id. A new **Lag** column shows each destination's unsent backlog.

### Home, redesigned
- A redesigned Home with KPI history (node states and active-alert totals over time), filled in retroactively on upgrade, and a world map that fits and pans.

### Sites on the map
- Place a site from the site form or the setup wizard — address suggestions as you type, a picker map, or raw coordinates; "Don't show on maps" for sites with no physical place. Adding and editing a site is now a three-step wizard.
- The Sites page shows which sites aren't on maps yet, with counts; **Find locations** places existing sites from their stored address (assisted — nothing is saved until you accept a match).
- Address lookup is configurable (Settings → System): Photon by default, a self-hosted Photon/Nominatim server, or off.

### Node detail and nodes list
- A node's detail page lays its panels out in a responsive grid, with virtualization rosters and Recent Tasks; the nodes list gains a "Degraded or Critical" status filter and multi-status links.

### A refreshed look and feel
- A refreshed visual design across pages, tables, and dialogs — cleaner layouts and more consistent components throughout.
- Status and severity colors are now consistent everywhere: the same color means the same thing on every page, badge, dot, and chart.
- A new **Light mode (Beta)** alongside the default dark theme, plus a **System** option that follows your operating system — choose it from your profile menu. Light mode is still being refined.

### Security
- The backend API now binds to **loopback (127.0.0.1)** instead of all interfaces (fronted through NGINX); upgrades migrate a stale `0.0.0.0` default once, with a durable marker so a deliberate `0.0.0.0` is preserved. Proxy-trust hardening closes forged-header spoofing.
- The app's HTML entry point and static assets now carry the full security-header set (deep links no longer lose them); hashed assets are immutable; missing assets return 404 instead of app HTML.

### Installer and reliability
- Reinstalling over a preserved database no longer leaves the backend unable to start (role-password reconciliation on reinstall).
- The Alerts time-range filter is faster on large alert histories.

### Known issues

**Collector offline can clear existing alerts for its nodes.** If a collector stops reporting while its host is still up, Stratora can mark the nodes' existing metric alerts as resolved. **Workaround:** keep the built-in **Collector Offline** alert enabled and treat any auto-resolved alerts for that collector's nodes as unconfirmed until the collector is back and a fresh collection cycle completes.

**Let's Encrypt renewal does not redeploy the certificate to NGINX.** A renewed certificate is written to the ACME store but not applied automatically. **Workaround — re-upload the renewed certificate:** after each renewal, and before the current certificate expires, take the newest `<domain>-chain.pem` and `<domain>-key.pem` from `C:\Program Files\Stratora\acme-data\certs\`, then in **Administration → SSL / TLS Certificate → Upload Certificate** (format **PEM**) choose `<domain>-chain.pem` as the **Certificate File (.crt, .pem)** and `<domain>-key.pem` as the **Private Key File (.key)** (leave the optional chain field empty), click **Validate Certificate**, then **Upload & Apply**. Stratora installs the certificate and restarts NGINX for you.

**Status-alert value labels (partial).** Status alerts without a numeric value no longer show a raw number; some enumerated status values (for example RAID status) still show the raw code rather than a friendly label. Full labels are coming in an upcoming release.

**FortiGate VPN tunnel panel.** The FortiGate VPN tunnel panel can read "No ports found" due to an incorrect SNMP OID; interface, CPU, and memory monitoring are unaffected. Under investigation.

**After a "Repair", start the Stratora services (or reboot).** Running **Repair** from Programs & Features (or `msiexec /fa`) completes successfully but leaves the Stratora Windows services stopped. To recover, open **Services** and start every service whose name begins with "Stratora" — or reboot the server. (As an Administrator, `Get-Service Stratora* | Start-Service` does the same.) A fix is coming in the next release.

## v2.4.4 — September 11, 2026

### Bundled Components
- Agent 2.4.4 (Windows)
- Agent 2.4.4 (Linux)
- Collector 2.4.4
- PostgreSQL 17.10
- VictoriaMetrics 1.147.0
- NGINX 1.30.4
- Telegraf 1.39.1

Stratora 2.4.4 adds out-of-band server monitoring for Dell iDRAC and HPE iLO, a published per-device compatibility matrix, and five new network and environmental alerts — plus consistency and correctness fixes across memory reporting, the alert builder, and dashboards.

### Out-of-band server monitoring (new)

Monitor Dell iDRAC and HPE iLO service processors over SNMP — server health without an agent on the host or access to the OS. A new **Out-of-Band Management** device category auto-recognizes iDRAC and iLO controllers and builds a full dashboard: overall health rollup, temperature probes (each named by its location — inlet, exhaust, CPU), fans, power supplies and PSU redundancy, physical disks/RAID, and memory modules.

Environmental alerting ships as **built-in alerts keyed on the controller's own health status** (normal / fault), not user-set thresholds — the BMC reports each sensor's own good/bad state, so there is no custom temperature threshold to set on BMC readings, and BMC alerts are not built through the custom alert picker.

Monitoring is over SNMP only. IPMI is a deliberate exclusion for security reasons; Redfish support is on the roadmap.

### Device compatibility matrix

The Supported Devices page now states, per device, how far each template has been validated — real hardware, real-capture replay, or MIB-derived. It is the authoritative answer to "is my device supported, and how confirmed is it": a MIB-derived template was built from vendor documentation and not yet confirmed against physical equipment. Check it before relying on a device class in production.

### New built-in alerts

Five network and environmental alerts ship enabled (they appear in Alert History; assign an escalation team to page on them). Each names the affected component, not just the node:

- **Network Device CPU High** — SNMP switches, firewalls, and access points (Cisco SG300, Palo Alto, Aruba Instant at launch).
- **Access Point Memory High** — worst AP in an Aruba Instant cluster, named.
- **Disk High Temperature** — hottest NAS disk (QNAP, Synology), named.
- **PSU / Fan Failure** and **Fan Stopped** — Synology and QNAP chassis sensors, failed component named.

These fire only on device families validated for each metric; unvalidated families don't fire and are labeled as such rather than showing empty charts. The compatibility matrix (above) is the current list of what's validated.

### Action required — re-check memory alert thresholds (Windows and Linux)

Memory readings are now consistent across platforms: every memory surface (panels, alerts, reports) computes physical RAM in use — (total minus available) over total — on Windows and Linux alike. Thresholds themselves are unchanged; only the underlying reading moved, and it moved in **opposite directions** by platform, so both need a look after upgrading:

- **Linux — readings are now higher, and alerts can fire that didn't before.** The previous Linux figure understated true usage on some distributions (Debian by ~6 points, Ubuntu by ~7). On those nodes memory now reads higher, so a node sitting just under a threshold can cross it on upgrade **with no config change** — a Warning or Critical you didn't have before. Re-check your Linux memory thresholds so the new alerts are ones you actually want.
- **Windows — readings are now lower, and alerts will fire less often.** The previous Windows figure overstated usage by 5–18 points, so some nodes drop from Critical to Warning. If you tuned Windows thresholds against the old (inflated) reading, lower them to preserve the same intent.

### Improvements & fixes

- **Every metric in the custom alert builder now resolves to a live query.** Previously most of the dropdown options referenced metrics the engine couldn't evaluate, so alerts built from them never fired. Every option now maps to a real metric, with clearer names (Response Time in seconds, Disk Busy Time, Interface Errors, Interface Utilization). Existing alerts on renamed metrics are migrated automatically where unambiguous; any that need your review are flagged in the builder.
- **Storage RAID and BMC status now read in words** (e.g. "Fault", "Redundant") instead of raw numbers in dashboard tables.
- **Merging dashboard panels is more predictable.** Combined multi-node panels resolve live at render, so corrections propagate without manual repair; a panel whose source has no data now says so instead of vanishing silently.
- **Device-type labels are consistent** across the app ("Wi-Fi Access Point", "Storage SAN/NAS").
- **Interface Utilization** is now available on access points, firewalls, ESXi hosts, and NAS devices, and ignores implausible vendor-reported link speeds that previously made the reading unusable.

### Known issues

- **Alert text shows a numeric status code for hardware faults.** A fired temperature/fan/PSU alert names the component but renders its status as a number (e.g. "(fan): 2.0") in the alert summary, while the dashboard shows the word ("Fault"). Both built-in and custom alerts are affected. A fix is targeted for an upcoming alerting release.
- **An alert scoped to a whole group, site, or globally may include device types the metric can't measure** — those members simply never fire. (An alert scoped to a single device of the wrong type is now rejected when you save it.) Scope alerts to the device types the metric applies to.
- **FortiGate VPN tunnel panel shows "No ports found."** The VPN tunnel panel specifically does not populate; this does **not** affect the rest of FortiGate monitoring — interfaces, CPU, and memory all work. It is a known issue, pre-existing since a March 2026 release and under investigation, not a regression in 2.4.4.

**Upgrading:** in-place upgrade from v2.4.3. Existing monitored infrastructure, dashboards, and settings are preserved.


## v2.4.3 — August 17, 2026

### Bundled Components
- Agent 2.4.3 (Windows)
- Agent 2.4.3 (Linux)
- Collector 2.4.3
- PostgreSQL 17.10
- VictoriaMetrics 1.147.0
- NGINX 1.30.4
- Telegraf 1.39.1

Stratora 2.4.3 is a security and integrity release that corrects the bundled database version so every install runs the intended, current PostgreSQL 17.10.

### Fixed

- **PostgreSQL 17.10 on every install.** A packaging defect in 2.4.2 left installations running the older PostgreSQL 17.5 even though the release materials stated 17.10 — on both fresh installs and in-place upgrades. 2.4.3 corrects the packaging so the intended 17.10 database is actually shipped and applied on both paths, and adds a build-time check so the bundled database version can no longer silently drift. PostgreSQL 17.6–17.10 carry upstream bug and security fixes; upgrading brings the database current, and your software inventory or security scanner will report PostgreSQL 17.10 afterward. Your data is preserved — the database is stopped cleanly, updated, and brought back on 17.10 automatically, with no manual steps or data migration.

**Upgrading:** in-place upgrade from v2.4.2. Existing monitored infrastructure is preserved, and 2.4.2 installs move to PostgreSQL 17.10 automatically as part of the upgrade.


## v2.4.2 — August 01, 2026

### Bundled Components
- Agent 2.4.2 (Windows)
- Agent 2.4.2 (Linux)
- Collector 2.4.2

Stratora 2.4.2 is a maintenance and hardening release with in-app update awareness, streamlined bug reporting, and dependency currency.

### Added

- **In-app update notifications** — admins see a banner and an About-page indicator when a newer Stratora release is available, with release notes viewable in-app.
- **Report an Issue** — a one-click link from Diagnostics opens a pre-filled GitHub issue with version context (no identifying data), streamlining support requests.
- **Info alert severity** — a new low-severity, non-paging tier for informational alerts.

### Changed

- Bundled runtime components (PostgreSQL, NGINX, VictoriaMetrics, Telegraf, and others) updated to current stable versions, pinned and checksummed, with a published SBOM.
- Security hardening across authentication, licensing, secret storage, and collector configuration.

### Fixed

- **Virtualization** — accurate guest rosters (stable-key enrichment, reaping of removed VMs) and corrected memory reporting for powered-off guests.
- **Alerting** — reliable on-call escalation routing, clearer notification diagnostics, and no false alerts during metric-source disruptions.
- **Scope & counts** — consistent site and fleet node counts, and correct site attribution for virtual machines.
- **Interface & topology** — accurate port counts across switch types, topology layout fixes, dashboard count consistency, and a nav banner display fix.
- **Installer** — reliable installation on clean/minimal Windows Server environments (now bundles the required runtime components).

**Upgrading:** in-place upgrade from v2.4.1 (or v2.2.1). Existing monitored infrastructure is preserved.

## v2.4.1 — July 14, 2026

### Bundled Components
- Agent 2.4.1 (Windows)
- Agent 2.4.1 (Linux)
- Collector 2.4.1

### Fixed

- **Node search returning an error is fixed.** Searching or filtering the node list by name, address, manufacturer, or OS now works correctly. Node search was affected platform-wide in v2.4.0; the base node list was unaffected.

**Upgrading:** in-place upgrade from v2.4.0 (or v2.2.1). No database changes. Existing monitored infrastructure is preserved.

## v2.4.0 — July 14, 2026

### Bundled Components
- Agent 2.4.0 (Windows)
- Agent 2.4.0 (Linux)
- Collector 2.4.0

Virtualization monitoring across your whole stack. Stratora now discovers and monitors VMware vSphere, vCenter, Proxmox VE, and Hyper-V as first-class infrastructure — and folds them into your existing site views automatically. Add a hypervisor through discovery, an IPAM scan, or the setup wizard, and its hosts, VMs, datastores, and virtualization dashboards appear as part of the site's operational context. Whether a site runs VMware, Hyper-V, Proxmox, or all three, Stratora incorporates it automatically.

### What's new

- **vSphere / vCenter / Proxmox VE / Hyper-V discovery and monitoring**, onboarded through any add path (discovery, IPAM scan, setup wizard) with a 30-minute time-to-value.
- **Auto-generated per-platform and site virtualization dashboards** — VMs with run-state, hosts, datastores (with thin-provisioning visibility), vCPU/capacity rollups — created when you add a hypervisor and cleaned up when you remove it.
- **vCenter management-plane node view**: managed ESXi hosts, VMs, and datastores in one place.
- **VM and host status** now use the same at-a-glance indicators as the rest of Stratora.
- **Network topology maps** that lay out cleanly and center on load.

### Reliability & security hardening

- **Capacity and health alerts are preserved during a monitoring-source outage** instead of clearing — you won't lose sight of a filling datastore or a degraded array because a collector blinked.
- **On-call escalations now surface every recipient**, including any that couldn't be reached — no silent gaps in coverage.
- **Tightened credential handling** on collector configuration.

**Upgrading:** in-place upgrade from v2.2.1. Existing monitored infrastructure is preserved.

## v2.2.1 — May 27, 2026

### Fixed

- **Setup Wizard Step 6 (Deploy Agents) now displays the correct Agent
  versions.** The Windows and Linux tab labels previously showed stale
  versions (`v2.1.5` / `v1.2.1`) regardless of which Server release was
  installed. The wizard now sources these labels from the running
  Server build and correctly displays `Windows v2.2.1` / `Linux v2.2.1`
  on this release.

### Added

- The `/api/v1/system/info` API endpoint now returns `agent_windows_version`,
  `agent_linux_version`, and `collector_version` alongside the existing
  server `version` field. Existing API consumers are unaffected — the
  response is a superset of the v2.2.0 payload. This enables future
  surfaces (such as a Bundled Components badge on the Agents or
  Collectors pages) to display the same canonical version data without
  additional API calls.

### Bundled Components

- Agent 2.2.1 (Windows)
- Agent 2.2.1 (Linux)
- Collector 2.2.1

### Upgrade Notes

In-place upgrade from v2.2.0 is supported via the included Server MSI.
No database migrations are introduced. No configuration changes required.

## v2.2.0 — May 24, 2026

### Added

- **Syslog Destinations — audit log forwarding to external SIEM.** Stratora can now
  forward every audit event (sign-ins, configuration changes, alert
  acknowledgments, license operations, and more) to an external syslog
  destination in real time. Configure destinations from **Settings →
  Syslog Destinations** using a 4-step wizard. Supports Splunk, Elastic,
  Graylog, and any RFC-compliant syslog receiver over UDP, TCP, or
  TCP+TLS, in RFC 5424 (modern) or RFC 3164 (legacy) format. See
  [Audit Log Forwarding Overview](/docs/integrations/syslog-destinations/)
  for the full setup walkthrough and per-SIEM integration guides.
- **Three-state passive health classification** (Healthy / Failing /
  Unknown) on every destination, derived from shipping outcomes only.
  Destinations that haven't shipped events recently because the system
  is quiet remain Healthy — health reflects shipping reliability, not
  event volume.
- **Rich health tooltip** surfaces last-shipped time, last-failure
  message, and shipped/dropped counters on hover. Replaces the prior
  browser-default tooltip.
- **Failing-destination banner** at the top of every page when any
  destination is in Failing state. Admin-only; click "View destinations"
  to identify which destination needs attention. Dismissible per page
  view.

### Bundled Components

- Agent 2.2.0 (Windows)
- Agent 2.2.0 (Linux)
- Collector 2.2.0

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
