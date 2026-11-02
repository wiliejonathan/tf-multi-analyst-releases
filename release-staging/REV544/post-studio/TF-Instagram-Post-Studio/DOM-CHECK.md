# Pemeriksaan sumber dan cakupan

Halaman yang diperiksa langsung: https://account.tradersfamily.id/channels/261697/
Tanggal: 31 Oktober 2026, WIB.

Interaksi browser yang diverifikasi:

- Filter dibuka melalui `#profile`.
- Timerange ALL: `button#All`. Pilihan pair: `#symbol .perSymbol`.
- Submit: `#apply-global-filter`. Hasil pair diverifikasi melalui `#symbol-right`, periode melalui `#summaryChart-period`.
- Kurva asli: `#summaryChart svg .apexcharts-series path`. Gambar diambil dari `#channel-growth`.
- Signal Frequency: `#signal-freq-desc`.
- Summary lengkap: `#btnMoreLess` dan `#parentConditionBox .moreDetailSummary`.
- Ditemukan baris Max SL Pips tersembunyi pada Summary yang mengandung nilai duplikat. Collector mengabaikan baris tidak terlihat.
- Statistics: `a[href="#tab_statistic"]`, `.info-aktivitas-priority`, `.data-detail-signal`.
- View Details membuka tampilan dalam halaman yang sama, bukan URL terpisah.
- Tahun: `#group-year-1 .btn-by-year`. Bulan: `.profit-month-signal-detail .month-card[data-year]`.
- Tombol kembali: `a.kmbl`.
- Score: `a[href="#tab_scoring"]`. Overview: `#overview_scor`. History: `#hist_scor`.
- Komponen score: `#histr_hit .child-grid-hst`. Riwayat: `#hstr-box-se .child-grid-hstr`.

Pengujian impor membaca file Excel pengguna yang sebenarnya. Pengujian otomatis Start sampai PNG/TXT memakai DOM uji yang mengikuti selector dan struktur halaman di atas, dengan penghubung API Chrome untuk menguji alur tanpa memasang ekstensi pada profil utama. Interaksi browser sumber diverifikasi secara langsung; batch 15 analis pada sesi akun pengguna belum dijalankan oleh pengujian otomatis.

Post Studio mempertahankan angka yang disajikan sumber. Summary mengikuti filter ALL + pair; Score dan Informasi Aktivitas mengikuti cakupan periode yang disediakan situs. Metadata hasil scan Excel tetap ditandai sebagai data saat scan, sehingga tidak disamakan dengan snapshot DOM terbaru.

## Perbaikan 1.0.2 — 1 November 2026

Halaman lalaaa (233144) juga diperiksa langsung: setelah ALL + XAUUSD selesai, DOM memiliki path .apexcharts-line. Worker versi lama dibuka dengan active:false dan menunggu path tanpa menggulir area grafik atau meminta resize. Worker kini aktif pada pembukaan dan setiap tahap pengambilan. Kesiapan kurva mensyaratkan SVG dengan ukuran nyata dan path valid, disertai scroll/resize serta satu tahap pemulihan terbatas.

Regresi otomatis memakai halaman uji yang menghapus path setelah Submit dan hanya menggambarnya kembali setelah event resize. Ini menguji kasus render tertunda yang sebelumnya tidak tercakup oleh fixture statis.

## Perbaikan 1.0.3 — 1 November 2026

Askar23 (208415) diperiksa langsung dengan ALL + XAUUSD. Preview Profit Per Month memiliki .detail-signal dengan span .custom-month-year dan .text-cstom-pips, tanpa h4. Collector lama salah menunggu h4 di bagian ini. Pemeriksaan kesiapan kini mengikuti tombol View Details yang terlihat, dan preview dibaca dari span. Tampilan rinci tahun tetap memakai h4 di .month-card. Semua tombol tahun 2026, 2025, 2024 dibuka dan menghasilkan 10, 12, 6 kartu bulan. Score dan History juga diperiksa: 7 komponen dan 4 entri riwayat terbaca.
