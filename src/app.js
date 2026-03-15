const SAMPLE_BOARD = {
    grid_size: 16,
    max_guesses: 12,
    min_guess_size: 3,
    items: [
        {
            id: "knife", label: "Knife", pick_limit: 2, tags: [
                { name: "Weapon", weight: 0.95 },
                { name: "Kitchen", weight: 0.72 },
                { name: "Sharp", weight: 0.88 }
            ]
        },
        {
            id: "gun", label: "Gun", pick_limit: 1, tags: [
                { name: "Weapon", weight: 0.96 },
                { name: "Threat", weight: 0.83 },
                { name: "Metal", weight: 0.55 }
            ]
        },
        {
            id: "rope", label: "Rope", pick_limit: 2, tags: [
                { name: "Weapon", weight: 0.67 },
                { name: "Binding", weight: 0.93 },
                { name: "Fibres", weight: 0.66 }
            ]
        },
        {
            id: "poison", label: "Poison", pick_limit: 1, tags: [
                { name: "Weapon", weight: 0.82 },
                { name: "Bottle", weight: 0.61 },
                { name: "Laboratory", weight: 0.64 }
            ]
        },
        {
            id: "teacup", label: "Teacup", pick_limit: 1, tags: [
                { name: "Kitchen", weight: 0.87 },
                { name: "Ceramic", weight: 0.79 },
                { name: "Domestic", weight: 0.65 }
            ]
        },
        {
            id: "apron", label: "Apron", pick_limit: 1, tags: [
                { name: "Kitchen", weight: 0.76 },
                { name: "Domestic", weight: 0.71 },
                { name: "Clothing", weight: 0.82 }
            ]
        },
        {
            id: "cleaver", label: "Cleaver", pick_limit: 2, tags: [
                { name: "Weapon", weight: 0.86 },
                { name: "Kitchen", weight: 0.91 },
                { name: "Sharp", weight: 0.79 }
            ]
        },
        {
            id: "handcuffs", label: "Handcuffs", pick_limit: 2, tags: [
                { name: "Binding", weight: 0.91 },
                { name: "Metal", weight: 0.88 },
                { name: "Authority", weight: 0.82 }
            ]
        },
        {
            id: "duct_tape", label: "Duct Tape", pick_limit: 1, tags: [
                { name: "Binding", weight: 0.89 },
                { name: "Fibres", weight: 0.58 },
                { name: "Improvised", weight: 0.71 }
            ]
        },
        {
            id: "zip_tie", label: "Zip Tie", pick_limit: 1, tags: [
                { name: "Binding", weight: 0.84 },
                { name: "Plastic", weight: 0.79 },
                { name: "Improvised", weight: 0.62 }
            ]
        },
        {
            id: "badge", label: "Badge", pick_limit: 1, tags: [
                { name: "Authority", weight: 0.94 },
                { name: "Metal", weight: 0.69 },
                { name: "Identity", weight: 0.72 }
            ]
        },
        {
            id: "warrant", label: "Warrant", pick_limit: 1, tags: [
                { name: "Authority", weight: 0.83 },
                { name: "Paperwork", weight: 0.87 },
                { name: "Identity", weight: 0.52 }
            ]
        },
        {
            id: "uniform", label: "Uniform", pick_limit: 1, tags: [
                { name: "Authority", weight: 0.88 },
                { name: "Clothing", weight: 0.76 },
                { name: "Identity", weight: 0.64 }
            ]
        },
        {
            id: "feather", label: "Feather", pick_limit: 1, tags: [
                { name: "Bird", weight: 0.94 },
                { name: "Fibres", weight: 0.46 },
                { name: "Light", weight: 0.50 }
            ]
        },
        {
            id: "nest", label: "Nest", pick_limit: 1, tags: [
                { name: "Bird", weight: 0.87 },
                { name: "Domestic", weight: 0.35 },
                { name: "Fibres", weight: 0.51 }
            ]
        },
        {
            id: "talon", label: "Talon", pick_limit: 1, tags: [
                { name: "Bird", weight: 0.90 },
                { name: "Sharp", weight: 0.67 },
                { name: "Threat", weight: 0.58 }
            ]
        }
    ]
};

const gameState = {
    items: [],
    selectedIds: [],
    score: 0,
    guessesUsed: 0,
    maxGuesses: 0,
    minGuessSize: 3,
    tagScoreHistory: {},
    log: [],
    gameOver: false
};

let els = null;

function getEls() {
    return {
        board: document.getElementById("board"),
        scoreValue: document.getElementById("scoreValue"),
        guessesUsed: document.getElementById("guessesUsed"),
        maxGuesses: document.getElementById("maxGuesses"),
        moveState: document.getElementById("moveState"),
        selectedList: document.getElementById("selectedList"),
        log: document.getElementById("log"),
        messageBox: document.getElementById("messageBox"),
        submitBtn: document.getElementById("submitBtn"),
        clearBtn: document.getElementById("clearBtn"),
        newGameBtn: document.getElementById("newGameBtn")
    };
}

