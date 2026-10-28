REV536 / v1.18.49

Includes all REV535 fixes:
- Progress bar and timer appear only during an active unfinished batch scan.
- Survived Month and Not Survived Month selections lock the same month in the opposite filter. Core validation rejects conflicting selections.
- Scan From iSignal includes active and inactive subscriptions, reads both symbol-label variants, and requires manual confirmation for missing pairs. Cancel preserves the previous analyst list.
- MT4/MT5 and TradingView pages place the shared footer after their content and tutorials.
- Analyst status names remain white below three distinct months of valid trade history. The dashboard popup explains this state.

Final regression fix: analyst-name coloring now visits only top-level analyst rows in the drawdown table. It does not recolor nested profit/loss detail metrics. Loss figures remain red and profit figures green, including after the new white-history rule is applied.
