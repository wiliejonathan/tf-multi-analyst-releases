# TF Analyzer Analyst v1.16.99 — REV386

## Holding Period Final Accuracy

- Holding per trade = **Closed At (`displayDate`) − Created At (`createdDate`)** from Table 3.
- Numeric sort keys are fallback-only for legacy rows with missing display dates.
- Withdraw rows are excluded.
- **Max Holding Period** = longest holding from **all history** for each active Analyst-Pair.
- **Avg Holding Period** = average holding from the active Time Range / Time Range per Month / Filter Tanggal dataset.
- Analyst/Pair ticker filters determine which Analyst-Pair rows appear.
- REV384 alignment/performance, import persistence, custom cursor, and single authoritative integrity registry are retained.

Asset: `TF_Extension_PC_MAC_REV386_HOLDING_TABLE3_FINAL_ACCURACY.zip`
