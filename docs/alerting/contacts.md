---
sidebar_label: Contacts
title: Contacts
---

# Contacts

**Contacts** are the people and groups who receive alert notifications. A contact record stores a person's name, email, and phone number — providing a central directory that [escalation teams](./escalation-teams.md) and on-call rotations can reference.

---

## Creating Contacts

Navigate to **Alerting → Contacts** and click **Add Contact**.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Full name of the contact |
| Email | No | Email address for notifications |
| Phone | No | Phone number (for future SMS/voice notifications) |
| Webhook URL | No | Direct webhook URL for this contact |
| Notes | No | Free-text notes about the contact's role or responsibilities |

---

## Contact Sources

Contacts can be created manually or synced from an external directory service.

| Source | Description |
|--------|-------------|
| **Manual** | Created directly in the Stratora UI |
| **LDAP** | Synced from an LDAP / Active Directory server |
| **Entra** | Synced from Microsoft Entra ID (Azure AD) |
| **Okta** | Synced from Okta |

Contacts synced from an external source are marked as **managed** — their fields are updated automatically by the sync process and cannot be edited manually in Stratora. This prevents local edits from being overwritten on the next sync.

Each synced contact stores an **external ID** that links it back to the source directory record, ensuring updates and deletions are tracked correctly.

---

## Contact Groups

Contacts can be organized into **groups** for easier management.

Each group has:

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Group name (e.g., "Network Team", "Site Admins") |
| Description | No | Notes about the group's purpose |
| Members | Yes | One or more contacts |

Groups are useful for organizing contacts by team, responsibility, or location.

---

## How Contacts Are Used

Contacts integrate with the alerting system in two ways:

### On-Call Rotations

When you set up an [escalation team](./escalation-teams.md) with a rotation schedule, each rotation member can optionally be linked to a contact record. This keeps contact details centralized — if someone's email or phone number changes, you update the contact once and all rotations referencing it get the new information automatically.

### Escalation Step Channels

Escalation step channels can target on-call rotation members dynamically (current on-call, next on-call, etc.). When a channel targets a rotation member who is linked to a contact, the contact's email and phone are used for notification delivery.

---

## Notification Channels

Stratora supports the following notification delivery methods, configured on [escalation team](./escalation-teams.md) step channels:

| Channel | Description | Status |
|---------|-------------|--------|
| **Email** | SMTP-based email delivery | Available |
| **Slack** | Incoming webhook with Block Kit formatting | Available |
| **Microsoft Teams** | Incoming webhook with Adaptive Cards | Available |
| **Generic Webhook** | HTTP POST with JSON payload and custom headers | Available |
| **SMS** | Text message delivery | Planned |
| **Voice** | Automated voice call | Planned |

:::info
SMS and voice notification channels are defined in the system and will be available in a future release.
:::
