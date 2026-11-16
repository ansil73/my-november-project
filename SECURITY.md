# Security and owner access

Production uses Cloudflare Access signed JWT verification (signature, issuer, audience, expiry and required claims) plus OWNER_EMAIL restriction. Internal identity headers are stripped before trusted identity is injected. Assets pass through Worker authentication. Missing configuration fails closed.

Local loopback development uses a synthetic identity; do not expose dev mode publicly. Watchlist writes validate origin, JSON and inputs, limit body size and rate, and scope database access by authenticated identity. Private responses are no-store; security headers are applied. CSP permits inline hydration and is not a claim of perfect XSS protection.

Use HTTPS, MFA, private GitHub, least privilege and backups. Do not commit secrets or log tokens. Rotate exposed credentials immediately. This is not end-to-end encrypted storage or a security certification. Production account configuration and access testing are required. See OWNER_MANUAL.md for setup and incident steps.
