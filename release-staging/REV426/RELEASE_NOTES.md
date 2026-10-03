REV426 / v1.17.39

Perbaikan respons DOM kosong pada History Signal yang sebelumnya menyebabkan Cannot read properties of null (reading unavailable). Collector kini mengembalikan hasil atau pesan exception terstruktur; runner memvalidasi struktur dan mencoba lagi maksimal tiga kali untuk hasil kosong/transien. Kegagalan tidak dianggap lolos/skip dan cursor tetap pada card yang belum selesai.

Validasi: History tuan69 rentang 3 April–1 Juli terbaca melalui browser; unit test null/malformed/exception/retry serta Stop/Pause/Resume dan 501 card lolos. Full run extension terpasang belum diuji end-to-end.

Update extension dan buka ulang Dashboard; gunakan Resume untuk mengulang card yang gagal tanpa menghapus hasil sebelumnya.
