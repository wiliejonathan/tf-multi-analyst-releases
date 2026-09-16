# TF Analyzer Analyst v1.16.91 — REV378 Pair Selector Label Fix

Release ini hanya mengubah tampilan label selector Pair pada sidebar.

## Perubahan REV378
- Prefix `Pair:` dihapus dari selector Scan Channel.
- Jika `ALL` dipilih, selector menampilkan `ALL`.
- Jika hanya 1 pair dipilih, selector menampilkan nama pair langsung, misalnya `XAUUSD`.
- Jika 2 pair dipilih, selector menampilkan `2 Pairs`.
- Jika 3 pair dipilih, selector menampilkan `3 Pairs`, dan seterusnya.
- Desain dibuat konsisten dengan selector pair pada row analis di bawahnya.
- Fungsi pemilihan pair, penyimpanan, scan, Update, Submit, login/session recovery, dan fungsi lain tidak diubah.
- Hash integrity protected files diregenerasi.
- Seluruh JavaScript extension divalidasi sebelum release.

## Instalasi
Ekstrak ZIP lalu replace folder extension lama. Buka `chrome://extensions` dan klik **Reload**. Jangan Remove extension dan jangan hapus Device Vault/storage agar identity perangkat dan data aktivasi tetap dipertahankan.

**Asset:** `TF_Extension_PC_MAC_REV378_PAIR_SELECTOR_LABEL_FIX.zip`
