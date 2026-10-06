REV454 / v1.17.67

- Restore the visible per-card progress bar directly below Back To Main Dashboard, including inventory loading and Pause. Hide it on Stop, completion, reset, or error.
- Embed progress styling with the native sidebar so license bootstrap cannot remove the required styles.
- Show saved scan filters in two readable Filter / Nilai tables above Catatan pemeriksaan. Empty score selections show Tidak difilter, disabled stages show OFF, and months use Indonesian names.
- Show the filters stored with each scan, rather than newer sidebar edits. Stack the tables on narrow screens.
- Correct the Multi-Link dashboard revision label and malformed newline in popup markup.

Validation: browser tests for visible bar geometry, 20% per-card progress, loading, Pause, terminal states, saved filter text, desktop/mobile table layout, and no browser errors. Live Chrome verification completed before publication.
