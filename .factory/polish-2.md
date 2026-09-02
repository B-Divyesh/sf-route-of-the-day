# Polish 2 — review finding resolution

Repair commit: `8965dcf608b3319378818d51eb84072b35d84e69`.
Deployed static artifact: Azure Static Web Apps deployment `3163b1dc-18bf-4974-87ad-d725f1cf5302`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the repaired static 404 shared shell: skip link, wordmark, four-link navigation, recovery action, and footer with Privacy, Terms, Param Factory, and build text. | Clean-clone test `static deployment configuration serves missing routes with HTTP 404`; live `https://route-of-the-day.sociobot.in/definitely-missing` returned HTTP 404 with one header, main, and footer; screenshot `verification-evidence/polish-2-404/screenshot-mobile.png`. |
| F-1-2 | Kept the static 404 canonical, description, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon. | Clean-clone test `the static 404 document has the shared skeleton, metadata, and no serious axe issues`; live 404 check found canonical `https://route-of-the-day.sociobot.in/404`; screenshot `verification-evidence/polish-2-404/screenshot-mobile.png`. |
| F-1-3 | Kept the complete README claim inventory and the independently tagged pointer, reproducible-solution, and seed-route-code coverage. | From fresh clone `/tmp/route-clean-rOLsCv`, all 14 exact commands in `.factory/claims.json` passed, including `@claim:pointer-input`, `@claim:reproducible-solution`, and `@claim:seed-route-code`; live sample `https://route-of-the-day.sociobot.in/?demo=1` reset from five tiles to four without changing a daily sentinel. |
| F-1-4 | Kept the README plain-language explanation: “The UTC date chooses one route, its direction, blocked squares, and one rule.” | Fresh-clone `@claim:daily-seed` passed; the current README has the reviewed wording; live daily route loaded at `https://route-of-the-day.sociobot.in/`. |
| F-2-1 | Replaced the metaphor 404 heading in both `src/app.ts` (SPA fallback) and `public/404.html` (real HTTP 404) with **“Page not found”**. Added explicit static and SPA heading assertions. | Clean-clone tests `the static 404 document has the shared skeleton, metadata, and no serious axe issues` and `routes have one h1, correct titles, no serious axe issues, and no console errors` passed. Cold live `https://route-of-the-day.sociobot.in/definitely-missing` returned 404 with sole h1 “Page not found,” no serious/critical Axe findings, and screenshot `verification-evidence/polish-2-404/screenshot-mobile.png`. |

## Cumulative verification

- Fresh clone at `8965dcf608b3319378818d51eb84072b35d84e69`: `npm ci`; every one of the 14 exact claim commands; `npm test` (23/23); `npm run lint`; `npm run build`; and `npm audit --audit-level=high` all passed.
- The production build emitted 23.04 kB JavaScript (8.25 kB gzip) and 13.82 kB CSS (3.99 kB gzip).
- Post-deploy `/opt/fleet/lib/verify-url.sh` passed on the live root and `?demo=1`, producing `verification-evidence/polish-2-root/` and `verification-evidence/polish-2-demo/` screenshots and JSON reports.
- A live 390px Axe sweep of `/`, `/?demo=1`, `/privacy`, `/terms`, and `/definitely-missing` found zero serious or critical violations. The real 404 alone has the expected browser network log for its HTTP 404 document; it has no product script or page errors.
- Cold live demo evidence: four initial tiles, five after a valid move, four after Reset demo; daily `localStorage` sentinel remained `daily`; leaving demo cleared demo session keys; every request stayed on `https://route-of-the-day.sociobot.in`; the loaded demo accepted a move after its context went offline.
