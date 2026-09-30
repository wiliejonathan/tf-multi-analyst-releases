# TF Analyzer Analyst v1.17.10 — REV397

REV397 memastikan **tidak ada nama analis putih**:
- semua nama analis non-kosong dipaksa ke state hijau / kuning / merah;
- canonical matching mengabaikan glyph ✓ ! ×, pair suffix, whitespace tersembunyi, dan label status;
- analis tanpa state khusus dianggap healthy/hijau;
- post-render sweep mencakup Table 1/2/3, Performance, Holding, Drawdown, Table 4, iSignal, Users Details, ticker;
- sidebar plugin juga fallback hijau bila tidak ada warning/critical;
- semua perbaikan REV396 tetap dipertahankan.
