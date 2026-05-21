---
sidebar_label: SSL / TLS Certificates
title: SSL / TLS Certificates
---

# SSL / TLS Certificates

![SSL / TLS Certificates page — Current Certificate card showing domain, issuer, expiration with days-remaining badge, valid-from date, SHA-256 fingerprint, and certificate chain status](/img/administration/ssl-tls-certificates-page.png)

Stratora serves all traffic over HTTPS. On a fresh install, a self-signed certificate is generated automatically — **zero configuration required**. From there, you can upgrade to a trusted certificate via Let's Encrypt automation or manual upload.

---

## Default Self-Signed Certificate

During installation, Stratora generates a self-signed certificate so HTTPS works immediately:

- **Algorithm**: ECDSA P-256
- **Subject**: `Stratora Self-Signed`
- **SANs**: `localhost`, the server hostname, and any configured external URL
- **TLS versions**: TLS 1.2 and TLS 1.3

The self-signed certificate is suitable for initial setup and internal use. Browsers will show a certificate warning because it isn't signed by a trusted certificate authority.

---

## Let's Encrypt (Automated Certificates)

Stratora includes a bundled ACME client ([win-acme](https://www.win-acme.com/)) for automated certificate issuance and renewal from Let's Encrypt.

Navigate to **Administration → SSL / TLS Certificates** to configure.

![Let's Encrypt section — client-ready status, domain and email fields, HTTP-01 / DNS-01 challenge selector, Request Certificate button, and the Auto-Renewal toggle showing the next scheduled check and managed certificates list](/img/administration/ssl-tls-letsencrypt-section.png)

### HTTP-01 Challenge

The simplest method — Let's Encrypt verifies domain ownership by placing a file on your web server.

**Requirements:**
- Port 80 must be reachable from the internet
- The domain's DNS must point to your Stratora server

**To issue a certificate:**
1. Enter your domain name and email address
2. Click **Issue Certificate**
3. Stratora handles the challenge automatically — the certificate is deployed within seconds

### DNS-01 Challenge

For servers that aren't publicly accessible on port 80, or for wildcard certificates. Let's Encrypt verifies domain ownership via a DNS TXT record.

#### Manual DNS-01

A two-step process for any DNS provider:

1. Click **Start Challenge** — Stratora generates the required TXT record details
2. Create the `_acme-challenge` TXT record at your DNS provider
3. Click **Complete Challenge** — Stratora verifies the record and issues the certificate

:::info
Manual DNS-01 certificates must be renewed manually since the DNS record step requires human intervention. For automated renewal, use a supported DNS provider below.
:::

#### Automated DNS-01

For fully automated issuance and renewal, configure one of the supported DNS providers. Stratora creates and removes DNS records automatically via the provider's API.

**Supported DNS providers:**

| Provider | Credentials Required |
|----------|---------------------|
| **Cloudflare** | API Token (with Zone:DNS:Edit permission) |
| **AWS Route 53** | Access Key ID, Secret Access Key, and optionally a Hosted Zone ID |
| **GoDaddy** | API Key and API Secret |
| **Namecheap** | API User, API Key, and Client IP (must be whitelisted in Namecheap dashboard) |

**To set up automated DNS-01:**

1. Navigate to the **DNS Providers** section
2. Click **Add Provider** and select your DNS service
3. Enter the domain and API credentials
4. Use **Test Connection** to verify — Stratora creates a temporary TXT record, confirms it resolves, and removes it
5. Activate the provider
6. Click **Issue Certificate**

DNS provider credentials are encrypted at rest with AES-256-GCM.

![DNS Provider section — configured provider card showing name, type chip, and active status, with an Add Provider button to add additional providers](/img/administration/ssl-tls-dns-provider.png)

---

## Automatic Renewal

Stratora configures a Windows Scheduled Task to check for certificate expiry and renew automatically.

| Detail | Value |
|--------|-------|
| Task name | `Stratora Certificate Renewal` |
| Schedule | Daily between 3:00 AM and 7:00 AM (3:00 AM start with up to a 4-hour random delay to spread load on Let's Encrypt) |
| Renewal threshold | 30 days before expiration |

When the task runs, it checks if the current certificate expires within 30 days. If so, it re-issues the certificate using the same method that was used originally (HTTP-01 or automated DNS-01).

You can enable or disable automatic renewal from the SSL / TLS settings page.

### Renewal History

Stratora records every renewal attempt — both scheduled and operator-initiated — and surfaces the most recent attempts inline on the SSL / TLS settings page. Each entry shows when the attempt happened, the outcome (success, failure, or skipped), and the error category if the renewal failed. The history is useful both as a daily confirmation that renewals are working and as a diagnostic surface when they aren't.

![Renewal History card — five most-recent renewal attempts inline, each showing event type, target, timestamp with relative time, and outcome badge (success, failure, or skipped); failure entries show the error category and message](/img/administration/ssl-tls-renewal-history.png)

The **View all** link opens the audit log filtered to renewal events, showing the full history beyond the most-recent five.

![Audit log filtered to ACME Renewal events — full renewal history table showing time, user, action, resource, and details columns; renewal-history entries include the underlying win-acme history date and outcome; migration entries show the configuration migration result](/img/administration/ssl-tls-renewal-history-full.png)

---

## Manual Certificate Upload

If you manage certificates externally (purchased from a CA, issued by an internal PKI, etc.), you can upload them directly.

Navigate to **Administration → SSL / TLS Certificates** and click **Upload Certificate**.

![Upload Certificate form — PEM / PKCS12 format selector, Choose File inputs for certificate, private key, and optional chain file, with Validate Certificate and Upload & Apply action buttons](/img/administration/ssl-tls-upload-certificate.png)

### PEM Format

Upload separate files:

| File | Description |
|------|-------------|
| Certificate (`.crt`, `.pem`) | Your server certificate |
| Private Key (`.key`, `.pem`) | The corresponding private key |
| Chain (optional) | Intermediate CA certificates |

Supported key types: RSA (PKCS#1), ECDSA, and PKCS#8.

### PKCS12 / PFX Format

Upload a single `.pfx` or `.p12` file containing the certificate and private key. Enter the passphrase if the file is password-protected.

### Validation

Before applying a certificate, Stratora validates:

- **Key match** — the certificate and private key correspond to each other
- **Expiration** — the certificate is not expired or not-yet-valid
- **Chain verification** — if a chain is provided, the full trust chain is verified
- **Expiry warning** — alerts you if the certificate expires within 30 days

If validation fails, the upload is rejected and the current certificate remains in place. If the web server configuration test fails after deployment, Stratora automatically **rolls back** to the previous certificate.

---

## Certificate Status

The SSL / TLS settings page displays the current certificate details:

| Field | Description |
|-------|-------------|
| Subject | Certificate common name |
| Issuer | Who issued the certificate |
| Valid From / To | Certificate validity period |
| Days Until Expiry | Countdown with color-coded indicator (green > 30 days, yellow 8–30 days, red ≤ 7 days) |
| SANs | Subject Alternative Names (domains and IPs covered) |
| Self-Signed | Whether the certificate is self-signed |
| Chain | Whether intermediate certificates are present |
| SHA-256 Fingerprint | Certificate fingerprint for verification |

---

## Security Headers

Stratora's web server is configured with security headers enabled by default:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data: blob:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;` |
