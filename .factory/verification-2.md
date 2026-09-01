# Independent product verification 2 — FAIL

## Scope and decision

- Candidate: `8508a5e3b8e2048b09f21b45ca2216616318681c`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 1 September 2026 UTC
- Work order: `route-of-the-day-verify-2`
- Decision: **FAIL**

The candidate builds, deploys, and completes its daily route correctly. All ten
declared claim commands and the default 17-test gate pass after the clean
lockfile install. The live artifact matches the candidate byte for byte.

It is not releasable under the brief, however. Archive practice is playable in
a fresh browser before the daily route is finished, and a stale completion from
an earlier day also unlocks today's archive. This contradicts both the smallest
useful product in the researched brief and the game's visible lock message.
The required claims inventory does not test that promise.

No product code or infrastructure was changed during this verification.

## Findings

### High — QA2-01: archive practice is not gated by today's completion

The brief says archive seeds unlock after daily completion. The live landing
page also says, “Finish today’s route to open practice mode.” The product hides
the archive link in a fresh browser, but it does not enforce the rule.

Fresh live evidence:

- Opened `https://route-of-the-day.sociobot.in/?practice=1` in a new browser
  context with empty storage.
- The page immediately rendered “Draw an archive route,” seed `2026-08-31`,
  and “Archive practice · not scored.” The puzzle was playable.
- The same page still rendered “Finish today’s route to open practice mode”
  lower down, contradicting the active archive puzzle above it.
- Seeded `route:daily-complete:v1` with yesterday's value, `2026-08-31`, then
  opened `/`. The “Open practice routes” action was visible before completing
  seed `2026-09-01`.

The fresh-storage bypass capture is
`.factory/evidence/archive-gate-bypass.png`.

The implementation treats any non-empty completion marker as current and
accepts a positive `practice` query independently of completion. This bypasses
the intended daily-first loop and the advertised archive unlock.

### High — QA2-02: the archive-lock claim has no effective claim check

`.factory/claims.json` contains no claim that archive practice is unavailable
until today's route is complete. The closest claim, `complete-run`, proves only
that an archive action appears after a win; it never attempts archive access
before a win or with a stale marker.

The `practice-progress` claim also states that practice puzzles “use published
seeds,” but its tagged check only compares daily local-storage values before
and after archive play. It does not assert the archive seed or UTC date.

The public lock statement is therefore both unprotected and false in the live
product. Under the attached claims contract, an unlisted public claim is a
release-blocking finding.

### Medium — QA2-03: structurally invalid saved routes are not rejected

Invalid JSON and an empty saved array recover to the Start tile. Syntactically
valid but impossible arrays do not:

- A saved path containing Start followed by `{row:99,col:99}` displayed one
  selected cell but “8” tiles left, and the board had no `tabindex="0"` cell.
- An 11-position path displayed 11 selected cells and `-1` tiles left for a
  ten-tile puzzle.

No page exception occurs, but the visible state becomes inconsistent and the
keyboard's roving grid stop can disappear. Saved paths should be validated for
bounds, adjacency, blocks, revisits, and tile count before restoration.

### Low — QA2-04: Reset demo drops keyboard focus

Activating **Reset demo** with Enter resets the sample, but replaces the
focused button and leaves `document.activeElement` on `<body>`. The attempted
focus target is the status paragraph, which is not focusable. One further Tab
returns to Reset demo, so this is not a trap, but the reset result is not given
stable keyboard focus.

## Mandatory claims gate

The first pre-install invocation from the clean checkout could not load
`@playwright/test`, as expected before dependencies exist. After `npm ci`, all
ten exact commands in `.factory/claims.json` were run separately and passed:

