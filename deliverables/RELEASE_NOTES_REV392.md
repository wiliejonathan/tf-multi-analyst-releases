# TF Analyzer Analyst v1.17.05 — REV392

## Holding Period Strict Time Range

- TABLE ANALYTICS → Holding Period per Analis memakai **hanya baris Table 3 yang checked/enabled**.
- Time Range sekarang memiliki hard boundary berdasarkan **Created At**.
- Untuk 1M, carry-over trade yang dibuat sebelum awal bulan/range dipaksa unchecked walaupun Closed At berada di 1M.
- Boundary berlaku ke seluruh bulan di range, bukan hanya bulan closed pertama.
- Manual/stale checkbox override tidak bisa mengaktifkan kembali trade yang Created At berada di luar range.
- Custom date range memakai tanggal awal custom sebagai boundary.
- Rumus durasi tetap **Closed At - Created At** untuk trade yang valid di range.

Version: **v1.17.05 / REV392**
