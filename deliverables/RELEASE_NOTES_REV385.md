# TF Analyzer Analyst v1.16.98 — REV385

## Holding Period — Table 3 Source-of-Truth Fix

- Holding Period setiap trade dihitung dari kolom **Tanggal (Closed At) − Tanggal (Created At)** yang benar-benar ditampilkan Table 3.
- Label WIB pada Table 3 diparse sebagai source of truth; `createdSortKey/sortKey` hanya fallback kompatibilitas.
- Max dan Avg dihitung dari **final trade rows Table 3** setelah filter Nama Analis/Pair, Time Range, Time Range per Month, dan Filter Tanggal.
- Withdraw bukan trade dan tidak dihitung.
- Memperbaiki REV384 yang merender Holding sebelum final Table 3 rows selesai dibentuk.
- Alignment REV384, no-inner-scroll, Table 3 performance fix, import persistence, custom cursor, dan single authoritative integrity registry tetap dipertahankan.
- Integrity final diverifikasi ulang sebelum ZIP dipublish.

Version: **v1.16.98 / REV385**
