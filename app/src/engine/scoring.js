const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)));

const average = (values, fallback = 0) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;

const formationImpact = {
  "4-2-3-1": { attack: 1, control: 4, defense: 5, momentum: 0 },
  "4-3-3": { attack: 5, control: 6, defense: 1, momentum: 4 },
  "3-4-3": { attack: 10, control: 1, defense: -7, momentum: 8 },
  "5-4-1": { attack: -7, control: 4, defense: 13, momentum: -4 },
};

const defensiveRoles = new Set(["GK", "CB", "LB", "RB", "LWB", "RWB", "DM"]);

export function calculateTactic({
  lineup,
  positions,
  formation,
  controls,
  substitutions,
  players,
  scenario,
  baseline = scenario?.realBaselineDecisionScore ?? 64,
}) {
  const activePlayers = lineup.map((id) => players[id]).filter(Boolean);
  const freshPlayers = substitutions.map((item) => players[item.inId]).filter(Boolean);
  const mode = scenario?.model?.mode ?? "chase";
  const opponent = scenario?.opponent ?? {
    transition: 70,
    attack: 70,
    defense: 72,
    aerial: 72,
    press: 60,
  };
  const weights = scenario?.model?.weights ?? {
    attack: 0.36,
    control: 0.22,
    defense: 0.24,
    momentum: 0.18,
  };
  const wideAttackers = positions.filter(
    (position) => position.y < 58 && (position.x < 28 || position.x > 72),
  ).length;
  const centralAnchors = positions.filter(
    (position, index) =>
      index !== 0 &&
      position.y >= 54 &&
      position.y <= 73 &&
      position.x >= 31 &&
      position.x <= 69,
  ).length;
  const fullbacksHigh = [1, 4].filter((index) => positions[index]?.y < 55).length;
  const centralAttackers = positions.filter(
    (position) => position.y < 48 && position.x > 32 && position.x < 68,
  ).length;
  const freshRunnerBonus = freshPlayers.filter((player) => player.pace >= 82).length;
  const freshStaminaBonus = freshPlayers.filter((player) => player.stamina >= 88).length;
  const aerialTargets = activePlayers.filter(
    (player, index) => player.aerial >= 82 && positions[index]?.y < 56,
  ).length;
  const averageStamina = average(activePlayers.map((player) => player.stamina), 75);
  const attackQuality = average(
    activePlayers
      .map((player) => player.finishing * 0.43 + player.creativity * 0.37 + player.pace * 0.2)
      .sort((a, b) => b - a)
      .slice(0, 5),
    72,
  );
  const defenseQuality = average(
    activePlayers
      .filter((player) => defensiveRoles.has(player.role))
      .map((player) => player.defending * 0.76 + player.aerial * 0.24),
    76,
  );
  const impact = formationImpact[formation] ?? formationImpact["4-2-3-1"];

  const goalThreat = clamp(
    19 +
      controls.tempo * 3 +
      controls.width * 2 +
      controls.risk * 1.15 +
      wideAttackers * 3 +
      freshRunnerBonus * 8 +
      impact.attack +
      (attackQuality - 72) * 0.45 +
      Math.max(0, aerialTargets - 1) * Math.max(0, 76 - opponent.aerial) * 0.08 -
      Math.max(0, centralAttackers - 3) * 4,
  );
  const control = clamp(
    36 +
      centralAnchors * 5 +
      (10 - Math.abs(controls.tempo - 6) * 2) +
      impact.control +
      (attackQuality - 72) * 0.18 -
      controls.risk * 0.75 -
      Math.max(0, controls.pressing - 7) * 2 -
      Math.max(0, opponent.press - 78) * 0.08,
  );
  const restDefense = clamp(
    70 +
      centralAnchors * 5 +
      impact.defense +
      (defenseQuality - 76) * 0.35 -
      controls.risk * 2.8 -
      fullbacksHigh * 9 -
      Math.max(0, controls.pressing - 6) * 2,
  );
  const momentum = clamp(
    25 +
      controls.tempo * 3 +
      controls.risk * 1.4 +
      substitutions.length * 5 +
      freshStaminaBonus * 5 +
      impact.momentum,
  );
  const counterRisk = clamp(
    31 +
      controls.risk * 4 +
      fullbacksHigh * 12 +
      Math.max(0, controls.pressing - 6) * 4 -
      centralAnchors * 7 +
      (opponent.transition - 70) * 0.25,
  );
  const shotQuality = clamp(goalThreat * 0.54 + attackQuality * 0.5 - opponent.defense * 0.18);
  const aerialThreat = clamp(
    24 + aerialTargets * 15 + controls.width * 2 + Math.max(0, 75 - opponent.aerial) * 0.5,
  );

  let contradictionPenalty = 0;
  if (controls.pressing >= 8 && averageStamina < 79) contradictionPenalty += 6;
  if (fullbacksHigh >= 2 && centralAnchors < 2) contradictionPenalty += 9;
  if (controls.risk >= 9 && centralAnchors < 2) contradictionPenalty += 5;
  if (mode === "protect" && controls.risk >= 7) contradictionPenalty += 10;

  const chaseBonus =
    (controls.width >= 7 && wideAttackers >= 2 ? 4 : 0) +
    (centralAnchors >= 2 ? 4 : 0) +
    (controls.tempo >= 7 ? 3 : 0) +
    freshRunnerBonus * 6 +
    substitutions.length * 2 +
    (aerialThreat >= 70 && opponent.aerial < 70 ? 5 : 0);
  const protectBonus =
    (controls.risk <= 4 ? 5 : 0) +
    (centralAnchors >= 2 ? 5 : 0) +
    (formation === "5-4-1" ? 6 : 0) +
    (fullbacksHigh === 0 ? 4 : 0) +
    (controls.tempo <= 4 ? 3 : 0);
  const missionBonus = mode === "protect" ? protectBonus : chaseBonus;

  const coachScore = clamp(
    goalThreat * weights.attack +
      control * weights.control +
      restDefense * weights.defense +
      momentum * weights.momentum -
      contradictionPenalty +
      missionBonus,
  );
  const fateShift = Math.min(30, Math.max(-30, coachScore - baseline));

  const reasons = [];
  const warnings = [];

  if (mode === "protect" && restDefense >= 70) {
    reasons.push("박스 앞에 두 줄을 만들어 상대의 연속 침투 경로를 줄였습니다.");
  }
  if (mode === "protect" && controls.tempo <= 4) {
    reasons.push("공격 속도를 낮춰 상대가 다시 공격할 수 있는 횟수를 줄였습니다.");
  }
  if (controls.width >= 7 && wideAttackers >= 2) {
    reasons.push("폭을 넓혀 상대 수비 블록 바깥에 전진 통로를 만들었습니다.");
  }
  if (freshRunnerBonus > 0) {
    reasons.push("빠른 교체 카드가 지친 수비 뒤 공간의 속도 우위를 만듭니다.");
  }
  if (centralAnchors >= 2) {
    reasons.push("중앙 전환 통로에 안전핀을 남겨 두 번째 공격을 준비했습니다.");
  }
  if (aerialThreat >= 70 && opponent.aerial < 70) {
    reasons.push("공중 우위를 살릴 수 있도록 크로스의 도착 지점을 늘렸습니다.");
  }
  if (formation === "4-3-3") {
    reasons.push("중원 연결점이 늘어나 세컨드볼 이후 공격을 이어갈 수 있습니다.");
  }
  if (formation === "3-4-3") {
    reasons.push("최전방 숫자를 늘려 박스 점유와 압박 회수 위치를 높였습니다.");
  }
  if (formation === "5-4-1") {
    reasons.push("마지막 수비선의 폭을 넓혀 박스 안 두 번째 침투를 막았습니다.");
  }

  if (fullbacksHigh >= 2) {
    warnings.push("양쪽 수비수가 동시에 올라 공을 잃은 직후 측면 통로가 열립니다.");
  }
  if (controls.pressing >= 8 && averageStamina < 79) {
    warnings.push("현재 체력으로 강한 압박을 오래 유지하기 어렵습니다.");
  }
  if (counterRisk >= 68) {
    warnings.push("공격 숫자는 충분하지만 첫 압박이 벗겨지면 중앙 수비가 직접 노출됩니다.");
  }
  if (mode !== "protect" && controls.risk <= 3) {
    warnings.push("안정적이지만 남은 시간 안에 필요한 득점 수를 만들기 어렵습니다.");
  }
  if (mode === "protect" && controls.risk >= 7) {
    warnings.push("현재 리드에 비해 전진 인원이 많아 한 번의 실점이 연속 압박으로 이어질 수 있습니다.");
  }
  if (centralAttackers > 3) {
    warnings.push("중앙에 선수가 겹쳐 패스 길과 침투 공간이 동시에 좁아졌습니다.");
  }

  while (reasons.length < 3) {
    reasons.push(
      reasons.length === 0
        ? "선수 간격이 안정적이라 첫 패스 선택지가 유지됩니다."
        : "공격과 수비의 간격이 크게 끊기지 않았습니다.",
    );
  }
  if (warnings.length === 0) {
    warnings.push(
      mode === "protect"
        ? "수비 라인이 너무 낮아지면 세컨드볼을 계속 내줄 수 있습니다."
        : "득점을 서두를수록 마지막 구간의 체력 소모가 커집니다.",
    );
  }

  const staff = {
    head:
      mode === "protect"
        ? restDefense >= 70
          ? "좋습니다. 박스 앞 간격이 닫혔습니다. 첫 패스만 서두르지 마세요."
          : "상대 공격수가 늘었습니다. 수비선 앞에 한 명을 더 남겨야 합니다."
        : controls.width >= 7
          ? "폭은 좋습니다. 이제 박스 안 두 번째 주자의 도착 시간을 맞추세요."
          : "상대 수비가 중앙에 모였습니다. 공격 폭을 7 이상으로 넓혀보세요.",
    analyst:
      restDefense >= 62
        ? "중앙 안전핀이 남아 있어 공을 잃어도 첫 역습을 지연시킬 수 있습니다."
        : "중앙 전환 통로가 비었습니다. 미드필더 한 명을 더 낮춰야 합니다.",
    fitness:
      substitutions.length > 0
        ? `${freshPlayers.map((player) => player.name).join("·")}의 체력 우위가 다음 10분의 속도를 바꿉니다.`
        : controls.pressing >= 7
          ? "강한 압박을 유지하려면 지금 교체 카드가 필요합니다."
          : "선발 체력은 버틸 수 있지만 다음 경기 국면 전에 교체가 필요합니다.",
  };

  return {
    goalThreat,
    control,
    restDefense,
    momentum,
    counterRisk,
    shotQuality,
    aerialThreat,
    attackQuality: Math.round(attackQuality),
    defenseQuality: Math.round(defenseQuality),
    coachScore,
    fateShift,
    reasons: reasons.slice(0, 3),
    warnings: warnings.slice(0, 2),
    staff,
    signals: {
      wideAttackers,
      centralAnchors,
      fullbacksHigh,
      freshRunnerBonus,
      aerialTargets,
      averageStamina: Math.round(averageStamina),
      missionBonus,
    },
  };
}

