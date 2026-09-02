# Independent product verification 3 — PASS

## Scope

- Candidate: `04e99626fdb530c3b2d8986e36aa30190a55cbfd` (`fix: enforce daily archive gate`)
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 2 September 2026 UTC
- Work order: `route-of-the-day-verify-3`
- Decision: **PASS**

This was a clean-checkout verification of the requested candidate. No product
code or product infrastructure was changed.

## Mandatory claim gate

After `npm ci`, every exact command in `.factory/claims.json` passed through
the configured demo-capable Playwright entry point. A subsequent `npm test`
passed all 19 tests (`test-results/.last-run.json` reports `status: passed`).

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-ready` | Pass | `/demo` opens with four sample tiles; reset restores four; storage is `demo:` session storage. |
| `daily-seed` | Pass | Fresh contexts receive the same UTC date seed and solution. |
| `round-duration` | Pass | 100 representative puzzles meet the documented 180–300 second pace model. |
| `local-progress` | Pass | A daily tile survives reload; request origins remain same-origin. |
| `complete-run` | Pass | A daily solution reaches the end screen, restarts, and opens archive practice. |
| `archive-gate` | Pass | Fresh and stale-marker contexts are denied; only today's exact seed opens archive practice. |
| `practice-progress` | Pass | Practice uses the prior UTC seed and does not change daily storage. |
| `multi-input` | Pass | Keyboard and 390px touch scripted runs both complete. |
| `frame-rate` | Pass | Browser requestAnimationFrame count is at least 50 in one second. |
| `free-access` | Pass | Daily board starts without account, purchase, or subscription UI. |
| `offline-play` | Pass | A loaded demo accepts the next tile while offline. |

The manifest covers all material public claims in the landing page and README.

## First-read and game QA

Cold live desktop and 390px loads pass the mandatory first-read test. The page
says what it does (“Draw today’s route”), who it is for (daily-puzzle players
seeking a short spatial challenge), and what to do first (**Try it with sample
data**, which says it opens a half-finished sample). The first desktop screen
contains the live playable board, not a menu wall. The 390px screen shows the
game card, goal, rule, and top of the grid below the action with no horizontal
overflow.

I played a live deterministic run from title through active play to the real
end screen. On 2 September the seed was `2026-09-02`: connect Start to Finish
in exactly nine tiles while passing the ring marker. The published solution
reached “Route complete”; **Play this route again** reset to one Start tile;
replay then opened archive seed `2026-09-01`. Direct practice from fresh and
yesterday-marker storage recovered to the daily route. Invalid practice values
also recover safely.

Separately, clicking the live sample action opened the persistent “Demo —
sample data, nothing is saved” banner and four sample tiles. A blocked move
gave the correct recovery message; reset restored the sample; Start for real
cleared demo keys. The claim suite independently completes keyboard and touch
runs. No setting is advertised; local browser storage persists game progress.

## Local and performance gates

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 23 packages installed, 0 reported vulnerabilities. |
| 11 exact claims commands | Pass. |
| `npm test` | Pass; 19/19. |
| `npm run lint` | Pass (`tsc --noEmit`). |
| `npm run build` | Pass; creates `dist/`. |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities. |

Built JavaScript is 22,515 bytes raw / 8,194 bytes gzip; CSS is 13,817 bytes
raw / 4,001 bytes gzip; the hero WebP is 67,436 bytes; there are no remote
fonts. Lighthouse mobile on the live URL: Performance 98, Accessibility 100,
Best Practices 100, SEO 100, LCP 0.9 seconds, CLS 0.

## Accessibility, privacy, and deployment

Live Axe checks on `/`, `/demo`, `/privacy`, `/terms`, and the HTTP-404 page
found zero serious or critical violations. The routes have `lang=en`, correct
titles, one `h1`, and one `main`. Normal live game flow had no console or page
errors. Keyboard coverage includes skip link, visible focus, roving grid,
Arrow/Enter play, reset/end focus, and back-navigation restoration. Reduced
motion is respected.

The complete live play-flow request log contained only
`https://route-of-the-day.sociobot.in`; no analytics, third-party scripts,
remote fonts, account, payment, or cross-origin requests occurred. Live
responses include a same-origin CSP with response-header `frame-ancestors
'none'`, HSTS, nosniff, strict-origin referrer policy, and locked permissions.
HTML caches for 30 seconds; hashed JS/CSS are immutable for one year. `/`,
`/demo`, `/privacy`, and `/terms` return 200; an unknown path returns the
designed 404. This static game has no backend endpoint or sign-in, so rate-limit
and identity-provider checks do not apply.

The offline claim-tested loaded-puzzle behavior works. The product is not
presented as a separately installable PWA.

## Live identity and defects

The deployed app names the candidate’s `index-qLr123PF.js` and
`index-BeIPPYuh.css`. Fresh SHA-256 comparisons matched the rebuilt candidate
byte-for-byte for HTML, JavaScript, CSS, and service worker. Representative
digests: JavaScript `c2babf4a8b0d4677a16d99aa79f9cdda1ca89262903be57450b766742500bd79`,
CSS `35ba14dcbbf92551ed4cfb01495f98d67688fa2d38c502daae0c37a7a49a4956`,
and service worker `5148b91848a54886b4e1f79ba191db146cdb96d1ae32c4b588cb6b862f586a02`.

No acceptance-blocking defects were found. Earlier archive-gate, saved-route,
and demo-focus findings are covered by this candidate and were not reproducible.
