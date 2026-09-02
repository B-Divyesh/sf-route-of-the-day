# Route of the Day — review 1 handoff

## Result: FAIL

This review changed no product code or deployment. It added the committed adversarial report at [review-1.md](review-1.md).

## Verified

- Cold live desktop and 390px first-read checks are clear and tryable.
- `/demo` opens half-finished, resets, isolates `demo:` session storage, leaves daily storage untouched, and clears demo storage when starting for real.
- Fresh and stale archive markers are denied; today’s marker opens archive.
- All 11 declared claim commands passed after `npm ci`.
- `npm test` passed 19 tests; lint, build, and high-severity audit passed.
- Earlier verification findings were rechecked and are fixed.

## Remaining work

1. Add the common header/footer to the real static 404 page.
2. Add canonical, OG/Twitter, and favicon metadata to that page.
3. Add tagged claim tests for remaining README promises or remove the promises.
4. Replace the README’s “seeded hash” jargon with player language.

## Verify

```sh
npm ci
npm test
npm run lint
npm run build
```

Also check `/demo` in a fresh browser context and an unknown live URL such as `https://route-of-the-day.sociobot.in/definitely-missing`.
