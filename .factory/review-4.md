# Adversarial first-read review 4 — PASS

- Reviewed: 2 September 2026 UTC
- Live URL: <https://route-of-the-day.sociobot.in>
- Repository candidate: `2b195b81c0df7843dfc10f58a90fde6edb77d224`
- Fresh viewports: 390 × 844 and 1440 × 900

## Verdict

**PASS.** No blocking, major, medium, minor, or untested-claim findings remain. A cold visitor can identify the job, audience, and first action immediately; the one-click demo is visibly isolated; every declared claim command passed from a clean checkout; and every earlier finding is fixed in the live product and source.

## Cold first screen

| Question | Exact first-screen evidence | Result |
| --- | --- | --- |
| What does this do? | “Draw today’s spatial route” and the visible “Connect Start to Finish” puzzle. | Clear. |
| Who is it for? | “For daily-puzzle players who want a short route challenge without words or an account.” | Clear. |
| What should I click first? | **Try it with sample data** followed by “Opens a half-finished sample puzzle.” | Clear and result-naming. |

At 390 px, the full proposition, action, three facts, puzzle heading, current date, rule, and top of the real board are visible with no horizontal overflow. At desktop width, the whole active board and route controls are visible beside the proposition. Normal loads produced no application console or page errors.

## Copy audit

Counts use whitespace-delimited words; dates, hyphenated words, route codes, and command names each count as one. Board coordinates are structured labels rather than sentences, so they are excluded. Every standalone heading, action, and sentence is listed; dynamic game feedback is included. No entry exceeds 22 words, uses a banned marketing adjective, depends on a metaphor, has unexplained player-facing jargon, or uses a non-result-naming action.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to the puzzle | 4 | Pass |
| Route of the Day | 4 | Pass |
| Daily | 1 | Pass |
| Demo | 1 | Pass |
| How it works | 3 | Pass |
| Privacy | 1 | Pass |
| A new spatial puzzle every day | 6 | Pass; `daily-date` |
| Practice with a route from an earlier date | 8 | Pass; archive mode |
| Practice with an archived route | 6 | Pass; archive mode |
| Draw today’s spatial route | 4 | Pass |
| Draw an archive route | 4 | Pass; archive mode |
| For daily-puzzle players who want a short route challenge without words or an account. | 14 | Pass |
| Try it with sample data | 5 | Pass; names the result |
| Opens a half-finished sample puzzle. | 5 | Pass; `demo-ready` |
| Free to play | 3 | Pass; `free-access` |
| No account | 2 | Pass; `free-access` |
| Progress stays in this browser | 5 | Pass; `local-progress` |
| Today’s route | 2 | Pass |
| Connect Start to Finish | 4 | Pass |
| Date 2026-09-02 | 2 | Pass; `daily-date` |
| Use exactly 9 tiles and pass the ring marker. | 9 | Pass; completion/rule checks |
| Start | 1 | Pass |
| Finish | 1 | Pass |
| Blocked | 1 | Pass |
| Tiles left | 2 | Pass |
| Choose a square beside Start. | 6 | Pass |
| Undo tile | 2 | Pass; `route-undo` |
| Restart puzzle | 2 | Pass; `complete-run`, `tile-limit` |
| Keyboard: use Arrow keys, then Enter or Space. | 8 | Pass; `multi-input` |
| Backspace removes a tile. | 4 | Pass; `route-undo` |
| That square is blocked. Choose an open square. | 8 | Pass |
| Choose a square beside the end of your route. | 9 | Pass |
| Routes cannot cross themselves. Step back or choose another square. | 10 | Pass |
| The tile limit is reached. Step back and try another route. | 11 | Pass; `tile-limit` |
| You reached Finish, but the route does not meet today’s rule. | 12 | Pass |
| Removed the last tile. | 4 | Pass; `route-undo` |
| Route complete. | 2 | Pass; `complete-run` |
| You connected both landmarks in 9 tiles. | 7 | Pass; `complete-run` |
| Published solution: [route code] | 2 plus code | Pass; `date-route-code` |
| Play this route again | 4 | Pass; names the result |
| Play an archive route | 4 | Pass; names the result |
| Everyone gets the same route for each UTC date. | 9 | Pass; `daily-date` |
| Practice archive | 2 | Pass |
| Play a route from an earlier date | 7 | Pass |
| Practice uses routes from earlier dates and does not change today’s route. | 12 | Pass; `practice-progress` |
| Finish today’s route to open practice mode. | 7 | Pass; `archive-gate` |
| Archive practice · not scored | 4 | Pass; `archive-non-scored` |
| Open practice routes | 3 | Pass; names the result |
| Return to today’s route | 5 | Pass; names the result |
| Build one continuous route | 5 | Pass |
| Start at the circle | 4 | Pass |
| Select one open square beside the last route tile. | 9 | Pass |
| Meet today’s rule | 3 | Pass |
| Visit each marker and stay within the tile limit. | 9 | Pass |
| Reach the diamond | 3 | Pass |
| Finish today’s route, then play routes from earlier dates. | 9 | Pass |
| What it does not do | 5 | Pass |
| No accounts, rankings, or streak penalties | 6 | Pass; `privacy-surface` |
| Your route progress uses browser storage. | 6 | Pass; `local-progress` |
| The game sends no personal details and loads no third-party scripts. | 11 | Pass; `privacy-surface` |
| Read the privacy details | 4 | Pass; names the result |
| An abstract orange route connects two landmarks across interlocking map tiles. | 11 | Pass; useful image alternative |
| Draw one short spatial route each day. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated hero art is disclosed in the design notes. | 10 | Pass; provenance disclosure |

