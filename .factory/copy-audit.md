# Landing-page copy audit

Audited 2 September 2026 after polish 3. Counts treat hyphenated terms, route names, dates, and route codes as one word. Dynamic rules use the longest shipped form.

## Header and first screen

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to the puzzle | 4 | Pass |
| Route of the Day | 4 | Pass |
| Daily / Demo / How it works / Privacy | 6 | Pass |
| A new spatial puzzle every day | 6 | Pass; `daily-date` |
| Draw today’s spatial route | 4 | Pass |
| For daily-puzzle players who want a short route challenge without words or an account. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a half-finished sample puzzle. | 5 | Pass |
| Free to play / No account / Progress stays in this browser | 10 | Pass; `free-access`, `local-progress` |
| Today’s route / Connect Start to Finish / Date [UTC date] | 8 | Pass; `daily-date`, `date-route-code` |
| Use exactly 10 tiles and make 5 turns. | 8 | Pass |
| Start / Finish / Blocked / Tiles left | 5 | Pass |
| Choose a square beside Start. | 6 | Pass |
| Undo tile / Restart puzzle | 4 | Pass; `tile-limit` |
| Keyboard: use Arrow keys, then Enter or Space. | 8 | Pass |
| Backspace removes a tile. | 4 | Pass; `route-undo` |
| The tile limit is reached. Step back and try another route. | 11 | Pass; `tile-limit` |
| Removed the last tile. | 4 | Pass; `route-undo` |
| Route complete / You connected both landmarks in [number] tiles. | 10 | Pass |
| Published solution: [route code] | 2 plus code | Pass; `date-route-code` |

Read-aloud check: “Draw today’s spatial route. Try it with sample data.” It names the task and next action in one breath.

## Product, archive, privacy, and footer

| Copy | Words | Result |
| --- | ---: | --- |
| Everyone gets the same route for each UTC date. | 9 | Pass; `daily-date` |
| Practice archive / Play a route from an earlier date | 10 | Pass |
| Practice uses routes from earlier dates and does not change today’s route. | 12 | Pass; `practice-progress` |
| Finish today’s route to open practice mode. | 7 | Pass; `archive-gate` |
| Build one continuous route | 4 | Pass |
| Start at the circle / Select one open square beside the last route tile. | 13 | Pass |
| Meet today’s rule / Visit each marker and stay within the tile limit. | 12 | Pass; `tile-limit` |
| Reach the diamond / Finish today’s route, then play routes from earlier dates. | 12 | Pass |
| What it does not do / No accounts, rankings, or streak penalties | 11 | Pass; `privacy-surface` |
| Your route progress uses browser storage. | 6 | Pass; `local-progress` |
| The game sends no personal details and loads no third-party scripts. | 11 | Pass; `privacy-surface` |
| Read the privacy details | 4 | Pass |
| Draw one short spatial route each day. | 7 | Pass |
| Terms / Built by Param Factory | 5 | Pass |
| v1.0.0 · Generated hero art is disclosed in the design notes. | 10 | Pass; provenance disclosure |

## Terminology

| Concept | Required word |
| --- | --- |
| A selected sequence of squares | route |
| One selected square | tile |
| The shared daily identifier | date |
| Non-daily mode | archive practice |
| Starting landmark | Start / circle |
| Ending landmark | Finish / diamond |
| Impassable square | blocked |
| Isolated sample experience | demo |

No audited line exceeds 22 words or includes a banned marketing term. Player-facing copy uses **date**, never seed.

## Catalog description

“Draw a short route through a new spatial puzzle every day.” — 11 words, 56 characters, starts with a verb.
