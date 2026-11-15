# KK 8 alignment triage — provisional, not approved

This audit compares the current positioned Manglish fragments in `song-8/index.html` with their horizontal anchor gaps. It is **not** a browser-rendered text-width test and is **not** a Malayalam glyph-group alignment check.

The current 12px medium-weight font has several potentially colliding adjacent fragments (rough approximation of 6.5px per Latin character). These must be verified using the actual `?qa=1` browser report and the original Malayalam glyph boxes before anchors are moved.

| Stanza | Potentially colliding adjacent pairs (by musical row) |
|---|---|
| 1 | row 2: nu / paark, vaa / Aash; row 3: dey / paark |
| 2 | row 1: Bhoo / sant, sant / hos; row 3: dey / paark |
| 3 | row 2: keezh / soukh |
| 4 | row 3: raks / hichc, dey / paark |
| 5 | row 1: thaat / haa; row 3: Sant / hos, sant / haa |
| 6 | row 3: nin? / Mrith, mulh / poy,, ja / yam:, dey / paark |
| 7 | row 2: yum / Bhoo; row 3: haa / Bhaag, dey / paark |

## Gate to close

1. Execute `song-8/index.html?qa=1` in a real browser and capture the seven-stanza collision and out-of-band report.
2. Compare each suspect fragment against the original Malayalam glyph-group ink boxes; do not simply spread syllables evenly or change the spelling.
3. Correct anchors with independent measurements per row. Preserve consistent font and baseline.
4. Render and visually inspect the complete score for every stanza at desktop and mobile widths.
5. Record exact pass/fail evidence before requesting user approval.

**Status: blocked on live-browser measurement and manual glyph mapping. No alignment QA pass claimed.**
