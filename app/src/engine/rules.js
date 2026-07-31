export function getSubstitutionError({
  outgoingPlayer,
  incomingPlayer,
  substitutionCount = 0,
  maxSubstitutions = 3,
}) {
  if (!outgoingPlayer) {
    return "먼저 필드에서 교체할 선수를 선택하세요.";
  }
  if (!incomingPlayer) {
    return "투입할 벤치 선수를 선택하세요.";
  }
  if (substitutionCount >= maxSubstitutions) {
    return `교체 카드 ${maxSubstitutions}장을 모두 사용했습니다.`;
  }
  if ((outgoingPlayer.role === "GK") !== (incomingPlayer.role === "GK")) {
    return "골키퍼는 골키퍼 벤치 카드로만 교체할 수 있습니다.";
  }
  return "";
}

