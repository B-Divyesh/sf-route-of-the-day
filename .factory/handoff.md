# Route of the Day — repair handoff

## Result: repaired and ready to deploy

This repair resolves every release-blocking finding in the independent report for candidate `f0bf543f612e6e08deedf7be893a4ee3e7ba1419`. The original report remains in [verification.md](verification.md).

## Changes

- Made the unmodified `npm test` gate reliable with one owned Playwright browser worker. The frame-rate claim is unchanged: it still requires at least 50 `requestAnimationFrame` callbacks in one second.
- Registered the documented 3–5 minute pace and archive-isolation claims, each with one tagged regression test. The privacy copy now accurately lists only stored route progress and completed daily seed; no settings claim remains.
- Kept archive state separate from daily state. An archive completion can no longer write the daily-completion marker.
- Made every visible link and enabled button at 390px at least 44×44 CSS pixels.
- Added `statusCode: 404` to the Static Web Apps 404 response override while retaining the designed `/404.html` page.
- Invalid `practice` values, including `1e309`, now recover to the daily puzzle. Valid archive values are bounded to a safe 100-year archive window.
- Added manual History API scroll-state saving. Back/Forward now restore the prior scroll location and focus the destination heading without moving the viewport.

## Verification evidence

Run on 1 September 2026 UTC from this checkout:

```sh
npm ci
npm run lint
npm test
npm run build
```

- Clean install: passed; 0 vulnerabilities reported by npm.
- `npm run lint`: passed (`tsc --noEmit`).
- Unmodified `npm test`: passed, 17/17 tests, one worker. This includes all ten tagged claims plus deterministic core, route metadata/Axe, invalid-seed recovery, scroll restoration, 404 deployment configuration, 390px overflow, and 44px target tests.
- `npm run build`: passed and produced `dist/`. JavaScript is 21.82 KB raw / 7.92 KB gzip; CSS is 13.82 KB raw / 3.99 KB gzip; the route artwork is 67.44 KB.
- Post-build `verify-url.sh` against `vite preview`: passed with title, `lang=en`, one `h1`, one `main`, alt text, named buttons, and zero console errors.
- Playwright Axe integration: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the in-app missing route. The separate `@axe-core/cli` command could not run because this worker has no system Chrome binary; it is redundant with the passing Playwright Axe integration that uses the installed Chromium.
- Production-preview service-worker check: after control and an online reload, `/demo` reloaded offline with four selected sample tiles and accepted the fifth; zero console errors.

## How to run

```sh
npm ci
npm run dev
# open http://127.0.0.1:5173/demo
npm test
npm run build
npm run preview
```

## Known gaps

None in the product repair. The `@axe-core/cli` binary check is environment-limited only; accessibility coverage is present in the passing Playwright suite.
