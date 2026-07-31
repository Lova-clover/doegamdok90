# Functional Specification - Touchline Replay 90

## 1. Information Architecture

Primary route structure:
- `/` - Match Desk and scenario selection.
- `/scenario/:scenarioId` - Tactics Board.
- `/scenario/:scenarioId/report` - Manager Report.

Optional route:
- `/share/:encodedState` - Read-only shared result.

## 2. Screen-Level Specification

### 2.1 Match Desk

Components:
- `TopBar`
- `ScenarioCarousel`
- `ScenarioCard`
- `DecisionMomentCard`
- `MatchBriefingPanel`
- `DataAttributionFooter`

States:
- Empty/loading scenarios.
- Scenario selected.
- Scenario unavailable/fallback.

Interactions:
- Click scenario card.
- Keyboard arrows switch scenario.
- Start button opens tactics board.

Acceptance criteria:
- User can understand score, minute, objective, and team within 10 seconds.
- User can see the real baseline and the mission before entering the board.
- No sign-in prompt blocks the flow.

### 2.2 Tactics Board

Components:
- `PitchBoard`
- `PlayerToken`
- `BenchRail`
- `FormationPresetBar`
- `PlayerInspector`
- `TacticControls`
- `CoachRoomTrio`
- `FateMeter`
- `OpponentOverlayToggle`
- `RiskRadar`
- `SimulationCta`
- `ResetAndAutoFixActions`

Board behavior:
- Player tokens render at normalized pitch coordinates `{ x: 0-100, y: 0-100 }`.
- Dragging updates coordinates in state.
- Releasing near role lanes snaps to recommended zones unless free-move mode is on.
- Hover/focus shows role, stamina, and trait tooltip.
- Selecting a token opens inspector.

Formation presets:
- Preset applies target coordinates by role.
- Existing selected players are preserved.
- If a formation needs different position distribution, app suggests role switches instead of silently replacing players.

Substitution:
- Bench token can be dragged onto starting token.
- App opens confirm mini-sheet: "교체: A out, B in".
- After confirmation, starting player moves to bench and incoming player takes the same pitch slot.
- Fatigue, role fit, and tactical score update.

Tactical controls:
- Pressing line: low, mid, high.
- Tempo: patient, balanced, fast.
- Width: narrow, balanced, wide.
- Risk: protect, balanced, all-in.
- Attack focus: left, center, right, mixed.
- Build-up style: direct, mixed, short.

Coach Room Trio:
- Head coach voice explains the main tactical move.
- Analyst voice warns about opponent weak/danger zones.
- Physical coach voice warns about stamina and pressing cost.
- Advice is generated locally from scenario model, player state, and tactic instructions.

Fate Meter:
- Shows the headline delta compared with real baseline.
- Uses labels such as "운명 변화 +23", "찬스 증가", "역습 위험 상승".
- Updates after formation, placement, substitution, or instruction changes.

Opponent overlay:
- Danger zones: red/orange areas where opponent threatens.
- Weak zones: blue/green areas to attack.
- Match data notes appear as short labels, not long prose.

Validation:
- Active players must equal 11.
- Goalkeeper must be active.
- At least 3 defenders should be active unless all-in mode is selected.
- Duplicate player IDs are impossible.
- Invalid states show inline hints and disable simulation only when necessary.

Acceptance criteria:
- Dragging a player visibly changes at least one meter.
- User can complete a valid tactic without reading instructions.
- Reset restores scenario default.

### 2.3 Simulation Moment

Components:
- `SimulationTimeline`
- `EventTicker`
- `MetricDeltaStrip`
- `MiniPitchAnimation`

Simulation length:
- 5-8 seconds in UI.
- Represents 10-15 match minutes.

Generated events:
- Chance created.
- Counterattack conceded.
- Set-piece won.
- Press broken.
- Fatigue drop.
- Goal probability swing.

Acceptance criteria:
- User sees that their decisions are being evaluated.
- Simulation always completes and routes to report.

### 2.4 Manager Report

Components:
- `CoachScore`
- `ObjectiveOutcome`
- `TacticalReasons`
- `BeforeAfterComparison`
- `CoachPersonaCard`
- `ReplayActions`
- `ShareActions`

Report content:
- Overall score, 0-100.
- Fate Shift, -30 to +30.
- Attack score, defense score, control score, risk score.
- 3 positive reasons.
- 1-2 tradeoff warnings.
- Short narrative summary.
- Real vs Me vs Coach comparison.
- Persona label.

Example personas:
- Pressing Romantic
- Counter Punch Manager
- Set-Piece Architect
- Balance Guardian
- Chaos Chaser
- Half-Space Engineer

Acceptance criteria:
- Report explains the score without vague AI language.
- User can replay or choose another scenario.

## 3. Domain Model

### 3.1 Scenario

```ts
type Scenario = {
  id: string;
  title: string;
  competition: string;
  year: number;
  minute: number;
  score: [number, number];
  userTeamId: string;
  opponentTeamId: string;
  objective: ScenarioObjective;
  realMatchReference?: string;
  briefing: string;
  timeline: MatchEvent[];
  opponentModel: OpponentModel;
  defaultTactic: TacticState;
  realBaseline: RealBaseline;
  coachOptions: Record<"safe" | "balanced" | "gamble", CoachPlan>;
  publicHook: string;
};
```

### 3.2 Player

```ts
type Player = {
  id: string;
  name: string;
  country: string;
  shirtNumber: number;
  preferredPositions: Position[];
  traits: PlayerTrait[];
  stats: {
    pace: number;
    passing: number;
    shooting: number;
    defending: number;
    stamina: number;
    creativity: number;
    aerial: number;
  };
};
```

