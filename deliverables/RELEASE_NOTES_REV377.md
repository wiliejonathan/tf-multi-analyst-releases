# TF Analyzer Analyst v1.16.90 — REV377 Session Expired Login Fix

Release ini memperbaiki kasus ketika **Update** atau **Submit** sedang berjalan, TradersFamily sudah logout dan halaman channel menampilkan:

`Silahkan login untuk mengakses halaman ini`

Tetapi sidebar plugin masih tertahan pada Dashboard / tombol **Stop!** dan tidak pindah ke form Login.

## Root cause
REV376 sudah memiliki deteksi warning login dan auto-resume, tetapi notifikasi `SESSION_EXPIRED` dari content script masih dibatasi hanya untuk auth-probe tab. Selain itu, selama `tfScanInProgress=true`, state loader sidebar memprioritaskan Dashboard dan bisa membatalkan `tfForceLoginForm` sebelum cleanup scan selesai.

## Perbaikan REV377
- Warning login-required pada channel/scan tab sekarang langsung mengirim event `SESSION_EXPIRED`, bukan hanya pada auth-probe tab.
- Background service worker langsung menyimpan state logout authoritative: Root + Account `logged_out`, `tfForceLoginForm=true`, dan pesan login ulang.
- Background melakukan rebroadcast khusus `tfForceSidebarLoginView` agar side panel yang sedang terbuka langsung pindah ke Login.
- State `SESSION_EXPIRED` sekarang lebih kuat daripada `tfScanInProgress`; walaupun tombol Stop masih terlihat sesaat saat cleanup, sidebar tetap langsung menampilkan form Login.
- Update / Submit yang terputus tetap disimpan sebagai pending resume.
- Setelah login berhasil, action sebelumnya dilanjutkan otomatis.
- Hash integrity seluruh protected file yang berubah diregenerasi.
- Seluruh JavaScript extension menjalani syntax check sebelum release.

## Instalasi
Ekstrak ZIP lalu replace folder extension lama. Buka `chrome://extensions` lalu klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage supaya identity perangkat dan data aktivasi tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV377_SESSION_EXPIRED_LOGIN_FIX.zip`
