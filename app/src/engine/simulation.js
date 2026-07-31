const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round2 = (value) => Math.round(value * 100) / 100;

export const getLiveCallOptions = (scenario) => {
  const isProtecting = scenario.model.mode === "protect";
  return [
    {
      key: "keep",
      label: "설계 유지",
      copy: "편집한 포메이션과 강도를 그대로 믿고 전개합니다.",
      effect: "현재 xG와 위험 유지",
      forMultiplier: 1,
      againstMultiplier: 1,
    },
    {
      key: "attack",
      label: isProtecting ? "역습 한 방" : "박스 과부하",
      copy: isProtecting
        ? "측면 주자 한 명을 남겨 공을 되찾는 즉시 골문을 노립니다."
        : "한 명을 더 박스에 넣어 득점 기회를 늘립니다.",
      effect: "내 xG 상승 · 역습 위험 상승",
      forMultiplier: isProtecting ? 1.18 : 1.12,
      againstMultiplier: isProtecting ? 1.22 : 1.18,
    },
    {
      key: "secure",
      label: isProtecting ? "박스 잠금" : "전환 안전핀",
      copy: isProtecting
        ? "라인 간격을 줄이고 박스 앞 두 줄을 유지합니다."
        : "공격 숫자 한 명을 줄여 공을 잃는 순간부터 역습을 막습니다.",
      effect: "내 xG 감소 · 상대 xG 크게 감소",
      forMultiplier: isProtecting ? 0.78 : 0.88,
      againstMultiplier: isProtecting ? 0.52 : 0.62,
    },
  ];
};

const goalsFromXg = (xg, side, scenario) => {
  const shock = side === "against" ? scenario.model?.shockFactor ?? 1 : 1;
  const adjusted = xg * shock;
  const thresholds = scenario.model?.goalThresholds?.[side] ?? [0.9, 1.35, 2.45];
  if (adjusted >= thresholds[2]) return 3;
  if (adjusted >= thresholds[1]) return 2;
  if (adjusted >= thresholds[0]) return 1;
  return 0;
};

const formatScore = (home, away) => `${home} : ${away}`;

const selectEventAttacker = ({ lineup, players, substitutions, slotIndex, path }) => {
  const activePlayers = lineup.map((id) => players[id]).filter(Boolean);
  const freshPlayers = substitutions.map((item) => players[item.inId]).filter(Boolean);
  const bestFinisher = [...activePlayers].sort(
    (left, right) => right.finishing - left.finishing || right.creativity - left.creativity,
  )[0];
  const aerialTarget = [...freshPlayers, ...activePlayers].sort(
    (left, right) => right.aerial - left.aerial || right.finishing - left.finishing,
  )[0];
  const freshRunner = [...freshPlayers].sort(
    (left, right) => right.pace - left.pace || right.finishing - left.finishing,
  )[0];

  if (path.name === "높이 우위" && slotIndex === 3) return aerialTarget ?? bestFinisher;
  if (slotIndex === 5 && freshRunner) return freshRunner;
  return bestFinisher;
};

