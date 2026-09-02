# Independent product verification 5 — PASS

## Scope and decision

- Candidate: `bbd6b86ec72d47010b5b8e49dc7599c8e956fa17`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-5`
- Decision: **PASS**

The candidate satisfies the researched browser-game contract. The live first screen explains the game and audience, provides a one-click isolated sample, and shows the playable puzzle rather than a menu wall. A deterministic daily run reaches an explicit loss state, recovers, reaches the real completion panel, persists, restarts, and completes archive practice. All declared claim checks, the full repository gate, accessibility checks, privacy checks, performance budgets, offline behavior, and deployment identity checks pass.

No product code, deployment, infrastructure, DNS, billing, secrets, or external product resources were changed during this verification. Only this report, the handoff, and verifier evidence were added.

## Mandatory claims gate

The literal first invocation before dependencies existed could not import `@playwright/test`. After the required clean lockfile install (`npm ci`), all 14 exact commands from `.factory/claims.json` were run separately through the product entry point and passed. This was followed by the unfiltered suite, which passed 23/23.

| Claim | Result | Fresh evidence |
| --- | --- | --- |
| `demo-ready` | Pass | The sample opened with four tiles, advanced to five, reset to four, retained reset-button focus, preserved daily storage, and cleared demo storage on exit. |
| `daily-seed` | Pass | Two clean contexts received the same UTC seed and solution. |
| `round-duration` | Pass | Representative generated routes satisfied the documented 180–300 second design estimate. |
| `local-progress` | Pass | A move survived reload and all observed requests stayed same-origin. |
| `complete-run` | Pass | Daily play reached the end panel, exposed archive play, restarted, and retained the daily completion marker. |
| `archive-gate` | Pass | Empty and stale markers were rejected; only the exact current UTC marker opened practice. |
| `practice-progress` | Pass | Practice used the prior published UTC seed and did not change the saved daily path or marker. |
| `multi-input` | Pass | Keyboard and 390 px touch runs both reached completion. |
| `pointer-input` | Pass | Mouse input completed the published sample route; an independent pointer-drag run also completed. |
| `reproducible-solution` | Pass | One hundred published-date puzzles completed with their known routes. |
| `seed-route-code` | Pass | The seed was visible before play and the expected coordinate route code appeared after completion. |
| `frame-rate` | Pass | The declared test exceeded 50 fps; five live samples measured 60–61 fps. |
| `free-access` | Pass | The live puzzle was playable without an account, purchase, subscription, or payment step. |
| `offline-play` | Pass | The loaded demo accepted another tile while its browser context was offline. |

The landing page, privacy copy, and README were cross-checked against the manifest. Material promises are represented by the declared claims; source and request inspection also confirmed the negative privacy statements. There are no analytics, ads, remote fonts, account calls, payment calls, or third-party runtime scripts.

## First-read test

The mandatory cold first screen passes at 1440×900 and 390×844:

- What: “Draw today’s spatial route” and the visible “Connect Start to Finish” game panel.
- For whom: “For daily-puzzle players who want a short route challenge without words or an account.”
- First action: **Try it with sample data**, immediately explained by “Opens a half-finished sample puzzle.”

The desktop viewport contains the complete active board. The 390 px viewport contains the job, audience, sample action, three facts, puzzle goal, rule, and top of the board. The product is visible before scrolling and is not a menu wall. The action opens a realistic half-finished puzzle in one click. Evidence: `evidence/live-first-read-desktop.png` and `evidence/verify-5-first-mobile.png`.

## Deterministic live game run

A fresh live browser was played from the title screen through active play, loss, restart, win, reload, and archive completion:

- Daily seed: `2026-09-02`.
- Goal: connect Start to Finish.
- Rule: use exactly nine tiles and pass the ring marker.
- Invalid input: a non-adjacent square was rejected with “Choose a square beside the end of your route.”
- Loss: an open nine-tile route that did not reach Finish exhausted the budget; the next valid step produced “The tile limit is reached. Step back and try another route.” The completion panel remained hidden.
- Recovery: **Restart puzzle** returned to one selected Start tile and persisted that reset after reload.
- Win: `B1–B2–C2–C3–C4–D4–E4–E5–E6` opened the real **Route complete** panel and moved keyboard focus to it.
- Persistence: the nine-tile win and the exact daily completion marker survived reload.
- Play again: **Play this route again** reset the board to Start while retaining archive access.
- Archive: seed `2026-09-01` completed, offered the next archive route, and left daily storage unchanged.

Independent keyboard-only, pointer-drag, and 390 px touch runs also reached the end panel. Demo reset, Undo, Backspace, and restart provide immediate recovery. Corrupt saved paths reset safely with one roving keyboard stop. An infinite practice query recovers to daily play. When browser storage throws, the game remains playable and says it cannot save after reload. No setting is advertised; daily progress and completion are the persistent product state.

Loss and completion captures are `evidence/verify-5-loss.png`, `evidence/verify-5-end.png`, and `evidence/verify-5-end-panel.png`. Structured results are in `evidence/verify-5-live.json`.

## Accessibility, keyboard, and responsive behavior

The factory URL checker passed cold on `/` and `/?demo=1`: valid title, `lang=en`, one `h1`, one main landmark, complete image alternatives, named buttons, and no application errors.

Fresh Axe checks covered `/`, `/?demo=1`, `/privacy`, `/terms`, and a real 404 at both 1440 px and 390 px. All ten combinations had zero serious or critical findings. Each had one `h1`, one main, a shared header and footer, ordered headings, no missing image alternatives, no horizontal overflow, and no visible action smaller than 44×44 CSS px. The missing route correctly returned HTTP 404; the browser's standard failed-document console notice was treated as the expected result of that status, not an application error.

Keyboard-only checks confirmed a visible 3 px focus outline on the first-tab skip link, skip activation to the `h1`, roving grid focus, Arrow/Space completion, completion-panel focus, demo-reset focus retention, and no trap. At 200% text size on a 390 px viewport, the heading and game remained visible without horizontal overflow.

Normal cells use 180 ms transitions and the completion panel uses a 500 ms animation. Under `prefers-reduced-motion: reduce`, both become `0.01ms`. No looping animation, flash, autoplay, or sound was observed. Game symbols and text make state color-independent.

## Privacy, network, headers, and caching

The request log covered cold load, daily loss/win/reload, archive completion, demo/reset/exit, every input run, accessibility routes, service-worker update, offline reload, and offline play. All 86 captured requests were same-origin GETs. There were no POSTs, cross-origin requests, analytics, remote fonts, ads, account calls, payment calls, unlock calls, or user-data transmissions. Daily state uses `route:` local-storage keys; the demo uses a separate `demo:` session-storage key and does not read or alter daily state.

Live HTML and route responses include CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions Policy. CSP limits scripts, connections, and workers to self and sends `frame-ancestors 'none'` as a response header. No CSP or application console errors occurred on normal routes.

HTML uses `public, must-revalidate, max-age=30`; hashed JavaScript and CSS use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`. Conditional HTML and JavaScript requests returned 304. HTTP redirects to HTTPS. All same-origin navigation and metadata links returned 200; `/definitely-missing` returned the designed 404.

