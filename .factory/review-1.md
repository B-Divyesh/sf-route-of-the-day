# Adversarial first-read review 1 — FAIL

- Reviewed: 2 September 2026 UTC
- Live URL: `https://route-of-the-day.sociobot.in`
- Fresh viewports: 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The game, demo, and declared claims work, but four findings remain. A PASS requires zero findings.

## Cold first screen

| Required answer | First-screen evidence |
| --- | --- |
| What does it do? | “Draw today’s route” and “Connect Start to Finish.” |
| For whom? | “For daily-puzzle players who want a short spatial challenge without words, scores, or an account.” |
| What should I click first? | **Try it with sample data**; “Opens a half-finished sample puzzle.” |

The desktop viewport included the board. The 390px viewport included the action, goal, rule, and beginning of the board without horizontal overflow. This check passes.

## Findings

### F-1-1 — medium: live 404 omits the shared header and footer

**Location / quote:** `/definitely-missing` returns HTTP 404 and contains only “404”, “Find your way back to the route”, “This page does not exist. The daily puzzle is ready from the home page.”, and **Play today’s route**. Live DOM inspection found `header: 0` and `footer: 0`.

**Why:** A visitor who follows an old or mistyped URL cannot reach Demo, Privacy, Terms, or the Param Factory footer. The required skeleton is inconsistent on a real route.

**Fix:** Add the normal wordmark/nav/skip link and footer (one-liner, Privacy, Terms, Param Factory, version) to `public/404.html`, retaining the recovery action.

### F-1-2 — medium: live 404 lacks required route metadata and favicon

**Location / evidence:** The page has the valid title “Page not found — Route of the Day” and one `h1`, but inspection found no `link[rel=canonical]`, no `meta[property^="og:"]`, and no `link[rel=icon]`.

**Why:** This route has no canonical target, preview identity, or browser icon, unlike normal product routes.

**Fix:** Add a 404 canonical target, OG/Twitter title/description/image using the existing social asset, and existing SVG/favicon touch links to `public/404.html`.

### F-1-3 — minor: README claims are absent from `.factory/claims.json`

**Exact quotes:** “Pointer input uses the same route rules.” “The test suite solves complete routes with keyboard, touch, and pointer input.” “The generator starts from a known solution, so the published route remains reproducible.” “The browser shows the seed before play and the route code after completion.”

**Why:** None has a declared claim and corresponding `@claim:` test. Untagged deterministic checks and incidental mouse clicks do not provide the required per-claim test command; a regression could pass the advertised claim gate.

**Fix:** Delete the promises or add entries and observable tests: complete by actual pointer events; prove the same seed’s known solution completes; and assert the visible seed before play plus route code after completion.

### F-1-4 — minor: README uses unexplained implementation jargon

**Quote:** “A seeded hash selects a route skeleton, rotation, reflection, obstacles, and one rule.”

**Why:** “Seeded hash” and “route skeleton” do not tell a first-time daily-puzzle player what they get.

**Fix / rewrite:** “The UTC date chooses one route, its direction, blocked squares, and one rule.”

## Copy audit

Counts treat hyphenated terms and URLs as one word. Headings and actions are included to audit standalone headings and buttons. No landing copy exceeds 22 words, uses a banned marketing term, or is a mood/metaphor heading. No README copy exceeds 22 words; F-1-3 and F-1-4 are its only flags.

### Landing-page copy

| Copy | Words | Result |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Daily / Demo / How it works / Privacy | 6 | Pass |
| A new spatial puzzle every day | 6 | Pass |
| Draw today’s route | 3 | Pass |
| For daily-puzzle players who want a short spatial challenge without words, scores, or an account. | 15 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens a half-finished sample puzzle. | 5 | Pass |
| Free to play / No account / Progress stays in this browser | 10 | Pass |
| Today’s route / Connect Start to Finish / Seed [UTC date] | 8 | Pass |
| Use exactly 9 tiles and pass the ring marker. | 9 | Pass; number/rule changes by seed |
| Start / Finish / Blocked / Tiles left | 5 | Pass |
| Choose a square beside Start. | 6 | Pass |
| Undo tile / Restart puzzle | 4 | Pass; result-naming actions |
| Keyboard: use Arrow keys, then Enter or Space. | 8 | Pass |
| Backspace removes a tile. | 4 | Pass |
| Each route is built from one published daily seed. | 9 | Pass |
| Practice archive / Play another generated route | 6 | Pass |
| Practice puzzles use published seeds and do not affect the daily route. | 11 | Pass |
| Finish today’s route to open practice mode. | 7 | Pass |
| Build one continuous route / Start at the circle | 8 | Pass |
| Select one open square beside the last route tile. | 9 | Pass |
| Meet today’s rule / Visit each marker and stay within the tile limit. | 12 | Pass |
| Reach the diamond / Finish the daily route, then play more archive seeds. | 12 | Pass |
| What it does not do / No accounts, rankings, or streak penalties | 11 | Pass |
| Your route progress uses browser storage. | 6 | Pass |
| The game sends no personal details and loads no third-party scripts. | 11 | Pass |
| Read the privacy details / Draw one short spatial route each day. | 11 | Pass |
| Terms / Built by Param Factory | 5 | Pass |
| v1.0.0 · Generated hero art is disclosed in the design notes. | 10 | Pass |

### README copy

