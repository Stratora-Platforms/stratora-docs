---
sidebar_label: Building Installers
title: Building Installers
---

# Building Agent & Collector Installers

This guide covers building the agent and collector installer packages from source. This is relevant for self-hosted deployments and development.

---

## Prerequisites

| Dependency | Required For | Version |
|------------|--------------|---------|
| Go | All builds | 1.24+ |
| WiX Toolset | Windows MSI builds | 3.x (3.11 or 3.14 recommended) |
| Telegraf binary | Windows MSI bundles | Latest stable from [influxdata.com](https://www.influxdata.com/time-series-platform/telegraf/) |
| nfpm | Linux `.deb` and `.rpm` packages | Latest (`go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest`) |
| dpkg-deb | Linux `.deb` fallback (if nfpm unavailable) | System package |

---

## Windows Agent MSI

The build script is at `agent/installer/build.ps1`.

### Build

```powershell
cd agent\installer
.\build.ps1 -Version "2.1.0"
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `-Version` | `2.1.0` | Version string embedded in the binary and MSI filename |
| `-TelegrafPath` | — | Path to a `telegraf.exe` binary. If omitted, uses `bin\telegraf.exe` if present |
| `-SkipGoBuild` | — | Skip Go compilation (use existing binaries in `bin\`) |
| `-Clean` | — | Remove previous build artifacts before building |

### What It Builds

1. `stratora-agent.exe` — the agent service binary (with PE version resources)
2. `stratora-tray.exe` — system tray status indicator
3. Installer assets (icon, dialog/banner bitmaps from repo logo)
4. WiX compilation and linking → final MSI

### Output

```
agent/installer/output/StratoraAgent-{version}.msi
```

### Telegraf Dependency

The agent MSI bundles a Telegraf binary. The build script does **not** download Telegraf automatically. You must either:
- Place `telegraf.exe` in `agent/installer/bin/` before building
- Pass `-TelegrafPath C:\path\to\telegraf.exe`

Without a real Telegraf binary, the script creates a placeholder — the MSI will build but won't function.

---

## Linux Agent Packages

The build script is at `agent-linux/build.sh`.

### Build

```bash
cd agent-linux
./build.sh 1.2.0
```

The version argument defaults to `1.2.0` if omitted.

### What It Builds

1. **Static binary** — `CGO_ENABLED=0 GOOS=linux GOARCH=amd64` for universal Linux compatibility
2. **`.deb` package** — Debian/Ubuntu (via nfpm or dpkg-deb fallback)
3. **`.rpm` package** — RHEL/Rocky/Alma (nfpm required — no fallback)

### Output

```
agent-linux/build/stratora-agent                           # Static binary
agent-linux/build/stratora-agent_{version}_amd64.deb       # Debian package
agent-linux/build/stratora-agent-{version}-1.x86_64.rpm   # RPM package
```

### Without nfpm

If nfpm is not installed, the script falls back to `dpkg-deb` for the `.deb` package. The `.rpm` package requires nfpm — install it with:

```bash
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
```

---

## Windows Collector MSI

The build script is at `collector/installer/build.ps1`.

### Build

```powershell
cd collector\installer
.\build.ps1 -Version "2.1.0"
```

**Parameters:** Same as the agent build script (`-Version`, `-TelegrafPath`, `-SkipGoBuild`, `-Clean`).

### What It Builds

The collector MSI bundles **three** binaries:
1. `collector.exe` — the collector service (built from `cmd/collector/`)
2. `stratora-agent.exe` — the agent service (built from the `agent/` module)
3. `stratora-tray.exe` — system tray indicator

This means the collector MSI also includes an agent — the collector host monitors itself via the bundled agent.

### Output

```
collector/installer/output/StratoraCollector-{version}.msi
```

### Telegraf Dependency

Same as the agent — Telegraf is not downloaded automatically. The script checks `bin\telegraf.exe`, then falls back to `agent\installer\bin\telegraf.exe`.

---

## Placing Binaries for Download Endpoints

The Stratora backend serves installer downloads via unauthenticated API endpoints. For these endpoints to work, built packages must be copied to the correct directories on the Stratora server.

### Directory Layout

```
{installDir}/
└── downloads/
    ├── StratoraAgent-2.1.0.msi          # Agent Windows MSI
    ├── stratora-agent_1.2.0_amd64.deb   # Agent Linux DEB
    ├── stratora-agent-1.2.0-1.x86_64.rpm # Agent Linux RPM
    └── collector/
        └── StratoraCollector-2.1.0.msi  # Collector Windows MSI
```

Where `{installDir}` is determined by:
1. The `STRATORA_INSTALL_DIR` environment variable, or
2. The parent of the directory containing the backend binary (e.g., if the binary is at `C:\Stratora\bin\stratora-backend.exe`, then `installDir` is `C:\Stratora`)

### Download Endpoints

| Endpoint | Serves | Directory |
|----------|--------|-----------|
| `GET /api/v1/downloads/agent/windows` | Latest `.msi` | `{installDir}/downloads/` |
| `GET /api/v1/downloads/agent/linux-deb` | Latest `.deb` | `{installDir}/downloads/` |
| `GET /api/v1/downloads/agent/linux-rpm` | Latest `.rpm` | `{installDir}/downloads/` |
| `GET /api/v1/downloads/collector/windows` | Latest `.msi` | `{installDir}/downloads/collector/` |

### How File Selection Works

Each endpoint scans its directory for files matching the expected extension (`.msi`, `.deb`, or `.rpm`). If multiple files match, the **most recently modified** file is served. This means:

- To update, copy the new package into the directory — it will be served immediately
- Old versions can be removed to save disk space
- Only keep one file per extension in each directory to avoid ambiguity

:::warning
The collector MSI must be in the `downloads/collector/` **subdirectory**, not in `downloads/` directly. This prevents the agent Windows endpoint from accidentally serving the collector MSI (both are `.msi` files).
:::

### After Building — Copy Checklist

```powershell
# From the Stratora source directory, copy built packages to the server:
$InstallDir = "C:\Stratora"  # Adjust to your install path

# Agent packages
Copy-Item agent\installer\output\StratoraAgent-2.1.0.msi "$InstallDir\downloads\"
Copy-Item agent-linux\build\stratora-agent_1.2.0_amd64.deb "$InstallDir\downloads\"
Copy-Item agent-linux\build\stratora-agent-1.2.0-1.x86_64.rpm "$InstallDir\downloads\"

# Collector package (note: subdirectory)
New-Item -ItemType Directory -Force "$InstallDir\downloads\collector" | Out-Null
Copy-Item collector\installer\output\StratoraCollector-2.1.0.msi "$InstallDir\downloads\collector\"
```

---

## Version Bumping

When cutting a new release, update the version in these locations:

| Component | Version Location |
|-----------|-----------------|
| Windows Agent | `agent/installer/build.ps1` `-Version` default (line 4) |
| Windows Agent | `agent/cmd/stratora-agent/versioninfo.json` |
| Windows Agent | `agent/cmd/stratora-tray/versioninfo.json` |
| Linux Agent | `agent-linux/build.sh` `VERSION` default (line 12) |
| Linux Agent | `agent-linux/packaging/nfpm.yaml` `version` field |
| Linux Agent | `agent-linux/packaging/nfpm-rpm.yaml` `version` field |
| Windows Collector | `collector/installer/build.ps1` `-Version` default (line 6) |
| Windows Collector | `cmd/collector/versioninfo.json` |

All build scripts accept a `-Version` / version argument that overrides the default, so you can also pass the version at build time without editing files.
