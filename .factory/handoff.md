# Route of the Day — polish 3 handoff

## Result: PASS

All findings from `review-1.md`, `review-2.md`, and `review-3.md` are resolved and rechecked. The delivered browser game remains a deterministic, local-first daily spatial route puzzle with an isolated one-click sample at `?demo=1`.

## Delivered

- Repaired F-3-1 through F-3-4: active route-update FPS measurement, complete privacy-surface coverage, tested tile-limit/undo recovery, and player-facing date language.
- Added three observable claim checks: `privacy-surface`, `tile-limit`, and `route-undo`; updated the date claim names and narrowed `local-progress` to exactly what it proves.
- Kept all prior 404, metadata, routing, focus, mobile, demo isolation, and accessibility repairs intact.
- Changed the demo identifier to **Sample route** so the non-date sample id is not mislabeled as a date.
- Updated the catalog description and copy audit.

## Commits and deployment

- `d42afb9d3c3047638f2fda2220af4d8d0ecd2008` — primary review-3 claims and copy repair.
- `8f252865ce839b43161d69f51d2d5f3f584742a2` — plain demo route label.
- `87c440e30717022b752229ec81122e88c66d0cc5` — regression coverage for the demo route label.
- All repair commits were pushed to `origin/main`.
- The built artifact was deployed through `/opt/fleet/lib/deploy-static.sh route-of-the-day dist` to the product-owned Static Web App `sf-route-of-the-day`; cold HTTPS checks passed at `https://route-of-the-day.sociobot.in/` and `https://route-of-the-day.sociobot.in/?demo=1`.

## Exact verification evidence

- Final fresh clone: `/tmp/route-of-the-day-final-clean-xBx4DV` at `87c440e30717022b752229ec81122e88c66d0cc5`.
- Every one of the 17 exact `.factory/claims.json` commands passed from that clone. Its final `npm test` run passed 26/26; `npm run lint`, `npm run build`, and `npm audit --audit-level=high` also passed.
- Production build: 23.09 kB JavaScript (8.26 kB gzip) and 13.82 kB CSS (3.99 kB gzip); `dist/` was produced.
- Cold factory URL verifier reports: [root](evidence/polish-3-root/verify.json) and [demo](evidence/polish-3-demo/verify.json). Both report the expected title, `lang=en`, one h1, main landmark, no missing image alt text, and no console errors.
- Cold live interaction check: 67 active add/remove route updates in 1112.3 ms, or 60.24 fps; demo started and reset at four tiles, preserved a daily storage sentinel, made only three same-origin GET-only requests with no bodies, and exposed no prohibited privacy surfaces. Tile-limit recovery reduced a nine-tile route to eight after Undo.
- Live Axe sweep across `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and real HTTP 404: 0 serious/critical violations. Normal routes had no console errors and no 390 px horizontal overflow.
- Live mobile Lighthouse report: [polish-3-lighthouse.json](evidence/polish-3-lighthouse.json), 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 764 ms, LCP 816 ms, CLS 0, and TBT 47.5 ms.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
```

Every independent claim command is listed in `.factory/claims.json`. For the demo, open `/?demo=1`, use **Reset demo** to restore four sample tiles, or **Start for real** to discard the isolated session data.

## Known gaps and next steps

None. No accounts, payments, backend, secrets, infrastructure, or unrelated resources were added or changed.
