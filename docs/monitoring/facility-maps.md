---
sidebar_label: Facility Maps
title: Facility Maps
---

# Facility Maps

Facility maps show where your infrastructure sits and how it is doing, on your own floor plans. Each [site](../infrastructure/sites.md) has a **Facility** tab. Upload a floor plan for each floor, place nodes, racks and spaces (network closets, MDFs, IDFs, server rooms, rooms and areas) on it, and see their live status at a glance. Select anything on the plan to open a side panel with its health, devices, connections, power and environment readings and alerts.

![Facility tab: a floor plan with live status markers, and the side panel for the network closet IDF-B open beside it](/img/monitoring/facility-space-overview.png)

Facility maps are included in every edition: Community, Pro and Enterprise.

Screenshots on this page show a fictional site with example readings.

---

## Who can use it

| Role | Facility tab |
|------|--------------|
| **Admin** | View, upload plans and photos, edit layouts |
| **Operator** | View, upload plans and photos, edit layouts |
| **Viewer** | Does not see the Facility tab |

See [User Roles & Permissions](../administration/user-roles-and-permissions.md).

---

## Getting started

1. Go to **Infrastructure → Sites**, open a site and choose the **Facility** tab.
2. Click **Upload a floor plan**. Choose the floor (or **New floor…** to create one) and the plan image.
   - The image must be **PNG or JPEG**, up to **25 MB**, **8192 px** on the longest side and 40 megapixels in all. Export a PDF plan as PNG first.
   - If the site has no buildings or floors yet, the first upload creates "Main building" and "Ground floor". You can rename and add more in **Buildings and floors**.