| Claim | Result | Observed assertion |
| --- | --- | --- |
| `demo-ready` | Pass | Four sample tiles, isolated reset, demo-prefixed session key. |
| `daily-seed` | Pass | Two fresh contexts use the UTC date and identical solution. |
| `round-duration` | Pass | Generated routes satisfy the declared 180–300 second design estimate. |
| `local-progress` | Pass | A move survives reload; request origins remain same-origin. |
| `complete-run` | Pass | Daily solution reaches the end panel, archive action appears, restart clears the route. |
| `practice-progress` | Pass, incomplete coverage | Archive actions leave the stored daily route and marker unchanged; see QA2-02. |
| `multi-input` | Pass | Keyboard and 390px touch runs reach completion. |
| `frame-rate` | Pass | Test-browser callback count is at least 50 fps. |
| `free-access` | Pass | The grid is playable without account or payment UI. |
| `offline-play` | Pass | The loaded demo accepts another tile offline. |

The unmodified default command also passes: `npm test` reported 17/17 with one
worker. Passing the registered commands does not cure QA2-01 or QA2-02.

## First-read test

The mandatory cold first screen passes at desktop and 390px:

- What: “Draw today’s route.”
- For whom: daily-puzzle players seeking a short spatial challenge without
  words, scores, or an account.
- First action: “Try it with sample data,” followed by “Opens a half-finished
  sample puzzle.”

The live game panel is in the first desktop viewport. At 390×844 the panel,
goal, rule, and top of the grid are in the first viewport, so the capture shows
the game rather than a menu wall. The demo is one click away and immediately
contains a half-finished puzzle. Evidence:
`.factory/evidence/first-screen-desktop.png` and
`.factory/evidence/first-screen-mobile.png`.

## Deterministic game run

Played a fresh live run from the title through failure, reset, win, reload, and
archive completion:

- Daily seed: `2026-09-01`.
- Goal: connect Start to Finish.
- Rule: exactly 10 tiles and 5 turns.
- Loss: a ten-tile non-finishing route produced “The tile limit is reached.
  Step back and try another route.” No completion panel appeared.
- Restart: returned to one selected Start tile and persisted that reset.
- Win: route `F6–E6–D6–D5–D4–C4–B4–B3–A3–A2` reached the real “Route
  complete” end panel, which received focus.
- Persistence: the ten-tile win and completion marker survived reload.
- Archive: the normal post-win action opened seed `2026-08-31`, labelled it
  “not scored,” completed it in nine tiles, and offered `practice=2` while
  keeping the daily marker unchanged.
- Inputs: pointer click, pointer drag, keyboard Arrow/Space, and 390px touch
  runs all completed live puzzles.
- Modes: daily, isolated demo, and archive practice all function. No user
  setting is advertised; reduced motion follows the operating-system setting.

Screenshots are `.factory/evidence/live-loss-state.png` and
`.factory/evidence/live-end-screen.png`.

The one-click demo uses seed `sample-map-7`, starts with four selected tiles,
writes only `demo:path:v1:sample-map-7` in session storage, resets to four, and
clears demo session data on **Start for real**. A daily local-storage sentinel
remained untouched throughout.

## Invalid input and recovery

- Non-adjacent selection is rejected with “Choose a square beside the end of
  your route.”
- Exhausting the tile limit produces the loss/recovery message above.
- Restart and Undo recover without a reload.
- `practice=abc`, `practice=1e309`, zero, and negative values recover to the
  daily route without a page error.
- `practice=999999` is bounded to the documented 100-year window and renders
  seed `1926-09-26`.
- If browser storage throws, play continues and reports that the route cannot
  be saved after reload.
- Saved-route corruption has the exception in QA2-03.

## Accessibility, keyboard, and responsive behavior

The factory URL checker passes with HTTP 200, `lang=en`, title, one `h1`, one
main landmark, complete image alt text, named buttons, and zero console errors.

Playwright Axe found zero serious or critical findings on `/`, `/demo`,
`/privacy`, `/terms`, and the real 404 at both 1440px and 390px. Each route has
one `h1`, one `main`, correct title, no horizontal overflow, and no unnamed
buttons. The 390px target check found every visible link and enabled button at
least 44×44 CSS pixels.

