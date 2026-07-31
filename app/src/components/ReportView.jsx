import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { GitBranch } from "@phosphor-icons/react/dist/csr/GitBranch";
import { ShareNetwork } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { ShieldCheck } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { Target } from "@phosphor-icons/react/dist/csr/Target";
import { Trophy } from "@phosphor-icons/react/dist/csr/Trophy";
import { WarningCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { TeamFlag } from "./TeamFlag.jsx";
import { buildChallengeCode } from "../utils/brand.js";
import { getManagerScore } from "../utils/matchExperience.js";

export function ReportView({
  scenario,
  simulation,
  baselineSimulation,
  decisionImpact,
  metrics,
  persona,
  substitutions,
  players,
  onReplay,
  onEdit,
  onShare,
  shareStatus,
  challenges,
  nextScenario,
  onNextMatch,
  incomingChallenge,
}) {
  const { summary } = simulation;
  const managerScore = getManagerScore(metrics, summary);
  const completedChallenges = challenges.filter((challenge) => challenge.passed).length;
  const challengeCode = buildChallengeCode({
    homeCode: scenario.homeCode,
    awayCode: scenario.awayCode,
    minute: scenario.minute,
    managerScore,
    completedChallenges,
  });
  const incomingDelta = incomingChallenge ? managerScore - incomingChallenge.target : null;
  const incomingHeadline = incomingChallenge
    ? incomingDelta > 0
      ? `도전 성공 · ${managerScore}점`
      : incomingDelta === 0
        ? `목표와 동점 · ${managerScore}점`
        : `${Math.abs(incomingDelta)}점만 더 올려보세요.`
    : `이 경기에서 ${managerScore}점을 넘어보세요.`;
  const incomingCopy = incomingChallenge
    ? `받은 목표 ${incomingChallenge.target}점 · 내 기록 ${managerScore}점 · 같은 ${scenario.minute}분 조건으로 비교했습니다.`
    : `${scenario.minute}'부터 같은 조건으로 시작해 더 나은 운명 분기를 만들 수 있습니다.`;
  const routeLabel = summary.liveCallLabel === summary.pathName
    ? summary.pathName
    : `${summary.liveCallLabel} · ${summary.pathName}`;
  const substitutionNames = substitutions
    .map((item) => players[item.inId]?.name)
    .filter(Boolean)
    .join("·");

  const comparisons = [
    {
      label: "실제 경기",
      score: scenario.realPath.score,
      outcome: scenario.realPath.outcome,
      copy: scenario.realPath.copy,
      tone: "real",
    },
    {
      label: "내 선택",
      score: managerScore,
      outcome: `${summary.compactScore} · ${summary.resultLabel}`,
      copy: `xG ${summary.xgFor.toFixed(2)} 대 ${summary.xgAgainst.toFixed(2)} · ${summary.pathName} 경로를 만들었습니다.`,
      tone: "mine",
    },
    {
      label: "코치 제안",
      score: scenario.coachComparison.score,
      outcome: scenario.coachComparison.outcome,
      copy: scenario.coachComparison.copy,
      tone: "coach",
    },
  ];

  return (
    <main className="report-view" data-testid="report-view">
      <section className="report-summary">
        <div className="report-score-block">
          <p className="section-kicker">되감독 MATCH REPORT</p>
          <small className="report-venue-line">{scenario.venue} · {scenario.date}</small>
          <div className="report-score">
            <strong>{managerScore}</strong>
            <span>/ 100</span>
          </div>
          <p className={`mission-status ${summary.missionSuccess ? "is-success" : ""}`}>
            {summary.missionSuccess ? (
              <CheckCircle size={18} weight="fill" />
            ) : (
              <WarningCircle size={18} weight="fill" />
            )}
            {summary.missionSuccess ? "미션 성공" : "미션 실패 · 재조정 필요"}
          </p>
        </div>

        <div className="persona-block">
          <div className="persona-icon">
            <Trophy size={30} weight="duotone" />
          </div>
          <p>당신의 감독 유형</p>
          <h1>{persona.name}</h1>
          <span>{persona.copy}</span>
          {substitutionNames && <small>승부 카드: {substitutionNames}</small>}
        </div>

        <div className="fate-report-block">
          <div className="report-match-flags" aria-hidden="true">
            <TeamFlag code={scenario.homeCode} label={scenario.home} decorative />
            <span>Final</span>
            <TeamFlag code={scenario.awayCode} label={scenario.away} decorative />
          </div>
          <p>시뮬레이션 결과</p>
          <strong>{summary.compactScore}</strong>
          <span>{scenario.minute}분부터 {scenario.targetMinute}분까지 · {summary.resultLabel}</span>
          <div className="report-stat-row">
            <span>내 xG {summary.xgFor.toFixed(2)}</span>
            <span>상대 xG {summary.xgAgainst.toFixed(2)}</span>
            <span>현장 지시 {summary.liveCallLabel}</span>
          </div>
        </div>
      </section>

      <section className="report-fate-fork" aria-label="초기 전술과 내 선택 결과 비교">
        <header>
          <GitBranch size={25} weight="bold" />
          <span>
            <p className="section-kicker">Counterfactual proof</p>
            <h2>내 결정이 바꾼 운명 분기</h2>
          </span>
        </header>
        <div className="report-fate-branches">
          <article>
            <small>초기 전술 시뮬레이션</small>
            <strong>{baselineSimulation.summary.compactScore}</strong>
            <span>xG {baselineSimulation.summary.xgFor.toFixed(2)} : {baselineSimulation.summary.xgAgainst.toFixed(2)}</span>
          </article>
          <ArrowRight size={22} weight="bold" aria-hidden="true" />
          <article className="is-current">
            <small>내 결정 반영</small>
            <strong>{summary.compactScore}</strong>
            <span>xG {summary.xgFor.toFixed(2)} : {summary.xgAgainst.toFixed(2)}</span>
          </article>
          <div className="report-fate-reason">
            <small>결정의 인과</small>
            <strong>{decisionImpact.spaceTitle}</strong>
            <span>{decisionImpact.changes.slice(0, 2).join(" · ")}</span>
          </div>
        </div>
      </section>

      <section className="manager-challenge-card" aria-label="감독 점수 도전장">
        <div className="manager-challenge-code">
          <p className="section-kicker">DG90 MANAGER CHALLENGE</p>
          <strong>{challengeCode}</strong>
          {incomingChallenge && <small>받은 도전 {incomingChallenge.code}</small>}
        </div>
        <div className="manager-challenge-copy">
          <h2>{incomingHeadline}</h2>
          <p>{incomingCopy}</p>
        </div>
        <button
          type="button"
          onClick={() => onShare({ challengeCode, targetScore: managerScore })}
          data-testid="share-manager-challenge"
        >
          <ShareNetwork size={20} weight="fill" />
          {shareStatus || "감독 도전장 공유"}
        </button>
      </section>

      <section className="simulation-stat-grid" aria-label="시뮬레이션 경기 통계">
        <div><span>점유율</span><strong>{summary.possession}%</strong></div>
        <div><span>슈팅</span><strong>{summary.shotsFor} : {summary.shotsAgainst}</strong></div>
        <div><span>유효 슈팅</span><strong>{summary.onTargetFor} : {summary.onTargetAgainst}</strong></div>
        <div><span>내 전술 경로</span><strong>{routeLabel}</strong></div>
      </section>

      <section className="report-challenge-section" aria-label="매치 플랜 달성 결과">
        <div className="report-challenge-heading">
          <Target size={25} weight="duotone" />
          <span>
            <p className="section-kicker">Match plan result</p>
            <h2>감독 도전 {completedChallenges}/3 달성</h2>
          </span>
        </div>
        <div className="report-challenge-grid">
          {challenges.map((challenge) => (
            <article className={challenge.passed ? "is-passed" : "is-missed"} key={challenge.key}>
              {challenge.passed ? (
                <CheckCircle size={18} weight="fill" />
              ) : (
                <WarningCircle size={18} weight="fill" />
              )}
              <span>
                <small>{challenge.label}</small>
                <strong>{challenge.targetLabel}</strong>
                <em>{challenge.valueLabel}</em>
              </span>
              <i aria-hidden="true"><b style={{ width: `${challenge.progress}%` }} /></i>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison-section">
        <div className="report-heading">
          <div>
            <p className="section-kicker">Decision comparison</p>
            <h2>실제 경기 vs 내 선택 vs 코치 제안</h2>
          </div>
          <ShieldCheck size={27} weight="duotone" />
        </div>
        <div className="comparison-grid">
          {comparisons.map((item) => (
            <article className={`comparison-column tone-${item.tone}`} key={item.label}>
              <div className="comparison-topline">
                <h3>{item.label}</h3>
                <strong>{item.score}</strong>
              </div>
              <div className="comparison-bar">
                <span style={{ width: `${item.score}%` }} />
              </div>
              <h4>{item.outcome}</h4>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="report-reasons">
        <div className="reason-column positive-reasons">
          <div className="report-heading compact">
            <h2>경기를 바꾼 선택</h2>
            <Sparkle size={22} weight="fill" />
          </div>
          <ol>
            {metrics.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ol>
        </div>
        <div className="reason-column warning-reasons">
          <div className="report-heading compact">
            <h2>감수한 대가</h2>
            <WarningCircle size={22} weight="fill" />
          </div>
          <ul>
            {metrics.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      </section>

      {nextScenario && (
        <section className="next-match-section" aria-label="다음 아쉬운 경기">
          <div className="next-match-flags" aria-hidden="true">
            <TeamFlag code={nextScenario.homeCode} label={nextScenario.home} decorative />
            <span>VS</span>
            <TeamFlag code={nextScenario.awayCode} label={nextScenario.away} decorative />
          </div>
          <div className="next-match-copy">
            <p className="section-kicker">Next heartbreak</p>
            <h2>{nextScenario.menuLabel} · {nextScenario.minute}'</h2>
            <p>{nextScenario.archive.fanLine}</p>
          </div>
          <button type="button" className="next-match-button" onClick={onNextMatch} data-testid="next-match">
            <span><small>내 다음 미션</small>{nextScenario.objective.label}</span>
            <ArrowRight size={22} weight="bold" />
          </button>
        </section>
      )}

      <footer className="report-actions">
        <button type="button" className="secondary-button" onClick={onEdit}>
          <ArrowCounterClockwise size={19} />
          전술 다시 조정
        </button>
        <button type="button" className="secondary-button" onClick={onReplay}>
          같은 전술 재생
        </button>
      </footer>
    </main>
  );
}
