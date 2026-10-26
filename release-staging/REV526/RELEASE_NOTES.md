REV526 / v1.18.39

- Add the existing vertical navigation divider between Profile and Created MT4/MT5 Indicator.
- Match all indicator selectors, option lists, focus rings and progress bar to the dashboard dark palette.
- Name actual downloads dd-mm-yyyy Analyst_Name.ex4 / .ex5 using the current WIB date and a safe analyst filename.
- Prevent missing candle history from snapping trades onto the nearest available candle. Require actual Entry and Closed candle intervals; unavailable chart periods remain included in performance totals and are reported as Missing candles in the indicator panel.
- Redraw when candle history grows. Measure TP/SL/Cancelled labels with the real font and Windows display scale, use their actual bounding rectangles, and retain tooltip details when nearby space is full.
- Native compiler template 2.26 is included; old compiler versions are detected before download. Existing EX4/EX5 files must be regenerated to adopt these changes.
- Verified real broker M30 history gaps, MT4/MT5 compilation, compiler input validation, divider, dark selectors, responsive form and both actual browser download filenames.
