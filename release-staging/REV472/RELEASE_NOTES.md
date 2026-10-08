REV472 / v1.17.85

- Configurable risk inputs above Table 1: +30% consecutive loss, 50% PnL warning and 75% PnL critical, all enabled by default. Settings persist and update Report/dashboard/sidebar risk. Updated first-entry popup explains settings and seven-month PnL comparison.
- Analis Report menu directly to the right of Beranda, with responsive Status, Analyst, old/new Consecutive Loss and Drawdown table.
- Reuses existing four-month ALL-history risk rules; analyst names link to their profile. Multi-pair values show maxima per pair.
- Report and Beranda switch in the same document without new activation checks; iSignal Users entry/exit checks remain intact.
- Browser Back/Forward restores the selected view and loaded history updates the report.

Validation: actual risk engine and dashboard DOM, all three statuses, metric values, safe links, unavailable/empty data, responsive table, navigation without additional activation; scanner regressions.
