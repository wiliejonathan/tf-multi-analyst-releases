TF INSTAGRAM POST STUDIO 1.0.4

Plugin Chrome baru, terpisah dari TF Multi-Analyst Scanner.

PASANG:
1. Ekstrak ZIP.
2. Buka chrome://extensions
3. Aktifkan Developer mode, klik Load unpacked.
4. Pilih folder TF-Instagram-Post-Studio (berisi manifest.json).
5. Klik ikon plugin. Buka Studio penuh bila ingin area lebih luas.

PAKAI:
1. Login TradersFamily di Chrome.
2. Drag & drop Excel ke sidebar, klik Import Excel, atau tambahkan link manual.
   Antrean awal kosong. Default jumlah proses 15 link baru.
   Tombol X pada setiap baris menghapus link dari antrean.
3. Centang antrean dan pilih pair tiap link.
4. Pilih folder penyimpanan. Folder utama dibuat otomatis:
   Post Instagram Analis Performers
5. Start. Pause/Lanjut dan Stop tersedia. Biarkan Studio terbuka.

Panduan lengkap: buka PANDUAN.html.
Template carousel: PNG 1080 x 1350, ungu gelap / lavender.
Logo TF Analyzer dan watermark Skill Fusion sudah disertakan.

Tidak memublikasikan apa pun secara otomatis.
Tidak memerlukan compiler, API key, atau instalasi program pendamping.

Pustaka: html2canvas 1.4.1, MIT, https://html2canvas.hertzen.com/
Panduan API folder: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access

PERBAIKAN 1.0.2:
Tab kerja dibuka aktif agar kurva dapat dirender. Collector menggulir ke area
grafik dan memicu penyesuaian ukuran sebelum menangkap gambar.
Jangan pindahkan tab analis ke latar belakang selama pengambilan grafik.

PERBAIKAN 1.0.3:
Statistik bulanan membaca kartu .detail-signal / span .custom-month-year.
Tidak lagi menunggu elemen h4 yang hanya dipakai di tampilan tahun lengkap.
Versi plugin kini terlihat pada judul sidebar.

PERBAIKAN 1.0.4:
Panel Growth memakai purple glass transparan dan label lavender.
Untuk membuat ulang hasil lama: nonaktifkan Lewati link yang hasilnya lengkap,
lalu Start kembali. Hasil baru disimpan dalam folder bernomor berikutnya.


Versi 1.0.5 — Quotes Studio
Nav Quotes: Generate quotes orisinal lokal, edit teks, pilih folder, Export PNG 1080x1080. Nama PNG: nomor + lima kata pertama.
Kedua nav membaca ulang count saat Start / Export PNG. Nomor dilanjutkan dari nomor tertinggi; PNG dengan nama isi yang sama dilewati dan tidak ditimpa. Folder dan antrean pengguna dipertahankan.

Versi 1.0.6: seluruh PNG 1080x1440 (3:4). Bank 60 quotes; riwayat generate disimpan di Chrome storage, dibagi lintas kategori dan jendela. Tidak reset saat stok habis. Riwayat sebelum pembaruan tidak tersedia selain draft terakhir. Menghapus data/uninstall menghapus riwayat lokal.

Versi 1.0.7: 240 quotes, termasuk adaptasi referensi pengguna yang diperhalus dan 80 catatan penggunaan analis/sinyal TradersFamily. Bukan pernyataan resmi atau kutipan tokoh TF. Riwayat anti-pengulangan sebelumnya tetap tersimpan.

Versi 1.0.8: deskripsi singkat sesuai format pengguna; tanpa rincian bulanan, score, SL fixed, dan statistik tambahan. Berlaku untuk hasil baru; file hasil lama tidak ditimpa.

Versi 1.0.14: Export Quotes menyimpan pasangan PNG dan TXT bernama sama dalam folder tujuan. TXT berisi quotes, TF Analyzer Analyst × Skill Fusion, akun, dan hashtag. PNG lama dilewati; TXT yang belum ada akan dilengkapi tanpa menimpa file yang sudah terisi.

