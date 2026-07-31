# Scenario Blueprints - Touchline Replay 90

## Scenario Design Rules

Each scenario must contain:
- Real match context: year, teams, score, minute, goal timeline.
- Manager mission: one clear goal.
- Constraint: one thing that makes the choice hard.
- Opponent model: danger zones and weak zones.
- Default tactic: the real or plausible starting state.
- Coach recommendation: safe, balanced, and gamble options.
- Result hooks: 3-5 possible simulation events.

Use real team/player names only as text references. Do not use official logos, player photos, or broadcast clips.

## MVP Scenario 1 - 승리가 필요한 67분

Inspired match:
- South Korea vs Portugal, 2022 group stage.

User role:
- South Korea manager.

Starting state:
- Minute: 67'
- Score: 1-1
- Mission: win, not just survive.
- Time window: 67' to 90+.

Narrative:
- A draw is not enough emotionally. The user needs to create one decisive transition route while keeping Portugal's midfield from countering through the center.

Objective:
- Generate a high-quality chance before 85' without letting counter risk exceed the danger threshold.

Opponent model:
- Weak zone: opponent right flank behind advanced fullback.
- Danger zone: central counter channel.
- Press resistance: medium-high.
- Counter threat: high.

Recommended tactical paths:
- Safe: 4-2-3-1, balanced tempo, mixed focus, preserve double pivot.
- Balanced: 4-3-3, wide attack focus, fresh runner on left/right wing.
- Gamble: 3-4-3, fast tempo, high width, risk all-in.

Best user actions:
- Add a fresh wide runner.
- Move one midfielder into a deeper cover position.
- Attack the weak flank instead of forcing central play.
- Raise tempo but avoid all-in risk too early.

Bad user actions:
- Push both fullbacks high with no defensive midfielder.
- Use high press with tired midfielders.
- Attack center into a compact block.

Simulation events:
- "70' 측면 과부하가 상대 풀백을 끌어냈습니다."
- "76' fresh runner가 뒷공간을 침투했습니다."
- "82' 컷백 찬스가 생성됐습니다."
- "84' 중앙 역습 위험이 감지됐습니다."

Report headline examples:
- High score: "실제 경기보다 더 빠르게 결승골 루트를 만들었습니다."
- Medium score: "찬스는 만들었지만 후방 안정성이 흔들렸습니다."
- Low score: "공격 숫자는 늘었지만, 중앙 역습에 취약했습니다."

## MVP Scenario 2 - 78분, 리드를 지켜라

Inspired match:
- Argentina vs France, 2022 final.

User role:
- Argentina manager.

Starting state:
- Minute: 78'
- Score: Argentina leading.
- Mission: protect the lead through the opponent's final pressure.

Narrative:
- The real match's late momentum swing is iconic. The user gets a chance to prevent collapse by changing defensive spacing, pressing line, and substitution timing.

Objective:
- Reduce opponent momentum and penalty-box entries while keeping a counter outlet.

Opponent model:
- Danger zone: left half-space and penalty-box central lane.
- Weak zone: space behind aggressive opponent fullback.
- Press resistance: high.
- Counter threat: medium.

Recommended tactical paths:
- Safe: 5-4-1, low risk, preserve box protection.
- Balanced: 4-4-2, mid block, one fast outlet.
- Gamble: keep high press and chase another goal.

Best user actions:
- Lower pressing line.
- Add a defensive midfielder or fullback.
- Keep one forward outlet to prevent constant pressure.
- Narrow defensive width inside the box.

Bad user actions:
- All-in attack while leading.
- Remove the outlet completely.
- Keep tired attackers pressing high.

Simulation events:
- "80' 상대의 박스 진입 횟수가 줄었습니다."
- "83' 세컨드볼 회수로 흐름을 끊었습니다."
- "86' 역습 출구가 남아 압박을 밀어냈습니다."
- "88' 너무 낮은 라인으로 세트피스 위험이 증가했습니다."

