REV496 / v1.18.09

- Stop signal control moved into Analyst adjustment risk: Swap-style switch, input on its own row, red help text.
- Synchronized stop checkbox and percentage in Table 2, Table 3 and Equity Curve. Default OFF / 75%.
- Every threshold-breaching month gets red X and red values in Table 2; remove latest-month yellow warnings.
- Single analyst/pair equity curve highlights stopped months with transparent red bands.
- Fix report navigation icon and table sort triangles.
- Cache monthly pips aggregates instead of repeatedly scanning full history; reduce heavy backdrop effects during scrolling.

Validation: threshold and manual-selection regression; real dashboard UI/checkbox/export/equity synchronization; chart band coordinates; report/export and responsive scroll regressions.
