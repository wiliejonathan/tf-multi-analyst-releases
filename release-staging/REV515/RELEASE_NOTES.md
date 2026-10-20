REV515 / v1.18.28

Fixes the Chrome extension error "Permissions policy violation: unload is not allowed in this document" from the account login helper. Removes its redundant unload listener; the existing pagehide listener still performs account timer/observer cleanup. Login, logout, profile capture and scan rules are unchanged.

Validated by executing the actual login helper on a fixture served with Permissions-Policy: unload=(). No unload registration or policy warning occurs, and pagehide cancels all scheduled account probes. All REV514 dashboard/report features are retained.

After reloading the extension, reload existing TradersFamily account tabs to replace their old injected helper. Chrome may retain historical entries: clear the old entries once using Clear all on the extension Errors page.
