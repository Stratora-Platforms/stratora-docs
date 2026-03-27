---
sidebar_label: Security Hardening
title: Security Hardening
sidebar_position: 11
---

# Security Hardening

Stratora ships with security defaults appropriate for internal network monitoring deployments. This page documents the hardening measures in place and configuration options for environments with stricter requirements.

---

## Authentication

### Rate Limiting

All authentication endpoints are rate-limited per client IP to prevent brute force and credential stuffing attacks:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/v1/auth/login` | 5 requests | 5 minutes |
| `POST /api/v1/auth/change-password` | 10 requests | 1 minute |
| `GET /api/v1/auth/oidc/authorize/:id` | 10 requests | 1 minute |
| `GET /api/v1/auth/oidc/callback` | 10 requests | 1 minute |
| `GET /api/v1/auth/sso` | 10 requests | 1 minute |

When a limit is exceeded, the server returns `429 Too Many Requests` with a `Retry-After` header indicating how long to wait.

### Session Cookies

Session cookies are set with the following attributes:

- **Secure** — cookie only sent over HTTPS
- **HttpOnly** — not accessible to JavaScript
- **SameSite=Strict** — not sent on cross-origin requests (CSRF protection)

:::note
In development environments using plain HTTP, the `Secure` flag means the session cookie won't be sent. The SPA uses Bearer token authentication from localStorage, so login and API calls still work. The cookie is a secondary authentication path used by the OIDC callback flow.
:::

### OIDC Token Delivery

After OIDC authentication, the session token is delivered to the frontend via a URL **fragment** (`#oidc_session=...`), not a query parameter. Fragments are never sent to the server, keeping the token out of server logs, proxy logs, and HTTP Referer headers.

---

## HTTP Security Headers

### NGINX Headers

NGINX sets the following headers on all responses:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data: blob:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;` |

`server_tokens` is set to `off` to suppress the NGINX version in the `Server` response header.

### Go Backend Headers (Defense-in-Depth)

The Go backend also sets security headers on all `/api/v1/` responses, providing protection even if the backend is accessed directly (bypassing NGINX):

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store, private` (with `Pragma: no-cache`)

The `Cache-Control: no-store` header is applied to all API responses **except** the collector config endpoint (`/remote-collectors/:id/config`), which uses ETag-based conditional requests for bandwidth efficiency.

---

## API Key Management

### Key Rotation

Component API keys can be rotated from the **Settings > Components** page. The rotation endpoint (`POST /api/v1/remote-components/:id/rotate`) generates a new key, invalidates the old one, and returns the new key in a one-time reveal modal.

The component will need to be reconfigured with the new key after rotation. For agents, this means updating `/etc/stratora/agent.json` (Linux) or the registry key (Windows) and restarting the service.

### Key Security

- Keys are hashed with bcrypt (cost 12) for storage
- A SHA-256 indexed hash enables O(1) lookup performance
- Only a prefix (`sk_stra_xxxx...`) is displayed in the UI — the full key is shown only once at creation or rotation
- Revoked components cannot authenticate; revocation is immediate

---

## Network Architecture

### Port Exposure

| Port | Binding | Purpose |
|------|---------|---------|
| 443 (HTTPS) | All interfaces | NGINX reverse proxy — serves frontend and proxies API |
| 80 (HTTP) | All interfaces | Redirects to HTTPS; ACME challenge support |
| 8080 | `0.0.0.0` (configurable) | Go backend API — should not be exposed to external networks |
| 8428 | `127.0.0.1` | VictoriaMetrics — loopback only |
| 5432 | `127.0.0.1` | PostgreSQL — loopback only |

:::warning
Port 8080 (the Go backend) binds to all interfaces by default. In production, ensure your firewall blocks external access to port 8080. All client traffic should go through NGINX on port 443.
:::

To restrict the backend to loopback only, set in `config.yaml`:

```yaml
server:
  host: "127.0.0.1"
  port: 8080
```
