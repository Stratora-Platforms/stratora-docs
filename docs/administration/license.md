---
sidebar_label: License
title: License
---

# License

Stratora uses a file-based licensing model with **Ed25519 cryptographic signatures** for tamper-proof offline validation. No license server or internet connection is required — the license is verified entirely on your Stratora server using a public key embedded in the application.

---

## Editions

| | Community | Pro | Enterprise |
|---|:---------:|:---:|:----------:|
| **Device Limit** | 100 | 250+ | Unlimited |
| **Price** | Free | Per-device subscription | Contact sales |
| **All monitoring features** | Yes | Yes | Yes |
| **Alerting & escalation** | Yes | Yes | Yes |
| **Dashboards & maps** | Yes | Yes | Yes |
| **LDAP / OIDC SSO** | Yes | Yes | Yes |
| **Expansion packs** | — | 250 devices each | — |

### Community Edition

Every Stratora installation starts as Community Edition with a limit of **100 monitored devices**. No license file is required — Community is the default when no license is uploaded.

### Pro Edition

Pro starts at **250 devices** and can be expanded in increments of 250 with additional expansion packs:

| Configuration | Total Devices |
|---------------|:------------:|
| Pro base | 250 |
| Pro + 1 expansion | 500 |
| Pro + 2 expansions | 750 |
| Pro + 3 expansions | 1,000 |

### Enterprise Edition

**Unlimited devices** — no device cap is enforced.

---

## What Counts Toward the Device Limit

Only **actively monitored nodes** count toward your license limit. Specifically, a device counts if it has a record in the node list with an active status.

The following do **not** count:
- IP addresses discovered by IPAM scanning that haven't been imported as nodes
- Nodes that have been deactivated or removed from monitoring
- Discovery scan results that haven't been imported

The active node count is displayed on the license page alongside your limit so you always know where you stand.

---

## Purchasing and Activating a License

### 1. Purchase

Purchase a Pro or Enterprise subscription from the Stratora website. You'll receive a license file (`.lic`) by email.

### 2. Upload

Navigate to **Administration → License** and upload the `.lic` file. You can either:
- Drag and drop the file into the upload area, or
- Click to browse and select the file

### 3. Validation

Stratora validates the license file instantly:
- Verifies the Ed25519 cryptographic signature against the embedded public key
- Confirms the edition and device limit
- Checks the expiration date

If validation passes, the new license takes effect immediately — **no restart required**.

### 4. Confirmation

The license page updates to show your edition, device limit, active node count, and expiration date.

---

## License File

The license file is a signed JSON document containing:

| Field | Description |
|-------|-------------|
| Edition | Community, Pro, or Enterprise |
| Device limit | Maximum number of active nodes |
| Customer name | Your organization name |
| Issued date | When the license was generated |
| Expiration date | When the license expires |
| Signature | Ed25519 cryptographic signature |

The signature covers every field in the file. Any modification — even a single character — will cause validation to fail.

:::warning
Do not edit the license file. The cryptographic signature validates the exact contents of the file. Modified files will be rejected.
:::

---

## License Validation

License validation is **fully offline** — Stratora never contacts an external server to check your license.

- The Ed25519 public key is embedded in the Stratora binary at build time
- Validation computes a canonical representation of the license payload and verifies the signature
- The license file is re-validated automatically every hour to detect expiration
- The active node count is refreshed every 30 seconds

---

## Expiration Behavior

When a license expires:

| What Happens | Details |
|--------------|---------|
| **Existing monitoring continues** | All currently monitored nodes keep collecting data, generating alerts, and sending notifications |
| **No new devices** | You cannot add new nodes until the license is renewed |
| **No data loss** | All historical data, dashboards, alerts, and configurations are preserved |
| **No service disruption** | The Stratora server and all collectors continue running normally |
| **UI notification** | A banner appears indicating the license has expired |

In short: expiration freezes your device count but never stops monitoring or deletes data.

### Renewal

When your subscription renews, you receive a new license file with an updated expiration date. Upload it the same way as the original — the new license replaces the old one and the device count limit is unlocked.

---

## Removing a License

If you need to revert to Community Edition, navigate to **Administration → License** and click **Remove License**. This:

- Deletes the license file from the server
- Reverts the edition to Community with a 100-device limit
- Records the change in the [audit log](./audit-logs.md)

All monitoring continues for devices within the Community limit.

---

## License Page

The license page (**Administration → License**) shows:

- **Current edition** — Community, Pro, or Enterprise
- **Device limit** — maximum allowed nodes
- **Active nodes** — current count of monitored devices
- **Expiration date** — when the license expires (with days remaining)
- **Trial status** — whether this is a trial license
- **License ID** — unique identifier for support reference