| Copy | Words | Result |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Draw one short route across a new spatial puzzle each day. | 10 | Pass |
| A round is designed to take three to five minutes. | 10 | Pass |
| Route of the Day is for daily-puzzle players who want a spatial challenge. | 13 | Pass |
| It is free and starts without an account or payment step. | 11 | Pass |
| Play / The live site is route-of-the-day.sociobot.in. | 6 | Pass |
| Select adjacent squares to connect the circle to the diamond. | 10 | Pass |
| Use the exact tile count and meet the daily marker or turn rule. | 13 | Pass |
| Running out of tiles before Finish blocks the route until you undo or restart. | 14 | Pass |
| The puzzle works with keyboard and touch input. | 8 | Pass |
| Pointer input uses the same route rules. | 7 | F-1-3; use “Mouse clicks follow the same route rules.” |
| A loaded puzzle remains playable if the browser goes offline. | 10 | Pass |
| Completing today’s UTC daily route opens non-scored archive practice. | 9 | Pass |
| An earlier completion does not open it. | 7 | Pass |
| Each archive route uses the published seed for an earlier UTC date. | 11 | Pass |
| Practice progress is kept separate from the daily route. | 8 | Pass |
| Try the isolated demo / Open /demo or add /demo to the local URL. | 13 | Pass |
| It starts with four route tiles already placed. | 8 | Pass |
| Demo progress uses sessionStorage keys beginning with demo:. | 7 | Pass |
| It never reads or changes daily progress. | 7 | Pass |
| Select Reset demo for a clean sample. | 7 | Pass |
| Controls / Pointer or touch: select an adjacent square. | 8 | Pass |
| Select the previous square to step back. | 8 | Pass |
| Keyboard: focus the board, move with Arrow keys, and place with Enter or Space. | 13 | Pass |
| Backspace: remove the latest route tile. | 6 | Pass |
| Restart puzzle: return to the Start tile. | 7 | Pass |
| Privacy / Progress stays in this browser and the game sends no cross-origin requests. | 12 | Pass |
| There are no accounts, analytics, ads, remote fonts, or third-party scripts. | 10 | Pass |
| See the in-product privacy page and terms. | 7 | Pass |
| Develop and verify / Requirements: Node.js 20 or newer and npm. | 10 | Pass |
| npm install / npm run dev / npm test / npm run build | 10 | Pass |
| npm test runs deterministic core checks and Playwright claim tests. | 9 | Pass |
| The test suite solves complete routes with keyboard, touch, and pointer input. | 12 | F-1-3 |
| The production build lands in dist/, with index.html at its root. | 10 | Pass |
| Route rendering sustains at least 50 frames per second in the test browser. | 13 | Pass |
| Deterministic puzzle model / The UTC date is the daily seed. | 10 | Pass |
| A seeded hash selects a route skeleton, rotation, reflection, obstacles, and one rule. | 13 | F-1-4 |
| The generator starts from a known solution, so the published route remains reproducible. | 13 | F-1-3 |
| The browser shows the seed before play and the route code after completion. | 13 | F-1-3 |
| Deploy / Deploy the complete dist/ directory as a static site. | 10 | Pass |
| staticwebapp.config.json provides route fallback, security headers, cache policy, and the 404 response. | 10 | Pass; developer instruction |
| The repository does not manage DNS or infrastructure. | 8 | Pass |
| Project files / visual system, difficulty curve, motion, and asset provenance | 10 | Pass; file description |
| product claims and their exact test commands | 7 | Pass; file description |
| demo data and storage isolation / verification results and known gaps | 10 | Pass; file descriptions |
| Licensed under the MIT License. | 5 | Pass |

## Demo, claims, and sandbox

Fresh `/demo` immediately showed four selected sample tiles and the persistent “Demo — sample data, nothing is saved” banner. Selecting the next tile produced five; **Reset demo** returned four. A daily `localStorage` sentinel remained unchanged. The only demo key was `demo:path:v1:sample-map-7` in `sessionStorage`; **Start for real** removed it and preserved the sentinel. The log had same-origin GETs only, with no console/page errors. The offline loaded-puzzle claim passed.

After clean `npm ci`, every declared command passed: `demo-ready`, `daily-seed`, `round-duration`, `local-progress`, `complete-run`, `archive-gate`, `practice-progress`, `multi-input`, `frame-rate`, `free-access`, and `offline-play`. `npm test` passed 19 tests. `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed; build produced `dist/`.

## Earlier history recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read all verification reports and the handoff. All prior findings were actually fixed: default frame-rate gate, prior landing claim inventory, mobile targets, HTTP-404 status, invalid practice recovery, Back scroll/focus, fresh/stale archive bypass, archive-gate coverage, invalid stored paths, and demo-reset focus. Fresh/stale archive markers redirected to `/`; only today’s marker opened the prior UTC seed. F-1-3 is a newly found README inventory gap.

## Structure, privacy, and leverage

Normal routes have per-route titles, one `h1`, one `main`, descriptions, canonical URLs, OG/Twitter data, favicon, `lang=en`, skip link, focus handling, and an announcer. F-1-1 and F-1-2 are the real-404 exceptions. `/`, `/demo`, `/privacy`, `/terms`, assets, robots, sitemap, and the linked Param Factory page returned 200; mail links are explicit. CSP is a response header with `frame-ancestors 'none'`. Fresh desktop, mobile, and demo requests were same-origin only with no errors.

The pocket-transit board, mineral palette, clipped panels, route glyphs, and map texture are distinct and match `design.md`; this is not a generic SaaS template. The brief does not imply AI, sync, import, or export. The daily seed, isolated demo, and archive are the expected useful features, with no decorative AI feature.

## What would make this perfect

Give the static 404 the same navigation, footer, metadata, and icon treatment as normal routes. Then make every remaining README promise independently claim-tested or remove it, and replace the one implementation-jargon sentence.
