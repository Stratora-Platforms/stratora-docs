---
sidebar_label: Facility Maps
title: Facility Maps
---

# Facility Maps

Facility maps show where your infrastructure sits and how it is doing, on your own floor plans. Each [site](../infrastructure/sites.md) has a **Facility** tab. Upload a floor plan for each floor, place nodes, racks and spaces (network closets, MDFs, IDFs, server rooms, rooms and areas) on it, and see their live status at a glance. Select anything on the plan to open a side panel with its health, devices, connections, power and environment readings and alerts. Live status on the plan refreshes every 30 seconds. A floor plan can also be shown on a dashboard (see [Floor plans on dashboards](#floor-plans-on-dashboards)).

A facility map is one floor plan of a site. You reach facility maps in three ways:

- **From the site**: **Infrastructure → Sites**, open the site, **Facility** tab. This is where plans are uploaded, laid out, replaced and deleted.
- **From the Maps page**: **Monitoring → Maps** lists every facility map you can see, next to network and world maps, and **New Map → Facility Map** starts a new one (see [Facility maps on the Maps page](#facility-maps-on-the-maps-page)).
- **From search**: the search box at the top of every page finds facility maps, buildings, floors and spaces (see [Finding facility maps with search](#finding-facility-maps-with-search)).

Whichever way you come in, the plan opens on the site's Facility tab.

![Facility tab: a floor plan with live status markers, and the side panel for the network closet IDF-B open beside it](/img/monitoring/facility-space-overview.png)

Facility maps are included in every edition: Community, Pro and Enterprise.

Screenshots on this page show a fictional site with example readings.

---

## Who can use it

Two permissions control facility maps:

- **`facility:view`** lets a user see floor plans: on the site's Facility tab, on the Maps page, in search and in dashboard panels.
- **`facility:edit`** lets a user upload, replace and delete plans, add and delete spaces, floors and buildings, set the scale, upload photos and edit layouts. It also gives **New Map → Facility Map** and **Edit** on the Maps page.

| Role | Permissions | Facility maps |
|------|-------------|---------------|
| **Admin** | `facility:view`, `facility:edit` | View, upload plans and photos, edit layouts |
| **Operator** | `facility:view`, `facility:edit` | View, upload plans and photos, edit layouts |
| **Viewer** | `facility:view` | View, read-only |

Viewers see every floor plan of a site, with its markers, live status, hover cards and side panels, like they see topology maps. They have no **Plan** menu, no **Edit layout** and no photo upload, and the server refuses any Facility change from them.

See [User Roles & Permissions](../administration/user-roles-and-permissions.md).

---

## Getting started

1. Go to **Infrastructure → Sites**, open a site and choose the **Facility** tab. Or, on **Monitoring → Maps**, choose **New Map → Facility Map** and pick the site (see [New Map → Facility Map](#new-map--facility-map)).
2. Click **Upload a floor plan**. Choose the floor (or **New floor…** to create one) and the plan: an image, or a PDF.
   - An image must be **PNG or JPEG**, up to **25 MB**, **8192 px** on the longest side and 40 megapixels in all.
   - From a **PDF** (up to 50 MB and 200 pages), you import one page: pick it in the preview. Your browser converts that page to a PNG image and uploads the image. The PDF itself is never sent to the server. Password-protected PDFs are refused, and a PDF that is too complex to convert asks you to export the page as PNG instead. **Cancel** stops a conversion at any time.

   ![Upload a floor plan: a two-page PDF, with page 2 chosen in the preview](/img/monitoring/facility-upload-pdf.png)

   - If the site has no buildings or floors yet, the first upload creates "Main building" and "Ground floor". On a site that has floors, pick a floor that has no plan yet, or choose **New floor…** and give the floor a name and, optionally, a level (-20 to 300). A new floor goes into the site's building.
   - A plan is named after its floor.
3. Add the spaces you want to show (closets, MDFs, IDFs, server rooms, rooms and areas) in **Plan → Buildings and floors → Add a space**. Spaces go under a floor. A floor or an area can hold every type of space, so an IDF can sit inside a production area; any other space can hold rooms, closets and areas.
4. Click **Edit layout** and place your nodes, racks and spaces on the plan (see [Editing the layout](#editing-the-layout)). Click **Save**.
5. Optionally, use **Plan → Set scale** so the plan shows a scale bar (see [Setting the scale](#setting-the-scale)).

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
| Environmental sensor | Temperature of the hottest sensor, with that sensor's humidity; if it has none, another sensor's humidity, named for that sensor |

A value that is not collected for a device is left out, never shown as zero. Other device types show status, ping, last seen and alerts.

A node's card also shows the fields the **Nodes** page can show as columns, such as model, serial number, manufacturer, OS, agent version and groups; the same card opens when you hover a device on a topology map. Fields the node has no value for are named together on one line. The card stays fully visible, also in a short browser window or on a phone.

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

![Environment tab for the network closet IDF-B: a UPS with its battery, runtime and load, and a temperature sensor reading 42 °C](/img/monitoring/facility-space-environment.png)

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

Click **Edit layout** (on a screen at least 768 px wide). The editor works like the [dashboard](./dashboards.md) and [map](./maps.md) builders: your changes are a draft until you click **Save**, which saves the whole layout at once. **Cancel** throws the draft away after asking.

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
- **Add floor plan**: upload a plan for another floor, or create a new floor with it (**New floor…**).
- **Buildings and floors**: lists the site's buildings, floors and spaces, adds spaces, and deletes spaces and empty floors and buildings. A floor or building that still has a floor plan cannot be deleted: delete the plan first.
- **Set scale** and **Clear scale**: see [Setting the scale](#setting-the-scale).
- **Delete plan**: removes the plan image and its markers, after asking. The floor stays.

The Facility tab has no rename or duplicate for floor plans, buildings, floors or spaces. To give a plan another image, use **Replace plan**. To start a floor over, delete its plan and upload a new one.

![The Plan menu on the Facility tab](/img/monitoring/facility-plan-menu.png)

Deleting a plan, floor, building or site also removes its plan image files. Deleting a rack, space or site removes its photos.

### Setting the scale

**Plan → Set scale** calibrates a plan to real distances. Draw a line between two points on the plan whose distance you know, for example the two ends of a wall, and enter that length in metres or feet. The plan then shows a scale bar, and a space with an outline shows its real width, depth and floor area. **Plan → Clear scale** removes the scale, after asking.

![Set the plan's scale: the line drawn on the plan is 599 px long, entered as 12 metres](/img/monitoring/facility-set-scale.png)

![A calibrated plan with its scale bar in the bottom-left corner](/img/monitoring/facility-scale-bar.png)

When you replace the image of a calibrated plan, the scale is kept if the new image has the same proportions, and cleared if it does not.

---

## Facility maps on the Maps page

**Monitoring → Maps** lists facility maps next to [network and world maps](./maps.md). Each floor plan you can see is one facility map. The Maps page shows them and links to them; the plans themselves still live on their site's Facility tab.

<!-- SCREENSHOT TODO (maps-facility-tab): Maps page, Facility tab selected, grid view, 1440x900, Halden data. See the shot list in the PR. -->

### Tabs

The tabs at the top read **All**, **Network**, **World** and **Facility**, each with its count. **All** lists every map; **Facility** lists only facility maps. Users without `facility:view` see no **Facility** tab and no facility maps.

### Facility map cards

<!-- SCREENSHOT TODO (maps-facility-cards): close-up of two or three facility map cards in grid view, 1440x900, Halden data. See the shot list in the PR. -->

A facility map's card, or its row in the list view, shows:

- a **Facility** badge;
- the plan's name, with its building and floor under it when they differ from the name;
- its **site**;
- how many nodes, racks and spaces are placed on it, for example "12 placed";
- when it last changed.

### Search, filter, sort and view

The controls above the list work for facility maps as they do for the other maps:

- **Search maps...** filters the list as you type.
- **All Sites** narrows the list to one site's maps.
- **Name** and **Recent** sort by name or by the last change. Click again to reverse the order.
- The **grid** and **list** buttons switch between cards and a table.

### Opening and editing a facility map

- **Click a card** (or **View**) to open the plan on its site's Facility tab, at that floor.
- **Edit** opens the same plan with the layout editor open. It needs `facility:edit` and a screen at least 768 px wide; on a narrower screen the plan opens for viewing.
- Facility maps have no **Rename**, **Duplicate** or **Delete** on the Maps page. Replace and delete a plan, and manage its floors and spaces, on the site's Facility tab (see [Plans, floors and buildings](#plans-floors-and-buildings)).

### New Map → Facility Map

With `facility:edit`, the **New Map** menu has a **Facility Map** entry ("Floor plan of a site with live status") next to **Network Map** and **World Map**.

<!-- SCREENSHOT TODO (maps-new-facility-map): Maps page with the New Map menu open, showing Network Map, World Map and Facility Map, 1440x900, Halden data. See the shot list in the PR. -->

1. On **Monitoring → Maps**, click **New Map → Facility Map**.
2. In **Create Facility Map**, choose the **Site**. If a site is chosen in the **All Sites** filter, it is picked for you.

   <!-- SCREENSHOT TODO (maps-facility-site-picker): the Create Facility Map dialog with a site chosen, 1440x900, Halden data. See the shot list in the PR. -->

3. Click **Continue to site**. The site's Facility tab opens with **Upload a floor plan** already open. Continue from step 2 of [Getting started](#getting-started).

There is no separate builder for facility maps: the new map is the floor plan you upload on the site.

---

## Finding facility maps with search

The search box at the top of every page (**Ctrl+K**) finds facility maps and the places on them. See [Search](./search.md) for everything search covers.

- **Facility Maps**: floor plans, found by the plan's name or by its site, building or floor name. A result opens the plan on the site's Facility tab.
- **Buildings, Floors & Spaces**: buildings, floors, rooms, network closets, MDFs, IDFs, server rooms and areas, found by name, with their type and site. A floor opens its plan. A space that is placed on a plan opens that plan with the space selected and its side panel open. A space that is not placed on any plan opens the plan of the nearest floor above it.

<!-- SCREENSHOT TODO (search-facility-location): top bar search for a space name, showing the Buildings, Floors & Spaces section, 1440x900, Halden data. See the shot list in the PR. -->

These results follow `facility:view` and the sites you can see, like the Facility tab.

---

## Floor plans on dashboards

Dashboards have a **Facility Floor Plan** panel, in the builder's **Maps & Topology** list. In its settings, pick one of the floor plans you can see; they are grouped by site, building and floor, with a search. The panel shows the plan as the site's Facility tab does: the same markers, space outlines, live status, alert badges and hover cards, fitted to the panel. Click a node, rack or space to open the same side panel as on the Facility tab.

The panel is read-only: nothing can be placed or moved from a dashboard. Zoom with the **+** and **−** buttons (or pinch on a touch screen); scrolling over the panel scrolls the dashboard. If the plan was deleted, or has no image yet, the panel says so. Viewers can see the panel, because they can see floor plans. See [Dashboards](./dashboards.md).

![A dashboard with a Facility Floor Plan panel next to power and environment status](/img/monitoring/facility-dashboard-panel.png)

## The node side panel elsewhere

The node side panel is not only on the Facility tab. Clicking a node on a dashboard's topology map, rack or rack topology panel, on a topology map's view page, or on a site's **Topology** and **Racks** tabs opens the same node side panel, with the same tabs and actions, while the dashboard or map stays in place underneath. **Open node page** in the panel goes to the node's page. In a dashboard's edit mode a click still opens the node page.

![The node side panel opened from a Facility Floor Plan panel on a dashboard](/img/monitoring/facility-dashboard-node-panel.png)

---

## Power and environment templates

Stratora 2.5.3 adds ten SNMP templates for UPSs, rack PDUs and environmental sensors. They supply the power and environment readings in the side panel and the built-in alerts below.

| Template | Device | Readings |
|----------|--------|----------|
| **UPS (RFC 1628 UPS-MIB)** | The standard UPS MIB many UPS network cards implement | On battery, battery charge and status, estimated runtime, output load, input and output voltage |
| **APC Smart-UPS** | APC Smart-UPS and Symmetra with a Network Management Card (PowerNet MIB) | The same, plus the battery fault and replace-battery flags |
| **Eaton UPS (XUPS-MIB)** | Eaton UPS network cards that implement the XUPS-MIB | On battery, battery charge, low-battery, fault and replace-battery flags, estimated runtime, output load, input and output voltage |
| **APC Rack PDU (rPDU2)** | APC rack PDUs | Device, phase and bank load state, current, voltage and power |
| **Eaton ePDU (EATON-EPDU-MIB)** | Eaton ePDUs (G3 and G4) | Total power; current, load and threshold state per line and per breaker; line voltage; neutral current |
| **Raritan PX (PDU2-MIB)** | Raritan PX2, PX3 and PX4 PDUs | Inlet power, current and voltage; current and voltage per line; breaker current; the PDU's own threshold states |
| **ServerTech Sentry4 (Sentry4-MIB)** | ServerTech Sentry4 PDUs | Cord power; current and load per line; voltage and power per phase; current and load per branch; the PDU's own threshold states |
| **Environmental Sensor (ENTITY-SENSOR-MIB)** | Temperature and humidity sensors | Temperature and humidity per sensor, named by the sensor's label |
| **APC NetBotz (NetBotz50-MIB)** | APC NetBotz 750 and 755 appliances | Temperature and humidity per sensor, named by the sensor's label |
| **Vertiv Geist (VERTIV-V5-MIB)** | Vertiv Geist Watchdog climate monitors (V5 agent) | Temperature, humidity and airflow per sensor, named by the sensor's label. A unit set to Fahrenheit is converted. |

- All ten use **read-only SNMP**: a read-only community or SNMPv3 user. The device's network card must allow the collector's address.
- **Discovery** should recognise APC Smart-UPS and Symmetra UPSs, Eaton UPS cards, UPS cards that report the UPS-MIB as their system object ID, APC rPDU2 rack PDUs, Eaton ePDUs, Raritan PX, ServerTech Sentry4 and APC NetBotz 750/755. These fingerprints are built from the MIBs and have not been confirmed on real units. Add Vertiv Geist units, other UPS cards and generic environmental sensors by hand and choose the template.
- Not covered: ServerTech Sentry3 PDUs, first-generation APC rack PDUs, and the PDU readings of Geist PDUs.

:::note Not validated on real hardware
These templates are built from the vendor and standard MIBs and tested end to end against simulated devices built from those MIBs, not recordings of real devices. They are not yet validated on real hardware. [Supported Devices](../supported-devices.md) lists them as Code only.
:::

### Built-in power and environment alerts

These [built-in alert configurations](../alerting/alert-configurations.md#built-in-configurations) ship enabled, with no escalation team: they raise alerts, but nothing is sent until an administrator assigns a team. They apply only to UPS, PDU and environmental sensor nodes that use the templates above. In short: UPS on battery, battery low, runtime low and overload; PDU overload (whole PDU, phase or bank); and temperature and humidity out of range.

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

The PDU alerts use the near-overload and overload thresholds configured on the PDU itself. Eaton ePDUs report no PDU-wide load state, so PDU Overload does not apply to them; PDU Phase Overload and PDU Bank Overload do. An RFC 1628 UPS cannot tell a self-test from a power event, so its self-tests also raise UPS On Battery; the APC Smart-UPS template does not report self-tests as on battery. You can change the thresholds, durations and escalation team of each one on the **Alert Configurations** page.

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
