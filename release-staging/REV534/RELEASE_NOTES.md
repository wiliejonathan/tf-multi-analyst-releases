REV534 / v1.18.47

- Loss/drawdown detail metrics stay red even inside a healthy analyst's green parent cell. Profit remains green. No calculation changes.
- An active manual login flow no longer treats the expected login form/navbar or initial login-required warning as an expired session while the user is confirming Google OAuth. Explicit logout remains authoritative; flow protection ends on completion/cancel and expires after ten minutes. No login-success or license checks are bypassed.
- Show elapsed batch scan duration beside the progress note, using shared job start timestamps. Freeze the final duration on finish/stop and stop interval updates in hidden sidebars.
- Embedded Kalender & Jam Trading follows native details expansion and content-height changes, so the methodology explanation is not clipped.
