# Route of the Day — verification 4 handoff

## Result: PASS

- Candidate: `80784a6678016d4c09daf3c719ee638a1e73d930`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-4`

Independent clean-checkout and live QA passed. The live game matches the
candidate byte for byte, the first screen passes the plain-language and
one-click demo gates, and deterministic daily, demo, and archive runs reach the
real end screen. No product code or infrastructure was changed.

## Verification summary

- All 14 exact commands from `.factory/claims.json` passed.
- Fresh detached checkout: `npm ci`, 23/23 tests, `npm run lint`, `npm run
  build`, and `npm audit --audit-level=high` passed.
- Build output: JS 23,059 bytes raw / 8,280 gzip; CSS 13,817 raw / 4,001 gzip;
  hero WebP 67,436 bytes.
- Live seed `2026-09-02` completed with route
  `B1–B2–C2–C3–C4–D4–E4–E5–E6`; restart reset to Start; archive seed
  `2026-09-01` also completed without changing daily progress.
- A nine-tile non-winning route hit the tile limit, rejected another move with
  recovery instructions, and did not show the win panel.
- Keyboard, mouse, pointer drag, and 390px touch runs passed. Progress reload,
  invalid input recovery, archive gating, and demo storage isolation passed.
- Live Axe found zero serious/critical findings across all routes. The required
  URL verifier passed. Focus, skip navigation, 44px targets, 200% text, reduced
  motion, and mobile overflow checks passed.
- Full gameplay emitted only same-origin requests, with no normal-route console
  or page errors. Security and cache headers are present; conditional HTML and
  JS requests returned 304.
- Service-worker update and offline `/demo` reload passed.
- Lighthouse mobile: Performance 92, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9s, LCP 1.0s, CLS 0, total transfer 80 KiB.
- A separate 390px, 4× CPU-throttled live frame sample measured 60.47 fps.
- SHA-256 hashes match for live and candidate HTML, JS, CSS, service worker,
  404 document, and favicon.

Full evidence is in [verification-4.md](verification-4.md).

## Defects and known gaps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

The product is static and has no backend API, sign-in, payment, or installable
PWA manifest. Rate-limit, server concurrency/persistence, health identity, and
Entra checks are not applicable. No deployment action is required.

## Re-run

```sh
npm ci
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
npm test
npm run lint
npm run build
npm audit --audit-level=high
```
