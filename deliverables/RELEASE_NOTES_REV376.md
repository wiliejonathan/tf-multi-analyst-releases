# TF Analyzer Analyst v1.16.89 — REV376 Login Required Auto Resume

Release ini memperbaiki alur **Update** dan **Submit** ketika TradersFamily mengembalikan warning:

`Silahkan login untuk mengakses halaman ini`

## Perbaikan REV376
- Warning login pada `.alert-time`, `.alert-modal`, dan `.alert-warning` dideteksi langsung, termasuk jika muncul dinamis setelah halaman sudah terbuka.
- Response HTML hasil `fetch()` juga diperiksa untuk warning login yang sama.
- Tombol **Update** melakukan fresh-login preflight sebelum scan.
- Tombol **Submit** utama dan Submit hasil iSignal juga melakukan fresh-login preflight sebelum scan.
- Jika session berakhir ketika Update/Submit sedang berjalan, proses scan dihentikan secara aman dan sidebar otomatis diarahkan ke halaman Login.
- Action yang terputus disimpan sebagai pending resume di `chrome.storage.local`.
- Setelah Login + User Profile TradersFamily tervalidasi, **Update/Submit dilanjutkan otomatis** tanpa perlu klik ulang.
- Pending resume tetap tersedia bila side panel sempat tertutup dan kedaluwarsa otomatis setelah 15 menit.
- Hash integrity protected files diregenerasi setelah perubahan runtime.
- Seluruh JavaScript extension melewati syntax check sebelum release.

## Instalasi
Ekstrak ZIP lalu replace folder extension lama. Buka `chrome://extensions` dan klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage supaya identity perangkat tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV376_LOGIN_REQUIRED_AUTO_RESUME.zip`