const buildPath = (metrics, controls, scenario, liveCall) => {
  if (liveCall.key === "attack") {
    return scenario.model.mode === "protect"
      ? {
          name: "역습 한 방",
          detail: "수비 블록 밖에 남겨 둔 측면 주자가 공을 되찾는 즉시 골문으로 전진합니다.",
          x: controls.width >= 7 ? 76 : 62,
        }
      : {
          name: "박스 과부하",
          detail: "공격 숫자 한 명을 더 넣어 크로스의 첫 공과 세컨드 볼을 동시에 노립니다.",
          x: controls.width >= 7 ? 74 : 54,
        };
  }
  if (liveCall.key === "secure") {
    return scenario.model.mode === "protect"
      ? {
          name: "박스 잠금",
          detail: "박스 앞 두 줄의 간격을 좁혀 상대가 중앙에서 돌아설 시간을 없앱니다.",
          x: 50,
        }
      : {
          name: "전환 안전핀",
          detail: "중앙에 한 명을 남겨 공격이 끊기는 순간 상대의 첫 전진 패스를 막습니다.",
          x: 52,
        };
  }
  if (scenario.model.mode === "protect") {
    if (metrics.restDefense >= 72) {
      return {
        name: "박스 앞 두 줄",
        detail: "수비선과 미드필드 간격을 줄여 상대의 두 번째 침투를 먼저 끊습니다.",
        x: 48,
      };
    }
    return {
      name: "불안한 맞불",
      detail: "공을 잃은 뒤 복귀 거리가 길어 상대가 곧바로 박스에 접근합니다.",
      x: 62,
    };
  }
  if (metrics.aerialThreat >= 74 && scenario.opponent.aerial < 70) {
    return {
      name: "높이 우위",
      detail: "넓은 크로스와 반대편 도착이 상대의 공중 약점을 직접 겨냥합니다.",
      x: controls.width >= 7 ? 76 : 58,
    };
  }
  if (controls.width >= 7 && metrics.signals.wideAttackers >= 2) {
    return {
      name: "측면-하프스페이스 전환",
      detail: "넓힌 폭이 수비를 끌어내고 안쪽 침투 선수에게 슈팅 각도를 만듭니다.",
      x: 78,
    };
  }
  return {
    name: "중앙 조합",
    detail: "짧은 패스로 중앙을 공략하지만 수비 숫자가 많아 마지막 패스가 어렵습니다.",
    x: 50,
  };
};

const oppositionBase = [
  { id: "opp-1", number: 1, role: "GK", x: 50, y: 9 },
  { id: "opp-2", number: 2, role: "RB", x: 18, y: 25 },
  { id: "opp-4", number: 4, role: "CB", x: 39, y: 22 },
  { id: "opp-5", number: 5, role: "CB", x: 61, y: 22 },
  { id: "opp-3", number: 3, role: "LB", x: 82, y: 25 },
  { id: "opp-6", number: 6, role: "DM", x: 35, y: 41 },
  { id: "opp-8", number: 8, role: "CM", x: 65, y: 41 },
  { id: "opp-7", number: 7, role: "RW", x: 20, y: 58 },
  { id: "opp-10", number: 10, role: "AM", x: 50, y: 55 },
  { id: "opp-11", number: 11, role: "LW", x: 80, y: 58 },
  { id: "opp-9", number: 9, role: "ST", x: 50, y: 66 },
];

const attackingRoles = new Set(["ST", "LW", "RW", "AM", "CM", "LWB", "RWB"]);
const defensiveRoles = new Set(["GK", "CB", "LB", "RB", "DM"]);
const goalMouth = {
  minX: 44,
  maxX: 56,
  topY: 4.4,
  bottomY: 95.6,
};

const interpolate = (from, to, progress) => round2(from + (to - from) * progress);

const pointAlongPath = (points, progress) => {
  const scaled = clamp(progress, 0, 1) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaled));
  const localProgress = scaled - index;
  return {
    x: interpolate(points[index].x, points[index + 1].x, localProgress),
    y: interpolate(points[index].y, points[index + 1].y, localProgress),
  };
};

