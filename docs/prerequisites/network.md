---
title: Network
sidebar_label: Network
sidebar_position: 20
---

# Network

Stratora's network requirements are intentionally narrow. Most environments will only need to confirm two things: that the Server is reachable on port 443, and that each Collector can reach its assigned devices on the protocols it polls them with.

## Required ports — at a glance

### Operator → Server

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Operator workstations | Stratora Server | 443 / TCP (HTTPS) | Web UI |

### Stratora Server inbound

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Operators, Agents, Collectors | Stratora Server | 443 / TCP (HTTPS) | All UI traffic, agent enrollment and heartbeat, collector config pulls and metric ingest |
| Internet (only during cert issuance) | Stratora Server | 80 / TCP (HTTP) | Optional — required only if you use HTTP-01 certificate issuance during initial setup |

Stratora's internal services (the backend API, the time-series database, and PostgreSQL) all bind to loopback only and are not exposed to the network. You do not need to open any other inbound port to the Server.

### Agent → Server

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Each monitored host running the Stratora Agent | Stratora Server | 443 / TCP (HTTPS) | Enrollment, heartbeat, configuration pull, metric push |

Agents are push-only. They never listen for inbound traffic. They also do not honor `HTTP_PROXY` or `HTTPS_PROXY` environment variables in this release — each agent host must have direct outbound HTTPS reachability to the Server.

### Collector → Server

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Each Collector (local or remote) | Stratora Server | 443 / TCP (HTTPS) | Configuration pull, heartbeat, metric push |

### Collector → monitored devices

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Collector | Any monitored device | ICMP Echo Request | Reachability and latency probes (the Response column on the Nodes list) |
| Collector | SNMP-monitored device | 161 / UDP | SNMP polling (v2c and v3) |
| Collector | vCenter or ESXi host | 443 / TCP (HTTPS) | vSphere API |
| Collector | HTTP / HTTPS endpoint | 80 / TCP or 443 / TCP | Endpoint monitoring |

## What Stratora does not do

- **No SNMP traps.** Stratora polls SNMP-monitored devices; it does not listen on UDP/162 for traps in this release.
- **No outbound proxy support on the agent.** The agent's HTTP client does not honor `HTTP_PROXY` / `HTTPS_PROXY`. Plan on direct outbound HTTPS from each monitored host.

## Where to go next

- Host firewall specifics on Windows: [Windows hosts](/docs/prerequisites/windows-hosts)
- Host firewall specifics on Linux: [Linux hosts](/docs/prerequisites/linux-hosts)
- SNMP device-side ACL guidance: [SNMP devices](/docs/prerequisites/snmp-devices)
- Verifying reachability before you import anything: [Verification](/docs/prerequisites/verification)
