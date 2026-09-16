# REV373 — Perbaikan aktivasi PC/Mac (v1.16.86)

- Respons tanpa Request ID tidak lagi dianggap kedaluwarsa setelah 20 detik.
- Waktu tunggu menggunakan waktu permintaan asli, termasuk setelah halaman dibuka ulang.
- Dashboard dan sidebar menjalankan aktivasi secara bergiliran agar tidak saling membuat session baru.
- Binding tanpa reload dilanjutkan ke validasi session.
- Request ID harus berasal dari hasil binding, bukan ID challenge sebagai tebakan.
- Notifikasi approval tidak dihapus hanya karena respons server tidak lengkap.
- Batas waktu koneksi aktivasi disesuaikan dengan retry Apps Script di Worker.
- Alur penolakan, lisensi blocked/expired, signature dan persetujuan perangkat tetap berlaku.

## Pemasangan
Ekstrak ZIP ke folder extension yang sudah digunakan, lalu buka chrome://extensions dan klik Reload. Jangan Remove extension atau hapus data Chrome/Device Vault. Kebijakan aktivasi manual sekali untuk build baru tetap dipertahankan.

## Worker — pemasangan manual oleh owner
File lengkap Cloudflare_Device_API_REV373_ACTIVATION_FIX.js berbasis sumber REV367 yang tersedia. Salin seluruh isinya ke Worker tf-license-device-api lalu Deploy; pertahankan environment variables dan bindings yang sudah ada. Jangan pasang pada Worker pembayaran atau gateway notifikasi.
Perbaikan Worker memeriksa hasil penyimpanan pending/session dan menjaga identitas request saat waktu habis. Worker ini belum dipasang otomatis. Jika produksi sudah memiliki perubahan setelah REV367 yang belum ada dalam file sumber tersebut, gabungkan perubahan itu terlebih dahulu.

## Validasi
18 uji regresi simulasi lulus; pemeriksaan sintaks 21 file JavaScript extension lulus. Uji mencakup server lambat/kosong, pending setelah reopen, dua halaman, binding, invalid signature, penolakan, blocked license dan receipt penyimpanan.
Belum diuji end-to-end menggunakan lisensi klien di Chrome Windows/Mac. Deployment Apps Script aktif belum diubah karena sesi editor belum login. Source Apps Script yang diperiksa sudah menyediakan field pending yang diperlukan.
