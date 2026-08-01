import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { Broadcast } from "@phosphor-icons/react/dist/csr/Broadcast";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { FastForward } from "@phosphor-icons/react/dist/csr/FastForward";
import { FlagCheckered } from "@phosphor-icons/react/dist/csr/FlagCheckered";
import { Gauge } from "@phosphor-icons/react/dist/csr/Gauge";
import { GitBranch } from "@phosphor-icons/react/dist/csr/GitBranch";
import { Pause } from "@phosphor-icons/react/dist/csr/Pause";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { ShieldCheck } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { SoccerBall } from "@phosphor-icons/react/dist/csr/SoccerBall";
import { Strategy } from "@phosphor-icons/react/dist/csr/Strategy";
import { Target } from "@phosphor-icons/react/dist/csr/Target";
import { WarningCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { PlayerIdentity } from "./PlayerIdentity.jsx";
import { TeamFlag } from "./TeamFlag.jsx";
import { buildMomentumSeries } from "../utils/matchExperience.js";
import { interpolateSceneFrame, isGoalMoment } from "../utils/replayMotion.js";

const momentLabels = {
  tactic: "전술 발동",
  chance: "결정적 기회",
  goal: "득점",
  defense: "전환 수비",
  concede: "실점",
};

const momentIcons = {
  tactic: Strategy,
  chance: SoccerBall,
  goal: SoccerBall,
  defense: ShieldCheck,
  concede: WarningCircle,
};

const liveCallIcons = {
  keep: Strategy,
  attack: SoccerBall,
  secure: ShieldCheck,
};

function MatchPlanPreview({ challenges }) {
  return (
    <section className="match-plan-preview" aria-label="이번 경기의 매치 플랜">
      <header>
        <span><Target size={17} weight="duotone" /> 매치 플랜 3</span>
        <small>내 전술로 충족할 경기별 승리 조건</small>
      </header>
      <div>
        {challenges.map((challenge, index) => {
          const isResult = index === 0;
          return (
            <article
              className={`${isResult ? "is-pending" : challenge.passed ? "is-passed" : "is-warning"}`}
              key={challenge.key}
            >
              {isResult ? (
                <Target size={17} weight="bold" />
              ) : challenge.passed ? (
                <CheckCircle size={17} weight="fill" />
              ) : (
                <WarningCircle size={17} weight="fill" />
              )}
              <span>
                <small>{challenge.label}</small>
                <strong>{challenge.targetLabel}</strong>
              </span>
              <em>{isResult ? "종료 후 판정" : challenge.passed ? "예상 충족" : "보완 필요"}</em>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FateFork({ baselineSummary, currentSummary, decisionImpact, compact = false }) {
  return (
    <section className={`fate-fork ${compact ? "is-compact" : ""}`} aria-label="초기 전술과 내 선택의 운명 분기 비교">
      <header>
        <span><GitBranch size={compact ? 14 : 18} weight="bold" /> 운명 분기</span>
        {!compact && <small>같은 결정 시점, 다른 전술 결과</small>}
      </header>
      <div className="fate-fork-branches">
        <article>
          <small>초기 전술 흐름</small>
          <strong>{baselineSummary.compactScore}</strong>
          {!compact && <span>xG {baselineSummary.xgFor.toFixed(2)} : {baselineSummary.xgAgainst.toFixed(2)}</span>}
        </article>
        <ArrowRight size={compact ? 14 : 19} weight="bold" aria-hidden="true" />
        <article className="is-current">
          <small>내 결정 반영</small>
          <strong>{currentSummary.compactScore}</strong>
          {!compact && <span>xG {currentSummary.xgFor.toFixed(2)} : {currentSummary.xgAgainst.toFixed(2)}</span>}
        </article>
      </div>
      {!compact && (
        <p><strong>{decisionImpact.spaceTitle}</strong><span>{decisionImpact.outcomeCopy}</span></p>
      )}
    </section>
  );
}

function MatchMomentum({ events, series, scenario, activeIndex, visibleCount, onSelect }) {
  return (
    <section className="match-momentum" aria-label="공격 모멘텀" data-testid="match-momentum">
      <header>
        <span><TeamFlag code={scenario.homeCode} label={scenario.home} decorative />{scenario.home} 공격</span>
        <strong>경기 흐름</strong>
        <span>{scenario.away} 공격<TeamFlag code={scenario.awayCode} label={scenario.away} decorative /></span>
      </header>
      <div className="momentum-events">
        {events.map((event, index) => {
          const point = series[index];
          const MomentIcon = momentIcons[event.kind] ?? SoccerBall;
          return (
            <button
              type="button"
              key={event.id}
              className={`momentum-event is-${point.side} ${index === activeIndex ? "is-active" : ""} tone-${event.tone}`}
              style={{ "--momentum": point.intensity }}
              disabled={index >= visibleCount}
              onClick={() => onSelect(index, event)}
              aria-label={`${event.minute} ${momentLabels[event.kind]} 장면 보기`}
            >
              <span className="momentum-plot" aria-hidden="true"><i /></span>
              <span className="momentum-meta"><MomentIcon size={11} weight="fill" /><time>{event.minute}</time></span>
              <small>{momentLabels[event.kind]}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TacticalScene({ event, scenario, frameIndex, frameProgress, goalMoment }) {
  const { scene } = event;
  const frames = scene.frames ?? [{
    label: scene.phase,
    progress: 1,
    homePlayers: scene.homePlayers,
    awayPlayers: scene.awayPlayers,
    ball: scene.ball,
  }];
  const frame = interpolateSceneFrame(frames, frameIndex, frameProgress);
  const pathPoints = scene.pathPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const goalTeam = event.team === "us" ? scenario.home : scenario.away;
  const goalSubject = event.title.split(",")[0];

  return (
    <div
      className={`live-pitch is-continuous ${goalMoment ? `is-goal-moment is-${event.team}` : ""}`}
      aria-label={`${event.minute} ${scene.phase} ${frame.label} 전술 장면`}
    >
      <img src="/assets/pitch-dark-vertical.png" alt="위에서 본 축구 경기장" />
      <div className={`scene-scorebug ${goalMoment ? "is-goal-update" : ""}`}>
        <time>{event.minute}</time>
        <strong className="scene-scorebug-match">
          <TeamFlag code={scenario.homeCode} label={scenario.home} decorative />
          <span>{scenario.home}</span>
          <b>{event.scoreAfter}</b>
          <span>{scenario.away}</span>
          <TeamFlag code={scenario.awayCode} label={scenario.away} decorative />
        </strong>
      </div>
      <div className="scene-direction"><Broadcast size={14} weight="fill" /> 상대 골문</div>

      <svg
        className={`scene-route is-${event.team}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker id="scene-route-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" />
          </marker>
        </defs>
        <polyline
          points={pathPoints}
          markerEnd="url(#scene-route-arrow)"
          pathLength="1"
          style={{ strokeDashoffset: 1 - frame.progress }}
        />
        {scene.pathPoints.slice(0, -1).map((point, index) => (
          <circle key={`${event.id}-path-${index}`} cx={point.x} cy={point.y} r="1.1" />
        ))}
      </svg>

      <div
        className={`scene-zone is-${event.team}`}
        style={{
          left: `${scene.zone.x}%`,
          top: `${scene.zone.y}%`,
          opacity: frame.progress >= 0.68 ? 1 : 0.25,
        }}
      >
        <span>{scene.zone.label}</span>
      </div>

      {frame.awayPlayers.map((player) => (
        <span
          className={`scene-player is-away ${player.focus ? "is-focus" : ""}`}
          key={player.id}
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
          aria-hidden="true"
        >
          <PlayerIdentity
            player={player}
            tone="away"
            kitColor={scenario.theme.away}
            decorative
          />
        </span>
      ))}

      {frame.homePlayers.map((player) => (
        <span
          className={`scene-player is-home ${player.focus ? "is-focus" : ""}`}
          key={player.id}
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
          aria-hidden="true"
        >
          <PlayerIdentity
            player={player}
            kitColor={scenario.theme.home}
            decorative
          />
          {player.focus && <small>{player.name}</small>}
        </span>
      ))}

      <span
        className={`scene-ball is-${event.team} ${goalMoment ? "is-goal" : ""}`}
        style={{ left: `${frame.ball.x}%`, top: `${frame.ball.y}%` }}
        aria-hidden="true"
      >
        <SoccerBall size={22} weight="fill" />
      </span>

      {goalMoment && (
        <div className={`scene-goal-banner is-${event.team}`} role="status" aria-live="assertive">
          <SoccerBall size={31} weight="fill" />
          <span>
            <small>{goalTeam} · {goalSubject}</small>
            <strong>GOAL!</strong>
          </span>
          <b>{event.scoreAfter}</b>
        </div>
      )}

      <div className="scene-phase-label">
        <span>{scene.phase} · {frame.label}</span>
        <strong>내 xG {event.xgFor.toFixed(2)} · 상대 xG {event.xgAgainst.toFixed(2)}</strong>
      </div>

      <div className="scene-frame-track" aria-label={`장면 진행 ${frameIndex + 1}/${frames.length}`}>
        {frames.map((item, index) => (
          <span
            className={index <= frameIndex + (frameProgress >= 0.55 ? 1 : 0) ? "is-active" : ""}
            key={item.label}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SimulationOverlay({
  simulation,
  baselineSimulation,
  scenario,
  lastAction,
  decisionImpact,
  challenges,
  liveCall,
  onLiveCall,
  onGoalMoment,
  onBack,
  onComplete,
}) {
  const { events, summary, fingerprint, liveCallOptions, selectedLiveCall } = simulation;
  const [started, setStarted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [frameProgress, setFrameProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const liveShellRef = useRef(null);
  const motionProgressRef = useRef(0);
  const celebratedEventIdsRef = useRef(new Set());
  const currentEvent = events[Math.min(events.length - 1, activeIndex)];
  const momentumSeries = useMemo(() => buildMomentumSeries(events), [events]);
  const passedChallengeCount = challenges.filter((challenge) => challenge.passed).length;
  const frameCount = currentEvent.scene.frames?.length ?? 1;
  const isFinished = started && finished;
  const goalMoment = isGoalMoment({
    kind: currentEvent.kind,
    frameIndex,
    frameCount,
    frameProgress,
    finished,
  });
  const progress = useMemo(
    () => {
      if (!started) return 0;
      if (finished) return 100;
      const eventProgress =
        frameCount <= 1 ? 1 : (frameIndex + frameProgress) / (frameCount - 1);
      return Math.round(((activeIndex + Math.min(1, eventProgress)) / events.length) * 100);
    },
    [activeIndex, events.length, finished, frameCount, frameIndex, frameProgress, started],
  );

  useEffect(() => {
    if (!started || finished || paused) return undefined;

    const finalCheckpoint = frameIndex >= frameCount - 1;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const baseDuration = reducedMotion
      ? finalCheckpoint
        ? 520
        : 220
      : finalCheckpoint
        ? ["goal", "concede"].includes(currentEvent.kind)
          ? 1380
          : 620
        : 980;
    const initialProgress = motionProgressRef.current;
    const duration = Math.max(1, (baseDuration / speed) * (1 - initialProgress));
    const startedAt = window.performance.now();
    let animationFrame = 0;

    const tick = (now) => {
      const elapsed = now - startedAt;
      const progressFromStart = Math.min(1, elapsed / duration);
      const nextProgress = initialProgress + (1 - initialProgress) * progressFromStart;
      motionProgressRef.current = nextProgress;
      setFrameProgress(nextProgress);

      if (progressFromStart < 1) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      motionProgressRef.current = 0;
      setFrameProgress(0);
      if (!finalCheckpoint) {
        setFrameIndex((index) => index + 1);
        return;
      }
      if (activeIndex < events.length - 1) {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        setVisibleCount((count) => Math.max(count, nextIndex + 1));
        setFrameIndex(0);
        return;
      }
      setFinished(true);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeIndex, currentEvent.id, currentEvent.kind, events.length, finished, frameCount, frameIndex, paused, speed, started]);

  useEffect(() => {
    if (!started || !goalMoment || celebratedEventIdsRef.current.has(currentEvent.id)) return;
    celebratedEventIdsRef.current.add(currentEvent.id);
    onGoalMoment?.(currentEvent);
    navigator.vibrate?.([70, 35, 120]);
  }, [currentEvent, goalMoment, onGoalMoment, started]);

  useEffect(() => {
    if (!started) return undefined;
    const frame = window.requestAnimationFrame(() => {
      liveShellRef.current?.scrollTo({ top: 0, left: 0 });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [started]);

  const startReplay = () => {
    setVisibleCount(1);
    setActiveIndex(0);
    setFrameIndex(0);
    motionProgressRef.current = 0;
    setFrameProgress(0);
    setFinished(false);
    celebratedEventIdsRef.current.clear();
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="simulation-overlay" role="dialog" aria-modal="true" aria-labelledby="simulation-ready-title">
        <div className="simulation-shell simulation-ready-shell">
          <header className="simulation-ready-header">
            <div>
              <p className="section-kicker">My tactical fingerprint</p>
              <h2 id="simulation-ready-title">내가 만든 전술로 경기를 시작합니다</h2>
              <p>{scenario.minute}'의 선택이 선수 위치와 공의 경로, 최종 스코어까지 바꿉니다.</p>
            </div>
            <button type="button" className="secondary-button" onClick={onBack}>
              <ArrowLeft size={18} /> 전술 다시 보기
            </button>
          </header>

          <div className="simulation-ready-layout">
            <section className="tactical-fingerprint" aria-label="내 전술 지문">
              <div className="fingerprint-scoreline">
                <span className="fingerprint-team">
                  <TeamFlag code={scenario.homeCode} label={scenario.home} decorative />
                  <b>{scenario.home}</b>
                </span>
                <span className="fingerprint-score">
                  <small>{scenario.minute}' rewind</small>
                  <strong>{scenario.score}</strong>
                </span>
                <span className="fingerprint-team">
                  <TeamFlag code={scenario.awayCode} label={scenario.away} decorative />
                  <b>{scenario.away}</b>
                </span>
              </div>
              <div className="fingerprint-grid">
                {fingerprint.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <div className="last-tactical-change">
                <Strategy size={20} weight="duotone" />
                <span>
                  <small>시뮬레이션에 반영되는 최근 결정</small>
                  <strong>{lastAction || "직접 배치한 11명 좌표와 현재 전술 강도"}</strong>
                </span>
              </div>
              <FateFork
                baselineSummary={baselineSimulation.summary}
                currentSummary={summary}
                decisionImpact={decisionImpact}
              />
              <MatchPlanPreview challenges={challenges} />
              <div className="causal-preview" aria-label="전술 변화의 인과 관계">
                <div><span>내가 바꾼 것</span><strong>{decisionImpact.changes.slice(0, 2).join(" · ")}</strong></div>
                <div><span>생긴 공간</span><strong>{decisionImpact.spaceTitle}</strong></div>
                <div><span>예상 변화</span><strong>{decisionImpact.outcomeCopy}</strong></div>
              </div>
            </section>

            <section className="live-call-panel" aria-label="터치라인 최종 지시">
              <div className="mobile-ready-scoreline" aria-hidden="true">
                <TeamFlag code={scenario.homeCode} label={scenario.home} decorative />
                <span>
                  <small>{scenario.minute}' rewind</small>
                  <strong>{scenario.score}</strong>
                </span>
                <TeamFlag code={scenario.awayCode} label={scenario.away} decorative />
              </div>
              <p className="section-kicker">최종 현장 지시</p>
              <h3>경기 중 가장 우선할 한 가지를 정하세요</h3>
              <p>같은 전술도 이 지시에 따라 공격 장면과 역습 위험이 달라집니다.</p>
              <div className="live-call-options">
                {liveCallOptions.map((option) => {
                  const LiveCallIcon = liveCallIcons[option.key] ?? Strategy;
                  return (
                    <button
                      type="button"
                      key={option.key}
                      className={liveCall === option.key ? "is-active" : ""}
                      onClick={() => onLiveCall(option.key)}
                      aria-pressed={liveCall === option.key}
                      data-testid={`live-call-${option.key}`}
                    >
                      <span className="live-call-option-icon" aria-hidden="true">
                        <LiveCallIcon size={21} weight="duotone" />
                      </span>
                      <span className="live-call-option-copy">
                        <span>{option.label}</span>
                        <strong>{option.copy}</strong>
                        <small>{option.effect}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="start-live-button"
                onClick={startReplay}
                data-testid="start-live-simulation"
              >
                <span>
                  <small>{selectedLiveCall.label} 선택</small>
                  터치라인에서 경기 시작
                </span>
                <Play size={24} weight="fill" />
              </button>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="simulation-overlay" role="dialog" aria-modal="true" aria-labelledby="simulation-title">
      <div className="simulation-shell simulation-live-shell" ref={liveShellRef}>
        <header className="simulation-header">
          <div>
            <p className="section-kicker">되감독 LIVE REPLAY</p>
            <h2 id="simulation-title">{scenario.minute}'부터 내가 만든 전술을 재생합니다</h2>
            <p className="simulation-venue-line">
              {scenario.venue} · {selectedLiveCall.label} · 모든 장면은 내 선택과 연결됩니다
            </p>
          </div>
          <div className="simulation-header-actions">
            <button type="button" className="secondary-button" onClick={onBack} aria-label="시뮬레이션 중단하고 전술 편집">
              <ArrowLeft size={18} />
            </button>
            {isFinished && (
              <button
                type="button"
                className="secondary-button simulation-result-button"
                onClick={onComplete}
                data-testid="view-report-header"
                aria-label="경기 결과와 감독 리포트 보기"
              >
                <FlagCheckered size={18} weight="fill" /> {summary.compactScore} 결과
              </button>
            )}
            {!isFinished && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "시뮬레이션 계속 재생" : "시뮬레이션 일시정지"}
                aria-pressed={paused}
              >
                {paused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
                {paused ? "계속" : "정지"}
              </button>
            )}
            {!isFinished && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSpeed((value) => (value === 1 ? 2 : 1))}
                aria-label={`재생 속도 ${speed}배`}
              >
                <Gauge size={18} /> {speed}x
              </button>
            )}
            {!isFinished && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  celebratedEventIdsRef.current.add(events.at(-1).id);
                  setVisibleCount(events.length);
                  setActiveIndex(events.length - 1);
                  setFrameIndex(events.at(-1).scene.frames?.length - 1 || 0);
                  motionProgressRef.current = 1;
                  setFrameProgress(1);
                  setFinished(true);
                }}
              >
                <FastForward size={18} /> 결과까지
              </button>
            )}
          </div>
        </header>

        <div className="simulation-progress" aria-label={`시뮬레이션 ${progress}% 완료`}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <MatchMomentum
          events={events}
          series={momentumSeries}
          scenario={scenario}
          activeIndex={activeIndex}
          visibleCount={visibleCount}
          onSelect={(index, event) => {
            setActiveIndex(index);
            setFrameIndex(0);
            motionProgressRef.current = 0;
            setFrameProgress(0);
            setFinished(false);
            celebratedEventIdsRef.current.delete(event.id);
          }}
        />

        <div className="simulation-layout simulation-story-layout">
          <TacticalScene
            key={currentEvent.id}
            event={currentEvent}
            scenario={scenario}
            frameIndex={frameIndex}
            frameProgress={frameProgress}
            goalMoment={goalMoment}
          />

          <section className={`scene-story tone-${currentEvent.tone} ${goalMoment ? "is-goal-moment" : ""}`} aria-live="polite">
            <div className="scene-story-score">
              <time>{currentEvent.minute}</time>
              <span>{momentLabels[currentEvent.kind]}</span>
              <strong>{currentEvent.scoreAfter}</strong>
            </div>
            <FateFork
              baselineSummary={baselineSimulation.summary}
              currentSummary={summary}
              decisionImpact={decisionImpact}
              compact
            />
            <p className="scene-cause-kicker">{currentEvent.causeTitle}</p>
            <h3>{currentEvent.title}</h3>
            <p className="scene-detail">{currentEvent.detail}</p>
            <p className="scene-space-explanation">{decisionImpact.spaceCopy}</p>
            <div className="choice-echoes">
              <span>이 장면에 반영된 내 결정</span>
              <div>
                {currentEvent.choiceEchoes.map((choice) => <strong key={choice}>{choice}</strong>)}
              </div>
            </div>
            <div className="scene-impact">
              <Broadcast size={19} weight="duotone" />
              <span>{currentEvent.impact}</span>
            </div>
          </section>
        </div>

        {isFinished && (
          <div className="simulation-finish">
            <div className="simulation-summary-strip">
              <span><small>최종 스코어</small><strong>{summary.compactScore}</strong></span>
              <span><small>내 xG</small><strong>{summary.xgFor.toFixed(2)}</strong></span>
              <span><small>상대 xG</small><strong>{summary.xgAgainst.toFixed(2)}</strong></span>
              <span><small>현장 지시</small><strong>{summary.liveCallLabel}</strong></span>
              <span><small>판정</small><strong>{summary.resultLabel}</strong></span>
            </div>
            <p><strong>매치 플랜 {passedChallengeCount}/3</strong> · {summary.verdict}</p>
            <button
              type="button"
              className="report-button"
              onClick={onComplete}
              data-testid="view-report"
            >
              <span>
                <small>내 결정과 실제 경기 비교</small>
                감독 리포트 보기
              </span>
              <FlagCheckered size={24} weight="fill" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
