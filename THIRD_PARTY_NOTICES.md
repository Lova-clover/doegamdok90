# Third-Party Notices

This file summarizes direct third-party dependencies used by 되감독90. It is provided for convenience and does not replace the license files shipped with each package. Exact versions and transitive dependencies are recorded in `app/package-lock.json` and `video/package-lock.json`.

## Web application

| Package | Purpose | License |
| --- | --- | --- |
| React / React DOM 19.2.0 | User interface runtime | MIT |
| Vite 6.4.x / `@vitejs/plugin-react` 5.0.4 | Development and production build | MIT |
| `@dnd-kit/core` 6.3.x / `@dnd-kit/utilities` 3.2.x | Drag interaction | MIT |
| `@phosphor-icons/react` 2.1.x | Interface icons | MIT |
| `country-flag-icons` 1.6.x | ISO country flag components | MIT |

Copyright and full license text remain available in each installed package and its linked upstream repository.

## Video project

| Package | Purpose | License |
| --- | --- | --- |
| Remotion / `@remotion/cli` 4.x | Programmatic video composition and rendering | Remotion License |
| edge-tts 7.2.8 | Build-time Korean neural narration generation | LGPL-3.0 |
| React / React DOM 19.2.0 | Video component runtime | MIT |
| NumPy 1.26.4 | Build-time generation of original stadium ambience | BSD-3-Clause |

Remotion is **not** distributed under the project's MIT license. The installed Remotion 4 package grants free use to eligible individuals, organizations with up to three employees, non-profits, and qualifying evaluations; other organizations may require a company license. The complete terms are shipped at `video/node_modules/remotion/LICENSE.md` after installation and are available from [Remotion](https://www.remotion.dev/).

## Assets and factual sources

Country flags, generated project assets, factual match references, and the project's no-portrait policy are documented in [`docs/14-assets-and-license.md`](docs/14-assets-and-license.md). No third-party photograph, match footage, broadcast capture, player voice, or commercial music is bundled.

## No endorsement

The presence of a package or factual source does not imply that its author or publisher endorses 되감독90.
