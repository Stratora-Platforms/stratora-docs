---
title: Upgrading Stratora
sidebar_label: Upgrading Stratora
sidebar_position: 9
---

# Upgrading Stratora

## When this page applies

This page covers in-place upgrades for an existing Stratora deployment moving to a newer release. If you're installing Stratora for the first time, start at [Getting Started](/docs/getting-started) instead.

## Standard in-place upgrade

1. Download the new Stratora Server MSI from the releases page.
2. Verify the SHA-256 against the value published in the release notes.
3. Run the installer:

   ```
   msiexec /i Stratora-Server-X.Y.Z.msi /quiet /norestart /l*v upgrade.log
   ```

4. Wait ~60 seconds for services to restart.
5. Confirm the version reads correctly in the footer or About view.

## What's preserved

The in-place upgrade preserves everything: sites, IPAM bindings, wizard-imported nodes, agent rows, user accounts, certificate configuration, dashboards, and all alerting state. You do not need to re-run the Setup Wizard.

## If something looks wrong

**A Stratora service didn't restart cleanly.** Open the Services console (`services.msc`) and confirm each Stratora service is in the Running state. If any are stopped, check the Windows Event Log under Application for the service name to find the failure reason.

**The version footer still shows the old version.** Hard-reload the browser (Ctrl+Shift+R) to bypass cached UI assets. If the version still doesn't update, the backend service may not have restarted with the new binary — restart it via the Services console.

**The UI is unreachable after the upgrade.** Confirm the Stratora NGINX service is running, that the server's certificate is still trusted by your browser, and that nothing else has taken port 443.

## See also

- [Architecture](/docs/architecture) — how Server, Agents, and Collectors fit together
- [Changelog](/docs/changelog) — what's new in each release
