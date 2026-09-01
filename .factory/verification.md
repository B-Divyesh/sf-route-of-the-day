# Independent product verification — FAIL

## Scope and decision

- Candidate: `f0bf543f612e6e08deedf7be893a4ee3e7ba1419`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 1 September 2026 UTC
- Work order: `route-of-the-day-verify-1`
- Decision: **FAIL**

The live game completes its core daily and archive flows, but the candidate does not meet the release contract. The default `npm test` gate fails a declared claim check, and public product claims are missing from `.factory/claims.json`. Medium-severity input, routing, and touch-target findings remain as well.

No product code or product infrastructure was changed during verification.

## Release-blocking findings

### High — QA-01: the default test gate fails the frame-rate claim

Confirmed that each of the eight exact commands in `.factory/claims.json` passes when run separately after `npm ci`. Confirmed separately that the live demo produced 61–62 `requestAnimationFrame` callbacks in each of five one-second samples.

Checked the required default gate twice:

```text
npm test
Expected: 11 passed
Run 1: 10 passed, 1 failed; frame-rate result 40, required >= 50
Run 2, with no concurrent commands: 10 passed, 1 failed; frame-rate result 34, required >= 50
```

Confirmed the diagnostic command `npm test -- --workers=1` passes all 11 checks. The repository enables `fullyParallel: true`, and the frame-rate check measures an idle browser callback count while another worker runs browser checks. It does not remain reliable under the repository's default command. The acceptance contract requires `npm test` to pass, so this is release-blocking even though the individual claim command and live sample pass.

### High — QA-02: the public claim inventory is incomplete

Confirmed that every registered claim has exactly one tagged check. Checked the live copy and README for additional statements a visitor may rely on. These statements are not represented by an exact claim entry and matching check:

- README: “A round takes about three to five minutes.” No session-duration check exists.
- Landing page: “Practice puzzles use published seeds and do not affect the daily route.” The suite opens archive practice, but does not confirm that archive actions leave the saved daily route unchanged.
- Privacy page: “The game stores your current route, completed daily seed, and settings in browser storage.” The product exposes and stores no setting.

The claims contract states that any unlisted public claim fails review. The privacy statement is also inconsistent with the implemented storage model.

## Other findings

### Medium — QA-03: several mobile actions are smaller than 44×44 CSS pixels

Checked all visible links and enabled buttons at 390×844. Examples include Daily at 35×44, Demo at 42×44, Start for real at 86×22, privacy and terms footer links at 25px high, and contact links at 17px high. The game cells and primary controls meet the target size. This does not meet the required 44×44 minimum for every touch action.

### Medium — QA-04: unknown routes return HTTP 200

Confirmed that `/definitely-missing` renders the designed in-app not-found view with the correct title and one `h1`. Checked the network response and received HTTP 200 rather than 404. The static `/404.html` file also returns 200. This does not provide the required real not-found response.

### Medium — QA-05: one invalid archive value leaves the app blank

Checked normal and boundary query values. `practice=abc`, `-1`, and `0` recover to the daily puzzle; large finite values still render a puzzle. Opening `/?practice=1e309` returns the HTML shell but produces `Invalid time value`, no game, no `h1`, and only the skip link. The page provides no recovery action.

### Medium — QA-06: Back does not restore the previous scroll position

Checked History API navigation from the landing-page footer to Privacy and then Back. The landing page was at `scrollY=2776` before navigation and returned at `scrollY=140`. Heading focus is restored correctly, but the previous scroll position is not.

## Claim checks

All commands below were run exactly as listed after `npm ci` and through the repository's configured demo-capable entry point.

| Claim | Individual result | Evidence |
| --- | --- | --- |
| `demo-ready` | Pass | `/demo` opens with four selected tiles; reset returns to four; demo session keys remain separate from local progress. |
| `daily-seed` | Pass | Two fresh contexts show seed `2026-09-01` and identical published solutions. |
| `local-progress` | Pass | A placed tile survives reload; observed request origin is only the product origin. |
| `complete-run` | Pass | The published route reaches “Route complete,” opens archive practice, and restart returns to one selected tile. |
| `multi-input` | Pass | Keyboard and 390px touch runs each reach the end screen. |
| `frame-rate` | Pass alone; fail in default suite | Individual command passes; default `npm test` measures 40 and 34 against the required 50. |
| `free-access` | Pass | The live playable grid has no account, purchase, subscription, or payment step. |
| `offline-play` | Pass | The loaded demo accepts the next route tile offline. |

## First-read and visual checks

Confirmed on a cold 1440×900 load that the first screen answers all three required questions:

- What: “Draw today’s route in five minutes.”
- For whom: daily-puzzle players seeking a short spatial challenge without words, scores, or an account.
- First action: “Try it with sample data,” followed by “Opens a half-finished sample puzzle.”

Confirmed that the game itself is present in the first desktop screen. At 390×844, the first screen shows the headline, audience, demo action, facts, and the top of the live game panel; the panel begins at 626px. The grid begins at 860px, just below the first viewport. Screenshots are in `.factory/verification-evidence/live-first-read-desktop.png` and `live-first-read-mobile-390.png`.

Confirmed that `/demo` is one click away, uses seed `sample-map-7`, starts with four selected route tiles, shows the persistent demo banner, resets, and clears demo session keys when Start for real is selected.

Checked the generated route artwork. It is product-specific, contains no text or brand marks, matches the documented map palette, and is 67,436 bytes.

