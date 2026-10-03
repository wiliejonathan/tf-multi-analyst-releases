REV428 / v1.17.41

- Pair menjadi selector tepat di bawah tombol Filter SL Fixed. Daftar 16 pair sesuai DOM History Signal TF: XAUUSD, AUDJPY, CHFJPY, CADJPY, GBPJPY, EURJPY, NZDJPY, USDJPY, GBPUSD, EURUSD, USDCHF, USDCAD, AUDUSD, NZDUSD, EURGBP, EURNZD. Default XAUUSD.
- Kolom SL Fixed pips Count (6) ditambahkan di kanan SL fixed Pips, judul dua baris dan angka count memakai kejadian pips negatif identik dari signal berbeda. Angka bulan pada judul mengikuti rentang History hasil scan.
- Kolom count langsung disembunyikan saat tombol OFF dan ditampilkan saat ON. Baris dari scan OFF tidak dinyatakan memiliki hitungan fixed yang valid.
- Default SL Fixed tetap ON hijau; tema dan integrasi sidebar utama dipertahankan.

Verifikasi: daftar pair dibaca dari DOM TF; selector dan hide/show count diuji melalui extension terpasang di Chrome Windows dengan hasil scan nyata. Engine scan sama dengan REV427 yang menyelesaikan 24/24 card (9 lolos, 15 skip). Uji otomatis 501 card, cancellation, sintaks, hash integritas dan ZIP CRC lulus. Tidak melakukan ulang full scan atau mengklaim pengujian macOS/semua pair.

Update: ekstrak ZIP ke folder extension lama lalu Reload.
