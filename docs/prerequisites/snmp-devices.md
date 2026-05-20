---
title: SNMP Devices
sidebar_label: SNMP Devices
sidebar_position: 50
---

# SNMP Devices

Prerequisites for network devices — switches, firewalls, access points, NAS — that you'll monitor with a Stratora Collector via SNMP.

## SNMP versions supported

Stratora supports SNMPv2c and SNMPv3 for polling network devices. SNMPv1 is not used. Both v2c and v3 are first-class — choose the one that matches your environment.

- **SNMPv2c** — read-only community string
- **SNMPv3** — USM with authentication and privacy (encryption)

## What Stratora reads via SNMP

At discovery time, Stratora queries the standard system objects on each candidate device: `sysDescr`, `sysObjectID`, `sysName`, `sysLocation`, and `sysContact`. These identify the device family and let Stratora auto-classify it against a template.

At runtime, the matched template determines which MIB objects Stratora polls — typically standard MIB-II interface and system tables plus vendor-specific MIBs for that device family.

Stratora does **not** use SNMP-SET in this release — every credential needed is read-only. Stratora also does **not** receive SNMP traps in this release; monitoring is poll-only.

## Device-side ACL configuration

On each device you intend to monitor:

- Permit SNMP queries from the Stratora Collector's IP on UDP/161. For single-server deployments where the Server polls devices directly, that's the Server's IP. For multi-collector deployments, repeat for each Collector that will reach the device.
- A read-only community (for SNMPv2c) is sufficient — Stratora never writes via SNMP.
- For SNMPv3, configure a read-only user with one of the authentication and privacy protocols Stratora supports. See [Credentials](/docs/collection/credentials) for the full protocol list.

## Vendors supported today

These vendors ship with validated templates and full alert coverage. Devices in these families are auto-classified during discovery.

| Category | Vendor / product family |
|---|---|
| Switches | Cisco Catalyst (IOS), Cisco SG300 / CBS350, Ubiquiti UniFi Switch |
| Access points | Aruba Instant |
| Firewalls / appliances | Palo Alto Networks PA Series |
| Storage / NAS | Synology DiskStation, QNAP |
| Virtualization | VMware vCenter Server, VMware ESXi Host |
| Servers (via the Stratora Agent — listed here for completeness) | Windows Server, Linux distributions per [Linux hosts](/docs/prerequisites/linux-hosts) |

## Generic templates

Stratora ships generic templates for hosts and services that don't fit a vendor template:

- `ping` — ICMP-only monitoring for any reachable host
- `http-https` — HTTP / HTTPS endpoint monitoring with SSL certificate expiry tracking
- `wan-circuit` — latency, jitter, and loss monitoring for WAN links

## Vendors on the roadmap

Additional vendor support is on the [roadmap](/docs/intro#where-stratora-is-heading) — including first-class support for Cisco Meraki cloud-managed switches, access points, and appliances.

## Where to go next

- Stratora-side credential vault: [Credentials](/docs/collection/credentials)
- Verifying SNMP reachability: [Verification](/docs/prerequisites/verification)
