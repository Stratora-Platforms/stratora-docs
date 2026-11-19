---
title: Supported Devices
sidebar_label: Supported Devices
sidebar_position: 25
description: Which devices Stratora monitors, how each is recognized during discovery, how thoroughly each has been validated, and what alerting applies.
---

{/* Generated file: do not edit by hand. It is regenerated from the product
    repository's validation records and republished. */}

# Supported Devices

Which devices Stratora monitors, how each is recognized when you scan, how thoroughly each has been validated, and what alerting applies. This page is built from the same validation records that drive the product, and describes the current release.

## Will my device be found automatically?

When you run discovery, Stratora identifies devices by their SNMP fingerprint. Three outcomes:

- **Auto-recognized** — found automatically; recognition confirmed against real hardware or a captured firmware walk.
- **Auto-recognized (unverified)** — the fingerprint pattern is in place and should match, but has not been confirmed against a real unit. It will usually still be found; it is not proven.
- **Manual add** — not found on a scan because no fingerprint exists for it; you add the device by hand.

Servers are **enrolled** through the Stratora Agent rather than scanned; vCenter is **API-connected**; the generic templates apply to **any host**. Proxmox VE is API-connected and Hyper-V is monitored through the agent; see [How virtualization platforms are monitored](#how-virtualization-platforms-are-monitored).

## Validation levels

Every device is shown at one of three levels:

- **Real-world validated** — tested against a real physical device (or, for vCenter, a real vCenter Server), with the data checked end to end.
- **Simulated** — tested against a recorded SNMP dataset replayed in an SNMP simulator; **no physical device was involved.** The recording is either a capture from a real device's firmware or, for the Dell iDRAC and HPE iLO, a published test recording with the vendor's real data structures. Metric queries are proven to resolve, and status alerts can be proven to fire from a recorded fault. Because replayed counters do not move, rate and counter alerts (for example interface errors) are not proven to *fire* at this level. For Proxmox VE, Simulated means tested in a lab against a cluster running in virtual machines, not on physical servers.
- **Code only** — implemented from the vendor's MIB documentation and covered by automated tests, but not checked against a real device or a recording of one.

The level shown in the matrix is the highest level reached by any of the device's core features: interfaces, CPU and memory for network devices; power, temperature, fan and memory health for server BMCs; CPU, memory, disk and network for servers; and the API connection for vCenter. Every feature, core or not, that sits at a different level is listed under [Features at a different level](#features-at-a-different-level).

## A note on environmental alerting

Environmental alerting (temperature, fan, PSU) is available on the **Server BMC** templates (Dell iDRAC, HPE iLO) — polled out-of-band from the server's management controller — and on the QNAP and Synology NAS templates. Room temperature and humidity alerting is available on the **Environmental sensor** templates, and power alerting (on battery, battery low, runtime, overload) on the **UPS** and **PDU** templates. It is **not** available on network-device templates (switches, routers, firewalls, access points): some of those templates collect sensor readings (listed under Features at a different level), but no built-in alert uses them.

## Device matrix

| Device type | Manufacturer | Model series | Recognition | Validation | Alerts |
|---|---|---|---|---|---|
| Switch | Arista | DCS Series | Auto-recognized | **Simulated** | Reachability · Interface · Spanning tree |
| Switch | Cisco | Catalyst | Manual add | **Simulated** | Reachability · Interface · Spanning tree |
| Switch | Cisco | Nexus (NX-OS) | Auto-recognized | **Simulated** | Reachability · Interface · Spanning tree |
| Switch | Cisco | SG300 | Auto-recognized | **Real-world validated** | Reachability · Interface · Spanning tree · CPU |
| Switch | Cisco Meraki | MS Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface · Spanning tree |
| Switch | Fortinet | FortiSwitch | Auto-recognized (unverified) | **Code only** | Reachability · Interface · Spanning tree |
| Switch | Juniper Networks | EX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface · Spanning tree |
| Switch | Ruckus/Brocade | ICX Series | Auto-recognized | **Simulated** | Reachability · Interface · Spanning tree |
| Switch | TP-Link | Omada/JetStream | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Switch | Ubiquiti | UniFi Switch | Auto-recognized | **Real-world validated** | Reachability · Interface |
| Router | Cisco | IOS-XE | Auto-recognized | **Simulated** | Reachability · Interface |
| Router | Juniper Networks | MX Series | Auto-recognized | **Simulated** | Reachability · Interface |
| Firewall | Cisco Meraki | MX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Firewall | Fortinet | FortiGate | Auto-recognized | **Simulated** | Reachability · Interface |
| Firewall | Juniper Networks | SRX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Firewall | Palo Alto Networks | PA-Series | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU |
| Access Point | Aruba Networks (HPE) | IAP / AP Series | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU · Memory |
| Access Point | Cisco | Aironet (Autonomous) | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Access Point | Cisco Meraki | MR Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Access Point | Fortinet | FortiAP | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Wireless Controller | Ruckus/CommScope | SmartZone | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| NAS / Storage | QNAP | NAS | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU · Disk temperature · RAID / volume status · System temperature · Fan |
| NAS / Storage | Synology | DiskStation | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU · Memory · Disk temperature · RAID / volume status · System temperature · Fan · PSU |
| Server BMC (out-of-band) | Dell | iDRAC | Auto-recognized (unverified) | **Simulated** | Reachability · Temperature · Fan · PSU · PSU redundancy |
| Server BMC (out-of-band) | HPE | iLO | Auto-recognized (unverified) | **Code only** | Reachability · Temperature · Fan · PSU · PSU redundancy |
| UPS | APC | Smart-UPS | Auto-recognized (unverified) | **Code only** | Reachability · On battery · Battery low · Runtime low · UPS overload |
| UPS | Eaton | UPS (XUPS-MIB) | Auto-recognized (unverified) | **Code only** | Reachability · On battery · Battery low · Runtime low · UPS overload |
| UPS | Generic | RFC 1628 UPS-MIB | Auto-recognized (unverified) | **Code only** | Reachability · On battery · Battery low · Runtime low · UPS overload |
| PDU | APC | Rack PDU (rPDU2) | Auto-recognized (unverified) | **Code only** | Reachability · PDU overload · PDU phase overload · PDU bank overload |
| PDU | Eaton | ePDU (G3/G4) | Auto-recognized (unverified) | **Code only** | Reachability · PDU phase overload · PDU bank overload |
| PDU | Raritan | PX (PDU2-MIB) | Auto-recognized (unverified) | **Code only** | Reachability · PDU overload · PDU phase overload · PDU bank overload |
| PDU | ServerTech | Sentry4 | Auto-recognized (unverified) | **Code only** | Reachability · PDU overload · PDU phase overload · PDU bank overload |
| Environmental sensor | APC | NetBotz 750/755 | Auto-recognized (unverified) | **Code only** | Reachability · Temperature out of range · Humidity out of range |
| Environmental sensor | Generic | ENTITY-SENSOR-MIB | Manual add | **Code only** | Reachability · Temperature out of range · Humidity out of range |
| Environmental sensor | Vertiv | Geist Watchdog (V5) | Manual add | **Code only** | Reachability · Temperature out of range · Humidity out of range |
| Hypervisor (VMware ESXi) | VMware | ESXi | Auto-recognized | **Real-world validated** | Reachability · Interface · Memory overcommit · Host CPU, host memory, host network, VM CPU, VM memory (via vCenter Server) |
| Hypervisor mgmt (vCenter) | VMware | vCenter Server | API-connected | **Real-world validated** | Reachability · Datastore capacity |
| Server | Any (OS-based) | Linux Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Service state |
| Server | Any (OS-based) | Windows Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Generic | — | HTTP Check | Any host | **Real-world validated** | Reachability · HTTP/HTTPS status · Response time · SSL-certificate expiry |
| Generic | — | ICMP Ping | Any host | **Real-world validated** | Reachability (device down, packet loss, latency, jitter) |
| Generic | — | WAN Circuit | Any host | **Real-world validated** | Reachability (device down, packet loss, latency, jitter) |
| Out-of-band (IPMI · Redfish) | non-SNMP BMCs (Supermicro · Lenovo · Cisco · generic) | — | — | **Not supported** | Dell iDRAC + HPE iLO are supported over SNMP (rows above). IPMI is a deliberate exclusion for security reasons; Redfish is not supported |

Every row is derived from a device template's validation record. The Alerts column lists only the built-in alerts Stratora evaluates for that device's collected data; Reachability (device down) applies to every device. Proxmox VE and Hyper-V have no device template, so they are not rows in this matrix; they are described, with their validation levels, under [How virtualization platforms are monitored](#how-virtualization-platforms-are-monitored).

## Features at a different level

Some devices have features that sit at a different level from the device's row above. Rely on the level shown here for these features.

| Device | Feature | Validation |
|---|---|---|
| Arista DCS Series | Environmental sensors, routing protocol state (BGP / OSPF), spanning tree | **Code only** |
| Cisco Catalyst | Environmental sensors | **Code only** |
| Cisco Nexus (NX-OS) | Memory | **Code only** |
| Cisco SG300 | PoE | **Code only** |
| Cisco IOS-XE | CPU, memory, routing protocol state (BGP / OSPF) | **Code only** |
| Fortinet FortiGate | IPsec VPN tunnels | **Code only** |
| QNAP NAS | Memory | **Code only** |
| QNAP NAS | CPU, disk temperature and status, environmental sensors, fan status, power status, RAID / volume status | **Code only** ¹ |
| Synology DiskStation | CPU, disk temperature and status, environmental sensors, fan status, memory, power status, RAID / volume status, volume I/O, storage I/O | **Code only** ¹ |
| Dell iDRAC | Temperature and fan status; discovery fingerprint | **Code only** |
| HPE iLO | Physical drive status, system information | **Simulated** |
| VMware ESXi | CPU, hardware inventory, memory, hardware sensors, storage, VM metrics | **Code only** ¹ |
| VMware vCenter Server | Cluster metrics | **Code only** |
| VMware vCenter Server | Datastore metrics, host metrics, VM metrics | **Code only** ¹ |

¹ The device is in our own environment and this data is collected from it, but each metric has not been individually checked and signed off, so we do not claim it as validated.

Metrics that a device does not expose over SNMP, or that its template does not collect, are not listed here.

## How virtualization platforms are monitored

Stratora monitors three hypervisor platforms. Each is collected differently, and each is validated to a different level. For setup, see [Adding Virtualization Hosts](/docs/collection/virtualization) and [Virtualization Prerequisites](/docs/prerequisites/virtualization).

| Platform | How Stratora collects | Credential | Validation |
|---|---|---|---|
| Proxmox VE | A Stratora Collector polls the Proxmox VE API over HTTPS | Proxmox VE API token | **Simulated** (lab cluster in virtual machines) |
| VMware vSphere | A Stratora Collector polls the vCenter Server API over HTTPS; each ESXi host is also polled over SNMP | vCenter user name and password; SNMP for ESXi | **Real-world validated** for the vCenter connection and ESXi interfaces; most metrics **Code only** |
| Microsoft Hyper-V | The Stratora Windows Agent on each Hyper-V host | None (the agent is enrolled) | **Real-world validated** on a physical Hyper-V host for host counters, VM inventory, VM state and health, and per-VM CPU; some features at other levels |

The cross-platform **VM Unexpectedly Off** alert applies to all three platforms. It is off by default and is turned on per VM.

### Proxmox VE

**Validation: Simulated.** Tested in a lab against a three-node Proxmox VE 9 cluster running in virtual machines. Inventory, metrics and the host-down alert were checked end to end. No physical Proxmox VE deployment was involved. The other alerts listed below are implemented and evaluated on the collected data, but have not each been proven to fire.

- **Connection.** A Stratora Collector polls the Proxmox VE REST API over HTTPS (port 8006) with a Proxmox VE API token. User name and password sign-in is not supported. Add one cluster member; the other members are discovered and added automatically. The inventory is polled every 60 seconds.
- **Versions.** Proxmox VE 9 is the version tested. Proxmox VE 8 is handled in the code but has not been tested. Earlier versions are not supported.
- **Certificates.** The collector verifies the certificate of every Proxmox VE node it polls: the certificate must be issued by a CA that the collector host trusts, or be a self-signed certificate that an administrator has trusted. See [vCenter and Proxmox certificates](/docs/collection/virtualization#vcenter-and-proxmox-certificates).
- **Discovered.** The cluster (name, quorum, votes and members); each Proxmox VE host, as its own node; QEMU virtual machines and LXC containers; storage pools; physical disks with SMART health and wear level; network interfaces, bonds and bridges; tasks; HA resources; replication jobs; guest snapshots.
- **Metrics kept over time.** Per host: CPU, memory, root disk, swap, load average, uptime and total network throughput. Per storage pool: used and total space. Guest CPU, memory, disk and network figures are shown as current values only; their history is not kept.
- **Built-in alerts.** Device down; CPU; Memory; PVE Storage Pool Full; PVE Network Throughput High; Cluster Not Quorate; HA Resource Error; Task Failed (backup, migration, restore and start tasks); Snapshot Age High; Snapshot Chain Depth High.
- **Not collected.** Ceph health, Proxmox Backup Server, per-interface network throughput, and guest metric history.

### VMware vSphere

**Validation.** The vCenter API connection is **Real-world validated** against a real vCenter Server in a lab: sign-in, the inventory of hosts, VMs and datastores, and the performance data arrived end to end. ESXi interfaces and identity over SNMP are **Real-world validated**, tested on a physical ESXi host. The individual metric families (host, VM, cluster and datastore metrics; ESXi CPU, memory and sensors) are **Code only**; see [Features at a different level](#features-at-a-different-level).

- **Connection.** A Stratora Collector connects to vCenter Server over HTTPS with a vCenter user name and password. Performance counters are read through the vSphere API every 5 minutes, and the inventory of hosts, VMs and datastores through the vCenter REST API every 5 minutes. Each ESXi host is also added as its own node and polled over SNMP (v2c or v3): host and VM alerts are attributed to that node, and memory overcommit needs it.
- **Versions.** Stratora uses the vCenter REST API (`/api`), which vCenter Server provides from version 7.0 Update 2. No specific vCenter version has been certified. A standalone ESXi host without vCenter can be monitored over SNMP only, with no VM inventory and no performance counters.
- **Certificates.** As for Proxmox VE: a certificate issued by a CA that the collector host trusts, or a self-signed certificate that an administrator has trusted.
- **Discovered.** ESXi hosts (connection and power state), virtual machines (power state, vCPUs, memory, and guest IP addresses when VMware Tools runs) and datastores (capacity and free space).
- **Metrics.** Cluster CPU and memory; host CPU, memory, network, disk, uptime and power; VM CPU, CPU ready, memory, network, virtual-disk throughput and latency, and uptime; datastore capacity, provisioned and used space.
- **Built-in alerts.** See the vCenter Server and ESXi rows in the [device matrix](#device-matrix). Host Disconnected also applies to ESXi hosts that vCenter reports as disconnected.
- **Not collected.** Datacenter, cluster and resource-pool inventory; vSAN; vCenter alarms and events; VM snapshots.

### Microsoft Hyper-V

**Validation.** Tested on a physical Hyper-V host with this release. **Real-world validated:** host performance counters (CPU, memory, disk, network); automatic detection of the Hyper-V role; the VM inventory (name, run state, configuration version, vCPUs); VM run state and the VM health summary; per-VM CPU, which matched the host's own counters; host uptime and reachability. The Snapshot Age High and Snapshot Chain Depth High alerts have fired on that host. The Hyper-V VM Health Critical alert has not been proven to fire, because no VM went into a critical state during testing.

Per-VM storage is **Code only**. The used space counts only the disk file the VM is running on now, so a VM that runs on a checkpoint is undercounted. Failover-cluster data (each VM's owner node, quorum, witness and node state) is **Code only** for this release: it was checked on a lab cluster during development, but not re-tested on this release. Cluster Shared Volumes and VM moves between cluster nodes are not validated.

- **Connection.** The Stratora Windows Agent on the Hyper-V host. When the agent finds the Hyper-V role running, it collects Hyper-V data automatically. There is no credential and no API connection. The host stays a Windows Server node, with the Windows Server alerts.
- **Collected.** Hypervisor counters (logical and virtual processors, partitions, run time). Per VM: dynamic memory and memory pressure, virtual processor run time, virtual storage throughput, operations, errors and latency, virtual network adapter traffic and dropped packets, and the VM health summary. The VM inventory (run state, configuration version, vCPUs, memory, uptime, IPv4 addresses, virtual disk sizes and snapshots) is read with PowerShell. On a failover-cluster member: the cluster, each VM's owner node, quorum, witness and node state.
- **Built-in alerts.** The Windows Server alerts, plus Hyper-V Host Network Throughput High; Hyper-V VM Memory Pressure High; Hyper-V VM Health Critical; Cluster Not Quorate; Cluster Node Down; Snapshot Age High; Snapshot Chain Depth High.
- **Not collected.** The VM generation (the configuration version is shown instead); the per-VM integration-services heartbeat; Cluster Shared Volume storage.