This is a static game with no server-side, product-unlock, account, payment, or sign-in endpoint. API allowance/429, backend concurrency, server persistence, health identity, and Entra authority checks do not apply.

## Service worker and offline behavior

The production service worker registered at the product origin, activated, controlled the page, and completed an explicit update check. Cache `route-of-the-day-v2` was active. After loading `/demo`, a full offline reload restored the half-finished four-tile puzzle, and the fifth tile remained playable offline. The app does not advertise installability and has no web manifest.

## Performance and budgets

The production build emitted:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 23.04 kB | 8.25 kB |
| CSS | 13.82 kB | 3.99 kB |
| Hero WebP | 67.44 kB | n/a |
| Fonts | 0 kB | 0 kB |

Fresh Lighthouse 12.8.2 mobile results on the live root were Performance 99, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.1 s, Speed Index 0.9 s, total blocking time 110 ms, CLS 0, and transferred content 80 KiB. Lighthouse reported no console errors. Evidence: `evidence/verify-5-lighthouse.json`.

Five live one-second render samples measured 60, 61, 61, 61, and 61 fps. A separate 390×844 sample under 4× CPU throttling measured 60.46 fps over three seconds (`evidence/verify-5-mobile-fps.json`).

## Candidate and deployment identity

The clean checkout began at the requested candidate. A fresh `dist/` build was compared byte-for-byte with the live deployment. All checked artifacts matched: HTML, hashed JavaScript, hashed CSS, service worker, 404 page, favicon, touch icon, hero, social image, robots file, and sitemap.

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `27a432652fccf0bdfc38fc3dd6112d6d78f8fb636be1a7093bc976eb2f708e3a` |
| `assets/index-6-bRPO3P.js` | `f180d9a528e0557f5e182705ccc4ecb0ae80c1ceb41ed5a5b6708f5b15de3148` |
| `assets/index-BeIPPYuh.css` | `35ba14dcbbf92551ed4cfb01495f98d67688fa2d38c502daae0c37a7a49a4956` |
| `sw.js` | `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02` |
| `404.html` | `d389d90ca3493ae01fcae920f5d4089f1ccc6a30131fdd1f4cc348196c93b9d5` |

## Local command results

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 vulnerabilities. |
| 14 exact claim commands | Pass individually. |
| `npm test` | Pass; 23/23. |
| `npm run lint` | Pass; TypeScript emits no errors. |
| `npm run build` | Pass; exact production build created `dist/`. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |
| `/opt/fleet/lib/verify-url.sh` on root and demo | Pass. |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Release recommendation

Accept and release candidate `bbd6b86ec72d47010b5b8e49dc7599c8e956fa17`.
