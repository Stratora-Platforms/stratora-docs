---
title: Introduction
sidebar_label: Introduction
sidebar_position: 10
---

# Introduction

## What Stratora is

Stratora is an on-premises infrastructure monitoring platform built for the operators who keep IT and OT environments running — with built-in alerting, escalation, and visualization. We built Stratora because we lived through the pain of fragmented monitoring stacks, noisy alerts, and dashboards that look impressive but answer nothing when things break. We focus on clarity over clutter, signal over noise, and speed over complexity. Built for the person on call at 2AM — not the person presenting dashboards in a meeting.

## What it's for

Modern infrastructure moves fast — faster than legacy tools were ever designed to handle. Metrics, alerts, topology, and inventory shouldn't live in silos, and neither should the teams responsible for uptime. The result, today, is a stack of partial tools held together by tribal knowledge: a thing that polls switches, another thing that watches servers, a separate alerting layer that's never quite tuned, and dashboards that need a specialist to build and a meeting to interpret.

Stratora is for the operators carrying that weight — network teams, systems teams, and the MSPs who carry both for their customers. It's at home in IT environments and segmented OT zones alike, including manufacturing networks where the people responsible for uptime can't accept a cloud-only monitoring tool that needs constant internet reachability. One platform, one place to see what's happening, understand why it's happening, and act before users ever notice.

Stratora deploys on-premises. It scales from a single environment to a fleet of segmented sites without forcing you to redesign your network or hand your data to a vendor cloud.

## How it works

Stratora is built around three components: a central **Server** that hosts the UI, the alerting engine, the time-series store, and the metadata database; lightweight **Agents** that push system metrics from each monitored Windows or Linux host over HTTPS; and **Collectors** that poll network devices and forward results to the Server. Collectors can run alongside the Server or be deployed remotely into segmented IT and OT zones. No traffic leaves your perimeter. For a deeper look at how the pieces fit together — including ports, protocols, and authentication — see [Architecture](/docs/architecture).

## What ships today

Stratora ships ready to monitor on day one. The platform covers the operational workflows teams rely on — collection, visualization, alerting, on-call coordination, integrations, infrastructure inventory, and access control — without requiring you to assemble them from separate tools.

### Monitoring and collection

What Stratora watches and how it gets the data.

- Multi-protocol coverage: SNMP (v2c and v3), ICMP, the Stratora Agent for Windows and Linux, the vSphere API for vCenter and ESXi, and WMI or SSH for hosts polled from a [Collector](/docs/collection/collectors)
- Auto-discovery: scan your network by ICMP, TCP, and SNMP; fingerprint devices by sysObjectID against the [template library](/docs/prerequisites/snmp-devices); bulk-import the results — see [Discovery](/docs/collection/discovery)
- Validated device templates for major switch, firewall, access-point, NAS, and virtualization vendors, plus generic templates for ping, HTTP/HTTPS endpoints, and WAN circuits
- Lightweight [Agents](/docs/collection/agents) for Windows Server 2016+ and the major modern Linux distributions, with auto-registration and admin approval
- A centralized [credentials vault](/docs/collection/credentials) for SNMP, SSH, WMI, vSphere, and S3/Azure credentials — AES-256-GCM at rest, with key-rotation support

### Visualization and dashboards

Stratora generates the visualizations you need without forcing you to build them from scratch — and keeps them current as your infrastructure changes.

- The [Home dashboard](/docs/monitoring/home) — your daily-driver overview, with the platform's health score, an Infrastructure Brief that triages what needs attention, recommended next actions, per-site breakdowns, and top-resource utilization.
- Per-node and per-site [dashboards](/docs/monitoring/dashboards) are generated automatically from the templates assigned to each device. No dashboard building required, and they stay in sync as nodes are added, removed, or change state.
- [Network topology maps](/docs/monitoring/maps) start with an auto-populated layout — every node already placed on the canvas, sorted into dynamic zones by type (network switches, access points, Windows servers, Linux servers, and so on). You can drill into any node directly from the map, watch status update in real time, and customize the layout with real connections labeled by the monitored interface. Your customizations persist; the underlying zone and status data keeps updating beneath them.
- [Rack diagrams](/docs/monitoring/racks) show your devices in their physical U-slot positions, with health-state coloring per slot. You place each device once; from there, Stratora keeps the rack current — devices that get decommissioned drop off the diagram automatically rather than lingering as ghost entries.
- A world map view shows your sites geographically, color-coded by site health. Sites you've defined appear on the map automatically once they have coordinates set; sites you remove disappear from the map without leaving stale markers.

