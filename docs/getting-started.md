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

Download the latest Stratora MSI installer from the latest release here: https://github.com/Stratora-Platforms/stratora-releases/releases. Run the installer on your designated monitoring server:

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

> **In the next few minutes, you will:**
> - Discover devices across your network automatically
> - Have dashboards, topology maps, and health scoring generated instantly
> - Receive alerts the moment something goes wrong
> - Go from zero to full infrastructure visibility — without manual configuration

On first login, the Setup Wizard opens automatically. It guides you through 10 steps — most of which Stratora completes automatically on your behalf. By the end, your network is discovered, devices are imported with templates pre-assigned, dashboards are live, and alerting is active.

The wizard is re-runnable and additive. You can close it at any time (your progress is saved), and relaunch it from the Home page. Running it again won't duplicate existing configuration — it detects what's already set up and lets you add more.

### Step 1: Welcome

![Setup Wizard — Step 1: Welcome](/img/wizard/SCR-20260412-nizg.png)

The welcome screen outlines what the wizard will configure. Click **Get Started** to begin.

### Step 2: License

![Setup Wizard — Step 2: License](/img/wizard/SCR-20260412-njcc.png)

Stratora runs in Community edition by default, which supports up to 100 monitored devices. If you have a Pro or Enterprise license, upload it here to unlock your licensed device limit and features:

1. Click **Upload License**
2. Select your `.lic` file
3. The edition and device limit update immediately

The device headroom bar shows how many of your licensed slots are in use. Node limits are enforced only on actively monitored devices — discovered but unimported devices don't count.

### Step 3: Server (FQDN & Certificate)

![Setup Wizard — Step 3: Server](/img/wizard/SCR-20260412-njfd.png)

Set the FQDN your users will use to reach Stratora. This must match a DNS A record pointing to the server — Stratora validates the DNS resolution live and confirms it matches the server's IP.

**Certificate options:**
- **DNS-01** *(Recommended)* — Automated Let's Encrypt certificate via DNS verification. Select your DNS provider (Cloudflare supported), enter your API token and Let's Encrypt email, then click Issue Certificate.
- **HTTP-01** — Let's Encrypt via HTTP challenge on port 80. Requires port 80 to be reachable from the internet.
- **Self-Signed** — Generates a self-signed certificate immediately. Browsers will show a warning. You can upgrade to a trusted certificate later in Settings → SSL Certificate.

### Step 4: Sites

![Setup Wizard — Step 4: Sites](/img/wizard/SCR-20260412-njhh.png)

Sites represent your physical locations — data centers, branch offices, factory floors, or client environments. Every monitored device belongs to a site.

1. Enter a **Site Name** (e.g., "HQ Data Center", "Boca Raton Office")
2. Optionally add an **Address** for geographic mapping
3. Click **Add** to create the site
4. Create at least one site to continue (you can add more later)

Sites created here automatically get dashboards, topology maps, and health scoring. No manual dashboard setup required.

### Step 5: Credentials

![Setup Wizard — Step 5: Credentials](/img/wizard/SCR-20260412-njmm.png)

Provide your SNMP credentials so Stratora can automatically identify, fingerprint, and classify every device on your network. These are stored in an encrypted credential vault.

**For SNMP v2c:**
- Enter the community string (e.g., `public` for read-only)

**For SNMP v3:**
- Enter the username, security level, and authentication/privacy protocols and passwords

You can add multiple credentials — during discovery, Stratora tries each credential sequentially per device and uses the first one that succeeds.

This step is skippable if you plan to monitor agent-based devices only.

### Step 6: Agents

![Setup Wizard — Step 6: Agents (Windows)](/img/wizard/SCR-20260412-njry.png)

Deploy Stratora agents to Windows and Linux servers for deep OS-level monitoring (CPU, memory, disk, services, processes).

1. Click **Generate Token** to create an enrollment token
2. Optionally select a **Site** to auto-assign enrolled agents
3. Follow the on-screen instructions — the wizard generates the install commands for you and provides direct download links for the installer packages
4. Deploy to your servers using the provided commands, or distribute the installers via GPO, SCCM, Intune, Ansible, or any other deployment tool

**Linux tab:**

![Setup Wizard — Step 6: Agents (Linux)](/img/wizard/SCR-20260412-njzg.png)

**Agents enroll automatically and begin reporting metrics within seconds (typically under 60).** This step is skippable — you can deploy agents later.

### Step 7: Network (IPAM Subnets)

![Setup Wizard — Step 7: Network](/img/wizard/SCR-20260412-nkhs.png)

Define the IP ranges to scan. Stratora will do the rest — scanning every address, identifying live hosts, and classifying devices automatically. These are used for discovery scanning and IPAM tracking.

1. Enter a **CIDR** (e.g., `10.40.0.0/24`)
2. Assign a **Site**
3. Optionally add a **Name**, **Gateway**, and **VLAN ID**
4. Click **Add**

Add all subnets you want to scan. The discovery step will use these as scan targets.

This step is skippable if you only plan to monitor agent-based devices.

### Step 8: Discovery

![Setup Wizard — Step 8: Discovery](/img/wizard/SCR-20260412-nkjl.png)

This is where Stratora scans your network and finds devices automatically.

**Configure:** Your subnets from Step 7 and credentials from Step 5 are pre-selected. Adjust if needed, then click **Start Scan**. Stratora handles everything from here.

**Scan:** Stratora scans all IP addresses in your selected subnets using ICMP ping, TCP port probing, and SNMP queries. Devices appear in the results table as they're discovered. Within under a minute, discovered devices begin appearing in real time as the scan progresses. The scan typically takes 5–10 minutes for a few /24 subnets.

Each discovered device is classified automatically:
- **High confidence** — SNMP-responding devices with full identification (firewalls, switches, APs, NAS, servers)
- **Medium confidence** — Devices with a hostname or open ports but no SNMP
- **Low confidence** — ICMP-only responses (often proxy ARP phantoms from firewalls)

**After the scan completes:**

![Setup Wizard — Step 8: Discovery (Import)](/img/wizard/SCR-20260412-nlpb.png)

**Import:** Review the results. Devices are pre-selected based on confidence level. Click **Import Devices** to add them to monitoring. Imported devices are immediately assigned monitoring templates, dashboards, and default alert rules based on their device type — no manual configuration required.

This step is skippable if you prefer to add devices manually.

### Step 9: Alerts & Escalation

![Setup Wizard — Step 9: Alerts & Contacts](/img/wizard/SCR-20260412-nlsa.png)

Start by adding your notification contacts — the people who should receive alerts when something goes wrong. Enter a **Name**, **Email**, and optionally a **Phone** number for each contact. You can add contacts individually with **Add Contact**, use a **Template**, or bulk-import via **Import CSV**.

Once your contacts are added, click **Continue to Escalation Team** to open the escalation team builder:

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

### Step 10: Summary

![Setup Wizard — Step 10: Summary](/img/wizard/SCR-20260412-nluq.png)

The summary shows your configured environment at a glance: sites, credentials, subnets, monitored devices, and alert rules. If you skipped any steps, a **Complete Later** section lists them with direct links to the relevant settings pages where you can finish configuration at any time. Click **Go to Dashboard** — your infrastructure is now live.

## After Setup

At this point, your infrastructure is live. Stratora has discovered your devices, generated site dashboards and topology maps, assigned monitoring templates, and activated alert rules — all automatically. No manual dashboards, alert rules, or templates were required to reach this point. What follows is a brief orientation to what you now have.

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
