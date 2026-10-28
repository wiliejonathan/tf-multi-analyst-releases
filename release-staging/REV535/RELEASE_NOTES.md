REV535 / v1.18.48

- Hide the batch progress panel and elapsed timer when no batch is running, including completed, stopped, paused and error states restored from storage.
- Keep progress and timer visible only for a running batch with unfinished analysts. Stop timer updates when the panel is hidden.
- Lock a selected month in the opposite Survived/Not Survived filter immediately; reject conflicting backend configurations and resolve old overlaps deterministically.
- Include active and inactive iSignal subscriptions. Read Symbol diintegrasi and Symbol terintegrasi. Missing pairs require per-analyst manual confirmation; Cancel preserves previous rows, with no silent ALL fallback.
- Insert MT4/MT5 and TradingView builder content before the shared footer, keeping copyright links beneath the page and tutorials.
- Show analyst status names in white until at least three distinct months of valid trade history are available; explain the white state in the main dashboard popup. No financial risk calculations are changed.
- Preserve all REV534 login, loss color and report height fixes. No scanning or financial calculation changes.