Versi 1.0.15: export Quotes membuat folder nomor + lima kata pertama; di dalamnya PNG dan TXT bernama sama dengan folder. Count membaca subfolder. Export lama tetap dipertahankan dan dilewati jika sama.

Versi 1.0.16: Mark rentang Start–End pada kedua nav berdasarkan nomor folder. Analis: 07. liar844 Done!; Quotes: 15. Done! Investasikan waktu untuk edukasi sebelum. File dalam folder tetap bernama semula dan tidak berubah. Folder bertanda Done! dilewati saat export/proses berikutnya.

Versi 1.0.17: selector narasi deskripsi TXT Analis: Top Level This Month! (level dinamis), Survived Month (default), Top Oldest Analyst (months dinamis), Top Forex (pair scan). Pilihan disimpan. Selector mengubah narasi, bukan pemeringkatan/urutan antrean. Hasil lama dan folder Done! tetap dilewati.

Versi 1.0.18: kualitas unggah. Render internal 2x lalu downsample ke PNG lossless sRGB opaque 1080x1440, edge boost luminance ringan, kontras teks kecil ditingkatkan, pratinjau Analis PNG tanpa JPEG kualitas rendah, capture grafik DOM scale 2. Kompresi Instagram tetap di sisi platform; tidak ada jaminan bebas kompresi. Upload file asli dari folder hasil. File lama tidak otomatis ditimpa.

Versi 1.0.19: Link Custom dan setiap antrean memakai selector checkbox multi-pair. Pilihan digabung dalam satu filter DOM dan satu set post per link. ALL eksklusif. Pair kosong ditolak; pair tidak tersedia menghasilkan pesan gagal. Hasil filter diverifikasi sebelum scrape. Kombinasi pair yang sama dengan urutan berbeda dianggap duplikat.

Versi 1.0.20: selector pair Link Custom dan antrean menjadi popover overlay di atas konten, lebar menyesuaikan viewport, tidak terpotong scroll antrean. Bisa ditutup dengan Escape atau klik luar; tick/untick tetap aktif.

Versi 1.0.21: nama analis mendapat baris penuh; selector dan remove di baris berikutnya. Teks kecil post diperbesar/dipertebal, pair panjang dibungkus dua baris, teks tidak lagi dipersempit horizontal oleh Canvas maxWidth, teks quotes diperkuat tipis tanpa mengganti font/format. Label grafik lebih kontras. PNG tetap 1080x1440; kompresi akhir Instagram tidak bisa dikendalikan plugin.

Versi 1.0.22: isi nomor kosong di antara urutan yang ada sebelum melanjutkan nomor terbesar. Contoh 18,20,21 menghasilkan 19 lalu 22. Nomor awal mengikuti nomor terkecil yang sudah ada; folder kosong mulai 01. Berlaku Analis, Quotes dan PNG. Done! tetap memakai nomornya dan dilewati. Folder lama tidak diubah nomornya. Count memakai aturan alokasi yang sama.

Versi 1.0.23: Consecutive Loss diperbarui dari Summary DOM setelah filter pair/periode ALL. Losing Month diambil dari Browse DOM dengan pencarian nama dan pencocokan ID analis persis, ALL pair/12 bulan; konteks dicantumkan pada TXT dan sumber dicatat di JSON. Nilai 0/12 valid. Browse dicache per analis selama satu batch. Jika Browse tidak terbaca dan tidak ada data sebelumnya, link gagal dengan alasan agar dapat diulang, bukan mengekspor metadata kosong.

Versi 1.0.24: dithering luminance yang sangat halus pada area gradient untuk mengurangi banding. Teks dan tepi berkontras tinggi dipertahankan. Ukuran tetap 1080x1440 sRGB PNG; kompresi ulang Instagram masih dapat menimbulkan banding.
