import test from "node:test";
import assert from "node:assert/strict";
import { formations, scenarioCatalog } from "../src/data/scenario.js";
import { calculateTactic } from "../src/engine/scoring.js";
import { simulateMatch } from "../src/engine/simulation.js";
import { getApprovedPortrait, getKitPalette } from "../src/utils/playerIdentity.js";
import { assignPlayersToFormation, formationRoleSlots } from "../src/utils/formationAssignment.js";

const createState = (scenario, useCoachPlan = false) => {
  const lineup = [...scenario.initialLineup];
  const bench = [...scenario.initialBench];
  const substitutions = [];
  const formation = useCoachPlan ? scenario.coachPlan.formation : scenario.initialFormation;
  const controls = useCoachPlan ? scenario.coachPlan.controls : scenario.defaultControls;

  if (useCoachPlan) {
    scenario.coachPlan.substitutions.forEach(({ outId, inId }, index) => {
      const lineupIndex = lineup.indexOf(outId);
      const benchIndex = bench.indexOf(inId);
      assert.notEqual(lineupIndex, -1, `${scenario.id}: 교체 아웃 선수가 선발에 있어야 합니다.`);
      assert.notEqual(benchIndex, -1, `${scenario.id}: 교체 인 선수가 벤치에 있어야 합니다.`);
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

  return {
    lineup: arranged.lineup,
    bench,
    substitutions,
    formation,
    controls: { ...controls },
    positions: arranged.positions,
  };
};

const runScenario = (scenario, useCoachPlan = false) => {
  const state = createState(scenario, useCoachPlan);
  const metrics = calculateTactic({ ...state, players: scenario.players, scenario });
  const simulation = simulateMatch({ ...state, players: scenario.players, scenario, metrics });
  return { state, metrics, simulation };
};

test("여섯 경기의 로스터와 결정 시점 데이터가 완전하다", () => {
  assert.equal(scenarioCatalog.length, 6);

  scenarioCatalog.forEach((scenario) => {
    const squad = [...scenario.initialLineup, ...scenario.initialBench];
    assert.equal(scenario.initialLineup.length, 11);
    assert.equal(scenario.initialBench.length, 5);
    assert.equal(new Set(squad).size, squad.length);
    assert.ok(squad.every((id) => scenario.players[id]));
    assert.equal(
      scenario.initialLineup.filter((id) => scenario.players[id].role === "GK").length,
      1,
    );
    assert.equal(scenario.simulationOffsets.at(-1), scenario.targetMinute - scenario.minute);
    assert.match(scenario.theme.home, /^#[0-9a-f]{6}$/i);
    assert.match(scenario.theme.away, /^#[0-9a-f]{6}$/i);
    assert.ok(scenario.theme.ambience.length > 0);
    assert.ok(scenario.archive.tags.length > 0);
    assert.ok(scenario.archive.fanLine.length > 0);
    assert.match(scenario.homeCode, /^[A-Z]{2}$/);
    assert.match(scenario.awayCode, /^[A-Z]{2}$/);
    assert.notEqual(scenario.homeCode, scenario.awayCode);
    assert.match(scenario.sourceUrl, /^https:\/\/(?:www\.|inside\.)fifa\.com\//);
    assert.doesNotMatch(scenario.tournament, /FIFA/i);
    assert.ok(Object.values(scenario.players).every((player) => !player.portrait));
  });
});

test("권리 정보가 완전한 정확한 선수 초상만 노출한다", () => {
  const unverified = {
    name: "선수",
    portrait: { src: "/portrait.jpg", rightsStatus: "cleared", license: "CC BY 4.0" },
  };
  const verified = {
    name: "선수",
    portrait: {
      src: "/portrait.jpg",
      rightsStatus: "cleared",
      license: "CC BY 4.0",
      attribution: "Photographer",
      permissionReference: "rights/portrait-release.pdf",
    },
  };

  assert.equal(getApprovedPortrait(unverified), null);
  assert.equal(getApprovedPortrait(verified), verified.portrait);
  assert.ok(Object.values(scenarioCatalog[0].players).every((player) => !getApprovedPortrait(player)));
});

test("국가 유니폼 색상은 밝기에 따라 읽기 쉬운 등번호 색을 선택한다", () => {
  assert.deepEqual(getKitPalette("#f6d743"), { kit: "#f6d743", ink: "#10251b" });
  assert.deepEqual(getKitPalette("#e83d48"), { kit: "#e83d48", ink: "#ffffff" });
});

test("포메이션을 바꿔도 선수 역할이 맞는 슬롯에 재배치된다", () => {
  const scenario = scenarioCatalog[0];
  const arranged433 = assignPlayersToFormation({
    formationName: "4-3-3",
    lineup: scenario.initialLineup,
    players: scenario.players,
    currentPositions: formations[scenario.initialFormation],
    targetPositions: formations["4-3-3"],
  });
  const arranged343 = assignPlayersToFormation({
    formationName: "3-4-3",
    lineup: scenario.initialLineup,
    players: scenario.players,
    currentPositions: formations[scenario.initialFormation],
    targetPositions: formations["3-4-3"],
  });

  assert.deepEqual(
    arranged433.lineup.slice(8).map((id) => scenario.players[id].role),
    formationRoleSlots["4-3-3"].slice(8),
  );
  assert.equal(scenario.players[arranged433.lineup[6]].role, "DM");
  assert.equal(scenario.players[arranged343.lineup[4]].role, "RB");
  assert.equal(scenario.players[arranged343.lineup[7]].role, "LB");
  assert.deepEqual(
    arranged343.lineup.slice(8).map((id) => scenario.players[id].role),
    formationRoleSlots["3-4-3"].slice(8),
  );
});

test("기본 대응은 목표를 놓치고 경기별 코치 플랜은 목표를 달성한다", () => {
  scenarioCatalog.forEach((scenario) => {
    const baseline = runScenario(scenario);
    const coachPlan = runScenario(scenario, true);

    assert.equal(baseline.simulation.summary.missionSuccess, false, `${scenario.id}: 기본 대응`);
    assert.equal(coachPlan.simulation.summary.missionSuccess, true, `${scenario.id}: 코치 플랜`);
    assert.ok(coachPlan.metrics.coachScore > baseline.metrics.coachScore);
    assert.equal(coachPlan.simulation.events.length, 6);
  });
});

test("교체와 전술 변경은 경기별 핵심 지표와 결과를 실제로 바꾼다", () => {
  const [ghana, portugal, argentina, belgium, brazil, japan] = scenarioCatalog;
  const ghanaBase = runScenario(ghana);
  const ghanaPlan = runScenario(ghana, true);
  const portugalBase = runScenario(portugal);
  const portugalPlan = runScenario(portugal, true);
  const argentinaBase = runScenario(argentina);
  const argentinaPlan = runScenario(argentina, true);
  const belgiumBase = runScenario(belgium);
  const belgiumPlan = runScenario(belgium, true);
  const brazilBase = runScenario(brazil);
  const brazilPlan = runScenario(brazil, true);
  const japanBase = runScenario(japan);
  const japanPlan = runScenario(japan, true);

  assert.ok(ghanaPlan.simulation.summary.xgFor > ghanaBase.simulation.summary.xgFor);
  assert.ok(ghanaPlan.simulation.summary.xgAgainst < ghanaBase.simulation.summary.xgAgainst);
  assert.ok(portugalPlan.metrics.momentum > portugalBase.metrics.momentum);
  assert.ok(argentinaPlan.metrics.restDefense >= argentinaBase.metrics.restDefense + 20);
  assert.ok(argentinaPlan.simulation.summary.xgAgainst < argentinaBase.simulation.summary.xgAgainst);
  assert.ok(belgiumPlan.metrics.aerialThreat >= belgiumBase.metrics.aerialThreat + 15);
  assert.ok(brazilPlan.metrics.restDefense >= brazilBase.metrics.restDefense + 25);
  assert.ok(brazilPlan.simulation.summary.xgAgainst < brazilBase.simulation.summary.xgAgainst);
  assert.ok(japanPlan.metrics.restDefense >= japanBase.metrics.restDefense + 20);
  assert.ok(japanPlan.metrics.counterRisk <= japanBase.metrics.counterRisk - 15);
  assert.ok(japanPlan.simulation.summary.xgAgainst < japanBase.simulation.summary.xgAgainst);
  assert.equal(japanPlan.simulation.summary.resultLabel, "연장 진입");
});

test("동일한 전술은 언제나 동일한 장면과 스코어를 만든다", () => {
  scenarioCatalog.forEach((scenario) => {
    const first = runScenario(scenario, true).simulation;
    const second = runScenario(scenario, true).simulation;
    assert.deepEqual(second, first);
  });
});

test("최종 이벤트의 누적 xG와 경기 요약이 일치하고 득점자가 경로에 맞게 달라진다", () => {
  scenarioCatalog.forEach((scenario) => {
    const simulation = runScenario(scenario, true).simulation;
    const finalEvent = simulation.events.at(-1);
    assert.equal(finalEvent.xgFor, simulation.summary.xgFor);
    assert.equal(finalEvent.xgAgainst, simulation.summary.xgAgainst);
  });

  const belgiumSimulation = runScenario(scenarioCatalog[3], true).simulation;
  const goalTitles = belgiumSimulation.events
    .filter((event) => event.kind === "goal")
    .map((event) => event.title)
    .join(" ");
  assert.match(goalTitles, /루카쿠/);
  assert.match(goalTitles, /펠라이니/);
  assert.match(goalTitles, /샤들리/);
});

test("득점과 실점 장면의 공은 실제 골문 안에서 끝난다", () => {
  scenarioCatalog.forEach((scenario) => {
    const simulations = [runScenario(scenario).simulation, runScenario(scenario, true).simulation];

    simulations.forEach((simulation) => {
      simulation.events.forEach((event) => {
        const finalBall = event.scene.frames.at(-1).ball;
        assert.deepEqual(event.scene.ball, finalBall);

        if (event.kind === "goal") {
          assert.ok(finalBall.x >= 44 && finalBall.x <= 56, `${event.id}: 득점 공의 x 좌표`);
          assert.equal(finalBall.y, 4.4, `${event.id}: 득점 공의 골라인 좌표`);
          assert.equal(event.scene.pathPoints.length, 4);
        } else if (event.kind === "concede") {
          assert.ok(finalBall.x >= 44 && finalBall.x <= 56, `${event.id}: 실점 공의 x 좌표`);
          assert.equal(finalBall.y, 95.6, `${event.id}: 실점 공의 골라인 좌표`);
          assert.equal(event.scene.pathPoints.length, 4);
        } else {
          assert.deepEqual(finalBall, event.pitch);
          assert.equal(event.scene.pathPoints.length, 3);
        }
      });
    });
  });
});

test("현장 지시 설명은 조사 결합 없이 자연스럽게 읽힌다", () => {
  scenarioCatalog.forEach((scenario) => {
    const simulation = runScenario(scenario, true).simulation;
    const buildEvent = simulation.events.find((event) => event.kind === "tactic");

    assert.match(buildEvent.title, /: 경기의 다음 경로가 바뀝니다$/);
    assert.doesNotMatch(buildEvent.title, /과부하이|유지이|안전핀이/);
    assert.match(simulation.summary.verdict, / 경로로 .* 미션을 완수했습니다\.$/);
  });
});
