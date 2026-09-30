# TF Analyzer Analyst v1.17.00 — REV387

## Holding Period Timeframe Parity

- Holding per trade tetap **Closed At (`displayDate`) − Created At (`createdDate`)** dari Table 3.
- `createdSortKey` / `sortKey` hanya fallback.
- Withdraw tidak dihitung.
- **Max Holding Period dan Avg Holding Period sekarang memakai dataset filter aktif yang sama.**
- Keduanya mengikuti **Time Range, Time Range per Month, Filter Tanggal, Nama Analis, dan Pair**.
- Alignment, no-scroll, import persistence, custom cursor, Table 3 performance fix, dan integrity registry tetap dipertahankan.

Asset: `TF_Extension_PC_MAC_REV387_HOLDING_TIMEFRAME_PARITY.zip`
