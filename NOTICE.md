# 되감독90 - Rights and Attribution Notice

Last updated: 2026-08-01
Repository: <https://github.com/Lova-clover/doegamdok90>

## 1. Project status

되감독90 is an unofficial, non-commercial fan simulation created for the DAKER World Cup manager tactics web challenge. It is not affiliated with, endorsed by, or sponsored by FIFA, DAKER, any national football association, team, player, or broadcaster.

This notice explains the boundary between code released under MIT, original project materials that are not released under MIT, public factual information, and third-party works.

## 2. MIT-licensed source code

The unmodified MIT License in [`LICENSE`](LICENSE) applies to the original source code in:

- `app/src/`
- `app/test/`
- `app/index.html`
- `app/vite.config.mjs`
- `video/src/`
- original build and automation configuration unless a file states otherwise

SPDX identifier: `MIT`

The MIT license grant does not imply endorsement by the project owner, the competition organizer, any football organization, or any person represented by factual roster information.

## 3. Materials outside the MIT grant

Unless a file includes a separate license notice, the following are not licensed under MIT:

- the `되감독90` name, wordmark, visual identity, tagline, and challenge code `DG90`;
- curated match narratives, mission design, player ratings, scenario copy, and simulation tuning values;
- generated stadium, pitch, presentation, thumbnail, and video image assets;
- synthesized audio renders;
- planning documents, presentation files, screenshots, and rendered videos;
- third-party packages, icons, and country flags.

All rights in original excluded materials are reserved by their respective rightsholders. Permission given under the DAKER competition rules remains effective according to those rules.

## 4. Factual information and model output

- Dates, scores, scorers, substitutions, and match context are small factual excerpts manually curated from linked official match reports.
- Source pages are linked for attribution. Articles, photographs, footage, logos, event emblems, broadcast graphics, and databases are not copied wholesale.
- No ownership is claimed over public facts themselves. This project may claim rights only in its original selection, arrangement, copy, code, and model design where legally available.
- Player ratings, xG, tactical metrics, manager scores, and simulated outcomes are deterministic local experience-model values. They are not official statistics, scouting reports, betting advice, or predictions.
- Player and team descriptions are neutral and are not intended to demean or defame any person, team, or country.

## 5. People, marks, and media

- No real player photographs, synthetic lookalikes, voices, signatures, team crests, FIFA marks, sponsor marks, or broadcast captures are included.
- Players are represented by names, shirt numbers, positions, national colors, and generic shirt markers.
- Country flags are rendered through the MIT-licensed `country-flag-icons` package.
- Stadium and pitch assets were generated specifically for this project and reviewed to exclude logos, text, recognizable players, and sponsor branding.
- Crowd audio is synthesized locally from code and contains no external recording or sample.

Player names, country names, match names, and scores are used descriptively to identify historical match context. Such descriptive use does not imply affiliation or endorsement.

## 6. Third-party software

Dependencies remain subject to their respective licenses. Direct dependencies and notable terms are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md); exact versions and transitive packages are locked in `app/package-lock.json` and `video/package-lock.json`.

In particular, Remotion uses its own license rather than MIT. Eligibility and use must be evaluated against the versioned license shipped in the installed Remotion package.

## 7. Generated assets

Generated assets were commissioned specifically for this project using generative tooling. They were manually reviewed for visible logos, sponsor marks, text artifacts, and recognizable real persons. Generation does not eliminate the possibility of third-party rights; a good-faith correction or takedown process therefore remains available.

## 8. Competition terms

Participation in the DAKER challenge may grant the sponsor a competition-specific license if the project receives an award. Where those accepted rules conflict with this repository notice for that granted use, the competition rules control.

## 9. Corrections and takedown

For a factual correction, rights concern, attribution issue, or takedown request, open a GitHub issue with:

1. the affected file, screen, or URL;
2. the factual or legal basis of the request;
3. supporting material where available;
4. a safe method to contact the requester.

Good-faith requests will be reviewed promptly. Security vulnerabilities should be reported using [`SECURITY.md`](SECURITY.md), not a public issue.

## 10. Practical reuse guide

| Intended use | Required action |
| --- | --- |
| Fork or modify the original source code | Keep the MIT copyright and license notice; clearly identify modifications. |
| Reuse a third-party dependency | Follow that dependency's own license, including the Remotion terms where applicable. |
| Reuse the project name, `DG90`, visual identity, generated assets, PDF, screenshots, or rendered video | Obtain separate permission from the applicable rightsholder. |
| Reuse historical match facts | Verify the facts independently, cite an appropriate source, and do not copy protected editorial or media content. |
| Publish simulation metrics or outcomes | Label them as unofficial model output and do not imply endorsement, prediction accuracy, or official status. |

Nothing in this notice grants trademark, publicity, privacy, database, image, music, broadcast, or endorsement rights that the project owner does not hold. This notice is a project rights statement, not legal advice.
