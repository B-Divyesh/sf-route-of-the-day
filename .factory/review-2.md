# Adversarial first-read review 2 — FAIL

- Reviewed: 2 September 2026 UTC
- Live URL: `https://route-of-the-day.sociobot.in`
- Fresh viewports: 390 × 844 and 1440 × 900
- Candidate checked from a fresh clone: `efdbf6112deacb3d60b22354fe26ebadcc5a6d33`

## Verdict

**FAIL.** One minor finding remains. A PASS requires zero findings.

## Cold first screen

| Required answer | First-screen evidence |
| --- | --- |
| What does it do? | “Draw today’s spatial route” and the visible board instruction “Connect Start to Finish.” |
| For whom? | “For daily-puzzle players who want a short route challenge without words or an account.” |
| What should I click first? | **Try it with sample data**; “Opens a half-finished sample puzzle.” |

Both fresh screens answer all three questions before scrolling. At 390px the primary action, three facts, puzzle heading, rule, and top of the real board are visible with no horizontal overflow. The board is also visible in the first desktop viewport. This check passes.

## Findings

### F-2-1 — minor: the 404 headline is a metaphor instead of naming the page

**Location / exact quote:** Live `/definitely-missing` (HTTP 404) and the SPA fallback both use the sole h1: “Find your way back to the route”.

**Why this fails:** A missing-page heading should identify the page state when read out of context. “Find your way back” is route-themed mood language, not a page name. It makes a screen-reader heading list less direct and violates the plain-words rule against metaphor headings.

**Concrete fix:** Change the h1 in both `public/404.html` and `src/app.ts` to **“Page not found”**. Keep the useful next sentence and **Play today’s route** action beneath it.

## Copy audit

Word counts treat hyphenated terms, code names, URLs, and dynamic values as one word. UI labels and headings are included because a visitor can encounter them as standalone copy. No landing or README item exceeds 22 words, uses a banned marketing adjective, has inconsistent game terminology, or has a non-result-naming action. The one heading issue is F-2-1, on the 404 route rather than the landing page.

### Landing-page copy

| Copy | Words | Result |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Daily / Demo / How it works / Privacy | 6 | Pass |
| A new spatial puzzle every day | 6 | Pass |
| Draw today’s spatial route | 4 | Pass |
| For daily-puzzle players who want a short route challenge without words or an account. | 14 | Pass |
| Try it with sample data | 5 | Pass; names the result |
| Opens a half-finished sample puzzle. | 5 | Pass |
| Free to play / No account / Progress stays in this browser | 10 | Pass; covered by `free-access` and `local-progress` |
| Today’s route / Connect Start to Finish / Seed [UTC date] | 8 | Pass |
| Use exactly 9 tiles and pass the ring marker. | 9 | Pass; daily rule varies by seed |
| Start / Finish / Blocked / Tiles left | 5 | Pass |
| Choose a square beside Start. | 6 | Pass |
| Undo tile / Restart puzzle | 4 | Pass; names the result |
| Keyboard: use Arrow keys, then Enter or Space. Backspace removes a tile. | 12 | Pass |
| Each route is built from one published daily seed. | 9 | Pass; covered by `daily-seed` |
| Practice archive / Play another generated route | 6 | Pass |
| Practice puzzles use published seeds and do not affect the daily route. | 11 | Pass; covered by `practice-progress` |
| Finish today’s route to open practice mode. | 7 | Pass; covered by `archive-gate` |
| Build one continuous route | 5 | Pass |
| Start at the circle / Select one open square beside the last route tile. | 13 | Pass |
| Meet today’s rule / Visit each marker and stay within the tile limit. | 12 | Pass |
| Reach the diamond / Finish the daily route, then play more archive seeds. | 12 | Pass |
| What it does not do / No accounts, rankings, or streak penalties | 10 | Pass |
| Your route progress uses browser storage. | 6 | Pass; covered by `local-progress` |
| The game sends no personal details and loads no third-party scripts. | 11 | Pass; covered by same-origin request-log evidence in `local-progress` |
| Read the privacy details / Draw one short spatial route each day. | 11 | Pass |
| Terms / Built by Param Factory | 5 | Pass |
| v1.0.0 · Generated hero art is disclosed in the design notes. | 10 | Pass |

### README copy