Terminology is consistent: a selected sequence is a **route**, one selected square is a **tile**, the daily identifier is a **date**, and non-daily play is **archive practice**. The visible copy does not use the earlier unexplained “seed” terminology.

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Draw one short route across a new spatial puzzle each day. | 10 | Pass; `daily-date` |
| Route of the Day is for daily-puzzle players who want a spatial challenge. | 12 | Pass |
| It is free and starts without an account or payment step. | 11 | Pass; `free-access` |
| Play | 1 | Pass |
| The live site is route-of-the-day.sociobot.in. | 5 | Pass |
| Select adjacent squares to connect the circle to the diamond. | 10 | Pass |
| Use the exact tile count and meet the daily marker or turn rule. | 12 | Pass; completion/rule checks |
| Running out of tiles before Finish blocks the route until you undo or restart. | 14 | Pass; `tile-limit` |
| The puzzle works with keyboard and touch input. | 8 | Pass; `multi-input` |
| Mouse clicks follow the same route rules. | 7 | Pass; `pointer-input` |
| A loaded puzzle remains playable if the browser goes offline. | 10 | Pass; `offline-play` |
| Completing today’s UTC daily route opens non-scored archive practice. | 9 | Pass; `complete-run`, `archive-non-scored` |
| An earlier completion does not open it. | 7 | Pass; `archive-gate` |
| Each practice route is from an earlier UTC date. | 9 | Pass; `practice-progress` |
| Practice progress is kept separate from the daily route and never saves a score. | 13 | Pass; `practice-progress`, `archive-non-scored` |
| Try the isolated demo | 4 | Pass |
| Open ?demo=1 or /demo. | 5 | Pass |
| It starts with four route tiles already placed. | 8 | Pass; `demo-ready` |
| Demo progress uses sessionStorage keys beginning with demo:. | 8 | Pass; `demo-ready` |
| It never reads or changes daily progress. | 7 | Pass; `demo-ready` |
| Select Reset demo for a clean sample. | 7 | Pass; names the result |
| Controls | 1 | Pass |
| Pointer or touch: select an adjacent square. | 7 | Pass; `multi-input`, `pointer-input` |
| Select the previous square to step back. | 8 | Pass; `route-undo` |
| Keyboard: focus the board, move with Arrow keys, and place with Enter or Space. | 13 | Pass; `multi-input` |
| Backspace: remove the latest route tile. | 6 | Pass; `route-undo` |
| Restart puzzle: return to the Start tile. | 7 | Pass; `complete-run` |
| Privacy | 1 | Pass |
| Progress stays in this browser and the game sends no cross-origin requests. | 12 | Pass; `local-progress`, `privacy-surface` |
| There are no accounts, analytics, ads, remote fonts, or third-party scripts. | 10 | Pass; `privacy-surface` |
| See the in-product privacy page and terms. | 7 | Pass |
| Develop and verify | 3 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| npm install | 2 | Pass; command |
| npm run dev | 3 | Pass; command |
| npm test | 2 | Pass; command |
| npm run build | 3 | Pass; command |
| npm test runs deterministic core checks and the Playwright claim tests listed in .factory/claims.json. | 14 | Pass |
| The production build lands in dist/, with index.html at its root. | 10 | Pass; verified |
| Route rendering sustains at least 50 frames per second in the test browser. | 13 | Pass; `frame-rate` |
| How daily routes are chosen | 5 | Pass |
| The UTC date chooses one route, its direction, blocked squares, and one rule. | 13 | Pass; `daily-date` |
| Each date has a known solution, so every published route can be completed. | 13 | Pass; `reproducible-solution` |
| The game shows the date before play and a route code after completion. | 13 | Pass; `date-route-code` |
| Deploy | 1 | Pass |
| Deploy the complete dist/ directory as a static site. | 9 | Pass |
| staticwebapp.config.json provides route fallback, security headers, cache policy, and the 404 response. | 12 | Pass |
| The repository does not manage DNS or infrastructure. | 8 | Pass |
| Project files | 2 | Pass |
| visual system, difficulty curve, motion, and asset provenance | 8 | Pass |
| product claims and their exact test commands | 7 | Pass |
| demo data and storage isolation | 5 | Pass |
| verification results and known gaps | 5 | Pass |
| Licensed under the MIT License. | 5 | Pass |