function cloneItem(item) {
    return {
        ...item,
        pick_count: 0,
        tags: item.tags.map(tag => ({ ...tag }))
    };
}

function initialiseGame(boardConfig = SAMPLE_BOARD) {
    gameState.items = boardConfig.items.map(cloneItem);
    gameState.selectedIds = [];
    gameState.score = 0;
    gameState.guessesUsed = 0;
    gameState.maxGuesses = boardConfig.max_guesses;
    gameState.minGuessSize = boardConfig.min_guess_size;
    gameState.tagScoreHistory = {};
    gameState.log = [];
    gameState.gameOver = false;
    setMessage(`Pick at least ${gameState.minGuessSize} items. Sample board loaded: ${gameState.items.length} tiles.`);
    render();
}

function isItemAvailable(item) {
    return item.pick_count < item.pick_limit;
}

function getItemById(itemId) {
    return gameState.items.find(item => item.id === itemId);
}

function getTileStateClass(item) {
    const selected = gameState.selectedIds.includes(item.id);
    const exhausted = !isItemAvailable(item);
    const usageClass = item.pick_count === 0 ? "unused" : "partially-used";
    return ["tile", usageClass, selected ? "selected" : "", exhausted ? "exhausted" : ""].filter(Boolean).join(" ");
}

function getTileUsageText(item) {
    return `${item.pick_count}/${item.pick_limit}`;
}

function toggleSelection(itemId) {
    if (gameState.gameOver) return;

    const item = getItemById(itemId);
    if (!item || !isItemAvailable(item)) return;

    const idx = gameState.selectedIds.indexOf(itemId);
    if (idx >= 0) {
        gameState.selectedIds.splice(idx, 1);
    } else {
        gameState.selectedIds.push(itemId);
    }

    render();
}

function clearSelection() {
    gameState.selectedIds = [];
    render();
}

function getSelectedItems() {
    return gameState.items.filter(item => gameState.selectedIds.includes(item.id));
}

function buildTagMap(item) {
    return new Map(item.tags.map(tag => [tag.name, tag.weight]));
}

function getSharedTags(selectedItems) {
    if (selectedItems.length < gameState.minGuessSize) return [];

    const maps = selectedItems.map(buildTagMap);
    const candidateTags = [...maps[0].keys()];

    return candidateTags.filter(tagName => maps.every(map => map.has(tagName)));
}

function getSelectedScore(items, tagName) {
    return items.reduce((sum, item) => {
        const tag = item.tags.find(entry => entry.name === tagName);
        return sum + (tag ? tag.weight : 0);
    }, 0);
}

function getAvailableGroupForTag(tagName) {
    return gameState.items.filter(item =>
        isItemAvailable(item) && item.tags.some(tag => tag.name === tagName)
    );
}

function getFullScore(tagName) {
    return getSelectedScore(getAvailableGroupForTag(tagName), tagName);
}

function resolveBestTag(selectedItems) {
    const sharedTags = getSharedTags(selectedItems);
    if (sharedTags.length === 0) return null;

    let best = null;

    for (const tagName of sharedTags) {
        const selectedScore = getSelectedScore(selectedItems, tagName);
        const fullScore = getFullScore(tagName);
        const coverageRatio = fullScore > 0 ? selectedScore / fullScore : 0;
        const baseScore = fullScore > 0 ? (selectedScore * selectedScore) / fullScore : 0;
        const sizeBonus = 1 + 0.1 * (selectedItems.length - gameState.minGuessSize);
        const repeatCount = gameState.tagScoreHistory[tagName] || 0;
        const repeatPenalty = Math.pow(0.5, repeatCount);
        const finalScore = baseScore * sizeBonus * repeatPenalty;

        const result = {
            tagName,
            selectedScore,
            fullScore,
            coverageRatio,
            baseScore,
            sizeBonus,
            repeatCount,
            repeatPenalty,
            finalScore
        };

        if (!best || result.finalScore > best.finalScore) {
            best = result;
        }
    }

    return best;
}

function submitGuess() {
    if (gameState.gameOver) return;

    const selectedItems = getSelectedItems();

    if (selectedItems.length < gameState.minGuessSize) {
        setMessage(`Pick at least ${gameState.minGuessSize} items.`);
        return;
    }

    gameState.guessesUsed += 1;
    const resolution = resolveBestTag(selectedItems);

    if (!resolution) {
        gameState.log.unshift({
            type: "fail",
            itemLabels: selectedItems.map(item => item.label),
            message: "Invalid guess: no shared tag across all selected items."
        });
        gameState.selectedIds = [];
        setMessage("No shared tag found. Guess consumed.");
        checkGameOver();
        render();
        return;
    }

    for (const item of selectedItems) {
        item.pick_count += 1;
    }

    gameState.score += resolution.finalScore;
    gameState.tagScoreHistory[resolution.tagName] = (gameState.tagScoreHistory[resolution.tagName] || 0) + 1;

    gameState.log.unshift({
        type: "success",
        itemLabels: selectedItems.map(item => item.label),
        tagName: resolution.tagName,
        points: resolution.finalScore,
        coverageRatio: resolution.coverageRatio,
        repeatPenalty: resolution.repeatPenalty,
        exhaustedCount: selectedItems.filter(item => !isItemAvailable(item)).length
    });

    const coveragePercent = Math.round(resolution.coverageRatio * 100);
    const repeatText = resolution.repeatPenalty < 1
        ? ` Repeat penalty applied: ×${resolution.repeatPenalty.toFixed(2)}.`
        : "";

    setMessage(`Resolved tag: ${resolution.tagName}. Coverage: ${coveragePercent}%. Points: ${resolution.finalScore.toFixed(2)}.${repeatText}`);

    gameState.selectedIds = [];
    checkGameOver();
    render();
}

