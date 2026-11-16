# MarketScope India — self-hosted export

Start with [OWNER_MANUAL.md](OWNER_MANUAL.md) for Windows, GitHub Desktop, Cloudflare Workers, D1, Access, backups and recovery.

This is a separate export of the private ChatGPT Sites project. It has not been deployed to your Cloudflare account. GitHub pushes do not update the original Site.

## Status

Market data, scores and scenarios are synthetic. No live feed, scheduled reporting, calibrated predictions or brokerage integration is implemented. Watchlists persist in D1. The options tool is a manual long-call expiry payoff calculator.

## Local setup

Use Node 24. Run `npm ci`, `npm run db:local`, then `npm run dev`. Run `npm run check` before deploying.

## Production

Create your D1 database; replace the placeholder ID in root `wrangler.json`. Apply migrations. Configure Cloudflare Access, `TEAM_DOMAIN`, `POLICY_AUD` and the Worker secret `OWNER_EMAIL`. Build and deploy using the package scripts. Missing production auth configuration fails closed. Read the manual for the bootstrap sequence and verification steps.

Never commit credentials or database backups. Never edit generated dist files. The current dependency stack includes beta Vinext; test upgrades carefully.

## Owner documentation

- [Read the owner manual](OWNER_MANUAL.md)
- [Download the PDF manual](docs/MarketScope-Owner-Manual.pdf)

This source is stored in `ansil73/my-november-project`. The manual's repository-creation steps are already complete; continue with local testing and Cloudflare setup. This repository does not automatically deploy to the existing ChatGPT Sites URL.
