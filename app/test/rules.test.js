import test from "node:test";
import assert from "node:assert/strict";
import { getSubstitutionError } from "../src/engine/rules.js";

const goalkeeper = { name: "골키퍼", role: "GK" };
const winger = { name: "윙어", role: "LW" };
const striker = { name: "공격수", role: "ST" };

test("필드 선수를 선택하지 않으면 교체를 차단한다", () => {
  assert.equal(
    getSubstitutionError({ incomingPlayer: winger }),
    "먼저 필드에서 교체할 선수를 선택하세요.",
  );
});

test("골키퍼와 필드 선수의 교차 교체를 차단한다", () => {
  assert.match(
    getSubstitutionError({
      outgoingPlayer: goalkeeper,
      incomingPlayer: winger,
    }),
    /골키퍼 벤치 카드/,
  );
  assert.match(
    getSubstitutionError({
      outgoingPlayer: striker,
      incomingPlayer: goalkeeper,
    }),
    /골키퍼 벤치 카드/,
  );
});

test("같은 골키퍼 역할끼리의 교체는 허용한다", () => {
  assert.equal(
    getSubstitutionError({
      outgoingPlayer: goalkeeper,
      incomingPlayer: { name: "교체 골키퍼", role: "GK" },
    }),
    "",
  );
});

test("세 번째 교체 이후 추가 교체를 차단한다", () => {
  assert.equal(
    getSubstitutionError({
      outgoingPlayer: striker,
      incomingPlayer: winger,
      substitutionCount: 3,
    }),
    "교체 카드 3장을 모두 사용했습니다.",
  );
});