export function getPersona(metrics, controls, substitutions, scenario) {
  if (scenario?.model?.mode === "protect" && metrics.restDefense >= 75) {
    return {
      name: "리드 잠금 설계자",
      copy: "상대의 다음 공격 횟수부터 줄이며 시간을 지배하는 감독입니다.",
    };
  }
  if (metrics.aerialThreat >= 75 && substitutions.length > 0) {
    return {
      name: "공중전 전환술사",
      copy: "높이와 크로스 도착점을 바꿔 막힌 경기의 해법을 만드는 감독입니다.",
    };
  }
  if (metrics.counterRisk >= 72 && metrics.goalThreat >= 78) {
    return {
      name: "혼돈의 승부사",
      copy: "득점을 위해 후방 위험까지 감수하는 과감한 감독입니다.",
    };
  }
  if (metrics.restDefense >= 72 && metrics.control >= 65) {
    return {
      name: "균형의 수호자",
      copy: "공격할 때도 다음 수비를 먼저 준비하는 관리형 감독입니다.",
    };
  }
  if (controls.width >= 7 && substitutions.length > 0) {
    return {
      name: "측면 전환 설계자",
      copy: "폭과 교체 타이밍으로 수비의 시선을 흔드는 감독입니다.",
    };
  }
  if (controls.pressing >= 8) {
    return {
      name: "압박의 낭만가",
      copy: "경기의 흐름을 기다리지 않고 직접 빼앗아오는 감독입니다.",
    };
  }
  return {
    name: "하프스페이스 엔지니어",
    copy: "선수 간격과 패스 각도로 결정적 공간을 만드는 감독입니다.",
  };
}
