# Adversarial first-read review 3 — FAIL

- Reviewed: 2 September 2026 UTC
- Live URL: `https://route-of-the-day.sociobot.in`
- Candidate: `9ed91087b80d928652a08990be3c8847950c2c8c`
- Fresh viewports: 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The live game and demo work, all 14 declared claim commands pass, and every earlier review finding remains fixed. Four findings remain. F-3-1 is blocking because the quantitative rendering claim is still untested despite its green command. A PASS requires zero findings and no untested claim.

## Cold first screen

Before scrolling, my answers were:

| Required answer | What the first screen told me |
| --- | --- |
| What does it do? | It is a daily spatial grid puzzle where I connect Start to Finish under a tile and marker rule. Evidence: “Draw today’s spatial route,” “Connect Start to Finish,” and the visible board. |
| For whom? | Daily-puzzle players who want a short, non-word route challenge without an account. This is stated directly. |
| What should I click first? | **Try it with sample data**. The adjacent text says it opens a half-finished sample puzzle. |

Both viewports answer all three questions. At 390 px, the headline, audience, action, outcome, three facts, puzzle goal, current rule, and top of the board are visible without scrolling or horizontal overflow. At desktop width, the active board is visible beside the copy. This check passes.

## Findings

### F-3-1 — BLOCKING: the 50 fps claim test measures an idle page, not route rendering

**Exact quote/location:** README: “Route rendering sustains at least 50 frames per second in the test browser.” `.factory/claims.json` lists `frame-rate`. Its test at `tests/game.spec.ts:228` opens `/demo` and counts `requestAnimationFrame` callbacks for one second without selecting, dragging, undoing, or redrawing any route tile.

**Why this fails:** A 60 Hz browser can deliver 50 callbacks while the page is idle even if route updates stutter. The test does not exercise the behavior named by the quantitative claim, so the claim remains untested. A green command is not evidence for a different observable outcome.

**Concrete fix:** Either remove the fps sentence and `frame-rate` entry, or drive continuous route changes during the timed sample. Record frame intervals while selecting and undoing tiles, assert the measured rate remains at least 50 fps, and keep that assertion under `@claim:frame-rate`.

### F-3-2 — medium: negative privacy and product claims are not fully represented in `claims.json`

**Exact quotes/locations:** Landing: “No accounts, rankings, or streak penalties” and “The game sends no personal details and loads no third-party scripts.” README: “There are no accounts, analytics, ads, remote fonts, or third-party scripts.”

**Why this fails:** `free-access` checks the initial page for account and payment controls. `local-progress` checks storage persistence and request origins. Neither declared claim covers rankings, streak penalties, analytics, ads, third-party scripts, or whether progress is sent in a same-origin request body. These are statements a visitor can rely on, so they need explicit claim coverage. The live request log was clean in this review, but that one-off observation is not a regression gate.

**Concrete fix:** Add a declared privacy-surface claim using the exact public wording. Its demo test should complete an interaction while asserting same-origin GET-only traffic with no request bodies, no third-party script/font origins, and no account, ranking, streak, analytics, or ad surface. Alternatively, remove the unsupported clauses and retain only the narrower tested statements.

### F-3-3 — medium: three documented route behaviors have no declared claim test

**Exact quotes/locations:** Landing: “Backspace removes a tile.” README: “Running out of tiles before Finish blocks the route until you undo or restart.” “Select the previous square to step back.” “Backspace: remove the latest route tile.”

**Why this fails:** The declared completion and input tests follow valid solutions. They do not deliberately exhaust the tile limit, backtrack by selecting the previous square, or press Backspace. These instructions promise recovery behavior but are absent from `claims.json`.

**Concrete fix:** Add `tile-limit` and `route-undo` claim entries. Test a maximum-length non-winning path and its announced error, then verify both previous-square selection and Backspace remove exactly one tile and allow play to continue. Otherwise remove the promises from README.

### F-3-4 — minor: “seed” is unexplained implementation jargon in player-facing copy

**Exact quotes/locations:** Landing: “Seed 2026-09-02,” “Each route is built from one published daily seed,” “Practice puzzles use published seeds and do not affect the daily route,” and “Finish the daily route, then play more archive seeds.” README: “Each archive route uses the published seed for an earlier UTC date,” heading “Deterministic puzzle model,” and “The game shows the date seed before play and a route code after completion.”

