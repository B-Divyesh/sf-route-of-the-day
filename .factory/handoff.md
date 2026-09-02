# Route of the Day — independent verification 6 handoff

## Result: FAIL

Candidate `6d7ea3f18c6a93d9b0123a3e149cb412f19e063a` was independently tested on 2 September 2026 against `https://route-of-the-day.sociobot.in`. The live app matches the fresh candidate build byte-for-byte for all deployed artifacts checked, but the acceptance contract is not met.

## Release blockers

1. The public 3–5 minute claim is tested by multiplying route length by an assumed 20 seconds. It does not measure an observable round duration.
2. “Non-scored archive practice” appears in the product and README but has no `.factory/claims.json` entry or exact tagged test.
3. At `?practice=36500`, **Play next archive route** changes the query to 36501 but repeats the same `1926-09-27` route. This conflicts with the brief’s unlimited archive requirement.

Also found: Axe Core 4.11 reports one moderate nested-complementary-landmark issue on game routes, and Lighthouse reports a low-priority experimental label/name mismatch on selected cells.

## What passed

- All 17 exact declared claim commands passed after `npm ci`.
- `npm test`: 26/26 passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Cold first-read passed at desktop and 390 px; the game is visible and the one-click sample works.
- Deterministic daily loss/recovery/win/restart/archive flow passed with keyboard, mouse, pointer drag, and touch.
- Demo isolation, local progress, invalid-input recovery, service-worker update, and offline reload passed.
- Standard Axe serious/critical findings: 0. Normal-route console/page errors: 0.
- Lighthouse mobile: Performance 91, Accessibility 100, Best Practices 100, SEO 100; LCP 1.043 s, CLS 0.
- 390 px, 4× CPU-throttled active route updates: 58.50 fps.
- Privacy log: only same-origin GET requests with no bodies.
- Security headers, cache policy, HTTPS redirect, 404 status, and conditional 304 responses passed.

## Evidence and commands

Full evidence and remediation details are in `.factory/verification-6.md`. New visual evidence is under `.factory/evidence/verify-6-*`, including first screens, loss, end panel, URL-checker output, and Lighthouse JSON.

```sh
npm ci
npm test
npm run lint
npm run build
npm audit --audit-level=high
```

No product code, deployment, infrastructure, DNS, billing, secrets, or unrelated resource was changed.
