# Touchline Replay 90 - Contest Strategy

## 1. Competition Reading

Competition URL: https://daker.ai/public/hackathons/world-cup-manager-tactics-web-challenge

Core requirement:
- Build and deploy a dynamic web service using World Cup data.
- Let the user feel like a football manager through direct dragging, clicking, placing, and manipulating tactics.
- Planning PDF must include service overview, manager-experience design intent, page structure, core interaction spec, data usage, and main user flow.
- Final submission requires deployed URL, GitHub repo, and YouTube demo.

Evaluation fit:
- Novelty, 30 points: distinct concept and new experience.
- Manager experience, 25 points: immersive "I am the manager" feeling and intuitive manipulation.
- Completeness, 25 points: dynamic functions work reliably.
- Planning/implementation consistency, 20 points: clear intent and execution structure.

Absolute dates from the competition brief:
- Planning PDF deadline: 2026-07-27 10:00.
- Final URL/GitHub/video deadline: 2026-08-03 10:00.
- Public vote: 2026-08-03 12:00 to 2026-08-10 10:00.
- Internal review: 2026-08-10 10:00 to 2026-08-18 23:59.

## 2. Research Snapshot

Most existing tactical tools cluster around three patterns:
- Formation builders: create, manage, and share lineups on a tactical board.
- Tactical drawing boards: draw movements, create static schemes, export images or animations.
- Coach sharing tools: browser-based drag/drop formations and share links for teams.

Observed gap:
- They are useful tools, but most stop at "make a board".
- The contest asks for manager immersion. A stronger entry should create pressure, context, consequence, and a satisfying result screen.

Useful references:
- Formation Builder positions itself around lineup creation, custom formations, Tactical Studio, AI assistant, and live match tracking: https://formationbuilder.com/en-US
- tactical-board.com highlights static schemes, dynamic animations, link sharing, and video export: https://tactical-board.com/
- Tactico emphasizes no-download drag/drop tactics, team sharing, set pieces, and desktop/tablet board work: https://tactico.pro/soccer-tactics
- OpenFootball worldcup.json provides public-domain World Cup JSON with no API key and CC0 licensing: https://github.com/openfootball/worldcup.json
- The Fjelstul World Cup Database offers richer historical World Cup tables under CC-BY-SA 4.0, useful only if we accept attribution and share-alike duties: https://github.com/jfjelstul/worldcup

## 3. Idea Bank

1. Classic tactical board
   - Drag players onto a pitch and save/share the lineup.
   - Low implementation risk, but low novelty.

2. Opponent weakness board
   - Pick an opponent and see vulnerable zones, then build a counter-tactic.
   - Good data fit, needs clear visual feedback.

3. "If I were the manager" match replay
   - Enter a real World Cup match at a decisive minute, change tactics, and simulate the next phase.
   - Best manager immersion and strongest storytelling.

4. Live touchline mode
   - Timeline triggers match events and the user must react under a clock.
   - Very immersive, but scope must be contained.

5. Set-piece lab
   - Build corners/free kicks with player runs and expected danger score.
   - Strong interaction, narrower scope.

6. Tactical courtroom
   - Compare the real manager's decision with the user's decision and explain tradeoffs.
   - Memorable, but risks feeling more like analysis than play.

7. AI assistant coach
   - The assistant recommends formation, roles, and substitutions.
   - Useful, but external API keys would hurt judging. Better as a local rules engine.

8. Coach personality card
   - Result screen shows "pressing romantic", "risk-balancer", "set-piece architect".
   - Great for public voting and shareability.

9. Group-stage campaign mode
   - Manage three World Cup group games and optimize points.
   - Engaging, but larger build.

10. Substitution duel
   - Limited to bench choices and formation changes after a match event.
   - Compact, but less visually rich than full board control.

11. Tactical heat-map puzzle
   - Place players to cover dangerous opponent zones.
   - Easy to understand, good scoring, less emotional.

12. Broadcast replay result
   - After simulating, generate a short "commentary replay" and tactical report.
   - Strong emotional payoff and demo value.

## 4. Chosen Concept

Product name:
- Touchline Replay 90
- Korean title: 터치라인 리플레이 90

One-line pitch:
- "실제 월드컵 경기의 결정적 순간에 감독으로 투입되어, 선수를 드래그하고 전술 지시를 바꾼 뒤 나만의 경기 결과와 감독 리포트를 받는 웹 전술 시뮬레이터."

Core loop:
1. Choose a World Cup scenario.
2. Read the match briefing.
3. Drag players, set roles, change formation, and adjust tactical sliders.
4. Run a short simulation.
5. Receive a manager score, tactical report, and shareable coach card.

Why this can win:
- It combines a familiar tactical board with pressure, consequence, and story.
- It demonstrates visible dynamic interaction in the first minute.
- It avoids runtime API keys by using local JSON and a deterministic tactics engine.
- It produces a satisfying result screen for demo video and public vote.

## 5. MVP Scope

Must ship:
- Scenario selection with 3 curated World Cup match situations.
- Interactive pitch with draggable player tokens.
- Formation presets: 4-3-3, 4-2-3-1, 3-4-3, 4-4-2, 3-5-2.
- Player cards with position, role, stamina, traits, and simple stats.
- Substitution by dragging bench players onto the pitch.
- Tactical controls: pressing line, tempo, width, risk level, attacking side.
- Opponent overlay: danger zones and weak zones.
- "Run 15-minute simulation" button.
- Result report: coach score, objective success, key tactical reasons, share card.
- Local save with no sign-up.

Should ship:
- Timeline with decision windows.
- Before/after comparison against the real match baseline.
- Touch-friendly tab layout for mobile.
- Export/share as image or encoded URL state.

Could ship:
- Animated player movement preview.
- Local rules-based assistant coach.
- Multiple objectives per scenario.
- Public gallery mode.

Not in MVP:
- Real-time live World Cup updates.
- Paid or key-based APIs.
- Player photos or official team logos.
- Full 90-minute physics simulation.

## 6. Scoring Strategy By Criterion

Novelty, 30:
- Sell "scenario replay with consequences", not just a formation board.
- Include manager persona card and tactical commentary as a memorable ending.

Manager experience, 25:
- Start directly in the match desk, no long landing page.
- Keep the pitch central and interactive.
- Make every action explain its effect through risk/probability meters.

Completeness, 25:
- Use static JSON and deterministic local logic.
- Limit MVP to 3 scenarios and make them polished.
- Ensure no login, no API key, and no fragile dependencies.

Planning/implementation consistency, 20:
- Match this document package directly to the app architecture.
- Keep labels, flows, and demo video aligned with the PRD.

## 7. Public Vote Hook

Public voters need a fast "I want to try this" reason:
- "Can you out-coach the real World Cup manager in 3 minutes?"
- Result card encourages replay and sharing.
- Scenarios should include recognizable World Cup moments without using copyrighted photos/logos.

## 8. Demo Video Script

0:00-0:10 - Open app, choose a decisive World Cup scenario.
0:10-0:30 - Read briefing and objective.
0:30-0:55 - Drag players into a new formation.
0:55-1:15 - Make a substitution and adjust pressing/tempo.
1:15-1:35 - Turn on opponent overlay and show risk meters changing.
1:35-1:55 - Run simulation.
1:55-2:20 - Show manager report and share card.
2:20-2:30 - Quick montage of other scenarios.

