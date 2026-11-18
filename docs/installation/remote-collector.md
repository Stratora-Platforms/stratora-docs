---
title: Install a Remote Collector
sidebar_label: Remote Collector (Windows)
sidebar_position: 2
---

# Install a Remote Collector

A **Remote Collector** polls the devices at a site that the Stratora server can't reach itself: a branch office, a factory floor, a segmented network. It sends what it collects to the server over HTTPS. See [Collectors](/docs/collection/collectors) for how collectors work.

The Remote Collector installer, `StratoraCollector.msi`, installs two things on the computer:

- the **collector** (`StratoraCollector` and `stratora-collector-telegraf` services);
- a **Stratora Agent** (`StratoraAgent` and `stratora-agent-telegraf` services), which monitors the collector's own computer. Don't install the standalone Windows Agent on this computer as well.

The Stratora server already has a collector of its own. You only need a Remote Collector for networks the server can't reach.

---

## Before you install

| Requirement | Details |
|---|---|
| Operating system | Windows Server 2016, 2019, 2022 and 2025 (64-bit) are supported, and so are 64-bit Windows 10 and 11. This release was tested on Windows Server 2022. |
| Account | A local administrator. |
| Network | Outbound HTTPS (TCP 443) to the Stratora server, and access to the devices it polls (ICMP, SNMP on UDP 161, and the APIs it uses). See [Network](/docs/prerequisites/network). |
| Server version | The same version as the collector. Download the installer from your server (below), so the versions match. |
| Not on the same computer | The standalone Stratora Agent. See [A standalone agent on the same computer](#a-standalone-agent-on-the-same-computer). |

### Create an enrollment token

1. In Stratora, open **Collection → Enrollment**, tab **Enrollment Tokens**, and click **Create Token**.
2. Tick **Multi-use** and allow **at least 2 uses**: the collector uses one, and the agent installed with it uses another.
3. Choose a short expiration, for example 24 hours.
4. Leave **Allow replacing an existing component** off for a new computer. Turn it on only to reinstall a collector that is already enrolled under this computer's name; that token still needs **Multi-use** with at least 2 uses (see [Reinstall or enroll again](#reinstall-or-enroll-again)).
5. Copy the token. It looks like `enroll_<secret>.sha256:<pin>`. **Copy the whole token**, including the part after `.sha256:`: that part lets the collector verify the server from its first connection.

See [Enrollment](/docs/collection/enrollment) for more on tokens.

### Get the installer

Download it from your Stratora server:

- **Collection → Collectors**, then **Deploy Collector**: download the MSI, or copy a ready-made silent install command with your server address and token filled in;
- or `https://<your-stratora-server>/api/v1/downloads/collector/windows`.

It downloads as `StratoraCollector.msi`. The copy your server offers comes from the Server installer, whose checksum you checked when you installed the server.

The releases page also publishes the Collector installer as `StratoraCollector-X.Y.Z.msi`. If you download it from there, check its SHA-256 against the value published in the release notes before you run it:

```powershell
Get-FileHash .\StratoraCollector-X.Y.Z.msi -Algorithm SHA256
```

:::note Unsigned installers
The Stratora installers are not code-signed. Windows shows them as coming from an unknown publisher, and Microsoft Defender SmartScreen or Microsoft Defender Antivirus may warn about them or block them. Before you run an installer, check its SHA-256 checksum against the published value.
:::

---

## Install

**Interactively.** Run the MSI on the collector's computer. The installer asks for:

- **Server URL**: your server's address, for example `https://stratora.example.com`. Use the name the server's certificate covers.
- **Enrollment Token**: the whole token.
- **Collector Name (optional)**: the name shown in Stratora. It defaults to the computer's name.

**Silently.** From a Command Prompt with **Run as administrator**:

```cmd
msiexec /i StratoraCollector.msi /qn /l*v collector-install.log SERVER_URL="https://stratora.example.com" ENROLLMENT_TOKEN="enroll_xxxxx.sha256:xxxxx" COLLECTOR_NAME="Branch Office"
```

| Property | Required | Description |
|---|---|---|
| `SERVER_URL` | Yes | Your Stratora server's address. |
| `ENROLLMENT_TOKEN` | Yes | The whole enrollment token. |
| `COLLECTOR_NAME` | No | The collector's name in Stratora, up to 128 characters. Used when the collector first enrolls; a later reinstall or upgrade keeps the name it has in Stratora. A name with a double quote (`"`), a backslash (`\`), `$`, a tab or a line break stops the install before anything changes. |
| `INSTALLFOLDER` | No | A custom install folder (see below). |
| `COLLECTORDATADIR`, `COLLECTORTELEGRAFDIR`, `AGENTDATADIR`, `AGENTTELEGRAFDIR` | No | Put the collector's or its agent's data or Telegraf folder somewhere else, for example `COLLECTORDATADIR="D:\CollectorData\"`. |

The Collector installer has no site setting. Once the collector is approved, choose it as a site's preferred collector (see [Sites](/docs/infrastructure/sites#preferred-collector)).

The installer's and Deploy Collector's property names (`SERVER_URL`, `ENROLLMENT_TOKEN`) are not the same as the Windows Agent's (`SERVERURL`, `ENROLLTOKEN`).

### Install folder

The default is `C:\Program Files\Stratora`, with the collector in `Collector\` and its agent in `Agent\`.

A custom folder follows the same rules as the Server's (see [Folders the installer refuses](./server.md#folders-the-installer-refuses)): a drive root, the Windows folder, a system folder, a folder in a user profile, a folder whose parent folders a standard user can change, or a folder that already holds something a standard user owns or can change, is refused. The installer gives the folder (and the custom data and Telegraf folders) the permissions Program Files has, before it copies any file, on every install, upgrade and repair. If it can't, the install stops and rolls back. The verbose log (`/l*v`) lists what it did under `Stratora install folder:`. When an upgrade or a repair could only partly restrict the folder, it carries on and writes a warning to the Application event log (source **Stratora**, event ID **4250**).

---

## Approve the collector

A new Remote Collector **waits for an administrator's approval**. Until it is approved, it gets no configuration and no device credentials, and it sends no data. It keeps running and checks with the server about once a minute, so there is nothing to restart.

1. Open **Infrastructure → Nodes**. The collector is listed under **Collectors waiting for approval**, with the node of the agent installed with it. You can also approve it from its card on **Collection → Collectors**.
2. Click **Approve** (or **Reject**). Approving the collector also approves its agent's node, so you decide the pair once.

Only an administrator can approve or reject a collector. Within about a minute of the approval, the collector picks up its configuration and starts collecting.

### Check it

- **Collection → Collectors**: the collector is online and shows its version.
- On the collector's computer, in PowerShell: `Get-Service StratoraCollector, stratora-collector-telegraf, StratoraAgent, stratora-agent-telegraf`. The collector starts its Telegraf service only once it is approved and has verified the server, so a stopped `stratora-collector-telegraf` before the approval is expected.
- The collector's log: `C:\ProgramData\Stratora\Collector\logs\collector.log`.

If the server can't be reached when the collector first starts (for example a short network or DNS problem), the collector keeps trying and enrolls on its own once it can. If the server refuses the token (expired, used up, or not allowed to replace an existing collector), the log says why and the service stops; create a new token and install again with it.

---

## Upgrade

**Upgrade the Stratora server first, then the collector.** A 2.5.3 collector sends nothing until it has verified a 2.5.3 server. The full procedure, with the agents, is in [Upgrading Stratora](/docs/administration/upgrading-stratora).

Download the new `StratoraCollector.msi` from your upgraded server and run it from a Command Prompt with **Run as administrator**:

```cmd
msiexec /i StratoraCollector.msi /qn /l*v collector-upgrade.log
```

- No server URL or token is needed: the upgrade keeps the collector's enrollment, its approval, its name and the configuration the server generated for it.
- It upgrades the agent installed with it too.
- It stays in the folder it is installed in, including a custom folder and custom data and Telegraf folders. Don't pass another `INSTALLFOLDER`: moving a collector during an upgrade isn't supported, and the upgrade stops before changing anything.
- Don't pass a different `COLLECTORTELEGRAFDIR` or `AGENTTELEGRAFDIR` on an upgrade either: removing the old version deletes the old Telegraf folder and everything in it, and the new folder starts with the default configuration.
- A collector installed at a drive root, in the Windows folder or in a system folder is refused on upgrade.
- If the upgrade fails or you cancel it, Windows Installer puts the previous version back, with its configuration and services.
- An upgrade from 2.5.1 or 2.5.2 also works with basic UI (`/qb`), which needs no other input. A double-click works too, but the wizard asks for a Server URL and an Enrollment Token and won't continue without them, although the upgrade doesn't use them.
- On its first start, the upgraded collector stores its API key encrypted for this computer and learns the server's trust key. Until then its Telegraf stays stopped, for a moment.

Running the same MSI again over the same version changes nothing. Going back to an older collector version needs an uninstall and a new install with a new token.

---

## Repair

A repair puts back the collector's and its agent's files and services and restarts them.

- **Programs and Features**: select **Stratora Remote Collector**, then **Repair**.
- Or, with the installed version's MSI: `msiexec /fomus StratoraCollector.msi /l*v collector-repair.log`.

A repair also registers the collector's own agent service again, which fixes a computer where a standalone agent took it over (see below).

---

## Reinstall or enroll again

A collector that is already enrolled under this computer's name is refused by an ordinary token, and the existing collector keeps working. To reinstall it on purpose (for example after rebuilding the computer), uninstall it, create a **multi-use token with at least 2 uses** and **Allow replacing an existing component** (the collector and its agent each use one; with a single-use token the agent is refused), and install again with `SERVER_URL` and that token. The collector keeps its ID, its sites and its nodes.

A collector that an administrator **rejected** cannot enroll again under the same name. Approve it on the Collectors page instead, or delete it there (or revoke it under **Collection → Enrollment**, tab **Registered Components**) and enroll it again. After a delete or revoke it enrolls as a new collector, so choose it again as the preferred collector of its sites and reassign its nodes.

---

## Uninstall

Use **Apps & features** (select **Stratora Remote Collector**), or from a Command Prompt with **Run as administrator**:

```cmd
msiexec /x StratoraCollector.msi /qn /l*v collector-uninstall.log
```

Use the MSI of the installed version.

The uninstall removes the collector and its agent, their services, their configuration (`config.json`, the server-generated `telegraf.conf` and its copies), the device passwords and API key the collector kept in the Windows Credential Manager, and the agent's log files. It removes the folders once they are empty. It does all this only once the uninstall has succeeded: a cancelled or failed uninstall leaves the collector as it was.

The uninstall **keeps** the configuration backups that upgrades write, `%ProgramData%\Stratora\collector-config-backup.json` and `agent-config-backup.json` (readable only by SYSTEM and Administrators). A later install on this computer without `SERVER_URL` and `ENROLLMENT_TOKEN` restores the collector from them. Delete them if you are retiring the computer.

Afterwards, delete the collector in Stratora on **Collection → Collectors**. First choose another preferred collector for every site that uses it.

---

## A standalone agent on the same computer

The Remote Collector's own agent and the standalone Windows Agent use the same Windows services, so only one of them can be on a computer.

- **Installing the standalone agent on a collector's computer is refused** in 2.5.3, with the message "The Stratora Collector on this machine already includes the agent, which monitors this host." The collector's own agent already monitors the computer.
- **Installing a collector where the standalone agent already is** keeps the standalone agent: the collector leaves its own agent out, and the standalone agent goes on monitoring the computer. The collector's upgrades and uninstall leave the standalone agent alone.

Computers that got both under 2.5.2 or earlier need some care when you upgrade. See [Computers that have both a collector and a standalone agent](./windows-agent.md#computers-that-have-both-a-collector-and-a-standalone-agent).

---

## Logs

| What | Where |
|---|---|
| The installer | The file you named with `/l*v` |
| The collector | `C:\ProgramData\Stratora\Collector\logs\collector.log` |
| The collector's agent | `C:\Program Files\Stratora\logs\agent.log`, wherever the collector is installed |
| Installer events | Event Viewer → **Windows Logs → Application**, sources **Stratora** and **MsiInstaller** |
