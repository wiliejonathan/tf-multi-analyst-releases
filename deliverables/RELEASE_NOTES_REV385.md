# TF Analyzer Analyst v1.16.98 — REV385

## Holding Period Accuracy Fix

- Holding Period uses the exact Table 3 date strings as its primary source.
- Created At = `createdDate`; Closed At = `displayDate`.
- `createdSortKey` / `sortKey` are fallback-only for legacy rows.
- Max Holding Period remains all-history for active Analyst-Pair selections.
- Avg Holding Period follows Time Range, Time Range per Month, and unified Table 3 date filtering.
- REV384 alignment and Table 3 performance fixes remain intact.
- Integrity registry is regenerated from exact final packaged bytes and verified with 0 mismatches.

Asset: `TF_Extension_PC_MAC_REV385_HOLDING_ACCURACY_FIX.zip`
