REV456 / v1.17.69

- Fix waiting forever on a valid dash Consecutive Loss with zero settled losses (SCA25 291, XAUUSD).
- Remove elapsed loading deadlines and transient DOM retry caps. Pause/Stop still cancel immediately.
- Resume waits for cancellation cleanup; background controls cannot overwrite newer runner state.
- Keep diagnostic tabs on errors. STOP only appears while running, with Resume for interrupted cards.
- Preserve completed results and resume unfinished cards without duplicates.

Validation: zero-loss collector and invalid-data tests; three simulated hours of loading; retries and cancellation; 501-card regression; pair selection and responsive progress.
\nRename evidence download button to Export JSON. Live Chrome: Resume from 86/89 completed 89/89 (10 passed, 79 skipped); no duplicates; Submit restored and sidebar progress hidden.\n