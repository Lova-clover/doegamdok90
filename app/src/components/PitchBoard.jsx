import { useRef } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CornersOut } from "@phosphor-icons/react/dist/csr/CornersOut";
import { FloppyDisk } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { HandGrabbing } from "@phosphor-icons/react/dist/csr/HandGrabbing";
import { GitBranch } from "@phosphor-icons/react/dist/csr/GitBranch";
import { MapPinSimpleArea } from "@phosphor-icons/react/dist/csr/MapPinSimpleArea";
import { PlayerIdentity } from "./PlayerIdentity.jsx";

function PlayerToken({ player, position, selected, kitColor, onSelect, onKeyboardMove }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: player.id });
  const dragTransform = transform
    ? `${CSS.Translate.toString(transform)} translate(-50%, -50%)`
    : "translate(-50%, -50%)";

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 5 : 2;
    const next = { ...position };
    if (event.key === "ArrowLeft") next.x -= step;
    else if (event.key === "ArrowRight") next.x += step;
    else if (event.key === "ArrowUp") next.y -= step;
    else if (event.key === "ArrowDown") next.y += step;
    else {
      listeners?.onKeyDown?.(event);
      return;
    }
    event.preventDefault();
    onKeyboardMove(next);
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`player-token ${selected ? "is-selected" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: dragTransform,
      }}
      {...listeners}
      {...attributes}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={handleKeyDown}
      aria-label={`${player.name} ${player.role}, 드래그해서 위치 이동`}
      aria-pressed={selected}
      data-testid={`player-${player.id}`}
    >
      <PlayerIdentity player={player} kitColor={kitColor} decorative />
      <span className="player-name">{player.shortName}</span>
    </button>
  );
}

const metricItems = [
  ["득점 위협", "goalThreat"],
  ["경기 통제", "control"],
  ["후방 안정", "restDefense"],
  ["모멘텀", "momentum"],
];

export function PitchBoard({
  scenario,
  lineup,
  positions,
  players,
  formation,
  formationNames,
  selectedId,
  metrics,
  onSelect,
  onMove,
  onFormationChange,
  onUndo,
  canUndo,
  savedAt,
  impactDelta,
  decisionImpact,
}) {
  const pitchRef = useRef(null);
  const selectedPlayer = players[selectedId];
  const scoreShifted = decisionImpact.baselineScore !== decisionImpact.currentScore;
  const xgShifted = Math.abs(decisionImpact.xgForDelta) >= 0.01;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = ({ active, delta }) => {
    const index = lineup.indexOf(active.id);
    const bounds = pitchRef.current?.getBoundingClientRect();
    if (index < 0 || !bounds) return;
    const current = positions[index];
    onMove(active.id, {
      x: current.x + (delta.x / bounds.width) * 100,
      y: current.y + (delta.y / bounds.height) * 100,
    });
  };

  const handlePitchClick = (event) => {
    if (!selectedId || event.target.closest("button")) return;
    const bounds = pitchRef.current.getBoundingClientRect();
    onMove(selectedId, {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <section className="board-panel" aria-label="전술 보드" data-testid="board-panel">
      <div className="formation-bar">
        <div className="formation-options" aria-label="포메이션 선택">
          {formationNames.map((name) => (
            <button
              key={name}
              type="button"
              className={formation === name ? "is-active" : ""}
              onClick={() => onFormationChange(name)}
              aria-pressed={formation === name}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="board-utilities">
          <div className="board-hint">
            <HandGrabbing size={16} weight="duotone" />
            <span>드래그 또는 선택 후 필드 클릭</span>
          </div>
          <span className="save-state" title="브라우저에 전술이 자동 저장됩니다">
            <FloppyDisk size={15} weight={savedAt ? "fill" : "regular"} />
            {savedAt ? "자동 저장됨" : "저장 중"}
          </span>
          <button
            type="button"
            className="undo-button"
            onClick={onUndo}
            disabled={!canUndo}
            title="마지막 전술 변경 실행 취소"
            aria-label="마지막 전술 변경 실행 취소"
          >
            <ArrowCounterClockwise size={16} />
            <span>실행 취소</span>
          </button>
        </div>
      </div>

      {selectedPlayer && (
        <div className="selection-guide" role="status" aria-live="polite">
          <PlayerIdentity
            player={selectedPlayer}
            kitColor={scenario.theme.home}
            decorative
          />
          <span className="selection-guide-player">
            <small>현재 선택</small>
            <strong>{selectedPlayer.name}</strong>
            <em>#{selectedPlayer.number} · {selectedPlayer.role}</em>
          </span>
          <span className={`selection-guide-next fate-guide ${scoreShifted ? "is-shifted" : xgShifted ? "is-building" : ""}`}>
            <small><GitBranch size={12} weight="bold" /> 운명 분기 LIVE</small>
            <strong>
              <span>초기 {decisionImpact.baselineScore}</span>
              <ArrowRight size={13} weight="bold" />
              <b>내 선택 {decisionImpact.currentScore}</b>
            </strong>
            <em>{scoreShifted ? decisionImpact.spaceTitle : xgShifted ? decisionImpact.outcomeCopy : decisionImpact.spaceTitle}</em>
          </span>
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={pitchRef}
          className="pitch"
          onClick={handlePitchClick}
          data-testid="pitch"
        >
          <img
            className="pitch-image"
            src="/assets/pitch-dark-vertical.png"
            alt="위에서 내려다본 축구 경기장"
            draggable="false"
          />
          <div className="danger-channel" aria-hidden="true">
            <span>{scenario.pitchLabels?.danger ?? "중앙 역습 위험"}</span>
          </div>
          <div className="weak-zone" aria-hidden="true">
            <MapPinSimpleArea size={22} weight="duotone" />
            <span>{scenario.pitchLabels?.opportunity ?? "상대 뒷공간"}</span>
          </div>
          <div className="tactical-route" aria-hidden="true">
            <ArrowUpRight size={26} weight="bold" />
          </div>
          {lineup.map((playerId, index) => (
            <PlayerToken
              key={playerId}
              player={players[playerId]}
              position={positions[index]}
              selected={selectedId === playerId}
              kitColor={scenario.theme.home}
              onSelect={() => onSelect(playerId)}
              onKeyboardMove={(next) => onMove(playerId, next)}
            />
          ))}
          <div className="pitch-direction" aria-hidden="true">
            <CornersOut size={15} /> 상대 진영
          </div>
        </div>
      </DndContext>

      <div className="metric-strip" aria-label="실시간 전술 지표">
        {metricItems.map(([label, key]) => (
          <div className="metric-item" key={key}>
            <div className="metric-copy">
              <span>{label}</span>
              <strong>
                {metrics[key]}
                {impactDelta?.[key] !== undefined && impactDelta[key] !== 0 && (
                  <em className={impactDelta[key] > 0 ? "is-up" : "is-down"}>
                    {impactDelta[key] > 0 ? "+" : ""}{impactDelta[key]}
                  </em>
                )}
              </strong>
            </div>
            <div className="metric-track" aria-hidden="true">
              <span style={{ width: `${metrics[key]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
