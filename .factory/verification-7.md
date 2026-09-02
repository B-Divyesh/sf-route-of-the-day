# Independent product verification 7 — PASS

## Scope and decision

- Candidate and checkout: `d17cd0ba7b27352be9f09e55210b3dcbcb7642c6`
- Live URL: https://route-of-the-day.sociobot.in/
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-7`
- Decision: **PASS**

The deployed static browser game matches the candidate build and meets the researched brief and supplied acceptance contract. No product code, deployment, infrastructure, DNS, billing, secrets, or other products were changed by this verification.

## Mandatory claims gate

After `npm ci` from the clean checkout, I ran every exact command declared in `.factory/claims.json`, separately, through the product/demo entry point. All 17 passed:

`demo-ready`, `daily-date`, `local-progress`, `complete-run`, `archive-gate`, `practice-progress`, `archive-non-scored`, `multi-input`, `pointer-input`, `reproducible-solution`, `date-route-code`, `frame-rate`, `free-access`, `privacy-surface`, `tile-limit`, `route-undo`, and `offline-play`.

The unfiltered suite then passed **29/29**. Each declared claim has one matching `@claim:<id>` test tag. Public claims about archive scoring, privacy, offline play, daily determinism, inputs, restart, and frame rate are covered; the prior unmeasured duration promise is absent.

## First-read and live game run

Cold desktop and 390 px live loads pass the first-read requirement.

- What it does: “Draw today’s spatial route” and a visible “Connect Start to Finish” board.
- For whom: “For daily-puzzle players who want a short route challenge without words or an account.”
- First action: **Try it with sample data**, immediately followed by “Opens a half-finished sample puzzle.”

The live board is on the first screen, not behind a menu wall. The demo action is one click and opens the persistent isolated banner with four selected sample tiles. Captures: `evidence/verify-7-live-first-desktop.png`, `evidence/verify-7-live-first-mobile-390.png`.

I completed a deterministic live run for UTC date `2026-09-02`. The goal was to use exactly nine tiles, pass the ring marker, and reach Finish. The actual end panel appeared with route code `B1–B2–C2–C3–C4–D4–E4–E5–E6`, a replay action, and archive action; capture: `evidence/verify-7-live-end-screen.png`.

I also exercised an intentional loss: a legal non-winning nine-tile route rejected the next move with “The tile limit is reached. Step back and try another route.” Undo reduced it from 9 to 8 tiles, Restart reset it to 1, and a subsequent solution reached the real end screen. Daily completion persisted through reload and enabled non-scored archive practice. Archive practice used an earlier route and is visibly labelled “Archive practice · not scored.” The tested unbounded archive regression is included in the 29-test suite.

Keyboard Arrow+Enter completed a fresh demo route; a fresh 390 px touch run completed another. Pointer/mouse, Space, Backspace, valid/invalid moves, restore after reload, demo reset/exit, and archive isolation are covered by the exact claim runs.

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages, 0 vulnerabilities reported. |
| 17 exact claim commands | Pass. |
| `npm test` | Pass; 29/29. |
| `npm run lint` | Pass (`tsc --noEmit`). |
| `npm run build` | Pass; produces `dist/`. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |

Build sizes are 23.63 kB raw / 8.51 kB gzip JavaScript, 13.82 kB raw / 3.99 kB gzip CSS, and 67.44 kB hero WebP. These are within the static-product budgets.

## Privacy, routes, headers, and deployment identity

Fresh Playwright request logging for the normal game/demo flow observed only same-origin GET requests with no request body: document, hashed JavaScript, CSS, local WebP, and favicon. There were no account, payment, analytics, advertising, remote-font, third-party-script, or API requests. This is a static product with no server-side endpoint, so API 429 allowance, backend persistence/concurrency, and Entra sign-in checks do not apply.

Normal live flows had zero console errors and zero page errors. The expected document 404 was checked separately and is not counted as a console defect. `/`, `/demo`, `/privacy`, and `/terms` return 200 with correct route-specific titles and one `h1`; an unknown route returns the designed 404 document with HTTP 404.

The live root sends HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, and a response-header CSP including `frame-ancestors 'none'`. HTML caches for 30 seconds; hashed JS/CSS cache as `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`.

Fresh candidate `dist/` hashes match all served product artifacts: root HTML, hashed JS/CSS, service worker, 404, favicon, touch icon, hero/social images, robots, and sitemap. Key matches:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `03a1dac9f567b5fa216257c5a086dacad76a3c27871addd7a27f295bbdbd4ed8` |
| `assets/index-KZojNDwD.js` | `69a788c25ded28406619cd201a134b9ca35c5f7daf66bd284beed8c55214d272` |
| `assets/index-CcwtFS4k.css` | `e28d8235be842fb3789884506ae5f5f856f3c8b56ac419c262a8eca46d1df4ce` |
| `sw.js` | `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02` |

## Accessibility, responsive behavior, offline, and performance

`verify-url.sh` passed for live root and demo: valid title/lang, one `h1`, `main`, no missing image alt text, no unlabeled buttons, and no console/page errors. Fresh Axe Core checks on `/`, `/demo`, `/privacy`, `/terms`, and the live 404 found **zero serious or critical violations**.

The first Tab focuses **Skip to the puzzle** with a visible 3 px yellow outline; activating it focuses the `h1`. The board uses a keyboard focus stop and has no trap. At 390 px there is no horizontal overflow and all visible enabled actions are at least 44×44 CSS px. At 200% root text size, the heading and board remain visible with no horizontal overflow. Reduced-motion CSS reduces transitions/animations to `0.01ms`; no flashing, autoplay, or audio was observed.

The service worker was active and controlling the live origin; `registration.update()` left no waiting worker. After the sample loaded, a full offline reload retained four selected tiles and accepted a fifth with no error. A live active-update sample measured 68 frames in 1111.7 ms: **61.17 fps**, above the public 50 fps claim.

## Evidence and defects

- `evidence/verify-7-root/` and `evidence/verify-7-demo/`: URL verifier HTML, desktop/mobile captures, and machine-readable reports.
- `evidence/verify-7-live-first-desktop.png`, `evidence/verify-7-live-first-mobile-390.png`, `evidence/verify-7-live-end-screen.png`: independent live captures.

Defects by severity:

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Release recommendation

Accept and release candidate `d17cd0ba7b27352be9f09e55210b3dcbcb7642c6`.
