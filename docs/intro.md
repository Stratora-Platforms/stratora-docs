---
title: Introduction
sidebar_label: Introduction
sidebar_position: 10
---

# Introduction

## What Stratora is

Stratora is an on-premises infrastructure monitoring platform built for the operators who keep IT and OT environments running. It auto-discovers your network, generates dashboards from the live data it sees, and starts alerting on day one — no specialists required, no consultants on retainer, no cloud dependency. We built Stratora because we lived through the pain of fragmented monitoring stacks, noisy alerts, and dashboards that look impressive but answer nothing when things break. We focus on clarity over clutter, signal over noise, and speed over complexity.

## What it's for

Modern infrastructure moves fast — faster than legacy tools were ever designed to handle. Metrics, alerts, topology, and inventory shouldn't live in silos, and neither should the teams responsible for uptime. The result, today, is a stack of partial tools held together by tribal knowledge: a thing that polls switches, another thing that watches servers, a separate alerting layer that's never quite tuned, and dashboards that need a specialist to build and a meeting to interpret.

Stratora is for the operators carrying that weight — network teams, systems teams, and the MSPs who carry both for their customers. It's at home in IT environments and segmented OT zones alike, including manufacturing networks where the people responsible for uptime can't accept a cloud-only monitoring tool that needs constant internet reachability. One platform, one place to see what's happening, understand why it's happening, and act before users ever notice.

Stratora deploys on-premises. It scales from a single environment to a fleet of segmented sites without forcing you to redesign your network or hand your data to a vendor cloud.

## How it works

Stratora is built around three components: a central **Server** that hosts the UI, the alerting engine, the time-series store, and the metadata database; lightweight **Agents** that push system metrics from each monitored Windows or Linux host over HTTPS; and **Collectors** that poll network devices and forward results to the Server. Collectors can run alongside the Server or be deployed remotely into segmented IT and OT zones. No traffic leaves your perimeter. For a deeper look at how the pieces fit together — including ports, protocols, and authentication — see [Architecture](/docs/architecture).

## Where Stratora is heading

Stratora ships today with first-class support for the protocols and vendors most operators reach for on day one: SNMP and ICMP for network devices, the Stratora Agent for Windows and Linux servers, the vSphere API for VMware vCenter and ESXi, and validated templates for the major switch, firewall, access point, and NAS families. We're actively investing in:

- **Microsoft Hyper-V and Proxmox VE monitoring** — extending today's vCenter and ESXi coverage to the other hypervisors operators run.
- **Cisco Meraki support** — first-class support for Meraki MS switches, MR access points, and MX appliances, validated against live hardware.
- **Veeam Backup & Replication monitoring** — bringing backup-job health into the same alerting and dashboards your infrastructure already lives in.
- **Network discovery from remote collectors** — discovery and credentialed probing local to each collector, so segmented networks don't pay a round-trip to the central server.
- **Alert acknowledgment via voice and SMS** — close the loop on alerts from your phone, with a keypad press on a call or an SMS reply, without exposing webhooks on the internet.

We prioritize what customers ask for — if a vendor or capability matters to you and isn't on this list, that's exactly the kind of signal we want.

## Where to go next

- **Ready to install?** Start at [Getting Started](/docs/getting-started).
- **Want a deeper look at how it all fits together?** See [Architecture](/docs/architecture).
- **Looking for what shipped recently?** See the [Changelog](/docs/changelog).