function hasRemainingValidMove() {
    const availableItems = gameState.items.filter(isItemAvailable);
    const n = availableItems.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (getSharedTags([availableItems[i], availableItems[j], availableItems[k]]).length > 0) {
                    return true;
                }
            }
        }
    }

    return false;
}

function checkGameOver() {
    if (gameState.guessesUsed >= gameState.maxGuesses) {
        gameState.gameOver = true;
        setMessage(`Game over. Guess limit reached. Final score: ${gameState.score.toFixed(2)}.`);
        return;
    }

    if (!hasRemainingValidMove()) {
        gameState.gameOver = true;
        setMessage(`Game over. No valid groups of ${gameState.minGuessSize}+ remain. Final score: ${gameState.score.toFixed(2)}.`);
    }
}

function setMessage(text) {
    if (els?.messageBox) {
        els.messageBox.textContent = text;
    }
}

function renderBoard() {
    if (!els?.board) return;
    els.board.innerHTML = "";

    for (const item of gameState.items) {
        const button = document.createElement("button");
        button.className = getTileStateClass(item);
        button.disabled = !isItemAvailable(item) || gameState.gameOver;
        button.type = "button";
        button.addEventListener("click", () => toggleSelection(item.id));

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.label;

        const usage = document.createElement("span");
        usage.className = "tile-usage";
        usage.textContent = getTileUsageText(item);

        button.appendChild(label);
        button.appendChild(usage);
        els.board.appendChild(button);
    }
}

function renderSelected() {
    if (!els?.selectedList) return;
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
        els.selectedList.className = "selected-list empty";
        els.selectedList.textContent = "No items selected.";
        return;
    }

    els.selectedList.className = "selected-list";
    els.selectedList.innerHTML = "";

    selectedItems.forEach(item => {
        const chip = document.createElement("span");
        chip.className = "selected-chip";
        chip.textContent = `${item.label} ${getTileUsageText(item)}`;
        els.selectedList.appendChild(chip);
    });
}

function renderLog() {
    if (!els?.log) return;
    els.log.innerHTML = "";

    if (gameState.log.length === 0) {
        const empty = document.createElement("div");
        empty.className = "log-entry";
        empty.innerHTML = `<div class="log-meta">No guesses submitted yet.</div>`;
        els.log.appendChild(empty);
        return;
    }

    gameState.log.forEach(entry => {
        const card = document.createElement("div");
        card.className = `log-entry ${entry.type}`;

        if (entry.type === "success") {
            card.innerHTML = `
        <div class="log-title">${entry.tagName} · +${entry.points.toFixed(2)}</div>
        <div class="log-meta">${entry.itemLabels.join(", ")}</div>
        <div class="log-meta">Coverage ${Math.round(entry.coverageRatio * 100)}% · Repeat ×${entry.repeatPenalty.toFixed(2)} · Exhausted this turn ${entry.exhaustedCount}</div>
      `;
        } else {
            card.innerHTML = `
        <div class="log-title">Failed guess</div>
        <div class="log-meta">${entry.itemLabels.join(", ")}</div>
        <div class="log-meta">${entry.message}</div>
      `;
        }

        els.log.appendChild(card);
    });
}

function renderStats() {
    if (!els) return;
    if (els.scoreValue) els.scoreValue.textContent = gameState.score.toFixed(1);
    if (els.guessesUsed) els.guessesUsed.textContent = String(gameState.guessesUsed);
    if (els.maxGuesses) els.maxGuesses.textContent = String(gameState.maxGuesses);
    if (els.moveState) els.moveState.textContent = gameState.gameOver ? "None" : (hasRemainingValidMove() ? "Yes" : "No");
    if (els.submitBtn) els.submitBtn.disabled = gameState.gameOver;
    if (els.clearBtn) els.clearBtn.disabled = gameState.gameOver || gameState.selectedIds.length === 0;
}

function render() {
    renderBoard();
    renderSelected();
    renderLog();
    renderStats();
}

function bindEvents() {
    els.submitBtn?.addEventListener("click", submitGuess);
    els.clearBtn?.addEventListener("click", clearSelection);
    els.newGameBtn?.addEventListener("click", () => initialiseGame());
}

function boot() {
    els = getEls();

    const missing = Object.entries(els)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        console.error("TagLink failed to boot. Missing DOM nodes:", missing);
        return;
    }

    bindEvents();
    initialiseGame();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}
