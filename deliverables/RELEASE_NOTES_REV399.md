# TF Analyzer Analyst v1.17.12 — REV399

## JSON Import / Combine Fix

- Parser JSON sekarang menangani UTF-8 BOM, padding NUL, dan satu lapis JSON yang ter-double-encode.
- Export resmi dan raw canonical storage tetap diterima.
- Setiap file pada Import / Combine divalidasi sebelum data diterapkan.
- JSON yang tidak dikenali atau kosong tidak boleh menimpa data lama dengan array/object kosong.
- Pesan error menyebut file yang bermasalah.
- Remote Import juga mendapat preflight yang sama karena memakai `tf_importPayloadToStorage`.
- Semua perbaikan REV392–REV398 tetap dipertahankan.

Version: **v1.17.12 / REV399**
