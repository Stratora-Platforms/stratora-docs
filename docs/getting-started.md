# Getting Started with Stratora

This guide walks you through installing Stratora and setting up monitoring for your infrastructure. The built-in Setup Wizard handles most of the configuration automatically — you'll go from installation to live dashboards in under 10 minutes.

## Prerequisites

Before installing Stratora, ensure you have:

- **Windows Server 2019 or 2022** (recommended)
- **4 CPU cores minimum**
- **16 GB RAM minimum**
- **200 GB disk** on C:\ (recommended)
- **Network access** to the subnets you intend to monitor (ICMP, SNMP UDP/161)
- **SNMP credentials** for your network devices (community strings for v2c, or username/auth/priv for v3)

## Installation

### 1. Download and Install

Download the latest Stratora MSI installer from your license portal. Run the installer on your designated monitoring server:

```
msiexec /i Stratora-x.x.x.msi /qn
```

The installer configures all required Stratora services automatically.

### 2. Verify Services

After installation, confirm all Stratora services are running:

- **Stratora Server** — core API and web interface
- **Stratora Metrics** — time-series storage
- **Stratora Collector** — metric collection
- **Stratora Proxy** — web proxy serving the UI

### 3. Access the Web Interface

Open a browser and navigate to `https://your-server-hostname`. Log in with your administrator credentials configured during installation.

## Setup Wizard

On first login, the Setup Wizard opens automatically. It guides you through 9 steps to configure your monitoring environment. Each step builds on the previous — by the end, you'll have devices discovered, imported, and monitored with active alerting.

The wizard is re-runnable and additive. You can close it at any time (your progress is saved), and relaunch it from the Home page. Running it again won't duplicate existing configuration — it detects what's already set up and lets you add more.

### Step 1: Welcome

The welcome screen outlines what the wizard will configure. Click **Get Started** to begin.

### Step 2: License

Stratora runs in Community edition by default with a 25-device monitoring limit. If you have a Pro or Enterprise license:

1. Click **Upload License**
2. Select your `.lic` file
3. The edition and device limit update immediately

The device headroom bar shows how many of your licensed slots are in use. Node limits are enforced only on actively monitored devices — discovered but unimported devices don't count.

### Step 3: Sites

Sites represent your physical locations — data centers, branch offices, factory floors, or client environments. Every monitored device belongs to a site.

1. Enter a **Site Name** (e.g., "HQ Data Center", "Boca Raton Office")
2. Optionally add an **Address** for geographic mapping
3. Click **Add** to create the site
4. Create at least one site to continue (you can add more later)

Sites created here automatically get dashboards, topology maps, and health scoring.

### Step 4: Credentials

Add SNMP credentials that Stratora will use to discover and monitor network devices. These are stored in an encrypted credential vault.

**For SNMP v2c:**
- Enter the community string (e.g., `public` for read-only)

**For SNMP v3:**
- Enter the username, security level, and authentication/privacy protocols and passwords

You can add multiple credentials — during discovery, Stratora tries each credential sequentially per device and uses the first one that succeeds.

This step is skippable if you plan to monitor agent-based devices only.

### Step 5: Agents

Deploy Stratora agents to Windows and Linux servers for deep OS-level monitoring (CPU, memory, disk, services, processes).

1. Click **Generate Token** to create an enrollment token
2. Optionally select a **Site** to auto-assign enrolled agents
3. Follow the on-screen instructions — the wizard generates the install commands for you and provides direct download links for the installer packages
4. Deploy to your servers using the provided commands, or distribute the installers via GPO, SCCM, Intune, Ansible, or any other deployment tool

Agents enroll automatically and begin reporting metrics within 60 seconds. This step is skippable — you can deploy agents later.

### Step 6: Network (IPAM Subnets)

Define the IP subnets Stratora should know about. These are used for discovery scanning and IPAM tracking.

1. Enter a **CIDR** (e.g., `10.40.0.0/24`)
2. Assign a **Site**
3. Optionally add a **Name**, **Gateway**, and **VLAN ID**
4. Click **Add**

Add all subnets you want to scan. The discovery step will use these as scan targets.

This step is skippable if you only plan to monitor agent-based devices.

### Step 7: Discovery

This is where Stratora scans your network and finds devices automatically.

