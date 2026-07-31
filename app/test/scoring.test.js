import test from "node:test";
import assert from "node:assert/strict";
import {
  formations,
  initialLineup,
  players,
  scenario,
} from "../src/data/scenario.js";
import { calculateTactic } from "../src/engine/scoring.js";

test("코치 플랜은 설명 가능한 고득점 전술을 만든다", () => {
  const lineup = [...initialLineup];
  const substitutions = scenario.coachPlan.substitutions.map((substitution, index) => {
    const lineupIndex = lineup.indexOf(substitution.outId);
    lineup[lineupIndex] = substitution.inId;
    return { ...substitution, minute: scenario.minute + 2 + index * 3 };
  });
  const metrics = calculateTactic({
    lineup,
    positions: formations[scenario.coachPlan.formation],
    formation: scenario.coachPlan.formation,
    controls: scenario.coachPlan.controls,
    substitutions,
    players,
    scenario,
  });

  assert.ok(metrics.coachScore >= 80);
  assert.ok(metrics.fateShift >= 15);
  assert.ok(metrics.reasons.some((reason) => reason.includes("폭을 넓혀")));
  assert.ok(metrics.reasons.some((reason) => reason.includes("안전핀")));
});

test("양쪽 수비수를 동시에 올리면 역습 경고를 만든다", () => {
  const positions = formations["3-4-3"].map((position) => ({ ...position }));
  positions[1].y = 40;
  positions[4].y = 40;
  const metrics = calculateTactic({
    lineup: [...initialLineup],
    positions,
    formation: "3-4-3",
    controls: { tempo: 8, width: 8, pressing: 8, risk: 9 },
    substitutions: [],
    players,
    baseline: scenario.realBaselineDecisionScore,
  });

  assert.ok(metrics.counterRisk >= 68);
  assert.ok(metrics.warnings.some((warning) => warning.includes("양쪽 수비수")));
});
