REV442 v1.17.55

- Fixes an observer feedback loop between the version-update block and its new progress-bar sibling that could freeze or blank the sidebar.
- Update UI now recognizes the intentional progress sibling and reuses the existing version block.
- Adds an integration test using the real update UI and progress scripts together: stable block count, settled mutations, responsive manual refresh, progress updates and no page errors.
- Retains ALL rescan Stop control, 6px progress, month refresh and prior asynchronous alarm handling.
