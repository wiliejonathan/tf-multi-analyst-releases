REV443 v1.17.56

- ALL rescan button derives Stop from live background batch state rather than a persisted flag.
- Repairs stale ALL rescan busy/progress state after worker restart; restores Scan Ulang ALL Data Analis label.
- Other active scan modes keep rescan unavailable without relabeling it Stop.
- Verified stale state recovery, active own/other scans, rescan controls and stable version/progress integration.
