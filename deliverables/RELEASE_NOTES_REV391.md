# TF Analyzer Analyst v1.17.04 — REV391

## Holding Period = checked Table 3 rows only

- Holding Period sekarang memakai **tepat trade yang dicentang/enabled di Table 3**.
- Baris yang tidak dicentang manual maupun otomatis karena boundary **Time Range / Time Range per Month** tidak ikut menghitung Max/Avg.
- Dengan 1M, carry-over trade dari sebelum periode yang otomatis unchecked tidak lagi menyebabkan Max Holding 50–60+ hari.
- Rumus durasi tetap **Closed At − Created At**.
- Nama Analis + Pair, filter tanggal, Time Range, Time Range per Month, alignment/no-scroll, import persistence, custom cursor, dan Table 3 performance fix tetap dipertahankan.

Asset: `TF_Extension_PC_MAC_REV391_HOLDING_CHECKBOX_PARITY.zip`
