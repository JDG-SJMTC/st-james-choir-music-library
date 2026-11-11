# Interactive score conversion pipeline (beta only)

## Approved reference implementations
- KK 30: `../song-30/index.html`
- KK 150: `../song-150/index.html`

These are reference outputs, not proof that all layouts can be converted without manual measurement. Never alter them while developing a new song.

## Non-negotiable rendering contract
1. **One integrated score** in the existing Choir View, not a second preview or a separate lyrics panel.
2. Preserve all musical notation and original Malayalam lyric glyphs from the source score; original Malayalam remains visible when Manglish is selected.
3. Remove standalone printed stanza blocks **only from the interactive presentation**, never from the original asset.
4. Insert whitespace immediately beneath each Malayalam lyric row **within its musical system**. Move lower staff/notation down as a group, not just the following musical system. Preserve musical staff boundaries.
5. Render only the selected stanza's Manglish in the inserted bands; respect exact source spelling, punctuation, and stanza line boundaries.
6. Centre syllables on the **measured Malayalam glyph-group ink boxes**, not on generic note positions or an equal-count array. Each row measured independently. Small offsets are acceptable; gross phrase assignment is not.
7. Use consistent blue text, size, weight and baseline; do not cover the score with white overlay rectangles.
8. Retain existing stanza navigation and zoom; no audio prerequisite.

## Required gates
**Gate A — source integrity:** original image retained byte-for-byte; all printed notation and Malayalam above inserted bands preserved; staff-system order unchanged.

**Gate B — lyric fidelity:** approved stanza text round-trips exactly; no missing, duplicated or altered fragments. Compare Unicode strings without normalising away diacritics.

**Gate C — geometry:** independently measure staff bounds, Malayalam row boxes, each band, and glyph-group anchors; check that text doesn't overlap score or other text and no content is clipped. Test full-page at normal and mobile zoom.

**Gate D — review:** compare rendered complete page to the source for every stanza and inspect any flagged exceptions. Record a pass/fail for each gate; never call it approved on code inspection alone.

## Current status
- KK 30 and KK 150: user-approved visual references; regression checks should ensure they remain unchanged.
- KK 8: **NOT APPROVED**. Its current sliced-image renderer violates the integrated SVG contract, and prior screenshots show staff/lyric spacing failures. Do not claim it passes until rebuilt and visually checked.
- `score-qa.html`: browser structural preflight only. It is not an image-comparison or Malayalam alignment validator and has not yet been used to sign off KK 8.

## Rollout
Build a common SVG score compositor with measured per-song geometry. Convert KK 8 first; verify all seven stanzas. Then trial several structurally different songs before considering a 500+ song rollout. Keep changes within interactive-notation beta until explicitly approved.
