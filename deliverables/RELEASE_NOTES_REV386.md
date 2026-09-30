# TF Analyzer Analyst v1.16.99 — REV386

## Holding Period Final Table 3 Accuracy

- Holding Period is calculated only from the exact final trade rows displayed/exported by Table 3 after active filters.
- Holding per trade = Closed At (`displayDate`) − Created At (`createdDate`).
- Numeric sort keys are fallback-only.
- Withdraw rows are excluded.
- Max and Avg both follow the active Table 3 dataset, including analyst/pair, Time Range, Time Range per Month, and Filter Tanggal.
- REV384 alignment/performance, import persistence, custom cursor, and single authoritative integrity registry are retained.

Asset: `TF_Extension_PC_MAC_REV386_HOLDING_TABLE3_FINAL_ACCURACY.zip`
