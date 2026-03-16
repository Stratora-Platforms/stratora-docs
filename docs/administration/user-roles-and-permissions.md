---
sidebar_label: User Roles & Permissions
title: User Roles & Permissions
sidebar_position: 2
---

# User Roles & Permissions

Stratora uses three roles to control what users can see and do. Every user is assigned exactly one role. Roles cannot be customized — they provide a fixed set of permissions designed for common team structures.

---

## Role Overview

### Admin

Full access to everything. Admins manage the Stratora installation itself — user accounts, security settings, enrollment tokens, licensing, and all monitoring infrastructure.

**Intended for:** The person or team responsible for the Stratora platform.

### Operator

Day-to-day management of the monitored environment. Operators can deploy agents and collectors, run discovery scans, manage alerts, configure dashboards, and respond to incidents. They cannot manage user accounts, enrollment tokens, or system-level settings.

**Intended for:** Network engineers, system administrators, NOC technicians, and anyone who actively manages monitored infrastructure.

### Viewer

Read-only access to monitoring data. Viewers can see dashboards, node status, alerts, maps, and reports — but cannot make changes or deploy anything.

**Intended for:** Management, helpdesk staff, stakeholders who need visibility without the ability to modify the environment.

---

## Permissions by Feature

### Monitoring & Dashboards

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View dashboards and metrics | ✅ | ✅ | ✅ |
| Create, edit, and delete dashboards | ✅ | ✅ | ❌ |
| Share dashboards | ✅ | ✅ | ❌ |
| Manage dashboard folders | ✅ | ✅ | ❌ |
| View topology maps | ✅ | ✅ | ✅ |
| Create, edit, and delete maps | ✅ | ✅ | ❌ |
| View racks | ✅ | ✅ | ✅ |
| Create, edit, and delete racks | ✅ | ✅ | ❌ |
| View and generate reports | ✅ | ✅ | ✅ |

### Infrastructure

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View nodes | ✅ | ✅ | ✅ |
| Add and edit nodes | ✅ | ✅ | ❌ |
| Delete nodes | ✅ | ❌ | ❌ |
| View and manage node groups | ✅ | ✅ | ❌ |
| View sites | ✅ | ✅ | ✅ |
| Create, edit, and delete sites | ✅ | ✅ | ❌ |
| View IPAM subnets and addresses | ✅ | ✅ | ✅ |
| Manage IPAM (add/edit/scan subnets) | ✅ | ✅ | ❌ |

### Collection & Deployment

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| Deploy agents (download, install commands) | ✅ | ✅ | ❌ |
| Deploy collectors | ✅ | ✅ | ❌ |
| View collector status | ✅ | ✅ | ✅ |
| Manage collectors (assign nodes, delete) | ✅ | ❌ | ❌ |
| Run discovery scans | ✅ | ✅ | ❌ |
| Manage discovery jobs (create, schedule, delete) | ✅ | ✅ | ❌ |
| View discovery results | ✅ | ✅ | ✅ |
| Import discovered devices | ✅ | ✅ | ❌ |

### Credentials

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View credentials (masked) | ✅ | ✅ | ✅ |
| Create and delete credentials | ✅ | ❌ | ❌ |
| Reveal credential secrets | ✅ | ❌ | ❌ |
| Attach/detach credentials to nodes | ✅ | ✅ | ❌ |

### Alerting

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View alerts | ✅ | ✅ | ✅ |
| Acknowledge and escalate alerts | ✅ | ✅ | ❌ |
| Mute alerts | ✅ | ✅ | ❌ |
| View alert configurations | ✅ | ✅ | ✅ |
| Create, edit, and delete alert rules | ✅ | ✅ | ❌ |
| View contacts | ✅ | ✅ | ✅ |
| Manage contacts | ✅ | ✅ | ❌ |
| View escalation teams | ✅ | ✅ | ✅ |
| Manage escalation teams | ✅ | ✅ | ❌ |
| View maintenance windows | ✅ | ✅ | ✅ |
| Create and manage maintenance windows | ✅ | ✅ | ❌ |

### Enrollment & Components

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View enrollment tokens | ✅ | ✅ | ❌ |
| Generate and delete enrollment tokens | ✅ | ❌ | ❌ |
| Reveal enrollment token values | ✅ | ❌ | ❌ |
| View registered components (agents/collectors) | ✅ | ✅ | ✅ |
| Revoke component API keys | ✅ | ❌ | ❌ |

### Administration

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View system settings | ✅ | ✅ | ❌ |
| Modify system settings | ✅ | ❌ | ❌ |
| Manage user accounts | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |
| Manage data retention policies | ✅ | ❌ | ❌ |
| Configure identity providers (OIDC/LDAP) | ✅ | ❌ | ❌ |
| Manage SSL/TLS certificates | ✅ | ❌ | ❌ |
| Manage license | ✅ | ❌ | ❌ |
| View license status | ✅ | ✅ | ❌ |
| Configure email/SMTP settings | ✅ | ❌ | ❌ |
| Manage email templates | ✅ | ❌ | ❌ |

### Account

| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View own account settings | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |

---

## Assigning Roles

To assign or change a user's role:

1. Navigate to **Administration > Users**
2. Click the user you want to modify
3. Select the new role from the **Role** dropdown
4. Click **Save**

Only admins can access the Users page and change roles. A user cannot change their own role.

:::tip
Start with **Viewer** for new team members and upgrade to **Operator** as needed. Reserve **Admin** for the smallest number of people necessary — typically 1–2 per organization.
:::
