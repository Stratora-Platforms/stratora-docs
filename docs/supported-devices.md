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
- **Auto-recognized (unverified)** — the fingerprint pattern is in place and should match, but has not yet been confirmed against a real unit. It will usually still be found; it simply is not yet proven.
- **Manual add** — not found on a scan because no fingerprint exists yet; you add the device by hand. This is a known, closable gap for the affected model, not a permanent limitation.

Servers are **enrolled** through the Stratora Agent rather than scanned; vCenter is **API-connected**; the generic templates apply to **any host**.

## Validation levels

Every device is shown at one of three levels:

- **Real-world validated** — tested against a real physical device (or, for vCenter, a real vCenter Server), with the data checked end to end.
- **Simulated** — tested against a recorded SNMP dataset replayed in an SNMP simulator; **no physical device was involved.** The recording is either a capture from a real device's firmware or, for the Dell iDRAC and HPE iLO, a published test recording with the vendor's real data structures. Metric queries are proven to resolve, and status alerts can be proven to fire from a recorded fault. Because replayed counters do not move, rate and counter alerts (for example interface errors) are not proven to *fire* at this level.
- **Code only** — implemented from the vendor's MIB documentation and covered by automated tests, but not yet checked against a real device or a recording of one.

The level shown in the matrix is the highest level reached by any of the device's core features: interfaces, CPU and memory for network devices; power, temperature, fan and memory health for server BMCs; CPU, memory, disk and network for servers; and the API connection for vCenter. Every feature, core or not, that sits at a different level is listed under [Features at a different level](#features-at-a-different-level).

## A note on environmental alerting

Environmental alerting (temperature, fan, PSU) is available on the **Server BMC** templates (Dell iDRAC, HPE iLO) — polled out-of-band from the server's management controller — and on the QNAP and Synology NAS templates. It is **not** available on network-device templates (switches, routers, firewalls, access points): some of those templates collect sensor readings (listed under Features at a different level), but no built-in alert uses them yet. If you need environmental alerts on network gear today, plan around this limitation.

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
| Hypervisor (VMware ESXi) | VMware | ESXi | Auto-recognized | **Real-world validated** | Reachability · Interface · Memory overcommit · Host CPU, host memory, host network, VM CPU, VM memory (via vCenter Server) |
| Hypervisor mgmt (vCenter) | VMware | vCenter Server | API-connected | **Real-world validated** | Reachability |
| Server | Any (OS-based) | Linux Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Service state |
| Server | Any (OS-based) | Windows Server | Enrolled (agent) | **Real-world validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Generic | — | HTTP Check | Any host | **Real-world validated** | Reachability · HTTP/HTTPS status · Response time · SSL-certificate expiry |
| Generic | — | ICMP Ping | Any host | **Real-world validated** | Reachability (device down, packet loss, latency, jitter) |
| Generic | — | WAN Circuit | Any host | **Real-world validated** | Reachability (device down, packet loss, latency, jitter) |
| Out-of-band (IPMI · Redfish) | non-SNMP BMCs (Supermicro · Lenovo · Cisco · generic) | — | — | **Not supported** | Dell iDRAC + HPE iLO are supported over SNMP (rows above). IPMI is a deliberate exclusion for security reasons; Redfish is on the roadmap |

Every row is derived from a device template's validation record. The Alerts column lists only the built-in alerts Stratora evaluates for that device's collected data; Reachability (device down) applies to every device. Hyper-V, Proxmox, and Nutanix are monitored through their own agent/API collectors rather than an SNMP template, so they are covered separately, not in this SNMP-oriented matrix.

## Features at a different level

Some devices have features that sit at a different level from the device's row above. Rely on the level shown here for these features.

| Device | Feature | Validation |
|---|---|---|
| Arista DCS Series | Environmental sensors, routing protocol state (BGP / OSPF), spanning tree | **Code only** |
| Cisco Catalyst | Environmental sensors | **Code only** |
| Cisco Nexus (NX-OS) | Memory | **Code only** |
| Cisco SG300 | PoE | **Code only** |
| Cisco IOS-XE | CPU, memory, routing protocol state (BGP / OSPF) | **Code only** |
| QNAP NAS | Memory | **Code only** |
| QNAP NAS | CPU, disk temperature and status, environmental sensors, fan status, power status, RAID / volume status | **Code only** ¹ |
| Synology DiskStation | CPU, disk temperature and status, environmental sensors, fan status, memory, power status, RAID / volume status, volume I/O, storage I/O | **Code only** ¹ |
| Dell iDRAC | Temperature and fan status; discovery fingerprint | **Code only** |
| HPE iLO | Physical drive status, system information | **Simulated** |
| VMware ESXi | CPU, hardware inventory, memory, hardware sensors, storage, VM metrics | **Code only** ¹ |
| VMware vCenter Server | Datastore metrics | **Code only** |
| VMware vCenter Server | Cluster metrics, host metrics, VM metrics | **Code only** ¹ |

¹ The device is in our own environment and this data is collected from it, but each metric has not yet been individually checked and signed off, so we do not yet claim it as validated.

Metrics that a device does not expose over SNMP, or that its template does not collect yet, are not listed here.
