REV444 v1.17.57

- Completed ALL rescans replace the active history and monthly data only for the selected analyst/pair. Repeated rescans do not accumulate stale or duplicate signals.
- Partial scan batches continue merging until the final successful pair result replaces its working dataset; other analysts/pairs remain unchanged.
- New Import/Combine operations archive exact source JSON text separately before normalization. Original files on disk are never modified. Existing imports cannot retroactively recover their exact source text; reimport is required to populate this new archive.
- Tested replacement, repeated scans, partial/empty completed results, unaffected data/import metadata, and preservation of exact original whitespace and line endings.
