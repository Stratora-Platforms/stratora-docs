---
title: The Server install folder is a link or a mounted folder
sidebar_label: Install folder is a link
sidebar_position: 10
---

# The Server install folder is a link or a mounted folder

Stratora Server must be installed in a real folder on a local NTFS volume. It is not supported in a folder that is reached through a **junction**, a **directory symbolic link** or a **mounted volume folder** (a folder that a volume is mounted on), whether that is the install folder itself or a folder above it.

## Why this is not supported

The Server's database cannot start in such a folder. It stops with a "Permission denied" error on its lock file, so the Server does not work there:

- a fresh install into such a folder does not complete;
- a working server that is moved behind a link or onto a mounted volume afterwards stops working;
- upgrading such a server would leave it broken.

From Stratora 2.5.3, the Server installer checks the install folder before it changes anything, and stops if the folder, or a folder above it, is a link or a mounted volume folder.

## How to recognise it

The installer stops with an error, and nothing is installed, removed or stopped. On an upgrade, the installed version and its data are left exactly as they were.

The reason, with the steps for your layout, is written in two places:

- **The Windows Application event log**: source **Stratora**, Event ID **4245**, level Error. The message starts with `Stratora Server install folder check:`. To read the latest one in PowerShell:

  ```powershell
  Get-WinEvent -FilterHashtable @{ LogName = 'Application'; ProviderName = 'Stratora'; Id = 4245 } -MaxEvents 1 | Format-List TimeCreated, Message
  ```

- **The installer log**, if you ran the installer with a log (`msiexec /i Stratora-Server-X.Y.Z.msi /l*v install.log`): search it for `Stratora install folder check:`.

The message says which of the three layouts was found, and names the folder and where it leads:

