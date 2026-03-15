# TagLink

Updated vanilla web prototype implementing the revised rules:

- valid guesses are any 3+ available items sharing at least one tag
- incomplete groups are allowed
- items have per-item usage limits
- each tile shows usage as x/n
- successful guesses increment pick counts
- exhausted items remain visible but disabled
- scoring uses coverage discount and repeat-tag penalty

## Files

- `index.html` — layout and UI shell
- `styles.css` — visual states for unused, partially used, selected, exhausted
- `app.js` — game logic, scoring, x/n counters, partial-group handling

## Run

Open `index.html` in a browser.

For a local server:

```bash
python -m http.server
```

Then open the reported localhost URL.
