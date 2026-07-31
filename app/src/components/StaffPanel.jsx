import { ArrowsOutLineHorizontal } from "@phosphor-icons/react/dist/csr/ArrowsOutLineHorizontal";
import { ChartLineUp } from "@phosphor-icons/react/dist/csr/ChartLineUp";
import { Gauge } from "@phosphor-icons/react/dist/csr/Gauge";
import { Heartbeat } from "@phosphor-icons/react/dist/csr/Heartbeat";
import { MagicWand } from "@phosphor-icons/react/dist/csr/MagicWand";
import { Minus } from "@phosphor-icons/react/dist/csr/Minus";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { Pulse } from "@phosphor-icons/react/dist/csr/Pulse";
import { ShieldChevron } from "@phosphor-icons/react/dist/csr/ShieldChevron";
import { Strategy } from "@phosphor-icons/react/dist/csr/Strategy";
import { UserSound } from "@phosphor-icons/react/dist/csr/UserSound";

const controlsMeta = {
  tempo: { label: "전개 속도", icon: Gauge, low: "인내", high: "빠름" },
  width: {
    label: "공격 폭",
    icon: ArrowsOutLineHorizontal,
    low: "좁게",
    high: "넓게",
  },
  pressing: {
    label: "압박 강도",
    icon: Pulse,
    low: "대기",
    high: "강하게",
  },
  risk: {
    label: "위험 감수",
    icon: ShieldChevron,
    low: "안정",
    high: "승부",
  },
};

const staffMeta = [
  ["head", "수석코치", UserSound, "red"],
  ["analyst", "분석관", ChartLineUp, "cyan"],
  ["fitness", "피지컬코치", Heartbeat, "amber"],
];

export function StaffPanel({
  metrics,
  controls,
  onControlChange,
  onRunSimulation,
  onReset,
  onApplyCoachPlan,
  coachPlanActive,
  scenario,
  impactDelta,
  lastAction,
  simulationPreview,
}) {
  const fateClass = metrics.fateShift >= 0 ? "is-positive" : "is-negative";
  const fatePosition = `${((metrics.fateShift + 30) / 60) * 100}%`;

  return (
    <aside className="staff-panel" aria-label="코치진과 전술 지표" data-testid="staff-panel">
      <section className="fate-section">
        <div className="section-title-row">
          <p className="section-kicker">운명 지표</p>
          <Strategy size={18} weight="duotone" />
        </div>
        <div className={`fate-value ${fateClass}`} data-testid="fate-value">
          <span>운명 변화</span>
          <strong>
            {metrics.fateShift > 0 ? "+" : ""}
            {metrics.fateShift}
          </strong>
        </div>
        <div className="fate-meter" aria-label={`운명 변화 ${metrics.fateShift}`}>
          <span className="fate-marker" style={{ left: fatePosition }} />
        </div>
        <div className="fate-scale" aria-hidden="true">
          <span>-30</span>
          <span>0</span>
          <span>+30</span>
        </div>
        <p className="fate-explainer">
          예측 확률이 아니라, 실제 {scenario.minute}분 기준선 대비 전술 완성도 변화입니다.
        </p>
        <div className="fate-deltas">
          <span>
            득점 위협 <strong>+{Math.max(0, metrics.goalThreat - 55)}</strong>
          </span>
          <span>
            역습 위험 <strong className="danger-text">{metrics.counterRisk}</strong>
          </span>
        </div>
        {impactDelta && (
          <div className="change-impact" aria-live="polite">
            <span>방금 변경 효과</span>
            <strong>{lastAction}</strong>
            <div>
              <small className={impactDelta.goalThreat >= 0 ? "is-good" : "is-bad"}>
                득점 {impactDelta.goalThreat > 0 ? "+" : ""}{impactDelta.goalThreat}
              </small>
              <small className={impactDelta.restDefense >= 0 ? "is-good" : "is-bad"}>
                안정 {impactDelta.restDefense > 0 ? "+" : ""}{impactDelta.restDefense}
              </small>
              <small className={impactDelta.counterRisk <= 0 ? "is-good" : "is-bad"}>
                실점 위험 {impactDelta.counterRisk > 0 ? "+" : ""}{impactDelta.counterRisk}
              </small>
            </div>
          </div>
        )}
      </section>

      <section className="staff-section">
        <p className="section-kicker">스태프의 한마디</p>
        <div className="staff-list">
          {staffMeta.map(([key, label, Icon, tone]) => (
            <article className={`staff-row tone-${tone}`} key={key}>
              <div className="staff-icon">
                <Icon size={24} weight="duotone" />
              </div>
              <div>
                <h3>{label}</h3>
                <p>{metrics.staff[key]}</p>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          className={`coach-assist-button ${coachPlanActive ? "is-active" : ""}`}
          onClick={onApplyCoachPlan}
          aria-pressed={coachPlanActive}
        >
          <MagicWand size={19} weight="duotone" />
          <span>
            <strong>{coachPlanActive ? "코치 플랜 적용됨" : "코치 플랜 적용"}</strong>
            <small>{scenario.coachPlan.copy}</small>
          </span>
        </button>
      </section>

      <section className="control-section">
        <div className="section-title-row">
          <p className="section-kicker">전술 파라미터</p>
          <button type="button" className="text-icon-button" onClick={onReset}>
            초기화
          </button>
        </div>
        <div className="control-list">
          {Object.entries(controlsMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <div className="control-row" key={key}>
                <div className="control-label">
                  <Icon size={17} weight="duotone" />
                  <span>{meta.label}</span>
                </div>
                <button
                  type="button"
                  className="step-button"
                  onClick={() => onControlChange(key, controls[key] - 1)}
                  aria-label={`${meta.label} 낮추기`}
                >
                  <Minus size={14} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={controls[key]}
                  onChange={(event) =>
                    onControlChange(key, Number(event.target.value))
                  }
                  aria-label={meta.label}
                  data-testid={`control-${key}`}
                />
                <button
                  type="button"
                  className="step-button"
                  onClick={() => onControlChange(key, controls[key] + 1)}
                  aria-label={`${meta.label} 높이기`}
                >
                  <Plus size={14} />
                </button>
                <output>{controls[key]}</output>
              </div>
            );
          })}
        </div>
        <div className="tradeoff-row">
          <div>
            <span>기대 효과</span>
            <strong>xG {simulationPreview.summary.xgFor.toFixed(2)}</strong>
          </div>
          <div>
            <span>트레이드오프</span>
            <strong className="danger-text">상대 xG {simulationPreview.summary.xgAgainst.toFixed(2)}</strong>
          </div>
        </div>
        <div className="cause-trace" aria-label="운명 지표 변화 이유">
          <span>왜 바뀌었나요?</span>
          <ul>
            {metrics.reasons.slice(0, 2).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </section>

      <button
        type="button"
        className="simulate-button"
        onClick={onRunSimulation}
        data-testid="run-simulation"
      >
        <span>
          <small>{scenario.minute}' → {scenario.targetMinute}'</small>
          운명 시뮬레이션
        </span>
        <Play size={23} weight="fill" />
      </button>
    </aside>
  );
}
