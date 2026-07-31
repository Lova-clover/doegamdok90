# Winning Strategy - Touchline Replay 90

## 1. Sharpened Winning Thesis

Original thesis:
- A tactical board where users change World Cup tactics and get a result.

Sharper thesis:
- "The user enters the exact 15 minutes where a World Cup match can be rewritten."

Korean pitch:
- "내가 감독이었다면, 그 15분은 달라졌을까?"

Judge-facing pitch:
- "Touchline Replay 90 is not a lineup builder. It is a counterfactual manager simulator: pick a decisive World Cup moment, make your call, and compare your decision against the real match and the assistant coach's recommendation."

Public-vote pitch:
- "3분 안에 진짜 감독처럼 한 경기를 뒤집어보세요."

## 2. Current Risk Diagnosis

Risk 1 - It can look like a normal tactics board.
- Fix: Lead with "decision replay", not "formation builder".
- Proof on screen: scenario minute, score, mission, real baseline, simulation outcome.

Risk 2 - "World Cup data" can feel cosmetic.
- Fix: Every scenario must use real match context: score, minute, goal timeline, team state, opponent pattern.
- Proof on screen: real match baseline and "what changed in your version".

Risk 3 - Simulation can feel arbitrary.
- Fix: Explainable scoring engine with visible reason tags.
- Proof on screen: "Why score changed" chips tied to exact user actions.

Risk 4 - AI features can become fragile or impossible to judge.
- Fix: Make "Assistant Coach" a local rules-based module, not an external API dependency.
- Proof on screen: no login, no key, deterministic recommendation.

Risk 5 - Too many features can hurt completion.
- Fix: 3 polished scenarios beat 10 shallow scenarios.
- Proof on screen: one complete scenario in under 3 minutes.

## 3. Killer Differentiators

### 3.1 Decision Moment Cards

Each scenario begins with a card that feels like a touchline instruction:

- Minute: 67'
- Score: 1-1
- Mission: "승리가 필요하다. 15분 안에 결승골 루트를 만들어라."
- Constraint: "라인을 너무 올리면 중앙 역습 위험이 커진다."
- Real baseline: "실제 경기는 후반 막판 역습 득점으로 결정됐다."

Why it wins:
- It instantly creates pressure and story.
- It makes the World Cup data part of the gameplay.

### 3.2 Coach Room Trio

Before the user finalizes a tactic, three local "staff voices" give short advice:

- 수석코치: "지금은 폭을 넓혀 상대 오른쪽을 흔드는 게 좋습니다."
- 분석관: "상대의 중앙 역습 위험이 높습니다. DM을 하나 남겨두세요."
- 피지컬코치: "고강도 압박은 75분 이후 체력 손실이 큽니다."

Implementation:
- No external AI.
- Rule templates based on scenario, player stamina, formation, and tactical sliders.

Why it wins:
- It feels like being a manager with staff around you.
- It adds "AI-like" usefulness without API risk.

### 3.3 Real vs Me vs Coach

Manager Report compares three paths:

- Real Match: what actually happened in the source match.
- My Call: the user's chosen tactic.
- Coach Suggestion: local rules-based recommended tactic.

Example:

| Path | Outcome | Note |
|---|---|---|
| Real Match | Late winner | Counter route worked, but chance volume was low |
| My Call | 82' high-quality chance | Better width, slightly higher counter risk |
| Coach Suggestion | Safer draw pressure | Better defense, lower goal threat |

Why it wins:
- This is the unique hook.
- Judges can see planning, data, and interaction connected in one result view.

### 3.4 Fate Meter

Replace generic scores with a memorable combined meter:

- Goal Threat
- Control
- Rest Defense
- Momentum
- Fate Shift

Fate Shift is the headline number:
- "운명 변화 +23"
- Meaning: how much the user's tactic moved the scenario away from the real baseline.

Why it wins:
- Easier for public voters than raw tactical scores.
- More emotional than "attack 72".

### 3.5 Broadcast Replay

After simulation, show 3-5 event cards:

- 70' Right-side overload pulls the fullback out.
- 74' Fresh runner attacks the blind side.
- 78' Counter warning: defensive midfielder isolated.
- 82' Cutback chance generated.

Why it wins:
- It gives the demo video a satisfying climax.
- It prevents the result screen from feeling like a random score calculator.

### 3.6 Manager Persona Card

The final card is optimized for public vote:

- "당신은 Counter Punch Manager입니다."
- "폭과 속도를 믿었지만, 후방 리스크도 감수했습니다."
- Score: 84
- Best decision: "fresh winger substitution"
- Risk: "high line after 78'"

Why it wins:
- Shareable, memorable, replayable.
- Makes non-experts enjoy the product.

## 4. Evaluation Mapping

| Criterion | Score Target | What To Show |
|---|---:|---|
| Novelty | 27-30 / 30 | Real vs Me vs Coach comparison, Fate Shift, scenario replay |
| Manager Experience | 22-25 / 25 | Touchline pressure, staff advice, direct board manipulation |
| Completeness | 22-25 / 25 | End-to-end scenario works without login or API key |
| Planning/Implementation | 18-20 / 20 | PRD, data, scoring, UI, demo all use the same core loop |

## 5. Revised Core Loop

1. Pick a Decision Moment Card.
2. Read mission, constraint, and real baseline.
3. Enter the Tactics Board.
4. Drag players and make substitutions.
5. Watch Coach Room Trio advice update.
6. Adjust tactical sliders.
7. Run "Fate Simulation".
8. Compare Real vs Me vs Coach.
9. Share Manager Persona Card.

## 6. Minimum Lovable Product

The winning MVP should feel complete with only these:

- 3 scenario cards.
- 1 excellent tactical board.
- 5 formation presets.
- 1 substitution interaction.
- 5 tactical controls.
- Coach Room Trio advice.
- Fate Simulation.
- Real vs Me vs Coach report.
- Manager Persona Card.

Do not add:
- User accounts.
- Real-time match APIs.
- Full player photo database.
- Complex league/campaign mode.
- Chatbot requiring an API key.
- Video export before the main flow is polished.

## 7. First Screen Copy

Title:
- Touchline Replay 90

Subtitle:
- "월드컵의 운명이 갈린 15분. 이번엔 당신이 감독입니다."

Primary CTA:
- "감독석에 앉기"

Scenario labels:
- "승리가 필요한 67분"
- "리드를 지켜야 하는 78분"
- "잠긴 수비를 깨야 하는 58분"
- "마지막 세트피스 한 방"

## 8. Demo Moment To Optimize

The demo must include one visible "wow":

1. User changes formation from 4-2-3-1 to 3-4-3.
2. Fate Meter jumps from +4 to +18 but Rest Defense turns orange.
3. Analyst warning appears: "중앙 역습 위험이 커졌습니다."
4. User drops a defensive midfielder deeper.
5. Fate Meter becomes +23 and Rest Defense returns to yellow.
6. Simulation creates an 82' cutback chance.
7. Report says: "실제 경기보다 12분 빠르게 결정적 찬스를 만들었습니다."

## 9. Winning Product Principle

The app should not try to answer "what is the objectively perfect tactic?"

It should answer:
- "Did your managerial idea create a believable alternate story?"

That is easier to implement, easier to judge, and more emotionally powerful.

