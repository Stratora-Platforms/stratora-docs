---
title: Search
sidebar_label: Search
sidebar_position: 6
---

# Search

The search box at the top of every page finds the things you have named in Stratora: nodes, sites, maps, dashboards, alerts, people and settings, from wherever you are.

## Using search

1. Click **Search...** in the top bar, or press **Ctrl+K** (**⌘K** on a Mac) from any page.
2. Type at least two characters. Results appear as you type, grouped by kind, for example **Nodes**, **Maps** or **Facility Maps**.
3. Click a result, or move to it with the **↑** and **↓** keys and press **Enter**. **Esc** closes the results.

How matching works:

- A term matches anywhere in a name, without regard to case. `idf` finds "IDF-B" and "Lab IDF".
- Names that equal or start with your term are listed first.
- Each group shows its best few matches, three or five depending on the kind. Type more of the name to narrow it down.
- Characters such as `%`, `_` and `\` match themselves. A term is cut to 100 characters.

On a tablet in portrait (768 to 1023 px wide) the top bar shows a search icon; tap it to open the field across the bar. On a phone the field takes the room left in the top bar.

## What search finds

| Group | Found by | Opens |
|-------|----------|-------|
| **Nodes** | Name, host name, IP address or device type | The node's page |
| **vSphere VMs**, **Proxmox Guests**, **Hyper-V Guests**, **ESXi Hosts** | Name (Proxmox guests also by VM ID) | The page of the node that monitors them |
| **Clusters** (Proxmox and Hyper-V) | Cluster name | A member node's page |
| **Datastores** (vSphere) | Name | The vCenter node's page |
| **Dashboards** | Name or description | The dashboard |
| **Maps** (network and world) | Name, description or the map's site name | The map |
| **Facility Maps** | Plan name, or its site, building or floor name | The plan on the site's Facility tab |
| **Buildings, Floors & Spaces** | Name | The floor plan that shows it (see [Facility maps](./facility-maps.md#finding-facility-maps-with-search)) |
| **Sites** | Name | The site's page |
| **Racks** | Name | The rack |
| **Collectors & Agents** | Name or host name | The node's page, or the Collectors page |
| **Credentials** | Name or type | The Credentials page |
| **Users** | User name, display name or email address | The Users page |
| **Node Groups** | Name or description | The Node Groups page |
| **Supernets** (IPAM) | Name or CIDR | The IPAM subnet list, filtered to that supernet |
| **Subnets** (IPAM) | Name or CIDR | The subnet |
| **IP Addresses** (IPAM) | Address or host name | The node's page, or the address's subnet |
| **Escalation Teams** | Name | The Escalation Teams page |
| **Contacts** | Contact or contact group name | The Contacts page |
| **Active Alerts** | Alert summary or node name | The alert |
| **Alert Definitions** | Name of a built-in or custom alert configuration | The Alert Configurations page |
| **Maintenance** | Name of a maintenance window or recurring schedule | The Maintenance page |
| **Reports** | Report name or description | The Reports page |
| **Discovery Jobs** | Name or target | The Discovery page |
| **Syslog Destinations** | Name | The Syslog Destinations page |
| **Identity Providers** | Name | The Identity Providers page |

Some results open the list page for their kind rather than the item itself, as the **Opens** column shows: credentials, users, node groups, escalation teams, contacts, alert definitions, maintenance, reports, discovery jobs, syslog destinations and identity providers. Find the item there by its name.

Search does not find enrollment tokens or API keys.

### New in 2.5.3

Stratora 2.5.3 adds these to search:

- facility maps, and buildings, floors and spaces (rooms, network closets, MDFs, IDFs, server rooms and areas). A space that is not placed on a plan opens the plan of the nearest floor above it;
- network and world maps by the name of their site;
- alert definitions;
- maintenance windows and recurring maintenance schedules;
- reports;
- discovery jobs;
- IPAM supernets;
- syslog destinations;
- identity providers.

A site result now opens the site's page.

<!-- SCREENSHOT TODO (search-maps-by-site): top bar search for a site name, showing that site's network or world maps in the Maps section with the site name in the subtitle, 1440x900, Halden data. See the shot list in the PR. -->

## What you see depends on your role

Search shows a group only to users who may open the page its results lead to. A user who cannot see a page never gets its results, and search reveals nothing about them.

| Group | Admin | Operator | Viewer |
|-------|:-----:|:--------:|:------:|
| Credentials | ✅ | ✅ | ❌ |
| Users, Syslog Destinations, Identity Providers | ✅ | ❌ | ❌ |
| Every other group | ✅ | ✅ | ✅ |

- **Dashboards**: only the dashboards you may open, such as your own and those shared with you. Admins see all.
- **Facility Maps** and **Buildings, Floors & Spaces**: only the sites whose Facility tab you can see.

See [User Roles & Permissions](../administration/user-roles-and-permissions.md).

## No secrets in results

Results show names and labels only. Search never shows a password, SNMP community string, API key, client secret or other secret. A credential result shows only its name and type, a discovery job its name, target and status, a syslog destination its name and protocol, and an identity provider its name and whether it is enabled.
