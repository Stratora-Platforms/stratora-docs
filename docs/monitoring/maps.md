---
sidebar_label: Maps
title: Maps
---

# Maps

Stratora provides two types of interactive maps for visualizing your infrastructure:

- **Topology maps** — logical network diagrams showing how devices connect, with live status overlays
- **World maps** — geographic views showing site locations with health status pins

Both map types use the same **three-panel builder pattern** as dashboards: a left sidebar for browsing available items, a center canvas for placement, and a right panel for properties and configuration. Both support edit/view mode separation and can be embedded as panels inside dashboards.

---

## Topology Maps

A topology map is a visual diagram of your infrastructure — devices, connections, and logical groupings laid out on a canvas with real-time health overlays.

{/* ![Topology map view](./img/topology-map.png) */}

### What's on the Canvas

| Element | Description |
|---------|-------------|
| **Device nodes** | Represent monitored [nodes](../infrastructure/nodes.md) — switches, servers, firewalls, etc. Show real-time health via color-coded borders (green/yellow/red/gray) |
| **Labels** | Text annotations for documenting your diagram |
| **Zones** | Rectangular grouping areas that visually organize related devices (e.g., "Server Room", "DMZ", "Core Network") |
| **Connections** | Lines between devices representing physical or logical links, with optional interface assignment and utilization display |

### Building a Topology Map

1. Navigate to **Monitoring → Maps** and click **New Topology Map**
2. The builder opens with three panels:
   - **Left sidebar** — browse available devices to place on the canvas
   - **Center canvas** — the interactive diagram area with pan and zoom
   - **Right panel** — properties for the selected element (styling, interfaces, position)
3. Drag devices from the sidebar onto the canvas
4. Draw connections by dragging between device handles
5. Add zones and labels as needed
6. Click **Save** to persist the layout

### Device Nodes

Each device node on the map is linked to a monitored node. The node's border color reflects its real-time health status:

- **Green** — healthy
- **Yellow** — warning
- **Red** — critical or offline
- **Gray** — unknown

Hover over a device to see its name, IP address, status, uptime, response time, and last-seen timestamp. Click to navigate to the node's detail page.

### Zones

Zones are rectangular areas that group related devices. They render behind device nodes and serve both as visual organization and as aggregation boundaries.

- **Customizable appearance** — border style (solid, dashed, dotted), border color, fill color with opacity
- **Label positioning** — top-left, center, or top-right
- **Health tooltip** — hover over a zone to see a summary of device health within it (e.g., "5 devices: 4 healthy, 1 warning")

:::tip
Use zones to represent functional areas of your network — server rooms, VLANs, security zones, or cloud regions. When a device inside a zone goes critical, the zone's tooltip immediately reflects the degraded state.
:::

### Connections

Connections represent links between devices. They support:

- **Interface assignment** — associate each end of a connection with a specific network interface (auto-discovered from metrics)
- **Line styles** — solid, dashed, or dotted
- **Edge types** — straight, bezier curve, smooth step, or step
- **Bend points** — add manual bend points for cleaner routing (Alt+Click to add, double-click to remove)
- **Utilization display** — optionally show live throughput on the connection
- **Status coloring** — connections change color when an interface has errors or is down

### Edit vs. View Mode

- **Edit mode** (builder) — full drag-and-drop, element creation, connection drawing, property editing, save controls
- **View mode** — read-only diagram with pan/zoom, hover tooltips, and click-to-navigate

---

## World Maps

A world map shows your [sites](../infrastructure/sites.md) and maps as pins on a geographic view, with live health status.

{/* ![World map view](./img/world-map.png) */}

### Pin Types

You can place three kinds of pins on a world map:

| Pin Type | Links To | Health Source |
|----------|----------|--------------|
| **Site** | A Stratora site | Aggregated reachability of all nodes at the site |
| **Topology Map** | A saved topology map | Health of devices placed on that map |
| **World Map** | Another world map | Worst-state rollup from the linked map (hierarchical) |

### Health Status

Pin colors reflect real-time health based on node reachability:

| Color | Meaning |
|-------|---------|
| **Green** | All nodes online |
| **Yellow** | Some nodes offline |
| **Red** | All nodes offline |
| **Orange** | In maintenance |
| **Gray** | Unknown or no nodes |

### Building a World Map

1. Navigate to **Monitoring → Maps** and click **New World Map**
2. The builder opens with three panels:
   - **Left sidebar** — browse sites, topology maps, and other world maps available for pinning
   - **Center canvas** — interactive geographic map with pan and zoom
   - **Right panel** — list of placed pins with status indicators
3. Drag items from the sidebar onto the map, or click the map to place a pin at specific coordinates
4. Drag pins to adjust their position
5. Click **Save** to persist

### Preset Views

The world map includes preset zoom levels for quick navigation:

- World, North America, Europe, Asia Pacific, South America, Africa, Middle East
- US regional views (Northeast, Southeast, Midwest, West Coast)
- UK, DACH (Germany/Austria/Switzerland)

### Drill-Down

Click a pin to navigate to the linked site, topology map, or nested world map. This makes world maps a natural entry point for a hierarchical view of your infrastructure — start with a global view, click into a region, then into a site.

---

## Embedding Maps in Dashboards

Both map types can be embedded as panels in [dashboards](./dashboards.md):

- **Topology Map panel** — displays a saved topology map with live status, pan/zoom, and hover tooltips
- **World Map panel** — displays a saved world map with live pin health and drill-down. Each panel instance remembers its own zoom level and center position independently.

---

## Maps as Live Documentation

Beyond real-time monitoring, maps serve as living documentation of your environment:

- **Topology maps** document logical network architecture — device placement, connectivity, and functional zones
- **World maps** document site locations and the relationships between them
- Both update automatically as device health changes, keeping your documentation current without manual effort
