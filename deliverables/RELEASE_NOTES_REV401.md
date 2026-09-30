# TF Analyzer Analyst v1.17.14 — REV401

## JSON Import Remembered Links Restore Fix

- Memperbaiki Import JSON ketika `tfRememberedAnalystLinks` ada tetapi berupa array kosong `[]`.
- Jika `tfAnalystSources` berisi analis/link valid, Import otomatis membangun ulang Remembered Analyst Links.
- `tfRememberLinksEnabled` otomatis kembali aktif setelah link berhasil dipulihkan.
- Multi-file Combine juga melakukan recovery yang sama.
- Data History, Monthly, Score, Holding Period, warna analis, dan seluruh fix REV400 tetap dipertahankan.
- Import JSON invalid/kosong tetap tidak boleh menimpa data lama.

Version: **v1.17.14 / REV401**
