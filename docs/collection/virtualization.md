---
sidebar_label: Virtualization Hosts
title: Adding Virtualization Hosts
---

# Adding Virtualization Hosts

Stratora monitors three hypervisor platforms — **Hyper-V**, **VMware vSphere**, and **Proxmox VE** — and the way you onboard a host depends on the platform. There are two models: **agent-based** (Hyper-V) and **agentless API** (vCenter, Proxmox). Once a host is onboarded, its platform dashboard populates automatically.

> This is the current manual onboarding process. A guided "Add hypervisor" wizard with inline credential entry is planned for a future release.

---

## Hyper-V (agent) — the simplest path

Hyper-V hosts are monitored by the **Stratora Windows Agent**. There are no credentials to manage — the agent itself is the trust.

1. Install the Stratora Windows Agent on the Hyper-V host (see [Agents](./agents.md)).
2. The agent enrolls and **self-reports the Hyper-V role** — the host appears as a Hyper-V node automatically.

That's it. The Hyper-V dashboard populates from the agent's data (hosts, VMs, clusters, memory pressure).

---

## VMware vSphere (vCenter API) — full virtualization inventory

The rich vSphere inventory (hosts, datastores, VMs, memory overcommit) comes from **vCenter via its API**. Onboard the vCenter appliance, not the individual ESXi hosts:

1. **Add the node.** Go to **Infrastructure → Nodes → Add Node**, choose node type **vCenter Server Appliance**, and enter the vCenter address.
2. **Create the credential.** On the [Credentials](./credentials.md) page, add a **VMware API** credential (vCenter username + password).
3. **Bind and assign.** Edit the vCenter node, attach the VMware API credential, and assign a [collector](./collectors.md).

The collector starts the vSphere probe and the **vSphere dashboard** populates — ESXi hosts, datastores, VMs, and overcommit across everything the vCenter manages.

---

## Proxmox VE (API)

Proxmox monitoring uses a **Proxmox VE API token**. Any cluster member's API returns cluster-wide data, so you onboard a cluster by adding **one** member:

1. **Add the node.** **Add Node** → node type **Proxmox VE** → enter **any cluster member's address** (or the single host's address if it's standalone).
2. **Create the credential.** On the [Credentials](./credentials.md) page, add a **Proxmox VE API Token** credential. Use a **cluster-wide** token so it works against any member.
3. **Bind and assign.** Edit the Proxmox node, attach the token, and assign a [collector](./collectors.md).

For a **cluster**, add just **one** member with the cluster-wide token — the other members are discovered and appear automatically on the next poll. The **Proxmox dashboard** then populates (cluster health, guests, storage, capacity).

---

## ESXi via SNMP — host-level monitoring (separate from the vSphere dashboards)

Individual ESXi hosts can **also** be added over SNMP — node type **VMware Host**, using an SNMP credential — for host-level reachability and basic SNMP metrics. This is the standard [SNMP node](../infrastructure/nodes.md) flow.

This is **separate** from the vCenter API path above. SNMP gives you host up/down and SNMP counters; it does **not** populate the virtualization inventory dashboards (datastores, VMs, overcommit) — that comes from the vCenter API. Add your vCenter via API for the full picture; optionally add ESXi hosts via SNMP if you also want host-level SNMP monitoring.

---

## vSphere host monitoring — coverage and alert attribution

For vSphere, Stratora amalgamates host metrics from **two collection paths** and attributes each alert condition to the node it actually belongs to — so a host problem shows up on the host, not on the vCenter appliance.

### Where vSphere host metrics come from

| Source | Provides | Role |
|--------|----------|------|
| **vCenter integration** (vCenter API) | Host **CPU %**, **memory %**, **network throughput**, **per-VM CPU/memory**, and **datastore capacity** | Primary source for host utilization |
| **Per-host SNMP** (the ESXi host onboarded as its own VMware Host node) | **Memory overcommit** (allocated vs. physical) | Supplementary source |

Routing is **uniform-API**: host CPU, memory, **and network** all come from the vCenter integration — the vCenter API carries usable per-host network throughput, so network attribution does **not** require per-host SNMP. Memory overcommit is the one host metric that comes only from the per-host SNMP path.

### How conditions are attributed

When a vSphere condition fires, Stratora routes the alert to the correct node:

- **Host conditions** (host CPU / memory / network high) → alert on the **ESXi host node**.
- **VM conditions** (VM CPU / memory high) → alert on the **VM's parent host node**. This is an aggregate model: the host carries its busiest VM's condition.
- **Datastore conditions** → alert on the **vCenter node** (datastores are cluster- and shared-scoped, not tied to a single host).
- **The vCenter appliance's own conditions** (its own CPU / memory / reachability) → alert on the **vCenter node**.

In a multi-host environment, each ESXi host is attributed independently — *N* hosts produce *N* host nodes, each carrying its own conditions.

:::caution Host alerts require the ESXi host to be onboarded
A vSphere host alerts on the host node **only once that ESXi host is onboarded into Stratora as a VMware Host node**. Stratora matches the host by name (the vCenter's `esxhostname` to the host node).

If a host is seen only through the vCenter integration and is **not** onboarded as its own VMware Host node, its host conditions cannot be attributed to a host node — Stratora **skips** them rather than guessing or mis-attributing, so they will not alert. **Memory overcommit** specifically requires the per-host SNMP onboarding (see [ESXi via SNMP](#esxi-via-snmp--host-level-monitoring-separate-from-the-vsphere-dashboards) above).
:::

---

## Summary

| Platform | Node type | How | Feeds |
|----------|-----------|-----|-------|
| Hyper-V | (agent-enrolled) | Install the Windows Agent | Hyper-V dashboard |
| VMware vSphere | vCenter Server Appliance | API: add node + VMware API credential + collector | vSphere dashboard (full inventory) |
| Proxmox VE | Proxmox VE | API: add one member + Proxmox API token + collector | Proxmox dashboard |
| ESXi (optional) | VMware Host | SNMP: add node + SNMP credential | Host-level metrics only |
