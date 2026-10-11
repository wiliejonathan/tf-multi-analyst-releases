REV497 / v1.18.10

- Compact Stop signal risk inputs with no number spinners in every synchronized control. Rename label to Stop signal jika melewati batas risk Avg. 6 month.
- Verify each month uses its own preceding six calendar months: sum positive monthly PnL pips divided by number of positive months.
- Red monthly stop bands follow candle viewport scaling, zoom and pan, clipped to chart bounds.
- Add contrasting red total stopped-month range count inside chart; count independent of candle zoom.

Validation: May/June/July rolling baselines (including four positive months), threshold edges, real dashboard synchronization, candle coordinate/clipping and count tests; release regressions.

- Lock Table 2 identity columns during horizontal scrolling and add subtle 8% red background to stopped monthly cells without fading text.