The first Tab reveals the skip link with a 3px yellow outline; Enter moves
focus to the page heading. Keyboard play reaches completion, and the end panel
receives focus. There is no trap. Reduced-motion emulation changes cell
transitions and completion animation from their normal durations to `0.01ms`
and changes smooth scrolling to `auto`. QA2-03 and QA2-04 are the remaining
keyboard-recovery issues.

## Privacy, requests, and headers

Captured the outgoing request log during live load, service-worker update,
reload, offline reload, and play. Every request was a same-origin GET for the
document, hashed JavaScript, or hashed CSS. There were no POSTs, analytics,
remote fonts, third-party scripts, account calls, payment calls, or product
unlock calls. Progress stayed in browser storage.

The live HTML response includes:

- `Content-Security-Policy` with same-origin scripts/styles/connections and
  `frame-ancestors 'none'` as a response header.
- `Strict-Transport-Security`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year
immutable caching; `sw.js` uses `no-cache`. This static product has no
server-side or unlock endpoint, so 429/`Retry-After` testing is not applicable.
It has no sign-in, so identity-provider testing is not applicable.

## Service worker and offline reload

In a fresh context, the service worker installed and activated, `update()`
completed with no waiting worker, and a subsequent navigation was controlled.
Cache `route-of-the-day-v1` contained the four HTML routes, artwork, icon,
hashed JavaScript, and CSS. After switching the context offline, `/demo`
reloaded with HTTP 200, retained four sample tiles, and accepted a fifth. No
console or page errors occurred.

## Performance and production build

`npm run build` succeeds and creates `dist/`:

| Asset | Raw | Gzip where reported |
| --- | ---: | ---: |
| JavaScript | 21.82 KB | 7.92 KB |
| CSS | 13.82 KB | 3.99 KB |
| Route artwork | 67.44 KB | — |
| Fonts | 0 KB | — |

All initial static budgets pass. The valid Lighthouse 12.8.2 mobile run is
`.factory/evidence/lighthouse-mobile-2.json`:

| Metric | Result |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.88s |
| LCP | 1.03s |
| Total blocking time | 193ms |
| CLS | 0 |

Five live samples while route tiles changed at 390px with 4× CPU throttling
measured 62, 61, 61, 61, and 61 frames per second. This independently confirms
the ≥50 fps claim under active interaction.

## Deployment identity and routing

The live HTML names `index-DbmMMeJA.js` and `index-BeIPPYuh.css`. Rebuilt local
and live SHA-256 values match exactly:

- `index.html`: `89c7cace1d63f90fd42bf580e8c913d669293ec84b52ad16cd118c2c8753b6a5`
- JavaScript: `6f6175edd18008b744760f137e4e951fad40433d5d386627beb18c89408a3f30`
- CSS: `35ba14dcbbf92551ed4cfb01495f98d67688fa2d38c502daae0c37a7a49a4956`
- Service worker: `051bc263c295b3406f05a6a5e9cbd7886eccc417c747e1e12bf72d28fb7b21d5`
- 404 page: `dad571a5852417760b7117cd175224c0b5d2f0eefe4b8d9213091b773ec323fe`

`/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns the
designed 404 with HTTP 404. Robots, sitemap, canonical/OG metadata, social
image, and all discovered internal links return successfully. The linked Param
Factory site also returns 200; mail links are explicit.

## Local command results

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 vulnerabilities. |
| Ten exact claim commands | Pass individually after install. |
| `npm run lint` | Pass (`tsc --noEmit`). |
| `npm test` | Pass, 17/17, one worker. |
| `npm run build` | Pass; production `dist/` created. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |
| Factory `verify-url.sh` | Pass. |
| Live Axe integration | Pass; zero serious/critical findings. |

## Release recommendation

Do not accept this candidate. Enforce the archive gate against the current UTC
daily seed, including direct URLs and stale markers; add exact claim coverage
for locked, current, and stale states and for archive seed publication. Then
validate restored paths and preserve keyboard focus on demo reset before a new
independent verification.
