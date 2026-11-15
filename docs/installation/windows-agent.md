---
title: Install the Windows Agent
sidebar_label: Windows Agent
sidebar_position: 3
---

# Install the Windows Agent

The **Stratora Agent** runs on a Windows server or PC and sends that computer's metrics (CPU, memory, disk, network, services, and the roles it runs) to the Stratora server. See [Agents](/docs/collection/agents) for what it collects.

The agent installer is `StratoraAgent.msi`. It installs:

- `StratoraAgent`, the agent service;
- `stratora-agent-telegraf`, the Telegraf service that collects and sends the metrics;
- `stratora-tray.exe`, a tray icon for every signed-in user that shows the agent's status.

**You don't need this installer on the Stratora server or on a Remote Collector's computer.** Both already have an agent: the server installs one for itself, and the Remote Collector installs one with the collector.

---

## Before you install

| Requirement | Details |
|---|---|
| Operating system | 64-bit Windows 10 or 11, or Windows Server 2016 or later. Stratora 2.5.3 was tested on Windows Server 2022. The installer allows Windows Server 2016 and 2019 and Windows 10 and 11, but they were not tested with this release. |
| Account | A local administrator. |
| Network | Outbound HTTPS (TCP 443) to the Stratora server. The agent never listens on a port and doesn't use a proxy. |
| Reachability | Allow inbound ICMP Echo Request, or the node looks unreachable. See [Windows hosts](/docs/prerequisites/windows-hosts). |
| Server version | Upgrade the server before its agents. Download the installer from your server (below), so the versions match. |

### Create an enrollment token

