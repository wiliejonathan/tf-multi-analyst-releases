REV520 / v1.18.33 — further low-end laptop optimization

Core dashboard SL statistics now share a bounded cache during one synchronous render task instead of repeatedly scanning full trade history. The cache is discarded at the microtask boundary; history replacement/length changes, stored-average edits and committed recomputes invalidate it. Results are returned as copies. All original fixed-SL/average-SL calculation rules are preserved.

History Table 3 now displays 100 rows per page with previous/next and a page selector. Full-data calculations, eligibility/checkbox scope, drawdown, equity and exports still use all selected rows. Only DOM row creation is paged.

Responsive chart rebuilds are coalesced after width changes settle, avoiding repeated chart construction while a window is dragged. Existing height-only resize protection, deferred hidden report startup and deferred Show More rows remain.

Synthetic core benchmark: 2,000 lookups against 6,000 trades reduced full-history visits from 24,000,000 to 240,000 (99% fewer). This measures the repeated SL lookup workload, not a guarantee of whole-app speed on every laptop. Tests cover recalculation after data edits, stored averages, copied results, exact money/lot math and report responsiveness.

Full dashboard comparison with identical 6,000-trade input and 4x CPU slowdown: 16.6s before, 2.8s after in the final run. All exported row IDs, PnL, lot and running balances had identical SHA-256 digests. Visible history rows: 6,000 before, 100 after. Timing varies by device and run.
