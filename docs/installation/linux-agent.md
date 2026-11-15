---
title: Install the Linux Agent
sidebar_label: Linux Agent
sidebar_position: 4
---

# Install the Linux Agent

The Stratora Linux Agent runs on a Linux server and sends its metrics (CPU, memory, disk, network, systemd services and the roles it runs) to the Stratora server. It ships as a `.deb` package for Debian and Ubuntu and as an `.rpm` package for RHEL-family distributions. See [Agents](/docs/collection/agents) for what it collects.

The package installs the `stratora-agent` systemd service, which runs as its own `stratora` user.

---

## Supported distributions

| Distribution | Package | Tested with 2.5.3 |
|---|---|---|
| Rocky Linux 8 (8.10, SELinux enforcing) | `.rpm` | Install, enrollment and metrics, upgrade from 2.5.1, uninstall |
| Debian 12 | `.deb` | Install, enrollment and metrics, upgrade from 2.5.1, `remove` and `purge` |
| Ubuntu 24.04 LTS | `.deb` | Install, enrollment and metrics, upgrade from 2.5.1, `remove` and `purge` |

Only these three were tested with 2.5.3. The packages are built for 64-bit x86 (amd64) systems with systemd 239 or later, but other distributions and versions, such as RHEL, AlmaLinux, Rocky Linux 9, Debian 13 or Ubuntu 22.04, were not tested with this release. ARM systems are not supported.

---

## Before you install

