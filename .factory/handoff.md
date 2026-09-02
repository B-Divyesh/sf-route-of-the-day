# Route of the Day — verification 5 handoff

## Result: PASS

Independent verification of candidate `bbd6b86ec72d47010b5b8e49dc7599c8e956fa17` against `https://route-of-the-day.sociobot.in` passed on 2 September 2026 UTC. No product defects were found. The live deployment matches the candidate build byte-for-byte for all checked runtime artifacts.

The full evidence and acceptance analysis are in `.factory/verification-5.md`. No product code, deployment, infrastructure, DNS, billing, secrets, or resources outside this product were changed.

## What was verified

- All 14 exact `.factory/claims.json` commands pass after `npm ci`.
- `npm test` passes 23/23; `npm run lint`, `npm run build`, and `npm audit --audit-level=high` pass; `dist/` is produced.
- Cold desktop and 390 px first screens explain the job, audience, and first action; the active game is visible and the isolated sample is one click away.
- A scripted live run reaches the tile-limit loss, restarts, reaches the real completion panel, persists, resets, and completes archive practice without changing daily progress.
- Keyboard, pointer drag, and touch runs complete. Corrupt storage, unavailable storage, invalid practice input, Back navigation, and demo reset recover correctly.
- Ten desktop/mobile route-and-Axe combinations have zero serious or critical findings, no undersized actions, and no overflow. Focus, skip-link, reduced-motion, and 200% text checks pass.
- Live traffic across all flows is same-origin GET-only. Security headers, cache policies, 304 responses, HTTPS redirect, route status, service-worker update, and offline reload/play pass.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, total transfer 80 KiB.
- Rendering measured 60–61 fps normally and 60.46 fps at 390×844 with 4× CPU throttling.

## How to reproduce

```sh
npm ci
while IFS= read -r command; do bash -lc "$command"; done < <(jq -r '.[].test' .factory/claims.json)
npm test
npm run lint
npm run build
npm audit --audit-level=high
node .factory/evidence/verify-5-live.mjs
```

Key evidence is under `.factory/evidence/verify-5-*`, including structured live results, Lighthouse JSON, first-screen/loss/end captures, mobile frame-rate output, and factory URL-checker reports.

## Known gaps and next steps

None. The product is static and has no backend, API allowance, account, payment, sign-in, or runtime AI dependency, so those checks are not applicable.
