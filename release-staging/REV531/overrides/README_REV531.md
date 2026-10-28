REV531 / v1.18.44

- Keep the full main navigation available across dashboard/report/builder views, iSignal Users and the subscription page. Includes Beranda, Analis Report, iSignal, TF Copy Signal, Profile, Created MT4/MT5 Indicator and Created TradingView Indicator.
- Add a shared lightweight navigation module. Links on secondary pages open the correct dashboard route. Indicator builders reuse existing anchors, preserving active state and avoiding duplicate menu entries.
- Preserve iSignal and TF Copy Signal submenus and existing external destinations. No account, license, calculation, mobile build or indicator compiler changes.
- Verified actual page markup, complete menu order, correct cross-page targets, builder anchor reuse, idempotence, dropdown presence, narrow widths, and real report/home/builder Back/Forward transitions.
