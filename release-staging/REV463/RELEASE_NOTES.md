REV463 / v1.17.76

- Fix Summary deadlock when TF displays a dash for Consecutive Loss with isolated losing trades (e.g. PARIWISATRADE: Loss/Settled 1/3).
- Retry unresponsive DOM panels automatically after 180 seconds without ending the scan or skipping the analyst. No total scan time limit.
- Preserve all completed results and resume the unfinished card.

Validation: real Summary inspection, browser collector regressions for absent streaks, numeric streak and incomplete panel; existing lifecycle, recovery, large inventory, exports and five-row table checks.
