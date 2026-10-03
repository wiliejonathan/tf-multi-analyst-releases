# REV424 — Scrape Multi-Link Analis

Versi 1.17.37, menggabungkan scanner filter ke plugin utama REV418. Ikon, identitas extension, profil akun, aktivasi/lisensi, dashboard utama, login/logout dan fitur lama tetap memakai komponen plugin utama.

## Cara memakai
1. Ekstrak ZIP dan update folder extension lama melalui **Load unpacked / Reload** di Chrome. Windows dan macOS menggunakan paket yang sama.
2. Pada sidebar utama, di bawah penjelasan Scan Channel ini / Submit, klik **Scrape Multi-Link Analis**.
3. Area Time Range sampai Logout diganti tampilan scanner. Header akun dan pemeriksaan update tetap ada. **Back To Main Dashboard** berada di bawah pemeriksaan update. **Power / Sleep Event Log** tetap di bawah scanner.
4. Atur filter lalu **Submit**. Biarkan tab **TF Multi-Link Dashboard** terbuka selama scan. Tab TF khusus scan berjalan di latar; tidak perlu berlangganan.

## Filter default
Elite + Master, Priority + Prospect, Probability 40–100%, Avg. Monthly Profit 500–10.000 pips, Max. Loss 50%, Data Summary 1 tahun, Sort Medal. Semua nilai bisa disesuaikan. Data Summary juga bisa 6 bulan, sort mengikuti opsi TF. Maksimal dua level dan dua status: saat dua dicentang, pilihan lainnya disabled sampai salah satu di-untick.

Card diterima pada Losing Month 1/12 dan 2/12; 0/12 dan 3/12 atau lebih dilewati. Jika Data Summary menjadi 6 bulan, penyebut yang diperiksa juga 6. Batas Losing Month DOM maksimal 2. Pilihan Losing Month card bisa disesuaikan.

Summary ALL: Consecutive Loss maksimal 15. Score: Recovery Factor skor 2/4, 3/4, 4/4; 1/4 dilewati. Profit Factor diambil dari Score yang ditampilkan.

History default 6 bulan, Closed at, pair XAUUSD; bisa diganti GBPJPY dan pair lain. Minimal 10 kejadian hasil penutupan negatif dengan angka sama persis. Signal ID dideduplikasi. −150 dan −150.1 tidak disamakan. Jika beberapa nilai lolos, SL fixed memakai nilai yang paling sering muncul; nilai lain tetap tercatat di bukti JSON.

## Progres dan kontrol
- Tidak ada batas jumlah analis. Card dimuat sampai Load More selesai lalu semuanya dievaluasi. Card gagal Losing Month langsung skip.
- Progress bar tahapan pemeriksaan satu analis muncul setelah card dibuka. Jumlah card ditampilkan sebagai teks setelah seluruh hasil filter dimuat. Pada History jumlah total signal tidak disediakan TF, sehingga bar tahap disertai jumlah signal yang sudah dimuat.
- Saat aktif, **Submit berubah menjadi Stop**. **Stop** membatalkan runner dan menutup tab TF khusus milik scan; hasil analis yang sudah selesai tetap tersimpan. Scan yang di-stop tidak otomatis dilanjutkan.
- **Pause** membatalkan pekerjaan card yang sedang berjalan dan menyimpan checkpoint. Tombol berubah **Resume**. Resume mengulang hanya card yang belum selesai; hasil sebelumnya tidak diduplikasi. Pause/Resume/Stop tersedia di sidebar dan dashboard.
- Hanya satu runner dapat berjalan. Batch utama yang masih berjalan harus dihentikan sebelum memulai scanner multi-link.
- Jika dashboard ditutup, runner dijeda dan tab khusus scan ditutup. Klik Resume setelah membuka dashboard kembali.

## Hasil dan ekspor
Kolom dashboard: **Link | Nama analis | Pair | SL fixed Pips | Consecutive loss | Profit factor | Losing Month | Level | Centang**.

Kolom Link berisi **Copy Link**, menyalin link sesuai row. Setelah berhasil menjadi **Link Copied!** selama dua detik, lalu kembali. Priority hijau, Prospect abu-abu; tanpa status menjadi Basic Channel. Level berasal dari card; status diverifikasi dari Score.

Excel tetap A Nama analis, B Link, **C SL fixed Pips**, D Pair, lalu metrik lainnya. Nama disimpan sebagai teks, bukan formula. **Export PDF** membuka dialog cetak Chrome untuk **Save as PDF**. TXT menggunakan `nama : link`. Bukti JSON berisi filter, card, profil, window history, signal, alasan skip, dan bukti akhir pagination.

History dianggap mencapai akhir DOM setelah dua percobaan scroll tidak menambah signal selama 12 detik setelah loading selesai. Karena TF tidak menyediakan total history, bukti ini dicatat transparan. Error tidak dianggap scan selesai.

## Validasi dan batas
UI integrasi dan aturan checkbox diuji melalui pratinjau lokal. Runner diuji dengan 501 card, pembatalan saat History berjalan, Pause/Resume, deduplikasi, batas tanggal dan data DOM dari 12 analis sebelumnya. ZIP, referensi asset, sintaks dan SHA-256 registry diperiksa. Aktivasi lisensi dan full scan sebagai extension terpasang di Chrome belum diuji end-to-end; release tidak mengklaim uji tersebut.

Data multi-link menggunakan namespace terpisah (`tfMulti…V419`), sehingga tidak menimpa data dashboard utama. Tidak ada subscription, transaksi, atau upload hasil analis ke server lain. Proses pemeriksaan integritas dan aktivasi plugin utama tetap dipertahankan.

Import JSON dan Export JSON di bawah Back To Main Dashboard hanya mengelola hasil Multi-Link. Export menyimpan hasil, filter, dan bukti pemeriksaan. Import memuat hasil ke Dashboard; Stop scan sebelum import. Import tidak menjalankan scan otomatis dan tidak mengganti data dashboard utama.

REV424: tombol Submit, Pause/Resume, Dashboard, dan Reset dipindah tepat di bawah Import JSON / Export JSON. Tombol tetap terhubung ke filter dan runner. Reset dari posisi baru diuji di UI lokal.

REV424: sidebar dibuka pada dashboard utama. Halaman scanner dibuat hanya setelah tombol Scrape Multi-Link Analis diklik. Kontrol DOM memastikan halaman utama dan scanner tidak ditampilkan bersamaan, sekalipun CSS atau skrip lama mengubah display. Back memulihkan halaman utama. Header dan Power log tetap ada.

REV424: scanner menjadi bagian DOM sidebar utama, tanpa iframe, outline panel, atau scrollbar internal. Style filter dibatasi pada area scanner agar tidak mempengaruhi dashboard utama. Tombol atas langsung terhubung ke scanner.

REV424: desain compact REV420 diterapkan pada scanner yang menyatu; tema dimuat langsung saat panel dibuat sehingga kolom putih/native tidak muncul jika link stylesheet eksternal gagal dimuat.

REV424: toolbar Back, Import/Export JSON, Submit/Pause/Dashboard/Reset selalu dibuat pada main container, tanpa bergantung pada blok pemeriksaan update versi.
