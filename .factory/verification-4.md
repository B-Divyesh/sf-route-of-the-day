# Independent product verification 4 — PASS

## Scope and decision

- Candidate: `80784a6678016d4c09daf3c719ee638a1e73d930`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-4`
- Decision: **PASS**

The candidate meets the researched brief and browser-game acceptance contract.
The live artifact matches the candidate, the complete daily and archive loops
work, and no release-blocking defect was found. Product code and infrastructure
were not changed.

## Mandatory first checks

`.factory/claims.json` exists and contains 14 claims. After `npm ci`, every
listed command was run exactly as written before the broader review. All 14
passed:

| Claim | Result | Observed evidence |
| --- | --- | --- |
| `demo-ready` | Pass | `/?demo=1` opened with four selected tiles; reset restored four; demo state stayed in `demo:` session storage and exit preserved daily storage. |
| `daily-seed` | Pass | Two clean contexts received the same UTC date seed and solution. |
| `round-duration` | Pass | Representative generated routes met the declared 180–300 second design model. |
| `local-progress` | Pass | A placed tile survived reload and all requests stayed on the product origin. |
| `complete-run` | Pass | The published route reached the completion panel, opened archive practice, and restarted. |
| `archive-gate` | Pass | Fresh and stale completion markers were denied; only today's exact marker opened practice. |
| `practice-progress` | Pass | Practice used the prior published UTC seed and left daily route storage unchanged. |
| `multi-input` | Pass | Separate keyboard and 390px touch runs reached the end screen. |
| `pointer-input` | Pass | Mouse input completed the sample; an additional live pointer-drag run also completed. |
| `reproducible-solution` | Pass | Representative published-date solutions completed deterministically. |
| `seed-route-code` | Pass | The seed was visible before play and the route code appeared after completion. |
| `frame-rate` | Pass | The claim test exceeded 50 fps. A separate 390px, 4× CPU-throttled live sample measured 60.47 fps over three seconds. |
| `free-access` | Pass | The grid was immediately playable with no account, purchase, subscription, or payment step. |
| `offline-play` | Pass | The loaded demo accepted play offline. |

The cold live first screen also passed. It states what the product does with
“Draw today’s spatial route,” identifies “daily-puzzle players,” and presents
**Try it with sample data** beside “Opens a half-finished sample puzzle.” The
live game board is part of that first screen, not hidden behind a menu. On a
390×844 viewport the game panel begins at 583px and the grid begins at 816px,
so the live game itself is visible in the first viewport. There is no horizontal
overflow.

## Clean-checkout gates

A fresh detached checkout at the candidate commit was created at
`/tmp/route-qa-GYzvR0`.

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 vulnerabilities. |
| `npm test` | Pass; 23/23 tests. |
| `npm run lint` | Pass; `tsc --noEmit`. |
| `npm run build` | Pass; exact production build created `dist/`. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |

The production build emitted 23,059 bytes of JavaScript (8,280 bytes gzip),
13,817 bytes of CSS (4,001 bytes gzip), and a 67,436-byte hero WebP. This is
well below the static-product budgets. No remote fonts are used.

## Live game and recovery evidence

The deterministic live daily run used seed `2026-09-02` and the rule “Use
exactly 9 tiles and pass the ring marker.” The published route
`B1–B2–C2–C3–C4–D4–E4–E5–E6` reached the real **Route complete** end panel,
moved focus to that panel, and displayed the same route code.

- Goal: connect the circle at Start to the diamond at Finish.
- Challenge: avoid blocked cells, use exactly nine tiles, and pass the ring.
- Non-winning condition: `B1–B2–B3–B4–B5–B6–C6–C5–C4` used all nine tiles
  without finishing. A further move to `C3` was rejected with “The tile limit
  is reached. Step back and try another route.” No win panel appeared.
- Recovery: Undo/backtracking remains available; **Restart puzzle** returned to
  one selected Start tile and hid the end panel.
- Persistence: a two-tile route remained two tiles after reload. Restarted
  route state remained reset after reload, while the daily completion marker
  correctly kept archive practice unlocked.
- Archive: the completion action opened seed `2026-09-01`; its published route
  also reached the end panel. Archive completion did not alter saved daily
  progress, and the next-archive action is available.
- Modes and inputs: daily, isolated demo, and archive practice all worked.
  Mouse clicks, pointer drag, touch, and keyboard Arrow/Enter controls completed
  routes. No configurable settings are advertised.

Invalid and boundary paths recovered in plain language. A non-adjacent sample
move said “Choose a square beside the end of your route.” A maximum-length
non-winning route rejected further placement as above. `?practice=1e309`
recovered to today's route without a page error. The full suite also verified
malformed saved paths, archive-gate boundary markers, Back navigation, and
390px touch targets.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed the live root: title, `lang=en`, one
  `h1`, one main landmark, image alternatives, named buttons, and zero normal
  load console errors.
- Live Playwright Axe checks on `/`, `/demo`, `/privacy`, `/terms`, and the
  designed HTTP-404 page found zero serious or critical violations.
- Every tested route has one `h1`, one `main`, and its own plain title.
- Keyboard-only navigation exposed the skip link first, moved focus to the
  main heading, reached the roving grid stop in eight more Tabs, showed a 3px
  yellow focus outline, completed the demo, and moved focus to the result.
- At 390px, all visible actions measured at least 44×44 CSS pixels and the
  page had zero horizontal overflow. A full touch run reached the end panel.
- Simulated 200% text size retained all content, controls, and zero horizontal
  overflow at 390px.
- With `prefers-reduced-motion: reduce`, cell transitions and completion
  animation durations computed to `0.01ms`; there is no looping or flashing
  motion.

## Privacy, network, headers, and offline behavior

The complete live daily-to-archive flow requested only
`https://route-of-the-day.sociobot.in`: the document, hashed JS/CSS, and the
product image. There were no analytics, third-party scripts, remote fonts,
API calls, console exceptions, or page errors. Demo play wrote only
`demo:path:v1:sample-map-7` to `sessionStorage`; a daily `localStorage`
sentinel remained unchanged, and **Start for real** removed the demo key.

