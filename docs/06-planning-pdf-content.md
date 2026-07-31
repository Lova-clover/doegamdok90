# Planning PDF Content - Touchline Replay 90

This document is the source outline for the competition planning PDF.

## 1. Service Overview

Touchline Replay 90 is a dynamic World Cup tactical simulator where users become the manager at a decisive match minute. They choose a real-world inspired scenario, drag players on a tactical pitch, change formation and instructions, run a short simulation, and receive a manager report.

The service is not just a lineup builder. It is a "manager decision replay" that turns football arguments into an interactive experience.

## 2. Design Intent For The Manager Experience

The experience is built around four feelings:
- Pressure: the user enters a match at a specific minute with score and objective.
- Control: the user directly moves players, changes roles, and adjusts tactical instructions.
- Consequence: every change affects attack, defense, control, and risk meters.
- Payoff: the simulation produces a report explaining whether the decision worked.

This structure makes the user feel, "I did not just draw a tactic. I managed the match."

## 3. Page Structure

1. Match Desk
   - Scenario selection, match state, objective, opponent weakness, start action.

2. Tactics Board
   - Pitch, draggable players, bench, formation presets, roles, tactical sliders, opponent overlay, risk radar.

3. Simulation Moment
   - Short timeline animation and tactical event cards.

4. Manager Report
   - Coach score, objective result, tactical reasons, before/after comparison, manager persona, replay/share actions.

## 4. Core Interactions

Player placement:
- Drag player tokens on the pitch.
- Snap to suggested lanes or use free placement.
- Tap-to-move fallback on mobile.

Formation control:
- Choose presets such as 4-3-3, 4-2-3-1, 3-4-3, 4-4-2, 3-5-2.

Substitution:
- Drag bench player onto a starting player.
- Confirm substitution.
- Metrics update immediately.

Tactical instructions:
- Pressing line, tempo, width, risk, attack focus, build-up style.

Opponent overlay:
- Toggle danger zones and weak zones.
- User sees what the tactic should solve.

Simulation:
- Run a deterministic local simulation for the next 10-15 match minutes.
- Generate tactical events and report.

## 5. Data Usage

The MVP uses static local JSON to avoid API-key problems during judging.

Data sources:
- OpenFootball worldcup.json for World Cup match context. This source is public domain/CC0 and does not require an API key.
- Self-authored curated scenario data.
- Self-authored player ratings and traits based on general football knowledge, without using copyrighted photos/logos.

Optional:
- Fjelstul World Cup Database for richer historical tables only if attribution and CC-BY-SA 4.0 obligations are clearly handled.

## 6. Main User Flow

1. User opens the app.
2. User chooses a scenario, for example "Need A Goal".
3. User enters the tactics board.
4. User applies a new formation.
5. User drags players and makes one substitution.
6. User changes tactical instructions.
7. User runs simulation.
8. User reads manager report.
9. User replays or shares the result.

## 7. MVP Feature List

Must have:
- 3 curated scenarios.
- Draggable tactical board.
- Formation presets.
- Substitution interaction.
- Tactical sliders.
- Opponent overlay.
- Local scoring engine.
- Manager report.
- Responsive layout.
- Data attribution.

Nice to have:
- Shareable coach card.
- Local assistant coach recommendations.
- Animated movement preview.
- Scenario comparison against real match baseline.

## 8. Why This Can Win

Novelty:
- It transforms a tactical board into a decision replay with consequences.

Manager immersion:
- The user acts under match context and receives a result.

Completeness:
- The MVP is small enough to build reliably with static data and local logic.

Planning consistency:
- Product, interaction, data, and implementation structure are aligned from the beginning.

## 9. Winning Upgrade

The refined product should be described as:

> "A counterfactual manager simulator where the user rewrites a decisive 15-minute World Cup window."

Named differentiators:
- Decision Moment Card: minute, score, mission, constraint, and real baseline.
- Coach Room Trio: local rules-based head coach, analyst, and physical coach advice.
- Fate Meter: a headline "운명 변화" score compared with the real baseline.
- Real vs Me vs Coach Report: compare the real match, user tactic, and coach recommendation.
- Manager Persona Card: public-vote-friendly result card.

These features directly support the judging criteria:
- Novelty: not another formation board.
- Manager experience: pressure, staff advice, choice, and consequence.
- Completeness: deterministic local logic, no login, no API key.
- Planning consistency: the same feature names appear in PRD, UI, data, and demo video.

## 10. Concrete MVP Scenarios

1. 승리가 필요한 67분
   - Inspired by South Korea vs Portugal 2022.
   - Mission: create a winning route while controlling central counter risk.

2. 78분, 리드를 지켜라
   - Inspired by Argentina vs France 2022 final.
   - Mission: protect the lead while keeping one counter outlet.

3. 58분, 잠긴 수비를 열어라
   - Compact knockout low-block scenario.
   - Mission: create high-quality chances through width and half-space occupation.

4. 89분, 마지막 세트피스
   - Bonus mode after the main flow is stable.
   - Mission: design one final set-piece routine.
