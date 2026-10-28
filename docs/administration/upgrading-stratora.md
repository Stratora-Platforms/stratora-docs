---
title: Upgrading Stratora
sidebar_label: Upgrading Stratora
sidebar_position: 9
---

# Upgrading Stratora

This page takes you through an in-place upgrade of an existing Stratora deployment, step by step, for every component: the server, remote collectors, and Windows and Linux agents. If you're installing Stratora for the first time, start at [Getting Started](/docs/getting-started) instead.

In short:

1. [Before you upgrade](#before-you-upgrade): check your versions and the upgrade path, take a snapshot of each machine, and plan for a short monitoring gap.
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

A release supports a direct upgrade from the two full releases before it (n-2); pre-releases don't count. Each release's notes name those two versions under **Supported upgrade paths**. If your server is older, upgrade in steps: first to a release that supports a direct upgrade from your version, then onward, until you reach the release you want. All releases are on the [Stratora releases page](https://github.com/Stratora-Platforms/stratora-releases/releases).

At every step, upgrade the server first and then its collectors and agents, as described below.

You can't install an older version over a newer one. Each installer stops with a message such as "A newer version of Stratora Server is already installed."

### Take a snapshot first

**Before you upgrade, take a snapshot or backup of each machine you are about to upgrade**: the Stratora server, and every collector and agent host. Use your virtualization or backup software.

- **Keep each snapshot until you have confirmed that the upgrade succeeded** (see [After the upgrade](#after-the-upgrade)). Then commit or delete it, as your platform requires.
- **If anything goes wrong partway through the upgrade**, for example a power loss, a host failure or an upgrade that can't complete, **restoring that snapshot is the supported way back.**

### Physical servers: copy the config and data folders

Stratora has no built-in backup command. If the Stratora server is a physical machine and you can't take an image backup of it, copy the install folder's `config` and `data` folders while the Stratora services are stopped. The install folder is `C:\Program Files\Stratora` unless you chose another one. `data` holds the database, the metric store and the keys the server uses, so always keep and restore the `data` folder as a whole. A server restored without its own `data` folder needs every collector and agent enrolled again. From PowerShell opened with **Run as administrator**:

```powershell
Get-Service Stratora* | Stop-Service -Force
# Copy C:\Program Files\Stratora\config and C:\Program Files\Stratora\data to your backup location.
Get-Service Stratora* | Start-Service
```

Store the copy where only administrators can read it.

### Plan for a short monitoring gap

While the server upgrades, its backend, web server and database are stopped. During that time the web interface is not available, no new data is stored, and no alerts or notifications go out. Collectors keep metrics in memory for a short time and send them when the server is back. Each collector and agent upgrade also pauses collection on that machine for a moment. Run the upgrade in a maintenance window.

---

## Upgrade order

**Upgrade the server first, then upgrade every collector and agent right away.**

Collectors and agents that are not upgraded yet keep working with the upgraded server, but some fixes and improvements only arrive with the new versions, so do not leave them on the old version.

After the server upgrade, if any collector or agent runs an older version than the server ships, Stratora shows each administrator a summary the next time they open it, with how many there are and links to the **Collectors** and **Nodes** pages filtered to them (`/collectors?version=outdated`, `/nodes?version=outdated`). You can open this summary again at any time from **About**. On both pages, an **Out of date** badge marks each one, and the version filter lists only those.

---

## Upgrade the server

The server is upgraded with the Stratora Server MSI (Windows). The upgrade keeps everything: sites, nodes, collectors and agents and their enrollment, users, dashboards, alerting, certificates and settings. You don't need to run the setup wizard again.

### 1. Download and check the installer

1. Download `Stratora-Server-X.Y.Z.msi` from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases).
2. Check its SHA-256 against the value in the release notes:

   ```powershell
   Get-FileHash .\Stratora-Server-X.Y.Z.msi -Algorithm SHA256
   ```

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
3. **The database is updated and the services start again.** The installer applies the database changes and starts the services. It logs this part in `logs\postinstall.log` in the install folder.
4. **The server's own collector and agent are upgraded.** See [The server's own collector](#the-servers-own-collector).

**If the upgrade fails.** If installing the new version fails, Windows Installer rolls back and puts the previous version back, installed and able to start. If a step fails after the new files are in place, for example while the database is updated, the installer doesn't roll back. It finishes as if it had succeeded: the wizard shows a normal finish and msiexec returns 0. The upgrade has **completed with errors**, and the only signs are:

- the Windows Application event log has an Error from source **Stratora**, event ID **4242**;
- the file `UPGRADE-COMPLETED-WITH-ERRORS.txt` in the install folder names the step that failed and lists the recovery steps;
- `logs\postinstall.log` in the install folder has the details.

Follow the recovery steps in that file. When database changes are still pending, one of them is to run the same installer again. If the steps don't fix it, restore your pre-upgrade snapshot or backup, or contact support.

### 4. Confirm the server upgrade

1. Sign in to Stratora and open **Administration → About**. **Version** shows the new version. If it still shows the old one, reload the page without the cache (Ctrl+Shift+R).
2. In **Services** (`services.msc`), or with `Get-Service Stratora*`, check that StratoraBackend, StratoraNginx, StratoraPostgreSQL and StratoraVictoriaMetrics are **Running**.
3. Check that the install folder has no `UPGRADE-COMPLETED-WITH-ERRORS.txt`.
4. As an administrator, you see the summary of collectors and agents that still run an older version. Upgrade them next.

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

   You don't need a server URL or an enrollment token: the upgrade keeps the collector's configuration and enrollment. The interactive installer asks for both even on an upgrade, so the command line is the simpler way.
3. The collector services (StratoraCollector and stratora-collector-telegraf) restart, so collection from that host pauses for a moment.
4. **The collector's bundled agent upgrades with it.** On a collector host, don't run the Agent installer as well.

If the upgrade fails or you cancel it, Windows Installer puts the previous version back, with its configuration and services.

**Confirm on the Collectors page.** Open **Collection → Collectors**. The collector is online and shows the new version, with no **Out of date** badge. To list only the collectors that still need upgrading, choose **Out of date** in the version filter, or open `/collectors?version=outdated`.

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

   You don't need `SERVERURL` or `ENROLLTOKEN`: the upgrade keeps the agent's enrollment. The interactive installer asks for both even on an upgrade, so the command line is the simpler way. Deployment tools (GPO, SCCM, Intune, PDQ Deploy) can run the same command.
3. The agent services (StratoraAgent and stratora-agent-telegraf) restart, which leaves a short gap in that host's metrics. If the upgrade fails, Windows Installer puts the previous version back.

On a host that runs a Stratora collector, upgrade the collector instead: its installer upgrades the bundled agent. On the Stratora server itself, the agent upgrades with the server.

Going back to an older agent version isn't supported. If you uninstall the agent and then install an older version, that older agent needs a new enrollment token, as on a new host.

### Linux agent: Debian / Ubuntu (`.deb`)

1. Download the package and install it over the current version:

   ```bash
   curl -sko /tmp/stratora-agent.deb https://<your-stratora-server>/api/v1/downloads/agent/linux-deb
   sudo apt install /tmp/stratora-agent.deb
   ```

   `sudo dpkg -i /tmp/stratora-agent.deb` does the same.
2. Start the agent again. A `.deb` upgrade stops the agent and leaves it stopped:

   ```bash
   sudo systemctl restart stratora-agent
   ```

### Linux agent: RHEL / Rocky / Alma (`.rpm`)

1. Download the package and install it over the current version:

   ```bash
   curl -sko /tmp/stratora-agent.rpm https://<your-stratora-server>/api/v1/downloads/agent/linux-rpm
   sudo dnf install /tmp/stratora-agent.rpm
   ```

   `sudo rpm -U /tmp/stratora-agent.rpm` does the same.
2. An `.rpm` upgrade restarts a running agent by itself. If the agent was not running, start it with `sudo systemctl restart stratora-agent`.

On both, the package keeps `/etc/stratora/agent.json`, owned by the `stratora` user with mode `0600`. Check the agent with `systemctl status stratora-agent`.

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