**Why this fails:** A new player needs dates and routes, not generator vocabulary. “Archive seeds” in particular makes the practice result less clear.

**Concrete fix:** Label the visible value **Date**. Rewrite the three landing lines as “Everyone gets the same route for each UTC date,” “Practice uses routes from earlier dates and does not change today’s route,” and “Finish today’s route, then play routes from earlier dates.” Rename the README heading **How daily routes are chosen** and use **date** consistently.

## Copy audit

Counts use whitespace-delimited words, treat hyphenated terms and URLs as one word, and exclude decorative symbols. Headings, labels, links, and buttons are included because they must also make sense out of context. The 36 board coordinates (`A1`–`F6`) are structured data labels of one token each; their accessible names add only Start, Finish, blocked, marker, open, or selected state. No item exceeds 22 words and no banned marketing adjective appears.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to the puzzle | 4 | Pass |
| Route of the Day | 4 | Pass |
| Daily | 1 | Pass |
| Demo | 1 | Pass |
| How it works | 3 | Pass |
| Privacy | 1 | Pass |
| A new spatial puzzle every day | 6 | Pass; `daily-seed` |
| Draw today’s spatial route | 4 | Pass |
| For daily-puzzle players who want a short route challenge without words or an account. | 14 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens a half-finished sample puzzle. | 5 | Pass; `demo-ready` |
| Free to play | 3 | Pass; `free-access` |
| No account | 2 | Pass; `free-access` |
| Progress stays in this browser | 5 | Pass; `local-progress` |
| Today’s route | 2 | Pass |
| Connect Start to Finish | 4 | Pass |
| Seed 2026-09-02 | 2 | F-3-4 |
| Use exactly 9 tiles and pass the ring marker. | 9 | Pass |
| Start | 1 | Pass |
| Finish | 1 | Pass |
| Blocked | 1 | Pass |
| Tiles left | 2 | Pass |
| Choose a square beside Start. | 5 | Pass |
| Undo tile | 2 | Pass; result-naming action |
| Restart puzzle | 2 | Pass; result-naming action |
| Keyboard: use Arrow keys, then Enter or Space. | 8 | Pass; `multi-input` |
| Backspace removes a tile. | 4 | F-3-3 |
| Route complete | 2 | Pass |
| You connected both landmarks in 9 tiles. | 7 | Pass; completion-state copy |
| Published solution: B1–B2–C2–C3–C4–D4–E4–E5–E6 | 2 plus code | Pass; `seed-route-code` |
| Play this route again | 4 | Pass; result-naming action |
| Play an archive route | 4 | Pass; result-naming action |
| Each route is built from one published daily seed. | 9 | F-3-4 |
| Practice archive | 2 | Pass |
| Play another generated route | 4 | Pass; result-naming heading |
| Practice puzzles use published seeds and do not affect the daily route. | 12 | F-3-4; behavior is covered by `practice-progress` |
| Finish today’s route to open practice mode. | 7 | Pass; `archive-gate` |
| How it works | 3 | Pass |
| Build one continuous route | 4 | Pass |
| Start at the circle | 4 | Pass |
| Select one open square beside the last route tile. | 9 | Pass |
| Meet today’s rule | 3 | Pass |
| Visit each marker and stay within the tile limit. | 9 | Pass |
| Reach the diamond | 3 | Pass |
| Finish the daily route, then play more archive seeds. | 9 | F-3-4 |
| What it does not do | 5 | Pass |
| No accounts, rankings, or streak penalties | 6 | F-3-2 |
| Your route progress uses browser storage. | 6 | Pass; `local-progress` |
| The game sends no personal details and loads no third-party scripts. | 11 | F-3-2 |
| Read the privacy details | 4 | Pass; result-naming link |
| An abstract orange route connects two landmarks across interlocking map tiles. | 11 | Pass; image alternative |
| Draw one short spatial route each day. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated hero art is disclosed in the design notes. | 10 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Draw one short route across a new spatial puzzle each day. | 11 | Pass |
| A round is designed to take three to five minutes. | 10 | Pass; `round-duration` |
| Route of the Day is for daily-puzzle players who want a spatial challenge. | 13 | Pass |
| It is free and starts without an account or payment step. | 11 | Pass; `free-access` |
| Play | 1 | Pass |
| The live site is route-of-the-day.sociobot.in. | 5 | Pass |
| Select adjacent squares to connect the circle to the diamond. | 10 | Pass |
| Use the exact tile count and meet the daily marker or turn rule. | 13 | Pass |
| Running out of tiles before Finish blocks the route until you undo or restart. | 14 | F-3-3 |
| The puzzle works with keyboard and touch input. | 8 | Pass; `multi-input` |
| Mouse clicks follow the same route rules. | 7 | Pass; `pointer-input` |
| A loaded puzzle remains playable if the browser goes offline. | 10 | Pass; `offline-play` |
| Completing today’s UTC daily route opens non-scored archive practice. | 9 | Pass; `complete-run` |
| An earlier completion does not open it. | 7 | Pass; `archive-gate` |
| Each archive route uses the published seed for an earlier UTC date. | 12 | F-3-4; behavior is covered by `practice-progress` |
| Practice progress is kept separate from the daily route. | 9 | Pass; `practice-progress` |
| Try the isolated demo | 4 | Pass |
| Open ?demo=1 or add /demo to the local URL. | 9 | Pass |
| It starts with four route tiles already placed. | 8 | Pass; `demo-ready` |
| Demo progress uses sessionStorage keys beginning with demo:. | 8 | Pass; precise developer-facing storage name |
| It never reads or changes daily progress. | 7 | Pass; `demo-ready` |
| Select Reset demo for a clean sample. | 7 | Pass; `demo-ready` |
| Controls | 1 | Pass |
| Pointer or touch: select an adjacent square. | 7 | Pass; `multi-input` and `pointer-input` |
| Select the previous square to step back. | 7 | F-3-3 |
| Keyboard: focus the board, move with Arrow keys, and place with Enter or Space. | 14 | Pass; `multi-input` |
| Backspace: remove the latest route tile. | 6 | F-3-3 |
| Restart puzzle: return to the Start tile. | 7 | Pass; `complete-run` |
| Privacy | 1 | Pass |
| Progress stays in this browser and the game sends no cross-origin requests. | 12 | Pass; `local-progress` |
| There are no accounts, analytics, ads, remote fonts, or third-party scripts. | 11 | F-3-2 |
| See the in-product privacy page and terms. | 7 | Pass |
| Develop and verify | 3 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| npm install | 2 | Pass; command |
| npm run dev | 3 | Pass; command |
| npm test | 2 | Pass; command |
| npm run build | 3 | Pass; command |
| npm test runs deterministic core checks and the Playwright claim tests listed in .factory/claims.json. | 14 | Pass; developer documentation |
| The production build lands in dist/, with index.html at its root. | 11 | Pass; verified |
| Route rendering sustains at least 50 frames per second in the test browser. | 13 | F-3-1 |
| Deterministic puzzle model | 3 | F-3-4 |
| The UTC date chooses one route, its direction, blocked squares, and one rule. | 13 | Pass; `daily-seed` |
| Each date has a known solution, so every published route can be completed. | 13 | Pass; `reproducible-solution` |
| The game shows the date seed before play and a route code after completion. | 14 | F-3-4; behavior is covered by `seed-route-code` |
| Deploy | 1 | Pass |
| Deploy the complete dist/ directory as a static site. | 9 | Pass; developer instruction |
| staticwebapp.config.json provides route fallback, security headers, cache policy, and the 404 response. | 12 | Pass; developer documentation |
| The repository does not manage DNS or infrastructure. | 8 | Pass; developer boundary |
| Project files | 2 | Pass |
| visual system, difficulty curve, motion, and asset provenance | 8 | Pass; file description |
| product claims and their exact test commands | 7 | Pass; file description |
| demo data and storage isolation | 5 | Pass; file description |
| verification results and known gaps | 5 | Pass; file description |
| Licensed under the MIT License. | 5 | Pass |

