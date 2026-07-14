---
sidebar_label: Virtualization Hosts
title: Adding Virtualization Hosts
---

# Adding Virtualization Hosts

Stratora monitors three hypervisor platforms as first-class infrastructure — **VMware vSphere / vCenter**, **Proxmox VE**, and **Microsoft Hyper-V**. Once a hypervisor is onboarded, its per-platform dashboard (hosts, VMs with run-state, datastores, and capacity) generates automatically, and its hosts and guests fold into the site they belong to.

You onboard a hypervisor through Stratora's **guided add-paths**, which detect the platform and bind the credential for you. The sections below cover the guided flow, then the complete per-platform setup for each hypervisor.

---

## How you add a hypervisor

Stratora detects and classifies hypervisors on every onboarding path. You pick (or create) the credential; Stratora identifies the platform — vCenter, ESXi, Proxmox VE, or Hyper-V — and onboards it. Three paths reach the same result:

- **Setup wizard (Discovery step).** During first-run setup, the Discovery step scans your network, classifies discovered hosts by type — including hypervisors — and imports them with the right credential in one step.
- **IPAM subnet scan.** Scan a subnet from **Infrastructure → IPAM**. Discovered hypervisors surface in the results (the scan refreshes discovery hints automatically on completion); import them directly.
- **Add-node discovery.** Run a network discovery scan from **Collection → Discovery**. Stratora fingerprints each host, classifies hypervisors by type, and routes them through the credentialed import — you select a stored credential (or create one inline if none exists yet) and the node is created with the correct type and template.

On every path the outcome is the same: the hypervisor is onboarded, a collector runs the platform's probe, and the platform dashboard populates. Prefer the guided paths — the manual, node-by-node process is still available (see [Advanced (manual) onboarding](#advanced-manual-onboarding)) but is no longer the primary flow.

