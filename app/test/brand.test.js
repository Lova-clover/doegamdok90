import test from "node:test";
import assert from "node:assert/strict";
import {
  CHALLENGE_PREFIX,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  buildChallengeCode,
} from "../src/utils/brand.js";

test("product identity and challenge codes stay consistent", () => {
  assert.equal(PRODUCT_NAME, "되감독90");
  assert.equal(PRODUCT_TAGLINE, "그 경기를 되감고, 내가 감독이 된다.");
  assert.equal(CHALLENGE_PREFIX, "DG90");
  assert.equal(
    buildChallengeCode({
      homeCode: "KR",
      awayCode: "PT",
      minute: 65,
      managerScore: 92,
      completedChallenges: 3,
    }),
    "DG90-KRPT-65-92-3",
  );
});
