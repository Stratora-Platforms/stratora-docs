---
title: Site Photos
sidebar_label: Site Photos
---

# Site Photos

Each site can store photos for documentation purposes — rack photos, floorplans, equipment documentation, or any visual reference material for a location.

## Configuring Photo Storage

Before uploading photos, configure the storage path in **Administration > Settings > Site Photos**:

- **Photo Storage Path** — A local path or UNC path where photos will be stored on the Stratora server. Examples: `C:\SitePhotos` or `\\NAS01\SitePhotos`
- **Max Photo Size (MB)** — Maximum file size per upload (default: 10 MB)

Photos are stored in subfolders named `{site-name}_{site-id}/` within the configured root path.

## Uploading Photos

Navigate to a site and click the **Photos** tab.

- Drag and drop images onto the upload zone, or click to browse
- Supported formats: JPEG, PNG, WEBP
- File type is validated by content, not extension

## Managing Photos

| Action | How |
|--------|-----|
| View full image | Click any thumbnail |
| Edit caption | Hover over thumbnail, click pencil icon |
| Reorder | Drag thumbnails to reorder |
| Delete | Hover over thumbnail, click trash icon, confirm |

## Notes

- Photos are served through authenticated endpoints — direct file share access is not required for viewing
- Thumbnails are generated automatically at 400px width on upload
- Photos are stored per-site; they are deleted automatically if a site is deleted