Terminology is otherwise consistent: **route** is the selected path, **tile** is one selected square, **archive practice** is non-daily play, **Start/circle** and **Finish/diamond** name the landmarks, and **blocked** names an impassable square. F-3-4 is the exception.

## Demo and sandbox

From a fresh 390 px context, the landing action reached `/?demo=1` in one click. The first demo screen already showed a sample route with four selected tiles, the instruction to continue from the orange tile, and the persistent banner “Demo — sample data, nothing is saved.” A valid move changed the count to five. **Reset demo** returned it to four. Offline mode still accepted the fifth tile.

A planted `route:review3-sentinel` value in daily `localStorage` remained unchanged throughout. Demo interaction wrote only `demo:path:v1:sample-map-7` to `sessionStorage`; reset and **Start for real** removed it. The complete request log contained only same-origin GETs with no bodies, console errors, or page errors. This behavior passes; F-3-2 concerns missing regression coverage for the broader published wording.

## Claims and clean-clone gates

The review cloned commit `9ed91087b80d928652a08990be3c8847950c2c8c` into a new temporary directory and ran every exact command from `.factory/claims.json`.

| Claim | Command result | Review result |
| --- | --- | --- |
| `demo-ready` | Pass | Pass |
| `daily-seed` | Pass | Pass |
| `round-duration` | Pass | Pass |
| `local-progress` | Pass | Pass for its declared wording; see F-3-2 for broader copy |
| `complete-run` | Pass | Pass |
| `archive-gate` | Pass | Pass |
| `practice-progress` | Pass | Pass |
| `multi-input` | Pass | Pass |
| `pointer-input` | Pass | Pass |
| `reproducible-solution` | Pass | Pass |
| `seed-route-code` | Pass | Pass |
| `frame-rate` | Pass | **Contract fail: F-3-1** |
| `free-access` | Pass | Pass for its declared wording; see F-3-2 for broader copy |
| `offline-play` | Pass | Pass |

