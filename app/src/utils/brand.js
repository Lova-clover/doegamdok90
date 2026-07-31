export const PRODUCT_NAME = "되감독90";
export const PRODUCT_TAGLINE = "그 경기를 되감고, 내가 감독이 된다.";
export const CHALLENGE_PREFIX = "DG90";

export const buildChallengeCode = ({
  homeCode,
  awayCode,
  minute,
  managerScore,
  completedChallenges,
}) =>
  [
    CHALLENGE_PREFIX,
    `${homeCode}${awayCode}`,
    minute,
    managerScore,
    completedChallenges,
  ].join("-");
