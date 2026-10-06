REV457 / v1.17.70

- Automatically retry interrupted card/DOM/network operations without repeated manual Resume.
- Store full History evidence per analyst and inventory separately; progress updates no longer clone all raw signal history.
- Restore running scans automatically after dashboard reload/closure or browser startup; explicit Pause and Stop stay respected.
- Prevent Chrome automatic tab discard for the runner and scan tab.
- Preserve cursor, completed results, portable JSON export, and duplicate-free retry boundaries.

Validation: 10,000 analysts and 120,000 simulated signals with frame failures; 501-card regression; Pause/Stop; watchdog lock checks; evidence export; pair selection and sidebar progress. No claim of 10,000 live-site analysts tested.
