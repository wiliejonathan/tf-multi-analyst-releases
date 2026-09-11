# TF Analyzer Analyst V1.16.85

## REV371 — PC Restart Activation Auto-Recovery

Release ini memperbaiki kondisi ketika setelah restart Windows/PC/Chrome, Plugin PC pada build yang sama terasa sulit diaktivasi kembali atau kembali meminta proses Device Lock walaupun akun terlihat ONLINE di Google Sheet.

### Root cause
`ONLINE_STATUS PC` di Google Sheet adalah indikator presence/lookup dari UI Desktop. Status hijau tersebut tidak sama dengan bukti bahwa Device Lock session dan signature Device Vault sudah selesai diverifikasi. Setelah cold restart, UI dapat lebih dulu mengirim presence sementara session token, Device Vault page, atau network masih dalam proses recovery.

### Perbaikan REV371
- Build yang sudah berhasil diaktivasi tidak meminta Email + Token ulang hanya karena restart PC/Chrome.
- Jika credential local belum siap, build yang sama mencoba recovery dari stable TF Device Vault.
- Session Desktop yang hilang/expired melakukan same-device renewal otomatis memakai Device Vault identity yang sama.
- Cold-start Device Vault/server melakukan retry otomatis 1.2s → 3s → 6.5s.
- Error sementara tidak menghapus receipt aktivasi, credential, atau recovery identity.
- Setelah retry habis, validasi perangkat terakhir yang masih berada dalam offline grace dapat dipakai sementara sesuai kebijakan Device Lock yang sudah ada.
- Lisensi expired, blocked, inactive, revoked, atau benar-benar tidak valid tetap ditolak.
- Build/version baru tetap meminta aktivasi manual satu kali sesuai REV363.

### Existing fixes retained
- REV370 Update Button Preflight Handler Fix.
- REV369 Refresh Activation Persistence Fix.
- REV368 Strict Update Login Preflight.
- REV367 Low-Usage Realtime Remote & Exact Expiry.
- Scanner, Dashboard, Remote, Device Lock, iSignal, Import/Export, Table 1-4, Equity Curve tetap dipertahankan.

**Build:** v1.16.85 • REV371

**Asset:** `TF_Extension_PC_MAC_REV371_PC_RESTART_ACTIVATION_AUTO_RECOVERY.zip`
