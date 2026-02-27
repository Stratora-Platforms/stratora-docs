# Getting Started

Stratora is designed to get you from installation to real visibility
fast.

> **In under 30 minutes, you can have live infrastructure monitoring
> running in your environment.**

By the end of this guide, you will have:

-   Live CPU, memory, disk, and interface metrics
-   Auto-generated dashboards per device
-   Real-time health badges
-   A discovery-backed inventory of your network
-   At least one verified alert notification
-   A site-based structure ready for expansion

> A guided setup wizard is coming soon. Until then, follow the steps below
> in order: each builds on the previous.

------------------------------------------------------------------------

## System Requirements (Evaluation / Lab)

Minimum recommended for a small lab or pilot:

-   4 vCPU\
-   8--16 GB RAM\
-   50 GB disk\
-   PostgreSQL 15+\
-   VictoriaMetrics (single-node)\
-   Windows Server or Linux supported

Stratora does **not** modify monitored devices. Discovery and polling
are read-only (SNMP, HTTPS, and API-based collection).

> **Estimated setup time:** 20--45 minutes depending on environment
> size.

------------------------------------------------------------------------

## How Stratora Works (Quick Architecture Overview)

    Agents (Windows / Linux)
            ↓
       Stratora Server
            ↓
    NGINX (fronts internal services)
            ↓
    VictoriaMetrics + PostgreSQL

    SNMP Devices / HTTPS Endpoints
            ↓
    Collectors (Telegraf-based)
            ↓
         Stratora Server
            ↓
    NGINX (fronts internal services)
            ↓
    VictoriaMetrics + PostgreSQL

Key points:

-   **Agents send directly to the Stratora Server** (no collector
    required)
-   **SNMP/HTTPS monitoring flows through Collectors**, which forward
    metrics to the Stratora Server
-   **NGINX sits in front of VictoriaMetrics and PostgreSQL** on the
    Stratora Server
-   The Stratora Server handles orchestration, dashboards, alerting, and
    identity

Remote collectors are optional at first --- small environments can start
without them and expand later.

------------------------------------------------------------------------

# Step-by-Step Setup

## 1. Secure Your Admin Account & Create Users

Immediately change the default admin password.

Then create accounts for your team.

Stratora includes two roles:

-   **Admin** --- full configuration access\
-   **Operator** --- monitoring, dashboards, alert acknowledgment

> **Key concept:** User accounts control login and alert acknowledgment.
> Notification delivery (email, Slack, Teams) is configured separately
> in Escalation Teams (Step 8).

------------------------------------------------------------------------

## 2. Create Your Sites

Every node in Stratora belongs to a site.

Create your site structure first --- by:

-   Physical location\
-   Network segment\
-   Business unit\
-   Customer (for MSPs)

Everything else will be assigned to sites as you go.

------------------------------------------------------------------------

## 3. Add SNMP & VMware Credentials

If you plan to monitor switches, firewalls, access points, NAS devices,
or VMware hosts, add credentials now.

You can add multiple credential sets. During discovery, Stratora will
attempt them automatically.

Credentials are stored securely in the encrypted vault.

------------------------------------------------------------------------

## 4. Enroll Your First Agents

For Windows and Linux servers:

1.  Generate an enrollment token\
2.  Run the install command on the target host\
3.  The agent auto-registers with Stratora

Agents handle:

-   Enrollment\
-   Metric collection (agent → Stratora Server)\
-   Service monitoring\
-   OS and hardware identity reporting

Enrollment tokens are re-viewable by Admins at any time.

------------------------------------------------------------------------

## 5. Define IPAM Subnets

Add the subnets you want Stratora to track and scan.

-   Assign each subnet to a site\
-   Use auto-suggested subnets from the server if desired\
-   Start small --- you can expand later

You do not need every subnet defined before starting.

------------------------------------------------------------------------

## 6. Run Discovery & Import Nodes

With credentials and subnets in place, run a discovery scan.

During discovery, Stratora:

-   Fingerprints devices via SNMP (sysObjectID, sysDescr)\
-   Detects reachable HTTPS endpoints (where configured)\
-   Auto-matches device templates\
-   Does **not** change device configuration (read-only collection)

Review results and select devices to import.

Imported nodes enter a **Discovering** state while initial collection
completes. Once complete:

-   Dashboards are auto-generated\
-   Health badges activate\
-   Metrics begin populating in real time

------------------------------------------------------------------------

## 7. Confirm Live Dashboards

Before proceeding, confirm:

-   CPU and memory metrics are updating\
-   Interface status appears (where applicable)\
-   Health indicators reflect real status\
-   The global time range selector updates panels consistently

If dashboards are live, monitoring is active.

------------------------------------------------------------------------

## 8. Configure Alerts & Escalation Teams

Stratora includes built-in alert configurations for:

-   CPU usage\
-   Memory usage\
-   Disk utilization\
-   Interface status\
-   Device reachability

Review thresholds and adjust for your environment.

Then:

1.  Create an escalation team\
2.  Add notification targets (email, Slack, Teams, webhook)\
3.  Assign the team to one or more sites\
4.  **Send a test notification**

Confirm delivery before considering setup complete.

------------------------------------------------------------------------

## 9. Review Licensing (Optional for Community Edition)

Every installation starts as **Community Edition (100 devices)**.

If you have a Pro or Enterprise license:

1.  Upload your `.lic` file\
2.  Device limits update immediately\
3.  No restart required

Only actively monitored devices count toward the limit.

------------------------------------------------------------------------

# Pre-Flight Checklist

-   [ ] Default admin password changed\
-   [ ] At least one site created\
-   [ ] Credentials added (if applicable)\
-   [ ] Agent installed on at least one server\
-   [ ] Subnets defined in IPAM\
-   [ ] Discovery scan run\
-   [ ] Devices imported\
-   [ ] Dashboards showing live data\
-   [ ] Escalation team created\
-   [ ] Test notification received

If all boxes are checked, Stratora is operational.

------------------------------------------------------------------------

# What's Next

With core monitoring active, you can expand into:

-   Maps --- Interactive topology maps\
-   Rack Diagrams --- Physical rack visualization\
-   Reports --- Scheduled reporting\
-   Node Groups --- Logical grouping\
-   Maintenance --- Planned alert suppression\
-   Collectors --- Distributed collection\
-   Data Retention --- Retention policies & enforcement\
-   Identity Providers --- OIDC SSO (Microsoft Entra ID)\
-   SSL / TLS Certificates --- Trusted certificates

Stratora is now discovering infrastructure, collecting metrics,
generating dashboards, and enforcing alerts.
