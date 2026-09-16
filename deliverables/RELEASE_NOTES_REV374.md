# TF Analyzer Analyst v1.16.87 — REV374 Integrity Hash Fix

Release ini memperbaiki error **FILE PLUGIN TIDAK VALID** yang muncul pada build REV373, terutama untuk `assets/tf-device-background.js`.

## Root cause
REV373 mengubah runtime aktivasi pada file yang dilindungi, tetapi registry SHA-256 pada integrity loader masih berakhir pada hash lama untuk beberapa file. Akibatnya file resmi hasil release sendiri dianggap telah berubah.

File yang terdampak:
- `assets/tf-device-background.js`
- `assets/tf-device-lock.js`
- `manifest.json`

## Perbaikan REV374
- Regenerate SHA-256 final untuk seluruh file protected yang berubah pada REV373.
- Mempertahankan seluruh perbaikan activation recovery REV373.
- Version bump ke `1.16.87` / `REV374`.
- Integrity loader tetap tidak melakukan self-hash untuk menghindari recursive hash.
- Build pipeline memverifikasi seluruh registry protected file terhadap byte final ZIP sebelum release dibuat.
- JavaScript syntax check dijalankan terhadap seluruh `assets/*.js` setelah ZIP selesai dibangun.

## Instalasi
Ekstrak ZIP lalu replace folder extension yang digunakan. Buka `chrome://extensions` dan klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage agar identity perangkat yang sudah aktif tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV374_INTEGRITY_HASH_FIX.zip`
