# TF Analyzer Analyst v1.16.92 — REV379 DOM Logout Sidebar Login Fix

Release ini memperbaiki kasus ketika **Update** atau **Submit** kehilangan session TradersFamily, tab diarahkan ke halaman login `account.tradersfamily.id/?ret=...`, DOM sudah menampilkan:

`Silahkan login untuk mengakses halaman ini`

namun side panel plugin masih tertahan pada Dashboard / Stop.

## Root cause
REV377 sudah memperbaiki event `SESSION_EXPIRED` pada tab `/channels/*`, tetapi setelah server mengarahkan tab ke halaman account/login, content script channel sudah tidak aktif. Account-wide helper memang terpasang di `account.tradersfamily.id/*`, tetapi masih melakukan early-return untuk halaman account biasa sehingga warning logout pada DOM `/?ret=...` tidak dianggap authoritative.

Selain itu ada bug scope pada helper `tf_forceLoginViewForResume`: variabel pesan `msg` dideklarasikan di dalam satu blok `try` lalu dipakai lagi pada blok berikutnya. Error tersebut tertelan oleh `catch`, sehingga penyimpanan `tfForceLoginForm=true` dapat gagal diam-diam.

## Perbaikan REV379
- Account-wide login helper sekarang mendeteksi warning server yang persis berbunyi `Silahkan login untuk mengakses halaman ini` pada `#modal-notif`, `.alert-time`, `.alert-modal`, `.alert.alert-warning`, dan `.alert-warning`.
- Warning server tersebut dianggap **authoritative logout evidence** pada halaman account normal termasuk `/?ret=...`, bukan hanya auth/probe/logout tab.
- Explicit session-expired warning sekarang lebih kuat daripada scan-protection, sehingga side panel langsung pindah ke Login walaupun cleanup Stop masih berjalan.
- Proteksi stale account tab tetap dipertahankan untuk evidence yang ambigu; hanya warning server eksplisit yang bypass proteksi tersebut.
- Scope variabel pesan pada `tf_forceLoginViewForResume` diperbaiki supaya state `tfForceLoginForm`, Root/Account `logged_out`, dan `tfLoginError` selalu tersimpan.
- Pending Update/Submit tetap disimpan dan dapat dilanjutkan otomatis setelah login berhasil.
- Integrity hash semua protected file yang berubah diregenerasi dan diverifikasi terhadap byte final ZIP.
- Seluruh JavaScript extension menjalani `node --check` sebelum release.

## Instalasi
Ekstrak ZIP lalu replace folder extension lama. Buka `chrome://extensions` lalu klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage supaya identity perangkat dan data aktivasi tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV379_DOM_LOGOUT_SIDEBAR_LOGIN_FIX.zip`
