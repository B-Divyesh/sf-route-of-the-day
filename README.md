# Route of the Day

Draw one short route across a new spatial puzzle each day. A round is designed to take three to five minutes.

Route of the Day is for daily-puzzle players who want a spatial challenge. It is free and starts without an account or payment step.

## Play

The live site is [route-of-the-day.sociobot.in](https://route-of-the-day.sociobot.in).

Select adjacent squares to connect the circle to the diamond. Use the exact tile count and meet the daily marker or turn rule. Running out of tiles before Finish blocks the route until you undo or restart.

The puzzle works with keyboard and touch input. Pointer input uses the same route rules. A loaded puzzle remains playable if the browser goes offline.

Completing today’s UTC daily route opens non-scored archive practice. An earlier completion does not open it. Each archive route uses the published seed for an earlier UTC date.
Practice progress is kept separate from the daily route.

## Try the isolated demo

Open [`/demo`](https://route-of-the-day.sociobot.in/demo) or add `/demo` to the local URL. It starts with four route tiles already placed.

Demo progress uses `sessionStorage` keys beginning with `demo:`. It never reads or changes daily progress. Select **Reset demo** for a clean sample.

## Controls

- Pointer or touch: select an adjacent square. Select the previous square to step back.
- Keyboard: focus the board, move with Arrow keys, and place with Enter or Space.
- Backspace: remove the latest route tile.
- Restart puzzle: return to the Start tile.

## Privacy

Progress stays in this browser and the game sends no cross-origin requests. There are no accounts, analytics, ads, remote fonts, or third-party scripts.

See the in-product [privacy page](https://route-of-the-day.sociobot.in/privacy) and [terms](https://route-of-the-day.sociobot.in/terms).

## Develop and verify

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
npm test
npm run build
```

`npm test` runs deterministic core checks and Playwright claim tests. The test suite solves complete routes with keyboard, touch, and pointer input.

The production build lands in `dist/`, with `index.html` at its root. Route rendering sustains at least 50 frames per second in the test browser.

## Deterministic puzzle model

The UTC date is the daily seed. A seeded hash selects a route skeleton, rotation, reflection, obstacles, and one rule. The generator starts from a known solution, so the published route remains reproducible. The browser shows the seed before play and the route code after completion.

## Deploy

Deploy the complete `dist/` directory as a static site. `staticwebapp.config.json` provides route fallback, security headers, cache policy, and the 404 response. The repository does not manage DNS or infrastructure.

## Project files

- `.factory/design.md`: visual system, difficulty curve, motion, and asset provenance.
- `.factory/claims.json`: product claims and their exact test commands.
- `.factory/demo.md`: demo data and storage isolation.
- `.factory/handoff.md`: verification results and known gaps.

Licensed under the [MIT License](LICENSE).
