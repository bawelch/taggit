import {
  buildPuzzle,
  checkGameEnd,
  computeRemainingConnections,
  createInitialState,
  getAllowedSizes,
  getCurrentSelectionEntries,
  resolveSelection,
  selectionCommonTags
} from "./game.js";

const state = createInitialState();

const el = (id) => document.getElementById(id);

const dom = {
  gridSize: el("gridSize"),
  pickLimit: el("pickLimit"),
  minGroup: el("minGroup"),
  maxGroup: el("maxGroup"),
  newGameBtn: el("newGameBtn"),
  submitBtn: el("submitBtn"),
  clearBtn: el("clearBtn"),
  hintBtn: el("hintBtn"),
  grid: el("grid"),
  selectionInfo: el("selectionInfo"),
  score: el("score"),
  picks: el("picks"),
  unused: el("unused"),
  found: el("found"),
  message: el("message"),
  history: el("history")
};

function setMessage(text, kind = "") {
  dom.message.textContent = text;
  dom.message.className = `message ${kind}`.trim();
}

function getConfig() {
  const { min, max } = getAllowedSizes(dom.minGroup, dom.maxGroup);
  return {
    gridSize: parseInt(dom.gridSize.value, 10),
    pickLimit: parseInt(dom.pickLimit.value, 10),
    minGroupSize: min,
    maxGroupSize: max
  };
}

function toggleSelect(id) {
  if (state.gameOver || state.used.has(id)) return;

  if (state.selected.has(id)) {
    state.selected.delete(id);
  } else {
    state.selected.add(id);
  }

  renderAll();
}

function renderGrid() {
  const cols =
    state.entries.length <= 12 ? 4 :
    state.entries.length <= 16 ? 4 : 5;

  dom.grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  dom.grid.innerHTML = "";

  for (const entry of state.entries) {
    const tile = document.createElement("button");
    tile.className = "tile";

    if (state.selected.has(entry.id)) tile.classList.add("selected");
    if (state.used.has(entry.id)) tile.classList.add("used");

    tile.textContent = entry.text;
    tile.addEventListener("click", () => toggleSelect(entry.id));

    dom.grid.appendChild(tile);
  }
}

function renderInfo() {
  dom.score.textContent = String(state.score);
  dom.picks.textContent = `${state.picksUsed} / ${state.maxPicks}`;
  dom.unused.textContent = String(
    state.entries.filter((entry) => !state.used.has(entry.id)).length
  );
  dom.found.textContent = String(state.history.length);

  const selectedEntries = getCurrentSelectionEntries(state);
  let selectionText = `Selected: ${selectedEntries.length}`;

  if (selectedEntries.length) {
    const common = selectionCommonTags(selectedEntries);
    if (common.length) {
      selectionText += ` · Shared strong tags right now: ${common
        .slice(0, 3)
        .map((row) => row.tag)
        .join(", ")}`;
    } else {
      selectionText += " · No strong shared tag across current selection";
    }
  }

  dom.selectionInfo.textContent = selectionText;

  dom.history.innerHTML = "";
  for (const row of state.history) {
    const li = document.createElement("li");
    li.textContent = `${row.tag}: ${row.entries.join(", ")} (+${row.gain})`;
    dom.history.appendChild(li);
  }
}

function renderAll() {
  renderGrid();
  renderInfo();

  dom.submitBtn.disabled = state.gameOver;
  dom.clearBtn.disabled = state.gameOver;
}

function startNewGame() {
  try {
    const config = getConfig();
    buildPuzzle(state, config);
    renderAll();
    setMessage(
      `New game generated. Hidden groups: ${state.groups.length}. Board size: ${config.gridSize}.`,
      ""
    );
  } catch (error) {
    setMessage(`Generator error: ${error.message}`, "bad");
  }
}

function submitSelection() {
  const result = resolveSelection(state);
  setMessage(result.message, result.ok ? "good" : "bad");
  renderAll();

  const endState = checkGameEnd(state);
  if (endState.over) {
    setMessage(endState.message, endState.kind);
  }

  renderAll();
}

function clearSelection() {
  state.selected.clear();
  renderAll();
}

function showHint() {
  const remaining = computeRemainingConnections(state);
  setMessage(
    `Remaining hidden connections among unused entries: ${remaining.length}.`,
    ""
  );
}

dom.newGameBtn.addEventListener("click", startNewGame);
dom.submitBtn.addEventListener("click", submitSelection);
dom.clearBtn.addEventListener("click", clearSelection);
dom.hintBtn.addEventListener("click", showHint);

startNewGame();
