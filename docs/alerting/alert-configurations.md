---
sidebar_label: Alert Configurations
title: Alert Configurations
---

# Alert Configurations

An **alert configuration** is a rule that tells Stratora when to fire an alert — which metric to watch, what condition to check, and what thresholds constitute a warning or critical state.

Stratora has two kinds of alert configurations that are managed together in a single unified view.

---

## Built-In Configurations

Stratora ships with a set of **built-in alert configurations** that cover the most common monitoring scenarios. These are created automatically during installation and apply globally to all nodes.

| Name | Type | Metric | Condition | Warning | Critical | Duration |
|------|------|--------|-----------|---------|----------|----------|
| Service Stopped | Service | — | equals | — | — | Immediate |
| Node Unreachable | Reachability | — | equals | — | — | 60 s |
| High CPU Usage | Metric | `cpu_usage_percent` | > | 80% | 95% | 5 min |
| High Memory Usage | Metric | `memory_usage_percent` | > | 85% | 95% | 5 min |
| Low Disk Space | Metric | `disk_usage_percent` | > | 80% | 95% | Immediate |
| High Disk Latency | Metric | `disk_latency_ms` | > | 20 ms | 50 ms | 5 min |
| Interface Down | Interface | `interface_status` | equals | — | — | Immediate |
| High Interface Errors | Metric | `interface_errors_rate` | > | 10/s | 100/s | 5 min |

Built-in configurations:
- Can be **enabled or disabled** but not deleted
- Apply globally (all nodes)
- Can be overridden per-node, per-group, or per-site using custom configurations

---

## Custom Configurations

Custom alert configurations let you create your own rules or override the thresholds of a built-in configuration for a specific scope.

Navigate to **Alerting → Alert Configurations** and click **Add Configuration**.

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Display name for the configuration |
| Alert Type | Yes | `metric`, `service`, `reachability`, or `interface` |
| Metric | Conditional | The metric to evaluate (required for metric type) |
| Condition | Yes | Comparison operator — see below |
| Warning Threshold | No | Value that triggers a warning alert |
| Critical Threshold | No | Value that triggers a critical alert |
| Duration | No | How long the condition must persist before firing (default: immediate) |
| Scope | Yes | Where this configuration applies — see below |
| Escalation Team | No | Which [escalation team](./escalation-teams.md) handles notifications |
| Enabled | Yes | Whether the configuration is active (default: yes) |

### Alert Types

| Type | What It Monitors |
|------|-----------------|
| **Metric** | A numeric metric value against a threshold (CPU, memory, disk, latency, etc.) |
| **Service** | Whether a Windows or Linux service is running or stopped |
| **Reachability** | Whether the node is reachable via ping or agent heartbeat |
| **Interface** | Whether a network interface is up or down |

### Conditions

| Condition | Operator | Example |
|-----------|----------|---------|
| Greater than | `>` | CPU usage > 90% |
| Less than | `<` | Free disk space < 10 GB |
| Equals | `=` | Service state = stopped |
| Not equals | `!=` | Interface status != up |

### Duration

The **duration** field controls how long a condition must persist before an alert fires. This prevents transient spikes from generating noise.

- **Immediate** (0 seconds) — fires as soon as the condition is detected
- **5 minutes** — the metric must stay above/below the threshold for 5 consecutive minutes

The evaluator uses a rolling average over the duration window to smooth out momentary fluctuations.

---

## Scoping

Every custom configuration has a **scope** that determines which nodes it applies to.

| Scope | Applies To |
|-------|-----------|
| **Global** | All nodes in the system |
| **Site** | All nodes in a specific [site](../infrastructure/sites.md) |
| **Node Group** | All nodes in a specific [node group](../infrastructure/node-groups.md) |
| **Node** | A single node |

When multiple configurations match the same metric on a node (e.g., a global built-in and a node-level custom override), the **most specific scope wins**. A node-level configuration takes precedence over a group-level one, which takes precedence over a site-level one, which takes precedence over a global built-in.

---

## Template-Generated Configurations

[Device templates](../collection/collectors.md) can include their own alert rules. For example, the VMware vCenter template ships with rules for:

- vCenter unreachable (100% packet loss for 3 minutes)
- ESXi host high CPU (> 90% for 10 minutes)
- ESXi host critical CPU (> 95% for 5 minutes)
- ESXi host high memory (> 90% for 10 minutes)
- VM high CPU / memory / disk latency
- Datastore usage warnings

These template rules are applied automatically when a node uses the template — no manual configuration needed.

---

## Evaluation

The alert evaluator runs on a **10-second cycle**, checking every enabled configuration against current metric data.

For **metric-type** configurations, the evaluator:

1. Queries the metric from VictoriaMetrics using a PromQL-compatible query
2. Applies duration averaging if configured (e.g., `avg_over_time` over 5 minutes)
3. For multi-instance metrics (disk volumes, network interfaces), evaluates the **worst-value instance**
4. Compares the result against warning and critical thresholds
5. Creates, updates, or resolves [alerts](./alerts.md) based on the result

For **service** and **interface** configurations, the evaluator checks the current state directly.

For **reachability** configurations, the evaluator requires **3 consecutive failed checks** (30 seconds) before firing to avoid false positives from momentary network blips.

:::info
A 60-second **resolution grace period** applies to all configurations. Once a condition clears, the evaluator waits 60 seconds of sustained normal readings before resolving the alert. This prevents alerts from rapidly flapping between active and resolved states.
:::

---

## Escalation Team Assignment

Each configuration can optionally be linked to an [escalation team](./escalation-teams.md). When an alert fires from that configuration, the escalation team's notification steps are triggered automatically.

If no escalation team is assigned, the alert is still created and visible in the UI — it just won't generate notifications.

---

## Unified View

The **Alert Configurations** page shows both built-in and custom configurations in a single list. Each entry displays:

- **Source** — whether the configuration is built-in (by Stratora) or custom (by a user)
- **Author** — "Stratora" for built-in, or the username who created it for custom
- **Scope** — global, site, group, or node
- **Thresholds** — warning and critical values
- **Status** — enabled or disabled
- **Escalation team** — the linked team, if any
