# Route of the Day — polish 1 handoff

## Result: PASS

Repair commit: `be2e78c846e6a8a0a732b0d10add3c65d48e4dc1`.

## Shipped

- Added the direct `/?demo=1` sandbox entry. It opens the four-tile sample, shows the persistent banner, resets inside `demo:` session storage, and clears demo storage on **Start for real**.
- Rewrote the first-screen job wording and catalog description in plain language.
- Completed the real static 404 with the shared navigation, skip link, footer, icon, canonical, Open Graph, and Twitter metadata.
- Updated SPA title, canonical, Open Graph, and Twitter values on route changes.
- Declared and tested the remaining README claims for mouse input, known solutions, and the visible seed/route code. Replaced the implementation-jargon explanation.

## Verification

- Clean-clone verification: cloned `be2e78c846e6a8a0a732b0d10add3c65d48e4dc1` into `/tmp/route-clean-qIXRTs`, ran `npm ci`, then each of the 14 commands in `.factory/claims.json`. Every command passed.
- Local quality gates: `npm test` passed **23** tests; `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed. The build produced `dist/`; initial JavaScript is 8.26 KB gzip and CSS is 3.99 KB gzip.
- Accessibility: Playwright axe checks found no serious or critical issues on app routes and `404.html`. The live `/opt/fleet/lib/verify-url.sh` check for `https://route-of-the-day.sociobot.in/?demo=1` passed: title, `lang=en`, one h1, main landmark, image alt text, labeled buttons, and no console errors.
- Live cold checks after production deployment: `/?demo=1` returned 200 with title **Demo — Route of the Day**, the demo banner, four selected tiles, and no script errors. `/definitely-missing` returned HTTP 404 with title **Page not found — Route of the Day**, one header, one footer, canonical `/404`, and the favicon.
- Screenshots: `./verification-evidence/polish-1-live-demo.png` and `./verification-evidence/polish-1-live-404.png`.

## Deploy

Built `dist/` and deployed it to the production Static Web App `sf-route-of-the-day`. The custom live URL is `https://route-of-the-day.sociobot.in`.

## Known gaps

None.
