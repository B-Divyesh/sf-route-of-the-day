# Route of the Day — independent verification 2 handoff

## Result: FAIL

- Candidate: `8508a5e3b8e2048b09f21b45ca2216616318681c`
- Live URL: `https://route-of-the-day.sociobot.in`
- Verified: 1 September 2026 UTC
- Full report: [verification-2.md](verification-2.md)

The build, declared claims, core deterministic run, live deployment identity,
accessibility, privacy, offline reload, and performance checks pass. The
candidate still fails the product contract because archive practice is not
actually locked until today's puzzle is complete.

## Release blockers

1. A fresh browser can open `/?practice=1` and play archive seed `2026-08-31`
   before finishing today's seed. The page simultaneously says practice is
   locked.
2. Any old non-empty `route:daily-complete:v1` marker unlocks today's archive;
   the value is not compared with the current UTC seed.
3. The visible archive-lock promise has no effective claim test. The existing
   practice claim also does not assert its published seed.

## Additional defects

- Medium: structurally invalid saved route arrays can produce inconsistent
  tile counts, negative tiles, and no keyboard tab stop in the board.
- Low: Reset demo replaces the focused control and leaves focus on `<body>`.

## Verification summary

```text
npm ci                       PASS (23 packages, 0 vulnerabilities)
all 10 exact claim commands PASS after install
npm run lint                 PASS
npm test                     PASS (17/17)
npm run build                PASS
npm audit --audit-level=high PASS
factory verify-url.sh        PASS
live Axe                     PASS (0 serious/critical)
Lighthouse mobile            97 / 100 / 100 / 100
active 390px, 4× CPU fps     61 minimum across five samples
```

The production build contains 21.82 KB JavaScript (7.92 KB gzip), 13.82 KB CSS
(3.99 KB gzip), and 67.44 KB route artwork. Live HTML, JS, CSS, service worker,
and 404 bytes match the rebuilt candidate exactly. Unknown routes return a real
404. All observed network traffic was same-origin GET traffic; there is no
backend, sign-in, payment, or product-unlock endpoint.

## Evidence

- Release blocker: `evidence/archive-gate-bypass.png`
- Cold screens: `evidence/first-screen-desktop.png`,
  `evidence/first-screen-mobile.png`
- Scripted states: `evidence/live-loss-state.png`,
  `evidence/live-end-screen.png`
- Lighthouse: `evidence/lighthouse-mobile-2.json`
- Factory URL check: `evidence/verify-url/verify.json`

## Next verification

After repair, start from empty storage and prove `/` hides archive, direct
`/?practice=1` redirects or refuses access, yesterday's completion does not
unlock today, and only a completion marker equal to today's UTC seed opens
practice. Then rerun every declared claim and the full matrix in
`verification-2.md`.

No product code or infrastructure was modified by this verification.
