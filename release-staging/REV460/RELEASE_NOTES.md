REV460 / v1.17.73

- Derive TF maximum Losing Month from the largest checked accepted value. Selecting 2 submits 2; 2 and 5 submits 5; 0 through 12 submits 12.
- Apply the synchronized limit in validation, resumed inventory scans and the DOM collector, including stale saved maximum=0.
- Show the derived maximum as a read-only field in the sidebar. Exact accepted values still use OR.
- Existing completed scans are preserved; start a new scan to enumerate cards previously excluded by the stale maximum.

Validation: browser DOM inventory Submit for [2], [2,5], [0..12], [0]; exact OR filters, sidebar regressions, exports and 501-card scan regression.
