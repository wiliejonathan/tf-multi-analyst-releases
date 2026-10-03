REV430 / v1.17.43

- Pilihan skor Level, Status Channel, Subscriber, Profit Factor, Mthly. Loss Ratio, Profit Month dan Recovery Factor: 1/4 sampai 4/4, kosong secara default. Kosong berarti tanpa penyaringan skor; kolom terkait disembunyikan.
- Kolom skor tampil setelah Profit Factor jika dipilih. Profit Factor juga bisa disembunyikan. Nama analis menjadi hyperlink.
- Header dashboard dapat diurutkan dua arah dengan panah. Default Priority > Prospect > Basic, lalu Profit Factor menurun. Nama dan pair menurut abjad; angka menurut nilai; level mengikuti Newbie sampai Legend. Copy Link mengikuti baris setelah sorting.
- Saat sidebar pertama kali dibuka sesudah update, pilihan skor lama dikosongkan sesuai default baru. Filter scan yang sedang berjalan tetap memakai pengaturan sesinya.

Validasi: parsing tujuh skor dari tampilan TF, uji sorting dan filter, uji scanner 501 card, Stop/Resume, integritas, ZIP CRC. Uji UI Chrome memakai halaman pratinjau dan hasil scan sebelumnya: sorting dua arah, hyperlink, serta kolom muncul/hilang mengikuti pilihan sidebar. Tidak menjalankan ulang scan live penuh pada revisi ini.
