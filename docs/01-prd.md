# PRD - Touchline Replay 90

## 1. Product Summary

Touchline Replay 90 is a browser-based World Cup tactical simulator. The user enters a decisive match moment as the manager, manipulates lineup, formation, roles, substitutions, and tactical instructions, then receives a simulated outcome and a manager report.

The service is designed for a hackathon environment:
- No account required.
- No paid API key required.
- Playable in a browser.
- Fast to understand, visual, and satisfying within 3 minutes.

## 2. Problem

Football fans often think:
- "If I were the manager, I would change the formation."
- "That substitution should have happened earlier."
- "They should attack the weak side."

Most existing lineup tools let users arrange players, but they do not answer the emotional question:
- "Would my decision have worked?"

## 3. Product Goal

Create an interactive experience where users feel like a manager making meaningful World Cup decisions under match context.

Primary goal:
- Let users build a tactic and immediately see the tactical consequence.

Secondary goals:
- Make World Cup data feel concrete through scenarios.
- Make the result shareable for public voting.
- Keep the build stable enough for judging.

## 4. Target Users

Primary user:
- Football fan who watches World Cup matches and enjoys debating tactics.

Secondary user:
- Hackathon judge who needs to understand the core interaction quickly.

Tertiary user:
- Casual voter who may not know tactics deeply but can enjoy the scenario and result card.

## 5. Jobs To Be Done

When I remember a World Cup match,
I want to step into the manager role and change the tactic,
so I can see whether my idea would have improved the outcome.

When I move players on the board,
I want instant feedback about risk, spacing, and attacking routes,
so I feel my choices matter.

When I finish a scenario,
I want a clear result and tactical explanation,
so I can compare my decision with the real match and share my coach identity.

## 6. Manager Experience Principles

1. Start in the match, not on a marketing page.
   - First screen should be scenario cards and an active match desk.

2. Every interaction must have feedback.
   - Dragging a player changes spacing and role-fit meters.
   - Tactical sliders update risk and chance indicators.

3. Consequence beats complexity.
   - The simulator does not need full realism.
   - It must clearly explain why a decision helped or hurt.

4. The user should never feel blocked.
   - Presets, auto-fix, and reset are always available.
   - Invalid states are explained in plain Korean.

5. The ending must feel rewarding.
   - The report should read like a broadcast/tactical desk recap.
   - The share card should make users want to replay.

## 7. Core User Value

Functional value:
- Build tactics visually.
- Test tactical decisions.
- Learn tradeoffs through feedback.

Emotional value:
- Feel the pressure of the touchline.
- Experience "my decision changed the match".
- Get a personal manager identity.

Competition value:
- Strong concept clarity for judges.
- Distinctive story for public vote.
- Stable implementation scope.

## 7.1 Winning Feature Upgrade

The product should be presented as a counterfactual manager simulator, not a generic tactics board.

Four named features carry the winning concept:

1. Decision Moment Card
   - A scenario card with minute, score, mission, constraint, and real match baseline.
   - Example: "67', 1-1, 승리가 필요하다. 중앙 역습을 막으면서 결승골 루트를 만들어라."

2. Coach Room Trio
   - Three local rule-based staff voices: head coach, analyst, physical coach.
   - They give tactical advice without relying on external AI APIs.

3. Fate Meter
   - A headline "운명 변화" score that shows how much the user's tactic shifts the match compared with the real baseline.
   - Easier to understand than only showing attack/defense numbers.

4. Real vs Me vs Coach Report
   - Final report compares the real match, the user's decision, and a rules-based coach recommendation.
   - This is the main novelty hook for judges.

## 8. Pages And Views

### 8.1 Match Desk

Purpose:
- Let the user pick a scenario and understand the match state.

Content:
- Scenario cards.
- Match minute, score, team, opponent.
- Decision Moment Card: mission, constraint, real baseline.
- Objective: protect lead, chase goal, break low block, survive press.
- Key event timeline.

Primary action:
- "감독석에 앉기"

### 8.2 Tactics Board

Purpose:
- Main interactive workspace.

Content:
- Central pitch.
- Draggable starting XI tokens.
- Bench list.
- Formation preset buttons.
- Tactical instruction panel.
- Coach Room Trio advice.
- Fate Meter and score deltas.
- Opponent danger/weakness overlay.

