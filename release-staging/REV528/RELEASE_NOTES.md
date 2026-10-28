REV528 / v1.18.41

- Fix navigation between the indicator builders, dashboard, analyst report and browser Back/Forward.
- Add Created TradingView Indicator beside the MT4/MT5 builder. Generate Pine Script v6, preview, Copy Code and date + analyst .txt download. No local compiler is needed for Pine exports.
- Add MQL source preview, Copy Code and .mq4/.mq5 download to the MT builder.
- Draw a soft Created-to-Opened pending phase and normal Opened-to-Closed risk/reward phase. Outcome paths start at Created. Cancelled remains grey and contributes no executed PnL.
- Use fixed GMT+2 by default (WIB minus five hours), matching the reported broker clock. Historical European DST and custom broker offsets remain explicit options; no universal broker DST assumption.
- Render a solid foreground MT panel with independent TP, SL, Cancelled, Swap and Comm controls. Swap/Comm start enabled and use per-trade dashboard cost snapshots; these are not live broker charges.
- Validate dates, prices and financial snapshots before generation. Show specific completeness reasons and require explicit consent to export only complete records. Missing historical dates/prices are not fabricated; rescan the original history to recover them.
- Add a one-time Windows compiler setup executable and connection/platform diagnostics. Native compiler 2.28 is required. MetaEditor is still required to compile EX4/EX5. Existing indicators must be generated again.
- Preserve mobile builds: MT/native compiler navigation stays excluded from APK/iOS/browser. Shared mobile financial regression passed; no mobile package/version change in this release.
- Verification: real browser controller navigation, native host validation, real MT4/MT5 compilation, fee-toggle math, export payloads, filenames, responsive builder layout and regression suite. TradingView server compilation could not be verified because its editor was blocked by account registration; Pine output is supplied for validation in Pine Editor.

Usage: select analyst, pair and ALL/date range, then Submit. Copy the TradingView output into Pine Editor and use Add to chart. Change TP/SL/Cancelled/Swap/Comm in TradingView indicator Settings > Inputs. The imported history is a snapshot, not a live signal feed or strategy.
