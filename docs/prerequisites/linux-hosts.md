---
title: Linux Hosts
sidebar_label: Linux Hosts
sidebar_position: 40
---

# Linux Hosts

Prerequisites for Linux hosts that you'll monitor with the Stratora Agent.

## Supported Linux distributions

| Family | Versions | Package |
|---|---|---|
| Debian | 12 (Bookworm), 13 (Trixie) | `.deb` |
| Ubuntu | 22.04 LTS, 24.04 LTS | `.deb` |
| RHEL | 9.x | `.rpm` |
| Rocky Linux | 8.x, 9.x | `.rpm` |
| AlmaLinux | 9.x (binary-compatible RHEL 9 derivative) | `.rpm` |

Architecture: amd64 only. ARM-based hosts are not supported in this release.

## Install prerequisites

- `root` or `sudo` to install the package
- `systemd` — the agent runs as a systemd service unit
- At least 200 MB of free disk space for the agent binary and its log directory
- No package dependencies — the agent ships as a static binary with no external runtime requirements

## Network — outbound from the host

The agent makes outbound HTTPS connections only:

- TCP 443 to the Stratora Server's FQDN
- Direct outbound HTTPS — the agent does not honor `HTTP_PROXY` or `HTTPS_PROXY` in this release

For the full Server-side port matrix, see [Network](/docs/prerequisites/network).

## Network — inbound to the host (when monitored by a Collector)

If you also want a Collector to ping the host for the Response column on the Nodes list, the host needs to accept ICMP Echo Request inbound from each assigned Collector's IP. Most Linux distributions accept ICMP Echo Request by default; verify with your distribution's firewall tool — `firewalld`, `ufw`, or `iptables` — that nothing is blocking it.

## SELinux and AppArmor

- **SELinux**: the agent runs as a confined service via its systemd unit. No custom SELinux policy is required for the default install layout (`/opt/stratora/`, `/etc/stratora/`, `/var/lib/stratora/`, `/var/log/stratora/`).
- **AppArmor**: no profile is shipped with the agent, and no profile is required.

## SSH prerequisites (only if monitoring Linux hosts via SSH from a Collector)

If you're monitoring a Linux host from a Collector via SSH (rather than via the agent), you'll also need:

- A user account with read access to the metrics you want collected
- SSH key or password authentication
- TCP 22 open to the Collector

For most fleets, the agent path is simpler than SSH polling and is the recommended choice.

## Where to go next

- Agent installation: [Agents](/docs/collection/agents)
- Network port matrix: [Network](/docs/prerequisites/network)
- Verifying reachability: [Verification](/docs/prerequisites/verification)
