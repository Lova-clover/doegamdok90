# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Product Decisions

- Selected visual direction: Broadcast War Room, the first displayed ImageGen option.
- Playable scope: six rights-safe 2018 and 2022 World Cup decision scenarios, including Korea Republic vs Portugal at 65'.
- Core promise: choose a heartbreaking match, change the tactic, watch the causal replay, then compare Real Match vs My Call vs Coach Pick.
- Runtime must use local deterministic data and must not require an account, paid API, or API key.
- Match archive identity uses country flag vs country flag, never player photography.
- Pitch and replay players use broadcast-style kit markers built from national colors, real shirt numbers, and names; never map an unrelated synthetic face to a real player.
- A real portrait may render only when its exact photo license, attribution, rights clearance, and permission reference are all recorded in player data.
- Replay motion should be continuously interpolated, with an unmistakable goal beat instead of abrupt frame stepping.
- Editing should make the current player, next action, and resulting metric change obvious at a glance.
- Formation changes must reassign players by tactical role instead of preserving a positionally incorrect array index.
- Archive and simulation overlays lock background scrolling; phase changes return the document to the top.
- Player movement must work with pointer drag and direct arrow-key nudging.
- Public copy must identify the product as an unofficial fan simulation and distinguish official match facts from model xG, ratings, and simulated outcomes.
- The first clean visit starts with Korea Republic vs Portugal at 65' and marks it as the recommended first play.
- The first clean CTA applies the explainable winning coach plan so a judge can reach the fate fork, goal, and report in about 60 seconds.
- Keep the counterfactual fate fork visible across the board, simulation ready state, live replay, and manager report so the causal promise never disappears below the fold.
- The manager report generates a shareable challenge code and deep link. A received challenge must open the same scenario and target score from a fresh initial tactic, ignoring locally saved tactics for fairness.
- Auto-created scenario sessions are not evidence that the user entered a match. Keep `enteredScenarioIds` separate so the first 60-second CTA survives reload until an actual entry.
- When a tactical edit does not change the projected score, surface the xG delta and causal explanation immediately so the action still feels consequential.
- Compact desktop layouts must preserve the match header, board, cause-and-effect strip, and primary simulation CTA; hide only duplicated secondary timeline content when height is constrained.
- A live-call selection must never shift the ready overlay away from the top of its scroll container.
- Replay waypoints use hollow translucent rings so they cannot be mistaken for extra balls.
- Mobile match-plan and report challenge content stacks vertically and must not depend on hidden horizontal scrolling.
- A received challenge keeps its target visible through matchday, board, replay, and report, and the report must judge success, tie, or remaining gap against that incoming target.
- Public product name: `되감독 90`. Pronunciation and concept come from `되감기 + 감독`; the fixed tagline is `그 경기를 되감고, 내가 감독이 된다.`
- Keep the legacy `touchline-replay-90:sessions:v4` local-storage key so the public rename does not erase saved sessions. New challenge codes use the `DG90` prefix, while incoming legacy codes remain accepted.
- The compact mobile top bar must keep the Korean product name visible; never collapse the brand to an unlabeled icon.
