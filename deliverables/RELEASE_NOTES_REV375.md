# TF Analyzer Analyst v1.16.88 — REV375 Activation Timeout Recovery

Release ini memperbaiki kasus aktivasi berhenti pada **[APPS_SCRIPT_TIMEOUT] Apps Script timeout** walaupun lisensi valid.

## Root cause
Alur aktivasi REV374 melakukan pengecekan lisensi dua kali berurutan: `/license-check` lalu `/device-challenge`. Keduanya kembali membaca Apps Script. Saat Apps Script cold-start/lambat, panggilan kedua bisa timeout dan UI kembali ke form aktivasi walaupun Email + Token benar.

## Perbaikan REV375
- Menghapus lookup ganda pada jalur aktivasi normal. `/device-challenge` menjadi validasi utama.
- `/license-check` tambahan hanya dipakai sebagai diagnostic fallback untuk kasus `LICENSE_NOT_FOUND`.
- `APPS_SCRIPT_TIMEOUT` dan error server/network sementara pada aktivasi manual sekarang retry otomatis sampai 4 tahap: 1.2s → 3s → 6.5s → 12s.
- Email dan Token tetap tersimpan selama retry; user tidak perlu input ulang.
- Timeout sementara pada binding juga retry otomatis.
- Timeout pada validasi session diarahkan ke offline-grace yang sudah tervalidasi sebelumnya, bukan langsung mengunci plugin.
- Pesan error timeout dibuat lebih jelas.
- Hash integrity protected files diregenerasi setelah perubahan runtime.
- Seluruh file JavaScript divalidasi syntax sebelum release.

## Instalasi
Ekstrak ZIP lalu replace folder extension lama. Buka `chrome://extensions` lalu klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage agar identity perangkat lama tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV375_ACTIVATION_TIMEOUT_RECOVERY.zip`
