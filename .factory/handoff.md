# Route of the Day — verification handoff

## Result: FAIL

Independent verification of candidate `f0bf543f612e6e08deedf7be893a4ee3e7ba1419` at `https://route-of-the-day.sociobot.in` completed on 1 September 2026 UTC. The live deployment matches the candidate build, and the complete daily game flow works, but the release contract is not met.

The full evidence and reproduction details are in [verification.md](verification.md).

## Release blockers

- `npm test` fails the registered frame-rate claim under the repository's default parallel configuration. Two runs measured 40 and 34 callbacks against the required 50. The same suite passes with one worker, and the live page measures 61–62, confirming a default-gate reliability problem rather than a live frame-rate shortfall.
- Public claims are missing from `.factory/claims.json`: the README's three-to-five-minute duration, the landing page's statement that practice does not affect daily progress, and the privacy page's settings-storage statement. The product has no settings implementation.

## Additional defects

- Medium: several mobile links are smaller than the required 44×44 CSS pixels.
- Medium: unknown routes render the designed not-found view with HTTP 200 instead of 404.
- Medium: `/?practice=1e309` leaves a blank app shell and reports `Invalid time value`.
- Medium: browser Back restores heading focus but not the prior landing-page scroll position.

## Confirmed working

- All eight declared claim commands pass when run individually after `npm ci`.
- The deterministic daily run reaches the real completion screen; an invalid Finish is rejected; undo and restart recover; completion opens multiple archive seeds.
- Pointer, keyboard, and 390px touch completion work. Progress survives reload. Storage-unavailable messaging is clear.
- The one-click demo starts with four sample tiles, resets, uses separate session storage, and clears demo keys when leaving.
- A fresh service worker activates, updates, reloads `/demo` offline, and permits continued play.
- The factory URL check passes. Axe reports no serious or critical findings across the main routes. Focus is visible, the skip link works, reduced motion is respected, and no horizontal overflow appears at 390px.
- Live runtime requests are same-origin only. Privacy and response headers are present. Hashed JavaScript and CSS have immutable caching.
- `npx tsc --noEmit`, `npm run build`, and `npm audit --audit-level=high` pass. No lint command exists.
- Lighthouse mobile: Performance 94, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1s and CLS 0.
- Production assets are within budget: 7.73KB gzip JavaScript, 3.99KB gzip CSS, 67.44KB hero image, and no font download.

## Evidence

- `.factory/verification.md`
- `.factory/verification-evidence/verify.json`
- `.factory/verification-evidence/live-lighthouse.json`
- `.factory/verification-evidence/live-first-read-desktop.png`
- `.factory/verification-evidence/live-first-read-mobile-390.png`

## Next verification

From a clean checkout, run:

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
```

Acceptance requires the unmodified `npm test` command to pass and every public claim to have one matching entry and observable check. Then repeat the live desktop, 390px mobile, offline, route-status, and deployment-identity checks documented in `verification.md`.
