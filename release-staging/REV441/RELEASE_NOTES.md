REV441 v1.17.54

- Handles asynchronous alarm creation/removal failures in background startup and license/device watchdogs.
- Retries transient No SW failures twice with a bounded delay; records final failures for diagnosis rather than leaving unhandled promise rejections.
- Preserves existing licensing checks, ALL rescan Stop control, compact progress and month refresh.
- Tested transient and persistent No SW failures, retry bounds, diagnostics, startup load order and rescan/progress regressions.
