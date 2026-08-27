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

## Server BMCs — Dell iDRAC and HPE iLO

Stratora monitors server hardware health (temperature, fan, power-supply status and redundancy, disk, memory) **out-of-band** through the server's baseboard management controller — Dell iDRAC or HPE iLO — over SNMP. Because it is out-of-band, the BMC reports even when the host operating system is down.

:::warning Poll the BMC's management IP, not the server's OS address
A BMC has its **own** IP on the management network, separate from the server's operating-system IP. Add the **iDRAC / iLO management IP** as the node — not the host's OS address. Pointing Stratora at the OS IP is the most common setup mistake: it returns no BMC data, and the template looks broken when the address is simply wrong.
:::

SNMP is **disabled by default** on both iDRAC and iLO; enable it on the BMC first:

- **Dell iDRAC** — iDRAC Settings → Connectivity → Services → SNMP Agent → Enabled (or `racadm set idrac.SNMP.AgentEnable 1`), then set a community (v2c) or configure an SNMPv3 user.
- **HPE iLO** — Administration → Management → SNMP Settings; enable the SNMP protocol and set a community (v2c) or an SNMPv3 user.

:::note Use SNMPv3 where you can — v2c may not be available
Both vendors recommend **SNMPv3**, and on newer firmware SNMPv2c may not be available at all: an iLO in a **High Security / FIPS / CNSA** state blocks SNMPv1/v2c outright. If you configure a v2c community and polling silently returns nothing, the BMC's security state is likely refusing v2c — switch to SNMPv3. Prefer v3 from the start on current firmware.
:::

Which iDRAC / iLO generations and what alerting applies is on the [Supported Devices](/docs/supported-devices) page (Server BMC rows).

## Devices supported today

For the full list — including **how each device is recognized during discovery** and **what alerting applies** — see **[Supported Devices](/docs/supported-devices)**. That page is generated from Stratora's own validation records, so it reflects exactly what ships, per model.

Two things it makes explicit that a flat vendor list cannot:

- **Recognition** — whether a device is found automatically on a scan. Most families are auto-recognized, but not all. For example, classic-IOS **Cisco Catalyst** collection works, yet no discovery fingerprint exists for it yet, so it is **added manually** rather than found on a scan — a known, closable gap.
- **Validation basis** — whether a template was verified against a real physical device (**Validated**), against a captured firmware replay with no live device (**Replay-validated**), or is authored from vendor MIB documentation and not yet verified (**MIB-derived**). Many families are not yet hardware-validated.

:::note ESXi and vCenter
For vSphere, vCenter inventory and per-host/VM utilization come from the **vSphere API**, not SNMP — see [Virtualization prerequisites](/docs/prerequisites/virtualization). SNMP applies to the **per-host enrichment layer** (each ESXi host onboarded as a VMware Host node for memory overcommit and host-alert attribution); ESXi ships with **SNMP disabled**, so enable it per host (`esxcli system snmp set --enable true`) before onboarding.
:::

## What the built-in alerts cover

Every monitored device gets reachability alerting: device unreachable, packet loss, and response time. The network device families above additionally get SNMP interface monitoring — per-interface throughput, plus interface **error-rate** alerting — and per-family alerts where the platform exposes the data: NAS volume and RAID state on Synology and QNAP, host memory overcommit and datastore capacity on VMware.

Two qualifications in the current release:

- **Palo Alto PA Series** — the PA template does not currently collect interface error counters, so interface-error alerting does not apply to PA devices. Reachability alerting and interface throughput monitoring are unaffected.
- **Interface discards** — discard counters are collected on a subset of device families; discard-based alerting applies only where a device's template collects those counters.

The [built-in alert library](/docs/alerting/alert-configurations) lists every alert. Each alert evaluates only on devices whose template collects the underlying metric — seeing an alert in the library does not by itself mean it applies to every device family.

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
