REV492 / v1.18.05

- Separate rounded outlines for each sidebar filter, keeping toggle, inputs and notes together.
- Scan summary values green for active filters and red for disabled/unrestricted filters; dependent fields follow the rule used by the scan.
- Multi-Link Dashboard dimensions reduced 10 percent: fonts, cards, buttons, spacing and table columns. Explicit CSS sizes, no zoom or transform scaling.
- Preserve saved filters and previous scanning rules.

Validation: native sidebar has 26 separate non-nested filter groups; actual 38-result scan fixture renders all summary colors; browser CSS zoom remains 1; syntax and release regression checks.
