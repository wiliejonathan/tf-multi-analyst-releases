# TF Analyzer Analyst V1.16.82

Release ini menggabungkan perubahan yang belum dirilis setelah V1.16.80, yaitu REV367 dan REV368.

## REV367 — Low-Usage Realtime Remote & Exact Expiry
- WebSocket Desktop tetap realtime, tetapi heartbeat aplikasi dikurangi dari 1 detik menjadi 30 detik.
- License safety validation menjadi 60 detik.
- Natural expiry tetap ditegakkan tepat waktu berdasarkan `expiresAt` / exact expiry alarm, jadi tidak perlu menunggu interval safety check.
- HTTP fallback menggunakan backoff 3s → 5s → 10s → 30s saat Fast Lane bermasalah.
- Flow realtime Cloudflare dibuat lebih hibernation-friendly untuk menekan penggunaan Worker/Durable Object.
- Gangguan network sementara tidak dianggap sebagai revoke/expired.

## REV368 — Strict TradersFamily Login Preflight Before Update
- Tombol **Update** tidak lagi mempercayai tampilan/DOM tab TradersFamily lama sebagai bukti login.
- Setiap klik Update melakukan authenticated `no-store` request ke area TradersFamily yang dilindungi sebelum scan dimulai.
- Jika session server sebenarnya sudah logout/expired, Update dibatalkan sebelum scanner berjalan.
- State login/profile stale di Plugin dibersihkan dan UI dikembalikan ke halaman Login.
- Tab TradersFamily lama direload dengan bypass cache supaya tampilannya mengikuti session server terbaru.
- Jika login tidak dapat diverifikasi karena network/error, Update diblok agar tidak gagal di tengah proses.
- Perintah Update dari Mobile/Remote memakai preflight yang sama.
- Remote akan menerima `TRADERSFAMILY_LOGIN_REQUIRED` jika session PC sudah logout.

## Retained
- Table 2 hover-free + centered Refresh.
- Smooth Dashboard scrolling.
- Percentage-based Equity Curve axis.
- Table 2 sticky divider + compact Pair.
- Table 3 compact width.
- Table 1 Risk stepper.
- Device Lock, scanner, Import/Export, iSignal, Remote, dan aktivasi per build tetap dipertahankan.

**Build:** v1.16.82 • REV368

**Asset:** `TF_Extension_PC_MAC_REV368_STRICT_UPDATE_LOGIN_PREFLIGHT.zip`