The full suite passed 23/23. `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed; `dist/` was produced. The build emitted 23.04 kB JavaScript (8.25 kB gzip) and 13.82 kB CSS (3.99 kB gzip). Built `index.html`, JS, CSS, and `404.html` hashes match the live deployment.

## Earlier history recheck

Read in full: `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the prior handoff. Every earlier finding was checked in live behavior and source.

| Earlier finding | Live confirmation | Code/test confirmation | Result |
| --- | --- | --- | --- |
| F-1-1: 404 lacked shared shell | A missing URL returns 404 with one header, main, footer, Privacy, Terms, factory link, and version. | `public/404.html` contains the shared shell; structure test passes. | Fixed |
| F-1-2: 404 lacked metadata/favicon | Live 404 has its own title, description, canonical `/404`, OG/Twitter metadata, SVG favicon, and touch icon. | Static metadata assertions pass. | Fixed |
| F-1-3: README claim coverage for pointer, reproducibility, and route code | All three behaviors are present live. | `pointer-input`, `reproducible-solution`, and `seed-route-code` entries and tests pass. | Fixed |
| F-1-4: README generator jargon sentence | The quoted “seeded hash/route skeleton” sentence is absent. | README uses the reviewed UTC-date explanation. | Fixed; F-3-4 concerns remaining player-facing “seed” wording |
| F-2-1: metaphorical 404 h1 | Live HTTP 404 has the sole h1 “Page not found.” | Both `public/404.html` and the SPA fallback use “Page not found”; assertions pass. | Fixed |

No earlier finding regressed.

## Structure, accessibility, links, and identity

Live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a missing URL were checked at 390 px and 1440 px. Each has `lang=en`, one h1, one main, the expected route-specific title, description, canonical, OG title, favicon, shared header, and footer. The missing route returns HTTP 404 and uses a designed recovery page. The browser’s expected failed-document console notice for that intentional 404 is not an application error.

Playwright Axe found zero serious or critical violations across all ten route/viewport combinations. The factory URL verifier passed `/` and `/?demo=1`. Normal routes produced no console or page errors and no horizontal overflow. Navigation moves focus to the new h1 and updates the live announcement. Back restored a 1,762 px landing scroll position and focused its h1. `/#how` deep-linked to the correct section.

All discovered internal links, assets, `robots.txt`, `sitemap.xml`, the social image, and the linked Param Factory page returned 200; `mailto:` links are explicit. The 404 skip link correctly targets its own `#main` and retains the page’s intentional 404 status.

The asymmetric board-first layout, mineral-ink palette, contour map texture, clipped corners, route glyphs, and square tile grammar match `.factory/design.md`. The product is visually distinct and is not a generic SaaS template.

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. The core job is a deterministic five-minute spatial puzzle with post-completion archive practice; both are present. AI would add cost and network dependence without helping the route-solving job. No decorative AI feature or provider key is present.

## What would make this perfect

Replace or repair the idle 50 fps test so the quantitative claim is genuinely exercised. Add exact claim coverage for the remaining privacy/non-feature and route-recovery promises. Then replace unexplained **seed** language with dates and routes throughout player-facing copy. Re-run the exact claim commands, full suite, live demo isolation log, and copy audit; a clean result would leave no remaining review work.
