REV455 / v1.17.68

- Apply Filter → Time range ALL → Symbol → selected Pair → Submit before Summary, Statistics and Score. Skip analysts without the requested symbol.
- Skip History Signal entirely when Filter SL Fixed is OFF. Set History dates before Symbol selection.
- Count negative closed pips within ±5 pips of one observed reference value; do not merge chained tolerance ranges. Deduplicate signals and keep pair/date restrictions.
- Move History Signal months under Minimum Portofolio. Move the tolerance explanation below minimum occurrences and above Pair.
- Align analyst name body cells left while preserving header alignment.

Validation: automated collector order and pair checks, tolerance boundaries, engine OFF skips History, 501-card/cancellation regression, responsive progress/filter UI. Live Chrome check before publication.
