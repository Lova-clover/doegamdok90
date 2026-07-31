import test from "node:test";
import assert from "node:assert/strict";
import { interpolateSceneFrame, isGoalMoment } from "../src/utils/replayMotion.js";

const makeFrame = (label, progress, x, focus = false) => ({
  label,
  progress,
  homePlayers: [{ id: "home", x, y: x + 10, focus }],
  awayPlayers: [{ id: "away", x: 100 - x, y: 90 - x, focus: false }],
  ball: { x, y: x * 2 },
});

test("리플레이 프레임 사이는 좌표와 공 경로를 연속 보간한다", () => {
  const frames = [makeFrame("재정렬", 0, 10), makeFrame("전진", 0.34, 30, true)];
  const midpoint = interpolateSceneFrame(frames, 0, 0.5);

  assert.equal(midpoint.homePlayers[0].x, 20);
  assert.equal(midpoint.homePlayers[0].y, 30);
  assert.equal(midpoint.awayPlayers[0].x, 80);
  assert.equal(midpoint.ball.x, 20);
  assert.equal(midpoint.ball.y, 40);
  assert.equal(midpoint.progress, 0.17);
});

test("포커스 선수는 다음 체크포인트에 가까워질 때 자연스럽게 강조된다", () => {
  const frames = [makeFrame("압박 돌파", 0.68, 40), makeFrame("결정", 1, 60, true)];

  assert.equal(interpolateSceneFrame(frames, 0, 0.4).homePlayers[0].focus, false);
  assert.equal(interpolateSceneFrame(frames, 0, 0.8).homePlayers[0].focus, true);
});

test("골 세리머니는 공이 마지막 골라인 구간에 도착한 뒤에만 시작한다", () => {
  const state = { kind: "goal", frameIndex: 2, frameCount: 4, finished: false };

  assert.equal(isGoalMoment({ ...state, frameProgress: 0.55 }), false);
  assert.equal(isGoalMoment({ ...state, frameProgress: 0.89 }), false);
  assert.equal(isGoalMoment({ ...state, frameProgress: 0.9 }), true);
  assert.equal(isGoalMoment({ ...state, kind: "chance", frameProgress: 1 }), false);
  assert.equal(isGoalMoment({ ...state, frameIndex: 3, frameProgress: 0, finished: true }), false);
});
