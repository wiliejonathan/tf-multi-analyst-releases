REV427 / v1.17.40 — TF Multi-Analyst Scanner

Perbaikan:
- Filter SL Fixed ON/OFF tepat di bawah deskripsi scanner. Default ON hijau; OFF merah. OFF melewati syarat pengulangan pips negatif; filter lain tetap berlaku. Dashboard menampilkan Filter OFF dan JSON menyimpan sl=null, slFixedChecked=false.
- Kalender History memicu interaksi hover yang dipakai datepicker TF, lalu memverifikasi tanggal setelah Apply. Kolom readonly tidak diubah secara paksa.
- Pesan TF "Jumlah signal terlalu sedikit" pada History dicatat sebagai skip beserta alasannya. Gangguan lain tetap dilaporkan agar data tidak dianggap valid.
- Tema utama, kontrol Import/Export JSON, Submit/Stop, Pause/Resume, Dashboard/Reset, dan satu scrollbar sidebar dipertahankan.

Pemakaian: buka sidebar utama, klik Scrape Multi-Link Analis, pilih filter, lalu Submit. Biarkan dashboard terbuka. Pause/Resume mengulang card yang belum selesai. Stop membatalkan pekerjaan dan menutup hanya tab scan milik scanner. Scan tidak dibatasi jumlah analis.

Validasi langsung Chrome: filter default ON, 24/24 card selesai, 9 lolos, 15 skip; History 6 bulan Closed At XAUUSD dalam 3 rentang. Bukti JSON dan Excel diunduh melalui tombol extension. Semua hitungan pengulangan dicocokkan dengan ID signal yang berbeda. SL berada di kolom C Excel.

Uji OFF langsung: 17 card diperiksa, 6 lolos, lalu force Stop diuji. Diabolic Leon diterima OFF dan ditolak ON dengan filter lain sama. Pause/Resume dan impor JSON ON/OFF berhasil melalui UI. Tombol dikembalikan ke ON setelah uji.

Batas pengujian: Chrome Windows dengan akun dan data TF yang tersedia pada 3 Oktober 2026. Tidak menyatakan seluruh kemungkinan filter/pair atau macOS telah diuji langsung. 24 card merupakan jumlah hasil filter, bukan batas scanner.
