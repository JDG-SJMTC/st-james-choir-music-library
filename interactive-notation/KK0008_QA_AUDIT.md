# KK 0008 — skill compliance audit (20 October 2026)

## Outcome: BLOCKED_FOR_TRANSCRIPTION_AND_ALIGNMENT_QA

This is a technical audit, **not** musical approval.

### Verified
- Production Manglish source contains 7 stanzas and 28 lyric lines.
- Locked Manglish transcription matched production character-for-character in the prior source QA.
- The original score has 3 musical staff systems.

### Release-blocking failures
1. **All seven stanzas have exactly 40 generated syllable slots.** This is a template interpolation, not an independently verified glyph-to-syllable mapping.
2. The positions occupy only three fixed y coordinates (390, 604, 817). These are not independently confirmed as printed Malayalam glyph-group anchors for each stanza.
3. No approved stanza-by-stanza musical system boundary transcript exists. Four lines of verse text cannot be treated as three musical systems without a validated mapping.
4. No independent Malayalam Unicode-to-score character audit exists. The source score uses legacy encoding/visual text.
5. No documented per-syllable anchor review, melisma mapping, overlap check or 200–300% visual QA exists.
6. The presentation used a full scanned sheet at small size, causing unreadable lyrics and collisions. Raising zoom alone does not fix this.
7. The separate lyrics panel and fixed 40-slot overlays departed from the approved KK 30/150 interaction expectations.

### Skill requirement versus current implementation
- **Skill:** Never interpolate unverified anchors. **Current:** fixed 40-slot estimated overlays. FAIL.
- **Skill:** Verify full bilingual system boundaries first. **Current:** missing. FAIL.
- **Skill:** Every displayed syllable has a verified Malayalam glyph anchor. **Current:** missing. FAIL.
- **Skill:** No silent truncation, collision or changed letters. **Current:** not demonstrated. FAIL.
- **Skill:** Preserve source notation and verified production Manglish. **Current:** source retained, production text locked. PARTIAL PASS.

### Remediation order
1. Derive complete stanza-by-stanza Malayalam/Manglish musical-system transcripts from approved source. Flag cross-system word splits.
2. Independently approve system boundaries, then syllabify each system without changing any source characters.
3. Locate/verify original Malayalam glyph groups and note/melisma association; do not use 40 uniform slots.
4. Render a responsive **full-width score view** with blue syllables immediately beneath corresponding printed glyphs, not an unrelated lower text panel.
5. Validate exact round-trip Manglish text, per-system syllable counts, anchor completeness, collisions, full staff visibility, stanza switching, and desktop/mobile screenshot comparisons.
6. Only then change status to QA_READY_FOR_CHOIR_REVIEW. Musical accuracy still requires choir sign-off.

### Publication state
KK 8 remains on beta as a **blocked engineering draft** with the original Malayalam score selected by default. No production-library files changed. KK 30/150 unchanged.

## Implementation update
- Shared fail-closed validator: `interactive-notation/notation-qa.js`.
- KK8 beta now runs this validator and reports failed release checks in its QA diagnostics.
- The validator deliberately does **not** infer staff boundaries or anchors; KK8 remains blocked until an independently checked musical-system transcript and glyph/note anchor data are supplied.
- KK30/150 are reference implementations, not proof of a generalised conversion engine. Their differing HTML implementations remain a consolidation task.

## Original skill source inspected (20 October 2026)
The local `sjmtc_skill_line_boundaries_v2/SKILL.md` explicitly requires full bilingual system transcripts **before rendering**, verified glyph bounding boxes, and user approval before website updates. Its `Tools` section refers to `render_verified.py`, but that file is **not present** in the extracted v2 skill directory. Therefore the documented workflow is not a complete executable conversion package. Reusing the skill requires recovering or implementing the renderer and its tests; a release validator alone cannot convert a score.

The v2 skill also warns that the KK30 stanza 2 Version 12 arrays are **not approved** (Malayalam/Manglish system boundary mismatch). Do not use that dataset as automatic training ground truth. KK30/150 interfaces may serve as UI references, not verified transcriptions.

## PDF/source preflight (resume)
- A reusable preflight CLI was added at `interactive-notation/tools/score_preflight.py` (requires PyMuPDF).
- Applied to the original KK-0008 PDF and the locked 7-stanza source manifest: all 7 SHA-256 stanza checks passed, covering 28 lines.
- PDF inspection confirmed one embedded raster score image (1729 × 1865 pixels) and legacy-encoded Malayalam text spans; extracted Malayalam cannot be trusted for glyph positioning.
- **Implication:** exact Malayalam glyph boxes and note/syllable associations are still unavailable. No musical alignment or render approval is claimed. Existing beta remains blocked; production unchanged.

## 21 October — phrase mapping workbench
- Added `interactive-notation/tools/kk8-phrase-workbench.html` with locked seven-stanza source, complete score reference, three explicit musical-system transcript fields and a fail-closed exact-source round-trip check.
- Integrated `tools/phrase-stretch.js` to show non-approved visual spacing proposals, without the fixed 40-slot mapping.
- Workbench exports draft mapping JSON, but no system boundaries or musical associations are automatically approved. No new KK8 choir score is published.
- Next required evidence: stanza 1 musical phrase boundary identification and manually verified note/lyric anchor mapping, then apply the same melody phrases to the other six stanzas.

## Seven-stanza layout preview (21 October 2026)
- Added `tools/kk8-seven-stanza-preview.html` as a standalone, clearly unverified seven-stanza engineering preview with stanza navigation, zoom and original score image.
- Preview renders locked production Manglish text for all seven stanzas. It distributes full word/whitespace tokens across the three score systems using a proportional draft based on stanza-one fragment counts; this is **not** musical alignment evidence.
- Exact text round-trip is checked at runtime. Musical system boundaries, note anchors, melismas, glyph overlay coordinates and visual collision checks remain unverified. The overlay must not be approved or linked as a production score.
- The previous `song-8/index.html` and production choir page remain unchanged.
