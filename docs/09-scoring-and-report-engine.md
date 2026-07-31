# Scoring And Report Engine - Touchline Replay 90

## 1. Engine Goal

The simulation engine does not need to predict football perfectly. It needs to make user decisions feel meaningful, fair, and explainable.

Design target:
- The user should understand why their tactic scored well or poorly.
- Judges should see that interaction, data, and result are connected.
- Public voters should get an emotional "I changed the match" result.

## 2. Core Output

The report should produce:
- Fate Shift: headline score from -30 to +30.
- Coach Score: 0 to 100.
- Goal Threat: 0 to 100.
- Control: 0 to 100.
- Rest Defense: 0 to 100.
- Momentum: 0 to 100.
- Risk: 0 to 100.
- 3 positive reasons.
- 1-2 warnings.
- Real vs Me vs Coach comparison.
- Manager persona.

## 3. Scoring Formula

Use scenario-specific weights:

```ts
baseScore =
  goalThreat * weights.goalThreat +
  control * weights.control +
  restDefense * weights.restDefense +
  momentum * weights.momentum -
  risk * weights.risk;

coachScore = clamp(round(baseScore + missionBonus - contradictionPenalty), 0, 100);
fateShift = clamp(round((coachScore - realBaselineScore) / 2), -30, 30);
```

## 4. Feature Signals

### Goal Threat

Positive:
- Attack focus overlaps opponent weak zone.
- Fresh runner placed near weak channel.
- Creative player is central or half-space adjacent.
- Tempo fits mission timing.
- Formation creates front-line occupation.

Negative:
- Too many players occupy the same lane.
- Direct play without aerial advantage.
- Attack focus targets opponent strong zone.
- Striker isolated from midfield.

### Control

Positive:
- At least 3 midfield/inside-lane connections.
- Balanced distance between defensive, midfield, attacking lines.
- Buildup style fits passing stats.
- Tempo is not contradictory to shape.

Negative:
- Large vertical gaps.
- No central connector.
- High tempo with low passing/stamina.
- Overloaded front line with no supply.

### Rest Defense

Positive:
- At least 2-3 players protect central counter lanes.
- Defensive midfielder or center back covers opponent danger zone.
- Pressing line fits stamina.
- Fullback aggression is balanced by opposite-side cover.

Negative:
- Both fullbacks high with no anchor.
- High press plus tired midfield.
- All-in risk while already leading.
- Center backs split too wide against central counter threat.

### Momentum

Positive:
- Substitution adds stamina or pace after 60'.
- Tactical change matches mission urgency.
- Opponent weak zone targeted repeatedly.
- Set-piece or transition plan creates a clear event.

Negative:
- No meaningful change from default state.
- Defensive move while chasing a goal.
- Attacking move while protecting a lead without outlet.

### Risk

Risk is not always bad. It should be judged against mission.

Acceptable risk:
- Chasing a goal after 75'.
- Final set-piece routine.
- Knockout scenario with no time.

Bad risk:
- Leading late with high line and all-in attack.
- Tired midfield asked to press high.
- No rest defense against high counter threat.

## 5. Reason Tags

Each score contribution should create reason tags.

Examples:

| Tag | Trigger | Report Text |
|---|---|---|
| weak_zone_overload | attack focus overlaps weak zone and 2+ players nearby | "상대 약점 지역에 숫자 우위를 만들었습니다." |
| fresh_runner | substituted player has high pace/stamina after 60' | "교체 투입한 선수가 후반 공간을 공격했습니다." |
| rest_defense_anchor | DM/CB covers central danger zone | "중앙 역습을 막을 안전핀이 남아 있었습니다." |
| isolated_striker | striker has no support within connection radius | "최전방이 고립되어 찬스 품질이 낮아졌습니다." |
| high_line_fatigue | high press + low stamina midfield | "체력이 떨어진 상태에서 높은 압박을 유지해 위험이 커졌습니다." |
| low_block_width | wide shape against compact defense | "폭을 넓혀 내려앉은 수비를 흔들었습니다." |
| overcommit_lead | leading + all-in risk + high line | "리드 상황에서 과도한 공격 지시가 역습 위험을 키웠습니다." |

## 6. Manager Personas

Persona is based on score shape, not random labels.

| Persona | Condition |
|---|---|
| Counter Punch Manager | high Goal Threat through transition or weak flank |
| Balance Guardian | high Rest Defense and Control, low Risk |
| Pressing Romantic | high Momentum, high pressing, medium/high Risk |
| Set-Piece Architect | strong set-piece chance generation |
| Half-Space Engineer | high Control plus half-space overload |
| Chaos Chaser | very high Goal Threat and very high Risk |

Persona card text:

```text
Counter Punch Manager
당신은 기다렸다가 가장 약한 공간을 찌르는 감독입니다.
Best Call: Fresh runner on the weak flank
Tradeoff: Back-space risk after 78'
```

## 7. Real vs Me vs Coach Comparison

The comparison table is the main credibility device.

```text
Real Match
- Result: late winner / draw / conceded momentum
- Style: what actually happened

My Call
- Result: generated chance / protected lead / failed mission
- Why: top 2 reason tags

Coach Suggestion
- Result: safer or more aggressive alternative
- Why: local rules-based plan
```

## 8. Simulation Event Generator

Generate 3-5 events from reason tags.

Rules:
- Positive tag creates a chance, territory gain, pressure break, or defensive stop.
- Warning tag creates a counter warning, fatigue warning, or lost control moment.
- Mission success creates a headline event near the target minute.

Example for Scenario 1:

```text
70' 상대 오른쪽에 2대1 상황이 만들어졌습니다.
74' 교체 투입한 윙어가 뒷공간을 열었습니다.
79' 중앙 역습 위험이 올라갔지만, DM 위치가 이를 완화했습니다.
82' 컷백 찬스가 생성됐습니다.
```

## 9. Anti-Arbitrary Rules

To make users trust the result:

- Never output a score without reasons.
- Never use a reason that does not match a user action.
- Show at least one tradeoff even in high-score reports.
- Let risky tactics sometimes succeed if mission context justifies it.
- Keep results deterministic for the same input.

## 10. Implementation Priority

Phase 1:
- Calculate score from formation, attack focus, risk, tempo, and 3 scenario weak/danger zones.

Phase 2:
- Add player stats and role fit.

Phase 3:
- Add Coach Room Trio recommendations.

Phase 4:
- Add Real vs Me vs Coach comparison and persona card.

The MVP can be convincing before Phase 4 only if the visible reasons are excellent.

