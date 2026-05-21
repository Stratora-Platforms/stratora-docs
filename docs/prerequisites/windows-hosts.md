---
title: Windows Hosts
sidebar_label: Windows Hosts
sidebar_position: 30
---

# Windows Hosts

Prerequisites for Windows hosts that you'll monitor with the Stratora Agent.

## Supported Windows versions

The Stratora Agent supports the following 64-bit Windows versions:

- Windows Server 2016, 2019, 2022, 2025
- Windows 10, Windows 11

32-bit Windows is not supported.

## Install prerequisites

- Local administrator privileges to run the installer (the MSI requires elevation)
- At least 200 MB of free disk space for the agent binary and its log directory
- PowerShell 5.1 or later, which ships built-in with every supported version above

## Network — outbound from the host

The agent makes outbound HTTPS connections only:

- TCP 443 to the Stratora Server's FQDN
- Direct outbound HTTPS — forward proxies are not supported in this release

For the full Server-side port matrix, see [Network](/docs/prerequisites/network).

## Network — ICMP Echo Request for reachability checks

Stratora pings every node from its assigned site Collector to populate the Response column on the Nodes list and to drive node reachability state. By default, this Collector is the Stratora Server itself; remote sites use whichever Collector you've assigned to that site.

The default Windows Server firewall **blocks** inbound ICMPv4 Echo Request. Enable the built-in rule on each monitored host:

```powershell
Get-NetFirewallRule -Name 'FPS-ICMP4-ERQ-In' |
  Set-NetFirewallRule -Enabled True -Profile Any
```

For fleet-wide enablement via Group Policy: `Computer Configuration → Policies → Windows Settings → Security Settings → Windows Firewall with Advanced Security → Inbound Rules` → enable **File and Printer Sharing (Echo Request - ICMPv4-In)**.

Without this rule, the agent will enroll and push metrics correctly, but the host will appear unreachable on the Nodes list — the Response column stays empty and reachability-based alerts may fire.

## WMI prerequisites (only if monitoring Windows hosts via WMI from a Collector)

If you're monitoring a Windows host from a Collector via WMI (rather than via the agent), you'll also need:

- A local administrator account or a WMI-permitted account
- The DCOM and WMI services running on the host
- TCP 135 plus the dynamic RPC port range reachable from the Collector, or the Windows Firewall WMI-In rule enabled

For most fleets, the agent path is simpler than WMI and is the recommended choice.

## Where to go next

- Agent installation: [Agents](/docs/collection/agents)
- Network port matrix: [Network](/docs/prerequisites/network)
- Verifying reachability: [Verification](/docs/prerequisites/verification)
