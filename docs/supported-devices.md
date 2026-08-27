---
title: Supported Devices
sidebar_label: Supported Devices
sidebar_position: 25
---

{/* GENERATED FILE — do not edit by hand. Source: the `validation:` block in
    each config/templates/devices/*.yaml in the Stratora repo, rendered by
    internal/templates.GenerateCustomerMatrix. Regenerate + publish from there. */}

# Supported Devices

Which devices Stratora monitors, how each is recognized when you scan, and what alerting applies. This page is generated from the same validation records that drive the product, so it does not drift from what actually ships.

## Will my device be found automatically?

When you run discovery, Stratora identifies devices by their SNMP fingerprint. Three outcomes:

- **Auto-recognized** — found automatically; recognition confirmed against real hardware or a captured firmware walk.
- **Auto-recognized (unverified)** — the fingerprint pattern is in place and should match, but has not yet been confirmed against a real unit. It will usually still be found; it simply is not yet proven.
- **Manual add** — not found on a scan because no fingerprint exists yet; you add the device by hand. This is a known, closable gap for the affected model, not a permanent limitation.

Servers are **enrolled** through the Stratora Agent rather than scanned; vCenter is **API-connected**; the generic templates apply to **any host**.

## Validation badges

- **Validated** — verified against a real physical device on the bench.
- **Replay-validated** — verified against a **captured firmware walk replayed in a simulator; no physical device was involved.** Metric queries resolve, but because replayed counters do not move, alert *firing* is not proven on this basis.
- **MIB-derived** — built from vendor MIB documentation and not yet verified against any device.

## A note on environmental alerting

Environmental alerting (temperature, fan, PSU) is available on the **Server BMC** templates (Dell iDRAC, HPE iLO) — polled out-of-band from the server's management controller. It is **not** available on network-device templates (switches, routers, firewalls, access points): where those devices expose sensors, Stratora does not yet collect them in a usable form. If you need environmental alerts on network gear today, plan around this limitation.

## Device matrix

| Device type | Manufacturer | Model series | Recognition | Validation | Alerts |
|---|---|---|---|---|---|
| Switch | Arista | DCS Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU |
| Switch | Cisco | Catalyst | Manual add | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Switch | Cisco | Nexus (NX-OS) | Auto-recognized | **Replay-validated** | Reachability · Interface · CPU |
| Switch | Cisco | SG300 | Auto-recognized | **Validated** | Reachability · Interface · CPU |
| Switch | Cisco Meraki | MS Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface |
| Switch | Fortinet | FortiSwitch | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Switch | Juniper Networks | EX Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Switch | Ruckus/Brocade | ICX Series | Auto-recognized | **Replay-validated** | Reachability · Interface · CPU · Memory |
| Switch | TP-Link | Omada/JetStream | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface |
| Switch | Ubiquiti | UniFi Switch | Auto-recognized | **Validated** | Reachability · Interface |
| Router | Cisco | IOS-XE | Auto-recognized | **Replay-validated** | Reachability · Interface · CPU · Memory |
| Router | Juniper Networks | MX Series | Auto-recognized | **Replay-validated** | Reachability · Interface · CPU · Memory |
| Firewall | Cisco Meraki | MX Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface |
| Firewall | Fortinet | FortiGate | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Firewall | Juniper Networks | SRX Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Firewall | Palo Alto Networks | PA-Series | Auto-recognized | **Validated** | Reachability · Interface · CPU |
| Access Point | Aruba Networks (HPE) | IAP / AP Series | Auto-recognized | **Validated** | Reachability · Interface · CPU · Memory |
| Access Point | Cisco | Aironet (Autonomous) | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Access Point | Cisco Meraki | MR Series | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface |
| Access Point | Fortinet | FortiAP | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface · CPU · Memory |
| Wireless Controller | Ruckus/CommScope | SmartZone | Auto-recognized (unverified) | **MIB-derived** | Reachability · Interface |
| NAS / Storage | QNAP | NAS | Auto-recognized | **Validated** | Reachability · Interface · Disk temperature · RAID / volume status |
| NAS / Storage | Synology | DiskStation | Auto-recognized | **Validated** | Reachability · Interface · Disk temperature · RAID / volume status |
| Server BMC (out-of-band) | Dell | iDRAC | Auto-recognized (unverified) | **MIB-derived** | Reachability · Temperature · Fan · PSU · PSU redundancy · Disk/RAID · Memory |
| Server BMC (out-of-band) | HPE | iLO | Auto-recognized (unverified) | **MIB-derived** | Reachability · Temperature · Fan · PSU · PSU redundancy · Disk/RAID · Memory |
| Hypervisor (VMware ESXi) | VMware | ESXi | Auto-recognized | **Validated** | Reachability · Interface · Memory overcommit · Datastore capacity |
| Hypervisor mgmt (vCenter) | VMware | vCenter Server | API-connected | **Validated** | Reachability · Memory overcommit · Datastore capacity |
| Server | Any (OS-based) | Linux Server | Enrolled (agent) | **Validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Server | Any (OS-based) | Windows Server | Enrolled (agent) | **Validated** | Reachability · CPU · Memory · Disk · Network · Service state |
| Generic | — | HTTP Check | Any host | **Validated** | HTTP/HTTPS status · SSL-certificate expiry · Reachability |
| Generic | — | ICMP Ping | Any host | **Validated** | Reachability (device down, packet loss, response time) |
| Generic | — | WAN Circuit | Any host | **Validated** | Latency · jitter · packet loss (Reachability) |
| Out-of-band (IPMI · Redfish) | non-SNMP BMCs (Supermicro · Lenovo · Cisco · generic) | — | — | **Not supported** | Dell iDRAC + HPE iLO are supported over SNMP (rows above). IPMI is a deliberate exclusion for security reasons; Redfish is on the roadmap |

Every row is derived from a device template's validation record. Hyper-V, Proxmox, and Nutanix are monitored through their own agent/API collectors rather than an SNMP template, so they are covered separately, not in this SNMP-oriented matrix.
