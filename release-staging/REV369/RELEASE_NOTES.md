# TF Analyzer Analyst V1.16.83

## REV369 — Refresh Activation Persistence Fix

Release ini memperbaiki masalah ketika tombol **Refresh / Reset** dapat membuat `dashboard.html` meminta **Email + Token Aktivasi** lagi walaupun build yang sama sebelumnya sudah berhasil diaktivasi.

### Perbaikan utama
- Refresh / Reset sekarang **tidak menghapus receipt aktivasi per-build** (`tfManualBuildActivationV1`).
- Setelah aktivasi berhasil sekali pada build yang sama, reload `dashboard.html`, buka/tutup Dashboard, dan Refresh / Reset tidak meminta kode aktivasi lagi.
- Sistem **manual activation once per new Load unpacked build** tetap dipertahankan. Jadi build baru tetap meminta Email + Token satu kali sesuai desain REV363.
- Explicit Clear/Change License, license expired, blocked, revoked, atau invalid tetap dapat mengembalikan user ke halaman Aktivasi.

### Mobile verification
Android production REV352 dan iOS/Browser REV368 sudah menyimpan remembered activation key di luar proses cleanup normal. Tidak ditemukan bug local-refresh yang sama pada kedua platform tersebut, sehingga tidak perlu memaksakan APK baru dengan signing key berbeda. Remote Refresh dari Mobile tetap aman setelah Plugin PC menggunakan REV369.

### Existing fixes retained
- REV368 Strict Update Login Preflight.
- REV367 Low-Usage Realtime Remote + Exact Expiry.
- REV366 Table 2 Hover-Free Smoothness.
- Seluruh Scanner, Dashboard, Remote, Device Lock, iSignal, Import/Export, Table 1-4, dan Equity Curve tetap dipertahankan.

Build: **v1.16.83 • REV369**

Asset: `TF_Extension_PC_MAC_REV369_REFRESH_ACTIVATION_PERSISTENCE_FIX.zip`
