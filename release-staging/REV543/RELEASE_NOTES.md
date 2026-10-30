REV543 / v1.18.56

- Multi-link Browse Find validates site errors and waits for the filter dialog to close before collecting results. Default Max Loss with empty Avg Profit uses an explicit minimum of 0 pips.
- Multi-link scan progress includes a persistent elapsed timer in sidebar/dashboard; Pause time is excluded. Compact stored inventory totals are shown correctly.
- Both indicator pages show a subscription/data prerequisite warning. Submit explains missing Entry/TP/SL and requests a new history scan; prices are never invented.
- Pine history uses lossless compact numeric encoding, bounded dispatch functions and explicit float scale literals. Oversized exports request a shorter range rather than silently dropping trades.
- Cancelled labels are green for Buy and red for Sell in MT4, MT5 and TradingView. Cancelled boxes remain grey. Native compiler 2.30 embeds the updated common MT4/MT5 template.

Validation: exact roundtrip of all numeric fields, generated-source checks, browser regression tests, and successful local EX4/EX5 compilation with synthetic Buy/Sell cancellation data. Pine compilation is not automatically verified in TradingView.

Reload the Chrome extension and regenerate existing indicators. Other PCs using EX4/EX5 should update the bundled local compiler to 2.30.
TradingView drawing limits and viewport rendering remain unchanged: this release does not claim to display unlimited risk/reward boxes simultaneously.
