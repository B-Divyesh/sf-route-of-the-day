# Demo sandbox

- URL: `https://route-of-the-day.sociobot.in/?demo=1` or `https://route-of-the-day.sociobot.in/demo` (both load the same isolated sample)
- Sample: deterministic seed `sample-map-7`, opened with its first four route tiles already placed.
- Reset: select **Reset demo** in the persistent yellow banner.
- Leave: select **Start for real**. This removes all demo keys before opening the daily puzzle.
- Storage: demo state uses `sessionStorage` keys prefixed with `demo:`. It never reads or writes daily `localStorage` keys.
- Network: the sample and generated puzzle ship with the app. No account or external request is needed.
