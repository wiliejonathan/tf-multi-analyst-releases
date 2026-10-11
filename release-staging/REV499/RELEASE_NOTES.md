REV499 / v1.18.12

Switch uses the oldest month among selected analyst-pair combinations. Selecting A (May 2025) and B (February 2025) starts in February; A alone starts in May. Unselected analysts and pairs cannot move the anchor. Table 2 resolves its anchor directly from the current selection instead of stale range state.

Validation: A+B, A alone, B alone, changed pair, empty selection, range boundaries and Switch synchronization; release regressions.

Add 4Y (48 months) between 3Y and 5Y in every Time Range row.
