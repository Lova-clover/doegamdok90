# Contributing

Thanks for helping improve 되감독90.

## Development

```bash
cd app
npm ci
npm test
npm run dev
```

Before opening a pull request, run `npm test` and `npm run build` from `app/`.

## Pull requests

- Keep changes focused and explain the user-visible effect.
- Add or update tests for simulation rules and scoring changes.
- Do not add player photographs, team crests, broadcast captures, sponsor marks, or unlicensed audio.
- Clearly separate sourced match facts from generated model values.
- Include desktop and mobile screenshots for visual changes.
- Preserve keyboard access, readable contrast, and reduced-motion behavior.

## Data changes

For a new scenario, include the official source URL, the exact factual fields used, a neutral description, and tests covering at least one successful tactical path. Ratings, xG, tactical scores, and outcomes must be labeled as local simulation values.

## Security

Do not report security concerns in a public issue. Follow [`SECURITY.md`](SECURITY.md).
