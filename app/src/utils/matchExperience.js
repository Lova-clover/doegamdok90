const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatMetric = (metric, value) => {
  if (["xgFor", "xgAgainst"].includes(metric)) return value.toFixed(2);
  return String(Math.round(value));
};

export function getManagerScore(metrics, summary) {
  return Math.min(
    100,
    Math.round(
      metrics.coachScore * 0.75
        + (summary.missionSuccess ? 25 : summary.homeGoals === summary.awayGoals ? 10 : 0),
    ),
  );
}

export function evaluateMatchChallenges({ scenario, simulation, metrics }) {
  const { summary } = simulation;
  const resultChallenge = {
    key: "result",
    label: "경기 결과",
    targetLabel: scenario.objective.label,
    valueLabel: `${summary.compactScore} · ${summary.resultLabel}`,
    passed: summary.missionSuccess,
    progress: summary.missionSuccess ? 100 : 34,
  };

  const tacticalChallenges = (scenario.challengePlan ?? []).map((challenge) => {
    const source = Object.hasOwn(summary, challenge.metric) ? summary : metrics;
    const value = source[challenge.metric];
    const passed = challenge.operator === "lte"
      ? value <= challenge.target
      : value >= challenge.target;
    const rawProgress = challenge.operator === "lte"
      ? (challenge.target / Math.max(challenge.target, value)) * 100
      : (value / challenge.target) * 100;

    return {
      ...challenge,
      value,
      valueLabel: `${challenge.valuePrefix ?? "현재"} ${formatMetric(challenge.metric, value)}`,
      passed,
      progress: Math.round(clamp(rawProgress, 12, 100)),
    };
  });

  return [resultChallenge, ...tacticalChallenges];
}

export function buildMomentumSeries(events) {
  let previousFor = 0;
  let previousAgainst = 0;

  return events.map((event) => {
    const deltaFor = Math.max(0, event.xgFor - previousFor);
    const deltaAgainst = Math.max(0, event.xgAgainst - previousAgainst);
    previousFor = event.xgFor;
    previousAgainst = event.xgAgainst;

    const delta = event.team === "us" ? deltaFor : deltaAgainst;
    const kindBoost = ["goal", "concede"].includes(event.kind)
      ? 38
      : ["chance", "defense"].includes(event.kind)
        ? 18
        : 8;

    return {
      id: event.id,
      minute: event.minute,
      side: event.team,
      kind: event.kind,
      intensity: Math.round(clamp(22 + delta * 90 + kindBoost, 18, 100)),
    };
  });
}

export function getNextScenario(catalog, activeScenarioId, completedScenarioIds = []) {
  if (catalog.length <= 1) return catalog[0] ?? null;
  const completed = completedScenarioIds instanceof Set
    ? completedScenarioIds
    : new Set(completedScenarioIds);
  const activeIndex = Math.max(0, catalog.findIndex((item) => item.id === activeScenarioId));
  const ordered = [
    ...catalog.slice(activeIndex + 1),
    ...catalog.slice(0, activeIndex + 1),
  ].filter((item) => item.id !== activeScenarioId);

  return ordered.find((item) => !completed.has(item.id)) ?? ordered[0];
}
