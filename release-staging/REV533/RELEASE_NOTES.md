REV533 / v1.18.46

- Pack tutorial cards into the shortest available column rather than reserving the height of the tallest card for every row. Odd final steps use the full available width to remove the large empty end column. Preserve DOM, keyboard and numbered step order.
- Apply the layout to MT4 template, MT4/MT5 indicator and TradingView tutorials. On narrow screens use one full-width column. Reflow on image load, hidden-page visibility and size changes using coalesced ResizeObserver updates; no periodic polling.
- Reduce Cek koneksi to a compact 29px control with smaller padding and text. Preserve connection diagnostics and all existing buttons/actions.
- Verify short-card gap filling, full-width final steps, no card overlaps, responsive widths, no horizontal overflow and connection button dimensions. Tutorial text, screenshots, PDF downloads and template bytes are unchanged. No Pine/MQL/financial logic changes.
