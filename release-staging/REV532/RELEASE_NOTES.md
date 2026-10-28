REV532 / v1.18.45

- Make the generated TradingView information panel compact by default for phone charts: five short rows, optional short warning row, shortened long analyst headings with full-name tooltip, and explicit tiny text on every cell. Keep its top-right position.
- Add Panel settings: Hide Panel, Mode panel (Ringkas / Lengkap) and Ukuran teks (Sangat kecil / Kecil / Normal). Hide Panel removes only the information table; trade boxes, paths and labels remain visible. Unchecking it restores the panel.
- Pine tables do not expose chart-button click callbacks. Hide Panel is a native checkbox in indicator Settings > Inputs > Panel; no non-functional on-chart button is drawn. The plugin explains the exact path.
- Preserve all history, trade/category visibility controls, fee snapshots, net PnL/R and Opened-to-Closed chart geometry. The actual ingestion, financial and drawing blocks are verified byte-identical to REV531.
- Re-export using Submit after updating the plugin, then replace the old Pine code in TradingView to obtain these settings. Existing scripts do not update automatically.
- Desktop plugin/Pine generator only; MT4/MT5 compiler and APK/iOS/browser packages unchanged.