const createScene = ({
  event,
  lineup,
  positions,
  players,
  controls,
  formation,
  liveCall,
  path,
}) => {
  const isOurAttack = event.team === "us";
  const widthScale = 1 + (controls.width - 5) * 0.035;
  const forwardShift = 2.5 + controls.tempo * 0.42 + (liveCall.key === "attack" ? 3 : 0);
  const safetyShift = liveCall.key === "secure" ? 4 : 0;
  const target = event.pitch;
  const goalTarget =
    event.kind === "goal"
      ? { x: clamp(target.x, goalMouth.minX, goalMouth.maxX), y: goalMouth.topY }
      : event.kind === "concede"
        ? { x: clamp(target.x, goalMouth.minX, goalMouth.maxX), y: goalMouth.bottomY }
        : null;

  const homePlayers = lineup.map((playerId, index) => {
    const player = players[playerId];
    const original = positions?.[index] ?? { x: 50, y: 50 };
    let x = original.x;
    let y = original.y;

    if (isOurAttack) {
      x = 50 + (x - 50) * widthScale;
      y -= attackingRoles.has(player.role) ? forwardShift : forwardShift * 0.45;
      if (liveCall.key === "secure" && defensiveRoles.has(player.role)) y += safetyShift;
    } else {
      x = 50 + (x - 50) * (liveCall.key === "secure" ? 0.72 : 0.84);
      y += defensiveRoles.has(player.role) ? 2.5 : 7.5;
    }

    if (playerId === event.focusId) {
      x = clamp(target.x + (isOurAttack ? -2 : 3), 7, 93);
      y = clamp(target.y + (isOurAttack ? 5 : -5), 7, 93);
    } else if (isOurAttack && attackingRoles.has(player.role) && y < target.y + 11) {
      x += index % 2 === 0 ? -7 : 7;
      y = target.y + 10 + (index % 3) * 4;
    }

    return {
      id: playerId,
      number: player.number,
      name: player.shortName,
      role: player.role,
      x: round2(clamp(x, 7, 93)),
      y: round2(clamp(y, 7, 93)),
      focus: playerId === event.focusId,
    };
  });

  const awayPlayers = oppositionBase.map((player) => {
    const targetPull = (target.x - 50) * (isOurAttack ? 0.16 : 0.05);
    const isForward = attackingRoles.has(player.role);
    let x = player.x + targetPull;
    let y = player.y;
    if (isOurAttack) {
      y += player.role === "GK" ? 0 : 2;
      x = 50 + (x - 50) * (controls.width >= 7 ? 1.08 : 0.9);
    } else if (isForward) {
      y += 9 + controls.risk * 0.35;
    }
    return {
      ...player,
      x: round2(clamp(x, 7, 93)),
      y: round2(clamp(y, 7, 93)),
      focus: !isOurAttack && player.role === "ST",
    };
  });

  const pathPoints = isOurAttack
    ? [
        { x: 50, y: 78 },
        { x: path.x, y: event.kind === "tactic" ? 56 : 47 },
        { x: target.x, y: target.y },
        ...(goalTarget ? [goalTarget] : []),
      ]
    : [
        { x: 48, y: 34 },
        { x: target.x, y: 58 },
        { x: target.x, y: target.y },
        ...(goalTarget ? [goalTarget] : []),
      ];

  const initialHomePlayers = lineup.map((playerId, index) => {
    const player = players[playerId];
    const original = positions?.[index] ?? { x: 50, y: 50 };
    return {
      id: playerId,
      number: player.number,
      name: player.shortName,
      role: player.role,
      x: round2(clamp(original.x, 7, 93)),
      y: round2(clamp(original.y, 7, 93)),
      focus: false,
    };
  });
  const frameDefinitions = [
    { label: "재정렬", progress: 0 },
    { label: "전진", progress: 0.34 },
    { label: "압박 돌파", progress: 0.68 },
    { label: "결정", progress: 1 },
  ];
  const frames = frameDefinitions.map((definition, frameIndex) => {
    const easedProgress = 1 - (1 - definition.progress) ** 2;
    return {
      label: definition.label,
      progress: definition.progress,
      homePlayers: initialHomePlayers.map((player, index) => ({
        ...player,
        x: interpolate(player.x, homePlayers[index].x, easedProgress),
        y: interpolate(player.y, homePlayers[index].y, easedProgress),
        focus: frameIndex >= 2 && homePlayers[index].focus,
      })),
      awayPlayers: oppositionBase.map((player, index) => ({
        ...player,
        x: interpolate(player.x, awayPlayers[index].x, easedProgress),
        y: interpolate(player.y, awayPlayers[index].y, easedProgress),
        focus: frameIndex >= 2 && awayPlayers[index].focus,
      })),
      ball: pointAlongPath(pathPoints, definition.progress),
    };
  });

  return {
    phase:
      event.kind === "tactic"
        ? "빌드업"
        : event.team === "us"
          ? event.kind === "goal"
            ? "결정적 마무리"
            : "공격 전개"
          : event.kind === "concede"
            ? "역습 실점"
            : "전환 수비",
    formation,
    homePlayers,
    awayPlayers,
    pathPoints,
    ball: pathPoints.at(-1),
    frames,
    zone: {
      x: target.x,
      y: target.y,
      label: isOurAttack ? path.name : "전환 수비 구역",
    },
  };
};

