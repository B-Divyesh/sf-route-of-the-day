# Route of the Day — handoff

## What shipped

- A complete daily spatial puzzle generated from the current UTC date.
- A 6×6 keyboard, pointer, and touch board with 9–10 route tiles.
- Three deterministic rule families: checkpoint, exact turns, and two scenic markers.
- Clear invalid-move, blocked-route, completion, restart, and storage-error states.
- A completion screen with the published route code and archive practice entry.
- Non-scored archive puzzles based on earlier UTC date seeds, with a next-route loop.
- Local progress recovery after refresh and no account requirement.
- An isolated `/demo` with a half-finished sample, reset, and `demo:` session keys.
- `/privacy`, `/terms`, SPA navigation, a designed static 404, metadata, social art, icons, sitemap, robots, security headers, and a service worker.
- The generative-geometry design system and original factory-generated route landscape.

## Run and verify

```sh
npm install
npm test
npm run build
```

`npm run build` is the exact production command. It writes `dist/index.html` and all static assets under `dist/`.

Verification on 1 September 2026:

- `npm test`: 11 passed in Chromium 145.
- Claim tests: all 8 entries in `.factory/claims.json` passed as part of that suite.
- Determinism: 100 generated seeds replayed their published solutions.
- Axe: no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or the in-app 404.
- Factory `verify-url.sh`: title present, `lang=en`, one `h1`, main landmark present, no missing alt text, no unlabeled buttons, and no console errors.
- Production Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse timings: LCP 1.4s, CLS 0, total blocking time 80ms.
- Animation measurement: 62 `requestAnimationFrame` callbacks in one second; the automated threshold is 50 fps.
- Production assets: 21.35KB JavaScript and 13.75KB CSS raw; 7.73KB and 3.99KB gzipped.
- Generated hero: 67.4KB WebP; social image: 99.2KB WebP.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Visual review: desktop 1440×1000 and mobile 390×844 show the live board in the first screen with no horizontal overflow.

## Privacy and operations

Daily progress stays in `localStorage`. Demo state stays in `sessionStorage` keys beginning with `demo:` and is cleared when the player starts for real. There are no analytics, accounts, remote fonts, runtime CDNs, payments, or external game-data requests.

The build is static. Deployment should publish only `dist/`. No infrastructure, DNS, secrets, billing, or other product resources were accessed.

## Known limits and next steps

- The generator combines four tested route skeleton families with rotation, reflection, obstacles, and rule variants. More skeleton families can expand long-term variety without changing stored progress.
- Success measures require aggregate return and archive-use data. This v1 deliberately ships without analytics, so those measures need a later privacy review before instrumentation.
- The service worker supports cached production visits. The explicit offline claim is narrower: a puzzle already loaded remains playable offline.
