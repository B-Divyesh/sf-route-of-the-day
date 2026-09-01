# Route of the Day — repair handoff

## Result: PASS

- Work order: `route-of-the-day-repair-2`
- Repaired candidate: `8508a5e3b8e2048b09f21b45ca2216616318681c`
- Verifier report commit: `e8559bc2fdfb1b0c24adec5445d6fce0ccdcc541`
- Repair implementation: `04e9962`
- Live URL: `https://route-of-the-day.sociobot.in`
- Deployed: 1 September 2026 UTC

Every finding in `.factory/verification-2.md` is repaired. The researched brief,
deterministic daily game, demo sandbox, archive behavior after completion, visual
system, and static deployment class are preserved.

## Pre-fix reproduction

The report commit was tested before any product changes:

- Fresh `/?practice=1` rendered **Draw an archive route**, seed `2026-08-31`,
  while the same page still said practice was locked.
- A stale `route:daily-complete:v1` value of `2026-08-31` exposed **Open
  practice routes** for daily seed `2026-09-01`.
- A stored path containing Start and `{row:99,col:99}` rendered `8` tiles left
  and no board cell with `tabindex="0"`.
- Pressing Enter on **Reset demo** left `document.activeElement` on `<body>`.

Focused regressions were added and observed failing for all four states before
the implementation changed.

## Repairs

1. Archive access now requires `route:daily-complete:v1` to equal the current
   UTC daily seed exactly. Fresh and stale direct practice URLs are replaced by
   `/` and render today’s route. A valid current marker keeps `?practice=1` and
   publishes yesterday’s UTC seed.
2. `.factory/claims.json` now registers the archive-lock promise. Its exact
   claim test covers fresh, stale, and current markers. The practice claim now
   asserts the published archive seed as well as unchanged daily storage.
3. Restored paths are rejected unless every position has integer coordinates,
   is in bounds, is open, is unique, is adjacent to its predecessor, begins at
   Start, and stays within the tile budget. Invalid data returns to the correct
   fallback and leaves one roving keyboard tab stop.
4. Demo reset now focuses the replacement **Reset demo** button. Its claim test
   activates reset by keyboard and checks the restored focus and unchanged
   pre-existing daily storage.
5. The service-worker cache was advanced to `route-of-the-day-v2` so prior
   visitors receive the repaired application shell.

## Regression coverage

- `@claim:archive-gate`: direct access denied with empty and yesterday’s marker;
  access allowed only with today’s marker; practice seed equals yesterday UTC.
- `@claim:practice-progress`: archive seed publication and daily path/marker
  isolation.
- `@claim:demo-ready`: keyboard reset focus, four-tile sample reset, demo-only
  session keys, and preservation of an existing daily-storage sentinel.
- Invalid saved-route matrix: out of bounds, non-adjacent, blocked, revisited,
  over budget, and wrong coordinate type. Every case resets to Start with one
  keyboard tab stop and a correct tile count.

## Local verification

```text
npm ci                         PASS (23 packages added, 0 vulnerabilities)
11 exact claim commands        PASS individually
npm run lint                   PASS
npm test                       PASS (19/19, one worker)
npm run build                  PASS; dist/ created
npm audit --audit-level=high   PASS (0 vulnerabilities)
git diff --check               PASS
```

Production build:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 22.52 KB | 8.18 KB |
| CSS | 13.82 KB | 3.99 KB |
| HTML | 1.78 KB | 0.62 KB |
| Route artwork | 67.44 KB | — |

The private static application has no package/consumer surface, backend,
identity provider, payment path, or rate-limited API, so those checks do not
apply.

## Browser, accessibility, privacy, and offline evidence

- Desktop `1440×900` and mobile `390×844`: `/`, `/demo`, `/privacy`, and
  `/terms` have zero serious or critical Axe findings.
- Automated and browser checks cover pointer, keyboard, touch, skip-link focus, route
  completion, restart, 44px mobile targets, reduced motion, titles, landmarks,
  one `h1`, alt text, horizontal overflow, and console errors.
- Production browser smoke: zero console errors and zero page errors. Every
  observed request was same-origin.
- Service worker: activated and controlling, `update()` left no waiting worker,
  cache `route-of-the-day-v2` was present, and `/demo` reloaded offline before
  accepting tile five.
- Live mobile full run under 4× CPU throttling: five active one-second samples
  each measured 61 animation frames; the run reached the end screen, stored
  marker `2026-09-01`, and opened archive seed `2026-08-31`.
- Factory URL checker: HTTP 200, 690ms load, correct title/lang/main/alt/button
  names, and no console errors. Evidence is in `evidence/repair-live/`.

Live Lighthouse 12.8.2 mobile (`evidence/lighthouse-repair.json`):

| Measure | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.86s |
| LCP | 0.91s |
| Total blocking time | 45ms |
| CLS | 0 |

## Live deployment and response policy

The verified `dist/` was deployed to the existing scoped resource
`sf-route-of-the-day` by `/opt/fleet/lib/deploy-static.sh`. Deployment ID:
`bd6cb960-da31-4a93-9424-aff04822f35e`. The custom domain is ready over HTTPS.

Routes return `/`, `/demo`, `/privacy`, and `/terms` as 200; an unknown route
returns the designed 404 with HTTP 404. HTML revalidates after 30 seconds,
hashed JS/CSS are immutable for one year, and `sw.js` uses `no-cache`.
Responses include CSP with `frame-ancestors 'none'`, HSTS, nosniff, strict
origin referrer policy, and disabled camera, microphone, and geolocation.

Rebuilt and live SHA-256 values match:

| File | SHA-256 |
| --- | --- |
| `index.html` | `b77dfb6533d332fdb6925a79f8353967d95894809dfe4565a37c275d06e46999` |
| `index-qLr123PF.js` | `c2babf4a8b0d4677a16d99aa79f9cdda1ca89262903be57450b766742500bd79` |
| `index-BeIPPYuh.css` | `35ba14dcbbf92551ed4cfb01495f98d67688fa2d38c502daae0c37a7a49a4956` |
| `sw.js` | `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02` |
| `404.html` | `dad571a5852417760b7117cd175224c0b5d2f0eefe4b8d9213091b773ec323fe` |

## Run and verify

```sh
npm ci
npm run lint
npm test
npm run build
npm run preview
```

Known release-blocking gaps: none.