| Copy | Words | Result |
| --- | ---: | --- |
| Route of the Day | 4 | Pass |
| Draw one short route across a new spatial puzzle each day. | 10 | Pass |
| A round is designed to take three to five minutes. | 10 | Pass; covered by `round-duration` |
| Route of the Day is for daily-puzzle players who want a spatial challenge. | 13 | Pass |
| It is free and starts without an account or payment step. | 11 | Pass; covered by `free-access` |
| Play / The live site is route-of-the-day.sociobot.in. | 6 | Pass |
| Select adjacent squares to connect the circle to the diamond. | 10 | Pass |
| Use the exact tile count and meet the daily marker or turn rule. | 13 | Pass |
| Running out of tiles before Finish blocks the route until you undo or restart. | 14 | Pass |
| The puzzle works with keyboard and touch input. | 8 | Pass; covered by `multi-input` |
| Mouse clicks follow the same route rules. | 7 | Pass; covered by `pointer-input` |
| A loaded puzzle remains playable if the browser goes offline. | 10 | Pass; covered by `offline-play` |
| Completing today’s UTC daily route opens non-scored archive practice. | 9 | Pass; covered by `complete-run` |
| An earlier completion does not open it. | 7 | Pass; covered by `archive-gate` |
| Each archive route uses the published seed for an earlier UTC date. | 11 | Pass; covered by `practice-progress` |
| Practice progress is kept separate from the daily route. | 8 | Pass; covered by `practice-progress` |
| Try the isolated demo / Open ?demo=1 or add /demo to the local URL. | 13 | Pass |
| It starts with four route tiles already placed. | 8 | Pass; covered by `demo-ready` |
| Demo progress uses sessionStorage keys beginning with demo:. | 8 | Pass; covered by `demo-ready` |
| It never reads or changes daily progress. | 7 | Pass; covered by `demo-ready` |
| Select Reset demo for a clean sample. | 7 | Pass |
| Controls / Pointer or touch: select an adjacent square. | 7 | Pass |
| Select the previous square to step back. | 8 | Pass |
| Keyboard: focus the board, move with Arrow keys, and place with Enter or Space. | 13 | Pass |
| Backspace: remove the latest route tile. | 6 | Pass |
| Restart puzzle: return to the Start tile. | 7 | Pass |
| Privacy / Progress stays in this browser and the game sends no cross-origin requests. | 11 | Pass; covered by `local-progress` |
| There are no accounts, analytics, ads, remote fonts, or third-party scripts. | 10 | Pass; same-origin request-log evidence and source inventory support this privacy statement |
| See the in-product privacy page and terms. | 7 | Pass |
| Develop and verify / Requirements: Node.js 20 or newer and npm. | 10 | Pass |
| npm install / npm run dev / npm test / npm run build | 10 | Pass |
| npm test runs deterministic core checks and the Playwright claim tests listed in .factory/claims.json. | 14 | Pass |
| The production build lands in dist/, with index.html at its root. | 10 | Pass |
| Route rendering sustains at least 50 frames per second in the test browser. | 13 | Pass; covered by `frame-rate` |
| Deterministic puzzle model / The UTC date chooses one route, its direction, blocked squares, and one rule. | 16 | Pass; plain replacement for prior jargon |
| Each date has a known solution, so every published route can be completed. | 13 | Pass; covered by `reproducible-solution` |
| The game shows the date seed before play and a route code after completion. | 13 | Pass; covered by `seed-route-code` |
| Deploy / Deploy the complete dist/ directory as a static site. | 10 | Pass |
| staticwebapp.config.json provides route fallback, security headers, cache policy, and the 404 response. | 12 | Pass; developer documentation |
| The repository does not manage DNS or infrastructure. | 8 | Pass |
| Project files / visual system, difficulty curve, motion, and asset provenance | 10 | Pass; file description |
| product claims and their exact test commands | 7 | Pass; file description |
| demo data and storage isolation / verification results and known gaps | 10 | Pass; file description |
| Licensed under the MIT License. | 5 | Pass |

## Demo, claims, and sandbox

Fresh live `/?demo=1` opened with four selected tiles, the persistent “Demo — sample data, nothing is saved” banner, and the actual sample board. Selecting the next route tile produced five selected tiles. **Reset demo** returned the board to four. **Start for real** cleared the demo session state and retained a deliberately planted daily `localStorage` sentinel.

The whole live demo run made only same-origin GET requests to `route-of-the-day.sociobot.in`, sent no request bodies, and produced no console or page errors. A loaded live `/demo` puzzle remained playable after its browser context was switched offline.

From a fresh detached clone, `npm ci` completed, `npm test` passed all 23 tests, and all 14 declared claim tests passed. `npm run lint`, `npm run build`, and `npm audit --audit-level=high` also passed; the build produced `dist/`. The claim inventory is complete for the claim-like landing and README statements:

`demo-ready`, `daily-seed`, `round-duration`, `local-progress`, `complete-run`, `archive-gate`, `practice-progress`, `multi-input`, `pointer-input`, `reproducible-solution`, `seed-route-code`, `frame-rate`, `free-access`, and `offline-play`.

## Earlier history recheck

Read in full: `review-1.md`, `polish-1.md`, the prior handoff, and all four verification reports.

| Earlier finding | Live and code recheck |
| --- | --- |
| F-1-1: shared 404 shell | Fixed. A live missing URL returns HTTP 404 with one header, main, and footer; its footer includes Privacy, Terms, Param Factory, and version text. |
| F-1-2: 404 metadata and favicon | Fixed. The live 404 has its own title, description, canonical `/404`, Open Graph/Twitter metadata, favicon, and apple-touch icon. |
| F-1-3: README claim coverage | Fixed. `pointer-input`, `reproducible-solution`, and `seed-route-code` are listed in `claims.json` and their tagged tests pass. |
| F-1-4: implementation jargon | Fixed. README now says, “The UTC date chooses one route, its direction, blocked squares, and one rule.” |

The F-1 findings themselves are fixed, not merely marked fixed. F-2-1 is a new plain-words defect in the repaired 404 heading.

## Structure, accessibility, and leverage

`/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real missing URL were live-checked. Each normal route has its correct per-route title, one h1, one main, description, canonical, Open Graph title, favicon, shared header, and footer. The missing URL returns a genuine 404 with the same skeleton. All internal links crawl successfully; `robots.txt`, `sitemap.xml`, favicon, touch icon, social image, and service worker return 200. Browser back/focus behavior, deep links, 390px targets, and serious/critical Axe checks pass in the clean suite. No console errors occurred on the live landing or demo flow.

The printed-map board, contour texture, mineral palette, clipped panels, route glyphs, and asymmetric desktop layout are distinct from a generic SaaS template and match the documented visual thesis. The brief implies a daily puzzle, an isolated sample, and archive practice; all are present. It does not imply AI assistance, import/export, or sync, so their absence is not missed leverage. No provider key or decorative AI feature is present.

## What would make this perfect

Replace the two “Find your way back to the route” 404 headings with “Page not found.” Re-run the existing 404 structure and accessibility test, then the product can receive a PASS if no new issue is introduced.
