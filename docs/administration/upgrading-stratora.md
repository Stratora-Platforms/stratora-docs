---
title: Upgrading Stratora
sidebar_label: Upgrading Stratora
sidebar_position: 9
---

# Upgrading Stratora

This page takes you through an in-place upgrade of an existing Stratora deployment, step by step, for every component: the server, remote collectors, and Windows and Linux agents. If you're installing Stratora for the first time, start at [Getting Started](/docs/getting-started) instead.

In short:

1. [Before you upgrade](#before-you-upgrade): check your versions and the upgrade path, take a snapshot of each machine, and plan for a short monitoring gap. For an upgrade to 2.5.3, also read [What changes when you upgrade to 2.5.3](#what-changes-when-you-upgrade-to-253).
2. [Upgrade the server](#upgrade-the-server).
3. Right after that, [upgrade every collector](#upgrade-the-collectors) and [every agent](#upgrade-the-agents).
4. [After the upgrade](#after-the-upgrade): confirm that nothing is left on an older version, then commit or delete the snapshots.

---

## Before you upgrade

### Check your current versions

Write down what you run now, so you can confirm each upgrade afterwards.

| Component | Where to look |
|-----------|---------------|
| Server | **Administration → About**, the **Version** row under **Platform Info**. |
| Collectors | **Collection → Collectors**. Each collector card shows its version. In the table view, turn on the **Version** column. |
| Agents | **Infrastructure → Nodes**. Turn on the **Agent Version** column, or open **Filters** and use **Agent Version**. |

The server installer carries the collector and agent installers for the same release. The [Changelog](/docs/changelog) lists their versions for each release under **Bundled Components**. The Linux agent can have its own version number: when a release doesn't change it, the Linux agent keeps its earlier version.

### Check the supported upgrade path

A release supports a direct upgrade from the two full releases before it (n-2); pre-releases don't count. Starting with 2.5.3, each release's notes name those two versions under **Supported upgrade paths**. Stratora 2.5.3 upgrades directly from **2.5.2** and **2.5.1**. If your server is older, upgrade in steps: first to a release that supports a direct upgrade from your version, then onward, until you reach the release you want. All releases are on the [Stratora releases page](https://github.com/Stratora-Platforms/stratora-releases/releases).

At every step, upgrade the server first and then its collectors and agents, as described below.

You can't install an older version over a newer one. Each installer stops with a message such as "A newer version of Stratora Server is already installed."

### Check the Windows version

Windows Server 2016, 2019, 2022 and 2025 (64-bit) are supported. Remote collectors and Windows agents are also supported on 64-bit Windows 10 and 11. This release was tested on Windows Server 2022.

### Take a snapshot first

**Before you upgrade, take a snapshot or backup of each machine you are about to upgrade**: the Stratora server, and every collector and agent host. Use your virtualization or backup software.

- **Keep each snapshot until you have confirmed that the upgrade succeeded** (see [After the upgrade](#after-the-upgrade)). Then commit or delete it, as your platform requires.
- **If anything goes wrong partway through the upgrade**, for example a power loss, a host failure or an upgrade that can't complete, **restoring that snapshot is the supported way back.**

Back up the database and the `data` folder in any case. Once you use Facility maps, `data` also holds the `data\facility-plans` folder with your uploaded floor plans.

### Physical servers: copy the config and data folders

Stratora has no built-in backup command. If the Stratora server is a physical machine and you can't take an image backup of it, copy the install folder's `config` and `data` folders while the Stratora services are stopped. The install folder is `C:\Program Files\Stratora` unless you chose another one. `data` holds the database, the metric store and the keys the server uses, so always keep and restore the `data` folder as a whole. A server restored without its own `data` folder needs every collector and agent enrolled again. From PowerShell opened with **Run as administrator**:

```powershell
Get-Service Stratora* | Stop-Service -Force
# Copy C:\Program Files\Stratora\config and C:\Program Files\Stratora\data to your backup location.
Get-Service Stratora* | Start-Service
```

Store the copy where only administrators can read it.

### Plan for a short monitoring gap

While the server upgrades, its backend, web server and database are stopped. During that time the web interface is not available, no new data is stored, and no alerts or notifications go out. Collectors buffer a limited amount of data while the server is unavailable. Each collector and agent upgrade also pauses collection on that machine for a moment. Run the upgrade in a maintenance window.

How long the 2.5.3 server upgrade takes:

- A normal server upgrade takes about 4-7 minutes until all services run.
- On a server whose database has very many tables, it takes longer: up to about 15 minutes in our testing (a database with about 41,000 tables, indexes and sequences). Let the upgrade finish.
- The first upgrade to 2.5.3 also checks every file in the `data` folder, which takes longer on a server with many files (see [What happens during the upgrade](#3-what-happens-during-the-upgrade)).
- The web interface and the API are unavailable for about 2.5 minutes during the upgrade.
- About 2 minutes after the server upgrade, the server's own collector and agent update themselves; graphs for the Stratora server itself may show a gap of about 2 minutes.
- In our test upgrades, collectors and agents did not show as Offline at any point.

---

## Upgrade order

**Upgrade the server first, then upgrade every collector and agent right away.**

Collectors and agents that are not upgraded yet keep working with the upgraded server, but some fixes and improvements only arrive with the new versions, so do not leave them on the old version.

**Never upgrade a collector or agent before its server.** From 2.5.3, collectors and agents verify the server through its server trust key. An upgraded collector or agent learns that key from a 2.5.3 server on its first start, and until it has, it sends nothing and keeps its Telegraf service stopped. With a server that is still on 2.5.2 or older, it would stay that way.

After the server upgrade, if any collector or agent runs an older version than the server ships, Stratora shows each administrator a summary the next time they open it, with how many there are and links to the **Collectors** and **Nodes** pages filtered to them (`/collectors?version=outdated`, `/nodes?version=outdated`). You can open this summary again at any time from **About**. On both pages, an **Out of date** badge marks each one, and the version filter lists only those.

---

## What changes when you upgrade to 2.5.3

Read this before you upgrade a 2.5.1 or 2.5.2 deployment to 2.5.3.

### One-time admin password

If the `admin` account still has the never-used `admin`/`admin` password, the upgrade replaces it with a one-time password in `data\initial-admin-password.txt` in the install folder. A password you have set is never changed.

### Certificate verification

Collectors and agents on 2.5.3 trust the server through its server trust key, so a certificate renewal or a new certificate needs nothing on their hosts. Collectors and agents older than 2.5.3 still check the server certificate against their host's trust store. When you upload a certificate from a private CA, Stratora names any such clients and asks you to confirm. See [SSL/TLS Certificates](./ssl-tls-certificates.md).

### Faster failover needs 2.5.3 collectors

When a remote collector on 2.5.3 stops, its sites move to the server's collector after about 3-4 minutes instead of 10-11. A collector on 2.5.2 or earlier keeps the 10-minute failover until it is upgraded. **Keep the Collector Offline alert enabled until then.**

Any outage over 3 minutes of a 2.5.3 collector, including a planned reboot, now moves its sites to the server's collector and back. Sites on segmented or OT networks that the server cannot reach can turn failover off with the site setting **Fail over to the server's collector** (see [Sites](../infrastructure/sites.md)).

### Alert types for integrations

VM Timeline Poisoning, New Version Available, Stratora Server Certificate Expiring, Server Clock Implausible, Maintenance Release Failing and Collector Metrics Stale alerts have their own alert type instead of `node_unreachable`. Update webhook or email filters that rely on the old value. Alerts opened before the upgrade keep `node_unreachable` until they resolve, and past alerts are not relabelled.

### Local receivers

Webhooks, the custom geocoder, OIDC and vCenter or Proxmox checks no longer reach addresses on the Stratora server itself. Run such services on another host. Private network addresses keep working, and SMTP to a local relay is unchanged.

### Map tiles

If your network inspects outbound HTTPS with its own certificate authority, the world map shows blank tiles.

### Audit log retention

The audit log now follows **Administration → Data Retention**. An upgraded server keeps at least 90 days of audit log until you next save that page. See [Audit Logs](./audit-logs.md).

### Route 53 DNS validation and the owner of C:\

2.5.3 runs the AWS CLI for Route 53 DNS validation only from a folder that nobody but SYSTEM, Administrators and TrustedInstaller can change, and that includes the folders above it. Other DNS providers are not affected.

- **On a `C:\Stratora` install**, the bundled AWS CLI folder is refused. Install the AWS CLI v2 MSI, then run the provider test.
- **The owner of `C:\`.** On a standard Windows install the root of the system drive is owned by TrustedInstaller. If `C:\` has a different owner, Route 53 DNS validation refuses to run. 2.5.2 did not check this, so Route 53 validation that worked before the upgrade can stop after it. The provider test and the SSL/TLS page show a message that names the cause and the steps to fix it. With such an owner, the server can also log an "install folder permissions" warning that names `C:\` and its owner.

You can check the owner before you upgrade. In PowerShell:

```powershell
(Get-Acl C:\).Owner
```

A standard install shows `NT SERVICE\TrustedInstaller`. See [SSL/TLS Certificates](./ssl-tls-certificates.md) for the Route 53 setup.

### Install folder through a link

If your server's install folder, or a folder above it, is a junction, symbolic link or mounted folder, the upgrade stops before it changes anything. The message names the link and gives the steps to move to a real folder.

### PDUs added as UPS

Existing nodes keep their device type. To get PDU readings from a PDU that was added as a UPS, change the node's type to PDU and its template to APC Rack PDU (rPDU2).

### Upgraded collectors stay approved

A collector that was enrolled before the upgrade keeps its approval and keeps collecting. From 2.5.3, a remote collector that you install **new** waits for an administrator's approval before it collects, and approving it also approves the agent installed with it. Approve it under **Infrastructure → Nodes**, or from its card on **Collection → Collectors**. See [Collectors](../collection/collectors.md).

### Going back to an older collector

After the upgrade, a 2.5.2 collector cannot read the stored key. Reinstalling 2.5.2 needs `SERVER_URL` and `ENROLLMENT_TOKEN`.

### What 2.5.1 and 2.5.2 leave behind

- An upgrade runs the old version's own uninstall steps once. When you upgrade a Remote Collector or Agent from 2.5.1 or 2.5.2 by hand, **start the installer by double-clicking it or from an elevated Command Prompt, not from a PowerShell window.**
- A Repair runs the installed version's own installer. Repairing 2.5.2 or older still leaves the server stopped until you start its services or reboot.
- A collector backup that a cancelled 2.5.2 upgrade left in clear text is still restored. The next upgrade replaces it with an encrypted one.
- A registry copy of the agent key that a 2.5.2 agent left is restricted to SYSTEM and Administrators while it is kept.
- Alerts that earlier versions left suppressed after a recurring maintenance window are resolved on the first check. If the condition still holds, a new alert is raised with fresh notifications.
- On a collector upgraded in place from 2.5.2 where a standalone agent once took over the bundled agent's enrollment, the bundled agent may need to be enrolled again. Create an enrollment token that allows replacing an existing component. Then, as administrator, run `stratora-agent.exe -reenroll <token> -config <folder>\config.json` in the collector's `Agent` folder, and restart the `StratoraAgent` service.

### Uninstalling the server

Uninstalling the Server now also removes the bundled Collector (with its agent) that the Server installed. A Remote Collector or Stratora Agent you installed yourself is not removed, unless the Server's install upgraded it. The `data\` folder (database and keys) is still kept, as is `acme-data\`.

---

## Upgrade the server

The server is upgraded with the Stratora Server MSI (Windows). The upgrade keeps everything: sites, nodes, collectors and agents and their enrollment, users, dashboards, alerting, certificates and settings. You don't need to run the setup wizard again.

### 1. Download and check the installer

1. Download `Stratora-Server-X.Y.Z.msi` from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases).
2. Check its SHA-256 against the value published in the release notes. The value must match exactly:

   ```powershell
   Get-FileHash .\Stratora-Server-X.Y.Z.msi -Algorithm SHA256
   ```

   The Stratora installers are not code-signed. Windows shows them as coming from an unknown publisher, and Microsoft Defender SmartScreen or Microsoft Defender Antivirus may warn about them or block them. Check the checksum before you run an installer.

### 2. Run the installer

Run it on the Stratora server, in either of these ways.

**By double-click.** Double-click the MSI, accept the Windows User Account Control (UAC) prompt, and follow the wizard.

**From the command line.** Open a command prompt with **Run as administrator**, then run one of these:

```cmd
:: Progress bar only
msiexec /i Stratora-Server-X.Y.Z.msi /qb /norestart /l*v upgrade.log

:: Fully silent
msiexec /i Stratora-Server-X.Y.Z.msi /qn /norestart /l*v upgrade.log
```

`/l*v upgrade.log` writes a detailed installer log. Keep it until you have confirmed the upgrade.

You don't need to give the install folder. The installer finds the folder the current version is installed in and upgrades it there, whatever the folder is called, including a name with characters such as `&`, `'` or `!`. Moving the server to another folder during an upgrade isn't supported: if you pass an `INSTALLFOLDER` that is not the current folder, the installer stops before changing anything and names the folder to use. If it can't find the current folder, it also stops before changing anything and shows the command to run with `INSTALLFOLDER` set to that folder.

### 3. What happens during the upgrade

1. **The pre-upgrade database check.** Before anything is stopped or changed, the installer tests that the new version's database changes apply to your database. The progress window shows "Checking that the new version's database changes apply to the installed database". This can take a few minutes. The check runs the same way whether you double-click the installer or run it from the command line.
   - If a database change would fail, the installer stops with an error **before changing anything**. Your current version stays installed and keeps running. The Windows Application event log has an Error from source **Stratora**, event ID **4243**, that names the change that failed, and the installer log has the same details. Send both to support.
   - If the check can't run at all, the upgrade goes ahead without it, and the installer writes a Warning, event ID **4244**.
2. **The services stop and the files are replaced.** The installer stops StratoraBackend, StratoraNginx and StratoraPostgreSQL and installs the new version. StratoraVictoriaMetrics (the metric store) keeps running; the installer restarts it afterwards when the release ships a new version of it.
3. **The install folder and the `data` folder are checked.** The installer sets the permissions of the install folder and of each folder in `data` again. On the first upgrade to 2.5.3 it also checks every folder and file in `data` (their owners and permissions) and takes back anything another account owns or can open. **On a large server this can take several minutes**: the time grows with the number of files in `data`, and in testing about 37,000 files took 4 to 5 minutes. The server is still down for the upgrade while this runs, and the metric store (StratoraVictoriaMetrics) is stopped for the check and started again right after it, so the check makes the monitoring gap that much longer. Later upgrades only check the folders themselves, which takes seconds. Anything the check had to take back is reported as an install folder warning: in the installer log, as a Windows Application event from source **Stratora** with event ID **4250**, and to administrators in a banner and on **Administration → Diagnostics**.
4. **The database is updated and the services start again.** The installer applies the database changes and starts the services. It logs this part in `logs\postinstall.log` in the install folder.
   - **PostgreSQL moves to 17.12 by itself.** Stratora 2.5.3 bundles PostgreSQL 17.12 (2.5.1 and 2.5.2 bundled 17.10). It is a minor release of the same version: the database files are used as they are, with no dump and restore, and the installer restarts PostgreSQL on the new version. There is nothing to do.
5. **The server's own collector and agent are upgraded.** See [The server's own collector](#the-servers-own-collector).

**If the upgrade fails.** If installing the new version fails, Windows Installer rolls back and puts the previous version back, installed and able to start. If a step fails after the new files are in place, for example while the database is updated, the installer doesn't roll back. It finishes as if it had succeeded: the wizard shows a normal finish and msiexec returns 0. The upgrade has **completed with errors**, and the only signs are:

- the Windows Application event log has an Error from source **Stratora**, event ID **4242**;
- the file `UPGRADE-COMPLETED-WITH-ERRORS.txt` in the install folder names the step that failed and lists the recovery steps;
- `logs\postinstall.log` in the install folder has the details.

Follow the recovery steps in that file. They restart the services one by one and check that the backend answers. If database changes are still pending, the file gives the command that applies them; running the installer again does not apply them. If the steps don't fix it, restore your pre-upgrade snapshot or backup, or contact support.

### 4. Confirm the server upgrade

1. Sign in to Stratora as an administrator. The first time an administrator opens Stratora on the new version, a check page opens. It waits for the backend, database, metric store and web server, confirms that the new version runs with every database change applied and without `UPGRADE-COMPLETED-WITH-ERRORS.txt`, and shows whether the server's collector, the remote collectors and the agents report again. When everything passes it continues by itself; a failed check says what to do. **Continue** is always there, and the checks stop after 3 minutes. Operators and viewers never see this page.
2. Open **Administration → About**. **Version** shows the new version. If it still shows the old one, reload the page without the cache (Ctrl+Shift+R).
3. In **Services** (`services.msc`), or with `Get-Service Stratora*`, check that StratoraBackend, StratoraNginx, StratoraPostgreSQL and StratoraVictoriaMetrics are **Running**.
4. Check that the install folder has no `UPGRADE-COMPLETED-WITH-ERRORS.txt`.
5. As an administrator, you see the summary of collectors and agents that still run an older version. Upgrade them next.

---

## Upgrade the collectors

### The server's own collector

The collector that runs on the Stratora server itself, with the agent that monitors the server, is part of the server installer. You don't upgrade it separately. When the new server version ships a newer collector, the server installer schedules the collector upgrade, which runs by itself shortly after the server installer finishes. Its log is `logs\collector-install.log` in the server's install folder. Confirm it on the **Collectors** page as described below.

### Remote collectors (Windows MSI)

Upgrade each remote collector on its own host, after the server.

1. **Download the collector installer from your upgraded server.** In **Collection → Collectors**, click **Deploy Collector** and download the installer, or download it from `https://<your-stratora-server>/api/v1/downloads/collector/windows`. It downloads as `StratoraCollector.msi`. The server offers the collector version it ships, so download it again after each server upgrade.
2. **Run it on the collector host** from a command prompt opened with **Run as administrator**:

   ```cmd
   msiexec /i StratoraCollector.msi /qn /l*v collector-upgrade.log
   ```

   You don't need a server URL or an enrollment token: the upgrade keeps the collector's configuration and enrollment. The interactive installer asks for both even on an upgrade, so the command line is the simpler way. The upgrade stays in the collector's install folder, including a custom folder and custom data and Telegraf folders; don't pass `INSTALLFOLDER` or another data or Telegraf folder, because moving a collector during an upgrade isn't supported. An upgrade from 2.5.1 or 2.5.2 also works with basic UI (`/qb`) or a double-click. Start it by double-clicking or from an elevated Command Prompt, not from a PowerShell window.

   To check the installer against the published SHA-256 value, download `StratoraCollector-X.Y.Z.msi` from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases) and run `Get-FileHash .\StratoraCollector-X.Y.Z.msi -Algorithm SHA256`.
3. The collector services (StratoraCollector and stratora-collector-telegraf) restart, so collection from that host pauses for a moment.
4. **The collector's bundled agent upgrades with it.** On a collector host, don't run the Agent installer as well.

If the upgrade fails or you cancel it, Windows Installer puts the previous version back, with its configuration and services.

**Confirm on the Collectors page.** Open **Collection → Collectors**. The collector is online and shows the new version, with no **Out of date** badge. To list only the collectors that still need upgrading, choose **Out of date** in the version filter, or open `/collectors?version=outdated`.

**On its first start**, the upgraded collector stores its API key encrypted for that computer and learns the server's trust key. Until then its Telegraf service stays stopped, for a moment. Going back to an older collector version needs an uninstall and a new install with a new enrollment token.

**A collector host that also has the standalone Windows Agent.** Up to 2.5.2, the standalone agent could be installed on a computer that also ran a Remote Collector with its own agent. Upgrading the collector keeps the standalone agent working, and from then on the collector has no agent of its own. If you want the collector's own agent to monitor that computer instead, **uninstall the standalone agent before you upgrade the collector**. The Windows Agent installation guide (in the **Installation** section) covers both paths, and when the collector's agent must be enrolled again with `-reenroll`.

---

## Upgrade the agents

An upgraded agent keeps its configuration and enrollment. It does not enroll again, and it keeps its node in Stratora. Download the agent installers from your **upgraded** server, so that you get the version it ships: from **Collection → Agents**, or from these addresses.

| Installer | Download address |
|-----------|------------------|
| Windows MSI | `https://<your-stratora-server>/api/v1/downloads/agent/windows` |
| Linux `.deb` (Debian, Ubuntu) | `https://<your-stratora-server>/api/v1/downloads/agent/linux-deb` |
| Linux `.rpm` (RHEL, Rocky, Alma) | `https://<your-stratora-server>/api/v1/downloads/agent/linux-rpm` |

### Windows agent (MSI)

1. Download the installer from **Collection → Agents** (**Download Agent MSI**) or from the address above.
2. Run it on the host from a command prompt opened with **Run as administrator**:

   ```cmd
   msiexec /i StratoraAgent.msi /qn /l*v agent-upgrade.log
   ```

   You don't need `SERVERURL` or `ENROLLTOKEN`: the upgrade keeps the agent's enrollment. The interactive installer asks for both even on an upgrade, so the command line is the simpler way. Deployment tools (GPO, SCCM, Intune, PDQ Deploy) can run the same command. When you upgrade from 2.5.1 or 2.5.2 by hand, start the installer from an elevated Command Prompt or by double-clicking it, not from a PowerShell window.

   To check the installer against the published SHA-256 value, download `StratoraAgent-X.Y.Z.msi` from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases) and run `Get-FileHash .\StratoraAgent-X.Y.Z.msi -Algorithm SHA256`.
3. The agent services (StratoraAgent and stratora-agent-telegraf) restart, which leaves a short gap in that host's metrics. On its first start, the upgraded agent stores its key in a protected form and learns the server's trust key; its Telegraf service stays stopped until then. If the upgrade fails, Windows Installer puts the previous version back. An upgrade from 2.5.1 or 2.5.2 also works with basic UI (`/qb`) or a double-click: the installer closes the tray icon first.

On a host that runs a Stratora collector, upgrade the collector instead: its installer upgrades the bundled agent. On the Stratora server itself, the agent upgrades with the server.

:::warning Known issue: a 2.5.2 Windows agent installed on an existing node
A 2.5.2 agent installed or reinstalled on a computer whose node already exists may send no metrics. Upgrade the agent to 2.5.3, or restart its `stratora-agent-telegraf` service (in **Services**, **Stratora Agent Telegraf**, or `Restart-Service stratora-agent-telegraf` from PowerShell opened with **Run as administrator**). A 2.5.3 agent does not have this problem.
:::

A newly enrolled agent's node must be approved under **Infrastructure → Nodes** before its metrics appear. An upgraded agent keeps its node and its approval. See [Nodes → Approval Workflow](../infrastructure/nodes.md#approval-workflow).

Going back to an older agent version isn't supported. If you uninstall the agent and then install an older version, that older agent needs a new enrollment token, as on a new host.

### Linux agent: Debian / Ubuntu (`.deb`)

1. Download the package and install it over the current version:

   ```bash
   curl -sko /tmp/stratora-agent.deb https://<your-stratora-server>/api/v1/downloads/agent/linux-deb
   sudo apt install /tmp/stratora-agent.deb
   ```

   `sudo dpkg -i /tmp/stratora-agent.deb` does the same.
2. The package restarts the agent on the new version by itself. From 2.5.3, a `.deb` upgrade restarts a running agent, and starts an enrolled agent that the older package stopped during the upgrade (2.5.1 and 2.5.2 packages did that). An agent that has not enrolled yet stays stopped.

   **An agent you turned off stays off.** When `stratora-agent` is masked, or disabled before an upgrade from 2.5.3 or later, the upgrade doesn't enable it, and doesn't start it if it is stopped; a disabled agent that is still running is restarted on the new version. Packages before 2.5.3 disabled the agent themselves during every upgrade, so an upgrade from them enables the service again. To run a stopped agent: `sudo systemctl unmask stratora-agent` (if masked), then `sudo systemctl enable --now stratora-agent`.

### Linux agent: RHEL / Rocky / Alma (`.rpm`)

1. Download the package and install it over the current version:

   ```bash
   curl -sko /tmp/stratora-agent.rpm https://<your-stratora-server>/api/v1/downloads/agent/linux-rpm
   sudo dnf install /tmp/stratora-agent.rpm
   ```

   `sudo rpm -U /tmp/stratora-agent.rpm` does the same.
2. An `.rpm` upgrade restarts a running agent by itself. If the agent was not running, start it with `sudo systemctl restart stratora-agent`. The `.rpm` enables the service on every install and upgrade, so if you keep the agent disabled, disable it again afterwards.

On both, the package keeps `/etc/stratora/agent.json`, owned by the `stratora` user with mode `0600`. Check the agent with `systemctl status stratora-agent`.

There is no 2.5.2 Linux agent package: Stratora 2.5.2 servers shipped the 2.5.1 Linux packages, so a Linux agent installed from a 2.5.2 server runs 2.5.1. It upgrades to 2.5.3 the same way. After the upgrade, agents report version 2.5.3 and show "Up to date". Stratora 2.5.3 was tested on Rocky Linux 8, Debian 12 and Ubuntu 24.04.

To check a package downloaded from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases) against the published SHA-256 value, run `sha256sum <file>`.

For a full removal on Debian or Ubuntu, use `sudo apt purge stratora-agent`. `apt remove` keeps `/etc/stratora`, including the agent's API key.

In these commands, `curl -k` skips certificate verification for the download only. Leave it out if the host trusts your server's certificate.

### Confirm on the Nodes page

Open **Infrastructure → Nodes**. The agent reports its version with every heartbeat, so the new version appears within seconds. To list only the nodes whose agent still needs upgrading, open **Filters** and set **Agent Version Status** to **Out of date**, or open `/nodes?version=outdated`. The **Agent Version** column then appears next to the host name, and an **Out of date** badge marks each agent that is still on an older version.

---

## After the upgrade

### Check that nothing is out of date

- **The upgrade reminder.** After a server upgrade, if at least one collector or agent runs an older version than the server ships, each administrator sees a summary the next time they open Stratora, titled "Upgrade your collectors and agents". It shows how many collectors and agents run an older version than the server ships, and the latest versions. **Review collectors** and **Review nodes** open the two pages filtered to them. Once you close it, it doesn't come back for that server version.
- **Open it again from About.** **Administration → About** has a **Collectors and agents** row that shows how many need upgrading. Select it to open the summary again.
- **The Out of date badge and filter.** On **Collection → Collectors** and **Infrastructure → Nodes**, an **Out of date** badge marks each collector and agent on an older version, and the version filter lists only those. The Collectors page also shows how many are out of date under the total.

The upgrade is complete when both filtered pages are empty and the **About** row says the collectors and agents are up to date.

**Then commit or delete the pre-upgrade snapshots.** Once the server, every collector and every agent check out, you no longer need the snapshots you took in [Take a snapshot first](#take-a-snapshot-first). Commit or delete them, as your platform requires.

A collector or agent that hasn't reported a version yet, or that runs a development build, is not counted as out of date.

### If something failed

| What you see | What to do |
|--------------|------------|
| The server installer stopped with an error before changing anything | Look in the Windows Application event log for source **Stratora**, event ID **4243**, and in the installer log. The current version is still installed and running. Contact support. |
| The server upgrade **completed with errors** | Follow the recovery steps in `UPGRADE-COMPLETED-WITH-ERRORS.txt` in the install folder. Event ID **4242** has the same text. |
| A Stratora service isn't running | In **Services**, start every service whose name begins with "Stratora", or run `Get-Service Stratora* \| Start-Service` from PowerShell opened with **Run as administrator**. If one stops again, check its log (below) and the Windows Application event log. |
| **About** still shows the old version | Reload the page without the cache (Ctrl+Shift+R). If it still shows the old version, check that StratoraBackend is running. |
| The web interface doesn't load after the upgrade | Check that StratoraNginx is running, that your browser still trusts the server's certificate, and that nothing else uses port 443. |
| A collector stays offline or out of date | Check the collector log on its host and the installer log you wrote with `/l*v`, then run the collector installer again. |
| A Windows agent's node gets no metrics after a 2.5.2 agent was installed or reinstalled on it | Upgrade the agent to 2.5.3, or restart the `stratora-agent-telegraf` service. |
| A new agent or collector sends no data | Its node or collector is waiting for approval. Approve it under **Infrastructure → Nodes**; a collector can also be approved from its card on **Collection → Collectors**. |
| Route 53 DNS validation stopped after the upgrade | Read the message on the SSL/TLS page or in the provider test. On a `C:\Stratora` install, install the AWS CLI v2 MSI. Check the owner of `C:\` with `(Get-Acl C:\).Owner`. See [Route 53 DNS validation and the owner of C:\](#route-53-dns-validation-and-the-owner-of-c). |
| A webhook, geocoder or identity provider that runs on the Stratora server itself stopped working | 2.5.3 no longer sends these requests to the server's own addresses. Run the service on another host. |
| A Linux agent doesn't come back | Run `sudo systemctl restart stratora-agent`, then check `systemctl status stratora-agent` and `journalctl -u stratora-agent`. |

### Where the logs are

`<install folder>` is the server's install folder, `C:\Program Files\Stratora` by default.

| Component | Log |
|-----------|-----|
| Server installer | The file you named with `/l*v` |
| Server upgrade steps (database, services) | `<install folder>\logs\postinstall.log` |
| Server services | `<install folder>\logs` (backend, database and metric store), `<install folder>\nginx\logs` (web server) |
| The server's own collector upgrade | `<install folder>\logs\collector-install.log` |
| Server upgrade events | Event Viewer → **Windows Logs → Application**, source **Stratora**: 4242 (upgrade completed with errors), 4243 (the pre-upgrade check found a database change that fails), 4244 (the pre-upgrade check could not run) |
| Collector | `C:\ProgramData\Stratora\Collector\logs\collector.log` on the collector host |
| Windows agent | `C:\Program Files\Stratora\logs\agent.log` on the host |
| Linux agent | `journalctl -u stratora-agent` |

To send logs to support, download a support bundle from [Diagnostics](./diagnostics.md).

## See also

- [Agents](../collection/agents.md): installing and configuring agents
- [Collectors](../collection/collectors.md): deploying remote collectors
- [Architecture](/docs/architecture): how the server, agents and collectors fit together
- [Changelog](/docs/changelog): what's new in each release, and the bundled collector and agent versions
