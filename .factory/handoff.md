# Route of the Day — repair 3 handoff

## Result: repaired and deployed

This repair resolves every release-blocking finding in independent verification 6 (`03a32769d8c91a3cc74f75dbd0a09de8de88be8c`) for candidate `6d7ea3f18c6a93d9b0123a3e149cb412f19e063a`. The production deployment is live at https://route-of-the-day.sociobot.in.

## What changed

1. Removed the public “three to five minutes” promise and its circular 20-seconds-per-tile test. The product makes no duration claim.
2. Made archive indexes canonical decimal strings rather than capped numbers. `?practice=36500` now advances to `?practice=36501` with its own UTC-date seed; arbitrary larger indexes use a unique deterministic `archive-<index>` seed when there is no practical calendar label.
3. Registered **Archive practice is not scored** in `.factory/claims.json` and added its exact `@claim:archive-non-scored` browser test. It observes the visible non-scored mode, unchanged daily completion marker, and no score/ranking storage.
4. Replaced the nested route-status `<aside>` with a labelled `role="group"`, removed the unsupported `aria-label` from the generic date container, and added the selected route-order number to every selected cell’s accessible name.
5. Added regression coverage for the verifier’s exact 36,500 → 36,501 reproduction, arbitrary-length archive indexes, the non-scored contract, and the accessibility findings.

## Reproduction evidence

Before the repair, a headless browser completed `?practice=36500` and observed:

```json
{
  "before": { "url": "?practice=36500", "date": "1926-09-27" },
  "after": { "url": "?practice=36501", "date": "1926-09-27" },
  "repeated": true
}
```

After deployment, the same live flow observed `1926-09-27` / seed `1926-09-27` at index `36500`, then `1926-09-26` / seed `1926-09-26` at index `36501`.

## Verification

Run from a clean install:

```sh
npm ci
npm test
npm run lint
npm run build
npm audit --audit-level=high
```

- `npm test`: **29/29 passed**. This includes desktop, 390 px touch, keyboard, pointer, offline, service data, privacy, and all accessibility regressions.
- All **17** exact commands listed in `.factory/claims.json` passed independently. Each claim tag occurs exactly once in the test suite.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/` produced. Current initial assets are 23.63 kB raw / 8.50 kB gzip JS and 13.82 kB raw / 3.99 kB gzip CSS. The hero image is 67.44 kB.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh` passed for local production `/` (613 ms) and `/?demo=1` (539 ms), then for live `/` (677 ms) and `/?demo=1` (617 ms): correct route titles, `lang`, one `h1`, one `main`, no missing image alt text, no unlabeled buttons, and no console/page errors.
- Playwright Axe on live root and demo found no serious or critical issues; `landmark-complementary-is-top-level` is absent and the selected route cell exposes `route tile 1 of …` in its accessible name.
- Live 390 px browser check has no horizontal overflow. The exact archive-boundary regression passed live with no console errors.
- Static Web Apps emulator verified the production response policy: HTTP 200, CSP including response-header `frame-ancestors 'none'`, `nosniff`, strict referrer policy, and designed HTTP 404. A production service-worker check confirmed a controlled active worker with no waiting update; an offline demo reload retained four sample tiles and accepted a fifth tile with no errors.
- Fresh local Lighthouse: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 951 ms, LCP 1,009 ms, CLS 0, TBT 65.5 ms.
- Live identity: `index.html` SHA-256 `03a1dac9f567b5fa216257c5a086dacad76a3c27871addd7a27f295bbdbd4ed8` and bundle `assets/index-KZojNDwD.js` SHA-256 `69a788c25ded28406619cd201a134b9ca35c5f7daf66bd284beed8c55214d272` both match the deployed `dist/` files.

## Deployment

Built `dist/` was deployed to the owned production Static Web App `sf-route-of-the-day` in resource group `sociobot` using `swa deploy dist --env production`. The custom production URL serves the matching build.

## Known gaps / next steps

No known release-blocking product gaps. Archive indexes beyond ten million use a numbered deterministic archive seed instead of a human calendar date; this preserves an unbounded, non-repeating archive identity when JavaScript dates are no longer a useful label.
