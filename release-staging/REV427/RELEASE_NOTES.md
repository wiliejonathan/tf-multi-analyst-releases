REV427 / v1.17.40

- Filter SL Fixed default ON hijau. Tombol OFF merah melewati syarat pengulangan pips negatif, dengan filter lain tetap berlaku. Posisi di bawah deskripsi scanner. Default reset juga ON.
- Memperbaiki interaksi kalender History TF dan memverifikasi tanggal sebenarnya setelah Apply.
- History yang ditolak TF dengan pesan "Jumlah signal terlalu sedikit" dicatat sebagai skip lalu lanjut analis berikutnya.
- Sidebar tetap menyatu dengan tema dan ikon utama, satu scrollbar, serta tombol Back, Import/Export JSON, Submit/Stop, Pause/Resume, Dashboard, dan Reset.

Uji langsung extension terpasang di Chrome Windows, 3 Oktober 2026:
- ON: 24/24 card hasil filter selesai; 9 lolos, 15 skip. History XAUUSD Closed At 6 bulan dalam tiga rentang. Hitungan SL cocok dengan signal ID berbeda; Excel kolom C terverifikasi.
- OFF: 17 card selesai diperiksa, 6 lolos, lalu dihentikan untuk menguji force Stop. Diabolic Leon ditolak ON dan diterima OFF; filter lain sama.
- Pause/Resume, Stop, ekspor JSON/Excel, impor JSON ON dan OFF diuji melalui UI extension.
- Uji otomatis 501 card tanpa batas jumlah, exact pips, pembatalan, respons null/invalid, sintaks, ZIP CRC, identitas extension dan hash integritas.

Pengujian langsung terbatas pada Chrome Windows, akun dan pair tersebut; seluruh kombinasi pair/filter dan macOS belum diuji langsung. Jumlah 24 adalah hasil filter pada sesi uji, bukan batas scanner.

Update: ekstrak ZIP ke folder extension lama lalu Reload. Biarkan TF Multi-Link Dashboard terbuka selama scan.