Live HTML responses include CSP with response-header `frame-ancestors 'none'`,
HSTS, `nosniff`, strict-origin referrer policy, and disabled camera, microphone,
and geolocation. HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS
use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`. Conditional
requests for HTML and JS returned 304. All same-origin links and metadata
assets returned 200, while `/definitely-missing` returned the designed HTTP 404.

The service worker registered and activated at the product origin, an explicit
`registration.update()` completed, and `/demo` reloaded offline with the game
and its four sample tiles intact. The app has no manifest and is not marketed
as an installable PWA.

This is a static game with no server-side product endpoint, account, payment,
or sign-in flow. API rate-limit, persistence-concurrency, health endpoint, and
Entra External ID checks therefore do not apply.

## Performance and deployment identity

Fresh Lighthouse 12.8.2 mobile results on the live root were Performance 92,
Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9s, LCP 1.0s,
CLS 0, Speed Index 0.9s, and transferred content 80 KiB. Lighthouse reported
no console errors.

The live deployment names `index-DB31DOGo.js` and `index-BeIPPYuh.css`.
SHA-256 comparisons against the clean candidate build matched byte for byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `8d70e7ec722361c795ad30fdf95979936a7f0f9949d095029c8db8634afa7ddc` |
| JavaScript | `67b60f71bc69f8f0285bc72008349c6dad2aefdae6a0824e58458ba76b8fe215` |
| CSS | `35ba14dcbbf92551ed4cfb01495f98d67688fa2d38c502daae0c37a7a49a4956` |
| `sw.js` | `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02` |
| `404.html` | `678b685bae61e3469f0d11cdf30632f9d3cc7969f4ad8f271e7a3ee3b22d1caa` |
| `favicon.svg` | `0bc45d7ac803fc134558f1b987e5fe9f84419769cc3bd6305a152bd34bef7395` |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
