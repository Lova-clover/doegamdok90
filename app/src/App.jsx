import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { Broadcast } from "@phosphor-icons/react/dist/csr/Broadcast";
import { ChartBar } from "@phosphor-icons/react/dist/csr/ChartBar";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { Database } from "@phosphor-icons/react/dist/csr/Database";
import { Info } from "@phosphor-icons/react/dist/csr/Info";
import { ListBullets } from "@phosphor-icons/react/dist/csr/ListBullets";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { SoccerBall } from "@phosphor-icons/react/dist/csr/SoccerBall";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { SpeakerSlash } from "@phosphor-icons/react/dist/csr/SpeakerSlash";
import { Strategy } from "@phosphor-icons/react/dist/csr/Strategy";
import { UsersThree } from "@phosphor-icons/react/dist/csr/UsersThree";
import { BriefPanel } from "./components/BriefPanel.jsx";
import { PitchBoard } from "./components/PitchBoard.jsx";
import { ReportView } from "./components/ReportView.jsx";
import { SimulationOverlay } from "./components/SimulationOverlay.jsx";
import { StaffPanel } from "./components/StaffPanel.jsx";
import { TeamFlag } from "./components/TeamFlag.jsx";
import {
  defaultScenarioId,
  formations,
  scenarioById,
  scenarioCatalog,
} from "./data/scenario.js";
import { getPersona, calculateTactic } from "./engine/scoring.js";
import { getSubstitutionError } from "./engine/rules.js";
import { simulateMatch } from "./engine/simulation.js";
import { createCrowdAmbience } from "./engine/crowdAudio.js";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "./utils/brand.js";
import { assignPlayersToFormation } from "./utils/formationAssignment.js";
import { evaluateMatchChallenges, getNextScenario } from "./utils/matchExperience.js";

// Keep the legacy key so existing users retain saved match sessions after the rename.
const SAVE_KEY = "touchline-replay-90:sessions:v4";
const SAVE_VERSION = 5;

const ARCHIVE_FILTERS = [
  { key: "all", label: "전체 6경기" },
  { key: "heartbreak", label: "아쉬운 경기" },
  { key: "korea", label: "한국 경기" },
  { key: "protect", label: "리드 수성" },
  { key: "comeback", label: "역전 설계" },
];

