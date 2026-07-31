const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const progress = clamp01(value);
  return progress * progress * (3 - 2 * progress);
};

const interpolateValue = (from, to, progress) => from + (to - from) * progress;

const interpolatePlayers = (fromPlayers, toPlayers, progress) =>
  fromPlayers.map((player, index) => {
    const target = toPlayers[index] ?? player;
    return {
      ...player,
      x: interpolateValue(player.x, target.x, progress),
      y: interpolateValue(player.y, target.y, progress),
      focus: player.focus || (progress >= 0.58 && target.focus),
    };
  });

export function isGoalMoment({ kind, frameIndex, frameCount, frameProgress, finished }) {
  if (finished || !["goal", "concede"].includes(kind)) return false;
  return (
    frameIndex >= frameCount - 1 ||
    (frameIndex === frameCount - 2 && frameProgress >= 0.9)
  );
}

export function interpolateSceneFrame(frames, frameIndex, rawProgress) {
  const safeIndex = Math.min(Math.max(frameIndex, 0), frames.length - 1);
  const from = frames[safeIndex];
  const to = frames[Math.min(safeIndex + 1, frames.length - 1)];
  const progress = smoothstep(rawProgress);

  return {
    label: progress < 0.55 ? from.label : to.label,
    progress: interpolateValue(from.progress, to.progress, progress),
    homePlayers: interpolatePlayers(from.homePlayers, to.homePlayers, progress),
    awayPlayers: interpolatePlayers(from.awayPlayers, to.awayPlayers, progress),
    ball: {
      x: interpolateValue(from.ball.x, to.ball.x, progress),
      y: interpolateValue(from.ball.y, to.ball.y, progress),
    },
  };
}
