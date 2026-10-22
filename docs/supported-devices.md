---
title: Supported Devices
sidebar_label: Supported Devices
sidebar_position: 25
---

{/* Source of truth: the `validation:` block in each config/templates/devices/*.yaml
    in the Stratora repo, normally rendered by internal/templates.GenerateCustomerMatrix.
    The validation-level wording and the "Features at a different level" section were
    updated by hand; update the generator to match before the next regeneration, or
    regenerating will undo them. */}

# Supported Devices

Which devices Stratora monitors, how each is recognized when you scan, how thoroughly each has been validated, and what alerting applies. This page is built from the same validation records that drive the product, and describes the current release.

## Will my device be found automatically?

When you run discovery, Stratora identifies devices by their SNMP fingerprint. Three outcomes:

- **Auto-recognized** — found automatically; recognition confirmed against real hardware or a captured firmware walk.
- **Auto-recognized (unverified)** — the fingerprint pattern is in place and should match, but has not yet been confirmed against a real unit. It will usually still be found; it simply is not yet proven.
- **Manual add** — not found on a scan because no fingerprint exists yet; you add the device by hand. This is a known, closable gap for the affected model, not a permanent limitation.

Servers are **enrolled** through the Stratora Agent rather than scanned; vCenter is **API-connected**; the generic templates apply to **any host**.

## Validation levels

Every device is shown at one of three levels:

- **Real-world validated** — tested against a real physical device (or, for vCenter, a real vCenter Server), with the data checked end to end.
- **Simulated** — tested against a recorded SNMP dataset replayed in an SNMP simulator; **no physical device was involved.** The recording is either a capture from a real device's firmware or, for the Dell iDRAC and HPE iLO, a published test recording with the vendor's real data structures. Metric queries are proven to resolve, and status alerts can be proven to fire from a recorded fault. Because replayed counters do not move, rate and counter alerts (for example interface errors) are not proven to *fire* at this level.
- **Code only** — implemented from the vendor's MIB documentation and covered by automated tests, but not yet checked against a real device or a recording of one.

