---
title: Install the Stratora Server
sidebar_label: Stratora Server (Windows)
sidebar_position: 1
---

# Install the Stratora Server

The Stratora Server runs on Windows. One installer, `Stratora-Server-X.Y.Z.msi`, installs everything the server needs: the web interface and API, the database (PostgreSQL), the metric store (VictoriaMetrics) and the web server (NGINX). It also installs a collector and an agent on the server itself, so you can start monitoring straight away.

This page covers a first-time install. To upgrade a server you already run, see [Upgrading Stratora](/docs/administration/upgrading-stratora). After the install, the [Setup Wizard](/docs/getting-started#setup-wizard) takes you through the first configuration.

---

## Before you install

| Requirement | Details |
|---|---|
| Operating system | Windows Server 2016 or later, 64-bit. Stratora 2.5.3 was tested on Windows Server 2022. The installer allows Windows Server 2016 and 2019, but they were not tested with this release. |
| Hardware | 4 CPU cores, 16 GB RAM and 200 GB of disk. The `data` folder holds the database and the metric store, so give it room to grow. |
| Account | A local administrator. The installer runs elevated. |
| Name | A DNS name (FQDN) for the server, with an A record that points to it. The Setup Wizard checks it, and collectors and agents use it to reach the server. |
| Network | Inbound HTTPS (TCP 443) from your users, collectors and agents. Port 80 from the internet only if you want a Let's Encrypt certificate with the HTTP-01 challenge. See [Network](/docs/prerequisites/network). |

Use a server of its own for Stratora. The installer sets up its own PostgreSQL, VictoriaMetrics and NGINX services, and the web interface uses port 443.

---

## Choose the install folder

The default install folder is `C:\Program Files\Stratora`. Use it unless you have a reason not to.

You can choose another folder on the installer's **Destination Folder** page, or with `INSTALLFOLDER` on the command line, for example `INSTALLFOLDER="D:\Stratora"`. The installer gives a custom folder the same permissions as Program Files (SYSTEM and Administrators have full control, standard users can only read), and restricts the `data` folder inside it to SYSTEM and Administrators.

### Folders the installer refuses

A new install stops **before it changes anything** when the folder is:

- the root of a drive, such as `D:\`;
- the Windows folder or a folder in it, `C:\Users`, `C:\ProgramData`, or a Program Files folder itself;
- a folder inside a user profile (`C:\Users\...`) or inside `C:\ProgramData\Microsoft`;
- a folder whose parent folders, up to the root of the drive, include one that a standard user owns, or in which a standard user can rename, delete or replace what it holds;
- a folder that already holds something a standard user owns or can change;
- a folder reached through a junction, a directory symbolic link or a mounted volume folder, or a folder below one. The Stratora Server must be in a real folder on a local NTFS volume. The documentation page "The Server install folder is a link or a mounted folder", in the Administration section, explains this case and how to move an existing server into a real folder.

The installer log names the folder and what is wrong with it: `logs\postinstall.log` in the install folder, and the log you asked for with `/l*v`. A refused link or mounted folder is also written to the Windows Application event log, source **Stratora**, event ID **4245**.

**Some of these are refused on an upgrade too.** For an existing server in a drive root, the Windows folder or a system folder, the upgrade refuses that folder and ends "completed with errors" (see [Upgrading Stratora](/docs/administration/upgrading-stratora)). An install folder reached through a link or a mounted volume folder stops the upgrade before it changes anything, with event ID 4245.

To fix a refusal, choose a folder whose parent folders only administrators can change (the default under Program Files always qualifies), or remove the permission the log names, and run the installer again.

### Warnings instead of a refusal

An existing install is never moved. Apart from the refusals above, when an upgrade or a repair finds a problem with the folder it already uses, it keeps the install in place, restricts what it can, and warns you:

- the installer log lists each warning;
- the Application event log gets one warning, source **Stratora**, event ID **4250**;
- administrators see a banner at the top of every page, and **Administration → Diagnostics** lists each warning with what to do about it. The banner goes away by itself once the cause is fixed and a repair finishes without warnings.

### The server's own collector and agent

The collector and agent that the Server installs for itself always go into `C:\Program Files\Stratora\Collector` and `C:\Program Files\Stratora\Agent`, whatever folder you choose for the Server.

---

## Download and check the installer

1. Download `Stratora-Server-X.Y.Z.msi` from the [releases page](https://github.com/Stratora-Platforms/stratora-releases/releases). It is the only file you need: the Remote Collector and Agent installers are inside it, and your server offers them for download once it is installed.
2. Check its SHA-256 against the value in the release notes:

   ```powershell
   Get-FileHash .\Stratora-Server-X.Y.Z.msi -Algorithm SHA256
   ```

---

## Run the installer

**Interactively.** Double-click the MSI, accept the Windows User Account Control (UAC) prompt, accept the licence, choose the install folder on **Destination Folder**, and click **Install**.

**From the command line.** Open a Command Prompt with **Run as administrator**:

```cmd
:: Default folder, no UI, with a log
msiexec /i Stratora-Server-X.Y.Z.msi /qn /norestart /l*v install.log

:: Custom folder
msiexec /i Stratora-Server-X.Y.Z.msi /qn /norestart /l*v install.log INSTALLFOLDER="D:\Stratora"
```

Keep the log until you have signed in.

### What the installer sets up

| Service | What it does |
|---|---|
| `StratoraPostgreSQL` | The database |
| `StratoraVictoriaMetrics` | The metric store |
| `StratoraBackend` | The API and the web interface |
| `StratoraNginx` | The web server on port 443 |

When the backend first starts, it creates the one-time admin password (see [Sign in for the first time](#sign-in-for-the-first-time)) and `data\server-trust.key`, the server's trust key (see [Certificates](#certificates)).

Shortly after the installer finishes, it installs the server's own collector and agent in the background, as a separate product named **Stratora Remote Collector**. That adds four more services: `StratoraCollector`, `stratora-collector-telegraf`, `StratoraAgent` and `stratora-agent-telegraf`. Its log is `logs\collector-install.log` in the install folder. This collector and agent are approved automatically.

To check the services, run this in PowerShell:

```powershell
Get-Service Stratora* | Format-Table Status, Name, DisplayName
```

### If the install fails or you cancel it

Windows Installer rolls a failed or cancelled first install back: it removes what it installed, and the server is not left half installed. Read the reason in the log you wrote with `/l*v` and in the Windows Application event log, fix the cause, and run the installer again.

---

## Sign in for the first time

Stratora has no default password. When the backend first starts, it creates a one-time password for the `admin` account and writes it to `data\initial-admin-password.txt` in the install folder. Only SYSTEM and Administrators can read the file.

1. On the server, open PowerShell with **Run as administrator** and read the password:

   ```powershell
   Get-Content "C:\Program Files\Stratora\data\initial-admin-password.txt"
   ```

   Use your install folder if it isn't the default.
2. In a browser, open `https://<server name>`. Until you install a trusted certificate, the browser warns about the server's self-signed certificate.
3. Sign in as `admin` with that password. Stratora asks you to set a new password straight away. It refuses to keep the one-time password. Once you have set yours, the file is deleted.
4. The [Setup Wizard](/docs/getting-started#setup-wizard) opens.

The sign-in page reminds you where the file is. The password is never written to a log.

---

## Certificates

### The self-signed certificate

The installer creates a self-signed certificate, so HTTPS works from the first minute. Browsers warn about it, because no public authority signed it.

Stratora renews this certificate itself. It checks the certificate when the backend starts and once a day, and renews it when it has expired or expires within 30 days, keeping the server's names. It only ever renews a certificate it created: a certificate you uploaded or got from Let's Encrypt is never replaced.

### A trusted certificate

Set the server's name and get a trusted certificate in the Setup Wizard's **Server** step, or later on **Administration → SSL / TLS Certificates**:

- **Let's Encrypt with DNS-01**: Stratora creates the DNS record through your DNS provider's API, then renews the certificate automatically.
- **Let's Encrypt with HTTP-01**: needs port 80 on the server to be reachable from the internet.
- **Upload** a certificate from your own certificate authority.

Let's Encrypt requests for wildcard names (`*.example.com`) are refused: Stratora can't request wildcard certificates. An uploaded certificate is not checked for this. See [SSL / TLS Certificates](/docs/administration/ssl-tls-certificates) for the details.

### How collectors and agents trust the server

Collectors and agents always verify the server's certificate, and this cannot be turned off. They trust the server through its **server trust key** (`data\server-trust.key`), not through the certificate's issuer:

- Every enrollment token carries the trust key's pin. A token looks like `enroll_<secret>.sha256:<pin>`. Always copy the whole token, including the part after `.sha256:`.
- With the pin, a collector or agent accepts the server's certificate from its very first connection, even a self-signed one.
- When the certificate changes (a renewal, Let's Encrypt, an upload), collectors and agents on 2.5.3 pick up the new one by themselves. Nothing needs doing on their hosts.
- The pin is shown on **Administration → About** and when you create a token.

**Keep `data\server-trust.key` in your backups**, with the rest of the `data` folder. A server that loses it has to enroll every collector and agent again.

---

## After the install

- **Run the Setup Wizard.** See [Getting Started](/docs/getting-started#setup-wizard).
- **Deploy collectors and agents.** See [Remote Collector](./remote-collector.md), [Windows Agent](./windows-agent.md) and [Linux Agent](./linux-agent.md).
- **After each later upgrade**, the first administrator to open Stratora is taken to a page that checks the upgrade, and then sees a reminder to upgrade every collector and agent. See [Upgrading Stratora](/docs/administration/upgrading-stratora).

---

## Repair

A repair puts back the installed version's files, sets the install folder permissions again, and starts the server's services again.

- **Programs and Features** (Control Panel): select **Stratora Server**, then **Repair**.
- Or, from a Command Prompt with **Run as administrator**, with the MSI of the installed version:

  ```cmd
  msiexec /fa Stratora-Server-X.Y.Z.msi /l*v repair.log
  ```

A repair stops PostgreSQL, the backend and NGINX while it replaces files, then starts PostgreSQL, VictoriaMetrics, the backend and NGINX again, in that order. It writes `logs\repair-services.log`. A repair also re-checks the `data` folder's permissions, which can take a few minutes on a large install.

---

## Uninstall

Use **Apps & features** (select **Stratora Server**, then **Uninstall**), or from a Command Prompt with **Run as administrator**:

```cmd
msiexec /x Stratora-Server-X.Y.Z.msi /l*v uninstall.log
```

Use the MSI of the installed version, as for a repair.

- The uninstall removes the server's services and program files.
- It **keeps** the `data` folder (the database, the metric store and the server's keys) and the `acme-data` folder (certificate data) in the install folder. Delete them yourself if you want nothing left, and only once you are sure you don't need them.
- It also removes the **Stratora Remote Collector** that the Server installed for itself. That runs as a scheduled task right after the uninstall, and can take a few minutes. A Remote Collector or a Stratora Agent that you installed yourself stays. (One exception: if you installed a Remote Collector yourself on the server at an older version than the Server ships, the Server's install upgraded it, so it counts as the Server's collector and is removed too.)

---

## Logs

`<install folder>` is `C:\Program Files\Stratora` unless you chose another folder.

| What | Where |
|---|---|
| The installer | The file you named with `/l*v` |
| Install and upgrade steps | `<install folder>\logs\postinstall.log` |
| The server's own collector install | `<install folder>\logs\collector-install.log` |
| A repair's service restart | `<install folder>\logs\repair-services.log` |
| The backend, database and metric store | `<install folder>\logs` |
| The web server | `<install folder>\nginx\logs` |
| Installer events | Event Viewer → **Windows Logs → Application**, source **Stratora** |

To send logs to support, download a support bundle from [Diagnostics](/docs/administration/diagnostics).
