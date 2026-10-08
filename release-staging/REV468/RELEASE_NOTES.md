REV468 / v1.17.81

- Scan Ulang ALL Data Analis now uses the same compact analyst picker as Update: default Tick ALL, Submit then Cancel / Confirm.
- Confirm scans only selected analysts and saved pairs with timeframe ALL. Stop remains available during scan.
- Original imported JSON and saved analyst list remain untouched by selection.

Validation: actual rescan UI with mocked background verifies confirmation, selective full-ALL payload, preserved pairs/import and Stop mode; existing Update and scanner regressions.
