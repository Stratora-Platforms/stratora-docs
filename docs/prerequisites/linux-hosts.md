---
title: Linux Hosts
sidebar_label: Linux Hosts
sidebar_position: 40
---

# Linux Hosts

Prerequisites for Linux hosts that you'll monitor with the Stratora Agent.

## Supported Linux distributions

| Distribution | Package | Tested with 2.5.3 |
|---|---|---|
| Rocky Linux 8 (SELinux enforcing) | `.rpm` | Yes |
| Debian 12 (Bookworm) | `.deb` | Yes |
| Ubuntu 24.04 LTS | `.deb` | Yes |

Only these were tested with Stratora 2.5.3. Other distributions and versions that use the same package formats with systemd, such as RHEL, AlmaLinux, Rocky Linux 9, Debian 13 or Ubuntu 22.04, were not tested with this release. See [Install the Linux Agent](/docs/installation/linux-agent#supported-distributions) for what was tested on each.

Architecture: amd64 only. ARM-based hosts are not supported in this release.

## Install prerequisites

- `root` or `sudo` to install the package
- `systemd` — the agent runs as a systemd service unit
- At least 200 MB of free disk space for the agent binary and its log directory
- **Telegraf**, installed from the [InfluxData repository](https://docs.influxdata.com/telegraf/v1/install/) before the agent. The agent collects metrics through Telegraf, which its package does not include; the package links the system's `telegraf` into `/opt/stratora/bin` when it is installed. Without Telegraf the agent enrolls but sends no metrics.
- No other package dependencies — the agent itself is a static binary

## Network — outbound from the host

The agent makes outbound HTTPS connections only:

- TCP 443 to the Stratora Server's FQDN
- Direct outbound HTTPS — the agent does not honor `HTTP_PROXY` or `HTTPS_PROXY` in this release

For the full Server-side port matrix, see [Network](/docs/prerequisites/network).

## Network — ICMP Echo Request for reachability checks

Stratora pings every node from its assigned site Collector to populate the Response column on the Nodes list and to drive node reachability state. By default, this Collector is the Stratora Server itself; remote sites use whichever Collector you've assigned to that site.

Most Linux distributions accept inbound ICMP Echo Request by default. If you've hardened the host firewall, verify with your distribution's tooling — `firewalld`, `ufw`, or `iptables` — that `echo-request` is still permitted.

Without ICMP reachability, the agent will enroll and push metrics correctly, but the host will appear unreachable on the Nodes list — the Response column stays empty and reachability-based alerts may fire.

## SELinux and AppArmor

- **SELinux**: no custom SELinux policy is required for the default install layout (`/opt/stratora/`, `/etc/stratora/`, `/var/lib/stratora/`, `/var/log/stratora/`). The agent's program gets the standard `bin_t` type. In testing on Rocky Linux 8 in enforcing mode, installing and uninstalling the agent produced no AVC denials.
- **AppArmor**: no profile is shipped with the agent, and no profile is required.

## SSH prerequisites (only if monitoring Linux hosts via SSH from a Collector)

If you're monitoring a Linux host from a Collector via SSH (rather than via the agent), you'll also need:

- A user account with read access to the metrics you want collected
- SSH key or password authentication
- TCP 22 open to the Collector

For most fleets, the agent path is simpler than SSH polling and is the recommended choice.

## Where to go next

- Agent installation: [Install the Linux Agent](/docs/installation/linux-agent)
- What the agent collects: [Agents](/docs/collection/agents)
- Network port matrix: [Network](/docs/prerequisites/network)
- Verifying reachability: [Verification](/docs/prerequisites/verification)