## Demo and sandbox

The visible first-screen action reaches `/?demo=1` in one click. The first demo screen already displays a realistic half-finished route: four selected tiles on the sample grid, the actual tile/turn rule, and the persistent banner **“Demo — sample data, nothing is saved.”** It offers **Reset demo** and **Start for real**.

In a fresh live browser context, I planted a daily `localStorage` sentinel. A valid sample move produced five selected tiles and the sole `sessionStorage` key `demo:path:v1:sample-map-7`; the daily sentinel was unchanged. **Reset demo** restored four tiles and cleared the demo key. **Start for real** opened `/`, kept the daily sentinel, and left no demo key. This confirms the shipped demo's separate session namespace and no real-data mutation.

The recorded demo flow made only same-origin `GET` requests with no bodies. The loaded demo also passed the declared offline-input test. No account, payment, analytics, advertising, remote font, third-party script, provider key, or AI surface was observed.

## Claims and clean-clone checks

From a new detached clone at the candidate, `npm ci` succeeded. I ran every exact command listed in `.factory/claims.json`; all passed:

| Claim | Result |
| --- | --- |
| `demo-ready` | Pass |
| `daily-date` | Pass |
| `local-progress` | Pass |
| `complete-run` | Pass |
| `archive-gate` | Pass |
| `practice-progress` | Pass |
| `archive-non-scored` | Pass |
| `multi-input` | Pass |
| `pointer-input` | Pass |
| `reproducible-solution` | Pass |
| `date-route-code` | Pass |
| `frame-rate` | Pass; active add/remove route updates are measured, not an idle page |
| `free-access` | Pass |
| `privacy-surface` | Pass; test records the demo request log and feature surface |
| `tile-limit` | Pass |
| `route-undo` | Pass |
| `offline-play` | Pass |

The unfiltered suite passed **29/29**. `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed; `dist/` was produced. The active rendering claim exercises repeated route DOM updates and asserts at least 50 fps, correcting the flaw identified in review 3.

## Earlier-history recheck

Read in full: `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, `polish-2.md`, `polish-3.md`, and the previous handoff. Each prior finding was rechecked against the current live page and source/tests.

| Earlier finding | Live and source confirmation | Result |
| --- | --- | --- |
| F-1-1: 404 lacked shared shell | A live unknown URL returns HTTP 404 with wordmark, skip link, navigation, `main`, footer, Privacy, Terms, Param Factory link, and recovery action. | Fixed |
| F-1-2: 404 lacked metadata/favicon | The live 404 has its own title, description, canonical `/404`, OG/Twitter metadata, favicon, and apple-touch icon. | Fixed |
| F-1-3: README claim coverage | `pointer-input`, `reproducible-solution`, and `date-route-code` have declared tagged observable tests, all passing. | Fixed |
| F-1-4: generator jargon | The earlier “seeded hash/route skeleton” wording is absent; player-facing copy uses dates and routes. | Fixed |
| F-2-1: metaphorical 404 heading | Static 404 and SPA fallback both use the sole heading “Page not found.” | Fixed |
| F-3-1: idle fps check | `@claim:frame-rate` repeatedly adds and removes actual tiles, observes mutations, and asserts active-update fps. | Fixed |
| F-3-2: unsupported privacy statements | `privacy-surface` covers controls, requests, bodies, resource origins, and asset origins. | Fixed |
| F-3-3: untested undo/tile-limit instructions | `tile-limit` and `route-undo` drive each published recovery behavior. | Fixed |
| F-3-4: player-facing “seed” jargon | Date and route language is used throughout the player-facing landing page and README. | Fixed |

## Structure, accessibility, links, and visual identity

I checked live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real missing URL at 390 px; root was also checked at desktop width. Normal routes return HTTP 200 and the missing route returns HTTP 404. Each has `lang="en"`, one `h1`, one `main`, a route-specific title, description, canonical URL, Open Graph title, favicon, header, and footer. The normal routes had no console errors. The expected failed-document notice on the intentional HTTP 404 is not an application error.

Live Axe Core found zero serious or critical violations on all five route types. The 390 px pages had no horizontal overflow. The built suite confirms route-change focus, back-button scroll restoration, deep-link behavior, and touch targets. Every discovered internal link, `robots.txt`, `sitemap.xml`, site asset, and the linked Param Factory page returned 200; `mailto:` links are explicit.

The live site matches the stated transit-map identity: mineral-ink palette, contour texture, clipped map panels, square route grid, landmark glyphs, and asymmetric wide layout. It is not a generic SaaS template. No additional AI, import/export, or sync feature is implied by the brief: deterministic daily play and unlocked practice are the complete, relevant job.

## What would make this perfect

No corrective change is identified. Keep the claim commands, live demo-isolation check, and fresh mobile first-read check in each future release so this remains true.
