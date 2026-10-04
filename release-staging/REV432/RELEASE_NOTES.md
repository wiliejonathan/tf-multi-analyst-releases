REV432 — v1.17.45

Perbaikan proses Scrape Multi-Link Analis:

- Membaca halaman TF setelah isi DOM siap, tanpa menunggu seluruh aset tambahan selesai.
- Menunggu Summary ALL dan Score terisi sebelum menerima data, serta mencoba ulang halaman analis yang belum lengkap.
- History Signal memakai rentang tanggal yang diverifikasi dan mencakup enam bulan melalui beberapa rentang.
- Stop membatalkan proses aktif; Pause/Resume melanjutkan card yang belum selesai tanpa menggandakan hasil.
- Reset mengosongkan hasil, angka, progres, dan catatan TF Multi-Link Dashboard. Data Main Dashboard tetap terpisah.
- Default skor Profit Factor dan Recovery Factor tetap 1/4 dan 2/4.

Pengujian otomatis mencakup 501 card tanpa batas buatan, pembatalan proses, filter SL ON/OFF, pengurutan, dan Reset yang mempertahankan data Main Dashboard. Paket rilis diverifikasi cocok dengan isi build lokal yang diuji.

Pengujian langsung Chrome: batch selesai 24/24 card, 7 lolos dan 17 skip; Pause/Resume, Stop, Reset, Export/Import JSON, dan berkas Excel berhasil diverifikasi. Export PDF menggunakan dialog cetak Chrome (Save as PDF); penyimpanan PDF dari dialog belum terverifikasi karena kontrol browser dihentikan saat pemeriksaan URL.