1. In Stratora, open **Collection → Enrollment**, tab **Enrollment Tokens**, and click **Create Token**. You can also create one on **Collection → Agents**.
2. For one computer, a single-use token is enough. For a batch, tick **Multi-use** and set **Max uses** to the number of computers.
3. Choose a short expiration.
4. Leave **Allow replacing an existing component** off, unless you are reinstalling an agent on a computer that is already enrolled (see [Reinstall or enroll again](#reinstall-or-enroll-again)).
5. Copy the token. It looks like `enroll_<secret>.sha256:<pin>`. **Copy the whole token**, including the part after `.sha256:`: that part lets the agent verify the server from its first connection.

### Get the installer

From your Stratora server: **Collection → Agents**, **Download Agent MSI**, or `https://<your-stratora-server>/api/v1/downloads/agent/windows`. It downloads as `StratoraAgent.msi`. The Agents page also shows a ready-made install command with your server address and token filled in.

---

## Install

**Interactively.** Run the MSI and enter the **Server URL** (for example `https://stratora.example.com`, the name the server's certificate covers) and the **Enrollment Token**. You can change the install folder on the folder page.

**Silently**, for one computer or through a deployment tool (GPO, SCCM, Intune, PDQ Deploy). From a Command Prompt with **Run as administrator**:

```cmd
msiexec /i StratoraAgent.msi /qn /l*v agent-install.log SERVERURL="https://stratora.example.com" ENROLLTOKEN="enroll_xxxxx.sha256:xxxxx" SITE="Main Office"
```

| Property | Required | Description |
|---|---|---|
| `SERVERURL` | Yes | Your Stratora server's address. |
| `ENROLLTOKEN` | Yes | The whole enrollment token. |
| `SITE` | No | The name of the site to put the new node in. |
| `INSTALLFOLDER` | No | A custom install folder. The default is `C:\Program Files\Stratora`. |

A custom folder follows the same rules as the Server's (see [Folders the installer refuses](./server.md#folders-the-installer-refuses)), and gets the permissions Program Files has, on every install, upgrade and repair.

The enrollment token never appears in the installer's log, and the agent's `config.json` is readable only by SYSTEM and Administrators.

### On a Remote Collector's computer: refused

If the computer runs a Remote Collector with its own agent, the installer stops with:

> The Stratora Collector on this machine already includes the agent, which monitors this host. The standalone Stratora Agent is not needed and cannot be installed next to it.

Nothing is installed. The collector's agent already monitors the computer.

---

## Approve the node

After the agent enrolls, its computer appears on **Infrastructure → Nodes** with **Pending** approval. Approve it there. Its metrics appear once the node is approved: the agent starts its Telegraf service only after the approval, so a stopped `stratora-agent-telegraf` before that is expected.

Check the agent:

- **Infrastructure → Nodes**: the node shows its agent version, and metrics within about a minute of the approval.
- On the computer: `Get-Service StratoraAgent, stratora-agent-telegraf`.
- The agent's log: `C:\Program Files\Stratora\logs\agent.log`. The agent always logs there, even when it is installed in another folder.

---

## Upgrade

**Upgrade the Stratora server first, then the agents.** A 2.5.3 agent sends nothing until it has verified a 2.5.3 server. The full procedure is in [Upgrading Stratora](/docs/administration/upgrading-stratora).

Download the new `StratoraAgent.msi` from your upgraded server and run it, from a Command Prompt with **Run as administrator** or from your deployment tool:

```cmd
msiexec /i StratoraAgent.msi /qn /l*v agent-upgrade.log
```

- No server URL or token is needed: the agent keeps its enrollment and its node.
- It stays in its install folder, including a custom one. Don't pass another `INSTALLFOLDER`: the upgrade stops before changing anything.
- An upgrade from 2.5.1 or 2.5.2 also works with basic UI (`/qb`), which needs no other input, or a double-click, where the wizard asks for a Server URL and an Enrollment Token and won't continue without them, although the upgrade doesn't use them. The installer closes the tray icon first. The tray comes back after an upgrade with UI, otherwise at the next sign-in.
- If the upgrade fails or you cancel it, Windows Installer puts the previous version back.
- On its first start, the upgraded agent stores its API key in a protected form (encrypted for this computer, and in the Windows Credential Manager of the LocalSystem account) and learns the server's trust key. Until then, its Telegraf service stays stopped for a moment.

Running the same MSI again over the same version changes nothing. Going back to an older agent needs a new enrollment token: older agents can't read the protected key.

---

## Repair

- **Programs and Features**: select **Stratora Agent**, then **Repair**.
- Or, with the installed version's MSI: `msiexec /fomus StratoraAgent.msi /l*v agent-repair.log`.

A repair restarts the agent, which starts its Telegraf service again.

---

## Uninstall

Use **Apps & features** (select **Stratora Agent**), or from a Command Prompt with **Run as administrator**:

```cmd
msiexec /x StratoraAgent.msi /qn /l*v agent-uninstall.log
```

Use the MSI of the installed version.

The uninstall removes the agent's services, files, `config.json` and its own log files. A cancelled or failed uninstall keeps them. On the Stratora server, the server's own logs in the same `logs` folder stay.

The agent's key stays in the LocalSystem account's Credential Manager, so that reinstalling the agent without `SERVERURL` and `ENROLLTOKEN` restores its enrollment. **When you retire a computer, delete its node in Stratora**, so its key no longer works.

---

## Reinstall or enroll again

**Reinstalling over an enrolled agent** with `ENROLLTOKEN` does not enroll it again: the installer keeps the existing configuration. Use `-reenroll` instead (below).

**A new install on a computer whose name is already enrolled** (for example after you rebuilt it) is refused by an ordinary token, and the existing agent keeps its identity. Use a single-use token created with **Allow replacing an existing component**. An agent that an administrator **rejected** can't enroll again under the same name until you delete or revoke it.

**When the server no longer accepts the agent's key** (the server was reinstalled or its database replaced, or the agent was revoked), the agent stops with exit code 77 and logs that it needs to be enrolled again. It is not restarted in a loop. **Collection → Enrollment**, tab **Registered Components**, lists the agents the server refused. To enroll the agent again:

1. Create an enrollment token. If the server still has an agent under this computer's name, create it with **Allow replacing an existing component**.
2. In PowerShell with **Run as administrator**, in the agent's folder:

   ```powershell
   cd "C:\Program Files\Stratora"
   .\stratora-agent.exe -reenroll enroll_xxxxx.sha256:xxxxx
   Restart-Service StratoraAgent
   ```

   `-reenroll` stops the service if it is still running, writes the token into `config.json` and clears the old identity. The agent then enrolls like a new install.
3. Approve the node if it is pending.

---

## Computers that have both a collector and a standalone agent

Up to 2.5.2, the standalone agent could be installed on a computer that also ran a Remote Collector with its own agent. Both use the `StratoraAgent` and `stratora-agent-telegraf` services, so the standalone agent took those services over, and uninstalling it deleted them. 2.5.3 refuses that install, but a computer that got into this state earlier needs one of these paths when you upgrade. In all of them, **upgrade the Stratora server to 2.5.3 first**.

**Keep the standalone agent.** This is the simplest path. Upgrade the Remote Collector to 2.5.3, then upgrade the standalone agent to 2.5.3. The collector's upgrade keeps the standalone agent: if the old collector's removal deleted the standalone agent's services, the upgrade registers them again with the standalone agent's own configuration, and the agent keeps reporting under the same node. From then on the collector has no agent of its own, and the standalone agent monitors the computer.

**Go back to the collector's own agent.** Do it in this order:

1. Uninstall the standalone agent.
2. Then bring back the collector's agent:
   - if the collector is still on 2.5.2 or older, upgrade it to 2.5.3;
   - if the collector is already on 2.5.3 and still has its own agent, repair it (**Programs and Features**, **Stratora Remote Collector**, **Repair**).

   Either one registers the collector's agent service again.
3. Within a few minutes, check that the computer's node on **Infrastructure → Nodes** reports again. If the standalone agent had taken over the node's key, the collector's agent finds the current key by itself when it can verify that safely, and reports with no re-enrollment.

**When the collector's agent must be enrolled again.** The collector's agent only takes over another key when it can check it safely with the server. When it can't, it changes nothing and waits. That happens mainly when:

- the collector was upgraded in place from 2.5.2 or earlier, rather than installed new with 2.5.3, and its own configuration still holds the key the standalone agent replaced;
- the collector was installed with a token that was copied without its `.sha256:` part;
- the collector's server URL starts with `http://`.

Its log (`C:\Program Files\Stratora\logs\agent.log`) then says it cannot check which API key is current, and names the command. Enroll it again:

1. Create a single-use enrollment token with **Allow replacing an existing component**.
2. In PowerShell with **Run as administrator** (use the collector's install folder if it isn't the default):

   ```powershell
   & "C:\Program Files\Stratora\Agent\stratora-agent.exe" -reenroll enroll_xxxxx.sha256:xxxxx -config "C:\Program Files\Stratora\Agent\config.json"
   Restart-Service StratoraAgent
   ```

If the collector was already upgraded to 2.5.3 while the standalone agent was installed, it has no agent of its own, and a repair doesn't add one. Keep the standalone agent, or uninstall both and install the collector again with `SERVER_URL` and `ENROLLMENT_TOKEN`.