Report headline examples:
- High score: "무너질 뻔한 흐름을 관리형 승리로 바꿨습니다."
- Medium score: "실점 위험은 줄였지만 너무 깊게 내려앉았습니다."
- Low score: "압박 강도와 체력 상태가 맞지 않아 위험을 키웠습니다."

## MVP Scenario 3 - 58분, 잠긴 수비를 열어라

Inspired match:
- A compact knockout-stage opponent scenario.

User role:
- Possession-heavy favorite.

Starting state:
- Minute: 58'
- Score: 0-0
- Mission: break a low block before extra time.

Narrative:
- The user must resist the urge to simply add attackers. The winning move is creating overloads, width, and late box runs without losing rest defense.

Objective:
- Increase chance quality while maintaining enough rest defense against wide counters.

Opponent model:
- Weak zone: right half-space and far-post late run.
- Danger zone: wide counter on both sides.
- Press resistance: low.
- Counter threat: medium-high.

Recommended tactical paths:
- Safe: 4-3-3, patient tempo, wide shape, one inverted fullback.
- Balanced: 3-2-5 in possession, half-space overload.
- Gamble: two strikers, fast tempo, all-in box occupation.

Best user actions:
- Use width to stretch the block.
- Place a creative midfielder in the half-space.
- Keep one midfielder as rest-defense anchor.
- Use patient tempo before increasing risk after 75'.

Bad user actions:
- Stack all attackers centrally.
- Push both fullbacks high with no cover.
- Use direct play without aerial advantage.

Simulation events:
- "64' 하프스페이스 점유로 수비 라인이 흔들렸습니다."
- "70' 컷백 통로가 열렸습니다."
- "77' 박스 안 숫자는 늘었지만 역습 대비가 약합니다."

Report headline examples:
- High score: "잠긴 수비를 힘이 아니라 구조로 열었습니다."
- Medium score: "점유는 좋아졌지만 결정적 침투가 부족했습니다."
- Low score: "중앙 밀집에 갇혀 슈팅 품질이 낮았습니다."

## Bonus Scenario 4 - 마지막 세트피스 한 방

Inspired match:
- Any late knockout match with a final corner/free-kick situation.

User role:
- Team chasing a goal.

Starting state:
- Minute: 89'
- Score: trailing by one or tied.
- Mission: design one set-piece routine.

Why it is useful:
- It creates a very visual, short, high-impact interaction.
- It can be built after the main three scenarios as a public-vote booster.

Core interaction:
- Drag 5 attacking runners.
- Assign run types: near-post, far-post, screen, rebound, short option.
- Place two rest-defense players.
- Run a 10-second set-piece simulation.

Scoring:
- Delivery lane quality.
- Runner separation.
- Aerial match-up.
- Rebound coverage.
- Counter prevention.

Report headline examples:
- "근거리 스크린으로 헤더 찬스를 만들었습니다."
- "세컨드볼 대비가 없어 역습 위험이 큽니다."

## Scenario Selection Priority

Build order:
1. Scenario 1, because it is easiest for Korean public voters to care about.
2. Scenario 2, because it is globally iconic and emotionally strong.
3. Scenario 3, because it proves tactical depth.
4. Bonus Scenario 4, only if the main flow is already stable.

## Scenario Card Template

```text
[67'] South Korea 1 - 1 Portugal
Mission: 승리가 필요하다
Constraint: 중앙 역습을 막아라
Real baseline: 후반 막판 역습 득점
CTA: 이 15분을 바꾸기
```

## Data Fields To Add

```ts
type ScenarioMoment = {
  realBaseline: {
    summary: string;
    finalOutcome: string;
    keyEvents: MatchEvent[];
  };
  mission: {
    primary: string;
    successMetric: string;
    failMetric: string;
  };
  constraints: string[];
  coachOptions: {
    safe: CoachPlan;
    balanced: CoachPlan;
    gamble: CoachPlan;
  };
  publicHook: string;
};
```