### Incident response and on-call orchestration

Alerting that ships ready to use. No empty rule engine to populate before the first alert fires.

- A tested library of [built-in alerts](/docs/alerting/alert-configurations) — reachability, CPU, memory, disk, interface errors, certificate expiry, agent heartbeat lost, collector offline — plus custom alert definitions when you need them
- [Escalation teams](/docs/alerting/escalation-teams) with three schedule types: Always Active for 24/7 coverage, Time-Based for active-hours rotations, and On-Call Rotation that cycles through team members on a configured cadence
- Per-rotation-member [contact channels](/docs/alerting/contacts) — each on-call engineer carries their own email, SMS, Slack webhook, and Teams webhook details. Escalation channels can dynamically target "current on-call" instead of static recipients
- Scheduled and recurring [maintenance windows](/docs/alerting/maintenance) that suppress alerts during planned changes
- [Alert response-time tracking](/docs/alerting/alert-response-times) — measure how long alerts take to acknowledge and resolve per team, per node, per alert definition

### Communication channels

How alerts reach the people who need to know.

- Email via SMTP
- SMS via Twilio (works in bidirectional mode, polling mode for air-gapped deployments, or outbound-only mode)
- Voice call via Twilio — the alert is read aloud over the phone with text-to-speech
- Microsoft Teams via incoming webhooks, delivered as Adaptive Card v1.4 messages
- Slack via incoming webhooks, delivered as Block Kit messages
- Generic webhooks for any other system that accepts an inbound JSON POST

See [External notifications](/docs/integrations/external-notifications) for setup of each channel.

Email, Microsoft Teams, and Slack notifications link directly to the alert in Stratora — your on-call engineers land on the right context with one click and can acknowledge or escalate from there. SMS notifications use a short reply syntax that authorizes the action via the inbound webhook, so engineers can ack from their phone without opening the UI.

### Infrastructure and inventory

Stratora knows the shape of your infrastructure, not just its metrics.

- [Sites](/docs/infrastructure/sites) — physical-location construct that groups your nodes; every monitored device belongs to a site
- [IPAM](/docs/infrastructure/ipam) — subnet inventory, IP address tracking, DHCP scope visibility, supernet planning
- [Node groups](/docs/infrastructure/node-groups) — logical groupings that span sites, used to scope alerts, dashboards, and reports

**Define your subnets once.** Stratora's IPAM is the source of truth for site assignment across the platform. Devices discovered on a subnet inherit the right site automatically. Agents enrolling from a host on that subnet are placed in the right site without manual intervention. Topology maps and reports pick up the same assignments. Tell Stratora once where your subnets live; it propagates everywhere.

### Reporting and audit

Operational reporting built into the platform — no separate analytics layer.

- Six built-in PDF [reports](/docs/monitoring/reports/overview): Site Health, Availability and SLA, Top Offenders, Disk Capacity, SSL Certificates, and Alert Intelligence
- On-demand or scheduled delivery
- [Audit logs](/docs/administration/audit-logs) covering credential reveals, node lifecycle changes, alert acknowledgments, user management, and configuration changes — filterable and searchable

### Administration and access control

Operator-friendly access control with first-class identity-provider integration.

- [Role-based access control](/docs/administration/user-roles-and-permissions) with three roles: Admin (full access), Operator (manage nodes, dashboards, alerts; no credential reveal), and Viewer (read-only)
- [Local accounts](/docs/administration/users) with first-login forced password change
- [Identity providers](/docs/administration/identity-providers): LDAP / Active Directory and OIDC SSO (validated against Entra ID; works with any OIDC-compliant provider), with group-to-role mapping
- Component enrollment with token-based registration for Agents and Collectors — no shared credentials to manage
- Multi-site, multi-environment, multi-collector deployments out of the box

## Where Stratora is heading

What ships today covers the core operational workflows teams rely on. We're actively investing in additional coverage:

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