Primary actions:
- Drag player.
- Change formation.
- Assign role.
- Substitute.
- Adjust tactical sliders.
- Run simulation.

### 8.3 Simulation Moment

Purpose:
- Give a short sense of consequence.

Content:
- Animated timeline from current minute to target minute.
- Key simulated event cards.
- Meter changes: chance quality, defensive stability, fatigue, risk.

Primary action:
- "결과 보기"

### 8.4 Manager Report

Purpose:
- Summarize result and make it shareable.

Content:
- Coach score out of 100.
- Fate Shift compared with real baseline.
- Scenario objective success/failure.
- Tactical reasons.
- Real vs Me vs Coach comparison.
- Manager persona card.
- Replay and share actions.

## 9. MVP Scenarios

Scenario A - Protect The Lead
- Match state: leading by 1 goal in the second half.
- Objective: reduce opponent chance quality while keeping counter threat.
- Best user behavior: lower risk, strengthen rest defense, use fresh winger/defender.

Scenario B - Need A Goal
- Match state: trailing by 1 goal after 60 minutes.
- Objective: increase chance creation without collapsing defensively.
- Best user behavior: attack opponent weak side, increase tempo, add second striker or attacking midfielder.

Scenario C - Break The Low Block
- Match state: tied against defensive opponent.
- Objective: create central or half-space overloads.
- Best user behavior: width, inverted fullback or extra midfielder, patient tempo, set-piece focus.

The actual app may label scenarios with real World Cup teams/matches if data and attribution are safe. Player ratings can be curated/dummy values inspired by public facts.

## 10. Functional Requirements

FR-1. Users can select a scenario.
FR-2. Users can choose a formation preset.
FR-3. Users can drag player tokens on the pitch.
FR-4. Users can drag a bench player onto a starting player to substitute.
FR-5. Users can select a player and assign a role.
FR-6. Users can adjust tactical sliders.
FR-7. The app validates that exactly 11 players are active.
FR-8. The app shows opponent danger and weak zones.
FR-9. The app calculates tactic score locally.
FR-10. The app generates a readable result report.
FR-11. The app stores last tactic in localStorage.
FR-12. The app works without sign-up or API keys.
FR-13. The app shows a Decision Moment Card before the board.
FR-14. The app provides local Coach Room Trio advice.
FR-15. The app displays Fate Meter changes while editing.
FR-16. The final report compares Real Match, My Call, and Coach Pick.

## 11. Non-Functional Requirements

Performance:
- Initial load should remain fast with local JSON.
- Drag interactions should feel instant on desktop.

Reliability:
- Simulator must be deterministic.
- Invalid states must fail gracefully.

Accessibility:
- Keyboard alternative for selecting and moving players.
- Sufficient contrast for pitch overlays.
- No color-only tactical meaning.

Responsive:
- Desktop/tablet first for full board.
- Mobile supports tabbed editing and result viewing.

Compliance:
- Avoid official logos, copyrighted player images, and paid API dependencies.
- Attribute data sources in README and app footer.

## 12. Success Metrics

Hackathon judging metrics:
- User can complete first scenario in under 3 minutes.
- Judge can identify core concept within 10 seconds.
- No broken interaction in demo path.
- Planning document matches implemented screens.

Product metrics:
- Scenario completion rate.
- Average actions before simulation.
- Replay count.
- Share click count.

## 13. Risks And Mitigations

Risk: Scope expands into full football simulation.
- Mitigation: Use scenario-based deterministic scoring, not full physics.

Risk: Data licensing ambiguity.
- Mitigation: Use OpenFootball CC0 match data and self-authored player stat JSON. Use Fjelstul only with clear attribution/share-alike if needed.

Risk: Mobile drag/drop frustration.
- Mitigation: Desktop/tablet optimized board plus mobile tap-to-move fallback.

Risk: Result feels arbitrary.
- Mitigation: Always show 3-5 tactical reasons tied to visible user choices.

Risk: Public voters do not understand tactics.
- Mitigation: Add persona card, clear objective, and simple result language.

## 14. Launch Criteria

The MVP is ready when:
- All 3 scenarios can be completed end to end.
- Drag, substitution, formation preset, sliders, and simulation work.
- User can recover with reset/auto-balance.
- Result report is readable and visually polished.
- Deployed URL works without login in Chrome, Edge, and Safari-like WebKit browser if available.