const formatSigned = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}`;

const clampPosition = (position) => ({
  x: Math.max(7, Math.min(93, position.x)),
  y: Math.max(6, Math.min(94, position.y)),
});

const clonePositions = (items) => items.map((position) => ({ ...position }));

const createScenarioSession = (scenario) => {
  const targetPositions = formations[scenario.initialFormation];
  const arranged = assignPlayersToFormation({
    formationName: scenario.initialFormation,
    lineup: scenario.initialLineup,
    players: scenario.players,
    currentPositions: targetPositions,
    targetPositions,
  });
  return {
    formation: scenario.initialFormation,
    lineup: arranged.lineup,
    bench: [...scenario.initialBench],
    positions: arranged.positions,
    controls: { ...scenario.defaultControls },
    selectedId: scenario.defaultSelectedId,
    substitutions: [],
    coachPlanActive: false,
    updatedAt: null,
  };
};

const normalizeSession = (scenario, saved) => {
  const validFormation = Boolean(formations[saved?.formation]);
  const validLineup =
    Array.isArray(saved?.lineup) &&
    saved.lineup.length === 11 &&
    new Set(saved.lineup).size === 11 &&
    saved.lineup.every((id) => scenario.players[id]);
  const validBench =
    Array.isArray(saved?.bench) && saved.bench.every((id) => scenario.players[id]);
  const validPositions =
    Array.isArray(saved?.positions) &&
    saved.positions.length === 11 &&
    saved.positions.every(
      (position) => Number.isFinite(position?.x) && Number.isFinite(position?.y),
    );
  if (!validFormation || !validLineup || !validBench || !validPositions) return null;
  return {
    ...saved,
    lineup: [...saved.lineup],
    bench: [...saved.bench],
    positions: clonePositions(saved.positions),
    controls: { ...scenario.defaultControls, ...saved.controls },
    selectedId: saved.lineup.includes(saved.selectedId) ? saved.selectedId : saved.lineup[0],
    substitutions: Array.isArray(saved.substitutions)
      ? saved.substitutions.slice(0, scenario.maxSubstitutions ?? 3)
      : [],
    coachPlanActive: Boolean(saved.coachPlanActive),
  };
};

const loadSavedApp = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY));
    if (![4, SAVE_VERSION].includes(saved?.version)) return null;
    const sessions = {};
    Object.entries(saved.sessions ?? {}).forEach(([scenarioId, session]) => {
      const scenario = scenarioById[scenarioId];
      if (!scenario) return;
      const normalized = normalizeSession(scenario, session);
      if (normalized) sessions[scenarioId] = normalized;
    });
    return {
      activeScenarioId: scenarioById[saved.activeScenarioId]
        ? saved.activeScenarioId
        : defaultScenarioId,
      sessions,
      enteredScenarioIds: Array.isArray(saved.enteredScenarioIds)
        ? saved.enteredScenarioIds.filter((scenarioId) => scenarioById[scenarioId])
        : Object.keys(sessions),
      completedScenarioIds: Array.isArray(saved.completedScenarioIds)
        ? saved.completedScenarioIds.filter((scenarioId) => scenarioById[scenarioId])
        : [],
    };
  } catch {
    return null;
  }
};

const loadSharedChallenge = () => {
  const params = new URLSearchParams(window.location.search);
  const scenarioId = params.get("scenario");
  const target = Number.parseInt(params.get("target"), 10);
  const code = params.get("code");
  if (!scenarioById[scenarioId] || !Number.isFinite(target) || target < 1 || target > 100 || !code) {
    return null;
  }
  return { scenarioId, target, code };
};

const formatDelta = (current, previous) => current - previous;

export function App() {
  const [restoredApp] = useState(loadSavedApp);
  const [sharedChallenge] = useState(loadSharedChallenge);
  const initialScenarioId = sharedChallenge?.scenarioId ?? restoredApp?.activeScenarioId ?? defaultScenarioId;
  const initialScenario = scenarioById[initialScenarioId];
  const initialSession = sharedChallenge
    ? createScenarioSession(initialScenario)
    : restoredApp?.sessions?.[initialScenarioId] ?? createScenarioSession(initialScenario);
  const sessionCacheRef = useRef({
    ...(restoredApp?.sessions ?? {}),
    ...(sharedChallenge ? { [initialScenarioId]: initialSession } : {}),
  });
  const crowdAmbienceRef = useRef(null);

  const [activeScenarioId, setActiveScenarioId] = useState(initialScenarioId);
  const [formation, setFormation] = useState(initialSession.formation);
  const [lineup, setLineup] = useState(initialSession.lineup);
  const [bench, setBench] = useState(initialSession.bench);
  const [positions, setPositions] = useState(initialSession.positions);
  const [controls, setControls] = useState(initialSession.controls);
  const [selectedId, setSelectedId] = useState(initialSession.selectedId);
  const [substitutions, setSubstitutions] = useState(initialSession.substitutions);
  const [coachPlanActive, setCoachPlanActive] = useState(initialSession.coachPlanActive);
  const [liveCall, setLiveCall] = useState("keep");
  const [phase, setPhase] = useState("board");
  const [introOpen, setIntroOpen] = useState(true);
  const [archiveFilter, setArchiveFilter] = useState("all");
  const [audioOn, setAudioOn] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [mobileTab, setMobileTab] = useState("board");
  const [history, setHistory] = useState([]);
  const [savedAt, setSavedAt] = useState(initialSession.updatedAt ?? null);
  const [actionMessage, setActionMessage] = useState(
    restoredApp?.enteredScenarioIds?.includes(initialScenarioId) ? "저장된 전술을 불러왔습니다." : "",
  );
  const [impactBaseline, setImpactBaseline] = useState(null);
  const [lastAction, setLastAction] = useState("");
  const [enteredScenarioIds, setEnteredScenarioIds] = useState(
    () => new Set(restoredApp?.enteredScenarioIds ?? []),
  );
  const [completedScenarioIds, setCompletedScenarioIds] = useState(
    () => new Set(restoredApp?.completedScenarioIds ?? []),
  );

  const scenario = scenarioById[activeScenarioId];
  const players = scenario.players;
  const selectedPlayer = selectedId ? players[selectedId] : null;
  const filteredScenarios = useMemo(() => {
    const filtered = archiveFilter === "all"
      ? scenarioCatalog
      : scenarioCatalog.filter((item) => item.archive.tags.includes(archiveFilter));
    return [...filtered].sort((left, right) => {
      if (left.id === defaultScenarioId) return -1;
      if (right.id === defaultScenarioId) return 1;
      return 0;
    });
  }, [archiveFilter]);
  const metrics = useMemo(
    () =>
      calculateTactic({
        lineup,
        positions,
        formation,
        controls,
        substitutions,
        players,
        scenario,
      }),
    [controls, formation, lineup, players, positions, scenario, substitutions],
  );
  const simulation = useMemo(
    () =>
      simulateMatch({
        scenario,
        metrics,
        controls,
        formation,
        lineup,
        positions,
        substitutions,
        players,
        liveCall,
      }),
    [controls, formation, lineup, liveCall, metrics, players, positions, scenario, substitutions],
  );
  const matchChallenges = useMemo(
    () => evaluateMatchChallenges({ scenario, simulation, metrics }),
    [metrics, scenario, simulation],
  );
  const nextScenario = useMemo(
    () => getNextScenario(scenarioCatalog, activeScenarioId, completedScenarioIds),
    [activeScenarioId, completedScenarioIds],
  );
  const baselineSession = useMemo(() => createScenarioSession(scenario), [scenario]);
  const baselineMetrics = useMemo(
    () =>
      calculateTactic({
        lineup: baselineSession.lineup,
        positions: baselineSession.positions,
        formation: baselineSession.formation,
        controls: baselineSession.controls,
        substitutions: baselineSession.substitutions,
        players,
        scenario,
      }),
    [baselineSession, players, scenario],
  );
  const baselineSimulation = useMemo(
    () =>
      simulateMatch({
        scenario,
        metrics: baselineMetrics,
        controls: baselineSession.controls,
        formation: baselineSession.formation,
        lineup: baselineSession.lineup,
        positions: baselineSession.positions,
        substitutions: baselineSession.substitutions,
        players,
        liveCall: "keep",
      }),
    [baselineMetrics, baselineSession, players, scenario],
  );
  const persona = useMemo(
    () => getPersona(metrics, controls, substitutions, scenario),
    [controls, metrics, scenario, substitutions],
  );
  const impactDelta = useMemo(() => {
    if (!impactBaseline) return null;
    return {
      goalThreat: formatDelta(metrics.goalThreat, impactBaseline.goalThreat),
      control: formatDelta(metrics.control, impactBaseline.control),
      restDefense: formatDelta(metrics.restDefense, impactBaseline.restDefense),
      momentum: formatDelta(metrics.momentum, impactBaseline.momentum),
      counterRisk: formatDelta(metrics.counterRisk, impactBaseline.counterRisk),
    };
  }, [impactBaseline, metrics]);
  const decisionImpact = useMemo(() => {
    const changes = [];
    if (formation !== scenario.initialFormation) {
      changes.push(`${scenario.initialFormation} → ${formation}`);
    }
    const controlLabels = { tempo: "속도", width: "폭", pressing: "압박", risk: "위험" };
    Object.entries(controls).forEach(([key, value]) => {
      if (value !== scenario.defaultControls[key]) {
        changes.push(`${controlLabels[key]} ${scenario.defaultControls[key]}→${value}`);
      }
    });
    if (substitutions.length > 0) {
      changes.push(
        `교체 ${substitutions
          .map((item) => players[item.inId]?.shortName)
          .filter(Boolean)
          .join("·")}`,
      );
    }
    const formationPositions = formations[formation];
    const movedCount = positions.filter((position, index) => {
      const reference = formationPositions[index];
      return Math.hypot(position.x - reference.x, position.y - reference.y) >= 4;
    }).length;
    if (movedCount > 0) changes.push(`직접 이동 ${movedCount}명`);
    if (liveCall !== "keep") changes.push(`현장 지시 ${simulation.selectedLiveCall.label}`);

    const restDefenseDelta = metrics.restDefense - baselineMetrics.restDefense;
    const goalThreatDelta = metrics.goalThreat - baselineMetrics.goalThreat;
    const controlDelta = metrics.control - baselineMetrics.control;
    let spaceTitle = "선수 간격이 미세하게 다시 정렬됐습니다";
    let spaceCopy = "기본 전술과 비슷한 균형이지만 공의 진행 경로와 압박 시작점이 달라졌습니다.";
    if (restDefenseDelta >= 4) {
      spaceTitle = "공 뒤 중앙 통로가 좁아졌습니다";
      spaceCopy = `후방 안정이 ${restDefenseDelta} 올라 공을 잃은 뒤 상대의 첫 전진 패스를 늦춥니다.`;
    } else if (restDefenseDelta <= -4) {
      spaceTitle = "공 뒤 중앙 통로가 넓어졌습니다";
      spaceCopy = `공격 숫자가 늘어난 대신 후방 안정이 ${Math.abs(restDefenseDelta)} 낮아져 한 번의 탈압박이 곧 역습이 됩니다.`;
    } else if (goalThreatDelta >= 4) {
      spaceTitle = "박스 안 도착 숫자가 늘었습니다";
      spaceCopy = `득점 위협이 ${goalThreatDelta} 올라 첫 슈팅과 세컨드 볼을 동시에 노릴 수 있습니다.`;
    } else if (goalThreatDelta <= -4) {
      spaceTitle = "박스보다 공 소유를 우선합니다";
      spaceCopy = `득점 위협 ${Math.abs(goalThreatDelta)}를 내주고 전환 시 선수 간 거리를 줄였습니다.`;
    } else if (controlDelta >= 4) {
      spaceTitle = "중앙에서 한 번 더 패스할 시간이 생겼습니다";
      spaceCopy = `경기 통제가 ${controlDelta} 올라 성급한 전진보다 안정적인 다음 패스를 선택합니다.`;
    }

    const xgForDelta = simulation.summary.xgFor - baselineSimulation.summary.xgFor;
    const xgAgainstDelta = simulation.summary.xgAgainst - baselineSimulation.summary.xgAgainst;
    const scoreChanged =
      simulation.summary.compactScore !== baselineSimulation.summary.compactScore;
    return {
      changes: changes.length > 0 ? changes : ["결정 시점의 실제 배치 유지"],
      spaceTitle,
      spaceCopy,
      xgForDelta,
      xgAgainstDelta,
      outcomeTitle: scoreChanged
        ? `${baselineSimulation.summary.compactScore} 예상이 ${simulation.summary.compactScore}로 바뀝니다`
        : "스코어 전에 득점 기대값이 먼저 변했습니다",
      outcomeCopy: `내 xG ${formatSigned(xgForDelta)} · 상대 xG ${formatSigned(xgAgainstDelta)}`,
      baselineScore: baselineSimulation.summary.compactScore,
      currentScore: simulation.summary.compactScore,
    };
  }, [baselineMetrics, baselineSimulation, controls, formation, liveCall, metrics, players, positions, scenario, simulation, substitutions]);
  const hasSavedCurrent = enteredScenarioIds.has(activeScenarioId);
  const isSharedChallenge = sharedChallenge?.scenarioId === activeScenarioId;

  useEffect(
    () => () => {
      crowdAmbienceRef.current?.stop();
      crowdAmbienceRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const updatedAt = Date.now();
    const session = {
      version: SAVE_VERSION,
      updatedAt,
      formation,
      lineup,
      bench,
      positions,
      controls,
      selectedId,
      substitutions,
      coachPlanActive,
    };
    sessionCacheRef.current[activeScenarioId] = session;
    try {
      window.localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          version: SAVE_VERSION,
          activeScenarioId,
          sessions: sessionCacheRef.current,
          enteredScenarioIds: [...enteredScenarioIds],
          completedScenarioIds: [...completedScenarioIds],
        }),
      );
      setSavedAt(updatedAt);
    } catch {
      setSavedAt(null);
    }
  }, [
    activeScenarioId,
    bench,
    coachPlanActive,
    completedScenarioIds,
    controls,
    enteredScenarioIds,
    formation,
    lineup,
    positions,
    selectedId,
    substitutions,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeScenarioId, introOpen, phase]);

  useEffect(() => {
    if (!introOpen && phase !== "simulation") return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [introOpen, phase]);

  const captureSnapshot = () => ({
    formation,
    lineup: [...lineup],
    bench: [...bench],
    positions: clonePositions(positions),
    controls: { ...controls },
    selectedId,
    substitutions: substitutions.map((item) => ({ ...item })),
    coachPlanActive,
  });

  const recordHistory = () => {
    const snapshot = captureSnapshot();
    setHistory((current) => [...current, snapshot].slice(-20));
  };

  const beginChange = (label) => {
    setImpactBaseline({
      goalThreat: metrics.goalThreat,
      control: metrics.control,
      restDefense: metrics.restDefense,
      momentum: metrics.momentum,
      counterRisk: metrics.counterRisk,
    });
    setLastAction(label);
  };

  const restoreSession = (session) => {
    setFormation(session.formation);
    setLineup([...session.lineup]);
    setBench([...session.bench]);
    setPositions(clonePositions(session.positions));
    setControls({ ...session.controls });
    setSelectedId(session.selectedId);
    setSubstitutions(session.substitutions.map((item) => ({ ...item })));
    setCoachPlanActive(Boolean(session.coachPlanActive));
  };

  const handleScenarioSelect = (scenarioId) => {
    if (scenarioId === activeScenarioId) return;
    const nextScenario = scenarioById[scenarioId];
    const cached = sessionCacheRef.current[scenarioId];
    const nextSession = cached ?? createScenarioSession(nextScenario);
    setActiveScenarioId(scenarioId);
    restoreSession(nextSession);
    setHistory([]);
    setImpactBaseline(null);
    setLastAction("");
    setLiveCall("keep");
    setActionMessage(
      enteredScenarioIds.has(scenarioId)
        ? "이 경기의 저장된 전술을 불러왔습니다."
        : "새 결정의 순간을 불러왔습니다.",
    );
    setPhase("board");
    setMobileTab("board");
    setShareStatus("");
    setSavedAt(nextSession.updatedAt ?? null);
  };

  const handleSimulationComplete = () => {
    setCompletedScenarioIds((current) => new Set(current).add(activeScenarioId));
    setPhase("report");
  };

  const handleNextMatch = () => {
    if (!nextScenario) return;
    handleScenarioSelect(nextScenario.id);
    setEnteredScenarioIds((current) => new Set(current).add(nextScenario.id));
    setIntroOpen(false);
  };

  const handleUndo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    beginChange("마지막 전술 변경 실행 취소");
    restoreSession(previous);
    setHistory((current) => current.slice(0, -1));
    setActionMessage("이전 전술로 되돌렸습니다.");
  };

  const handleMove = (playerId, nextPosition) => {
    const index = lineup.indexOf(playerId);
    if (index < 0) return;
    const label = `${players[playerId].name} 위치 조정`;
    recordHistory();
    beginChange(label);
    setCoachPlanActive(false);
    setPositions((current) =>
      current.map((position, itemIndex) =>
        itemIndex === index ? clampPosition(nextPosition) : position,
      ),
    );
    setActionMessage(`${label}: 경기 경로를 다시 계산했습니다.`);
  };

  const handleFormationChange = (name) => {
    if (name === formation) return;
    const label = `${name} 포메이션 전환`;
    recordHistory();
    beginChange(label);
    const arranged = assignPlayersToFormation({
      formationName: name,
      lineup,
      players,
      currentPositions: positions,
      targetPositions: formations[name],
    });
    setFormation(name);
    setLineup(arranged.lineup);
    setPositions(arranged.positions);
    setCoachPlanActive(false);
    setActionMessage(`${name} 포메이션을 적용했습니다.`);
  };

  const handleControlChange = (key, value) => {
    const nextValue = Math.max(1, Math.min(10, value));
    if (controls[key] === nextValue) return;
    const labels = { tempo: "전개 속도", width: "공격 폭", pressing: "압박 강도", risk: "위험 감수" };
    const label = `${labels[key]} ${controls[key]} → ${nextValue}`;
    recordHistory();
    beginChange(label);
    setControls((current) => ({ ...current, [key]: nextValue }));
    setCoachPlanActive(false);
    setActionMessage(`${label}: 예상 경기 흐름을 다시 계산했습니다.`);
  };

  const handleSubstitute = (benchId) => {
    if (!selectedId || !bench.includes(benchId)) return;
    const slotIndex = lineup.indexOf(selectedId);
    if (slotIndex < 0) return;
    const outgoingId = selectedId;
    const outgoingPlayer = players[outgoingId];
    const incomingPlayer = players[benchId];
    const substitutionError = getSubstitutionError({
      outgoingPlayer,
      incomingPlayer,
      substitutionCount: substitutions.length,
      maxSubstitutions: scenario.maxSubstitutions ?? 3,
    });
    if (substitutionError) {
      setActionMessage(substitutionError);
      return;
    }
    const label = `${outgoingPlayer.name} → ${incomingPlayer.name} 교체`;
    recordHistory();
    beginChange(label);
    setLineup((current) => current.map((id, index) => (index === slotIndex ? benchId : id)));
    setBench((current) => current.map((id) => (id === benchId ? outgoingId : id)));
    setSubstitutions((current) => [
      ...current,
      {
        outId: outgoingId,
        inId: benchId,
        minute: scenario.minute + 2 + current.length * 5,
      },
    ]);
    setSelectedId(benchId);
    setCoachPlanActive(false);
    setActionMessage(`${label}: 체력과 역할 변화를 반영했습니다.`);
    window.requestAnimationFrame(() => {
      document.querySelector(".brief-panel")?.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  const resetTactic = () => {
    const next = createScenarioSession(scenario);
    recordHistory();
    beginChange("경기 시작 전술로 초기화");
    restoreSession(next);
    setPhase("board");
    setLiveCall("keep");
    setShareStatus("");
    setActionMessage("이 경기의 결정 시점 전술로 초기화했습니다.");
  };

  const applyPreset = (presetKey) => {
    const preset = scenario.presets[presetKey];
    recordHistory();
    beginChange(`${preset.label} 프리셋 적용`);
    const arranged = assignPlayersToFormation({
      formationName: preset.formation,
      lineup,
      players,
      currentPositions: positions,
      targetPositions: formations[preset.formation],
    });
    setFormation(preset.formation);
    setLineup(arranged.lineup);
    setPositions(arranged.positions);
    setControls({ ...preset.controls });
    setCoachPlanActive(false);
    setActionMessage(`${preset.label} 프리셋으로 시작했습니다.`);
    setEnteredScenarioIds((current) => new Set(current).add(activeScenarioId));
    setIntroOpen(false);
  };

  const applyCoachPlan = () => {
    const plan = scenario.coachPlan;
    recordHistory();
    beginChange(plan.label);
    const nextLineup = [...lineup];
    const nextBench = [...bench];
    const nextSubstitutions = substitutions.map((item) => ({ ...item }));
    let lastIncomingId = selectedId;
    const appliedNames = [];

    plan.substitutions.forEach(({ outId, inId }, planIndex) => {
      const slotIndex = nextLineup.indexOf(outId);
      const benchIndex = nextBench.indexOf(inId);
      if (slotIndex < 0 || benchIndex < 0 || nextSubstitutions.length >= (scenario.maxSubstitutions ?? 3)) return;
      const error = getSubstitutionError({
        outgoingPlayer: players[outId],
        incomingPlayer: players[inId],
        substitutionCount: nextSubstitutions.length,
        maxSubstitutions: scenario.maxSubstitutions ?? 3,
      });
      if (error) return;
      nextLineup[slotIndex] = inId;
      nextBench[benchIndex] = outId;
      nextSubstitutions.push({
        outId,
        inId,
        minute: scenario.minute + 2 + planIndex * 3,
      });
      lastIncomingId = inId;
      appliedNames.push(players[inId].name);
    });

    const arranged = assignPlayersToFormation({
      formationName: plan.formation,
      lineup: nextLineup,
      players,
      currentPositions: positions,
      targetPositions: formations[plan.formation],
      roleOverrides: plan.roleOverrides,
    });
    setFormation(plan.formation);
    setPositions(arranged.positions);
    setControls({ ...plan.controls });
    setLineup(arranged.lineup);
    setBench(nextBench);
    setSubstitutions(nextSubstitutions);
    setSelectedId(lastIncomingId);
    setCoachPlanActive(true);
    setEnteredScenarioIds((current) => new Set(current).add(activeScenarioId));
    setActionMessage(
      appliedNames.length
        ? `${plan.label}: ${appliedNames.join("·")} 투입까지 적용했습니다.`
        : `${plan.label}: 포메이션과 전술 강도를 적용했습니다.`,
    );
  };

  const handleShare = async ({ challengeCode, targetScore }) => {
    const completedChallenges = matchChallenges.filter((challenge) => challenge.passed).length;
    const text = `${PRODUCT_NAME} 감독 도전 | ${scenario.menuLabel} ${scenario.minute}' | ${simulation.summary.compactScore} | ${persona.name} | 매치 플랜 ${completedChallenges}/3 | ${challengeCode} | 같은 경기를 되감아 이 점수를 넘어보세요.`;
    const challengeUrl = new URL(window.location.origin + window.location.pathname);
    challengeUrl.searchParams.set("scenario", activeScenarioId);
    challengeUrl.searchParams.set("target", targetScore);
    challengeUrl.searchParams.set("code", challengeCode);
    const sharePayload = {
      title: `${PRODUCT_NAME} 감독 도전`,
      text,
      url: challengeUrl.toString(),
    };
    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
      } else {
        await navigator.clipboard.writeText(`${text} ${challengeUrl}`);
      }
      setShareStatus("도전장 공유 완료");
    } catch {
      setShareStatus("다시 시도");
    }
  };

  const openScenarioPicker = () => {
    setPhase("board");
    setLiveCall("keep");
    setIntroOpen(true);
  };

  const handleArchiveFilter = (filterKey) => {
    setArchiveFilter(filterKey);
    if (filterKey === "all" || scenario.archive.tags.includes(filterKey)) return;
    const firstMatch = scenarioCatalog.find((item) => item.archive.tags.includes(filterKey));
    if (firstMatch) handleScenarioSelect(firstMatch.id);
  };

  const toggleCrowdAudio = async () => {
    if (crowdAmbienceRef.current) {
      crowdAmbienceRef.current.stop();
      crowdAmbienceRef.current = null;
      setAudioOn(false);
      return;
    }

    try {
      crowdAmbienceRef.current = await createCrowdAmbience();
      setAudioOn(Boolean(crowdAmbienceRef.current));
    } catch {
      crowdAmbienceRef.current = null;
      setAudioOn(false);
      setActionMessage("이 브라우저에서는 관중음을 재생할 수 없습니다.");
    }
  };

  const mobileItems = [
    ["board", "보드", Strategy],
    ["brief", "브리핑", Info],
    ["staff", "코치진", UsersThree],
    ["controls", "전술", ChartBar],
  ];
  const timelineEnd = Math.max(90, scenario.targetMinute);
  const timelineTicks = timelineEnd > 90 ? [0, 15, 30, 45, 60, 75, 90, timelineEnd] : [0, 15, 30, 45, 60, 75, 90];
  const knownEvents = scenario.realEvents.filter((event) => event.minuteValue <= scenario.minute);

  return (
    <div
      className="app-shell"
      data-mobile-tab={mobileTab}
      style={{
        "--home-accent": scenario.theme.home,
        "--away-accent": scenario.theme.away,
        "--match-highlight": scenario.theme.highlight,
      }}
    >
      <header className="topbar">
        <button type="button" className="brand-button" onClick={openScenarioPicker} aria-label="경기 선택 열기">
          <Broadcast size={23} weight="duotone" />
          <span className="brand-wordmark">
            <b>되감독</b><strong>90</strong><small>REWIND · REWRITE</small>
          </span>
        </button>

        <button type="button" className="scoreboard" onClick={openScenarioPicker} aria-label="현재 경기와 다른 경기 선택">
          <strong>{scenario.minute}'</strong>
          <div>
            <span className="score-team score-team-home">
              <i />
              <TeamFlag code={scenario.homeCode} label={scenario.home} decorative />
              {scenario.home}
            </span>
            <b>{scenario.score}</b>
            <span className="score-team score-team-away">
              {scenario.away}
              <TeamFlag code={scenario.awayCode} label={scenario.away} decorative />
              <i />
            </span>
          </div>
          <small>{scenario.tournament} · {scenario.stage}</small>
        </button>

        <div className="topbar-actions">
          <button type="button" onClick={resetTactic} title="전술 초기화">
            <ArrowCounterClockwise size={21} />
            <span>되감기</span>
          </button>
          <button
            type="button"
            onClick={toggleCrowdAudio}
            title={audioOn ? "경기장 관중음 끄기" : "경기장 관중음 켜기"}
            aria-label={audioOn ? "경기장 관중음 끄기" : "경기장 관중음 켜기"}
            aria-pressed={audioOn}
          >
            {audioOn ? <SpeakerHigh size={21} /> : <SpeakerSlash size={21} />}
            <span>관중음</span>
          </button>
          <a href={scenario.sourceUrl} target="_blank" rel="noopener noreferrer" title="데이터 출처">
            <Database size={21} />
            <span>데이터</span>
          </a>
          <button type="button" onClick={openScenarioPicker} title="다른 경기 선택">
            <ListBullets size={21} />
            <span>경기</span>
          </button>
        </div>
      </header>

      <div className="matchday-strip" aria-label="경기장 현황">
        <span className="matchday-live"><Broadcast size={14} weight="fill" /> MATCHDAY LIVE</span>
        <span className="matchday-venue">{scenario.venue}</span>
        <span className="matchday-date">{scenario.date}</span>
        <span className="matchday-pressure">{scenario.theme.ambience}</span>
        <span className={`technical-area ${isSharedChallenge ? "is-challenge-target" : ""}`}>
          <Strategy size={14} weight="duotone" />
          {isSharedChallenge ? `도전 목표 ${sharedChallenge.target}점` : "TECHNICAL AREA"}
        </span>
      </div>

      {phase === "report" ? (
        <ReportView
          scenario={scenario}
          simulation={simulation}
          baselineSimulation={baselineSimulation}
          decisionImpact={decisionImpact}
          metrics={metrics}
          persona={persona}
          substitutions={substitutions}
          players={players}
          onReplay={() => setPhase("simulation")}
          onEdit={() => {
            setIntroOpen(false);
            setPhase("board");
          }}
          onShare={handleShare}
          shareStatus={shareStatus}
          challenges={matchChallenges}
          nextScenario={nextScenario}
          onNextMatch={handleNextMatch}
          incomingChallenge={isSharedChallenge ? sharedChallenge : null}
        />
      ) : (
        <>
          <div className="workspace">
            <BriefPanel
              scenario={scenario}
              selectedPlayer={selectedPlayer}
              bench={bench}
              players={players}
              substitutions={substitutions}
              actionMessage={actionMessage}
              onSubstitute={handleSubstitute}
            />
            <PitchBoard
              scenario={scenario}
              lineup={lineup}
              positions={positions}
              players={players}
              formation={formation}
              formationNames={Object.keys(formations)}
              selectedId={selectedId}
              metrics={metrics}
              impactDelta={impactDelta}
              decisionImpact={decisionImpact}
              onSelect={setSelectedId}
              onMove={handleMove}
              onFormationChange={handleFormationChange}
              onUndo={handleUndo}
              canUndo={history.length > 0}
              savedAt={savedAt}
            />
            <StaffPanel
              scenario={scenario}
              metrics={metrics}
              controls={controls}
              impactDelta={impactDelta}
              lastAction={lastAction}
              simulationPreview={simulation}
              onControlChange={handleControlChange}
              onRunSimulation={() => {
                setLiveCall("keep");
                setPhase("simulation");
              }}
              onReset={resetTactic}
              onApplyCoachPlan={applyCoachPlan}
              coachPlanActive={coachPlanActive}
            />
          </div>

          <section className="cause-effect-strip" aria-label="내 결정이 경기에 미친 영향">
            <div>
              <span>1 · 내가 바꾼 것</span>
              <strong>{decisionImpact.changes.slice(0, 2).join(" · ")}</strong>
            </div>
            <div>
              <span>2 · 공간의 변화</span>
              <strong>{decisionImpact.spaceTitle}</strong>
            </div>
            <div>
              <span>3 · 예상 결과</span>
              <strong>{decisionImpact.outcomeTitle}</strong>
              <small>{decisionImpact.outcomeCopy}</small>
            </div>
          </section>

          <div className="match-timeline" aria-label="경기 타임라인">
            <div className="timeline-label"><SoccerBall size={18} weight="fill" />경기 타임라인</div>
            <div className="timeline-track">
              {timelineTicks.map((minute) => (
                <span className="timeline-tick" key={minute} style={{ left: `${(minute / timelineEnd) * 100}%` }}>{minute}'</span>
              ))}
              <span className="timeline-now" style={{ left: `${(scenario.minute / timelineEnd) * 100}%` }}>{scenario.minute}'</span>
              {knownEvents.map((event) => (
                <span
                  key={`${scenario.id}-${event.minute}`}
                  className={`timeline-event ${event.type === "goal" ? "goal" : "danger"}`}
                  style={{ left: `${(event.minuteValue / timelineEnd) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {phase === "simulation" && (
        <SimulationOverlay
          simulation={simulation}
          baselineSimulation={baselineSimulation}
          scenario={scenario}
          lastAction={lastAction}
          decisionImpact={decisionImpact}
          challenges={matchChallenges}
          liveCall={liveCall}
          onLiveCall={setLiveCall}
          onGoalMoment={() => crowdAmbienceRef.current?.celebrate?.()}
          onBack={() => setPhase("board")}
          onComplete={handleSimulationComplete}
        />
      )}

      {introOpen && phase === "board" && (
        <div className="intro-overlay" role="dialog" aria-modal="true" aria-labelledby="intro-title">
          <div className="intro-dialog archive-dialog">
            <header className="archive-header">
              <div>
                <p className="section-kicker">WORLD CUP DECISION REPLAY</p>
                <h1 id="intro-title">되감독 <strong>90</strong></h1>
                <p className="archive-tagline">
                  <strong>{PRODUCT_TAGLINE}</strong>
                  <span>아쉬웠던 월드컵의 결정 순간을 골라 운명을 다시 쓰세요.</span>
                </p>
              </div>
              <div className="archive-count">
                <strong>{scenarioCatalog.length}</strong>
                <span>실제 경기 분기점<small>{completedScenarioIds.size}개 감독 재작성 완료</small></span>
              </div>
            </header>

            <nav className="archive-filters" aria-label="경기 아카이브 필터">
              {ARCHIVE_FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter.key}
                  className={archiveFilter === filter.key ? "is-active" : ""}
                  onClick={() => handleArchiveFilter(filter.key)}
                  aria-pressed={archiveFilter === filter.key}
                >
                  {filter.label}
                </button>
              ))}
            </nav>

            <div className="archive-layout">
              <section className="archive-list" aria-label="플레이할 경기 선택">
                {filteredScenarios.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`archive-card ${item.id === activeScenarioId ? "is-active" : ""}`}
                      onClick={() => handleScenarioSelect(item.id)}
                      aria-pressed={item.id === activeScenarioId}
                      data-testid={`scenario-${item.id}`}
                      style={{ "--card-accent": item.theme.home }}
                    >
                      <span className="archive-card-matchup" aria-hidden="true">
                        <TeamFlag code={item.homeCode} label={item.home} decorative />
                        <i>VS</i>
                        <TeamFlag code={item.awayCode} label={item.away} decorative />
                      </span>
                      <span className="archive-card-copy">
                        <small>{item.archive.eyebrow}</small>
                        <strong>{item.menuLabel}</strong>
                        <span>{item.minute}' · {item.score} · {item.stage}</span>
                      </span>
                      <em className={`${completedScenarioIds.has(item.id) ? "is-complete" : ""} ${item.id === defaultScenarioId && !enteredScenarioIds.has(item.id) ? "is-recommended" : ""}`}>
                        {completedScenarioIds.has(item.id) && <CheckCircle size={13} weight="fill" />}
                        {completedScenarioIds.has(item.id)
                          ? "완료"
                          : enteredScenarioIds.has(item.id)
                            ? "저장됨"
                            : item.id === defaultScenarioId
                              ? "첫 플레이 추천"
                              : item.badge}
                      </em>
                    </button>
                ))}
              </section>

              <article className="archive-focus" style={{ "--focus-accent": scenario.theme.home }}>
                <section className="archive-focus-matchup" aria-label={`${scenario.home} 대 ${scenario.away}`}>
                  <span className="archive-focus-stage">{scenario.tournament} · {scenario.stage}</span>
                  <div className="archive-rewind-marker" aria-hidden="true">
                    <span>되감기 지점</span>
                    <strong>{scenario.minute}'</strong>
                    <small>여기서부터 당신의 경기</small>
                  </div>
                  <div className="archive-focus-flags">
                    <div>
                      <TeamFlag code={scenario.homeCode} label={scenario.home} />
                      <strong>{scenario.home}</strong>
                    </div>
                    <span className="archive-focus-versus">
                      <small>{scenario.minute}분</small>
                      <b>VS</b>
                    </span>
                    <div>
                      <TeamFlag code={scenario.awayCode} label={scenario.away} />
                      <strong>{scenario.away}</strong>
                    </div>
                  </div>
                  <div className="archive-focus-score">
                    <small>개입 시점 스코어</small>
                    <strong>{scenario.score}</strong>
                  </div>
                  <p>{scenario.date} · {scenario.venue}</p>
                </section>

                <div className="archive-focus-copy">
                  <div className="intro-live-strip">
                    <span>{scenario.archive.decisionLabel}</span>
                    <strong>{scenario.minute}'</strong>
                  </div>
                  <p className="section-kicker">{scenario.archive.eyebrow}</p>
                  <h2>{scenario.menuLabel}</h2>
                  <blockquote>“{scenario.archive.fanLine}”</blockquote>
                  <p>{scenario.archive.hook}</p>
                  <div className="archive-facts">
                    <span><small>실제 결과</small><strong>{scenario.archive.actualResult}</strong></span>
                    <span><small>내 미션</small><strong>{scenario.objective.label}</strong></span>
                  </div>
                  <a className="archive-source" href={scenario.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Database size={15} /> FIFA 경기 기록
                  </a>
                  <p className="archive-integrity-note">
                    비공식 팬 시뮬레이션 · FIFA·대표팀·선수와 제휴 관계가 없습니다. 경기 사실만 공식 기록을 참고하며 xG·능력치·예측 결과는 자체 체험 모델입니다.
                  </p>
                  {isSharedChallenge && (
                    <div className="shared-challenge-notice" role="status">
                      <SoccerBall size={19} weight="fill" />
                      <span>
                        <strong>{sharedChallenge.target}점 기록을 넘겨보세요.</strong>
                        <small>{sharedChallenge.code} · {scenario.minute}'부터 같은 조건으로 시작</small>
                      </span>
                    </div>
                  )}
                  {hasSavedCurrent && !isSharedChallenge && <p className="saved-tactic-notice">이 경기에서 수정한 전술이 자동 저장되어 있습니다.</p>}
                  <div className="preset-grid archive-preset-grid">
                    {Object.entries(scenario.presets).map(([key, preset]) => (
                      <button type="button" key={key} onClick={() => applyPreset(key)}>
                        <span>{preset.label}</span><strong>{preset.formation}</strong><small>{preset.copy}</small>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="intro-primary"
                    onClick={() => {
                      if (isSharedChallenge) {
                        setEnteredScenarioIds((current) => new Set(current).add(activeScenarioId));
                        setIntroOpen(false);
                        setActionMessage(`${sharedChallenge.code} 도전 시작 · 목표 ${sharedChallenge.target}점`);
                        return;
                      }
                      if (hasSavedCurrent) {
                        setIntroOpen(false);
                        return;
                      }
                      if (activeScenarioId === defaultScenarioId) {
                        applyCoachPlan();
                        setIntroOpen(false);
                        setActionMessage("60초 첫 플레이용 승리 플랜을 적용했습니다. 운명 분기를 확인하고 경기를 시작하세요.");
                        return;
                      }
                      applyPreset(scenario.recommendedPreset);
                    }}
                  >
                    <span>
                      <small>{isSharedChallenge ? `감독 도전 · 목표 ${sharedChallenge.target}점` : hasSavedCurrent ? "자동 저장" : activeScenarioId === defaultScenarioId ? "첫 플레이 · 약 60초" : `추천: ${scenario.presets[scenario.recommendedPreset].label}`}</small>
                      {isSharedChallenge ? "같은 경기에서 기록 넘기" : hasSavedCurrent ? "저장한 전술 이어가기" : activeScenarioId === defaultScenarioId ? "추천 승리 플랜으로 시작" : "이 순간의 감독석에 앉기"}
                    </span>
                    <Play size={23} weight="fill" />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {phase === "board" && (
        <nav className="mobile-nav" aria-label="모바일 편집 메뉴">
          {mobileItems.map(([key, label, Icon]) => (
            <button type="button" key={key} className={mobileTab === key ? "is-active" : ""} onClick={() => setMobileTab(key)} aria-pressed={mobileTab === key}>
              <Icon size={20} weight={mobileTab === key ? "fill" : "regular"} /><span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