> Hyper-V is the exception to the credential model: a Hyper-V host is monitored by the **Stratora Windows Agent**, which self-reports the role — there is no hypervisor credential to bind. See [Hyper-V](#hyper-v-agent-based) below.

---

## Complete vSphere setup (both layers required)

VMware vSphere is the one platform where the complete picture takes **two layers**. Onboard **both** — they expose **different things**, and each covers what the other cannot.

### Layer 1 — vCenter (API): inventory and utilization breadth

The rich vSphere inventory comes from **vCenter via its API**. Onboard the vCenter appliance — through a guided add-path above, or manually as node type **vCenter Server Appliance** with a **VMware API** credential. The collector starts the vSphere probe and the **vSphere dashboard** populates.

The vCenter API gives you the **breadth**: every managed ESXi host, all VMs, datastores, per-host **CPU / memory / network** throughput, and the [vCenter management-plane view](#vcenter-management-plane-node-view).

### Layer 2 — each ESXi host as a VMware Host node (SNMP): overcommit + host-alert attribution

Onboard **each ESXi host as its own node** — node type **VMware Host**, using an **SNMP** credential — right after the vCenter. This is **not optional** for a complete setup; it is the second required layer.

Host CPU, memory, and network **utilization data are already collected by the vCenter API** (Layer 1) — the VMware Host node does **not** re-collect them. What Layer 2 adds is two things the vCenter API cannot provide on its own:

- **Memory overcommit** (allocated vs. physical) — the *one* host metric collected over per-host SNMP (the host's physical-RAM figure that the overcommit ratio divides by).
- **The node those host-level conditions attach to.** The host CPU / memory / network conditions — though the data comes from the vCenter API — attribute to the ESXi host's *own* node, matched by name (the vCenter's `esxhostname`). vSphere is the one platform whose inventory routes entirely through the vCenter, so an ESXi host has no node of its own until you add it. Without that node the condition has nowhere to land, and Stratora correctly **skips** it rather than mis-attributing it to the vCenter appliance.

### What each layer provides

| Layer | Node type | Provides | Without it |
|-------|-----------|----------|------------|
| **vCenter API** | vCenter Server Appliance (VMware API credential) | Managed hosts, VMs, datastores, per-host CPU/memory/network, the management-plane view | No inventory, no utilization breadth |
| **Per-host SNMP** | VMware Host — one per ESXi host (SNMP credential) | Memory overcommit; the attribution target for host-level alerts | **Host-level alerts don't fire; the memory-overcommit panel is empty** |

:::warning vCenter-only is an incomplete setup
Adding **only** the vCenter gives you inventory and utilization — but **no host-level alerts and an empty memory-overcommit panel**. Onboard each ESXi host as a VMware Host node to complete the picture.
:::

---

## Proxmox VE

Proxmox monitoring uses a **Proxmox VE API token**. Any cluster member's API returns cluster-wide data, so you onboard a whole cluster by adding **one** member — through a guided add-path, or manually as node type **Proxmox VE** with a cluster-wide **Proxmox VE API Token** credential:

1. Add **one** cluster member (or the single host, if standalone).
2. Use a **cluster-wide** token so it works against any member.
3. Assign a [collector](./collectors.md).

The other members are discovered and appear automatically on the next poll, and the **Proxmox dashboard** populates (cluster health, guests, storage, capacity). Unlike vSphere, a Proxmox host **is** its own node — there is no separate host-onboarding layer to add.

---

## Hyper-V (agent-based)

Hyper-V hosts are monitored by the **Stratora Windows Agent** — there are no credentials to manage; the agent itself is the trust.

1. Install the Stratora Windows Agent on the Hyper-V host (see [Agents](./agents.md)).
2. The agent enrolls and **self-reports the Hyper-V role** — the host appears as a Hyper-V node automatically.

The Hyper-V dashboard populates from the agent's data (hosts, VMs, clusters, memory pressure). As with Proxmox, a Hyper-V host **is** its own node — no second layer.

---

## vCenter management-plane node view

Open the vCenter appliance node and its detail view shows the inventory the way vCenter sees it — the management plane, inside Stratora:

- **Managed-hosts roster** — every ESXi host the vCenter manages, with connection state and VM count. Each host you've also onboarded as its own **VMware Host** node links straight to that node's detail (the two-tier link), so you can jump from the vCenter's view of a host to the host's own metrics and alerts.
- **VM roster (across all hosts)** — every VM the vCenter manages, with **run-state** (running / stopped), **guest OS**, and **uptime**.
- **Datastores** — capacity and usage, including **thin-provisioning** headroom (provisioned vs. allocated).

This is a read-only management-plane view; host-level alerting still comes from the per-host VMware Host nodes (Layer 2 above).

---

## Alert attribution (all platforms)

Stratora attributes each condition to the node it actually belongs to — a host problem shows up on the host, not on the management appliance. How the host node is determined differs by platform:

- **Proxmox VE and Hyper-V** — the host **is** its own node (a Proxmox VE node, or a Windows Server node running the agent). Host conditions attribute to it directly, and VM conditions to the VM's parent host node. No extra onboarding layer is needed.
- **VMware vSphere** — the outlier. Because inventory routes through the vCenter, host conditions attribute to the **ESXi host's own VMware Host node** — which is why Layer 2 of the [complete vSphere setup](#complete-vsphere-setup-both-layers-required) is required. If an ESXi host is seen only through the vCenter and is not onboarded as its own node, its host conditions are **skipped**, not mis-attributed to the vCenter.

### vSphere attribution detail

For vSphere, Stratora amalgamates host metrics from **two collection paths** and routes each condition to the correct node:

| Source | Provides | Role |
|--------|----------|------|
| **vCenter integration** (vCenter API) | Host **CPU %**, **memory %**, **network throughput**, **per-VM CPU/memory**, and **datastore capacity** | Primary source for host utilization |
| **Per-host SNMP** (the ESXi host onboarded as its own VMware Host node) | **Memory overcommit** (allocated vs. physical) | Supplementary — overcommit + host-alert attribution |

Routing is **uniform-API**: host CPU, memory, **and network** all come from the vCenter integration — the vCenter API carries usable per-host network throughput, so network attribution does **not** require per-host SNMP. Memory overcommit is the one host metric that comes only from the per-host SNMP path.

Condition routing:

- **Host conditions** (host CPU / memory / network high) → the **ESXi host node**.
- **VM conditions** (VM CPU / memory high) → the **VM's parent host node** — an aggregate model: the host carries its busiest VM's condition.
- **Datastore conditions** → the **vCenter node** (datastores are cluster- and shared-scoped, not tied to a single host).
- **The vCenter appliance's own conditions** (its CPU / memory / reachability) → the **vCenter node**.

In a multi-host environment each ESXi host is attributed independently — *N* hosts produce *N* host nodes, each carrying its own conditions.

:::caution Host alerts require the ESXi host to be onboarded
A vSphere host alerts on the host node **only once that ESXi host is onboarded as its own VMware Host node** (Layer 2 of the [complete vSphere setup](#complete-vsphere-setup-both-layers-required)). If a host is seen only through the vCenter integration, its host conditions cannot be attributed to a host node — Stratora **skips** them rather than guessing. **Memory overcommit** likewise requires the per-host SNMP onboarding.
:::

---

## Advanced (manual) onboarding

The guided add-paths above are the recommended way to onboard a hypervisor. The manual, node-by-node process still works if you prefer it, or need to onboard something the guided paths didn't classify:

1. **Add the node.** **Infrastructure → Nodes → Add Node**, choose the node type (**vCenter Server Appliance**, **Proxmox VE**, or **VMware Host**), and enter the address.
2. **Create the credential.** On the [Credentials](./credentials.md) page, add the matching credential — a **VMware API** credential (vCenter username + password), a **Proxmox VE API Token** (cluster-wide), or an **SNMP** credential for an ESXi VMware Host.
3. **Bind and assign.** Edit the node, attach the credential, and assign a [collector](./collectors.md).

Hyper-V has no manual credential path — it is always agent-based; see [Hyper-V](#hyper-v-agent-based).

---

## Summary

| Platform | Node type | How | Feeds |
|----------|-----------|-----|-------|
| VMware vSphere — Layer 1 | vCenter Server Appliance | Guided add-path, or API: node + VMware API credential + collector | vSphere dashboard (inventory, utilization, management-plane view) |
| VMware vSphere — Layer 2 (required) | VMware Host — one per ESXi host | SNMP: node + SNMP credential | Memory overcommit + host-level alert attribution |
| Proxmox VE | Proxmox VE | Guided add-path, or API: one member + cluster-wide token + collector | Proxmox dashboard (cluster, guests, storage) |
| Microsoft Hyper-V | (agent-enrolled) | Install the Windows Agent | Hyper-V dashboard |
