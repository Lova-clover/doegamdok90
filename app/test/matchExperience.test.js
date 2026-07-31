import test from "node:test";
import assert from "node:assert/strict";
import { formations, scenarioCatalog } from "../src/data/scenario.js";
import { calculateTactic } from "../src/engine/scoring.js";
import { simulateMatch } from "../src/engine/simulation.js";
import { assignPlayersToFormation } from "../src/utils/formationAssignment.js";
import {
  buildMomentumSeries,
  evaluateMatchChallenges,
  getManagerScore,
  getNextScenario,
} from "../src/utils/matchExperience.js";

const runScenario = (scenario, useCoachPlan = false) => {
  const lineup = [...scenario.initialLineup];
  const bench = [...scenario.initialBench];
  const substitutions = [];
  const formation = useCoachPlan ? scenario.coachPlan.formation : scenario.initialFormation;
  const controls = useCoachPlan ? scenario.coachPlan.controls : scenario.defaultControls;

  if (useCoachPlan) {
    scenario.coachPlan.substitutions.forEach(({ outId, inId }, index) => {
      const lineupIndex = lineup.indexOf(outId);
      const benchIndex = bench.indexOf(inId);
      lineup[lineupIndex] = inId;
      bench[benchIndex] = outId;
      substitutions.push({ outId, inId, minute: scenario.minute + 2 + index * 3 });
    });
  }

  const arranged = assignPlayersToFormation({
    formationName: formation,
    lineup,
    players: scenario.players,
    currentPositions: formations[scenario.initialFormation],
    targetPositions: formations[formation],
    roleOverrides: useCoachPlan ? scenario.coachPlan.roleOverrides : undefined,
  });
  const state = {
    lineup: arranged.lineup,
    bench,
    substitutions,
    formation,
    controls: { ...controls },
    positions: arranged.positions,
  };
  const metrics = calculateTactic({ ...state, players: scenario.players, scenario });
  const simulation = simulateMatch({ ...state, players: scenario.players, scenario, metrics });
  return { metrics, simulation };
};

test("경기별 매치 플랜은 기본 대응과 코치 플랜의 차이를 명확히 보여준다", () => {
  scenarioCatalog.forEach((scenario) => {
    assert.equal(scenario.challengePlan.length, 2);
    const baseline = runScenario(scenario);
    const coach = runScenario(scenario, true);
    const baselineChallenges = evaluateMatchChallenges({ scenario, ...baseline });
    const coachChallenges = evaluateMatchChallenges({ scenario, ...coach });

    assert.ok(baselineChallenges.filter((item) => item.passed).length <= 1, scenario.id);
    assert.equal(coachChallenges.filter((item) => item.passed).length, 3, scenario.id);
    assert.ok(coachChallenges.every((item) => item.progress === 100), scenario.id);
  });
});

test("공격 모멘텀은 여섯 장면의 팀 방향과 강도를 보존한다", () => {
  scenarioCatalog.forEach((scenario) => {
    const { simulation } = runScenario(scenario, true);
    const series = buildMomentumSeries(simulation.events);

    assert.equal(series.length, simulation.events.length);
    series.forEach((point, index) => {
      assert.equal(point.side, simulation.events[index].team);
      assert.ok(point.intensity >= 18 && point.intensity <= 100);
      if (["goal", "concede"].includes(point.kind)) assert.ok(point.intensity >= 60);
    });
  });
});

test("다음 경기 추천은 아직 완료하지 않은 경기를 우선하고 순환한다", () => {
  const active = scenarioCatalog[0];
  const next = getNextScenario(scenarioCatalog, active.id, new Set([scenarioCatalog[1].id]));
  assert.equal(next.id, scenarioCatalog[2].id);

  const allCompleted = new Set(scenarioCatalog.map((scenario) => scenario.id));
  assert.equal(getNextScenario(scenarioCatalog, active.id, allCompleted).id, scenarioCatalog[1].id);
});

test("감독 점수는 성공 보너스를 포함해 100점을 넘지 않는다", () => {
  const { metrics, simulation } = runScenario(scenarioCatalog[3], true);
  const score = getManagerScore(metrics, simulation.summary);
  assert.equal(score, 100);
});
