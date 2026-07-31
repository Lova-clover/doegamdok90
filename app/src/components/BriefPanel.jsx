import { ArrowSquareOut } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/csr/ArrowsLeftRight";
import { ChartLineUp } from "@phosphor-icons/react/dist/csr/ChartLineUp";
import { Crosshair } from "@phosphor-icons/react/dist/csr/Crosshair";
import { Lightning } from "@phosphor-icons/react/dist/csr/Lightning";
import { ShieldWarning } from "@phosphor-icons/react/dist/csr/ShieldWarning";
import { Timer } from "@phosphor-icons/react/dist/csr/Timer";
import { getSubstitutionError } from "../engine/rules.js";
import { PlayerIdentity } from "./PlayerIdentity.jsx";

const eventToneIcon = {
  danger: ShieldWarning,
  change: ArrowsLeftRight,
  goal: Crosshair,
};

export function BriefPanel({
  scenario,
  selectedPlayer,
  bench,
  players,
  substitutions,
  actionMessage,
  onSubstitute,
}) {
  const visibleEvents = scenario.realEvents.filter(
    (event) => event.minuteValue <= scenario.minute,
  );
  const maxSubstitutions = scenario.maxSubstitutions ?? 3;
  const firstBenchPlayer = players[bench[0]];
  const substitutionError = getSubstitutionError({
    outgoingPlayer: selectedPlayer,
    incomingPlayer: firstBenchPlayer,
    substitutionCount: substitutions.length,
    maxSubstitutions,
  });
  const helperCopy = substitutionError
    ? selectedPlayer?.role === "GK" && firstBenchPlayer?.role !== "GK"
      ? "현재 벤치에는 골키퍼가 없어 이 선수를 교체할 수 없습니다."
      : substitutionError
    : `${selectedPlayer?.name ?? "선수"} 대신 투입할 선수를 선택하세요.`;

  return (
    <aside className="brief-panel" aria-label="경기 브리핑" data-testid="brief-panel">
      <section className="brief-hero">
        <p className="section-kicker">결정의 순간</p>
        <h1>{scenario.mission}</h1>
        <div className="countdown-copy">
          <Timer size={18} weight="duotone" />
          <span>{scenario.targetMinute - scenario.minute}분 남음</span>
        </div>
      </section>

      {selectedPlayer && (
        <section className="selected-player-profile" aria-label="현재 선택한 선수 정보">
          <PlayerIdentity
            player={selectedPlayer}
            kitColor={scenario.theme.home}
            decorative
          />
          <span>
            <small>현재 선택한 선수</small>
            <strong>{selectedPlayer.name}</strong>
            <em>#{selectedPlayer.number} · {selectedPlayer.role}</em>
            <small>등록 선수 · 등번호와 포지션 기준 식별</small>
          </span>
        </section>
      )}

      <section className="brief-section mission-section">
        <p className="section-kicker">미션</p>
        <h2>{scenario.constraint}</h2>
        <p>{scenario.context}</p>
      </section>

      <section className="brief-section stat-section">
        <div className="section-title-row">
          <p className="section-kicker">{scenario.minute}분 전술 스냅샷</p>
          <ChartLineUp size={17} />
        </div>
        <dl>
          {scenario.decisionSignals.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="data-method-note">
          경기 사실: FIFA 공식 기록 · 속도/xG/예측: 서비스용 자체 모델(공식 수치 아님)
        </p>
      </section>

      <section className="brief-section bench-section">
        <div className="section-title-row">
          <p className="section-kicker">벤치 카드</p>
          <Lightning size={17} />
        </div>
        <p className="helper-copy">{helperCopy}</p>
        <div className="bench-list">
          {bench.slice(0, 3).map((playerId) => {
            const player = players[playerId];
            const playerSubstitutionError = getSubstitutionError({
              outgoingPlayer: selectedPlayer,
              incomingPlayer: player,
              substitutionCount: substitutions.length,
              maxSubstitutions,
            });
            return (
              <button
                key={playerId}
                type="button"
                className="bench-player"
                onClick={() => onSubstitute(playerId)}
                disabled={Boolean(playerSubstitutionError)}
                data-testid={`bench-${playerId}`}
              >
                <span className="bench-avatar">
                  <PlayerIdentity
                    player={player}
                    kitColor={scenario.theme.home}
                    decorative
                  />
                </span>
                <span>
                  <strong>{player.name}</strong>
                  <small>
                    {player.role} · 모델 속도 {player.pace}
                  </small>
                </span>
                <span className="bench-action">투입</span>
              </button>
            );
          })}
        </div>
        {substitutions.length > 0 && (
          <p className="substitution-count">
            교체 {substitutions.length}/{maxSubstitutions} 완료
          </p>
        )}
        {actionMessage && (
          <p className="action-message" role="status" aria-live="polite">
            {actionMessage}
          </p>
        )}
      </section>

      <section className="brief-section event-section">
        <p className="section-kicker">{scenario.minute}분까지 실제 경기</p>
        <div className="event-list">
          {visibleEvents.map((event) => {
            const Icon = eventToneIcon[event.type];
            return (
              <div className={`event-row is-${event.type}`} key={`${event.minute}-${event.text}`}>
                <Icon size={15} weight="fill" />
                <time>{event.minute}</time>
                <span>{event.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <a
        className="source-link"
        href={scenario.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        FIFA 경기 기록 보기
        <ArrowSquareOut size={14} />
      </a>
    </aside>
  );
}
