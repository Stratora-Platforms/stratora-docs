# Getting Started

A guided setup wizard is coming soon. In the meantime, follow these steps in order to get your environment monitored — each one builds on the previous. Click through to the linked pages for full details on each topic.

> **Estimated time:** 20–45 minutes depending on environment size.

---

## 1. Activate Your License

Confirm your edition and device headroom before you start adding nodes. Every Stratora installation starts as Community Edition (100 devices). If you have a Pro or Enterprise license, upload your `.lic` file to unlock higher limits.

→ [License](/docs/administration/license)

---

## 2. Secure Your Admin Account & Create Users

Change the default admin password, then create accounts for your team. Stratora has two roles: **Admin** (full configuration access) and **Operator** (monitoring and alert acknowledgment).

> **Key concept:** User accounts are for _login and alert acknowledgment_ only. Where notifications get delivered — email, Slack, Teams — is configured separately in [Escalation Teams](/docs/alerting/escalation-teams) (Step 8).

→ [Users](/docs/administration/users)

---

## 3. Create Your Sites

Every node in Stratora must belong to a site. Create your site structure first — whether that's by physical location, network segment, or client (for MSPs). You'll assign everything else to sites as you go.

→ [Sites](/docs/infrastructure/sites)

---

## 4. Add SNMP & VMware Credentials

If you're monitoring switches, firewalls, access points, NAS, or VMware hosts, add their credentials to the vault now. You can add multiple credential sets — Stratora will try them during discovery.

→ [Credentials](/docs/collection/credentials)

---

## 5. Enroll Your First Agents

For Windows and Linux servers, generate an enrollment token and run the install command on each host. Agents handle enrollment, metric collection (via Telegraf), and service monitoring automatically.

Tokens are re-viewable by Admins at any time. The local Stratora server acts as the default collector — remote collectors are a separate configuration and not required for initial setup.

→ [Enrollment](/docs/collection/enrollment)

---

## 6. Define IPAM Subnets

Add the subnets you want Stratora to track and scan. Assign each subnet to a site. Stratora can auto-suggest subnets from the server's own interfaces to get you started quickly.

You don't need every subnet right away — start with the ones you'll scan in the next step.

→ [IPAM](/docs/infrastructure/ipam)

---

## 7. Run Discovery & Import Nodes

With credentials and subnets in place, run a discovery scan. Stratora fingerprints devices via SNMP (sysObjectID, sysDescr) and auto-matches templates. Review the results, select what to import, and nodes are assigned to sites based on their subnet.

Imported nodes enter a **Discovering** state while initial collection completes, then auto-generated dashboards appear with real data.

→ [Discovery](/docs/collection/discovery)
→ [Nodes](/docs/infrastructure/nodes)
→ [Dashboards](/docs/monitoring/dashboards)

---

## 8. Configure Alerts & Escalation Teams

Stratora ships with built-in alert configurations covering CPU, memory, disk, interface status, and more. Review the defaults and adjust thresholds for your environment.

Then create escalation teams to control where notifications go: email distribution lists, Slack webhooks, or Teams webhooks. Assign each team to one or more sites and **send a test notification** to confirm delivery.

→ [Alert Configurations](/docs/alerting/alert-configurations)
→ [Escalation Teams](/docs/alerting/escalation-teams)
→ [Contacts](/docs/alerting/contacts)

---

## Pre-Flight Checklist

Before you consider initial setup complete:

- [ ] License activated, edition and device headroom confirmed
- [ ] Default admin password changed
- [ ] At least one site created
- [ ] SNMP/VMware credentials added (if applicable)
- [ ] Agent installed on at least one server
- [ ] Subnets defined in IPAM
- [ ] Discovery scan run and devices imported
- [ ] Escalation team created with notification targets
- [ ] Test notification received
- [ ] Auto-generated dashboards showing real data

---

## What's Next

With the basics in place, explore the rest of what Stratora offers:

- [Maps](/docs/monitoring/maps) — Interactive topology and floor plan maps
- [Rack Diagrams](/docs/monitoring/rack-diagrams) — Document physical rack layouts tied to monitored nodes
- [Reports](/docs/monitoring/reports) — Scheduled and on-demand reporting
- [Node Groups](/docs/infrastructure/node-groups) — Logical groupings across sites
- [Maintenance](/docs/alerting/maintenance) — Suppress alerts during planned work
- [Collectors](/docs/collection/collectors) — Distributed collection for remote sites
- [Data Retention](/docs/administration/data-retention) — Control how long metric data is stored
- [Identity Providers](/docs/administration/identity-providers) — SSO with Microsoft Entra ID or other OIDC providers
- [SSL / TLS Certificates](/docs/administration/ssl-tls-certificates) — Trusted certs for the web interface
- [Settings](/docs/administration/settings) — Global platform configuration