**Configure:** Your subnets from Step 6 and credentials from Step 4 are pre-selected. Adjust if needed, then click **Start Scan**.

**Scan:** Stratora scans all IP addresses in your selected subnets using ICMP ping, TCP port probing, and SNMP queries. Devices appear in the results table as they're discovered. The scan typically takes 5–10 minutes for a few /24 subnets.

Each discovered device is classified automatically:
- **High confidence** — SNMP-responding devices with full identification (firewalls, switches, APs, NAS, servers)
- **Medium confidence** — Devices with a hostname or open ports but no SNMP
- **Low confidence** — ICMP-only responses (often proxy ARP phantoms from firewalls)

**Import:** After the scan completes, review the results. Devices are pre-selected based on confidence level. Click **Import Devices** to add them to monitoring. Imported devices are automatically assigned dashboard templates and default alert rules based on their device type.

This step is skippable if you prefer to add devices manually.

### Step 8: Alerts & Escalation

Create an escalation team to receive alert notifications when something goes wrong.

Click **Create Escalation Team** to open the full escalation team builder:

**Team Details:** Name your team (e.g., "Network Operations", "IT On-Call").

**Schedule:** Choose how the team operates:
- **Always Active** — Notifications fire 24/7 to configured channels
- **Time-Based** — Notifications only during specified hours and days
- **On-Call Rotation** — Notifications route to whoever is currently on-call. Define your rotation roster (team members in order), rotation period (e.g., 7 days), and handoff time.

**Notification Steps:** Configure escalation tiers:
- **Step 1 (Immediate):** Notify via email, Slack, Teams, or webhook
- **Step 2 (after delay):** Escalate to additional contacts if unacknowledged
- Add as many steps as needed

For on-call rotation teams, notification steps can target rotation positions (On-Call #1, #2, #3, etc.) instead of specific contacts. The actual recipient is resolved from the roster at alert time.

**Settings:** Configure repeat cycle behavior for unacknowledged alerts.

**Review:** Confirm the configuration and create the team.

This step is skippable — you can configure escalation teams later from **Alerting → Escalation Teams**.

### Step 9: Summary

The summary shows your configured environment at a glance: sites, credentials, subnets, monitored devices, and alert rules. Click **Go to Dashboard** to complete setup and start monitoring.

## After Setup

### Home Dashboard

Your Home page now shows the **Infrastructure Brief** — a triage-oriented overview with:

- **Health Score** trending across your environment
- **Critical Impact** alerts requiring immediate attention
- **Resource Risk** warnings (disk space, CPU, memory trends)
- **Recommended Actions** — deterministic suggestions based on your environment state

### Site Dashboards

Each site gets an auto-seeded dashboard with panels for node health, service status, and network topology. Navigate to a site to see its dedicated view.

### Adding More Devices

As your environment grows:

- **Re-run the wizard** from the Home page to add more sites, subnets, or credentials
- **Run discovery scans** from **Collection → Discovery Jobs** for ad-hoc network scanning
- **Schedule recurring scans** from **Infrastructure → IPAM** to automatically detect new devices
- **Deploy agents** to additional servers using an enrollment token from **Collection → Enrollment API**

### Monitoring Configuration

Stratora auto-assigns monitoring templates based on device type. To customize:

- **Dashboard templates** — Edit auto-created dashboards or build custom ones
- **Alert rules** — Modify default thresholds in **Alerting → Alert Configurations**
- **Escalation policies** — Add teams, adjust delays, and configure on-call schedules in **Alerting → Escalation Teams**

## Manual Setup (Without Wizard)

If you prefer to configure everything manually or skipped the wizard:

1. **Create sites** in **Infrastructure → Sites**
2. **Add SNMP credentials** in **Collection → Credentials**
3. **Define subnets** in **Infrastructure → IPAM**
4. **Run a discovery scan** in **Collection → Discovery Jobs** — select subnets and credentials, start the scan, then import discovered devices
5. **Deploy agents** using enrollment tokens from **Collection → Enrollment API** (install commands are also available from **Collection → Agents**)
6. **Create escalation teams** in **Alerting → Escalation Teams**
7. **Configure alert rules** in **Alerting → Alert Configurations**

All of these capabilities are the same ones the wizard orchestrates — the wizard just sequences them for a streamlined first-run experience.
