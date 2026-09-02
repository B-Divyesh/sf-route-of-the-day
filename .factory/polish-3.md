# Polish 3 — review finding resolution

Repair commits: `d42afb9d3c3047638f2fda2220af4d8d0ecd2008`, `8f252865ce839b43161d69f51d2d5f3f584742a2`, and `87c440e30717022b752229ec81122e88c66d0cc5`.

The built static app was deployed to `https://route-of-the-day.sociobot.in` through the product-owned `sf-route-of-the-day` Static Web App. The live recheck below was made cold after deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the real static 404 shared shell: skip link, wordmark, navigation, recovery action, and footer. | `static deployment configuration serves missing routes with HTTP 404`; live `https://route-of-the-day.sociobot.in/missing-polish-three-check` returned HTTP 404 with one header, main, and footer; the live Axe sweep found 0 serious/critical findings. |
| F-1-2 | Retained static 404 canonical, description, OG/Twitter metadata, favicon, and touch icon. | `the static 404 document has the shared skeleton, metadata, and no serious axe issues`; cold live 404 check passed. |
| F-1-3 | Retained independently tagged observable input, reproducibility, and visible route-code claims; the date terminology claim now uses `daily-date` and `date-route-code`. | Fresh clone command sweep passed `@claim:pointer-input`, `@claim:reproducible-solution`, and `@claim:date-route-code`; live demo screenshot [polish-3-demo/screenshot-mobile.png](evidence/polish-3-demo/screenshot-mobile.png). |
| F-1-4 | Kept the plain date explanation and removed remaining player-facing seed terms. | `@claim:daily-date` and `@claim:date-route-code` passed from the final fresh clone; live daily board labels the value **Date**. |
| F-2-1 | Retained **Page not found** as the single 404 h1 in both SPA and real HTTP 404 documents. | Static 404 test passed; live `https://route-of-the-day.sociobot.in/missing-polish-three-check` had the expected title and h1. |
| F-3-1 | Replaced the idle rAF counter with a timed browser test that repeatedly adds and removes a real route tile, observes DOM mutations, and asserts active-update fps ≥50. | `@claim:frame-rate` passed in the final fresh clone. Cold live recheck measured 67 route updates in 1112.3 ms: **60.24 fps**. |
| F-3-2 | Added `privacy-surface`, covering no account/ranking/streak/analytics/ad controls, same-origin GET-only requests with no bodies, and no external script/style/font resources. Narrowed `local-progress` to its independently tested browser-storage behavior. | `@claim:privacy-surface` passed in the final fresh clone. Live demo made 3 same-origin GET-only requests, with 0 prohibited controls and 0 external resource origins; screenshot [polish-3-demo/screenshot-desktop.png](evidence/polish-3-demo/screenshot-desktop.png). |
| F-3-3 | Added `tile-limit` and `route-undo`. The first drives a legal non-winning route to the limit, confirms the recovery message, then verifies undo and restart. The second verifies previous-tile and Backspace removal, one tile at a time, followed by another valid move. | `@claim:tile-limit` and `@claim:route-undo` passed in the final fresh clone. Cold live recheck showed “The tile limit is reached. Step back and try another route.” and reduced the route from 9 to 8 after Undo. |
| F-3-4 | Replaced player-facing **Seed** with **Date**; rewrote archive copy around earlier dates; renamed the README section; renamed claim ids; and labeled the non-date sample identifier **Sample route**. | `@claim:daily-date`, `@claim:date-route-code`, and `@claim:demo-ready` passed from the final fresh clone. Live daily board announced `Date YYYY-MM-DD`; live demo announced `Sample route sample-map-7`; screenshots [polish-3-root/screenshot-desktop.png](evidence/polish-3-root/screenshot-desktop.png) and [polish-3-demo/screenshot-desktop.png](evidence/polish-3-demo/screenshot-desktop.png). |

## Verification summary

- Fresh clone: `/tmp/route-of-the-day-final-clean-xBx4DV` at `87c440e30717022b752229ec81122e88c66d0cc5`.
- All 17 exact commands in `.factory/claims.json` passed, then `npm test` passed 26/26, `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed.
- Build output: JavaScript 23.09 kB (8.26 kB gzip); CSS 13.82 kB (3.99 kB gzip).
- `/opt/fleet/lib/verify-url.sh` passed cold for `/` and `/?demo=1`; reports and 390 px/desktop screenshots are in `evidence/polish-3-root/` and `evidence/polish-3-demo/`.
- Live Playwright Axe sweep on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the real HTTP 404 found 0 serious/critical issues. Normal routes had 0 console errors and no 390 px horizontal overflow.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; FCP 764 ms, LCP 816 ms, CLS 0, TBT 47.5 ms. See [polish-3-lighthouse.json](evidence/polish-3-lighthouse.json).