| Requirement | Details |
|---|---|
| Account | `root` or `sudo`. |
| Network | Outbound HTTPS (TCP 443) to the Stratora server. The agent never listens on a port and doesn't use a proxy. |
| Telegraf | The agent collects metrics with Telegraf, which the package does **not** include. Install Telegraf from the [InfluxData repository](https://docs.influxdata.com/telegraf/v1/install/) **before** the agent: the package then links it to `/opt/stratora/bin/telegraf`. Without Telegraf the agent enrolls and reports in, but sends no metrics. |
| Reachability | The collector pings the host. Most distributions allow ICMP Echo Request; check it if you have hardened the firewall. See [Linux hosts](/docs/prerequisites/linux-hosts). |
| Server version | Upgrade the server before its agents. Download the package from your server (below), so the versions match. |

### Create an enrollment token

1. In Stratora, open **Collection → Enrollment**, tab **Enrollment Tokens**, and click **Create Token**. You can also create one on **Collection → Agents**.
2. Single-use for one host, or **Multi-use** with **Max uses** for a batch. Choose a short expiration.
3. Leave **Allow replacing an existing component** off, unless you are reinstalling an agent on a host that is already enrolled.
4. Copy the token. It looks like `enroll_<secret>.sha256:<pin>`. **Copy the whole token**, including the part after `.sha256:`: that part lets the agent verify the server from its first connection.

---

## Install

**Collection → Agents**, tab **Linux**, shows these commands with your server address and token filled in.

### 1. Install the package

Debian and Ubuntu:

```bash
curl -sko /tmp/stratora-agent.deb https://stratora.example.com/api/v1/downloads/agent/linux-deb
sudo apt install /tmp/stratora-agent.deb        # or: sudo dpkg -i /tmp/stratora-agent.deb
```

Rocky Linux and other RHEL-family distributions:

```bash
curl -sko /tmp/stratora-agent.rpm https://stratora.example.com/api/v1/downloads/agent/linux-rpm
sudo dnf install /tmp/stratora-agent.rpm        # or: sudo rpm -i /tmp/stratora-agent.rpm
```

`curl -k` skips certificate verification for this download only. Leave it out if the host trusts the server's certificate. The agent itself always verifies the server.

A new install doesn't start the agent: it waits for its configuration.

### 2. Write the configuration

The configuration file, `/etc/stratora/agent.json`, holds the enrollment token and later the agent's API key, so it must be readable only by the `stratora` user. Create it with owner `stratora` and mode `0600` first, then write it:

```bash
sudo install -m 0600 -o stratora -g stratora /dev/null /etc/stratora/agent.json
sudo tee /etc/stratora/agent.json > /dev/null << 'EOF'
{ "server_url": "https://stratora.example.com", "enrollment_token": "enroll_xxxxx.sha256:xxxxx", "site_name": "Main Office" }
EOF
```

| Field | Required | Description |
|---|---|---|
| `server_url` | Yes | Your Stratora server's address, with the name its certificate covers. |
| `enrollment_token` | Yes | The whole enrollment token. |
| `site_name` | No | The site to put the new node in. |

`tee` keeps the owner and mode of the file you created. The agent also sets the file to owner `stratora`, mode `0600` every time it starts and writes it, and the package does on install and upgrade. An `insecure_skip_verify` setting from earlier versions is ignored, with a warning in the log: the agent always verifies the server's certificate.

### 3. Start the agent

```bash
sudo systemctl enable --now stratora-agent
```

The agent enrolls with the token, receives its own API key (which it writes into `agent.json` in place of the token), and waits for approval.

### 4. Approve the node

The host appears on **Infrastructure → Nodes** with **Pending** approval. Approve it. The agent starts collecting within about a minute.

Check the agent on the host:

```bash
sudo systemctl status stratora-agent
sudo journalctl -u stratora-agent -f
```

---

## Upgrade

**Upgrade the Stratora server first, then the agents.** A 2.5.3 agent sends nothing until it has verified a 2.5.3 server. The full procedure is in [Upgrading Stratora](/docs/administration/upgrading-stratora).

Download the new package from your upgraded server and install it over the installed one:

```bash
# Debian / Ubuntu
curl -sko /tmp/stratora-agent.deb https://stratora.example.com/api/v1/downloads/agent/linux-deb
sudo apt install /tmp/stratora-agent.deb        # or: sudo dpkg -i /tmp/stratora-agent.deb

# Rocky Linux and RHEL family
curl -sko /tmp/stratora-agent.rpm https://stratora.example.com/api/v1/downloads/agent/linux-rpm
sudo dnf install /tmp/stratora-agent.rpm        # or: sudo rpm -U /tmp/stratora-agent.rpm
```

The upgrade keeps `/etc/stratora/agent.json`, so the agent keeps its enrollment and its node, and **restarts the agent on the new version by itself**:

- **`.deb`:** a running agent is restarted. An enrolled agent that the old package stopped during the upgrade (2.5.1 and 2.5.2 did that) is started again. An agent that hasn't enrolled yet stays stopped.
- **`.deb`, an agent you turned off stays off:** when `stratora-agent` is **masked**, or **disabled** before an upgrade from 2.5.3 or later, the upgrade neither enables nor starts it, and says so. Packages before 2.5.3 disabled the agent themselves during every upgrade, so an upgrade from them enables the service again. To run the agent again: `sudo systemctl unmask stratora-agent` (if masked), then `sudo systemctl enable --now stratora-agent`.
- **`.rpm`:** a running agent is restarted; a stopped agent stays stopped. The package enables the service on every install and upgrade, so if you keep the agent disabled, disable it again after the upgrade.

Check it with `sudo systemctl status stratora-agent`. On the Nodes page, the node shows the new agent version within seconds.

Stratora 2.5.2 servers shipped the 2.5.1 Linux packages, so an agent you installed from a 2.5.2 server runs 2.5.1. It upgrades to 2.5.3 the same way.

---

## Uninstall

First delete the host's node in Stratora (**Infrastructure → Nodes**), so its key no longer works.

### Debian and Ubuntu: remove or purge

For a full removal, **purge** the package:

```bash
sudo apt purge stratora-agent        # or: sudo dpkg -P stratora-agent
```

Purge stops and disables the service, removes the program and the systemd unit, deletes `/etc/stratora`, `/var/lib/stratora`, `/var/log/stratora` and `/opt/stratora`, and removes the `stratora` user and group.

`sudo apt remove stratora-agent` (or `sudo dpkg -r stratora-agent`) stops and disables the service and removes the program and the systemd unit, but **keeps**:

- `/etc/stratora`: `agent.json`, **which holds the agent's API key**, and the server trust files;
- `/var/lib/stratora`, the agent's data;
- `/var/log/stratora`, when it holds logs;
- the Telegraf link `/opt/stratora/bin/telegraf`;
- the `stratora` user and group.

Installing the package again after `remove` resumes with the same identity. To delete what `remove` kept, purge the package afterwards: `sudo apt purge stratora-agent`.

### Rocky Linux and RHEL family

```bash
sudo dnf remove stratora-agent        # or: sudo rpm -e stratora-agent
```

This stops and disables the service, removes the program and the systemd unit, deletes `/etc/stratora`, `/var/lib/stratora`, `/var/log/stratora` and `/opt/stratora`, and removes the `stratora` user and group. There is no separate purge step.

---

## Enroll again

When the server no longer accepts the agent's key (the server was reinstalled or its database replaced, or the agent was revoked), the agent stops with **exit status 77**, which systemd does not restart, and logs that it needs to be enrolled again. **Collection → Enrollment**, tab **Registered Components**, lists the agents the server refused.

1. Create an enrollment token. If the server still has an agent under this host's name, create it with **Allow replacing an existing component**.
2. On the host:

   ```bash
   sudo systemctl stop stratora-agent
   sudo /opt/stratora/bin/stratora-agent --config /etc/stratora/agent.json --reenroll enroll_xxxxx.sha256:xxxxx
   sudo systemctl start stratora-agent
   ```

   Stop the agent first: a running agent still holds its old identity and could write it back.
3. Approve the node if it is pending.

A new install on a host whose name is already enrolled is refused by an ordinary token, and the existing agent keeps its identity. Use a token with **Allow replacing an existing component** for that.

---

## The configuration file's permissions

The agent keeps `/etc/stratora/agent.json` private: owner `stratora`, mode `0600`. When it finds a file other users could read, it fixes it and logs a warning. Because the file holds the agent's key, enroll the agent again (above) if other users could have read it.

When the file belongs to another user and the agent can't fix it, the agent stops with **exit status 78**, which systemd does not restart, and logs the commands that fix it. For a plain file:

```bash
sudo chown stratora:stratora /etc/stratora/agent.json
sudo chmod 600 /etc/stratora/agent.json
```

**A symbolic link or a hard link.** Don't `chown` or `chmod` a linked `agent.json`: that changes the file it links to. Remove the link and create the file again, then write the configuration into it:

```bash
ls -li /etc/stratora/agent.json        # shows the link and the number of names
sudo rm /etc/stratora/agent.json
sudo install -m 0600 -o stratora -g stratora /dev/null /etc/stratora/agent.json
sudo tee /etc/stratora/agent.json > /dev/null    # then paste the configuration and press Ctrl+D
```

**The hard-link warning.** When `agent.json` has more than one hard link (another name for the same file), the agent logs a warning at every start, with the number of links, the commands to find the other name (`findmnt` and `find -inum`), and how to create the file again. The agent keeps running. If the agent had to replace its own name with a private copy, the warning also says that the other name still holds the earlier content and permissions; enroll the agent again if other users could read it. The package's install and upgrade scripts warn about a linked `agent.json` too.

**Backing up `agent.json`.** Keep the owner and mode, for example `sudo cp --preserve=mode,ownership /etc/stratora/agent.json /etc/stratora/agent.json.bak`. A plain `sudo cp` makes a copy owned by `root`; moved back over the original later, the agent can no longer read it.

---

## SELinux and AppArmor

- **SELinux:** no custom policy is needed. The agent's program in `/opt/stratora/bin` gets the standard `bin_t` type. In testing on Rocky Linux 8 in enforcing mode, installing and uninstalling the agent produced no AVC denials. To check on your host: `sudo ausearch -m avc -ts recent`.
- **AppArmor:** the package ships no AppArmor profile, and needs none.

---

## Files

| Path | What |
|---|---|
| `/opt/stratora/bin/stratora-agent` | The agent |
| `/opt/stratora/bin/telegraf` | Link to the system's Telegraf |
| `/opt/stratora/etc/telegraf-agent.conf` | The Telegraf configuration template |
| `/etc/stratora/agent.json` | The agent's configuration and API key (owner `stratora`, mode `0600`) |
| `/var/lib/stratora/` | The agent's data |
| `/var/log/stratora/` | Log folder; the agent logs to the journal (`journalctl -u stratora-agent`) |
| `/lib/systemd/system/stratora-agent.service` | The systemd unit (`.deb`) |
| `/usr/lib/systemd/system/stratora-agent.service` | The systemd unit (`.rpm`) |

---

## Troubleshooting

| What you see | What to do |
|---|---|
| The node doesn't appear | Check the token (expired or used up) and that the host can reach the server on 443. Read `journalctl -u stratora-agent`. |
| The node is there but has no metrics | Approve the node. Check that Telegraf is installed and `/opt/stratora/bin/telegraf` exists; if not, `sudo ln -sf /usr/bin/telegraf /opt/stratora/bin/telegraf` and `sudo systemctl restart stratora-agent`. |
| The agent stopped with exit status 77 | Enroll it again (above). |
| The agent stopped with exit status 78 | Fix `agent.json`'s owner and mode (above). |
| The agent is stopped after an upgrade | Check whether it is disabled or masked: `systemctl is-enabled stratora-agent`. Then `sudo systemctl enable --now stratora-agent`. |
