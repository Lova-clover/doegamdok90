export const formationRoleSlots = {
  "4-2-3-1": ["GK", "LB", "CB", "CB", "RB", "DM", "CM", "LW", "AM", "RW", "ST"],
  "4-3-3": ["GK", "LB", "CB", "CB", "RB", "CM", "DM", "CM", "LW", "ST", "RW"],
  "3-4-3": ["GK", "CB", "CB", "CB", "RWB", "CM", "CM", "LWB", "LW", "ST", "RW"],
  "5-4-1": ["GK", "LWB", "CB", "CB", "CB", "RWB", "CM", "CM", "LW", "RW", "ST"],
};

const roleMap = {
  GK: { depth: 0, lane: 0 },
  CB: { depth: 1, lane: 0 },
  LB: { depth: 1, lane: -2 },
  RB: { depth: 1, lane: 2 },
  LWB: { depth: 2, lane: -2 },
  RWB: { depth: 2, lane: 2 },
  DM: { depth: 2, lane: 0 },
  CM: { depth: 3, lane: 0 },
  LW: { depth: 4, lane: -2 },
  RW: { depth: 4, lane: 2 },
  AM: { depth: 4, lane: 0 },
  ST: { depth: 5, lane: 0 },
};

const getRoleCost = (playerRole, slotRole) => {
  if (playerRole === slotRole) return 0;
  if (playerRole === "GK" || slotRole === "GK") return 1000;
  if (
    (playerRole === "LB" && slotRole === "LWB") ||
    (playerRole === "LWB" && slotRole === "LB") ||
    (playerRole === "RB" && slotRole === "RWB") ||
    (playerRole === "RWB" && slotRole === "RB")
  ) {
    return 1;
  }
  const player = roleMap[playerRole] ?? roleMap.CM;
  const slot = roleMap[slotRole] ?? roleMap.CM;
  return Math.abs(player.depth - slot.depth) * 4 + Math.abs(player.lane - slot.lane) * 3;
};

const getTravelCost = (position, target) => {
  if (!position || !target) return 0;
  return Math.hypot(position.x - target.x, position.y - target.y) / 100;
};

export function assignPlayersToFormation({
  formationName,
  lineup,
  players,
  currentPositions = [],
  targetPositions,
  roleOverrides = {},
}) {
  const slotRoles = formationRoleSlots[formationName];
  if (!slotRoles || lineup.length !== slotRoles.length || targetPositions.length !== slotRoles.length) {
    return {
      lineup: [...lineup],
      positions: targetPositions.map((position) => ({ ...position })),
    };
  }

  let states = new Map([[0, { cost: 0, assignment: [] }]]);
  slotRoles.forEach((slotRole, slotIndex) => {
    const nextStates = new Map();
    states.forEach((state, mask) => {
      lineup.forEach((playerId, playerIndex) => {
        const bit = 1 << playerIndex;
        if (mask & bit) return;
        const player = players[playerId];
        const effectiveRole = roleOverrides[playerId] ?? player?.role;
        const cost =
          state.cost +
          getRoleCost(effectiveRole, slotRole) +
          getTravelCost(currentPositions[playerIndex], targetPositions[slotIndex]);
        const nextMask = mask | bit;
        const saved = nextStates.get(nextMask);
        if (!saved || cost < saved.cost - 1e-9) {
          nextStates.set(nextMask, {
            cost,
            assignment: [...state.assignment, playerIndex],
          });
        }
      });
    });
    states = nextStates;
  });

  const completed = states.get((1 << lineup.length) - 1);
  return {
    lineup: completed ? completed.assignment.map((index) => lineup[index]) : [...lineup],
    positions: targetPositions.map((position) => ({ ...position })),
  };
}