## Game-flow checks

Confirmed a deterministic live run from the title screen to active play and the real end screen:

- Daily seed: `2026-09-01`
- Goal: Connect Start to Finish
- Challenge: use exactly 10 tiles and make 5 turns around 9 blocked tiles
- Non-winning state: an alternate 10-tile path reaches Finish but shows “You reached Finish, but the route does not meet today’s rule.” No end screen appears.
- Recovery: Undo reports “Removed the last tile.” Restart returns to one selected Start tile.
- Winning state: the published solution reaches “Route complete,” focuses the completion panel, and displays the route code.
- Archive: completion opens `practice=1` with seed `2026-08-31`; completing it opens `practice=2` with seed `2026-08-30`. The mode is marked not scored.
- Persistence: a two-tile daily route remains two tiles after reload; daily completion and route paths use `route:` local-storage keys.
- Storage unavailable: play continues and the status explains that the route cannot be saved after reload.
- Inputs: pointer, keyboard, and 390px touch runs work. The keyboard completion moves focus to the end panel and Tab proceeds to Play this route again.

The puzzle has a clear goal, challenge, rejected non-winning state, completion state, recovery, restart, and archive loop. No account or sign-in is present. No server endpoint or product-unlock request exists, so request-allowance and sign-in-provider checks do not apply.

## Accessibility and responsive checks

Confirmed with the factory URL checker: HTTP 200, title, `lang=en`, one `h1`, one main landmark, alt text, named buttons, and no console errors.

Checked Axe on `/`, `/demo`, `/privacy`, `/terms`, and the in-app not-found route: zero serious or critical findings. Checked the same at 390px on the landing page: zero serious or critical findings and no horizontal overflow.

Confirmed keyboard-only use: the first Tab reveals Skip to the puzzle with a 3px yellow focus ring; Enter moves focus to the landing `h1`; the grid uses one roving tab stop; Arrow keys plus Enter complete the demo; the completion panel receives focus. No keyboard trap was observed.

Confirmed reduced-motion handling: cell transitions change from 180ms to 0.01ms and completion animation changes from 500ms to 0.01ms. No looping or flashing animation was observed. The touch-target exception is QA-03.

## Privacy, requests, and headers

Confirmed that complete cold-load and play flows request only `https://route-of-the-day.sociobot.in`. No analytics, remote fonts, third-party scripts, accounts, ads, or payment calls were observed. Demo state uses `demo:` session storage; daily and archive state use `route:` local storage.

Checked the live HTML response headers:

- CSP limits scripts, styles, images, connections, and workers to the declared sources and sets `frame-ancestors 'none'` as a response header.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- HSTS is present.

Checked caching: HTML uses `public, must-revalidate, max-age=30`; hashed JavaScript and CSS use one-year immutable caching; `sw.js` uses `no-cache`.

## Service worker and offline checks

Confirmed a fresh service-worker registration reaches the activated state, controls the page, and uses cache `route-of-the-day-v1`. Confirmed `registration.update()` completes without a waiting worker. After loading `/demo`, switching the context offline and reloading retains the demo title, `h1`, game, four sample tiles, and permits a fifth tile. No console or page errors were observed.

## Performance and build checks

Confirmed the exact production build succeeds and writes `dist/`:

```text
JavaScript: 21.35 KB raw, 7.73 KB gzip
CSS: 13.75 KB raw, 3.99 KB gzip
Hero WebP: 67.44 KB
Fonts: 0 KB
```

These assets are within the stated budgets. A direct interaction timing sample on a demo tile measured 16ms. Five live one-second callback samples measured 62, 61, 61, 61, and 61.

Lighthouse 12.8.2 mobile results from the live URL:

| Category or metric | Result |
| --- | ---: |
| Performance | 94 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.9s |
| LCP | 1.1s |
| Total blocking time | 280ms |
| CLS | 0 |

The Lighthouse JSON is `.factory/verification-evidence/live-lighthouse.json`.

## Candidate and deployment identity

Confirmed the tested checkout was the requested candidate before documentation changes. Rebuilt locally and compared remote bytes with `dist/`. The deployed HTML, hashed JavaScript, hashed CSS, hero and social artwork, service worker, icons, robots file, and sitemap all match the candidate output.

Representative SHA-256 matches:

- `index.html`: `ac8df729795cd50d52cc018dd94c19384e37ef2a826bc47116f8527050708243`
- `index-Cbun291t.js`: `0e962215dacaa42770b6cc00b41029fd2af86bc815841eebbdb1e4fa2aa5dea0`
- `index-7lr2-Zy9.css`: `181494d5220f53e339b01511f783ae5bb0261874732a9fbe663d1e9a0204e252`

## Local command results

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 reported issues. |
| Eight exact claim commands | Pass individually. |
| `npm test` | **Fail** twice; frame-rate claim measured 40 and 34, required 50. |
| `npm test -- --workers=1` | Pass; 11/11. Diagnostic only; not the required default command. |
| `npx tsc --noEmit` | Pass. |
| `npm run build` | Pass. |
| `npm audit --audit-level=high` | Pass; 0 reported issues. |
| Lint | No lint command is available in `package.json`. |

## Release recommendation

Do not accept this candidate. Make the default frame-rate claim check stable and representative, register or remove every public claim, correct the settings statement, then resolve the medium findings and rerun the complete verification from a clean checkout.