| The message says | Layout | Steps |
|---|---|---|
| the install folder itself is a junction (or symbolic link) | The install folder is a link | [Layout 1](#layout-1-the-install-folder-is-a-link) |
| a folder above the install folder, ..., is a junction (or symbolic link) | A folder above it is a link | [Layout 2](#layout-2-a-folder-above-the-install-folder-is-a-link) |
| ... is a mounted volume folder | A volume is mounted on the install folder or a folder above it | [Layout 3](#layout-3-a-mounted-volume-folder) |

You can also see the layout yourself, in a Command Prompt:

- `dir /AL C:\` lists the links in `C:\`, with the folder each one leads to;
- `mountvol` (with no arguments) lists each volume and the folders it is mounted on.

## A new install: pick a real folder

If the installer stopped a **fresh install**, nothing was installed. Run the installer again and choose a real folder on the **Destination Folder** page: the default (`C:\Program Files\Stratora`), or a folder such as `C:\Stratora` that is not a link and is not on a mounted volume folder. For a quiet install, set the folder on the command line:

```
msiexec /i Stratora-Server-X.Y.Z.msi /qn INSTALLFOLDER="C:\Stratora"
```

If you want the Server on another drive, install it directly in a folder on that drive (for example `D:\StratoraData`) rather than linking to it.

## An existing server: move it into a real folder

If the installer stopped an **upgrade**, move the server's files into a real folder at the same path, then run the upgrade again. The steps below keep the path, so the installed version finds its files where it expects them.

Before you start:

- Plan a maintenance window: Stratora is stopped while its files move.
- Make sure the drive that holds the path has room for the server's files (the `data` folder can be large).
- Take a backup or a VM checkpoint of the server.
- Run every command below **as an administrator**. Run `rmdir`, `mountvol` and `robocopy` in an elevated **Command Prompt** (`cmd.exe`), not in PowerShell: in PowerShell, `rmdir` is a different command that can delete the contents of the folder a link leads to.

The examples use these paths. Use the paths from your installer message instead.

| | Example |
|---|---|
| The install folder | `C:\Stratora` (Layout 2: `C:\Stratora\Server`) |
| Where the link leads | `D:\StratoraData` |

### Step 1: Stop the Stratora services

In an elevated PowerShell:

```powershell
Get-Service -DisplayName 'Stratora*' | Stop-Service -Force
Get-Service -DisplayName 'Stratora*' | Format-Table Status, DisplayName
```

Every Stratora service should show **Stopped**.

### Step 2: Move the files into a real folder

Follow the layout the installer message names.

#### Layout 1: the install folder is a link

`C:\Stratora` is a junction or symbolic link to `D:\StratoraData`.

1. Remove the link only. Without `/s`, `rmdir` removes the link and leaves everything in `D:\StratoraData` in place:

   ```bat
   rmdir "C:\Stratora"
   ```

2. Move the server's files into a real `C:\Stratora` folder:

   ```bat
   robocopy "D:\StratoraData" "C:\Stratora" /E /COPYALL /MOVE
   ```

   robocopy creates `C:\Stratora` and keeps the files' permissions. An exit code below 8 means it worked; check it with `echo %ERRORLEVEL%`.

3. Check that `C:\Stratora` now holds the `bin`, `config` and `data` folders, and that `D:\StratoraData` is gone or empty.

#### Layout 2: a folder above the install folder is a link

The server is in `C:\Stratora\Server`, and `C:\Stratora` is a junction or symbolic link to `D:\StratoraData`.

The steps are the same as for Layout 1, but for the folder that is the link (`C:\Stratora`), not the install folder. This moves **everything** in `D:\StratoraData`, not only Stratora. If other programs keep files there, stop them first too.

1. Remove the link only:

   ```bat
   rmdir "C:\Stratora"
   ```

2. Move everything it led to into a real `C:\Stratora` folder:

   ```bat
   robocopy "D:\StratoraData" "C:\Stratora" /E /COPYALL /MOVE
   ```

   An exit code below 8 means it worked.

3. Check that `C:\Stratora\Server` holds the `bin`, `config` and `data` folders.

If the installer named more than one link (for example the install folder and a folder above it), fix the one nearest the install folder first, then run the upgrade again. The installer checks again and names any link that is left.

#### Layout 3: a mounted volume folder

A volume is mounted on `C:\Stratora` (or on a folder above the install folder). Use the folder the message names in place of `C:\Stratora`.

1. Note the volume's name:

   ```bat
   mountvol "C:\Stratora" /L
   ```

   It prints a name such as `\\?\Volume{...}\`. The installer message names it too.

2. Unmount the volume from the folder. The data stays on the volume, and `C:\Stratora` becomes an empty, real folder:

   ```bat
   mountvol "C:\Stratora" /D
   ```

3. Give the volume a drive letter, so you can reach its files. Use a free letter (`X:` here) and the volume name from step 1:

   ```bat
   mountvol X: \\?\Volume{...}\
   ```

   If the volume already has a drive letter, use that letter instead and skip this step.

4. Move the server's files from the volume into `C:\Stratora`:

   ```bat
   robocopy X:\ "C:\Stratora" /E /COPYALL /MOVE /XD "System Volume Information" "$RECYCLE.BIN"
   ```

   An exit code below 8 means it worked. If the volume holds other files than Stratora's, they move too.

5. Check that `C:\Stratora` holds the `bin`, `config` and `data` folders. You can then remove the drive letter again with `mountvol X: /D`.

### Step 3: Run the upgrade again

Run the new Server installer as you did before, for example:

```
msiexec /i Stratora-Server-X.Y.Z.msi /l*v upgrade.log
```

The installer checks the folder again. If it still stops, read the new Event ID 4245 message: it names the folder that is still a link or a mounted volume folder.

### Step 4: Check the server

1. In PowerShell, check that every Stratora service is running:

   ```powershell
   Get-Service -DisplayName 'Stratora*' | Format-Table Status, DisplayName
   ```

2. Open `https://your-server-hostname` and log in.
3. Check that the version in the footer or About view is the new one, and that your sites, devices and dashboards are there.

If a service does not start, see [Upgrading Stratora](./upgrading-stratora.md#if-something-looks-wrong).

## See also

- [Upgrading Stratora](./upgrading-stratora.md)
- [Getting Started](/docs/getting-started)
