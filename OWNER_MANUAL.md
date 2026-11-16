# MarketScope India
## Website control and maintenance manual
Prepared for Ansil P M | 15 November 2026 | Edition 1

This manual covers the current private website and the separate GitHub-ready source package. It is written for Windows 11, VS Code and GitHub Desktop. Commands are run in the VS Code terminal from the project folder unless stated otherwise. Read each command before running it; placeholders must be replaced with your own values.

**Current site:** https://marketscope-india-ansil.funfig256.chatgpt.site

**Most important:** the current market figures, scores, charts and price scenarios are demonstration data. The site is not receiving live prices or publishing daily investment recommendations. Refreshing the browser does not refresh market data. Neither a prediction of profit nor complete protection against every security threat is possible.

## 1. Understand what you own

Your current website runs on ChatGPT Sites and is private to its owner. The accompanying source ZIP is a separate export prepared for Cloudflare Workers, D1 and Cloudflare Access. Uploading that export to GitHub will not change the existing ChatGPT Sites deployment.

There is no separate administration panel or content management system. Watchlists and the calculator are controlled through the website. Layout, text, data logic and security settings are controlled through source code and hosting settings.

- **Working now:** dashboard, sample stock screener, horizon filters, stock detail dialogs, private persistent watchlists, manual long-call payoff calculator, IPO diligence framework and sample briefing/download.
- **Demonstration only:** stock prices, index values, scores, chart series, bullish/bearish labels and target scenarios.
- **Not implemented:** licensed market feeds, live option chains, actual IPO database, automated daily reports, scheduled ingestion, report archive, validated forecasting/backtests and broker order execution.
- **Export not yet deployed:** no external GitHub repository or Cloudflare account has been set up for you by this package.

The source uses React, Vinext, Vite, TypeScript, Cloudflare Workers and D1. Vinext is a beta dependency in this export: treat upgrades as changes requiring testing. Keep the supplied lockfile so installations use the recorded dependency versions.

## 2. Control your current private website

Open the current site URL while signed into the owning ChatGPT account. Keep the URL bookmarked. If you cannot access it, first confirm the account; do not change the export's Cloudflare settings to fix a ChatGPT Sites sign-in problem.

Use the navigation to open the dashboard, screener, swing research, options calculator, IPO framework and watchlist. Search or filter the sample stocks, select a stock to inspect its detail dialog, and save or remove it from your watchlist. Reload after a save to confirm persistence. A saved stock is a research bookmark, not a purchased position.

The long-call calculator accepts strike price, premium per unit, quantity in underlying units and assumed expiry price. Enter the total number of units, not just the number of lots. Its result is an expiry payoff illustration; it does not include brokerage, taxes, bid/ask spread, slippage or early-exit option pricing. It does not predict the expiry price.

For a change to the hosted Site, return to the conversation/project that created it and describe the exact change. For example: “Change the dashboard title to MarketScope Research, preserve the demo labels, verify mobile layout and republish this Site.” Confirm the result at the current URL after publication. Changes to the separate GitHub export require the deployment procedure later in this manual.

Do not remove demonstration labels while sample values remain. Do not use the sample prices, scores or targets to place trades.

## 3. Accounts and responsibilities

For the self-hosted export you need a GitHub account, a Cloudflare account and a sign-in identity allowed by Cloudflare Access. A custom domain is optional. Start with the supplied workers.dev address; add a domain only after login and data persistence work.

- **GitHub:** source history, branches, reviews and a recoverable copy of committed code.
- **Cloudflare Workers:** executes the website and API.
- **Cloudflare D1:** stores watchlists and request-limit records.
- **Cloudflare Access:** checks who may open the website.
- **Your computer:** edits, tests, builds and manually deploys the source.
- **Future market provider:** supplies licensed data under its own commercial and technical terms.

Enable multifactor authentication on GitHub, Cloudflare and your identity provider. Save recovery codes in a password manager. Keep a private owner record containing the repository URL, Worker name, D1 name/ID, Access application name, domain, billing contact and last successful backup date. Store passwords and API keys in the password manager, not in that record or GitHub.