The level shown in the matrix is the one reached by the device's core monitoring: interfaces, CPU and memory for network devices, and hardware health for server BMCs. Where a device's other features sit at a different level, they are listed under [Features at a different level](#features-at-a-different-level).

## A note on environmental alerting

Environmental alerting (temperature, fan, PSU) is available on the **Server BMC** templates (Dell iDRAC, HPE iLO) — polled out-of-band from the server's management controller. It is **not** available on network-device templates (switches, routers, firewalls, access points): where those devices expose sensors, Stratora does not yet collect them in a usable form. If you need environmental alerts on network gear today, plan around this limitation.

## Device matrix

| Device type | Manufacturer | Model series | Recognition | Validation | Alerts |
|---|---|---|---|---|---|
| Switch | Arista | DCS Series | Auto-recognized | **Simulated** | Reachability · Interface · CPU |
| Switch | Cisco | Catalyst | Manual add | **Simulated** | Reachability · Interface · CPU · Memory |
| Switch | Cisco | Nexus (NX-OS) | Auto-recognized | **Simulated** | Reachability · Interface · CPU |
| Switch | Cisco | SG300 | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU |
| Switch | Cisco Meraki | MS Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Switch | Fortinet | FortiSwitch | Auto-recognized (unverified) | **Code only** | Reachability · Interface · CPU · Memory |
| Switch | Juniper Networks | EX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface · CPU · Memory |
| Switch | Ruckus/Brocade | ICX Series | Auto-recognized | **Simulated** | Reachability · Interface · CPU · Memory |
| Switch | TP-Link | Omada/JetStream | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Switch | Ubiquiti | UniFi Switch | Auto-recognized | **Real-world validated** | Reachability · Interface |
| Router | Cisco | IOS-XE | Auto-recognized | **Simulated** | Reachability · Interface · CPU · Memory |
| Router | Juniper Networks | MX Series | Auto-recognized | **Simulated** | Reachability · Interface · CPU · Memory |
| Firewall | Cisco Meraki | MX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Firewall | Fortinet | FortiGate | Auto-recognized | **Simulated** | Reachability · Interface · CPU · Memory |
| Firewall | Juniper Networks | SRX Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface · CPU · Memory |
| Firewall | Palo Alto Networks | PA-Series | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU |
| Access Point | Aruba Networks (HPE) | IAP / AP Series | Auto-recognized | **Real-world validated** | Reachability · Interface · CPU · Memory |
| Access Point | Cisco | Aironet (Autonomous) | Auto-recognized (unverified) | **Code only** | Reachability · Interface · CPU · Memory |
| Access Point | Cisco Meraki | MR Series | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| Access Point | Fortinet | FortiAP | Auto-recognized (unverified) | **Code only** | Reachability · Interface · CPU · Memory |
| Wireless Controller | Ruckus/CommScope | SmartZone | Auto-recognized (unverified) | **Code only** | Reachability · Interface |
| NAS / Storage | QNAP | NAS | Auto-recognized | **Real-world validated** | Reachability · Interface · Disk temperature · RAID / volume status |
| NAS / Storage | Synology | DiskStation | Auto-recognized | **Real-world validated** | Reachability · Interface · Disk temperature · RAID / volume status |
| Server BMC (out-of-band) | Dell | iDRAC | Auto-recognized (unverified) | **Simulated** | Reachability · Temperature · Fan · PSU · PSU redundancy · Disk/RAID · Memory |
| Server BMC (out-of-band) | HPE | iLO | Auto-recognized (unverified) | **Code only** | Reachability · Temperature · Fan · PSU · PSU redundancy · Disk/RAID · Memory |
| Hypervisor (VMware ESXi) | VMware | ESXi | Auto-recognized | **Real-world validated** | Reachability · Interface · Memory overcommit · Datastore capacity |
| Hypervisor mgmt (vCenter) | VMware | vCenter Server | API-connected | **Real-world validated** | Reachability · Memory overcommit · Datastore capacity |
| Server | Any (OS-based) | Linux Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Server | Any (OS-based) | Windows Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Generic | — | HTTP Check | Any host | **Real-world validated** | HTTP/HTTPS status · SSL-certificate expiry · Reachability |
| Generic | — | ICMP Ping | Any host | **Real-world validated** | Reachability (device down, packet loss, response time) |
| Generic | — | WAN Circuit | Any host | **Real-world validated** | Latency · jitter · packet loss (Reachability) |
| Out-of-band (IPMI · Redfish) | non-SNMP BMCs (Supermicro · Lenovo · Cisco · generic) | — | — | **Not supported** | Dell iDRAC + HPE iLO are supported over SNMP (rows above). IPMI is a deliberate exclusion for security reasons; Redfish is on the roadmap |

Every row is derived from a device template's validation record. Hyper-V, Proxmox, and Nutanix are monitored through their own agent/API collectors rather than an SNMP template, so they are covered separately, not in this SNMP-oriented matrix.

## Features at a different level

Some devices have features that sit at a different level from the device's row above. Rely on the level shown here for these features.

| Device | Feature | Validation |
|---|---|---|
| Arista DCS Series | BGP peer state, spanning tree | **Code only** |
| Cisco SG300 | PoE consumption | **Code only** |
| Cisco IOS-XE | CPU, memory | **Code only** |
| Cisco IOS-XE | BGP and OSPF state | **Code only** |
| QNAP NAS | Disk temperature, RAID / volume status, fan and power status, CPU | **Code only** |
| Synology DiskStation | Disk temperature, RAID / volume status, fan and power status, component health, CPU, memory | **Code only** |
| Dell iDRAC | Discovery fingerprint | **Code only** |
| HPE iLO | Physical drive status | **Simulated** |
| HPE iLO | Temperature, fan, PSU, PSU redundancy, memory status; discovery fingerprint | **Code only** |
| VMware ESXi | CPU, memory, hardware sensors, storage, VM metrics, memory overcommit, datastore capacity | **Code only** ¹ |
| VMware vCenter Server | Cluster, host, VM and datastore metrics, memory overcommit, datastore capacity | **Code only** ¹ |

¹ These run against a real ESXi host and a real vCenter Server in our own environment, but each metric has not yet been individually checked and signed off, so we do not yet claim them as validated. The real-world validated level for these rows covers discovery, the API or SNMP connection, and (for ESXi) interface monitoring.

Metrics that a device does not expose over SNMP, or that its template does not collect yet, are not listed here.
