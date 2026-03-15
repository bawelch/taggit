import { ENTRY_DATA } from "./data.js";
import { randInt, shuffle } from "./utils.js";

export function createInitialState() {
  return {
    entries: [],
    selected: new Set(),
    used: new Set(),
    groups: [],
    score: 0,
    picksUsed: 0,
    maxPicks: 10,
    gameOver: false,
    history: []
  };
}

export function getAllowedSizes(minGroupEl, maxGroupEl) {
  let min = parseInt(minGroupEl.value, 10);
  let max = parseInt(maxGroupEl.value, 10);
  if (min > max) {
    [min, max] = [max, min];
  }
  return { min, max };
}

export function entriesWithTag(tag, threshold = 0.9) {
  return ENTRY_DATA.filter((entry) => (entry.tags[tag] || 0) >= threshold);
}

export function getCandidateTags(minSize) {
  const counts = {};
  for (const entry of ENTRY_DATA) {
    for (const [tag, weight] of Object.entries(entry.tags)) {
      if (weight >= 0.9) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .filter(([, count]) => count >= minSize)
    .map(([tag]) => tag);
}

export function buildPuzzle(state, config) {
  const { gridSize, pickLimit, minGroupSize, maxGroupSize } = config;

  state.selected.clear();
  state.used.clear();
  state.groups = [];
  state.score = 0;
  state.picksUsed = 0;
  state.history = [];
  state.gameOver = false;
  state.maxPicks = pickLimit;

  const candidateTags = shuffle(getCandidateTags(minGroupSize));
  const usedIds = new Set();
  const groups = [];
  let remaining = gridSize;

  const maxGroups = Math.max(2, Math.min(4, Math.floor(gridSize / minGroupSize)));
  const targetGroups = randInt(2, maxGroups);

  for (const tag of candidateTags) {
    if (groups.length >= targetGroups) break;
    if (remaining < minGroupSize + 1) break;

    const remainingGroupSlots = targetGroups - groups.length - 1;
    const maxAllowedForGroup = Math.min(
      maxGroupSize,
      remaining - remainingGroupSlots * minGroupSize
    );
    if (maxAllowedForGroup < minGroupSize) continue;

    const possible = shuffle(
      entriesWithTag(tag, 0.9).filter((entry) => !usedIds.has(entry.id))
    );
    if (possible.length < minGroupSize) continue;

    const size = randInt(
      minGroupSize,
      Math.min(maxAllowedForGroup, possible.length)
    );
    const chosen = possible.slice(0, size);

    chosen.forEach((entry) => usedIds.add(entry.id));
    groups.push({
      tag,
      entries: chosen.map((entry) => entry.id)
    });
    remaining -= size;
  }

  if (groups.length === 0) {
    throw new Error("Generator failed to create any group.");
  }

  const pool = shuffle(ENTRY_DATA.filter((entry) => !usedIds.has(entry.id)));
  const board = [];

  for (const group of groups) {
    for (const id of group.entries) {
      board.push(ENTRY_DATA.find((entry) => entry.id === id));
    }
  }

  for (const entry of pool) {
    if (board.length >= gridSize) break;
    board.push(entry);
  }

  state.entries = shuffle(board);
  state.groups = groups;
}

export function getCurrentSelectionEntries(state) {
  return state.entries.filter((entry) => state.selected.has(entry.id));
}

export function selectionCommonTags(entries) {
  if (!entries.length) return [];

  let common = new Set(Object.keys(entries[0].tags));
  for (let i = 1; i < entries.length; i += 1) {
    common = new Set(
      [...common].filter((tag) => entries[i].tags[tag] !== undefined)
    );
  }

  return [...common]
    .map((tag) => {
      const weights = entries.map((entry) => entry.tags[tag]);
      return {
        tag,
        weights,
        total: weights.reduce((sum, weight) => sum + weight, 0)
      };
    })
    .filter((row) => row.weights.every((weight) => weight >= 0.9))
    .sort((a, b) => b.total - a.total);
}

export function computeRemainingConnections(state) {
  const remainingIds = state.entries
    .filter((entry) => !state.used.has(entry.id))
    .map((entry) => entry.id);

  return state.groups.filter((group) =>
    group.entries.every((id) => remainingIds.includes(id))
  );
}

export function resolveSelection(state) {
  if (state.gameOver) {
    return { ok: false, message: "Game is over." };
  }

  const entries = getCurrentSelectionEntries(state);
  if (!entries.length) {
    return { ok: false, message: "No entries selected." };
  }

  if (entries.some((entry) => state.used.has(entry.id))) {
    return { ok: false, message: "Selection includes an already used entry." };
  }

  const common = selectionCommonTags(entries);
  const selectedIds = entries.map((entry) => entry.id).sort();

  const exactGroup = state.groups.find((group) => {
    const ids = [...group.entries].sort();
    return (
      ids.length === selectedIds.length &&
      ids.every((id, index) => id === selectedIds[index]) &&
      !ids.some((id) => state.used.has(id))
    );
  });

  state.picksUsed += 1;

  if (!exactGroup) {
    const nearText = common.length
      ? ` They do share ${common[0].tag}, but this is not a valid hidden group on this board.`
      : "";
    state.selected.clear();
    return {
      ok: false,
      message: `Invalid selection.${nearText}`,
      remaining: computeRemainingConnections(state)
    };
  }

  const bestTag =
    common.find((row) => row.tag === exactGroup.tag) ||
    common[0] || {
      tag: exactGroup.tag,
      total: exactGroup.entries.reduce((sum, id) => {
        const entry = ENTRY_DATA.find((item) => item.id === id);
        return sum + (entry.tags[exactGroup.tag] || 0);
      }, 0)
    };

  exactGroup.entries.forEach((id) => state.used.add(id));

  const sizeBonus = 1 + (exactGroup.entries.length - 2) * 0.15;
  const gain = Math.round(bestTag.total * 100 * sizeBonus);
  state.score += gain;
  state.history.push({
    tag: exactGroup.tag,
    entries: exactGroup.entries.map(
      (id) => ENTRY_DATA.find((entry) => entry.id === id).text
    ),
    gain
  });
  state.selected.clear();

  return {
    ok: true,
    message: `Valid connection: ${exactGroup.tag}. +${gain} points.`,
    remaining: computeRemainingConnections(state)
  };
}

export function checkGameEnd(state) {
  const remaining = computeRemainingConnections(state);

  if (remaining.length === 0) {
    state.gameOver = true;
    return {
      over: true,
      message: `Game over. No valid unused connections remain. Final score: ${state.score}.`,
      kind: "good"
    };
  }

  if (state.picksUsed >= state.maxPicks) {
    state.gameOver = true;
    return {
      over: true,
      message: `Game over. Pick limit reached. Final score: ${state.score}. Remaining connections: ${remaining.length}.`,
      kind: "bad"
    };
  }

  return {
    over: false,
    remaining
  };
}