### 3.3 Tactic State

```ts
type TacticState = {
  formation: string;
  activePlayerIds: string[];
  benchPlayerIds: string[];
  placements: Record<string, PitchPoint>;
  roles: Record<string, TacticalRole>;
  instructions: {
    pressingLine: "low" | "mid" | "high";
    tempo: "patient" | "balanced" | "fast";
    width: "narrow" | "balanced" | "wide";
    risk: "protect" | "balanced" | "allIn";
    attackFocus: "left" | "center" | "right" | "mixed";
    buildup: "direct" | "mixed" | "short";
  };
};
```

### 3.4 Simulation Result

```ts
type SimulationResult = {
  score: number;
  fateShift: number;
  attackScore: number;
  defenseScore: number;
  controlScore: number;
  riskScore: number;
  objectiveSuccess: boolean;
  outcomeText: string;
  reasons: TacticalReason[];
  warnings: TacticalReason[];
  persona: CoachPersona;
  comparison: {
    realMatch: ComparisonPath;
    myCall: ComparisonPath;
    coachPick: ComparisonPath;
  };
  generatedEvents: SimulatedEvent[];
};
```

## 4. Tactics Engine

The engine is deterministic and local. It should feel transparent rather than pretending to be a full football model.

Inputs:
- Scenario objective.
- Player role fit.
- Player stat fit.
- Pitch spacing.
- Formation shape.
- Tactical instructions.
- Opponent danger/weak zones.
- Fatigue and card pressure.

Main scores:
- Attack score: chance creation and ability to target weak zones.
- Defense score: rest defense, spacing, and coverage against danger zones.
- Control score: midfield occupation, tempo fit, and passing balance.
- Risk score: how likely the tactic is to concede a counter or late chance.

Example scoring structure:

```ts
overall =
  objectiveWeight.attack * attackScore +
  objectiveWeight.defense * defenseScore +
  objectiveWeight.control * controlScore -
  objectiveWeight.risk * riskPenalty +
  scenarioBonus;
```

Reason generation:
- Reasons must map to actual user decisions.
- Example: "왼쪽 측면에 속도와 폭을 동시에 배치해 상대 약점을 공략했습니다."
- Example: "높은 라인과 all-in 위험도가 겹쳐 역습 위험이 커졌습니다."

## 5. Interaction Detail

### Drag And Drop

Desktop:
- Pointer drag on player token.
- Drop on pitch.
- Drop on player for substitution.

Mobile/tablet:
- Tap player, tap target zone.
- Long-press opens role menu.
- Bottom tabs avoid overcrowding.

Keyboard:
- Tab focuses player.
- Arrow keys nudge position.
- Enter opens inspector.
- Number keys can apply presets.

### Visual Feedback

During drag:
- Token lifts with shadow.
- Recommended lane highlights.
- Congested areas show warning.
- Tactical meters update after drop.

During slider changes:
- Meter deltas animate.
- Opponent overlay adapts.
- Simulation CTA remains visible.

### Error Prevention

The app should prevent:
- Losing a player off-pitch.
- Duplicate active players.
- Starting without goalkeeper.
- Simulation with fewer or more than 11 active players.

The app should allow:
- Risky formations if the user intentionally chooses all-in mode.
- Free placement outside standard formation lanes.

## 6. Components

`PitchBoard`
- Props: scenario, tacticState, overlayMode.
- Emits: placementChanged, playerSelected, substitutionRequested.

`PlayerToken`
- Props: player, placement, selected, warningState.
- Emits: dragStart, dragMove, dragEnd, select.

`TacticControls`
- Props: instructions, objective.
- Emits: instructionChanged.

`RiskRadar`
- Props: scoreBreakdown.
- Displays attack, defense, control, risk.

`SimulationEngine`
- Pure domain module.
- No UI dependency.
- Exposes `evaluateTactic(scenario, players, tacticState)`.

## 7. Data Usage

Recommended source plan:
- Use OpenFootball worldcup.json for match schedules/results and basic World Cup context. It is public domain/CC0 and requires no API key.
- Use self-authored curated player JSON for MVP squads and ratings.
- Optionally use Fjelstul World Cup Database only if the project accepts CC-BY-SA 4.0 attribution/share-alike obligations.

Runtime:
- No external API calls required.
- All required data packaged as static JSON.

Attribution:
- README and app footer include data source links.
- If using CC-BY-SA data, include attribution exactly and note modifications.

## 8. State Management

Recommended stores:
- `scenarioStore`: selected scenario and scenario data.
- `tacticStore`: placements, roles, instructions.
- `simulationStore`: latest score/result.
- `uiStore`: selected player, overlay, mobile tab.

Persistence:
- Save last scenario and tactic state to localStorage.
- Shared result can use encoded URL state or generated image.

## 9. Analytics-Free Event Log

For demo and debugging, keep a local event log:
- scenario_selected
- formation_applied
- player_moved
- role_changed
- substitution_made
- instruction_changed
- simulation_run
- report_shared

Do not send telemetry externally unless explicitly added later.

## 10. MVP Acceptance Checklist

- Scenario cards load from JSON.
- Pitch renders correctly at desktop and mobile widths.
- Formation presets work.
- Drag/drop and tap-to-move work.
- Substitution works.
- Tactical controls change score.
- Simulation result is deterministic.
- Report is generated.
- Data source attribution is visible.
- App works without login or API key.
