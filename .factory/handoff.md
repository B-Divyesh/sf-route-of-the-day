# Route of the Day — polish 2 handoff

## Result: PASS

Repair commit: `8965dcf608b3319378818d51eb84072b35d84e69` (`fix: name the not found page plainly`).

The final outstanding review finding, F-2-1, is fixed: both the SPA fallback and real static HTTP 404 now use the direct, standalone heading **“Page not found.”** The prior F-1-1 through F-1-4 repairs remain present and were re-verified. `polish-2.md` maps every cumulative finding to its implementation and evidence.

## What changed

- Changed the sole h1 in `src/app.ts` and `public/404.html` from the route-themed metaphor to `Page not found`.
- Updated static-404 source coverage and added a live-SPA h1 assertion to the route/accessibility test.
- Preserved the product’s transit-map visual system, real HTTP 404 response, metadata, isolated `?demo=1` sample, local-first storage, and claim inventory.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run build
```

All 14 exact claim commands listed in `.factory/claims.json` also pass individually from a clean clone. The clean-clone check used `/tmp/route-clean-rOLsCv` at repair commit `8965dcf608b3319378818d51eb84072b35d84e69`:

- `npm ci` — pass, 0 vulnerabilities.
- 14/14 individual `@claim:` commands — pass.
- `npm test` — pass, 23/23.
- `npm run lint` — pass.
- `npm run build` — pass; `dist/` produced.
- `npm audit --audit-level=high` — pass, 0 vulnerabilities.

The built app has 23.04 kB JavaScript (8.25 kB gzip) and 13.82 kB CSS (3.99 kB gzip), below the static budget.

## Deployment and live checks

Deployed `dist/` to `https://route-of-the-day.sociobot.in` through static deployment `3163b1dc-18bf-4974-87ad-d725f1cf5302`.

- `/opt/fleet/lib/verify-url.sh` passed cold on `/` and `/?demo=1`: one h1/main, `lang=en`, image alts, named buttons, and no console errors. Screenshots and reports are under `verification-evidence/polish-2-root/` and `verification-evidence/polish-2-demo/`.
- A cold 390px Playwright/Axe check of `/`, `/?demo=1`, `/privacy`, `/terms`, and `/definitely-missing` found zero serious or critical accessibility violations. Each route had its expected title, one h1, one main, header, footer, canonical URL, and no product errors.
- `https://route-of-the-day.sociobot.in/definitely-missing` returned a genuine HTTP 404. Its only h1 is “Page not found”; evidence screenshot: `verification-evidence/polish-2-404/screenshot-mobile.png`.
- The cold live demo began with four tiles, accepted the next tile, reset to four, left daily storage unchanged, cleared demo storage on exit, made same-origin-only requests, and remained playable after being set offline.

## Known gaps and next steps

None. The product is static, free, local-first, and has no backend, account, payment, or external API dependency.
