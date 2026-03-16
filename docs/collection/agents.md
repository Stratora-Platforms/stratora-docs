---
sidebar_label: Agents
title: Agents
sidebar_position: 1
---

# Agents

The **Stratora Agent** is a lightweight service installed on your monitored endpoints (Windows and Linux servers). It collects system metrics — CPU, memory, disk, network, and running services — and reports them back to the Stratora server. Agents use an embedded Telegraf instance for metric collection and communicate with the server over HTTPS.

Unlike SNMP-based monitoring (which is polled by a [collector](./collectors.md)), agents **push** metrics from the host itself. This gives you deeper OS-level visibility and works well for servers behind firewalls or in network segments where inbound SNMP polling isn't practical.

---

## Supported Platforms

| Platform | Installer | Tested Versions |
|----------|-----------|-----------------|
| Windows Server / Desktop | MSI | Windows Server 2019, 2022; Windows 10/11 |
| Ubuntu / Debian | `.deb` | Ubuntu 24.x, Debian 12 (Bookworm), Debian 13 (Trixie) |
| RHEL / Rocky / Alma | `.rpm` | RHEL 9.x, Rocky 9.x, Rocky 8.x |

---

## Deploying Agents

Navigate to **Collection → Agents** to access the deployment page. The page provides platform-specific install commands with your server URL pre-filled.

### Before You Start

You'll need an **enrollment token** — this is the temporary credential the agent uses to register with the server. You can select an existing token or generate a new one directly from the Agents page. See [Enrollment](./enrollment.md) for details on token types and security.

Optionally, select a **target site** to assign agents to a specific site on first registration.

### Windows — Silent Install

For automated deployments (GPO, SCCM, Intune, PDQ Deploy, Ansible):

1. Download the MSI from the Agents page or use the download URL: `/api/v1/downloads/agent/windows`
2. Run the generated silent install command:

```cmd
msiexec /i StratoraAgent.msi /qn SERVERURL="https://stratora.example.com" ENROLLTOKEN="enroll_xxxxx" SITE="Main Office"
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `SERVERURL` | Yes | Your Stratora server URL |
| `ENROLLTOKEN` | Yes | Enrollment token from the Agents page |
| `SITE` | No | Target site name for auto-assignment |

| Flag | Effect |
|------|--------|
| `/qn` | Fully silent (no UI) |
| `/qb` | Basic UI (progress bar only) |
| `/l*v C:\temp\install.log` | Verbose logging to file |

The Agents page generates this command with your values pre-filled — just copy and run.

### Windows — Interactive Install

1. Download the MSI from the Agents page
2. Run the installer
3. The setup wizard prompts for your server URL and enrollment token

### Linux — Debian / Ubuntu

1. Download or curl the `.deb` package:

```bash
curl -sko /tmp/stratora-agent.deb https://stratora.example.com/api/v1/downloads/agent/linux-deb
sudo dpkg -i /tmp/stratora-agent.deb
```

2. Write the agent configuration and start the service:

```bash
sudo tee /etc/stratora/agent.json << 'EOF'
{ "server_url": "https://stratora.example.com", "enrollment_token": "enroll_xxxxx", "site_name": "Main Office" }
EOF
sudo systemctl enable --now stratora-agent
```

### Linux — RHEL / Rocky / Alma

1. Download or curl the `.rpm` package:

```bash
curl -sko /tmp/stratora-agent.rpm https://stratora.example.com/api/v1/downloads/agent/linux-rpm
sudo rpm -i /tmp/stratora-agent.rpm
```

2. Write the agent configuration and start the service:

```bash
sudo tee /etc/stratora/agent.json << 'EOF'
{ "server_url": "https://stratora.example.com", "enrollment_token": "enroll_xxxxx", "site_name": "Main Office" }
EOF
sudo systemctl enable --now stratora-agent
```

:::tip
The Agents page generates these commands with your server URL and selected token pre-filled. Use the copy button to grab the exact commands for your environment.
:::

---

## Verifying Enrollment

After installation, the agent registers with the server within seconds. To confirm:

1. Navigate to **Infrastructure → Nodes** — the agent's host should appear with status **Healthy**
2. Check the node's detail page for incoming metrics (CPU, memory, disk)

If the agent doesn't appear, check:
- Network connectivity from the host to the Stratora server (HTTPS, port 443)
- That the enrollment token hasn't expired or been exhausted
- Agent service status: `sc query StratoraAgent` (Windows) or `systemctl status stratora-agent` (Linux)

---

## What Gets Installed

### Windows

- **StratoraAgent** — Windows service managing the agent lifecycle
- **stratora-agent-telegraf** — Windows service running the embedded Telegraf instance
- A system tray indicator showing agent status
- Configuration stored in `C:\ProgramData\Stratora\Agent\`

### Linux

- **stratora-agent** — systemd service at `/opt/stratora/bin/stratora-agent`
- Embedded Telegraf managed as a subprocess
- Configuration at `/etc/stratora/agent.json`
- Logs via journald: `journalctl -u stratora-agent -f`

---

## Agent vs. Collector

| | Agent | Collector |
|---|-------|-----------|
| **Installed on** | Each monitored endpoint | One per remote site/network segment |
| **Collects from** | The local host only | All assigned nodes via SNMP/ICMP |
| **Direction** | Push (agent → server) | Pull (collector polls devices) |
| **Use case** | Windows/Linux servers | Network switches, routers, firewalls, NAS, UPS |
| **Metrics** | OS-level (CPU, memory, disk, services) | Protocol-dependent (SNMP OIDs, ping, HTTP) |

Most environments use both: agents on servers, collectors for network infrastructure.
