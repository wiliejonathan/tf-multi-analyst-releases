REV527 / v1.18.40

- Add three independent checkboxes to the generated MT4/MT5 indicator panel: Trade TP, Trade SL and Trade Cancelled. All are checked by default.
- Display ANALYST_NAME | PAIR as the top panel heading, above TF ANALYST | RR HISTORY. Long names have a full-name tooltip.
- Unchecking a category removes its risk/reward rectangles, outcome paths and labels from the chart. Checking it restores eligible chart objects. Tick boxes and their captions are both clickable.
- Visibility changes force a clean redraw and retain their state through zoom, scrolling and resizing. Filtering never changes the full-history TP/SL/pips/R statistics.
- Inputs expose the same three default visibility settings when the panel is hidden.
- Preserve strict candle-gap checks, measured outcome labels, analyst export names and the dark builder palette.
- Compiler template 2.27 is required; older local compilers are detected before downloading. Existing EX4/EX5 files need to be regenerated to include the new controls.
- Verified all eight visibility combinations using the actual category predicate and click handler, independent controls, all-off/all-on, instance isolation, redraw persistence, financial calculation order and real MT4/MT5 compilation.
