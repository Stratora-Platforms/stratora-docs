---
sidebar_label: Report Templates
sidebar_position: 2
title: Report Templates
---

# Report Templates

A **report template** defines the blueprint for a report — what type of report to generate, which sites to include, the time range to analyze, and which sections to show. You run a template to produce a PDF report.

---

## Viewing Templates

Navigate to **Reports** in the sidebar to see all available templates. The template list shows both **built-in** and **custom** templates.

Each template displays:

| Field | Description |
|-------|-------------|
| **Name** | Template display name |
| **Type** | Report type (e.g., Site Health) |
| **Source** | Built-in or Custom |
| **Scope** | All sites or specific site names |
| **Time Range** | Reporting period (7d, 30d, 90d, or 1y) |
| **Last Run** | When the template was last used to generate a report |

{/* ![Report templates list](./img/report-templates-list.png) */}

---

## Built-in Templates

Stratora includes three built-in Site Health templates designed for common reporting cadences:

### Site Health Summary

- **Time range:** 30 days
- **Scope:** All sites
- **Sections:** All sections included
- **Use case:** Monthly health review — the go-to template for a comprehensive overview of site reliability over the past month

### Weekly Site Health

- **Time range:** 7 days
- **Scope:** All sites
- **Sections:** Executive Summary, Uptime & Healthy Time, Incident Analysis
- **Use case:** Weekly digest — a concise report for regular operational check-ins

### Quarterly Site Health Review

- **Time range:** 90 days
- **Scope:** All sites
- **Sections:** All sections included
- **Use case:** Executive review — a broader view of trends and reliability for quarterly business reviews or client presentations

:::info
Built-in templates cannot be edited or deleted. If you need a variation, create a custom template with your preferred settings.
:::

---

## Creating a Custom Template

Navigate to **Reports** and click **New Template**.

### Template Settings

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Display name for the template (e.g., "Client ABC Monthly Report") |
| Description | No | Notes about the template's purpose or audience |
| Report Type | Yes | The type of report to generate (currently: Site Health) |
| Site Scope | Yes | **All sites** or select specific sites to include |
| Time Range | Yes | Reporting period — **7 days**, **30 days**, **90 days**, or **1 year** |

### Sections

Choose which sections to include in the generated report. Each section adds specific analysis to the PDF:

| Section | Description |
|---------|-------------|
| **Executive Summary** | High-level health score, uptime, healthy time, and incident count across all included sites |
| **Health Heatmap** | Color-coded timeline showing site status (healthy, degraded, critical, offline) over the reporting period |
| **Uptime & Healthy Time** | Per-site breakdown of operational uptime and fully-healthy time percentages |
| **Incident Analysis** | Incident counts, mean time to recover (MTTR), and flap-filtered event details |
| **Node Breakdown** | Per-node health metrics within each site — useful for identifying specific problem devices |
| **Trend Analysis** | Health score trends over time, highlighting improving or declining sites |
| **Cross-Site Comparison** | Ranked view of all included sites by reliability — useful for identifying your best and worst-performing locations |

:::tip
For executive audiences, start with **Executive Summary**, **Health Heatmap**, and **Cross-Site Comparison**. For operational teams, include all sections to get full node-level detail.
:::

{/* ![New template form](./img/report-template-create.png) */}

---

## Editing a Template

Click on any **custom** template to open its detail view, then click **Edit** to modify the settings.

You can change any field — name, description, scope, time range, and included sections. Changes apply to future report runs only; previously generated reports are not affected.

---

## Deleting a Template

To delete a custom template:

1. Open the template detail view
2. Click **Delete**
3. Confirm the deletion

:::warning
Deleting a template also removes its run history and any previously generated PDFs. Download any reports you need to keep before deleting.
:::

Built-in templates cannot be deleted.
