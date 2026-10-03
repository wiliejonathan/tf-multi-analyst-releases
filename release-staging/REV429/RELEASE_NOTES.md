REV429 / v1.17.42

- Klik berulang dan double-click pada Submit/Stop dilindungi selama transisi 1,5 detik agar klik kedua tidak langsung menghentikan scan yang baru dimulai.
- Resume tersedia untuk scan stopped yang masih memiliki analis belum selesai. Cursor, filter sesi, rentang tanggal dan hasil sebelumnya dipertahankan. Stop tetap membatalkan proses dan menutup tab scan; melanjutkan memerlukan klik Resume secara eksplisit.
- Perintah Resume lama dibersihkan saat memulai/melanjutkan. Log kontrol menyimpan sumber tombol dan waktu, termasuk pause karena dashboard ditutup.
- Selector pair, count ON/OFF, tema dan fungsi utama REV428 dipertahankan.

Validasi: uji 501 card, Stop segera membatalkan pekerjaan, explicit Resume setelah Stop, mempertahankan hasil parsial tanpa duplikasi, ON/OFF fixed SL, sintaks, integritas dan ZIP CRC. Pengujian UI dilakukan pada extension Chrome Windows. Akar pemicu Stop pada sesi sebelumnya tidak dapat dipastikan dari log lama; revisi ini menambahkan perlindungan klik dan pelacakan sumber.

Untuk scan yang terhenti: setelah update dan Reload, buka Scrape Multi-Link Analis > Dashboard > Resume. Submit memulai scan baru.
