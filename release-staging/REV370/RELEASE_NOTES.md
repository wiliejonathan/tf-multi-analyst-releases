# TF Analyzer Analyst V1.16.84

## REV370 — Update Button Preflight Handler Fix

Release ini memperbaiki tombol **Update** yang pada REV369 dapat tidak menjalankan proses meskipun tombol sudah diklik.

### Root cause
- Pemeriksaan login fresh dari REV368 mengirim pesan `tf_verify_login_before_update_strict`.
- Handler pesan tersebut sebelumnya tertempat di helper progress History, bukan pada listener `chrome.runtime.onMessage` yang benar.
- Karena itu Side Panel dapat menunggu preflight tanpa mendapat respons dan Update tidak pernah dimulai.

### Perbaikan REV370
- Handler strict login preflight dipindahkan ke service-worker runtime listener yang benar.
- `sender` dan `sendResponse` sekarang berada pada scope yang valid.
- Setelah login TradersFamily terkonfirmasi valid, tombol Update langsung melanjutkan batch Update seperti semestinya.
- Fresh authenticated fetch diberi timeout 12 detik agar tidak menggantung tanpa batas saat network bermasalah.
- Side Panel memiliki fail-safe timeout 50 detik sehingga tombol Update tidak dapat terkunci permanen jika runtime reply hilang.
- Jika session TradersFamily memang logout, Update tetap dibatalkan dan user diminta login kembali.

### Existing fixes retained
- REV369 Refresh Activation Persistence Fix.
- REV368 Strict Update Login Preflight.
- REV367 Low-Usage Realtime Remote & Exact Expiry.
- Table 2 hover-free, Dashboard smooth scroll, Equity axis, Device Lock, Scanner, iSignal, Import/Export, dan Table 1-4 tetap dipertahankan.

**Build:** v1.16.84 • REV370

**Asset:** `TF_Extension_PC_MAC_REV370_UPDATE_BUTTON_PREFLIGHT_HANDLER_FIX.zip`
