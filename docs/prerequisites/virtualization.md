---
title: Virtualization Prerequisites
sidebar_label: Virtualization
sidebar_position: 45
---

# Virtualization Prerequisites

What you need in place before onboarding each hypervisor platform. Once the prerequisites below are met, onboard through the guided add-paths — see [Adding Virtualization Hosts](/docs/collection/virtualization).

Every platform except Hyper-V is polled **from a Stratora Collector**, so the collector must be able to reach the platform's API or SNMP port (see [Network](/docs/prerequisites/network)).

---

## VMware vSphere

A complete vSphere setup has two layers (see [Adding Virtualization Hosts](/docs/collection/virtualization#complete-vsphere-setup-both-layers-required)) — each has its own prerequisite.

### vCenter (API) — inventory and utilization

- **A vCenter user for Stratora.** The vSphere probe only **reads** inventory and performance data, so a **read-only** role is sufficient — create a dedicated user (local SSO or an AD-backed account) and grant it the **Read-only** role at the vCenter root, propagated to child objects.
- **Network:** the Collector reaches the vCenter on **443/TCP (HTTPS)**.
- **Credential:** a **VMware API** credential (username + password) in Stratora — created inline during onboarding or on the [Credentials](/docs/collection/credentials) page.

### ESXi hosts (per-host SNMP) — overcommit + host-alert attribution

Each ESXi host is also onboarded as a **VMware Host** node over SNMP (the required second layer). ESXi ships with **SNMP disabled**, so enable it per host:

```bash
esxcli system snmp set --communities <your-community>
esxcli system snmp set --enable true
```

- **Network:** the Collector reaches each ESXi host on **161/UDP**.
- **Credential:** an **SNMP** credential (v2c community, or v3) in Stratora.

---

## Proxmox VE

- **An API token.** Create one under **Datacenter → Permissions → API Tokens**. Use a **cluster-wide** token (any member's API returns cluster-wide data) and grant it a **read-only** role — `PVEAuditor` at path `/` is sufficient. Note the token ID (`user@realm!name`) and secret at creation time; the secret is shown once.
- **Network:** the Collector reaches a Proxmox host on **8006/TCP (HTTPS)**.
- **Credential:** a **Proxmox VE API Token** credential in Stratora.

You onboard a whole cluster by adding **one** member with the cluster-wide token; the other members are discovered automatically.

---

## Microsoft Hyper-V

Hyper-V needs **no credential and no API access**. A Hyper-V host is monitored by the **Stratora Windows Agent**, which self-reports the Hyper-V role.

- Install the agent on the Hyper-V host per the [Windows hosts](/docs/prerequisites/windows-hosts) prerequisites.
- No firewall port beyond the agent's outbound HTTPS to the Server (see [Network](/docs/prerequisites/network)).

---

## Verify before onboarding

After the prerequisites are in place, confirm the Collector can reach each platform — see [Verification](/docs/prerequisites/verification) for the API/SNMP reachability checks.
