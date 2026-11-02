TF Multi-Analyst Scanner v1.18.57 / REV544 + Instagram Post Studio v1.0.24

- Fixed Multi-Link JSON import rejecting its own exported rows with null profitFactor. Optional values stay null; invalid non-null numeric values and foreign URLs remain rejected.
- Errors identify the invalid analyst row.
- Post Studio adds subtle luminance dithering only in smooth image regions to reduce gradient banding after recompression. Purple palette, text layout and 1080x1440 size preserved.
- Post Studio package includes the current Analis/Quotes features, DOM-derived metadata, multi-pair popovers, Done marking and gap-filling numbering.

Validation: locally imported all 113 rows from the user-reported export without loss; CI uses a synthetic export fixture, never the user's JSON. Browser import guard tests, image rendering checks and bounded hue-neutral dithering checks passed.

Reload each extension after updating and export new images. Existing files are not overwritten. Instagram still controls server-side recompression; the change reduces banding risk, not a guarantee of compression-free uploads.
