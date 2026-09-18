# TF Analyzer Analyst v1.16.93 — REV380

## Mobile Calculation Parity

REV380 tidak mengubah formula trading Desktop. Perbaikan ada pada data bundle PC → Mobile.

- Export/Remote bundle sekarang menyertakan `tfMyfxbookPrices` dan `tfMyfxbookPricesAt`.
- Android/iOS/Browser dapat memakai snapshot harga yang sama dengan Plugin PC untuk menghitung $/pip.
- Ini menjaga konsistensi lanjutan pada Lot Size, PnL ($), PnL %, balance/compound dan equity.
- Semua protected integrity hash diregenerasi dan diverifikasi pada build.
- Baseline: REV379 v1.16.92; fix login/logout REV379 tetap dipertahankan.

Asset: `TF_Extension_PC_MAC_REV380_MOBILE_CALC_PARITY.zip`
