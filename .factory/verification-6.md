# Independent product verification 6 — FAIL

## Scope and decision

- Candidate: `6d7ea3f18c6a93d9b0123a3e149cb412f19e063a`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-6`
- Decision: **FAIL**

The playable product works end to end, but the candidate does not meet the supplied acceptance contract. Two public claims lack valid claim coverage, and the archive stops advancing at its upper boundary despite the brief requiring unlimited archive play. These are release-blocking even though all declared commands are green.

No product code, deployment, infrastructure, DNS, billing, secrets, or unrelated resources were changed. Only verifier reports and evidence were added.

## Release-blocking findings

### F-6-1 — High: the 3–5 minute claim test does not measure a round

README states: “A round is designed to take three to five minutes.” The `round-duration` command passes, but its implementation calls `estimatedRoundSeconds()`, which returns `puzzle.solution.length * 20`, and asserts that invented estimate is 180–300 seconds. It does not time a representative solve, use recorded playtest data, or observe elapsed gameplay. This circular evidence does not satisfy the claims contract for a quantitative claim.

Required resolution: remove the quantitative duration claim, or replace the test with reproducible playtest evidence that measures representative complete runs with a documented margin.

### F-6-2 — High: “non-scored archive practice” is an unlisted claim

The landing page shows “Archive practice · not scored,” and README says completion opens “non-scored archive practice.” No entry in `.factory/claims.json` names that promise, and no `@claim:*` test asserts that archive mode has no score or score persistence. `privacy-surface` checks rankings and prohibited controls, while `practice-progress` checks date and daily-state isolation; neither is the required exact test for this public claim.

The supplied claims contract says an unlisted claim fails review. Required resolution: add one exact claim entry and observable test for non-scored archive behavior, or remove the wording.

### F-6-3 — Medium: archive advancement repeats at the supported boundary

With today’s completion marker set, `/?practice=36500` opens `1926-09-27`. Completing it and selecting **Play next archive route** changes the URL to `?practice=36501`, but the visible puzzle date remains `1926-09-27`. `practiceIndex()` clamps every larger value to 36,500 while the next-link calculation continues to produce 36,501, so the action repeats the same route forever.

This conflicts with the brief’s “unlimited non-scored archived seeds” requirement. Make next advance to a distinct deterministic route at the supported boundary, or document and correctly terminate a finite archive.

## Non-blocking findings

### F-6-4 — Medium: nested complementary landmark

Axe Core 4.11 reports one moderate `landmark-complementary-is-top-level` violation on `/`, `/?demo=1`, and `/demo`: `<aside class="route-panel" aria-label="Route status">` is nested inside the labelled game `<section>`, which is itself a landmark. Privacy, terms, and 404 routes have no Axe violations. There are zero standard Axe serious or critical violations.

### F-6-5 — Low: experimental accessible-name diagnostics need cleanup

Lighthouse 13 flags `label-content-name-mismatch` for the selected Start cell because its visible route-order glyph is absent from the accessible name. Axe also marks the date stamp’s `aria-label` on a generic `div` as an incomplete/manual-review item because that attribute is not consistently supported without a role. These did not block keyboard or screen-reader-oriented use in this run, but should be cleaned up.

## Mandatory claims gate

The first literal invocation from the dependency-free clone could not import `@playwright/test`. After the required lockfile install with `npm ci`, every exact command in `.factory/claims.json` was run separately through the local demo/product entry point.

| Claim | Command result | Acceptance result |
| --- | --- | --- |
| `demo-ready` | Pass | Pass |
| `daily-date` | Pass | Pass |
| `round-duration` | Pass | **Fail — F-6-1** |
| `local-progress` | Pass | Pass |
| `complete-run` | Pass | Pass |
| `archive-gate` | Pass | Pass |
| `practice-progress` | Pass | Pass |
| `multi-input` | Pass | Pass |
| `pointer-input` | Pass | Pass |
| `reproducible-solution` | Pass | Pass |
| `date-route-code` | Pass | Pass |
| `frame-rate` | Pass | Pass; independently measured live |
| `free-access` | Pass | Pass |
| `privacy-surface` | Pass | Pass for its wording; see F-6-2 |
| `tile-limit` | Pass | Pass |
| `route-undo` | Pass | Pass |
| `offline-play` | Pass | Pass |

Each listed claim ID has exactly one matching test tag. The complete unfiltered suite passed 26/26.

## First-read test

The mandatory cold first screen passes at 1440×900 and 390×844.

- What: “Draw today’s spatial route,” followed by the visible “Connect Start to Finish” puzzle.
- For whom: “For daily-puzzle players who want a short route challenge without words or an account.”
- First action: **Try it with sample data**, next to “Opens a half-finished sample puzzle.”

The game starts at 159 CSS px on desktop and 583 CSS px on the 844 px-high mobile viewport. Both captures show playable board content rather than a menu wall. The action enters `?demo=1` in one click, displays the persistent demo banner, and opens with four tiles selected.

Evidence: `evidence/verify-6-first-desktop.png`, `evidence/verify-6-first-mobile.png`, and the URL-checker captures under `evidence/verify-6-root/` and `evidence/verify-6-demo/`.

## Deterministic live game run

- Daily date: `2026-09-02`; goal: connect Start to Finish using exactly nine tiles and the ring marker.
- Invalid input: a non-adjacent square produced “Choose a square beside the end of your route.”
- Persistence: one valid move survived reload with two selected cells.
- Failure: a deterministic nine-tile non-winning path exhausted the budget; the next open square produced “The tile limit is reached. Step back and try another route.”
- Recovery: Undo reduced the route from nine to eight cells; Restart returned it to Start.
- Keyboard win: Arrow keys plus Enter completed `B1–B2–C2–C3–C4–D4–E4–E5–E6`. The real **Route complete** panel became visible and received focus.
- End screen: it showed the nine-tile result, route code, **Play this route again**, and **Play an archive route**.
- Archive: the action opened practice mode on `2026-09-01`; access persisted after daily restart and reload.
- Other inputs: Space placed a tile, Backspace removed it, a pointer-drag run completed, a mouse-click demo completed, and a 390 px touch run completed.
- Storage failure: play remained usable and announced that the browser could not save after reload.
- Invalid input boundary: `?practice=1e309` safely showed the daily puzzle without a page error.

Evidence: `evidence/verify-6-loss.png`, `evidence/verify-6-end-panel.png`, and `evidence/verify-6-end-screen.png`.

No sound or settings are advertised, so mute/settings persistence is not applicable. This turn-based puzzle has no continuous simulation, so tab-pause and fixed-timestep requirements are not applicable.

## Demo isolation and privacy

- The sample opened in one click with four selected tiles, advanced, reset to four, completed by mouse, and exited with **Start for real**.
- Demo writes used only the `demo:` session-storage namespace; daily local storage stayed unchanged; exiting cleared demo keys.
- The observed flow made four requests: document, hashed JavaScript, hashed CSS, and hero WebP. Every request was a same-origin GET with no body.
- There were no analytics, ads, third-party scripts, remote fonts, account, sign-in, payment, product-unlock, or data API calls.

This is a static product with no server-side endpoints. API allowance/429, backend concurrency, server persistence, health endpoint, and Entra authority checks do not apply.

## Accessibility, keyboard, responsive behavior, and motion

- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real 404 each have `lang=en`, a route-specific title, one `h1`, one `main`, and no missing image alternatives.
- Standard Axe Core 4.11 found zero serious/critical violations; see F-6-4 and F-6-5 for lesser/manual findings.
- The first Tab exposes the skip link; activation moves focus to the page `h1`.
- The primary action has a 3 px yellow focus outline plus a 6 px focus shadow. The grid uses roving focus and the keyboard run had no trap.
- At 390 px there is no horizontal overflow, and every visible enabled link/button is at least 44×44 CSS px.
- A 200% root text-size check at 390 px retained the heading and game without horizontal overflow.
- Under `prefers-reduced-motion: reduce`, transition duration is `0.01ms` and iteration count is one. No flashing, looping motion, autoplay, or audio was observed.
- Manual palette checks ranged from 4.84:1 to 14.03:1 for the principal foreground/background pairs.

Normal 200 responses produced no console or page errors. The intentionally missing URL produced only Chromium’s expected failed-document 404 notice.

## Service worker, headers, caching, and routes

The service worker registered and controlled the origin. `registration.update()` completed with `/sw.js` active and no waiting worker. After loading `/demo`, a full offline reload restored the four-tile sample, which remained playable.

- `/`: HTTP 200, `text/html`, `public, must-revalidate, max-age=30`.
- Hashed JS/CSS: HTTP 200, `public, max-age=31536000, immutable`.
- `/sw.js`: HTTP 200, `no-cache`.
- Missing route: HTTP 404 with the designed 404 document.
- Conditional HTML and JavaScript requests returned 304; HTTP redirected to HTTPS with 301.
- Headers include HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive Permissions Policy. CSP sends `frame-ancestors 'none'` as a response header.
- Every discovered same-origin link returned 200 except the intentionally missing route, which returned 404.

## Performance and bundle budgets

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 23.12 kB | 8.27 kB |
| CSS | 13.82 kB | 3.99 kB |
| Hero WebP | 67.44 kB | n/a |
| Fonts | 0 kB | 0 kB |

A cache-disabled cold browser transferred 8.32 kB encoded JS, 4.06 kB encoded CSS, and 67.44 kB hero imagery. All budgets pass.

Fresh Lighthouse 13.0.1 mobile results: Performance 91, Accessibility 100, Best Practices 100, SEO 100; FCP 907 ms, LCP 1,043 ms, CLS 0, Speed Index 907 ms, and TBT 386 ms. An actual 4×-CPU-throttled touch interaction measured 72 ms presentation duration and 50.1 ms input delay.

An independent 390×844 run under 4× CPU throttling performed 65 route updates in 1,111.2 ms: **58.50 fps**, above the advertised 50 fps threshold. Evidence: `evidence/verify-6-lighthouse.json`.

## Candidate and deployment identity

The checkout and `origin/main` were both at the requested commit. A fresh `dist/` build was compared byte-for-byte with live HTML, JavaScript, CSS, service worker, 404 page, favicon, touch icon, hero, social image, robots, and sitemap.

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `1b6e2c87dbd1194bad14afb4d15a93a8ca9216341a093ae6a25cfc9381f41bca` |
| `assets/index-8wwUTWM5.js` | `0a040dc3992d1632023f4872b894b674b89783a9ac49086289d4d25fa65cd964` |
| `assets/index-CcwtFS4k.css` | `e28d8235be842fb3789884506ae5f5f856f3c8b56ac419c262a8eca46d1df4ce` |
| `sw.js` | `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02` |
| `404.html` | `d389d90ca3493ae01fcae920f5d4089f1ccc6a30131fdd1f4cc348196c93b9d5` |

## Local command results

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 vulnerabilities. |
| 17 exact claim commands | All command executions passed after install. |
| `npm test` | Pass; 26/26. |
| `npm run lint` | Pass. |
| `npm run build` | Pass; created `dist/`. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |
| `/opt/fleet/lib/verify-url.sh` on root and demo | Pass. |

## Defects by severity

- Critical: none.
- High: F-6-1 invalid quantitative claim proof; F-6-2 unlisted non-scored claim.
- Medium: F-6-3 archive boundary repeats; F-6-4 nested complementary landmark.
- Low: F-6-5 experimental accessible-name diagnostics.

## Release recommendation

Do not release candidate `6d7ea3f18c6a93d9b0123a3e149cb412f19e063a` until F-6-1 and F-6-2 are resolved and F-6-3 is fixed or the archive scope is honestly bounded. Re-run every claim command, the full suite, the archive boundary, and accessibility checks after repair.
