# TF Analyzer Analyst v1.16.96 — REV383

## Holding Period UI + Table 3 Performance

- Dua tabel **TABLE ANALYTICS → Holding Period per Analis** tetap tampil per **Nama Analis - Pair**.
- Menghapus scrollbar internal vertical dan horizontal dari dua tabel Holding Period; tabel sekarang mengembang mengikuti konten.
- Header **Max - Holding Period** dan **Avg. Holding Period** ditengahkan.
- Efek cursor-follow glow dinonaktifkan sepenuhnya pada **Table 3 – History Signal – Perhitungan Hasil per Trade**, termasuk scan MutationObserver, untuk menghindari lag/delay pada history besar.
- Data hasil Import direhidrasi dari `chrome.storage.local` ketika side panel dibuka kembali; remembered analyst links dapat dibangun ulang dari `tfAnalystSources`.
- Tema/warna asli plugin dipertahankan. Efek mechanical high-tech hanya berupa shadow/light-edge pada tabel yang aman.
- Mini neon cursor tetap aktif.
- Protected integrity map diregenerasi dan diverifikasi saat build.

Asset: `TF_Extension_PC_MAC_REV383_HOLDING_NO_SCROLL_HISTORY_PERF_FIX.zip`
