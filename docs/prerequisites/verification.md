---
title: Verification
sidebar_label: Verification
sidebar_position: 60
---

# Verification

Quick checks that confirm prerequisites are in place before — or right after — you import a host or device into monitoring. Most of these you can run in under a minute and they'll surface the common pitfalls before they become support tickets.

## Verifying ICMP reachability

From the Stratora Server (or from each Collector if you're using remote Collectors):

```
ping <monitored-host-or-IP>
```

If ping succeeds, the Response column on the Nodes list will populate within ~30 seconds of import.

If ping fails:

- Check the monitored host's firewall. On Windows, see [Windows hosts](/docs/prerequisites/windows-hosts) for the rule to enable; on Linux, see [Linux hosts](/docs/prerequisites/linux-hosts).
- Check the intervening network path for ACLs or firewall rules blocking ICMP between the Collector and the host.

## Verifying SNMP reachability

From the Stratora Server (or from each Collector):

```
snmpget -v2c -c <community> <device-ip> 1.3.6.1.2.1.1.1.0
```

(Or the SNMPv3 equivalent if you're using v3.) A successful query returns the device's `sysDescr`.

If SNMP fails:

- Check the device-side ACL for UDP/161 — see [SNMP devices](/docs/prerequisites/snmp-devices).
- Confirm the community string (for v2c) or USM credentials (for v3) match what's configured on the device.
- Check the network path between the Collector and the device.

## Verifying agent enrollment

1. Install the agent on a target host.
2. Confirm the agent service is running (`Get-Service StratoraAgent` on Windows, `systemctl status stratora-agent` on Linux).
3. The agent sends its first heartbeat within ~10 seconds. When the Server receives it, the host appears in the Stratora UI in pending state.
4. **The pending approval queue is at Infrastructure → Nodes, filtered by Approval Status = Pending.** The approve action is per-row on the Nodes list; there is no separate Pending Agents page.
5. Approve the row. The Response, Collector, and Uptime columns populate on the same row once the next probe cycle completes.

## Verifying outbound HTTPS from a monitored host

From the monitored host:

```
curl -v https://<your-stratora-fqdn>/api/v1/health
```

Expected: HTTP 200 response.

If it fails:

- A certificate-trust issue — the host doesn't trust the Stratora Server's certificate.
- A DNS resolution issue — the host can't resolve the Server's FQDN.
- A network-path issue — outbound 443 is blocked or routed through a forward proxy (the agent does not support forward proxies in this release).

## Where errors surface in the UI

- **Nodes list** — Response = "-" means no successful probe yet. Stays "-" indefinitely if ICMP Echo Request is blocked on the host.
- **Node detail** — per-template error messages from Telegraf parsing surface here.
- **Alerts** — connectivity-class alerts fire for the common reachability failures (Node Unreachable, Agent Heartbeat Lost, Collector Offline).
- **Settings → Diagnostics** — surfaces Server-side errors for log inspection.
