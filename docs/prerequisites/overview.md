---
title: Prerequisites Overview
sidebar_label: Overview
sidebar_position: 10
---

# Prerequisites Overview

Stratora is designed to install with minimal preparation — most environments are good to go with defaults. This section calls out the few prerequisites that matter, organized so you can read only the parts that apply to what you're actually monitoring.

## Which prerequisites apply to you

| If you're monitoring | You'll use | Read these prerequisites |
|---|---|---|
| Windows or Linux servers | The Stratora Agent on each host | [Network](/docs/prerequisites/network), [Windows hosts](/docs/prerequisites/windows-hosts) and/or [Linux hosts](/docs/prerequisites/linux-hosts) |
| Network switches, firewalls, access points, or NAS | A Stratora Collector polling via SNMP | [Network](/docs/prerequisites/network), [SNMP devices](/docs/prerequisites/snmp-devices) |
| VMware vCenter or ESXi hosts | A Stratora Collector using the vSphere API | [Network](/docs/prerequisites/network) |
| HTTP/HTTPS endpoints or generic pingable hosts | A Stratora Collector running HTTP/ICMP probes | [Network](/docs/prerequisites/network) |

## Common ground for every deployment

These apply regardless of what you're monitoring:

- A Stratora Server with the hardware described in [Getting Started](/docs/getting-started)
- At least one site defined in the Setup Wizard
- At least one Collector running — the bundled local Collector on the Server is sufficient for many environments; remote Collectors are added when you have segmented networks

## Verification

After you've prepared a host or device, see [Verification](/docs/prerequisites/verification) for quick checks that confirm reachability before you import anything into monitoring.