3. Add the spaces you want to show (closets, MDFs, IDFs, server rooms, rooms and areas) in **Plan → Buildings and floors → Add a space**. Spaces go under a floor. A floor or an area can hold every type of space, so an IDF can sit inside a production area; any other space can hold rooms, closets and areas.
4. Click **Edit layout** and place your nodes, racks and spaces on the plan (see [Editing the layout](#editing-the-layout)). Click **Save**.

Racks come from the site's [rack diagrams](./racks.md). A node that is mounted in a rack is placed with its rack, not on its own.

---

## Reading the plan

Each floor has its own plan. Pick the floor from the selector at the top left. Zoom with the **+** and **−** buttons or the mouse wheel, drag to pan, and use the fit button to see the whole plan again.

- **Nodes** use the same device icons as the [topology map](./maps.md#topology-maps), inside a ring in their status colour.
- **Racks** are drawn as small racks, with a status bar for their worst status and bands that show how many of their devices are in each status.
- **Spaces** have their own icon per type. A space can also have an outline on the plan. Its marker and outline take the status of what it contains.
- **Alert badges.** A node, rack or space with active alerts carries a warning or critical triangle on its marker.
- **Labels.** Names show under the markers. The **Labels** control sets when: **Auto** shows them once you zoom in, **On** always, **Off** never. A node named by its full domain name shows its short host name.

Status colours are the same as everywhere else in Stratora: healthy, warning, critical, offline, maintenance, and grey **Unknown** for a device with no status data yet. A device that has not been checked yet, or has no status data, is never counted as online.

### Hover cards

Pause the pointer over a marker, or move keyboard focus to it, to see a hover card. Nothing extra is loaded: the card uses the same live data as the plan, which refreshes about every 30 seconds.

![Hover card for a Wi-Fi access point: status, ping reply, last seen, uptime, active alerts and its client count](/img/monitoring/facility-hover-node.png)

For a **node** the card shows:

- its status (up, down, degraded and so on);
- **Ping**: the reply time and packet loss, for example "&lt;1 ms · 0% loss", or **No reply**;
- **Last seen**: when it last replied, or **Never** if it has never replied;
- **Uptime** and **Active alerts**;
- up to three readings for its type:

| Device type | Readings on the hover card |
|-------------|----------------------------|
| Wi-Fi access point, Wi-Fi controller | Clients, for controllers and for access points whose template reports a per-access-point count |
| Switch, router, firewall | Ports up and down (Interfaces for firewalls that report no port type), errors in the last 15 minutes |
| Windows, Linux and hypervisor servers | CPU, memory |
| UPS | Battery, load, runtime |
| PDU | Power, current |
| Environmental sensor | Temperature of the hottest sensor, and its humidity |

A value that is not collected for a device is left out, never shown as zero. Other device types show status, ping, last seen and alerts.

For a **rack** the card shows its devices by status, the worst status, active alerts, and its power and environment readings when they are collected. For a **space** it shows its devices by status, the worst status and active alerts.

![Hover card for a rack: its devices by status, worst status, active alerts and power readings](/img/monitoring/facility-hover-rack.png)

Touch screens show no hover card: tap the marker to open its side panel instead.

---

## The side panel

Click a node, rack or space to open its side panel. Click another marker to switch the panel to it.

At the top of the panel:

- the **header**: its icon framed in its status colour, its name, its type and where it is (for example "Network closet · Level 1", or "In rack HQ-R01, U40" for a racked node), and a status dot;
- a **breadcrumb** (site › floor › space › rack › node) that shows where the selection is. Click an entry to go up;
- **Back to** a space or rack, when you opened a rack or device from inside a space's or rack's panel. Racks and devices open in the panel even when they have no marker of their own on this plan.

Below that are the tabs. The tab you pick stays selected when you move to another selection of the same kind.

| Selection | Tabs |
|-----------|------|
| Space | Overview, Devices, Links, Environment, Events |
| Rack | Overview, Devices, Links, Environment, Events |
| Node | Overview, Links, Events, plus Environment for UPS, PDU and environmental sensor nodes |

### Overview

For a **space** or **rack**, the Overview tab shows:

- a **photo**. A rack without a photo shows a live picture of its elevation instead, each device in its status colour, and so does a space that holds a single rack. Click the photo for a larger view;
- **facts**: building, floor and area, type, the power devices (UPSs and PDUs) with their status, and the latest temperature and humidity from an environmental sensor in it. A sensor that has no readings says **No readings collected**;
- **Open rack view** and **View in topology**, plus a **…** menu with links to the Racks tab and the site's alerts;
- a **health summary**: four tiles for devices online, devices down, warnings and maintenance. Devices with no status yet are listed apart, never counted as online;
- **Top devices**: the five devices in the worst state. Click one to open it in the panel, or **View all devices** to go to the Devices tab.

For a **node**, the Overview tab shows its status, active alerts, building, floor and area, its rack and U position if it is racked, its type, template, IP address, when it was last seen and whether data is arriving. Below that are **Open node page** and **View in topology** (with Charts and Alerts in the **…** menu), its summary cards and its most urgent active alerts.

![Side panel for a Wi-Fi access point: facts, actions, summary cards and active alerts](/img/monitoring/facility-node-overview.png)

### Devices

Every device in the space or rack, grouped by rack and then "Not in a rack", with its status. A search box appears when there are more than ten. A device belongs to a space when it is in a rack in that space (or in a space inside it), or when its marker is inside the space's outline on the same plan.

For a rack, the Devices tab also shows the rack's front and rear elevation. Select a device in the elevation to see its summary.

![Rack side panel, Devices tab, with the front elevation of HQ-R01](/img/monitoring/facility-rack-devices.png)

### Links

The topology connections that touch the node, or the devices in the space or rack: the peer, the interfaces at each end, the link state, and the utilisation when it is known. Connections come from topology discovery and the topology editor. If none are known, the tab says so.

### Environment

The power and environmental devices in the space or rack, with their status and latest readings:

- **UPS**: power source (mains or on battery), battery charge, runtime, load, and input and output voltage;
- **PDU**: input voltage, power and current;
- **Environmental sensor**: temperature and humidity per sensor.

![Environment tab for the network closet IDF-B: a UPS with its battery, runtime and load, and a temperature sensor reading 36 °C](/img/monitoring/facility-space-environment.png)

Readings come from devices that use the UPS, rack PDU and environmental sensor templates (see [Power and environment templates](#power-and-environment-templates)). For other devices the panel says that no readings are collected for that device type. A reading is only shown while fresh data arrives: a device that stops reporting shows no reading rather than an old value. Temperatures follow your temperature unit setting.

### Events

Active alerts, and alerts resolved in the last 24 hours, for the node or for the devices in the space or rack, newest first. Use the **All**, **Critical**, **Warning** and **Info** chips to filter; each shows its count. Click an alert to open it, or **Open in Alerts** for the full list.

Muted, test and suppressed alerts are not counted on the panel, the hover card or the marker badges.

![Events tab for the network closet IDF-B with an active temperature alert](/img/monitoring/facility-space-events.png)

### View in topology

**View in topology** opens the site's [topology map](./maps.md#topology-maps) with the selected node, or the devices of the space or rack, highlighted and centred. If some of them are not on that map, a notice says how many.

### How the panel fits the screen

| Screen | Where the panel opens |
|--------|-----------------------|
| Wide desktop window | Beside the plan. The plan narrows so all of it stays visible. |
| Narrower window or tablet | Over the plan, on the right. |
| Phone | As a sheet from the bottom of the screen. |
| Editing (desktop) | Docked beside the plan as the **Properties** panel (see below). |

![A narrower window: the side panel opens over the plan](/img/monitoring/facility-narrow-overlay.png)

On a phone you can view the plan, its markers and their panels. Editing needs a screen at least 768 px wide.

![Phone view: the side panel for IDF-B as a bottom sheet over the plan](/img/monitoring/facility-phone-sheet.png)

---

## Editing the layout

Click **Edit layout** (desktop only). The editor works like the [dashboard](./dashboards.md) and [map](./maps.md) builders: your changes are a draft until you click **Save**, which saves the whole layout at once. **Cancel** throws the draft away after asking.

![Layout editor: the palette of spaces, nodes and racks on the left, the plan in the middle and the docked Properties panel on the right](/img/monitoring/facility-editor.png)

- **Palette.** The left side lists this floor's spaces, then the site's unplaced nodes (grouped by device type) and racks. Search by name or IP address.
- **Placing.** Drag an item onto the plan, or choose **Place** and then click the plan. A marker you place shows the node's real status straight away, before you save. **Esc** cancels Place.
- **Moving.** Drag a marker, or select it and use the arrow keys (Shift moves 10 px).
- **Removing.** Select a marker and press **Delete**, or use **Remove from plan** in its panel.
- **Space outlines.** In a space's properties, choose **Draw area** and drag a rectangle on the plan. Resize it by dragging a corner handle, or focus a handle and use the arrow keys. The outline moves with the marker. **Remove area** removes it. The devices inside an outline belong to that space once you save.
- **Name label.** Each marker's label can follow the plan's **Labels** setting, or be set to always **Show** or **Hide**.
- **Undo and Redo.** Buttons in the toolbar, or Ctrl+Z and Ctrl+Shift+Z (Ctrl+Y). Ctrl+S saves.
- **Properties.** On a wide screen the selected marker's panel is docked beside the plan, like the map builder's Properties panel, so placing many items in a row never covers the plan. On narrower screens the toolbar names the selected marker and **Details** opens its panel.
- **Last edited by** next to the floor selector shows who saved the plan last, and when.

If someone else changed the same plan while you were editing, nothing is saved. The changes that collided are listed, and you can reload the plan and reapply your other changes. If you leave the page with unsaved changes, Stratora asks first, and offers to restore the draft when you come back.

### Photos

A rack or a space can have one photo, shown on its Overview tab. In the editor, select the rack or space and use **Add photo**, **Replace photo** or **Remove** in the **Photo** section of its panel. Photos must be PNG or JPEG, up to 25 MB, 8192 px on the longest side and 40 megapixels in all. A photo is saved as soon as you upload or remove it, not with the layout's **Save**.

When you upload a photo or a floor plan image, Stratora removes the location, camera details, comments and embedded thumbnails stored in the file before it saves it. The picture itself is not re-encoded.

### Plans, floors and buildings

The **Plan** menu (desktop) holds:

- **Replace plan**: upload a new image for this floor. Markers keep their places relative to the plan.
- **Add floor plan**: upload a plan for another floor.
- **Buildings and floors**: add buildings, floors and spaces, and delete empty floors and buildings.
- **Delete plan**: removes the plan image and its markers, after asking. The floor stays.

Deleting a plan, floor, building or site also removes its plan image files. Deleting a rack, space or site removes its photos.

---

## Power and environment templates

Stratora 2.5.3 adds four SNMP templates that supply the power and environment readings in the side panel and their built-in alerts:

| Template | Device | Readings |
|----------|--------|----------|
| **UPS (RFC 1628 UPS-MIB)** | The standard UPS MIB many UPS network cards implement | On battery, battery charge and status, estimated runtime, output load, input and output voltage |
| **APC Smart-UPS** | APC Smart-UPS and Symmetra with a Network Management Card (PowerNet MIB) | The same, plus the battery fault and replace-battery flags |
| **APC Rack PDU (rPDU2)** | APC rack PDUs | Device, phase and bank load state, current, voltage and power |
| **Environmental Sensor (ENTITY-SENSOR-MIB)** | Temperature and humidity sensors | Temperature and humidity per sensor, named by the sensor's label |

- All four use **read-only SNMP**: a read-only community or SNMPv3 user. The UPS or PDU network card must allow the collector's address.
- **Discovery** should recognise APC Smart-UPS and Symmetra UPSs, APC rPDU2 rack PDUs, and UPS cards that report the UPS-MIB as their system object ID. This is not yet confirmed on real units. Add other UPS cards and environmental sensors by hand and choose the template.
- Eaton, Raritan, ServerTech, APC NetBotz and Vertiv Geist devices are not covered.

:::note Not validated on real hardware
These templates are built from the vendor and standard MIBs and tested against simulated devices built from those MIBs, not recordings of real devices. They have not been tested on real hardware. [Supported Devices](../supported-devices.md) lists them as Code only.
:::

### Built-in power and environment alerts

These [built-in alert configurations](../alerting/alert-configurations.md#built-in-configurations) ship enabled, with no escalation team: they raise alerts, but nothing is sent until an administrator assigns a team. They apply only to UPS, PDU and environmental sensor nodes that use the templates above.

| Alert | Warning | Critical | Duration |
|-------|---------|----------|----------|
| **UPS On Battery** | The UPS runs on battery | — | Opens on the next check after the UPS reports it; resolves after 2 minutes back on mains |
| **UPS Battery Low** | — | The UPS reports its battery low | Opens on the next check; resolves after 2 minutes back to normal |
| **UPS Runtime Low** | Estimated runtime below 10 minutes | Below 5 minutes | 2 minutes |
| **UPS Overload** | Output load above 80 % | Above 95 % | 2 minutes |
| **PDU Overload** | The PDU reports near overload | The PDU reports overload | 1 minute |
| **PDU Phase Overload** | A phase is near overload | A phase is in overload | 1 minute |
| **PDU Bank Overload** | A bank is near overload | A bank is in overload | 1 minute |
| **Environmental Sensor Temperature High** | Above 35 °C | Above 40 °C | 5 minutes |
| **Environmental Sensor Temperature Low** | Below 10 °C | Below 5 °C | 5 minutes |
| **Environmental Sensor Humidity High** | Above 70 % | Above 80 % | 5 minutes |
| **Environmental Sensor Humidity Low** | Below 15 % | Below 8 % | 5 minutes |

The PDU alerts use the near-overload and overload thresholds configured on the PDU itself. An RFC 1628 UPS cannot tell a self-test from a power event, so its self-tests also raise UPS On Battery; the APC Smart-UPS template does not report self-tests as on battery. You can change the thresholds, durations and escalation team of each one on the **Alert Configurations** page.

:::note PDUs added as UPS by an earlier version
Discovery now adds APC rack and switched PDUs as **PDU**. The upgrade does not change the device type of existing nodes. To get PDU readings and alerts for a PDU that an earlier version added as a UPS, edit the node and set its device type to **PDU** and its template to **APC Rack PDU (rPDU2)**.
:::

---

## Storage and backups

Floor plan images and photos are stored on the Stratora server, in the install folder's `data` folder (by default `C:\Program Files\Stratora\data`):

| Folder | Holds |
|--------|-------|
| `data\facility-plans` | Floor plan images |
| `data\facility-photos` | Rack and space photos |

The layout itself (buildings, floors, spaces and marker positions) is in the database. Back up these folders together with the rest of the `data` folder and the database, from the same point in time, so plans and photos match the layout. See [Upgrading Stratora](../administration/upgrading-stratora.md) for backing up the server.