GitHub Pages only serves static sites. This application needs a server and database, so use Workers for this export. [Reference: GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## 4. Put the source into GitHub

Install Node.js 24, GitHub Desktop and VS Code from their official sites. Extract the supplied ZIP. The project folder inside it is named marketscope-india; its root contains package.json.

1. Open GitHub Desktop and sign into your own GitHub account.
2. Choose File > New repository. Name it marketscope-india. Choose a local parent folder such as Documents/GitHub. Create the repository.
3. Copy the contents of the extracted marketscope-india folder into the newly created repository folder. Copy hidden files such as .gitignore and .node-version too. Do not create another marketscope-india folder inside the repository.
4. In GitHub Desktop, inspect the Changes list. You should see app, worker, db, drizzle, package.json, package-lock.json and wrangler.json. You should not see node_modules, dist, passwords or backup databases.
5. Enter a summary such as “Initial MarketScope source” and commit the files.
6. Click Publish repository and keep the repository private. Confirm that the destination is your account.
7. Open the repository on GitHub. Confirm package.json is at the top level and the source folders are present.

If GitHub Desktop reports the folder already exists, choose a different empty local path or use File > Add local repository for a folder already initialized with Git. Do not delete an existing repository to resolve this message.

Do not upload node_modules, dist, .wrangler, .env files, .dev.vars files, database exports or private keys. The supplied .gitignore excludes common generated and secret files. It cannot protect a secret pasted into an ordinary source file.

[Reference: GitHub Desktop first repository](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop).

## 5. Run and verify the website locally

In GitHub Desktop choose Repository > Open in Visual Studio Code, or open the repository folder directly in VS Code. Choose Terminal > New Terminal. Check that the terminal is in the folder containing package.json.

```powershell
node --version
npm --version
npm ci
npm run db:local
npm run dev
```

Node should report version 24 or a compatible newer supported version; use 24 for this package. npm ci installs exactly the lockfile dependencies. db:local creates/applies the local database schema. The development server prints its local address, normally http://127.0.0.1:5173. Open that address. Stop the server with Ctrl+C when finished.

Local development uses a synthetic developer identity on loopback. It is intentionally different from production authentication. Never expose the development server on your network or use it as a public production server.

Before deploying, run:

```powershell
npm run check
```

This runs TypeScript checking, unit/authentication tests, a production build and local API integration tests. A successful command exits without errors. The API tests use isolated local test state; they do not prove your real Cloudflare Access application is configured correctly.

Also inspect the UI: desktop and mobile width, navigation, search, filters, dialogs, long-call inputs, saving/removing a watchlist symbol and persistence after reload. These manual checks catch usability issues that automated tests may miss.

## 6. Create the Cloudflare database and first deployment

This creates a second website under your Cloudflare account. Your current hosted Site remains separate. Watchlist records and account identifiers are not automatically transferred between them.

Sign into Cloudflare and complete any required account setup. In the project terminal run:

```powershell
npx wrangler login
npx wrangler whoami
npx wrangler d1 create marketscope-db --config wrangler.json
```

Confirm whoami identifies the intended account. The create command prints a database ID. Open the root wrangler.json and replace the placeholder database_id with the actual ID. Preserve binding DB, database_name marketscope-db and migrations_dir drizzle. If the command offers to edit configuration automatically, inspect the result and avoid adding a duplicate database binding.

Do not copy the placeholder ID into production. Do not edit dist/server/wrangler.json: it is generated by the build and will be overwritten.

For this newly created, empty database, apply the migration and deploy:

```powershell
npm run db:remote
npm run build
npm run deploy
```

Review the migration confirmation to ensure the correct remote database is selected. Record the workers.dev URL printed by deployment. At this stage Access configuration is deliberately empty, so the application should return 503 rather than expose the dashboard. This is expected during initial setup. The deployment preflight rejects the placeholder database and stale generated settings.

Your live application will use the generated Worker build, not the source folder as static assets. Do not upload dist/client to GitHub Pages as a substitute for this deployment.

[References: D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/) and [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

## 7. Configure private sign-in

In Cloudflare, open the deployed Worker and its Access controls. Use the option to protect the Worker with Access and select All traffic where offered. In Zero Trust, configure the associated Access application with an Allow policy for your exact email address. Do not select Everyone or add a bypass policy. Configure an available identity provider or email one-time PIN method.

Record the Access team domain and the application's audience (AUD) value. Set these in the root wrangler.json vars object:

```json
"vars": {
  "TEAM_DOMAIN": "https://YOURTEAM.cloudflareaccess.com",
  "POLICY_AUD": "YOUR_ACCESS_APPLICATION_AUDIENCE"
}
```

Replace both examples with actual values. TEAM_DOMAIN is the Access team domain, not the website's workers.dev URL. POLICY_AUD is the audience for this application's JWTs, not an account ID or API token.

Set the owner restriction as a Worker secret. The command prompts for your allowed email; type it at the prompt rather than including it in a command saved to history:

```powershell
npx wrangler secret put OWNER_EMAIL --config wrangler.json
npm run build
npm run deploy
```

Open the website in a private browser window. You should be asked to sign in and your exact allowed account should work. Save a stock, reload and confirm it remains; remove it and reload again. An unauthorized account must fail. Anonymous requests to the API must not return watchlists. Log out through the configured Access sign-out flow and test access again.

The application also verifies Access token signature, issuer, audience, expiry and owner email inside the Worker. Changing the front-end visibility alone cannot grant access. Keep run_worker_first enabled so static assets do not bypass Worker authentication.

If you later add a custom domain, confirm Access covers that hostname and test both the custom domain and workers.dev address. Keep deployment preview URLs disabled unless you deliberately secure and test them too.

[References: Protect Workers with Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/), [JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/) and [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

## 8. Make changes safely

Start every change by fetching and pulling the latest main branch in GitHub Desktop. Create a descriptive branch such as improve-mobile-table. Make one coherent change, run the checks and inspect the difference before committing.

Where to edit:

- app/page.tsx: page layout, labels, sections and UI behavior.
- app/globals.css: colors, spacing, typography and responsive styles.
- lib/market.ts: demonstration dataset and payoff calculation; editing this is not live data ingestion.
- app/api/watchlist/route.ts: watchlist API, validation and write limits.
- db/schema.ts and drizzle/: database schema and migration history.
- worker/index.ts and lib/access.ts: request security and authentication; change only with careful review and tests.
- wrangler.json: Worker name, database binding and Access configuration.
- public/favicon.svg: browser icon.
- package.json and package-lock.json: scripts and dependency versions.

After editing, run npm run check and manually inspect the affected screens. Commit with a clear summary, publish/push the branch and open a pull request against main. Review the changed files even when working alone. Merge only after checks pass, then switch back to main and pull the merged version.

For a code-only release, deploy that tested main version:

```powershell
npm ci
npm run check
npm run deploy
```

For a schema change, follow section 10 before deployment. Confirm the live URL after every release and record the commit ID and deployment version. A successful build is not confirmation that login or remote database bindings work.

By default this package uses manual deployment. Pushing to GitHub does not deploy it. Optional Cloudflare Builds can later connect main to production; use npm run check as the build command and npm run deploy as the deployment command, verify the Worker name matches and configure the build environment. Database migration ordering still needs an explicit release plan. Do not enable two competing deployment mechanisms.

[Reference: Cloudflare Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## 9. Daily, weekly and monthly maintenance

**Daily, or whenever you use the private demo:** open the site, verify sign-in, check a watchlist save/reload, and inspect recent Worker errors if something looks wrong. Demo market values are expected to remain unchanged. Once a real feed exists, also check source timestamps, last completed ingestion and stale-data warnings before using reports.

**Weekly:** review Worker errors and request failures, account usage and billing, GitHub notifications and dependency/security alerts. Confirm the site remains private. Push reviewed local changes so your working copy is not the only copy. Export the database if the watchlist matters to you, and always before risky changes.

**Monthly:** review account access, domain renewal and recovery methods; review costs; test a database restore in a separate environment; check mobile layout and keyboard navigation. Review dependency updates on a branch. Run npm audit explicitly, since automatic installation audits are disabled in this package. Investigate relevant issues; do not run npm audit fix --force blindly.

**For every release:** back up data if schema or write behavior changes, run checks, inspect the UI, deploy, test login and persistence, record the release and retain a recovery path. Keep production changes small enough to diagnose.

Set spending alerts or limits supported by each provider. Review Workers, D1, Access, domain and future market-data/API costs separately. Free tiers and plan limits can change; do not assume the whole system will remain free.

## 10. Backups and database changes

There are three different backups: committed source in GitHub, database exports, and secure account/secret recovery information. None replaces the others. GitHub does not contain your live D1 watchlist rows.

To export the production database from PowerShell:

```powershell
New-Item -ItemType Directory -Force backups
npx wrangler d1 export DB --remote --config wrangler.json --output backups/marketscope-2026-11-15.sql
```

Use the actual backup date and a new filename each time. Check that the command succeeds and the file is nonempty. Store a second encrypted copy outside the laptop. Do not commit the SQL file: it may contain user identifiers and private watchlists. Retain several recent backups according to your recovery needs, and delete old copies securely.

For a schema change, edit db/schema.ts, then run:

```powershell
npm run db:generate
npm run db:local
npm run check
```

Read the generated SQL before applying it. Do not rewrite a migration that has already run in production. Commit the schema and new migration together. Export production data, plan backward compatibility, then apply npm run db:remote and deploy the compatible code in the reviewed order. Dropping columns or tables requires a separate data-preservation plan.

A restore drill must use a new, empty D1 database and separate test Worker configuration. Import a chosen export into that test database with Wrangler d1 execute, verify row counts and application behavior, and only then document a production recovery plan. Never import an old export directly into production as an experiment; existing tables and migration records can conflict or data may be lost.

[Reference: D1 migration behavior](https://developers.cloudflare.com/d1/reference/migrations/).

## 11. Recover from a failed release

If a new deployment breaks the site, preserve the error message, timestamp and deployment version. In the Cloudflare Worker's deployment history, select the previous known-good version and use rollback where available. Alternatively, Wrangler supports rollback. Confirm the target Worker and version before accepting.

```powershell
npx wrangler rollback --config wrangler.json
```

Recheck login, page rendering and watchlists. A Worker rollback does not rewind D1 rows or schema. If a migration changed compatibility, a code rollback may be insufficient; use your database recovery plan or a reviewed forward fix.

Then revert the faulty change in GitHub on a new branch, review it and merge. Otherwise a later deployment from main can reintroduce the same fault. Keep a short incident note: what happened, when it started, the fix, any lost data and how to detect it earlier.

If an API key or token is exposed, revoke or rotate it immediately in the provider dashboard, update the Worker secret and inspect usage. Removing it in a later Git commit does not invalidate the leaked credential or erase old history. Remove sensitive logs and repository history using the provider's documented procedure after revocation. Do not paste credentials into support conversations.

[Reference: Worker rollback limits](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

## 12. Troubleshooting checklist

- **npm reports ENOENT/package.json missing:** terminal is in the wrong folder. Open the project root, not its parent or dist folder.
- **Node version or install errors:** use Node 24, restart the terminal, check node --version and run npm ci again. Preserve package-lock.json.
- **Port 5173 busy:** stop an earlier dev server with Ctrl+C or use the address printed by the new server. Never expose dev mode publicly.
- **Local no such table:** stop dev, run npm run db:local, restart. For production, verify the DB binding and migration status before applying remote migrations.
- **Placeholder database error:** replace database_id in root wrangler.json, then build again.
- **Stale deployment config:** root configuration changed after the last build. Run npm run build, then deploy.
- **503 after initial deployment:** complete TEAM_DOMAIN, POLICY_AUD and OWNER_EMAIL configuration. Rebuild/redeploy after changing root vars.
- **401 or repeated sign-in:** check Access protects the actual hostname and forwards its signed assertion. Confirm you are using the intended account and application.
- **403 after sign-in:** check exact owner email, Access policy, team domain and application audience. Do not disable JWT verification to bypass the error.
- **429 during rapid saves:** the API limits write requests. Wait at least a minute and retry without repeatedly clicking.
- **Watchlist not persisted:** inspect the browser Network request and Worker logs; check authentication, remote migrations and DB binding. Do not put tokens in screenshots.
- **Prices never change:** expected with the current demo dataset; a real ingestion service is still required.
- **GitHub change not visible online:** commit and push are not deployment. Confirm which site URL you are checking and deploy the intended export version.
- **Old hosted Site differs from workers.dev:** these are separate deployments with separate authentication and databases.

## 13. What “protection” means here

The export uses HTTPS in production, owner-restricted authentication, signed-token validation, spoofed-header removal, scoped database queries, same-origin JSON writes, input limits, rate limiting and browser security headers. Private responses use no-store caching. Production does not use the local-development authentication shortcut.

These controls reduce risk; they do not make the website unhackable. Server-side processing means this is not end-to-end encryption in the messaging-app sense. Hosting administrators and authorized application code can process data. Avoid storing unnecessary sensitive financial information.

The supplied tests passed during preparation, including type checking, production build, seven unit/auth tests and local production-Worker API integration tests. The integration tests use mocked identity keys and an isolated database. Real Cloudflare account login, policy configuration, billing and production deployment still require the manual checks in this guide.

Keep owner-only access unless multi-user access is deliberately designed and reviewed. A public launch needs additional abuse controls, privacy/retention decisions, licensing review and operational monitoring.

## 14. Add genuine daily market updates later

This is a development project, not a setting you can switch on. First select a data provider that permits the intended display, storage and redistribution of Indian market data. A free quote page does not automatically grant a redistribution license. Obtain applicable legal/compliance review before publicly offering investment recommendations or paid research.

Build the next version in stages:

1. Add server-side provider credentials and a small ingestion job. Keep credentials out of browser code.
2. Store source, instrument ID, exchange, price timestamp, retrieval timestamp and freshness status. Handle trading holidays and Asia/Kolkata market time.
3. Validate missing or implausible data and handle provider failures, rate limits, duplicates and retries. Preserve the last good data but clearly mark it stale.
4. Introduce a durable scheduler, job logs and failure alerts. Store generated daily reports instead of making every visitor regenerate them.
5. Calculate indicators with documented formulas. Separate factual observations from scenarios; never invent missing prices or probabilities.
6. Add options and IPO datasets with their own provenance and risks. Grey-market indications are not assured listing outcomes.
7. Backtest and evaluate forecasting methods with out-of-sample data, costs and failure cases before claiming predictive value. Show uncertainty and invalidation conditions.
8. Test in staging, verify several complete update cycles and publish only when source permissions, accuracy checks and operations are ready.

Suggested future report fields: market date/time, data source, freshness, instrument, horizon, observed trend, supporting evidence, scenario range, downside risks and methodology version. Do not promise a “best stock,” guaranteed daily income or a certain IPO outcome. Current demonstration scores are not calibrated success probabilities.

## 15. Quick reference and owner record

**Routine code release:** pull main; create branch; edit; npm run check; review; commit/push; merge; pull main; deploy; check the live site.

**Routine database protection:** export before risky changes; encrypt a second copy; test restoration separately; never commit database exports.

**If locked out:** confirm which hosting platform you are using, the account, Access policy, team domain, audience and owner secret. Keep production closed while fixing the configuration.

Record these non-secret details privately:

- Current hosted Site URL: https://marketscope-india-ansil.funfig256.chatgpt.site
- GitHub repository URL: ______________________________
- Self-hosted production URL: _________________________
- Cloudflare account/Worker name: _____________________
- D1 database name and ID: ____________________________
- Access application name: ____________________________
- Last deployed commit/version: _______________________
- Last successful backup and restore drill: ____________
- Domain renewal date and billing contact: ____________

Official installation links: https://nodejs.org/ | https://desktop.github.com/ | https://code.visualstudio.com/ | https://github.com/ | https://dash.cloudflare.com/

Dashboard labels and provider plans may change. Use the linked official documentation if the screen differs. This manual describes the supplied export; do not apply its commands blindly to an unrelated repository.