const buildChoiceEchoes = ({
  event,
  formation,
  controls,
  substitutions,
  players,
  metrics,
  liveCall,
}) => {
  const incomingNames = substitutions
    .map((item) => players[item.inId]?.shortName)
    .filter(Boolean)
    .join("·");
  const common = [`현장 지시 · ${liveCall.label}`, `${formation} 배치`];
  if (event.kind === "tactic") {
    return [...common, `전개 속도 ${controls.tempo}`, `공격 폭 ${controls.width}`];
  }
  if (event.team === "us") {
    return [
      ...common,
      `공격 폭 ${controls.width}`,
      incomingNames ? `교체 카드 · ${incomingNames}` : `슈팅 품질 ${metrics.shotQuality}`,
    ];
  }
  return [
    ...common,
    `위험 감수 ${controls.risk}`,
    `후방 안정 ${metrics.restDefense}`,
  ];
};

const resultLabel = (scenario, home, away) => {
  if (home > away) return scenario.objective.type === "protect" ? "리드 수성" : "승리";
  if (home === away) {
    if (scenario.objective.successRule === "notLose") return "연장 진입";
    return scenario.objective.type === "protect" ? "연장 허용" : "무승부";
  }
  return scenario.objective.type === "protect" ? "리드 상실" : "패배";
};

