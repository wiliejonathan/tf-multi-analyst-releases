# TF Analyzer Analyst v1.17.06 — REV393

## Latest-Month Drawdown / Consecutive Loss Warnings

Central rule is calculated per **Analyst + Pair** from raw Table 3 history in the newest Closed At month.

- Drawdown only OR Consecutive Loss only → **yellow text + yellow !**
- Drawdown AND Consecutive Loss on the same Analyst+Pair → **red text + red ×**
- Consecutive Loss means at least 2 loss trades in a row in the newest month.
- Drawdown means the newest month ends below its own intramonth cumulative-pips peak.
- Sidebar analyst names use **color only** (yellow/red), without icons.
- Table Users and Management > Details also uses **color only**, without icons.
- Other requested analyst surfaces show the matching warning/critical icon.
- REV392 strict Holding Time Range remains included.

Version: **v1.17.06 / REV393**
