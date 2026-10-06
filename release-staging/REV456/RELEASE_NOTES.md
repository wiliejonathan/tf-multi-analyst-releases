REV456 / v1.17.69

- Fix waiting forever on a valid dash Consecutive Loss with zero settled losses (SCA25 291, XAUUSD).
- Remove elapsed loading deadlines and transient DOM retry caps. Pause/Stop still cancel immediately.
- Resume waits for cancellation cleanup; background controls cannot overwrite newer runner state.
- Keep diagnostic tabs on errors. STOP only appears while running, with Resume for interrupted cards.
- Preserve completed results and resume unfinished cards without duplicates.

Validation: zero-loss collector and invalid-data tests; three simulated hours of loading; retries and cancellation; 501-card regression; pair selection and responsive progress.
\nLive Chrome validation: resumed at 86/89, passed SCA25 291 with zero losses, reached 89/89 (10 passed, 79 skipped); Submit restored in dashboard/sidebar and sidebar progress hidden. Installed files match tested build.\n