export function simulateMatch({
  scenario,
  metrics,
  controls,
  formation,
  lineup,
  positions,
  substitutions,
  players,
  liveCall = "keep",
}) {
  const duration = Math.max(8, scenario.targetMinute - scenario.minute);
  const durationFactor = duration / 30;
  const attackFactor = scenario.model.attackFactor ?? 1;
  const againstFactor = scenario.model.againstFactor ?? 1;
  const mode = scenario.model.mode;
  const liveCallOptions = getLiveCallOptions(scenario);
  const selectedLiveCall =
    liveCallOptions.find((option) => option.key === liveCall) ?? liveCallOptions[0];
  const urgencyMultiplier = mode === "protect" ? 0.55 : controls.risk >= 7 ? 1.08 : 0.96;
  const composureMultiplier =
    controls.risk >= 8 ? scenario.model.highRiskAttackMultiplier ?? 1 : 1;
  const safetyMultiplier = mode === "protect" && controls.risk <= 4 ? 0.72 : 1;
  const aerialControlMultiplier =
    mode === "chase" &&
    metrics.aerialThreat >= 74 &&
    scenario.opponent.aerial < 70 &&
    metrics.signals.centralAnchors >= 2
      ? 0.58
      : 1;

  const xgFor = round2(
    clamp(
      durationFactor *
        (0.1 + metrics.goalThreat / 70 + metrics.momentum / 220) *
        attackFactor *
        urgencyMultiplier *
        composureMultiplier *
        selectedLiveCall.forMultiplier,
      0.08,
      3.4,
    ),
  );
  const xgAgainst = round2(
    clamp(
      durationFactor *
        ((100 - metrics.restDefense) / 65 +
          metrics.counterRisk / 115 +
          scenario.opponent.attack / 180) *
        againstFactor *
        safetyMultiplier *
        aerialControlMultiplier *
        selectedLiveCall.againstMultiplier,
      0.05,
      2.8,
    ),
  );
  const goalsFor = Math.min(3, goalsFromXg(xgFor, "for", scenario));
  const goalsAgainst = Math.min(2, goalsFromXg(xgAgainst, "against", scenario));
  const forGoalSlots =
    goalsFor === 3 ? [1, 3, 5] : goalsFor === 2 ? [1, 5] : goalsFor === 1 ? [5] : [];
  const againstGoalSlots = goalsAgainst === 2 ? [2, 4] : goalsAgainst === 1 ? [4] : [];
  const slotTypes = ["build", "for", "against", "for", "against", "for"];
  const path = buildPath(metrics, controls, scenario, selectedLiveCall);
  const freshNames = substitutions
    .map((item) => players[item.inId]?.name)
    .filter(Boolean)
    .join("·");
  let homeGoals = scenario.initialScore.home;
  let awayGoals = scenario.initialScore.away;
  let cumulativeFor = 0;
  let cumulativeAgainst = 0;
  const forChanceCount = slotTypes.filter((type) => type === "for").length;
  const againstChanceCount = slotTypes.filter((type) => type === "against").length;
  const lastForSlot = slotTypes.lastIndexOf("for");
  const lastAgainstSlot = slotTypes.lastIndexOf("against");
  const progressorId = [...lineup].sort(
    (left, right) =>
      players[right].creativity - players[left].creativity ||
      players[right].pace - players[left].pace,
  )[0];
  const stopperId = [...lineup].sort(
    (left, right) =>
      players[right].defending - players[left].defending ||
      players[right].aerial - players[left].aerial,
  )[0];

  const events = slotTypes.map((type, index) => {
    const minuteValue = scenario.minute + scenario.simulationOffsets[index];
    const minute = `${minuteValue}'`;
    const id = `${scenario.id}-${minuteValue}-${type}`;
    if (type === "build") {
      cumulativeFor = round2(cumulativeFor + Math.min(0.12, xgFor * 0.08));
      return {
        id,
        minute,
        minuteValue,
        tone: "positive",
        kind: "tactic",
        team: "us",
        title: `${path.name}: 경기의 다음 경로가 바뀝니다`,
        detail: path.detail,
        impact: metrics.reasons[0],
        scoreAfter: formatScore(homeGoals, awayGoals),
        xgFor: cumulativeFor,
        xgAgainst: cumulativeAgainst,
        pitch: { x: path.x, y: mode === "protect" ? 62 : 42 },
        focusId: progressorId,
      };
    }

    if (type === "for") {
      const xgIncrement =
        index === lastForSlot
          ? round2(xgFor - cumulativeFor)
          : round2(xgFor * 0.92 / forChanceCount);
      cumulativeFor = round2(cumulativeFor + xgIncrement);
      const isGoal = forGoalSlots.includes(index);
      if (isGoal) homeGoals += 1;
      const attacker = selectEventAttacker({
        lineup,
        players,
        substitutions,
        slotIndex: index,
        path,
      });
      const playerName = attacker?.name ?? scenario.home;
      const substitutionDetail = freshNames
        ? `${freshNames}의 투입으로 수비의 반응 속도보다 한 발 먼저 도착합니다.`
        : "선발 선수의 간격 조정이 슈팅 직전의 한 번 더 패스를 가능하게 합니다.";
      return {
        id,
        minute,
        minuteValue,
        tone: isGoal ? "goal" : "neutral",
        kind: isGoal ? "goal" : "chance",
        team: "us",
        title: isGoal ? `${playerName}, 설계한 경로를 득점으로 완성합니다` : "결정적 슈팅이 골문을 비껴갑니다",
        detail: isGoal ? `${path.detail} ${substitutionDetail}` : `${path.name}으로 슈팅까지 만들었지만 마무리 품질이 한 끗 부족합니다.`,
        impact: `득점 위협 ${metrics.goalThreat} · 슈팅 품질 ${metrics.shotQuality}`,
        scoreAfter: formatScore(homeGoals, awayGoals),
        xgFor: cumulativeFor,
        xgAgainst: cumulativeAgainst,
        pitch: { x: index === 1 ? path.x : 48, y: index === 5 ? 17 : 27 },
        focusId: attacker?.id,
      };
    }

    const xgIncrement =
      index === lastAgainstSlot
        ? round2(xgAgainst - cumulativeAgainst)
        : round2(xgAgainst / againstChanceCount);
    cumulativeAgainst = round2(cumulativeAgainst + xgIncrement);
    const isGoal = againstGoalSlots.includes(index);
    if (isGoal) awayGoals += 1;
    const protectedWell = metrics.restDefense >= 67 && metrics.counterRisk < 64;
    return {
      id,
      minute,
      minuteValue,
      tone: isGoal ? "danger" : protectedWell ? "positive" : "neutral",
      kind: isGoal ? "concede" : "defense",
      team: "them",
      title: isGoal
        ? `${scenario.away}, 비어 있는 전환 통로를 득점으로 연결합니다`
        : protectedWell
          ? "중앙 안전핀이 상대 역습을 끊습니다"
          : "상대 슈팅을 허용했지만 마지막 수비가 버팁니다",
      detail: isGoal
        ? `위험 감수 ${controls.risk}, 역습 위험 ${metrics.counterRisk}의 대가가 실점으로 나타났습니다.`
        : protectedWell
          ? "공을 잃은 위치와 수비선 사이의 거리가 짧아 두 번째 패스 전에 공격을 지연시킵니다."
          : "첫 압박은 벗겨졌지만 수비 숫자가 골문 앞 마지막 슈팅 각도를 줄였습니다.",
      impact: `후방 안정 ${metrics.restDefense} · 역습 위험 ${metrics.counterRisk}`,
      scoreAfter: formatScore(homeGoals, awayGoals),
      xgFor: cumulativeFor,
      xgAgainst: cumulativeAgainst,
      pitch: { x: index === 2 ? 35 : 64, y: index === 2 ? 66 : 78 },
      focusId: stopperId,
    };
  });

  const visualEvents = events.map((event) => ({
    ...event,
    causeTitle: event.team === "us" ? "내 선택이 만든 장면" : "내 선택이 감수한 대가",
    choiceEchoes: buildChoiceEchoes({
      event,
      formation,
      controls,
      substitutions,
      players,
      metrics,
      liveCall: selectedLiveCall,
    }),
    scene: createScene({
      event,
      lineup,
      positions,
      players,
      controls,
      formation,
      liveCall: selectedLiveCall,
      path,
    }),
  }));

  const missionSuccess =
    scenario.objective.successRule === "notLose"
      ? homeGoals >= awayGoals
      : homeGoals > awayGoals;
  const possession = Math.round(
    clamp(50 + (metrics.control - 50) * 0.42 - (scenario.opponent.press - 60) * 0.08, 35, 67),
  );
  const shotsFor = Math.max(goalsFor, Math.round(xgFor * 3.1 + 2));
  const shotsAgainst = Math.max(goalsAgainst, Math.round(xgAgainst * 2.8 + 1));
  const onTargetFor = Math.min(shotsFor, Math.max(goalsFor, Math.round(shotsFor * (metrics.shotQuality / 150))));
  const onTargetAgainst = Math.min(shotsAgainst, Math.max(goalsAgainst, Math.round(shotsAgainst * 0.48)));
  const finalLabel = resultLabel(scenario, homeGoals, awayGoals);

  return {
    id: `${scenario.id}-${formation}-${controls.tempo}-${controls.width}-${controls.pressing}-${controls.risk}-${selectedLiveCall.key}-${lineup.join("-")}`,
    events: visualEvents,
    liveCallOptions,
    selectedLiveCall,
    fingerprint: [
      { label: "포메이션", value: formation },
      { label: "공격", value: `속도 ${controls.tempo} · 폭 ${controls.width}` },
      { label: "수비", value: `압박 ${controls.pressing} · 위험 ${controls.risk}` },
      { label: "교체", value: freshNames || "교체 없음" },
    ],
    summary: {
      homeGoals,
      awayGoals,
      scoreline: `${scenario.home} ${homeGoals} : ${awayGoals} ${scenario.away}`,
      compactScore: formatScore(homeGoals, awayGoals),
      resultLabel: finalLabel,
      missionSuccess,
      xgFor,
      xgAgainst,
      possession,
      shotsFor,
      shotsAgainst,
      onTargetFor,
      onTargetAgainst,
      goalsFor,
      goalsAgainst,
      pathName: path.name,
      liveCallKey: selectedLiveCall.key,
      liveCallLabel: selectedLiveCall.label,
      verdict: missionSuccess
        ? `${path.name} 경로로 ${scenario.objective.label} 미션을 완수했습니다.`
        : `${path.name} 전략으로 경기 흐름을 바꿨지만 ${scenario.objective.label}에는 도달하지 못했습니다.`,
    },
  };
}
