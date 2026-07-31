import test from "node:test";
import assert from "node:assert/strict";
import { formations, scenarioCatalog } from "../src/data/scenario.js";
import { calculateTactic } from "../src/engine/scoring.js";
import { simulateMatch } from "../src/engine/simulation.js";

const createCoachState = (scenario) => {
  const lineup = [...scenario.initialLineup];
  const bench = [...scenario.initialBench];
  const substitutions = [];

  scenario.coachPlan.substitutions.forEach(({ outId, inId }, index) => {
    const lineupIndex = lineup.indexOf(outId);
    const benchIndex = bench.indexOf(inId);
    lineup[lineupIndex] = inId;
    bench[benchIndex] = outId;
    substitutions.push({ outId, inId, minute: scenario.minute + 2 + index * 3 });
  });

  return {
    lineup,
    bench,
    substitutions,
    formation: scenario.coachPlan.formation,
    controls: { ...scenario.coachPlan.controls },
    positions: formations[scenario.coachPlan.formation].map((position) => ({ ...position })),
  };
};

const simulate = (scenario, state, liveCall = "keep") => {
  const metrics = calculateTactic({ ...state, players: scenario.players, scenario });
  return simulateMatch({ ...state, players: scenario.players, scenario, metrics, liveCall });
};

test("live calls change the projected match and keep a full tactical scene", () => {
  const scenario = scenarioCatalog[3];
  const state = createCoachState(scenario);
  const keep = simulate(scenario, state, "keep");
  const attack = simulate(scenario, state, "attack");
  const secure = simulate(scenario, state, "secure");

  assert.ok(attack.summary.xgFor > keep.summary.xgFor);
  assert.ok(secure.summary.xgAgainst < keep.summary.xgAgainst);
  assert.equal(secure.summary.liveCallKey, "secure");
  assert.equal(keep.events[0].scene.homePlayers.length, 11);
  assert.equal(keep.events[0].scene.awayPlayers.length, 11);
  assert.equal(keep.events[0].scene.frames.length, 4);
  assert.deepEqual(
    keep.events[0].scene.frames.map((frame) => frame.label),
    ["재정렬", "전진", "압박 돌파", "결정"],
  );
  assert.notDeepEqual(
    keep.events[0].scene.frames[0].ball,
    keep.events[0].scene.frames.at(-1).ball,
  );
  assert.equal(keep.events[0].choiceEchoes.length, 4);
  assert.notDeepEqual(attack.events[0].scene.homePlayers, secure.events[0].scene.homePlayers);
});

test("a dragged player position appears in the replay scene", () => {
  const scenario = scenarioCatalog[0];
  const baseState = createCoachState(scenario);
  const movedState = {
    ...baseState,
    positions: baseState.positions.map((position, index) =>
      index === 7 ? { ...position, x: position.x + 13, y: position.y - 9 } : position,
    ),
  };
  const baseScene = simulate(scenario, baseState).events[0].scene;
  const movedScene = simulate(scenario, movedState).events[0].scene;

  assert.notDeepEqual(movedScene.homePlayers[7], baseScene.homePlayers[7]);
});
