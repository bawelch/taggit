# Weighted Tag Connections Web App

## Files

- `index.html` — main page
- `styles.css` — styling
- `src/data.js` — entry database
- `src/utils.js` — utility helpers
- `src/game.js` — core game logic
- `src/app.js` — UI wiring

## Run locally

Because this uses JavaScript modules, open it with a simple local server rather than double-clicking `index.html`.

### Python
```bash
python -m http.server 8000
```

Then open:
```text
http://localhost:8000
```

### VS Code Live Server
You can also open the folder in VS Code and use Live Server.

## Current limitations

- Generator is constrained and heuristic, not yet fully quality-validated
- Dataset is in-code rather than external JSON
- No daily seed, persistence, or difficulty telemetry
- No solver validation pass for accidental alternate solutions

## Sensible next steps

- Move dataset into JSON
- Add authored themes
- Add solver validation
- Add mobile polish and animation
- Add seeded runs / daily puzzle mode
